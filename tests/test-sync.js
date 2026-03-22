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

  const requiredExports = ['isSyncEnabled', 'initSync', 'enableSync', 'disableSync', 'getMnemonic', 'restoreFromMnemonic', 'getSyncRelay', 'setSyncRelay', 'onDataSaved', 'pushCurrentProfile'];
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
  assert('parseSyncPayload has v1 backward compat', syncSrc.includes('importedData: parsed, profile: null'));
  assert('parseSyncPayload validates payload size', syncSrc.includes('dataJson.length > 50_000_000'));
  assert('parseSyncPayload validates payload type', syncSrc.includes("typeof dataJson !== 'string'"));

  // ═══════════════════════════════════════
  // 3. AI SETTINGS SYNC
  // ═══════════════════════════════════════
  console.log('%c 3. AI Settings Sync ', 'font-weight:bold;color:#f59e0b');

  const expectedKeys = [
    'labcharts-ai-provider', 'labcharts-api-key', 'labcharts-openrouter-key',
    'labcharts-venice-key', 'labcharts-anthropic-model', 'labcharts-openrouter-model',
    'labcharts-venice-model', 'labcharts-venice-e2ee', 'labcharts-ollama-model',
    'labcharts-ollama-pii-url', 'labcharts-ollama-pii-model'
  ];
  for (const key of expectedKeys) {
    assert(`AI_SETTINGS_KEYS includes ${key}`, syncSrc.includes(`'${key}'`));
  }

  assert('Encrypted keys use encryptedSetItem on apply', syncSrc.includes('ENCRYPTED_AI_KEYS') && syncSrc.includes('encryptedSetItem(key, val)'));
  assert('collectAISettings uses encryptedGetItem', syncSrc.includes('encryptedGetItem(key)'));
  assert('applyAISettings has allowlist check', syncSrc.includes('AI_SETTINGS_KEYS.includes(key)'));
  assert('applyAISettings has size guard', syncSrc.includes('val.length > 10000'));

  // ═══════════════════════════════════════
  // 4. MNEMONIC RESTORE
  // ═══════════════════════════════════════
  console.log('%c 4. Mnemonic Restore ', 'font-weight:bold;color:#f59e0b');

  assert('restoreFromMnemonic clears sync-ts after success', syncSrc.includes("'-sync-ts'") && syncSrc.includes('localStorage.removeItem(key)'));
  assert('restoreFromMnemonic calls evolu.restoreAppOwner', syncSrc.includes('evolu.restoreAppOwner(mnemonic)'));
  // Verify timestamps are cleared AFTER restoreAppOwner (not before)
  const restoreIdx = syncSrc.indexOf('evolu.restoreAppOwner(mnemonic)');
  const clearTsIdx = syncSrc.indexOf("'-sync-ts'");
  assert('Sync-ts cleared after restoreAppOwner (not before)', restoreIdx > 0 && clearTsIdx > restoreIdx,
    `restoreAppOwner at ${restoreIdx}, sync-ts clear at ${clearTsIdx}`);

  // ═══════════════════════════════════════
  // 5. EVOLU CONFIG
  // ═══════════════════════════════════════
  console.log('%c 5. Evolu Configuration ', 'font-weight:bold;color:#f59e0b');

  assert('reloadUrl uses window.location.pathname', syncSrc.includes('reloadUrl: window.location.pathname'));
  assert('enableLogging gated on debug mode', syncSrc.includes('enableLogging: isDebugMode()'));
  assert('Default relay is wss://free.evoluhq.com', syncSrc.includes("wss://free.evoluhq.com"));
  assert('COOP header in dev-server', await fetch('dev-server.js').then(r => r.text()).then(s => s.includes('Cross-Origin-Opener-Policy')));
  assert('initSync has re-entrancy guard', syncSrc.includes('if (evolu) return'));

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

  assert('pushProfile guards on _syncing', syncSrc.includes('!_syncing') && syncSrc.includes('_syncing = true'));
  assert('pushProfile uses insert/update pattern', syncSrc.includes('evolu.insert(') && syncSrc.includes('evolu.update('));
  assert('onDataSaved has 2s debounce', syncSrc.includes('}, 2000)'));
  assert('onDataSaved captures profileId at schedule time', syncSrc.includes('const profileId = state.currentProfile') && syncSrc.includes('pushProfile(profileId'));
  assert('onDataSaved retries if _syncing', syncSrc.includes('if (_syncing)') && syncSrc.includes('pushProfile(profileId, data)'));
  assert('onSyncReceived checks remoteUpdated > localUpdated', syncSrc.includes('remoteUpdated <= localUpdated'));
  assert('onSyncReceived guards on _pulling', syncSrc.includes('_pulling') && syncSrc.includes('_pulling = true'));
  assert('Pull handles encryption', syncSrc.includes('getEncryptionEnabled()') && syncSrc.includes('encryptedSetItem(localKey'));
  assert('Pull merges profiles with allowlist', syncSrc.includes('PROFILE_MERGE_FIELDS') && syncSrc.includes('saveProfiles(profiles)'));
  assert('Pull calls navigate for active profile', syncSrc.includes("window.navigate?.('dashboard')"));
  assert('Pull calls migrateProfileData', syncSrc.includes('migrateProfileData(state.importedData)'));
  assert('pushAllProfiles pushes all profiles on first enable', syncSrc.includes('async function pushAllProfiles'));
  assert('disableSync clears _appOwner', syncSrc.includes('_appOwner = null'));
  assert('disableSync waits for in-flight ops', syncSrc.includes('if (_syncing || _pulling)'));

  // ═══════════════════════════════════════
  // 9. SETTINGS UI
  // ═══════════════════════════════════════
  console.log('%c 9. Settings UI ', 'font-weight:bold;color:#f59e0b');

  assert('Settings imports sync functions', settingsSrc.includes("from './sync.js'"));
  assert('renderSyncSection exists', settingsSrc.includes('function renderSyncSection'));
  assert('Sync section in Data tab', settingsSrc.includes('Cross-Device Sync'));
  assert('Connected indicator with green dot', settingsSrc.includes('#22c55e') && settingsSrc.includes('Connected to relay'));
  assert('Mnemonic display with mask', settingsSrc.includes('sync-mnemonic') && settingsSrc.includes('MNEMONIC_MASK'));
  assert('Mnemonic toggle button has id', settingsSrc.includes('sync-mnemonic-toggle'));
  assert('Mnemonic toggle uses getElementById', settingsSrc.includes("getElementById('sync-mnemonic-toggle')"));
  assert('Restore from mnemonic button', settingsSrc.includes('Restore from mnemonic'));
  assert('Relay input under Advanced', settingsSrc.includes('sync-relay-input') && settingsSrc.includes('Advanced'));
  assert('Relay validation rejects non-wss and non-ws', settingsSrc.includes("!url.startsWith('wss://')") && settingsSrc.includes("!url.startsWith('ws://')"));
  assert('toggleSync function', settingsSrc.includes('async function toggleSync'));
  assert('copyMnemonic has error handler', settingsSrc.includes('.catch(') && settingsSrc.includes('Could not access clipboard'));

  // ═══════════════════════════════════════
  // 10. SETUP MODAL
  // ═══════════════════════════════════════
  console.log('%c 10. Setup Modal ', 'font-weight:bold;color:#f59e0b');

  assert('showSyncSetupModal exists', settingsSrc.includes('function showSyncSetupModal'));
  assert('Setup modal has two choices', settingsSrc.includes('New setup') && settingsSrc.includes('Join existing'));
  assert('syncSetupNew generates mnemonic', settingsSrc.includes('async function syncSetupNew') || settingsSrc.includes('syncSetupNew'));
  assert('syncSetupNew has double-click guard', settingsSrc.includes('_syncSetupInProgress'));
  assert('syncSetupNew shows mnemonic in cleartext', settingsSrc.includes('escapeHTML(mnemonic)'));
  assert('syncSetupNew requires checkbox acknowledgment', settingsSrc.includes('I have saved my mnemonic'));
  assert('Done button has disabled styling', settingsSrc.includes("opacity:0.45") || settingsSrc.includes("opacity: 0.45"));
  assert('syncSetupRestore shows textarea', settingsSrc.includes('function syncSetupRestore'));
  assert('syncSetupDoRestore validates 24 words', settingsSrc.includes("words.length !== 24"));
  assert('syncSetupDoRestore cleans up on failure', settingsSrc.includes('await disableSync()') && settingsSrc.includes('Restore failed'));
  assert('syncSetupBack returns to choices', settingsSrc.includes('function syncSetupBack'));
  assert('closeSyncSetup disables sync if started', settingsSrc.includes('async function closeSyncSetup') && settingsSrc.includes('disableSync'));
  assert('closeSyncSetup releases _syncToggling', settingsSrc.includes('_syncToggling = false'));
  assert('doMnemonicRestore validates 24 words', settingsSrc.includes("words.length !== 24"));
  assert('Clipboard auto-clear after 60s', settingsSrc.includes('60000') && settingsSrc.includes("writeText('')"));
  assert('loadMnemonic retry timer is cancellable', settingsSrc.includes('_mnemonicRetryTimer') && settingsSrc.includes('clearTimeout(_mnemonicRetryTimer)'));

  // ═══════════════════════════════════════
  // 11. WINDOW BINDINGS
  // ═══════════════════════════════════════
  console.log('%c 11. Window Bindings ', 'font-weight:bold;color:#f59e0b');

  const syncWindowFns = ['enableSync', 'disableSync', 'getMnemonic', 'restoreFromMnemonic', 'isSyncEnabled'];
  for (const fn of syncWindowFns) {
    assert(`window.${fn} exists`, typeof window[fn] === 'function');
  }

  const settingsWindowFns = [
    'toggleSync', 'toggleMnemonicVisibility', 'copyMnemonic', 'showMnemonicRestore',
    'doMnemonicRestore', 'saveSyncRelay', 'closeSyncSetup', 'syncSetupNew',
    'syncSetupRestore', 'syncSetupBack', 'syncSetupDoRestore', 'syncSetupDone'
  ];
  for (const fn of settingsWindowFns) {
    assert(`window.${fn} exists`, typeof window[fn] === 'function');
  }

  // ═══════════════════════════════════════
  // 12. VENDOR FILES
  // ═══════════════════════════════════════
  console.log('%c 12. Vendor Files ', 'font-weight:bold;color:#f59e0b');

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
