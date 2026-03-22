// sync.js — Evolu sync layer (opt-in, E2E encrypted)
// Stores importedData + profile metadata per profile as a JSON blob.
// Last-write-wins at the profile level — fine for single-user cross-device sync.

import { state } from './state.js';
import { showNotification, isDebugMode } from './utils.js';
import { profileStorageKey, getProfiles, saveProfiles, migrateProfileData } from './profile.js';
import { getEncryptionEnabled, encryptedSetItem, encryptedGetItem } from './crypto.js';

function dbg(...args) { if (isDebugMode()) console.log('[sync]', ...args); }

let evolu = null;
let profileQuery = null;
let _syncEnabled = false;
let _syncing = false;
let _pulling = false;
let _appOwner = null;
let _readyPromise = null;
let _queryLoaded = null;
let _debounceTimer = null;

// ═══════════════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════════════

const SYNC_STORAGE_KEY = 'labcharts-sync-enabled';
const SYNC_RELAY_KEY = 'labcharts-sync-relay';
const DEFAULT_RELAY = 'wss://sync.getbased.health';

export function isSyncEnabled() { return _syncEnabled; }

export function getSyncRelay() {
  return localStorage.getItem(SYNC_RELAY_KEY) || DEFAULT_RELAY;
}

export function setSyncRelay(url) {
  localStorage.setItem(SYNC_RELAY_KEY, url);
}

// Probe relay connectivity via a test WebSocket
export function checkRelayConnection(timeout = 4000) {
  return new Promise(resolve => {
    const relay = getSyncRelay();
    try {
      const ws = new WebSocket(relay + '/ping');
      const timer = setTimeout(() => { ws.close(); resolve(false); }, timeout);
      ws.onopen = () => { clearTimeout(timer); ws.close(); resolve(true); };
      ws.onerror = () => { clearTimeout(timer); ws.close(); resolve(false); };
    } catch { resolve(false); }
  });
}

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════

export async function initSync() {
  _syncEnabled = localStorage.getItem(SYNC_STORAGE_KEY) === 'true';
  if (!_syncEnabled) return;

  // Re-entrancy guard — don't create duplicate Evolu instances
  if (evolu) return;

  // Defer to next microtask — SharedWorker + navigator.locks can race during DOMContentLoaded
  await new Promise(r => setTimeout(r, 0));

  try {
    const { createEvolu, id, nullOr, SimpleName, NonEmptyString1000, NonEmptyString, evoluWebDeps } =
      await import('../vendor/evolu/evolu-bundle.js');

    const ProfileDataId = id("ProfileData");
    const Schema = {
      profileData: {
        id: ProfileDataId,
        profileId: NonEmptyString,
        dataJson: NonEmptyString,
        syncedAt: nullOr(NonEmptyString),
      },
    };

    const relay = getSyncRelay();
    evolu = createEvolu(evoluWebDeps)(Schema, {
      name: SimpleName.orThrow("getbased4"),
      reloadUrl: window.location.pathname,
      enableLogging: isDebugMode(),
      transport: { type: "WebSocket", url: relay },
    });

    // Query all profile data rows
    profileQuery = evolu.createQuery((db) =>
      db.selectFrom("profileData")
        .selectAll()
        .where("isDeleted", "is not", 1)
    );

    // Subscribe to sync updates
    evolu.subscribeQuery(profileQuery)(() => {
      if (!_syncing && !_pulling) onSyncReceived();
    });

    // Load initial data — store promise for enableSync to await
    _queryLoaded = evolu.loadQuery(profileQuery).then(() => {
      dbg('Initial query loaded');
    }).catch(e => {
      console.warn('[sync] Query load failed:', e);
    });

    // Wait for owner (mnemonic) — signals DB is ready
    _readyPromise = evolu.appOwner.then(owner => {
      _appOwner = owner;
      dbg('Owner resolved');
    }).catch(e => {
      console.warn('[sync] Owner resolution failed:', e);
    });

    // Debug helper — only in debug mode
    if (isDebugMode()) {
      window._syncDebug = {
        getRows: () => evolu.getQueryRows(profileQuery),
        getOwner: () => _appOwner,
        evolu,
      };
    }

    dbg('Initialized, relay:', relay);
  } catch (e) {
    console.error('[sync] Failed to initialize Evolu:', e);
    _syncEnabled = false;
  }
}

// ═══════════════════════════════════════════════
// ENABLE / DISABLE
// ═══════════════════════════════════════════════

export async function enableSync({ skipPush = false } = {}) {
  localStorage.setItem(SYNC_STORAGE_KEY, 'true');
  _syncEnabled = true;
  await initSync();
  if (evolu && _readyPromise) {
    await _readyPromise;
    if (_queryLoaded) await _queryLoaded;
    if (!skipPush) {
      await pushAllProfiles();
    }
    showNotification('Sync enabled', 'success');
  }
}

export async function disableSync() {
  // Wait for in-flight operations to finish
  if (_syncing || _pulling) {
    await new Promise(r => setTimeout(r, 500));
  }
  localStorage.setItem(SYNC_STORAGE_KEY, 'false');
  _syncEnabled = false;
  evolu = null;
  profileQuery = null;
  _appOwner = null;
  _readyPromise = null;
  _queryLoaded = null;
  clearTimeout(_debounceTimer);
  showNotification('Sync disabled', 'success');
}

// ═══════════════════════════════════════════════
// MNEMONIC (identity)
// ═══════════════════════════════════════════════

export function getMnemonic() {
  if (!_appOwner) return null;
  return _appOwner.mnemonic || null;
}

export async function restoreFromMnemonic(mnemonic) {
  if (!evolu) return false;
  try {
    await evolu.restoreAppOwner(mnemonic);
    // Clear sync timestamps only after successful restore
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.endsWith('-sync-ts')) localStorage.removeItem(key);
    }
    showNotification('Restored from mnemonic — reloading...', 'success');
    return true;
  } catch (e) {
    console.error('[sync] Restore failed:', e);
    showNotification('Invalid mnemonic', 'error');
    return false;
  }
}

// ═══════════════════════════════════════════════
// SYNC PAYLOAD — wraps importedData + profile meta
// ═══════════════════════════════════════════════

// AI settings keys to sync (global, not per-profile)
const AI_SETTINGS_KEYS = [
  'labcharts-ai-provider',
  'labcharts-api-key',           // Anthropic key (encrypted)
  'labcharts-openrouter-key',    // OpenRouter key (encrypted)
  'labcharts-venice-key',        // Venice key (encrypted)
  'labcharts-anthropic-model',
  'labcharts-openrouter-model',
  'labcharts-venice-model',
  'labcharts-venice-e2ee',
  'labcharts-ollama-model',
  'labcharts-ollama-pii-url',
  'labcharts-ollama-pii-model',
];

async function collectAISettings() {
  const settings = {};
  for (const key of AI_SETTINGS_KEYS) {
    const val = await encryptedGetItem(key);
    if (val) settings[key] = val;
  }
  return settings;
}

const ENCRYPTED_AI_KEYS = ['labcharts-api-key', 'labcharts-openrouter-key', 'labcharts-venice-key'];

async function applyAISettings(settings) {
  if (!settings) return;
  for (const [key, val] of Object.entries(settings)) {
    if (!AI_SETTINGS_KEYS.includes(key)) continue;
    if (typeof val !== 'string' || val.length > 10000) continue; // sanity check
    if (ENCRYPTED_AI_KEYS.includes(key)) {
      await encryptedSetItem(key, val);
    } else {
      localStorage.setItem(key, val);
    }
  }
}

async function buildSyncPayload(profileId, importedData) {
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === profileId);
  const aiSettings = await collectAISettings();
  return JSON.stringify({
    _v: 2,
    importedData,
    profile: profile || null,
    aiSettings: Object.keys(aiSettings).length > 0 ? aiSettings : undefined,
  });
}

function parseSyncPayload(dataJson) {
  if (typeof dataJson !== 'string' || dataJson.length > 50_000_000) {
    throw new Error('Invalid sync payload: bad type or too large');
  }
  const parsed = JSON.parse(dataJson);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Invalid sync payload');
  }
  // v2: wrapped payload with profile metadata + AI settings
  if (parsed._v === 2) {
    return { importedData: parsed.importedData, profile: parsed.profile, aiSettings: parsed.aiSettings };
  }
  // v1 compat: raw importedData (no profile metadata)
  return { importedData: parsed, profile: null, aiSettings: null };
}

// Allowed fields when merging a synced profile into the local profiles list
const PROFILE_MERGE_FIELDS = ['name', 'sex', 'dob', 'location', 'tags', 'archived', 'pinned', 'flagged', 'avatar', 'color'];

// ═══════════════════════════════════════════════
// PUSH — localStorage → Evolu
// ═══════════════════════════════════════════════

async function pushProfile(profileId, importedData) {
  if (!evolu || !_syncEnabled || _syncing) return;
  if (!profileId || typeof profileId !== 'string') return;
  _syncing = true;
  try {
    const dataJson = await buildSyncPayload(profileId, importedData);
    const syncedAt = new Date().toISOString();

    // Check if row exists for this profile
    const rows = evolu.getQueryRows(profileQuery);
    const existing = rows?.find(r => r.profileId === profileId);

    if (existing) {
      evolu.update("profileData", {
        id: existing.id,
        dataJson,
        syncedAt,
      });
    } else {
      evolu.insert("profileData", {
        profileId,
        dataJson,
        syncedAt,
      });
    }
    // Only update sync-ts after successful push
    localStorage.setItem(`labcharts-${profileId}-sync-ts`, String(Date.now()));
    dbg('Pushed:', profileId);
  } catch (e) {
    console.error('[sync] Push failed:', e);
  } finally {
    _syncing = false;
  }
}

export async function pushCurrentProfile() {
  await pushProfile(state.currentProfile, state.importedData);
}

// Push all profiles on first enable
async function pushAllProfiles() {
  const profiles = getProfiles();
  for (const p of profiles) {
    try {
      const storageKey = profileStorageKey(p.id, 'imported');
      let dataJson;
      if (p.id === state.currentProfile) {
        dataJson = state.importedData;
      } else {
        const raw = getEncryptionEnabled()
          ? await encryptedGetItem(storageKey)
          : localStorage.getItem(storageKey);
        if (!raw) continue;
        dataJson = JSON.parse(raw);
      }
      if (dataJson) await pushProfile(p.id, dataJson);
    } catch (e) {
      console.error('[sync] Push failed for profile:', p.id, e);
    }
  }
}

// ═══════════════════════════════════════════════
// PULL — Evolu → localStorage
// ═══════════════════════════════════════════════

async function onSyncReceived() {
  if (!evolu || !profileQuery || _pulling) return;
  _pulling = true;
  try {
    const rows = evolu.getQueryRows(profileQuery);
    if (!rows || rows.length === 0) return;

    let profilesChanged = false;
    let latestAiSettings = null;
    let latestAiTs = 0;

    for (const row of rows) {
      try {
        const profileId = row.profileId;
        if (!profileId || typeof profileId !== 'string') continue;
        const remoteUpdated = row.syncedAt ? new Date(row.syncedAt).getTime() : 0;

        // Check local timestamp
        const localKey = profileStorageKey(profileId, 'imported');
        const localMeta = localStorage.getItem(`labcharts-${profileId}-sync-ts`);
        const localUpdated = localMeta ? parseInt(localMeta, 10) : 0;

        if (remoteUpdated <= localUpdated) continue;

        // Remote is newer — parse payload
        const { importedData, profile, aiSettings } = parseSyncPayload(row.dataJson);

        // Track latest AI settings (apply once, from most recent row)
        if (aiSettings && remoteUpdated > latestAiTs) {
          latestAiSettings = aiSettings;
          latestAiTs = remoteUpdated;
        }

        // Validate importedData shape
        if (!importedData || typeof importedData !== 'object') continue;

        // Update importedData in localStorage
        const importedJson = JSON.stringify(importedData);
        if (getEncryptionEnabled()) {
          await encryptedSetItem(localKey, importedJson);
        } else {
          localStorage.setItem(localKey, importedJson);
        }
        localStorage.setItem(`labcharts-${profileId}-sync-ts`, String(remoteUpdated));

        // Merge profile into local profiles list (allowlisted fields only)
        if (profile && typeof profile === 'object') {
          const profiles = getProfiles();
          const idx = profiles.findIndex(p => p.id === profileId);
          if (idx >= 0) {
            const local = profiles[idx];
            for (const field of PROFILE_MERGE_FIELDS) {
              if (field in profile) local[field] = profile[field];
            }
            local.lastUpdated = Date.now();
          } else {
            // New profile — pick only allowed fields + id
            const newProfile = { id: profileId, lastUpdated: Date.now() };
            for (const field of PROFILE_MERGE_FIELDS) {
              if (field in profile) newProfile[field] = profile[field];
            }
            profiles.push(newProfile);
          }
          await saveProfiles(profiles);
          profilesChanged = true;
          dbg('Merged profile:', profileId, profile.name);
        }

        // If this is the active profile, update in-memory state
        if (profileId === state.currentProfile) {
          state.importedData = importedData;
          migrateProfileData(state.importedData);
          // Only auto-navigate if user is on the dashboard (don't interrupt other views)
          const activeNav = document.querySelector('.nav-item.active');
          if (!activeNav || activeNav.dataset.category === 'dashboard') {
            window.navigate?.('dashboard');
          } else {
            showNotification('Data updated from another device', 'success');
          }
          dbg('Pulled active profile:', profileId);
        } else {
          dbg('Pulled profile:', profileId);
        }
      } catch (e) {
        console.error('[sync] Pull failed for row:', e);
      }
    }

    // Apply AI settings once from the most recent row
    if (latestAiSettings) await applyAISettings(latestAiSettings);

    // Rebuild profile dropdown if profiles changed
    if (profilesChanged) {
      window.renderProfileDropdown?.();
    }
  } finally {
    _pulling = false;
  }
}

// ═══════════════════════════════════════════════
// HOOK — called from saveImportedData()
// ═══════════════════════════════════════════════

export function onDataSaved() {
  if (!_syncEnabled || !evolu) return;
  // Capture profile at schedule time, not fire time
  const profileId = state.currentProfile;
  const data = state.importedData;
  clearTimeout(_debounceTimer);
  _debounceTimer = setTimeout(() => {
    if (_syncing) {
      // Retry once after current push completes
      setTimeout(() => pushProfile(profileId, data), 1000);
    } else {
      pushProfile(profileId, data);
    }
  }, 2000);
}

// ═══════════════════════════════════════════════
// EXPORTS for window binding
// ═══════════════════════════════════════════════

Object.assign(window, {
  enableSync,
  disableSync,
  getMnemonic,
  restoreFromMnemonic,
  isSyncEnabled,
});
