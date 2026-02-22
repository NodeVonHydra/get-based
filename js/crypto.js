// crypto.js — Encryption at rest, backup/restore, cross-tab sync

import { state } from './state.js';
import { showNotification, showConfirmDialog, escapeHTML } from './utils.js';
import { profileStorageKey } from './profile.js';

// ═══════════════════════════════════════════════
// SENSITIVE KEY PATTERNS
// ═══════════════════════════════════════════════
const SENSITIVE_PATTERNS = [
  /^labcharts-[^-]+-imported$/,
  /^labcharts-[^-]+-chat$/,
  /^labcharts-[^-]+-chat-t_.+$/,
  /^labcharts-profiles$/
];

function isSensitiveKey(key) {
  return SENSITIVE_PATTERNS.some(p => p.test(key));
}

// ═══════════════════════════════════════════════
// KEY LIFECYCLE
// ═══════════════════════════════════════════════
let _sessionKey = null;
const PBKDF2_ITERATIONS = 600000;

export function getEncryptionEnabled() {
  return localStorage.getItem('labcharts-encryption-enabled') === 'true';
}

export function isUnlocked() {
  return _sessionKey !== null;
}

async function deriveKey(passphrase, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encrypt(key, plaintext) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  return { iv, ciphertext: new Uint8Array(ciphertext) };
}

async function decrypt(key, iv, ciphertext) {
  const dec = new TextDecoder();
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return dec.decode(plaintext);
}

function toBase64(arr) {
  return btoa(String.fromCharCode(...arr));
}

function fromBase64(str) {
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function isEncryptedValue(val) {
  return typeof val === 'string' && val.startsWith('v1:');
}

function parseEncryptedValue(val) {
  const parts = val.split(':');
  if (parts.length < 3 || parts[0] !== 'v1') return null;
  return { iv: fromBase64(parts[1]), ciphertext: fromBase64(parts.slice(2).join(':')) };
}

function formatEncryptedValue(iv, ciphertext) {
  return `v1:${toBase64(iv)}:${toBase64(ciphertext)}`;
}

// ═══════════════════════════════════════════════
// STORAGE WRAPPERS
// ═══════════════════════════════════════════════
export async function encryptedSetItem(key, value) {
  if (isSensitiveKey(key) && getEncryptionEnabled() && _sessionKey) {
    const { iv, ciphertext } = await encrypt(_sessionKey, value);
    localStorage.setItem(key, formatEncryptedValue(iv, ciphertext));
  } else {
    localStorage.setItem(key, value);
  }
}

export async function encryptedGetItem(key) {
  const raw = localStorage.getItem(key);
  if (raw === null) return null;
  if (isEncryptedValue(raw) && _sessionKey) {
    const parsed = parseEncryptedValue(raw);
    if (!parsed) return raw;
    try {
      return await decrypt(_sessionKey, parsed.iv, parsed.ciphertext);
    } catch {
      return null; // wrong key or corrupt
    }
  }
  return raw;
}

// ═══════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════
export async function initEncryption() {
  if (!getEncryptionEnabled()) return;
  return new Promise((resolve) => {
    showPassphraseModal(resolve);
  });
}

let _failCount = 0;

function showPassphraseModal(onSuccess) {
  let overlay = document.getElementById('passphrase-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'passphrase-overlay';
    overlay.className = 'passphrase-overlay';
    document.body.appendChild(overlay);
  }
  _failCount = 0;
  renderPassphraseForm(overlay, onSuccess);
}

function renderPassphraseForm(overlay, onSuccess) {
  overlay.innerHTML = `
    <div class="passphrase-dialog" role="dialog" aria-modal="true" aria-label="Enter passphrase">
      <div class="passphrase-icon">&#128274;</div>
      <h3 class="passphrase-title">Unlock Lab Charts</h3>
      <p class="passphrase-desc">Your data is encrypted. Enter your passphrase to continue.</p>
      <input type="password" class="passphrase-input" id="passphrase-unlock-input" placeholder="Passphrase" autocomplete="current-password" autofocus>
      <div class="passphrase-error" id="passphrase-error"></div>
      <button class="passphrase-btn passphrase-btn-primary" id="passphrase-unlock-btn">Unlock</button>
      <button class="passphrase-btn passphrase-btn-link" id="passphrase-forgot-btn">Forgot passphrase?</button>
    </div>`;
  overlay.style.display = 'flex';

  const input = document.getElementById('passphrase-unlock-input');
  const btn = document.getElementById('passphrase-unlock-btn');
  const errorEl = document.getElementById('passphrase-error');
  const forgotBtn = document.getElementById('passphrase-forgot-btn');

  async function attemptUnlock() {
    const passphrase = input.value;
    if (!passphrase) { errorEl.textContent = 'Please enter your passphrase'; return; }
    btn.disabled = true;
    btn.textContent = 'Decrypting...';
    errorEl.textContent = '';

    // Rate limit after 3 failures
    if (_failCount >= 3) {
      errorEl.textContent = 'Too many attempts. Please wait...';
      await new Promise(r => setTimeout(r, 5000));
      errorEl.textContent = '';
    }

    try {
      const saltHex = localStorage.getItem('labcharts-encryption-salt');
      if (!saltHex) throw new Error('No encryption salt found');
      const salt = fromBase64(saltHex);
      const key = await deriveKey(passphrase, salt);

      // Verify by trying to decrypt profiles
      const profilesRaw = localStorage.getItem('labcharts-profiles');
      if (profilesRaw && isEncryptedValue(profilesRaw)) {
        const parsed = parseEncryptedValue(profilesRaw);
        if (parsed) await decrypt(key, parsed.iv, parsed.ciphertext);
      }

      _sessionKey = key;
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      onSuccess();
    } catch {
      _failCount++;
      input.value = '';
      errorEl.textContent = `Wrong passphrase (attempt ${_failCount})`;
      btn.disabled = false;
      btn.textContent = 'Unlock';
      input.focus();
    }
  }

  btn.addEventListener('click', attemptUnlock);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptUnlock();
  });

  forgotBtn.addEventListener('click', () => {
    // Inline confirm inside the passphrase overlay (can't use showConfirmDialog — it's behind this z-index)
    const dialog = overlay.querySelector('.passphrase-dialog');
    dialog.innerHTML = `
      <div class="passphrase-icon">&#9888;&#65039;</div>
      <h3 class="passphrase-title">Erase All Data?</h3>
      <p class="passphrase-desc">If you forgot your passphrase, the only option is to <strong>erase all data</strong> and start fresh. This cannot be undone.</p>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="passphrase-btn passphrase-btn-secondary" id="passphrase-forgot-cancel">Go Back</button>
        <button class="passphrase-btn passphrase-btn-primary" id="passphrase-forgot-confirm" style="background:var(--red)">Erase Everything</button>
      </div>`;
    document.getElementById('passphrase-forgot-cancel').addEventListener('click', () => {
      renderPassphraseForm(overlay, onSuccess);
    });
    document.getElementById('passphrase-forgot-confirm').addEventListener('click', () => {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('labcharts')) keysToRemove.push(k);
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      _sessionKey = null;
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      location.reload();
    });
  });

  setTimeout(() => input.focus(), 50);
}

// ═══════════════════════════════════════════════
// ENABLE / DISABLE ENCRYPTION
// ═══════════════════════════════════════════════
export function showEnableEncryptionModal() {
  let overlay = document.getElementById('passphrase-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'passphrase-overlay';
    overlay.className = 'passphrase-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="passphrase-dialog" role="dialog" aria-modal="true" aria-label="Set encryption passphrase">
      <div class="passphrase-icon">&#128274;</div>
      <h3 class="passphrase-title">Enable Encryption</h3>
      <p class="passphrase-desc">Set a passphrase to encrypt your medical data at rest. <strong>If you forget this passphrase, your data cannot be recovered.</strong></p>
      <input type="password" class="passphrase-input" id="passphrase-set-input" placeholder="Enter passphrase" autocomplete="new-password" autofocus>
      <input type="password" class="passphrase-input" id="passphrase-confirm-input" placeholder="Confirm passphrase" autocomplete="new-password">
      <div class="passphrase-error" id="passphrase-set-error"></div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="passphrase-btn passphrase-btn-secondary" id="passphrase-set-cancel">Cancel</button>
        <button class="passphrase-btn passphrase-btn-primary" id="passphrase-set-btn">Enable Encryption</button>
      </div>
    </div>`;
  overlay.style.display = 'flex';

  const input1 = document.getElementById('passphrase-set-input');
  const input2 = document.getElementById('passphrase-confirm-input');
  const btn = document.getElementById('passphrase-set-btn');
  const cancelBtn = document.getElementById('passphrase-set-cancel');
  const errorEl = document.getElementById('passphrase-set-error');

  cancelBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  });

  btn.addEventListener('click', async () => {
    const p1 = input1.value;
    const p2 = input2.value;
    if (!p1) { errorEl.textContent = 'Please enter a passphrase'; return; }
    if (p1.length < 4) { errorEl.textContent = 'Passphrase must be at least 4 characters'; return; }
    if (p1 !== p2) { errorEl.textContent = 'Passphrases do not match'; return; }

    btn.disabled = true;
    btn.textContent = 'Encrypting...';
    errorEl.textContent = '';

    try {
      // Generate salt and derive key
      const salt = crypto.getRandomValues(new Uint8Array(16));
      localStorage.setItem('labcharts-encryption-salt', toBase64(salt));
      const key = await deriveKey(p1, salt);
      _sessionKey = key;

      // Migrate all sensitive keys: read plaintext, re-write encrypted
      await migrateSensitiveKeys();

      localStorage.setItem('labcharts-encryption-enabled', 'true');
      overlay.style.display = 'none';
      overlay.innerHTML = '';
      showNotification('Encryption enabled \u2014 keep your passphrase safe', 'success');
      // Refresh settings UI
      if (document.getElementById('encryption-section')) {
        document.getElementById('encryption-section').innerHTML = renderEncryptionSection();
      }
    } catch (err) {
      errorEl.textContent = 'Encryption failed: ' + err.message;
      btn.disabled = false;
      btn.textContent = 'Enable Encryption';
    }
  });

  input2.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btn.click();
  });

  setTimeout(() => input1.focus(), 50);
}

async function migrateSensitiveKeys() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !isSensitiveKey(key)) continue;
    const raw = localStorage.getItem(key);
    if (!raw || isEncryptedValue(raw)) continue; // already encrypted
    const { iv, ciphertext } = await encrypt(_sessionKey, raw);
    localStorage.setItem(key, formatEncryptedValue(iv, ciphertext));
  }
}

async function decryptAllSensitiveKeys() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !isSensitiveKey(key)) continue;
    const raw = localStorage.getItem(key);
    if (!raw || !isEncryptedValue(raw)) continue;
    const parsed = parseEncryptedValue(raw);
    if (!parsed) continue;
    try {
      const plaintext = await decrypt(_sessionKey, parsed.iv, parsed.ciphertext);
      localStorage.setItem(key, plaintext);
    } catch {
      // skip if can't decrypt
    }
  }
}

export async function disableEncryption() {
  showConfirmDialog('Disable encryption? Your data will be stored in plaintext.', async () => {
    try {
      await decryptAllSensitiveKeys();
      localStorage.removeItem('labcharts-encryption-enabled');
      localStorage.removeItem('labcharts-encryption-salt');
      _sessionKey = null;
      showNotification('Encryption disabled', 'info');
      if (document.getElementById('encryption-section')) {
        document.getElementById('encryption-section').innerHTML = renderEncryptionSection();
      }
    } catch (err) {
      showNotification('Failed to disable encryption: ' + err.message, 'error');
    }
  });
}

export async function changePassphrase() {
  let overlay = document.getElementById('passphrase-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'passphrase-overlay';
    overlay.className = 'passphrase-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="passphrase-dialog" role="dialog" aria-modal="true" aria-label="Change passphrase">
      <div class="passphrase-icon">&#128274;</div>
      <h3 class="passphrase-title">Change Passphrase</h3>
      <input type="password" class="passphrase-input" id="passphrase-old-input" placeholder="Current passphrase" autocomplete="current-password" autofocus>
      <input type="password" class="passphrase-input" id="passphrase-new1-input" placeholder="New passphrase" autocomplete="new-password">
      <input type="password" class="passphrase-input" id="passphrase-new2-input" placeholder="Confirm new passphrase" autocomplete="new-password">
      <div class="passphrase-error" id="passphrase-change-error"></div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="passphrase-btn passphrase-btn-secondary" id="passphrase-change-cancel">Cancel</button>
        <button class="passphrase-btn passphrase-btn-primary" id="passphrase-change-btn">Change Passphrase</button>
      </div>
    </div>`;
  overlay.style.display = 'flex';

  const oldInput = document.getElementById('passphrase-old-input');
  const new1Input = document.getElementById('passphrase-new1-input');
  const new2Input = document.getElementById('passphrase-new2-input');
  const btn = document.getElementById('passphrase-change-btn');
  const cancelBtn = document.getElementById('passphrase-change-cancel');
  const errorEl = document.getElementById('passphrase-change-error');

  cancelBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  });

  btn.addEventListener('click', async () => {
    const oldP = oldInput.value;
    const newP = new1Input.value;
    const newP2 = new2Input.value;
    if (!oldP) { errorEl.textContent = 'Enter current passphrase'; return; }
    if (!newP || newP.length < 4) { errorEl.textContent = 'New passphrase must be at least 4 characters'; return; }
    if (newP !== newP2) { errorEl.textContent = 'New passphrases do not match'; return; }

    btn.disabled = true;
    btn.textContent = 'Changing...';
    errorEl.textContent = '';

    try {
      // Verify old passphrase
      const oldSalt = fromBase64(localStorage.getItem('labcharts-encryption-salt'));
      const oldKey = await deriveKey(oldP, oldSalt);

      // Test decryption with old key
      const profilesRaw = localStorage.getItem('labcharts-profiles');
      if (profilesRaw && isEncryptedValue(profilesRaw)) {
        const parsed = parseEncryptedValue(profilesRaw);
        if (parsed) await decrypt(oldKey, parsed.iv, parsed.ciphertext);
      }

      // Decrypt all with old key
      _sessionKey = oldKey;
      await decryptAllSensitiveKeys();

      // Re-encrypt with new key
      const newSalt = crypto.getRandomValues(new Uint8Array(16));
      localStorage.setItem('labcharts-encryption-salt', toBase64(newSalt));
      const newKey = await deriveKey(newP, newSalt);
      _sessionKey = newKey;
      await migrateSensitiveKeys();

      overlay.style.display = 'none';
      overlay.innerHTML = '';
      showNotification('Passphrase changed successfully', 'success');
    } catch {
      errorEl.textContent = 'Current passphrase is incorrect';
      btn.disabled = false;
      btn.textContent = 'Change Passphrase';
    }
  });

  setTimeout(() => oldInput.focus(), 50);
}

// ═══════════════════════════════════════════════
// BACKUP / RESTORE
// ═══════════════════════════════════════════════
const GLOBAL_SETTINGS_KEYS = [
  'labcharts-api-key', 'labcharts-venice-key', 'labcharts-openrouter-key', 'labcharts-ai-provider',
  'labcharts-anthropic-model', 'labcharts-venice-model', 'labcharts-openrouter-model',
  'labcharts-ollama', 'labcharts-ollama-model',
  'labcharts-ollama-pii-url', 'labcharts-ollama-pii-model',
  'labcharts-time-format', 'labcharts-theme', 'labcharts-debug',
  'labcharts-active-profile'
];

const PER_PROFILE_PREF_SUFFIXES = [
  'units', 'rangeMode', 'suppOverlay', 'noteOverlay', 'phaseOverlay',
  'chatPersonality', 'chatPersonalityCustom', 'chatRailOpen'
];

export function buildBackupSnapshot() {
  const profiles = localStorage.getItem('labcharts-profiles');
  if (!profiles) return null;

  let profileList;
  try {
    profileList = JSON.parse(isEncryptedValue(profiles) ? '[]' : profiles);
  } catch {
    profileList = [];
  }

  const backupProfiles = [];
  if (profileList.length > 0) {
    for (const p of profileList) {
      const keys = {};
      const imported = localStorage.getItem(profileStorageKey(p.id, 'imported'));
      if (imported) keys.imported = imported;
      const chat = localStorage.getItem(`labcharts-${p.id}-chat`);
      if (chat) keys.chat = chat;
      const threadIndex = localStorage.getItem(`labcharts-${p.id}-chat-threads`);
      if (threadIndex) {
        keys['chat-threads'] = threadIndex;
        try {
          const threads = JSON.parse(threadIndex);
          for (const t of threads) {
            const tk = `labcharts-${p.id}-chat-t_${t.id}`;
            const tv = localStorage.getItem(tk);
            if (tv !== null) keys[`chat-t_${t.id}`] = tv;
          }
        } catch {}
      }
      for (const suffix of PER_PROFILE_PREF_SUFFIXES) {
        const v = localStorage.getItem(`labcharts-${p.id}-${suffix}`);
        if (v !== null) keys[suffix] = v;
      }
      backupProfiles.push({ profileId: p.id, name: p.name, keys });
    }
  } else {
    const profileIds = new Set();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const match = key && key.match(/^labcharts-([^-]+)-imported$/);
      if (match) profileIds.add(match[1]);
    }
    for (const pid of profileIds) {
      const keys = {};
      const imported = localStorage.getItem(profileStorageKey(pid, 'imported'));
      if (imported) keys.imported = imported;
      const chat = localStorage.getItem(`labcharts-${pid}-chat`);
      if (chat) keys.chat = chat;
      const threadIndex = localStorage.getItem(`labcharts-${pid}-chat-threads`);
      if (threadIndex) {
        keys['chat-threads'] = threadIndex;
        try {
          const threads = JSON.parse(threadIndex);
          for (const t of threads) {
            const tk = `labcharts-${pid}-chat-t_${t.id}`;
            const tv = localStorage.getItem(tk);
            if (tv !== null) keys[`chat-t_${t.id}`] = tv;
          }
        } catch {}
      }
      for (const suffix of PER_PROFILE_PREF_SUFFIXES) {
        const v = localStorage.getItem(`labcharts-${pid}-${suffix}`);
        if (v !== null) keys[suffix] = v;
      }
      backupProfiles.push({ profileId: pid, name: pid, keys });
    }
  }

  const settings = {};
  for (const k of GLOBAL_SETTINGS_KEYS) {
    const v = localStorage.getItem(k);
    if (v !== null) settings[k] = v;
  }

  return {
    format: 'labcharts-backup',
    version: 1,
    createdAt: new Date().toISOString(),
    encrypted: getEncryptionEnabled(),
    encryptionSalt: localStorage.getItem('labcharts-encryption-salt') || null,
    settings,
    profileList: profiles,
    profiles: backupProfiles
  };
}

export function exportEncryptedBackup() {
  const backup = buildBackupSnapshot();
  if (!backup) {
    showNotification('No data to back up', 'error');
    return;
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `labcharts-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification('Backup exported successfully', 'success');
}

export function importEncryptedBackup(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const backup = JSON.parse(e.target.result);
      if (backup.format !== 'labcharts-backup' || !backup.profileList) {
        showNotification('Invalid backup file format', 'error');
        return;
      }

      const profileCount = backup.profiles ? backup.profiles.length : 0;
      const encMsg = backup.encrypted ? ' This backup is encrypted \u2014 you\'ll need the same passphrase.' : '';

      showConfirmDialog(
        `Restore backup from ${new Date(backup.createdAt).toLocaleDateString()}? This will overwrite ${profileCount} profile(s).${encMsg}`,
        () => {
          // Restore encryption metadata first (so initEncryption triggers on reload)
          if (backup.encrypted && backup.encryptionSalt) {
            localStorage.setItem('labcharts-encryption-enabled', 'true');
            localStorage.setItem('labcharts-encryption-salt', backup.encryptionSalt);
          } else {
            localStorage.removeItem('labcharts-encryption-enabled');
            localStorage.removeItem('labcharts-encryption-salt');
          }

          // Restore global settings (API keys, provider, display prefs)
          if (backup.settings && typeof backup.settings === 'object') {
            for (const [k, v] of Object.entries(backup.settings)) {
              localStorage.setItem(k, v);
            }
          }

          // Restore profile list
          localStorage.setItem('labcharts-profiles', backup.profileList);

          // Restore per-profile keys
          if (backup.profiles) {
            for (const p of backup.profiles) {
              for (const [suffix, value] of Object.entries(p.keys)) {
                localStorage.setItem(`labcharts-${p.profileId}-${suffix}`, value);
              }
            }
          }

          showNotification('Backup restored \u2014 reloading...', 'success');
          setTimeout(() => location.reload(), 1000);
        }
      );
    } catch (err) {
      showNotification('Error reading backup: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// ═══════════════════════════════════════════════
// AUTO-BACKUP (IndexedDB)
// ═══════════════════════════════════════════════
const BACKUP_DB_NAME = 'labcharts-backups';
const BACKUP_STORE = 'snapshots';
const MAX_SNAPSHOTS = 5;
const AUTO_BACKUP_COOLDOWN = 10000;
let _autoBackupTimer = null;
let _dbPromise = null;

export function openBackupDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(BACKUP_DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(BACKUP_STORE)) {
        db.createObjectStore(BACKUP_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => { _dbPromise = null; reject(req.error); };
  });
  return _dbPromise;
}

async function performAutoBackup() {
  try {
    const snapshot = buildBackupSnapshot();
    if (!snapshot) return;
    const db = await openBackupDB();
    const tx = db.transaction(BACKUP_STORE, 'readwrite');
    const store = tx.objectStore(BACKUP_STORE);
    store.add({ createdAt: snapshot.createdAt, encrypted: snapshot.encrypted, snapshot });
    await new Promise((resolve, reject) => { tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); });

    // Prune: keep only newest MAX_SNAPSHOTS
    const tx2 = db.transaction(BACKUP_STORE, 'readwrite');
    const store2 = tx2.objectStore(BACKUP_STORE);
    const countReq = store2.count();
    countReq.onsuccess = () => {
      const total = countReq.result;
      if (total > MAX_SNAPSHOTS) {
        const cursorReq = store2.openCursor();
        let deleted = 0;
        const toDelete = total - MAX_SNAPSHOTS;
        cursorReq.onsuccess = () => {
          const cursor = cursorReq.result;
          if (cursor && deleted < toDelete) {
            cursor.delete();
            deleted++;
            cursor.continue();
          }
        };
      }
    };
    await new Promise((resolve) => { tx2.oncomplete = resolve; tx2.onerror = resolve; });
    localStorage.setItem('labcharts-last-autobackup', snapshot.createdAt);
    showNotification('Auto-backup saved', 'info', 2000);
  } catch { /* silent — auto-backup is best-effort */ }
}

export function scheduleAutoBackup() {
  if (_autoBackupTimer) return;
  _autoBackupTimer = setTimeout(async () => {
    _autoBackupTimer = null;
    await performAutoBackup();
  }, AUTO_BACKUP_COOLDOWN);
}

export async function getAutoBackupSnapshots() {
  try {
    const db = await openBackupDB();
    const tx = db.transaction(BACKUP_STORE, 'readonly');
    const store = tx.objectStore(BACKUP_STORE);
    const req = store.getAll();
    return new Promise((resolve) => {
      req.onsuccess = () => resolve((req.result || []).reverse());
      req.onerror = () => resolve([]);
    });
  } catch { return []; }
}

export async function restoreAutoBackup(id) {
  const db = await openBackupDB();
  const tx = db.transaction(BACKUP_STORE, 'readonly');
  const store = tx.objectStore(BACKUP_STORE);
  const req = store.get(id);
  const record = await new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  if (!record || !record.snapshot) {
    showNotification('Snapshot not found', 'error');
    return;
  }
  const backup = record.snapshot;

  showConfirmDialog(
    `Restore auto-backup from ${new Date(backup.createdAt).toLocaleString()}? This will overwrite all current data.`,
    () => {
      if (backup.encrypted && backup.encryptionSalt) {
        localStorage.setItem('labcharts-encryption-enabled', 'true');
        localStorage.setItem('labcharts-encryption-salt', backup.encryptionSalt);
      } else {
        localStorage.removeItem('labcharts-encryption-enabled');
        localStorage.removeItem('labcharts-encryption-salt');
      }
      if (backup.settings && typeof backup.settings === 'object') {
        for (const [k, v] of Object.entries(backup.settings)) {
          localStorage.setItem(k, v);
        }
      }
      localStorage.setItem('labcharts-profiles', backup.profileList);
      if (backup.profiles) {
        for (const p of backup.profiles) {
          for (const [suffix, value] of Object.entries(p.keys)) {
            localStorage.setItem(`labcharts-${p.profileId}-${suffix}`, value);
          }
        }
      }
      showNotification('Backup restored \u2014 reloading...', 'success');
      setTimeout(() => location.reload(), 1000);
    }
  );
}

// ═══════════════════════════════════════════════
// CROSS-TAB SYNC (BroadcastChannel)
// ═══════════════════════════════════════════════
let _bc = null;

export function initBroadcastChannel() {
  if (typeof BroadcastChannel === 'undefined') return;
  _bc = new BroadcastChannel('labcharts-sync');
  _bc.onmessage = async (event) => {
    const { type, profileId } = event.data || {};
    if (type === 'data-changed' && profileId === state.currentProfile) {
      // Re-read from localStorage and re-render
      const raw = await encryptedGetItem(profileStorageKey(profileId, 'imported'));
      if (raw) {
        try {
          state.importedData = JSON.parse(raw);
          if (!state.importedData.notes) state.importedData.notes = [];
          if (!state.importedData.supplements) state.importedData.supplements = [];
          window.migrateProfileData(state.importedData);
          window.buildSidebar();
          const activeNav = document.querySelector('.nav-item.active');
          window.navigate(activeNav ? activeNav.dataset.category : 'dashboard');
        } catch { /* ignore parse errors */ }
      }
    }
  };
}

export function broadcastDataChanged(profileId) {
  if (_bc) {
    _bc.postMessage({ type: 'data-changed', profileId });
  }
}

// ═══════════════════════════════════════════════
// SETTINGS UI — SECURITY SECTION
// ═══════════════════════════════════════════════
export function renderEncryptionSection() {
  const enabled = getEncryptionEnabled();
  if (enabled) {
    return `<div class="encryption-status-card encryption-status-on">
      <div class="encryption-status-icon">&#128274;</div>
      <div class="encryption-status-body">
        <div class="encryption-status-title">Encryption is ON</div>
        <div class="encryption-status-detail">Your medical data and chat history are encrypted with AES-256-GCM. API keys and display preferences remain unencrypted.</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
      <button class="import-btn import-btn-secondary" onclick="changePassphrase()">Change Passphrase</button>
      <button class="import-btn import-btn-secondary" onclick="disableEncryption()">Disable Encryption</button>
    </div>`;
  }
  return `<div class="encryption-status-card encryption-status-off">
    <div class="encryption-status-icon">&#128275;</div>
    <div class="encryption-status-body">
      <div class="encryption-status-title">Encryption is OFF</div>
      <div class="encryption-status-detail">Your data is stored as plaintext in localStorage. Browser extensions and anyone with filesystem access can read it.</div>
    </div>
  </div>
  <button class="import-btn import-btn-primary" style="margin-top:12px" onclick="showEnableEncryptionModal()">Enable Encryption</button>`;
}

export function renderBackupSection() {
  const lastAuto = localStorage.getItem('labcharts-last-autobackup');
  const autoStatus = lastAuto
    ? `Last auto-backup: ${new Date(lastAuto).toLocaleString()}`
    : 'No auto-backups yet';
  return `<div class="ai-provider-desc" style="margin-bottom:10px">Create a full backup of all profiles, data, and chat history. ${getEncryptionEnabled() ? 'Backups inherit encryption \u2014 same passphrase required to restore.' : 'Backups are unencrypted unless encryption is enabled.'}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="import-btn import-btn-primary" onclick="exportEncryptedBackup()">Download Backup</button>
    <label class="import-btn import-btn-secondary" style="cursor:pointer;display:inline-flex;align-items:center">
      Restore Backup
      <input type="file" accept=".json" style="display:none" onchange="if(this.files[0])importEncryptedBackup(this.files[0])">
    </label>
  </div>
  <div class="backup-auto-status">${escapeHTML(autoStatus)}</div>
  <div class="backup-snapshots-toggle" onclick="toggleBackupSnapshots()" id="backup-snapshots-toggle" style="display:none">
    <span class="privacy-configure-arrow" id="backup-snapshots-arrow">&#9654;</span>
    Recent snapshots
  </div>
  <div class="backup-snapshot-list" id="backup-snapshot-list" style="display:none"></div>`;
}

export async function loadBackupSnapshots() {
  const list = document.getElementById('backup-snapshot-list');
  const toggle = document.getElementById('backup-snapshots-toggle');
  if (!list) return;
  const snapshots = await getAutoBackupSnapshots();
  if (snapshots.length === 0) {
    if (toggle) toggle.style.display = 'none';
    list.style.display = 'none';
    return;
  }
  if (toggle) toggle.style.display = '';
  const shown = snapshots.slice(0, MAX_SNAPSHOTS);
  list.innerHTML = shown.map(s => {
    const date = new Date(s.createdAt).toLocaleString();
    const profileCount = (s.snapshot && s.snapshot.profiles) ? s.snapshot.profiles.length : '?';
    return `<div class="backup-snapshot-item">
      <div class="backup-snapshot-info">
        <span class="backup-snapshot-date">${escapeHTML(date)}</span>
        <span class="backup-snapshot-meta">${profileCount} profile(s)${s.encrypted ? ' \u2022 encrypted' : ''}</span>
      </div>
      <button class="import-btn import-btn-secondary" style="padding:4px 10px;font-size:12px" onclick="restoreAutoBackup(${s.id})">Restore</button>
    </div>`;
  }).join('');
}

export function toggleBackupSnapshots() {
  const list = document.getElementById('backup-snapshot-list');
  const arrow = document.getElementById('backup-snapshots-arrow');
  if (!list) return;
  const open = list.style.display !== 'none';
  list.style.display = open ? 'none' : 'flex';
  if (arrow) arrow.innerHTML = open ? '&#9654;' : '&#9660;';
}

// ═══════════════════════════════════════════════
// WINDOW EXPORTS
// ═══════════════════════════════════════════════
Object.assign(window, {
  initEncryption,
  initBroadcastChannel,
  getEncryptionEnabled,
  isUnlocked,
  encryptedSetItem,
  encryptedGetItem,
  showEnableEncryptionModal,
  disableEncryption,
  changePassphrase,
  exportEncryptedBackup,
  importEncryptedBackup,
  broadcastDataChanged,
  renderEncryptionSection,
  renderBackupSection,
  isSensitiveKey,
  buildBackupSnapshot,
  scheduleAutoBackup,
  getAutoBackupSnapshots,
  restoreAutoBackup,
  openBackupDB,
  loadBackupSnapshots,
  toggleBackupSnapshots,
});
