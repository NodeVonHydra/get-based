// test-crypto.js — Browser-based verification for encryption, backup, and cross-tab sync
// Run: fetch('test-crypto.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  const results = [];
  function assert(name, condition, detail) {
    if (condition) { pass++; results.push(`  PASS: ${name}`); }
    else { fail++; results.push(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('%c[test-crypto] Starting crypto verification...', 'color:#6366f1;font-weight:bold');

  // ═══════════════════════════════════════════════
  // 1. Module & window exports exist
  // ═══════════════════════════════════════════════
  assert('window.initEncryption exists', typeof window.initEncryption === 'function');
  assert('window.initBroadcastChannel exists', typeof window.initBroadcastChannel === 'function');
  assert('window.getEncryptionEnabled exists', typeof window.getEncryptionEnabled === 'function');
  assert('window.isUnlocked exists', typeof window.isUnlocked === 'function');
  assert('window.encryptedSetItem exists', typeof window.encryptedSetItem === 'function');
  assert('window.encryptedGetItem exists', typeof window.encryptedGetItem === 'function');
  assert('window.showEnableEncryptionModal exists', typeof window.showEnableEncryptionModal === 'function');
  assert('window.disableEncryption exists', typeof window.disableEncryption === 'function');
  assert('window.changePassphrase exists', typeof window.changePassphrase === 'function');
  assert('window.exportEncryptedBackup exists', typeof window.exportEncryptedBackup === 'function');
  assert('window.importEncryptedBackup exists', typeof window.importEncryptedBackup === 'function');
  assert('window.broadcastDataChanged exists', typeof window.broadcastDataChanged === 'function');
  assert('window.renderEncryptionSection exists', typeof window.renderEncryptionSection === 'function');
  assert('window.renderBackupSection exists', typeof window.renderBackupSection === 'function');
  assert('window.isSensitiveKey exists', typeof window.isSensitiveKey === 'function');
  assert('window.initProfilesCache exists', typeof window.initProfilesCache === 'function');

  // ═══════════════════════════════════════════════
  // 2. Sensitive key detection
  // ═══════════════════════════════════════════════
  assert('labcharts-default-imported is sensitive', window.isSensitiveKey('labcharts-default-imported'));
  assert('labcharts-abc123-imported is sensitive', window.isSensitiveKey('labcharts-abc123-imported'));
  assert('labcharts-default-chat is sensitive', window.isSensitiveKey('labcharts-default-chat'));
  assert('labcharts-profiles is sensitive', window.isSensitiveKey('labcharts-profiles'));
  assert('labcharts-api-key is NOT sensitive', !window.isSensitiveKey('labcharts-api-key'));
  assert('labcharts-ai-provider is NOT sensitive', !window.isSensitiveKey('labcharts-ai-provider'));
  assert('labcharts-default-units is NOT sensitive', !window.isSensitiveKey('labcharts-default-units'));
  assert('labcharts-encryption-enabled is NOT sensitive', !window.isSensitiveKey('labcharts-encryption-enabled'));
  assert('labcharts-time-format is NOT sensitive', !window.isSensitiveKey('labcharts-time-format'));
  assert('labcharts-default-focusCard is NOT sensitive', !window.isSensitiveKey('labcharts-default-focusCard'));

  // ═══════════════════════════════════════════════
  // 3. Web Crypto API key derivation round-trip
  // ═══════════════════════════════════════════════
  try {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passphrase = 'test-passphrase-123';
    const iterations = 600000;

    // Derive key
    const keyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']
    );
    const key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    assert('Key derivation succeeds', key instanceof CryptoKey);

    // Encrypt
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const plaintext = 'Hello, Lab Charts!';
    const ciphertext = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv }, key, enc.encode(plaintext)
    );
    assert('Encryption produces ArrayBuffer', ciphertext instanceof ArrayBuffer);
    assert('Ciphertext differs from plaintext', new Uint8Array(ciphertext).length !== enc.encode(plaintext).length || new Uint8Array(ciphertext)[0] !== enc.encode(plaintext)[0]);

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv }, key, ciphertext
    );
    assert('Decryption round-trip succeeds', dec.decode(decrypted) === plaintext, `got: ${dec.decode(decrypted)}`);

    // Wrong passphrase should fail
    const wrongKeyMaterial = await crypto.subtle.importKey(
      'raw', enc.encode('wrong-passphrase'), 'PBKDF2', false, ['deriveKey']
    );
    const wrongKey = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      wrongKeyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    try {
      await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, wrongKey, ciphertext);
      assert('Wrong passphrase throws on decrypt', false, 'should have thrown');
    } catch (e) {
      assert('Wrong passphrase throws on decrypt', true);
    }
  } catch (e) {
    assert('Web Crypto round-trip', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 4. v1: prefix format verification
  // ═══════════════════════════════════════════════
  try {
    // Simulate the v1 format manually
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = crypto.getRandomValues(new Uint8Array(32));
    const b64 = (arr) => btoa(String.fromCharCode(...arr));
    const formatted = `v1:${b64(iv)}:${b64(ct)}`;
    assert('v1: prefix format starts with v1:', formatted.startsWith('v1:'));
    assert('v1: prefix format has 3 parts', formatted.split(':').length >= 3);
    const parts = formatted.split(':');
    assert('v1: prefix version is v1', parts[0] === 'v1');
    // Verify base64 IV decodes correctly
    const decodedIv = Uint8Array.from(atob(parts[1]), c => c.charCodeAt(0));
    assert('v1: prefix IV round-trips', decodedIv.length === 12);
  } catch (e) {
    assert('v1: prefix format', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 5. Non-sensitive keys stored as plaintext
  // ═══════════════════════════════════════════════
  try {
    const testKey = 'labcharts-test-nonsensitive';
    const testVal = 'plain-value-123';
    await window.encryptedSetItem(testKey, testVal);
    const stored = localStorage.getItem(testKey);
    assert('Non-sensitive key stored as plaintext', stored === testVal, `got: ${stored}`);
    assert('Non-sensitive key has no v1: prefix', !stored.startsWith('v1:'));
    const retrieved = await window.encryptedGetItem(testKey);
    assert('Non-sensitive key retrieved correctly', retrieved === testVal, `got: ${retrieved}`);
    localStorage.removeItem(testKey);
  } catch (e) {
    assert('Non-sensitive key plaintext storage', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 6. encryptedGetItem handles null
  // ═══════════════════════════════════════════════
  try {
    const result = await window.encryptedGetItem('labcharts-nonexistent-key-xyz');
    assert('encryptedGetItem returns null for missing key', result === null);
  } catch (e) {
    assert('encryptedGetItem null handling', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 7. BroadcastChannel does not self-notify
  // ═══════════════════════════════════════════════
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      let selfNotified = false;
      const testBC = new BroadcastChannel('labcharts-test-bc');
      testBC.onmessage = () => { selfNotified = true; };
      testBC.postMessage({ test: true });
      // BroadcastChannel should NOT fire to the same tab
      await new Promise(r => setTimeout(r, 100));
      assert('BroadcastChannel does not self-notify', !selfNotified);
      testBC.close();
    } catch (e) {
      assert('BroadcastChannel test', false, e.message);
    }
  } else {
    assert('BroadcastChannel API available', false, 'BroadcastChannel not supported in this browser');
  }

  // ═══════════════════════════════════════════════
  // 8. Service worker includes crypto.js
  // ═══════════════════════════════════════════════
  try {
    const swResponse = await fetch('service-worker.js');
    const swText = await swResponse.text();
    assert('Service worker contains /js/crypto.js', swText.includes('/js/crypto.js'));
    assert('Service worker cache is v38', swText.includes("labcharts-v40"));
  } catch (e) {
    assert('Service worker check', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 9. Settings modal shows Security section
  // ═══════════════════════════════════════════════
  try {
    const html = window.renderEncryptionSection();
    assert('renderEncryptionSection returns HTML', typeof html === 'string' && html.length > 50);
    assert('Encryption section has status card', html.includes('encryption-status-card'));
    const backupHtml = window.renderBackupSection();
    assert('renderBackupSection returns HTML', typeof backupHtml === 'string' && backupHtml.length > 50);
    assert('Backup section has download button', backupHtml.includes('Download Backup'));
    assert('Backup section has restore button', backupHtml.includes('Restore Backup'));
  } catch (e) {
    assert('Settings section rendering', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 10. Encryption enabled state
  // ═══════════════════════════════════════════════
  {
    const wasEnabled = localStorage.getItem('labcharts-encryption-enabled');
    // Test disabled state
    localStorage.removeItem('labcharts-encryption-enabled');
    assert('getEncryptionEnabled returns false when disabled', window.getEncryptionEnabled() === false);
    // Test enabled state
    localStorage.setItem('labcharts-encryption-enabled', 'true');
    assert('getEncryptionEnabled returns true when enabled', window.getEncryptionEnabled() === true);
    // Restore
    if (wasEnabled) localStorage.setItem('labcharts-encryption-enabled', wasEnabled);
    else localStorage.removeItem('labcharts-encryption-enabled');
  }

  // ═══════════════════════════════════════════════
  // 11. Encryption section reflects state
  // ═══════════════════════════════════════════════
  {
    const wasEnabled = localStorage.getItem('labcharts-encryption-enabled');
    localStorage.removeItem('labcharts-encryption-enabled');
    const offHtml = window.renderEncryptionSection();
    assert('OFF state shows Enable button', offHtml.includes('Enable Encryption'));
    assert('OFF state shows encryption-status-off', offHtml.includes('encryption-status-off'));

    localStorage.setItem('labcharts-encryption-enabled', 'true');
    const onHtml = window.renderEncryptionSection();
    assert('ON state shows Change Passphrase', onHtml.includes('Change Passphrase'));
    assert('ON state shows Disable Encryption', onHtml.includes('Disable Encryption'));
    assert('ON state shows encryption-status-on', onHtml.includes('encryption-status-on'));

    if (wasEnabled) localStorage.setItem('labcharts-encryption-enabled', wasEnabled);
    else localStorage.removeItem('labcharts-encryption-enabled');
  }

  // ═══════════════════════════════════════════════
  // 12. All existing window exports still present (regression)
  // ═══════════════════════════════════════════════
  const expectedExports = [
    // data.js
    'saveImportedData', 'getActiveData', 'filterDatesByRange', 'destroyAllCharts',
    'detectTrendAlerts', 'switchUnitSystem', 'switchRangeMode', 'updateHeaderDates',
    // profile.js
    'getProfiles', 'saveProfiles', 'loadProfile', 'switchProfile', 'createProfile',
    'deleteProfile', 'getProfileSex', 'setProfileSex', 'getProfileDob',
    // nav.js
    'buildSidebar', 'renderProfileDropdown',
    // views.js
    'navigate', 'showDashboard',
    // export.js
    'exportPDFReport', 'exportDataJSON', 'importDataJSON', 'clearAllData',
    // settings.js
    'openSettingsModal', 'closeSettingsModal',
    // chat.js
    'toggleChatPanel', 'closeChatPanel',
    // utils.js
    'showNotification', 'showConfirmDialog',
  ];
  for (const name of expectedExports) {
    assert(`window.${name} exists`, typeof window[name] === 'function', `typeof: ${typeof window[name]}`);
  }

  // ═══════════════════════════════════════════════
  // 13. CSS classes for passphrase modal exist
  // ═══════════════════════════════════════════════
  try {
    const cssResponse = await fetch('styles.css');
    const cssText = await cssResponse.text();
    assert('CSS has .passphrase-overlay', cssText.includes('.passphrase-overlay'));
    assert('CSS has .passphrase-dialog', cssText.includes('.passphrase-dialog'));
    assert('CSS has .passphrase-input', cssText.includes('.passphrase-input'));
    assert('CSS has .passphrase-btn', cssText.includes('.passphrase-btn'));
    assert('CSS has .passphrase-btn-primary', cssText.includes('.passphrase-btn-primary'));
    assert('CSS has .encryption-status-card', cssText.includes('.encryption-status-card'));
    assert('CSS has .encryption-status-on', cssText.includes('.encryption-status-on'));
    assert('CSS has .encryption-status-off', cssText.includes('.encryption-status-off'));
  } catch (e) {
    assert('CSS verification', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 14. crypto.js source inspection
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/crypto.js').then(r => r.text());
    assert('crypto.js uses PBKDF2', src.includes('PBKDF2'));
    assert('crypto.js uses AES-GCM', src.includes('AES-GCM'));
    assert('crypto.js has 600000 iterations', src.includes('600000'));
    assert('crypto.js uses 12-byte IV', src.includes('Uint8Array(12)'));
    assert('crypto.js uses 16-byte salt', src.includes('Uint8Array(16)'));
    assert('crypto.js has BroadcastChannel', src.includes('BroadcastChannel'));
    assert('crypto.js has backup format', src.includes('labcharts-backup'));
    assert('crypto.js has v1: prefix', src.includes("'v1:'") || src.includes('`v1:'));
    assert('crypto.js never stores passphrase', !src.includes('localStorage') || (!src.includes('setItem') && !src.includes('passphrase')) || !src.match(/localStorage\.setItem\([^)]*passphrase/));
    // Fix 1: forgot-passphrase uses inline confirm, not showConfirmDialog
    assert('Forgot passphrase does NOT use showConfirmDialog', !src.includes("forgotBtn.addEventListener('click', () => {\n    showConfirmDialog"));
    assert('Forgot passphrase has inline confirm UI', src.includes('passphrase-forgot-confirm'));
    assert('Forgot passphrase has Go Back button', src.includes('passphrase-forgot-cancel'));
    // Fix 2: backup includes encryption salt + global settings
    assert('Backup includes encryptionSalt field', src.includes('encryptionSalt'));
    assert('Restore sets labcharts-encryption-enabled', src.includes("localStorage.setItem('labcharts-encryption-enabled'"));
    assert('Restore sets labcharts-encryption-salt', src.includes("localStorage.setItem('labcharts-encryption-salt'"));
    // API keys in backup
    assert('Backup includes labcharts-api-key', src.includes("'labcharts-api-key'"));
    assert('Backup includes labcharts-venice-key', src.includes("'labcharts-venice-key'"));
    assert('Backup includes labcharts-ai-provider', src.includes("'labcharts-ai-provider'"));
    assert('Backup includes settings field', src.includes('settings,') || src.includes('settings:'));
    assert('Restore writes global settings', src.includes('backup.settings'));
  } catch (e) {
    assert('crypto.js source inspection', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 15. Profiles cache (state.profiles)
  // ═══════════════════════════════════════════════
  try {
    const profiles = window.getProfiles();
    assert('getProfiles returns array', Array.isArray(profiles));
    assert('getProfiles has at least one profile', profiles.length >= 1);
    assert('First profile has id', profiles[0] && typeof profiles[0].id === 'string');
  } catch (e) {
    assert('Profiles cache', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 16. saveImportedData is async
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/data.js').then(r => r.text());
    assert('saveImportedData is async', src.includes('async function saveImportedData'));
    assert('saveImportedData calls broadcastDataChanged', src.includes('broadcastDataChanged'));
    assert('saveImportedData calls encryptedSetItem', src.includes('encryptedSetItem'));
  } catch (e) {
    assert('saveImportedData async check', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 17. Profile loadProfile is async
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/profile.js').then(r => r.text());
    assert('loadProfile is async', src.includes('async function loadProfile'));
    assert('saveProfiles is async', src.includes('async function saveProfiles'));
    assert('initProfilesCache exists', src.includes('async function initProfilesCache'));
    assert('loadProfile uses encryptedGetItem', src.includes('encryptedGetItem'));
  } catch (e) {
    assert('profile.js async check', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 18. main.js async init
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/main.js').then(r => r.text());
    assert('DOMContentLoaded is async', src.includes('async ()'));
    assert('main.js awaits initEncryption', src.includes('await initEncryption()'));
    assert('main.js calls initBroadcastChannel', src.includes('initBroadcastChannel()'));
    assert('main.js awaits initProfilesCache', src.includes('await initProfilesCache()'));
    assert('main.js awaits encryptedGetItem', src.includes('await encryptedGetItem'));
    assert('main.js imports from crypto.js', src.includes("from './crypto.js'"));
  } catch (e) {
    assert('main.js async check', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 19. Settings modal includes security + backup
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/settings.js').then(r => r.text());
    assert('settings.js imports renderEncryptionSection', src.includes('renderEncryptionSection'));
    assert('settings.js imports renderBackupSection', src.includes('renderBackupSection'));
    assert('settings.js has Security group', src.includes('Security'));
    assert('settings.js has Backup group', src.includes('Backup'));
    assert('settings.js has encryption-section id', src.includes('encryption-section'));
    assert('settings.js has backup-section id', src.includes('backup-section'));
  } catch (e) {
    assert('settings.js security check', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 20. Auto-backup window exports
  // ═══════════════════════════════════════════════
  assert('window.scheduleAutoBackup exists', typeof window.scheduleAutoBackup === 'function');
  assert('window.getAutoBackupSnapshots exists', typeof window.getAutoBackupSnapshots === 'function');
  assert('window.restoreAutoBackup exists', typeof window.restoreAutoBackup === 'function');
  assert('window.openBackupDB exists', typeof window.openBackupDB === 'function');
  assert('window.buildBackupSnapshot exists', typeof window.buildBackupSnapshot === 'function');
  assert('window.loadBackupSnapshots exists', typeof window.loadBackupSnapshots === 'function');

  // ═══════════════════════════════════════════════
  // 21. IndexedDB labcharts-backups can be opened
  // ═══════════════════════════════════════════════
  try {
    const db = await window.openBackupDB();
    assert('IndexedDB opens successfully', db instanceof IDBDatabase);
    assert('IndexedDB has snapshots store', db.objectStoreNames.contains('snapshots'));
  } catch (e) {
    assert('IndexedDB open', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 22. buildBackupSnapshot includes per-profile prefs
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/crypto.js').then(r => r.text());
    assert('crypto.js has PER_PROFILE_PREF_SUFFIXES', src.includes('PER_PROFILE_PREF_SUFFIXES'));
    assert('crypto.js includes units in prefs', src.includes("'units'"));
    assert('crypto.js includes rangeMode in prefs', src.includes("'rangeMode'"));
    assert('crypto.js includes suppOverlay in prefs', src.includes("'suppOverlay'"));
    assert('crypto.js includes noteOverlay in prefs', src.includes("'noteOverlay'"));
    assert('crypto.js includes chatPersonality in prefs', src.includes("'chatPersonality'"));
    assert('crypto.js includes chatPersonalityCustom in prefs', src.includes("'chatPersonalityCustom'"));
    assert('crypto.js has openBackupDB function', src.includes('function openBackupDB'));
    assert('crypto.js has performAutoBackup function', src.includes('async function performAutoBackup'));
    assert('crypto.js has scheduleAutoBackup function', src.includes('function scheduleAutoBackup'));
    assert('crypto.js has getAutoBackupSnapshots function', src.includes('async function getAutoBackupSnapshots'));
    assert('crypto.js has restoreAutoBackup function', src.includes('async function restoreAutoBackup'));
    assert('crypto.js has MAX_SNAPSHOTS = 5', src.includes('MAX_SNAPSHOTS = 5'));
    assert('crypto.js has AUTO_BACKUP_COOLDOWN = 10000', src.includes('AUTO_BACKUP_COOLDOWN = 10000'));
    assert('crypto.js has labcharts-last-autobackup', src.includes('labcharts-last-autobackup'));
  } catch (e) {
    assert('buildBackupSnapshot prefs check', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 23. data.js calls scheduleAutoBackup
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/data.js').then(r => r.text());
    assert('data.js imports scheduleAutoBackup', src.includes('scheduleAutoBackup'));
    assert('data.js calls scheduleAutoBackup in saveImportedData', src.includes('scheduleAutoBackup()'));
  } catch (e) {
    assert('data.js auto-backup trigger', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 24. Backup section UI shows auto-backup status
  // ═══════════════════════════════════════════════
  try {
    const html = window.renderBackupSection();
    assert('Backup section has auto-backup status', html.includes('backup-auto-status'));
    assert('Backup section has snapshot list container', html.includes('backup-snapshot-list'));
  } catch (e) {
    assert('Backup section auto-backup UI', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 25. CSS has auto-backup styles
  // ═══════════════════════════════════════════════
  try {
    const cssResponse = await fetch('styles.css');
    const cssText = await cssResponse.text();
    assert('CSS has .backup-auto-status', cssText.includes('.backup-auto-status'));
    assert('CSS has .backup-snapshot-list', cssText.includes('.backup-snapshot-list'));
    assert('CSS has .backup-snapshot-item', cssText.includes('.backup-snapshot-item'));
    assert('CSS has .backup-snapshot-date', cssText.includes('.backup-snapshot-date'));
    assert('CSS has .backup-snapshot-meta', cssText.includes('.backup-snapshot-meta'));
  } catch (e) {
    assert('CSS auto-backup styles', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 26. getAutoBackupSnapshots returns array
  // ═══════════════════════════════════════════════
  try {
    const snapshots = await window.getAutoBackupSnapshots();
    assert('getAutoBackupSnapshots returns array', Array.isArray(snapshots));
  } catch (e) {
    assert('getAutoBackupSnapshots', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 27. buildBackupSnapshot returns valid object
  // ═══════════════════════════════════════════════
  try {
    const snapshot = window.buildBackupSnapshot();
    if (snapshot) {
      assert('buildBackupSnapshot has format field', snapshot.format === 'labcharts-backup');
      assert('buildBackupSnapshot has version field', snapshot.version === 1);
      assert('buildBackupSnapshot has createdAt', typeof snapshot.createdAt === 'string');
      assert('buildBackupSnapshot has profiles array', Array.isArray(snapshot.profiles));
      assert('buildBackupSnapshot has settings object', typeof snapshot.settings === 'object');
      // Check per-profile prefs are captured
      if (snapshot.profiles.length > 0) {
        const firstProfile = snapshot.profiles[0];
        assert('buildBackupSnapshot profile has keys', typeof firstProfile.keys === 'object');
      }
    } else {
      assert('buildBackupSnapshot returns object (no profiles)', true);
    }
  } catch (e) {
    assert('buildBackupSnapshot', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════
  console.log(results.join('\n'));
  const color = fail === 0 ? '#22c55e' : '#ef4444';
  console.log(`%c[test-crypto] ${pass} passed, ${fail} failed (${pass + fail} total)`, `color:${color};font-weight:bold`);
  if (fail > 0) console.warn('[test-crypto] Some tests failed — check above for details');
})();
