// profile.js — Profile CRUD, sex/DOB, location, data migration

import { state } from './state.js';
import { SPECIALTY_MARKER_DEFS } from './schema.js';
import { COUNTRY_LATITUDES, LATITUDE_BANDS } from './constants.js';
import { showNotification } from './utils.js';
import { encryptedSetItem, encryptedGetItem, getEncryptionEnabled } from './crypto.js';

// ═══════════════════════════════════════════════
// PROFILE MANAGEMENT
// ═══════════════════════════════════════════════
export function getProfiles() {
  // Read from in-memory cache (populated at init via initProfilesCache)
  if (state.profiles) return state.profiles;
  try { return JSON.parse(localStorage.getItem('labcharts-profiles')) || []; }
  catch(e) { return []; }
}

export async function initProfilesCache() {
  const raw = await encryptedGetItem('labcharts-profiles');
  try { state.profiles = raw ? JSON.parse(raw) : []; }
  catch(e) { state.profiles = []; }
}

export async function saveProfiles(profiles) {
  state.profiles = profiles;
  try {
    const value = JSON.stringify(profiles);
    if (getEncryptionEnabled()) {
      await encryptedSetItem('labcharts-profiles', value);
    } else {
      localStorage.setItem('labcharts-profiles', value);
    }
  } catch (e) {
    showNotification('Storage limit reached — could not save profile changes.', 'error');
  }
}

export function getActiveProfileId() {
  return localStorage.getItem('labcharts-active-profile') || 'default';
}

export function setActiveProfileId(id) {
  localStorage.setItem('labcharts-active-profile', id);
}

export function profileStorageKey(profileId, suffix) {
  return `labcharts-${profileId}-${suffix}`;
}

export function migrateProfileData(data) {
  // Migrate sleepCircadian → sleepRest (sleep fields go to sleepRest, circadian items to lightCircadian)
  if (data.sleepCircadian && !data.sleepRest) {
    const sc = data.sleepCircadian;
    if (typeof sc === 'string') {
      data.sleepRest = sc.trim() ? { duration: null, quality: null, schedule: null, issues: [], note: sc.trim() } : null;
    } else if (typeof sc === 'object') {
      const sleepIssues = (sc.issues || []).filter(i => !['blue light blockers', 'morning sunlight'].includes(i));
      const circadianPractices = (sc.issues || []).filter(i => ['blue light blockers', 'morning sunlight'].includes(i));
      data.sleepRest = { duration: sc.duration || null, quality: sc.quality || null, schedule: sc.schedule || null, issues: sleepIssues, note: sc.note || '' };
      if (circadianPractices.length && !data.lightCircadian) {
        data.lightCircadian = { practices: circadianPractices, timing: null, mealTiming: [], note: '' };
      }
    }
  }
  delete data.sleepCircadian;
  // Merge old circadian + sleep strings → sleepRest (very old legacy)
  if (!data.sleepRest) {
    const parts = [data.circadian, data.sleep].filter(s => s && s.trim());
    if (parts.length) data.sleepRest = { duration: null, quality: null, schedule: null, issues: [], note: parts.join('\n\n') };
  }
  delete data.circadian;
  delete data.sleep;
  // Merge fieldExperts + fieldLens → interpretiveLens
  if (!data.interpretiveLens) {
    const parts = [data.fieldExperts, data.fieldLens].filter(s => s && s.trim());
    if (parts.length) data.interpretiveLens = parts.join('\n\n');
  }
  delete data.fieldExperts;
  delete data.fieldLens;
  // Migrate string fields → structured objects
  if (typeof data.diagnoses === 'string') {
    data.diagnoses = data.diagnoses.trim() ? { conditions: [], note: data.diagnoses.trim() } : null;
  }
  if (typeof data.diet === 'string') {
    data.diet = data.diet.trim() ? { type: null, restrictions: [], pattern: null, note: data.diet.trim() } : null;
  }
  if (typeof data.exercise === 'string') {
    data.exercise = data.exercise.trim() ? { frequency: null, types: [], intensity: null, dailyMovement: null, note: data.exercise.trim() } : null;
  }
  if (typeof data.sleepRest === 'string') {
    data.sleepRest = data.sleepRest.trim() ? { duration: null, quality: null, schedule: null, issues: [], note: data.sleepRest.trim() } : null;
  }
  // Migrate old lightCircadian format (had practices/timing) → new format (amLight/daytime/uvExposure/evening/cold/grounding/latitude)
  if (data.lightCircadian && data.lightCircadian.timing && !data.lightCircadian.amLight) {
    const old = data.lightCircadian;
    const newLc = { amLight: null, daytime: null, uvExposure: null, evening: [], cold: null, grounding: null, latitude: null, mealTiming: old.mealTiming || [], note: old.note || '' };
    if (old.practices && old.practices.length) {
      for (const p of old.practices) {
        if (p === 'morning sunlight') newLc.amLight = 'morning outdoor (after sunrise)';
        else if (p === 'blue light blockers') newLc.evening.push('blue blockers after sunset');
        else if (p === 'no screens before bed') newLc.evening.push('no screens 1-2h before bed');
        else if (p === 'red light therapy') { if (!newLc.note) newLc.note = p; else newLc.note += ', ' + p; }
        else if (p === 'UVB exposure') newLc.uvExposure = 'UVB lamp';
        else if (p === 'light therapy lamp') { if (!newLc.amLight) newLc.amLight = 'light therapy lamp'; }
        else if (p === 'blackout curtains') { /* moved to sleep environment */ }
      }
    }
    data.lightCircadian = newLc;
  }
  // Migrate hardcoded specialty markers to customMarkers
  if (data.entries?.length) {
    const usedSpecialtyKeys = new Set();
    for (const entry of data.entries) {
      for (const key of Object.keys(entry.markers || {})) {
        if (SPECIALTY_MARKER_DEFS[key]) usedSpecialtyKeys.add(key);
      }
    }
    if (!data.customMarkers) data.customMarkers = {};
    for (const key of usedSpecialtyKeys) {
      if (!data.customMarkers[key]) {
        const def = SPECIALTY_MARKER_DEFS[key];
        data.customMarkers[key] = {
          name: def.name, unit: def.unit,
          refMin: def.refMin, refMax: def.refMax,
          categoryLabel: def.categoryLabel, icon: def.icon,
          group: def.group || null
        };
      }
    }
  }
  // Backfill group for existing customMarkers missing it
  if (data.customMarkers) {
    for (const [key, cm] of Object.entries(data.customMarkers)) {
      if (cm.group === undefined && SPECIALTY_MARKER_DEFS[key]) {
        cm.group = SPECIALTY_MARKER_DEFS[key].group || null;
      }
    }
  }
  // Initialize new fields if missing
  if (data.healthGoals === undefined) data.healthGoals = [];
  if (data.sleepRest === undefined) data.sleepRest = null;
  if (data.lightCircadian === undefined) data.lightCircadian = null;
  if (data.stress === undefined) data.stress = null;
  if (data.loveLife === undefined) data.loveLife = null;
  if (data.environment === undefined) data.environment = null;
  if (data.interpretiveLens === undefined) data.interpretiveLens = '';
  if (data.contextNotes === undefined) data.contextNotes = '';
  if (data.customMarkers === undefined) data.customMarkers = {};
  if (data.menstrualCycle === undefined) data.menstrualCycle = null;
  return data;
}

export async function loadProfile(profileId) {
  state.currentProfile = profileId;
  setActiveProfileId(profileId);
  const savedImported = await encryptedGetItem(profileStorageKey(profileId, 'imported'));
  const defaultData = { entries: [], notes: [], supplements: [], healthGoals: [], diagnoses: null, diet: null, exercise: null, sleepRest: null, lightCircadian: null, stress: null, loveLife: null, environment: null, interpretiveLens: '', contextNotes: '', menstrualCycle: null, customMarkers: {} };
  state.importedData = savedImported ? (function() { try { const d = JSON.parse(savedImported); if (!d.notes) d.notes = []; if (!d.supplements) d.supplements = []; return migrateProfileData(d); } catch(e) { return defaultData; } })() : defaultData;
  const savedUnits = localStorage.getItem(profileStorageKey(profileId, 'units'));
  state.unitSystem = savedUnits === 'US' ? 'US' : 'EU';
  const savedRange = localStorage.getItem(profileStorageKey(profileId, 'rangeMode'));
  state.rangeMode = savedRange === 'reference' ? 'reference' : savedRange === 'both' ? 'both' : 'optimal';
  const savedSuppOverlay = localStorage.getItem(profileStorageKey(profileId, 'suppOverlay'));
  state.suppOverlayMode = savedSuppOverlay === 'on' ? 'on' : 'off';
  const savedNoteOverlay = localStorage.getItem(profileStorageKey(profileId, 'noteOverlay'));
  state.noteOverlayMode = savedNoteOverlay === 'on' ? 'on' : 'off';
  const savedPhaseOverlay = localStorage.getItem(profileStorageKey(profileId, 'phaseOverlay'));
  state.phaseOverlayMode = savedPhaseOverlay === 'on' ? 'on' : 'off';
  state.profileSex = getProfileSex(profileId);
  state.profileDob = getProfileDob(profileId);
  state.selectedCorrelationMarkers = [];
  state.chatHistory = [];
  state.chatThreads = [];
  state.currentThreadId = null;
  state.markerRegistry = {};
  window.loadChatPersonality();
  window.destroyAllCharts();
  window.buildSidebar();
  window.showDashboard();
  window.updateHeaderDates();
  window.updateHeaderRangeToggle();
  window.renderProfileDropdown();
}

export function createProfile(name) {
  const profiles = getProfiles();
  const id = Date.now().toString(36);
  profiles.push({ id, name });
  saveProfiles(profiles);
  return id;
}

export function renameProfile(profileId, newName) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  if (p) { p.name = newName; saveProfiles(profiles); }
}

export function deleteProfile(profileId) {
  const profiles = getProfiles();
  if (profiles.length <= 1) { showNotification("Cannot delete the last profile", "error"); return; }
  window.showConfirmDialog('Delete this profile and all its data? This cannot be undone.', () => {
    const updated = profiles.filter(p => p.id !== profileId);
    saveProfiles(updated);
    localStorage.removeItem(profileStorageKey(profileId, 'imported'));
    localStorage.removeItem(profileStorageKey(profileId, 'units'));
    localStorage.removeItem(profileStorageKey(profileId, 'suppOverlay'));
    localStorage.removeItem(profileStorageKey(profileId, 'noteOverlay'));
    localStorage.removeItem(profileStorageKey(profileId, 'rangeMode'));
    localStorage.removeItem(`labcharts-${profileId}-chat`);
    // Remove thread index + all per-thread message keys
    const threadIndexRaw = localStorage.getItem(`labcharts-${profileId}-chat-threads`);
    if (threadIndexRaw) {
      try {
        const threads = JSON.parse(threadIndexRaw);
        for (const t of threads) {
          localStorage.removeItem(`labcharts-${profileId}-chat-t_${t.id}`);
        }
      } catch {}
      localStorage.removeItem(`labcharts-${profileId}-chat-threads`);
    }
    localStorage.removeItem(`labcharts-${profileId}-chatRailOpen`);
    localStorage.removeItem(`labcharts-${profileId}-chatPersonality`);
    localStorage.removeItem(`labcharts-${profileId}-chatPersonalityCustom`);
    localStorage.removeItem(`labcharts-${profileId}-focusCard`);
    localStorage.removeItem(`labcharts-${profileId}-contextHealth`);
    localStorage.removeItem(`labcharts-${profileId}-onboarded`);
    localStorage.removeItem(`labcharts-${profileId}-tour`);
    localStorage.removeItem(`labcharts-${profileId}-cycleTour`);
    localStorage.removeItem(`labcharts-${profileId}-phaseOverlay`);
    if (state.currentProfile === profileId) {
      loadProfile(updated[0].id);
    } else {
      window.renderProfileDropdown();
    }
    showNotification('Profile deleted', 'info');
  });
}

export function switchProfile(profileId) {
  if (profileId === state.currentProfile) return;
  loadProfile(profileId);
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  showNotification(`Switched to ${p ? p.name : 'profile'}`, 'info');
}

export function getProfileSex(profileId) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  return (p && p.sex) || null;
}

export function setProfileSex(profileId, sex) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  if (p) { p.sex = sex; saveProfiles(profiles); }
}

export function switchSex(sex) {
  state.profileSex = sex;
  setProfileSex(state.currentProfile, sex);
  const data = window.getActiveData();
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  window.buildSidebar(data);
  window.updateHeaderDates(data);
  window.navigate(activeCat, data);
}

export function getProfileDob(profileId) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  return (p && p.dob) || null;
}

export function setProfileDob(profileId, dob) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  if (p) { p.dob = dob || null; saveProfiles(profiles); }
}

export function getProfileLocation(profileId) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === (profileId || state.currentProfile));
  return (p && p.location) || { country: '', zip: '' };
}

export function setProfileLocation(profileId, country, zip) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === (profileId || state.currentProfile));
  if (p) { p.location = { country: (country || '').trim(), zip: (zip || '').trim() }; saveProfiles(profiles); }
}

// AI-powered latitude detection with hardcoded fallback
export function getLocationCache() { try { return JSON.parse(localStorage.getItem('labcharts-location-cache') || '{}'); } catch(e) { return {}; } }
export function setLocationCache(key, lat) { var c = getLocationCache(); c[key] = lat; try { localStorage.setItem('labcharts-location-cache', JSON.stringify(c)); } catch(e) {} }
export function latitudeToBand(lat) { var a = Math.abs(lat); if (a < 25) return 0; if (a < 40) return 1; if (a < 50) return 2; if (a < 60) return 3; return 4; }

var _locationDebounceTimer = null;
export function updateLocationLat() {
  const country = (document.getElementById('loc-country') || {}).value || '';
  const zip = (document.getElementById('loc-zip') || {}).value || '';
  setProfileLocation(state.currentProfile, country, zip);
  const el = document.getElementById('loc-lat-display');
  if (!el) return;
  const ct = country.trim(), zt = zip.trim();
  if (!ct) { el.textContent = ''; return; }

  // Check AI cache first (most accurate)
  var cacheKey = (ct + '|' + zt).toLowerCase();
  var cached = getLocationCache()[cacheKey];
  if (cached !== undefined) {
    var band = latitudeToBand(cached);
    el.style.color = 'var(--green)';
    el.textContent = '\u2713 ' + Math.abs(Math.round(cached)) + '\u00b0' + (cached >= 0 ? 'N' : 'S') + ' \u2014 ' + LATITUDE_BANDS[band];
    return;
  }

  // Hardcoded fallback (instant)
  var lat = getLatitudeFromLocation();
  if (lat) {
    el.style.color = 'var(--green)';
    el.textContent = '\u2713 ' + lat;
  } else if (window.hasAIProvider()) {
    el.style.color = 'var(--text-muted)';
    el.textContent = 'Detecting\u2026';
  } else {
    el.style.color = 'var(--text-muted)';
    el.textContent = 'Country not recognized \u2014 try the full name';
  }

  // Debounced AI refinement
  if (_locationDebounceTimer) clearTimeout(_locationDebounceTimer);
  if (window.hasAIProvider()) {
    _locationDebounceTimer = setTimeout(function() { detectLatitudeWithAI(ct, zt); }, 1500);
  }
}

export async function detectLatitudeWithAI(country, zip) {
  var cacheKey = (country + '|' + zip).toLowerCase();
  if (getLocationCache()[cacheKey] !== undefined) return;
  try {
    var locationStr = zip ? country + ' ' + zip : country;
    var { text: response } = await window.callClaudeAPI({
      system: 'You are a geography assistant. Reply with ONLY a number \u2014 the approximate latitude in decimal degrees (positive for North, negative for South). No text, no degree symbol, just the number.',
      messages: [{ role: 'user', content: 'Latitude of: ' + locationStr }],
      maxTokens: 10
    });
    var lat = parseFloat((response || '').trim());
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      setLocationCache(cacheKey, lat);
      var el = document.getElementById('loc-lat-display');
      if (el) {
        var band = latitudeToBand(lat);
        el.style.color = 'var(--green)';
        el.textContent = '\u2713 ' + Math.abs(Math.round(lat)) + '\u00b0' + (lat >= 0 ? 'N' : 'S') + ' \u2014 ' + LATITUDE_BANDS[band];
      }
    }
  } catch(e) {
    if (window.isDebugMode()) console.warn('[Location] AI detection failed:', e);
  }
}

export function getLatitudeFromLocation() {
  const loc = getProfileLocation();
  if (!loc.country) return null;
  const c = loc.country.toLowerCase().trim();
  const zip = (loc.zip || '').trim();

  // AI cache (most accurate — covers any country/ZIP worldwide)
  var cacheKey = (c + '|' + zip).toLowerCase();
  var aiCached = getLocationCache()[cacheKey];
  if (aiCached !== undefined) return LATITUDE_BANDS[latitudeToBand(aiCached)];

  var zn = zip.replace(/\s/g, '');
  // ZIP refinement for USA (first digit = region, special prefixes for HI/AK/PR)
  if (zn && (c === 'usa' || c === 'us' || c === 'united states' || c === 'america')) {
    var p3 = zn.substring(0, 3);
    if (p3 >= '006' && p3 <= '009') return LATITUDE_BANDS[0]; // PR/VI → tropical
    if (p3 >= '967' && p3 <= '968') return LATITUDE_BANDS[0]; // Hawaii → tropical
    if (p3 >= '995') return LATITUDE_BANDS[4]; // Alaska → subarctic
    var d = zn.charAt(0);
    var usb = { '0':2, '1':2, '2':2, '3':1, '4':2, '5':2, '6':2, '7':1, '8':2, '9':2 };
    if (usb[d] !== undefined) return LATITUDE_BANDS[usb[d]];
  }

  // ZIP refinement for Canada (first letter = province/territory)
  if (zn && (c === 'canada' || c === 'ca')) {
    var letter = zn.charAt(0).toUpperCase();
    var cab = { 'A':3,'B':2,'C':2,'E':2, 'G':2,'H':2,'J':2,'K':2,'L':2,'M':2,'N':2, 'P':3,'R':3,'S':3,'T':3, 'V':2, 'X':4,'Y':4 };
    if (cab[letter] !== undefined) return LATITUDE_BANDS[cab[letter]];
  }

  // ZIP refinement for European countries
  var zd = zn.charAt(0);
  // Norway (4-digit): 0-5 southern ~58-60°N → northern, 6-9 central/north ~62-71°N → subarctic
  if (zn && (c === 'norway' || c === 'norge')) {
    if (zd >= '0' && zd <= '5') return LATITUDE_BANDS[3];
    return LATITUDE_BANDS[4];
  }
  // Sweden (5-digit): 1-6 southern/central ~55-60°N → northern, 7-9 north ~62-69°N → subarctic
  if (zn && (c === 'sweden' || c === 'sverige')) {
    if (zd >= '1' && zd <= '6') return LATITUDE_BANDS[3];
    if (zd >= '7') return LATITUDE_BANDS[4];
  }
  // Finland (5-digit): 00-39 southern ~60°N → northern, 40-99 central/north ~62-70°N → subarctic
  if (zn && (c === 'finland' || c === 'suomi')) {
    var f2 = parseInt(zn.substring(0, 2));
    if (!isNaN(f2)) return LATITUDE_BANDS[f2 < 40 ? 3 : 4];
  }
  // Germany (5-digit): 0-6 northern/central ~50-54°N → northern, 7-9 southern ~48-50°N → temperate
  if (zn && (c === 'germany' || c === 'deutschland')) {
    if (zd >= '7') return LATITUDE_BANDS[2];
    return LATITUDE_BANDS[3];
  }
  // Italy (5-digit): 00-79 central/north ~41-47°N → temperate, 80-98 south/islands ~36-41°N → subtropical
  if (zn && (c === 'italy' || c === 'italia')) {
    var i2 = parseInt(zn.substring(0, 2));
    if (!isNaN(i2)) return LATITUDE_BANDS[i2 >= 80 ? 1 : 2];
  }
  // Spain (5-digit): northern provinces ~43°N → temperate, rest → subtropical
  if (zn && (c === 'spain' || c === 'españa' || c === 'espana')) {
    var s2 = parseInt(zn.substring(0, 2));
    if (!isNaN(s2) && (s2 >= 15 && s2 <= 16 || s2 >= 20 && s2 <= 24 || s2 >= 26 && s2 <= 28 || s2 >= 31 && s2 <= 34 || s2 >= 39 && s2 <= 50)) return LATITUDE_BANDS[2];
    return LATITUDE_BANDS[1];
  }
  // France (5-digit): mostly temperate, northern departments ~50°N → borderline northern
  if (zn && (c === 'france')) {
    var fr2 = parseInt(zn.substring(0, 2));
    if (!isNaN(fr2) && (fr2 >= 59 && fr2 <= 62 || fr2 === 80 || fr2 === 2)) return LATITUDE_BANDS[3];
    return LATITUDE_BANDS[2];
  }
  // Russia (6-digit): default northern, 350-385 south → temperate, 163/183-184 Murmansk → subarctic
  if (zn && (c === 'russia' || c === 'россия' || c === 'rossiya')) {
    var r3 = parseInt(zn.substring(0, 3));
    if (!isNaN(r3)) {
      if (r3 >= 350 && r3 <= 385) return LATITUDE_BANDS[2];
      if (r3 >= 163 && r3 <= 164 || r3 >= 183 && r3 <= 184) return LATITUDE_BANDS[4];
    }
    return LATITUDE_BANDS[3];
  }

  // Country-level lookup
  const band = COUNTRY_LATITUDES[c];
  if (band !== undefined) return LATITUDE_BANDS[band];
  for (const [key, val] of Object.entries(COUNTRY_LATITUDES)) {
    if (c.includes(key) || key.includes(c)) return LATITUDE_BANDS[val];
  }
  return null;
}

export function switchDob(dob) {
  state.profileDob = dob || null;
  setProfileDob(state.currentProfile, state.profileDob);
  const data = window.getActiveData();
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  window.buildSidebar(data);
  window.updateHeaderDates(data);
  window.navigate(activeCat, data);
}

Object.assign(window, {
  profileStorageKey,
  getProfiles,
  saveProfiles,
  initProfilesCache,
  createProfile,
  deleteProfile,
  renameProfile,
  switchProfile,
  migrateProfileData,
  getProfileSex,
  setProfileSex,
  getProfileDob,
  setProfileDob,
  getProfileLocation,
  setProfileLocation,
  getLocationCache,
  setLocationCache,
  latitudeToBand,
  updateLocationLat,
  getLatitudeFromLocation,
  // Additional functions needed by other modules or HTML handlers
  loadProfile,
  getActiveProfileId,
  setActiveProfileId,
  switchSex,
  switchDob,
  detectLatitudeWithAI,
});
