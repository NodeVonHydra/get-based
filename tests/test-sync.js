// test-sync.js — Verify sync module exports, payload format, settings UI
// Run: fetch('tests/test-sync.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`%c PASS %c ${name}`, 'background:#22c55e;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
    else { fail++; console.error(`%c FAIL %c ${name}`, 'background:#ef4444;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
  }

  console.log('%c Cross-Device Sync Tests ', 'background:#6366f1;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px');

  const syncSrc = await fetch('js/sync.js').then(r => r.text());
  const settingsSrc = await fetch('js/settings.js').then(r => r.text());
  const dataSrc = await fetch('js/data.js').then(r => r.text());
  const mainSrc = await fetch('js/main.js').then(r => r.text());

  // ═══════════════════════════════════════
  // 1. MODULE EXPORTS
  // ═══════════════════════════════════════
  console.log('%c 1. Module Exports ', 'font-weight:bold;color:#f59e0b');

  const requiredExports = ['isSyncEnabled', 'initSync', 'enableSync', 'disableSync', 'getMnemonic', 'restoreFromMnemonic', 'getSyncRelay', 'setSyncRelay', 'onDataSaved'];
  for (const fn of requiredExports) {
    assert(`sync.js exports ${fn}`, syncSrc.includes(`export function ${fn}`) || syncSrc.includes(`export async function ${fn}`));
  }

  // ═══════════════════════════════════════
  // 2. SYNC PAYLOAD FORMAT
  // ═══════════════════════════════════════
  console.log('%c 2. Sync Payload Format ', 'font-weight:bold;color:#f59e0b');

  assert('buildSyncPayload includes _v: 2', syncSrc.includes('_v: 2'));
  assert('buildSyncPayload includes importedData', syncSrc.includes('importedData,') || syncSrc.includes('importedData:'));
  assert('buildSyncPayload includes profile metadata', syncSrc.includes('profile: profile'));
  assert('buildSyncPayload includes aiSettings', syncSrc.includes('aiSettings'));

  assert('parseSyncPayload handles v2 format', syncSrc.includes('parsed._v === 2'));
  assert('parseSyncPayload has v1 backward compat', syncSrc.includes('v1 compat'));

  // ═══════════════════════════════════════
  // 3. AI SETTINGS SYNC
  // ═══════════════════════════════════════
  console.log('%c 3. AI Settings Sync ', 'font-weight:bold;color:#f59e0b');

  const expectedKeys = ['labcharts-ai-provider', 'labcharts-api-key', 'labcharts-openrouter-key', 'labcharts-venice-key', 'labcharts-anthropic-model', 'labcharts-openrouter-model'];
  for (const key of expectedKeys) {
    assert(`AI_SETTINGS_KEYS includes ${key}`, syncSrc.includes(`'${key}'`));
  }

  assert('Encrypted keys use encryptedSetItem on apply', syncSrc.includes('ENCRYPTED_AI_KEYS') && syncSrc.includes('encryptedSetItem(key, val)'));
  assert('collectAISettings uses encryptedGetItem', syncSrc.includes('encryptedGetItem(key)'));

  // ═══════════════════════════════════════
  // 4. MNEMONIC RESTORE CLEARS SYNC-TS
  // ═══════════════════════════════════════
  console.log('%c 4. Mnemonic Restore ', 'font-weight:bold;color:#f59e0b');

  assert('restoreFromMnemonic clears sync-ts', syncSrc.includes("'-sync-ts'") && syncSrc.includes('localStorage.removeItem(key)'));
  assert('restoreFromMnemonic calls evolu.restoreAppOwner', syncSrc.includes('evolu.restoreAppOwner(mnemonic)'));

  // ═══════════════════════════════════════
  // 5. EVOLU CONFIG
  // ═══════════════════════════════════════
  console.log('%c 5. Evolu Configuration ', 'font-weight:bold;color:#f59e0b');

  assert('reloadUrl uses window.location.pathname', syncSrc.includes('reloadUrl: window.location.pathname'));
  assert('enableLogging gated on debug mode', syncSrc.includes('enableLogging: isDebugMode()'));
  assert('Default relay is wss://free.evoluhq.com', syncSrc.includes("wss://free.evoluhq.com"));
  assert('COOP header in dev-server', await fetch('dev-server.js').then(r => r.text()).then(s => s.includes('Cross-Origin-Opener-Policy')));

  // ═══════════════════════════════════════
  // 6. DATA.JS INTEGRATION
  // ═══════════════════════════════════════
  console.log('%c 6. Data Integration ', 'font-weight:bold;color:#f59e0b');

  assert('data.js imports onDataSaved from sync.js', dataSrc.includes("import { onDataSaved } from './sync.js'"));
  assert('saveImportedData calls onDataSaved()', dataSrc.includes('onDataSaved()'));

  // ═══════════════════════════════════════
  // 7. MAIN.JS INTEGRATION
  // ═══════════════════════════════════════
  console.log('%c 7. Main Integration ', 'font-weight:bold;color:#f59e0b');

  assert('main.js imports initSync', mainSrc.includes("import { initSync } from './sync.js'"));
  assert('main.js calls initSync()', mainSrc.includes('await initSync()'));

  // ═══════════════════════════════════════
  // 8. PUSH/PULL LOGIC
  // ═══════════════════════════════════════
  console.log('%c 8. Push/Pull Logic ', 'font-weight:bold;color:#f59e0b');

  assert('pushCurrentProfile guards on _syncing', syncSrc.includes('!_syncing') && syncSrc.includes('_syncing = true'));
  assert('pushCurrentProfile uses insert/update pattern', syncSrc.includes('evolu.insert(') && syncSrc.includes('evolu.update('));
  assert('onDataSaved has 2s debounce', syncSrc.includes('}, 2000)'));
  assert('onSyncReceived checks remoteUpdated > localUpdated', syncSrc.includes('remoteUpdated <= localUpdated'));
  assert('Pull handles encryption', syncSrc.includes('getEncryptionEnabled()') && syncSrc.includes('encryptedSetItem(localKey'));
  assert('Pull merges profiles into local list', syncSrc.includes('profiles.push(') && syncSrc.includes('saveProfiles(profiles)'));
  assert('Pull calls navigate for active profile', syncSrc.includes("window.navigate?.('dashboard')"));
  assert('Pull calls migrateProfileData', syncSrc.includes('migrateProfileData(state.importedData)'));

  // ═══════════════════════════════════════
  // 9. SETTINGS UI
  // ═══════════════════════════════════════
  console.log('%c 9. Settings UI ', 'font-weight:bold;color:#f59e0b');

  assert('Settings imports sync functions', settingsSrc.includes("from './sync.js'"));
  assert('renderSyncSection exists', settingsSrc.includes('function renderSyncSection'));
  assert('Sync section in Data tab', settingsSrc.includes('Cross-Device Sync'));
  assert('Connected indicator with green dot', settingsSrc.includes('#22c55e') && settingsSrc.includes('Connected to relay'));
  assert('Mnemonic display area', settingsSrc.includes('sync-mnemonic'));
  assert('Restore from mnemonic button', settingsSrc.includes('Restore from mnemonic'));
  assert('Relay input under Advanced', settingsSrc.includes('sync-relay-input') && settingsSrc.includes('Advanced'));
  assert('Relay validation rejects non-wss', settingsSrc.includes("!url.startsWith('wss://')"));
  assert('toggleSync function', settingsSrc.includes('async function toggleSync'));
  assert('copyMnemonic function', settingsSrc.includes('function copyMnemonic'));

  // ═══════════════════════════════════════
  // 10. WINDOW BINDINGS
  // ═══════════════════════════════════════
  console.log('%c 10. Window Bindings ', 'font-weight:bold;color:#f59e0b');

  const syncWindowFns = ['enableSync', 'disableSync', 'getMnemonic', 'restoreFromMnemonic', 'isSyncEnabled'];
  for (const fn of syncWindowFns) {
    assert(`window.${fn} exists`, typeof window[fn] === 'function');
  }

  const settingsWindowFns = ['toggleSync', 'copyMnemonic', 'showMnemonicRestore', 'doMnemonicRestore', 'saveSyncRelay'];
  for (const fn of settingsWindowFns) {
    assert(`window.${fn} exists`, typeof window[fn] === 'function');
  }

  // ═══════════════════════════════════════
  // 11. VENDOR FILES
  // ═══════════════════════════════════════
  console.log('%c 11. Vendor Files ', 'font-weight:bold;color:#f59e0b');

  const vendorFiles = ['vendor/evolu/evolu-bundle.js', 'vendor/evolu/Db.worker.js', 'vendor/evolu/sqlite3.wasm'];
  for (const f of vendorFiles) {
    const res = await fetch(f, { method: 'HEAD' });
    assert(`${f} exists`, res.ok, `status: ${res.status}`);
  }

  // ═══════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════
  console.log(`%c\n Sync Tests: ${pass} passed, ${fail} failed `, fail ? 'background:#ef4444;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px' : 'background:#22c55e;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px');
  if (typeof window.__TEST_RESULTS !== 'undefined') window.__TEST_RESULTS = { pass, fail };
})();
