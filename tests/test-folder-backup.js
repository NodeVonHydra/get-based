// test-folder-backup.js — Browser-based verification for folder backup feature
// Run: fetch('tests/test-folder-backup.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  const results = [];
  function assert(name, condition, detail) {
    if (condition) { pass++; results.push(`  PASS: ${name}`); }
    else { fail++; results.push(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('%c[test-folder-backup] Starting folder backup verification...', 'color:#6366f1;font-weight:bold');

  // ═══════════════════════════════════════════════
  // 1. Window exports exist
  // ═══════════════════════════════════════════════
  assert('window.initFolderBackup exists', typeof window.initFolderBackup === 'function');
  assert('window.pickFolderForBackup exists', typeof window.pickFolderForBackup === 'function');
  assert('window.reauthorizeFolderBackup exists', typeof window.reauthorizeFolderBackup === 'function');
  assert('window.removeFolderBackup exists', typeof window.removeFolderBackup === 'function');
  assert('window.getFolderBackupState exists', typeof window.getFolderBackupState === 'function');
  assert('window.buildAllDataBundle exists', typeof window.buildAllDataBundle === 'function');

  // ═══════════════════════════════════════════════
  // 2. getFolderBackupState() returns correct shape
  // ═══════════════════════════════════════════════
  try {
    const st = window.getFolderBackupState();
    assert('getFolderBackupState returns object', typeof st === 'object' && st !== null);
    assert('state has supported boolean', typeof st.supported === 'boolean');
    assert('state has folderName (string or null)', st.folderName === null || typeof st.folderName === 'string');
    assert('state has permissionLost boolean', typeof st.permissionLost === 'boolean');
    assert('state has lastBackup (string or null)', st.lastBackup === null || typeof st.lastBackup === 'string');
  } catch (e) {
    assert('getFolderBackupState shape', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 3. buildAllDataBundle() returns valid JSON
  // ═══════════════════════════════════════════════
  try {
    const json = await window.buildAllDataBundle();
    if (json) {
      assert('buildAllDataBundle returns string', typeof json === 'string');
      const parsed = JSON.parse(json);
      assert('bundle has version field', parsed.version === 2);
      assert('bundle has type database', parsed.type === 'database');
      assert('bundle has exportedAt', typeof parsed.exportedAt === 'string');
      assert('bundle has profiles array', Array.isArray(parsed.profiles));
    } else {
      assert('buildAllDataBundle returns null (no profiles)', true);
    }
  } catch (e) {
    assert('buildAllDataBundle validity', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 4. renderBackupSection includes folder UI
  // ═══════════════════════════════════════════════
  try {
    const html = window.renderBackupSection();
    assert('renderBackupSection has folder section container', html.includes('backup-folder-section'));
    // On Chromium, should have folder UI content; on Firefox/Safari, the inner HTML is empty
    const st = window.getFolderBackupState();
    if (st.supported) {
      assert('Folder section has description text', html.includes('backup-folder-desc'));
      assert('Folder section has set/change button', html.includes('pickFolderForBackup'));
    } else {
      assert('Folder section hidden on unsupported browser', !html.includes('backup-folder-desc'));
    }
  } catch (e) {
    assert('renderBackupSection folder UI', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 5. IndexedDB v2 has folder-handle store
  // ═══════════════════════════════════════════════
  try {
    const db = await window.openBackupDB();
    assert('IndexedDB has folder-handle store', db.objectStoreNames.contains('folder-handle'));
    assert('IndexedDB still has snapshots store', db.objectStoreNames.contains('snapshots'));
  } catch (e) {
    assert('IndexedDB v2 stores', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 6. CSS has folder backup styles
  // ═══════════════════════════════════════════════
  try {
    const cssText = await fetch('styles.css').then(r => r.text());
    assert('CSS has .backup-folder-section', cssText.includes('.backup-folder-section'));
    assert('CSS has .backup-folder-desc', cssText.includes('.backup-folder-desc'));
    assert('CSS has .backup-folder-status', cssText.includes('.backup-folder-status'));
    assert('CSS has .backup-folder-status-ok', cssText.includes('.backup-folder-status-ok'));
    assert('CSS has .backup-folder-status-warn', cssText.includes('.backup-folder-status-warn'));
    assert('CSS has .backup-folder-meta', cssText.includes('.backup-folder-meta'));
  } catch (e) {
    assert('CSS folder backup styles', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 7. crypto.js source has folder backup functions
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/crypto.js').then(r => r.text());
    assert('crypto.js has initFolderBackup', src.includes('async function initFolderBackup'));
    assert('crypto.js has pickFolderForBackup', src.includes('async function pickFolderForBackup'));
    assert('crypto.js has reauthorizeFolderBackup', src.includes('async function reauthorizeFolderBackup'));
    assert('crypto.js has removeFolderBackup', src.includes('function removeFolderBackup'));
    assert('crypto.js has getFolderBackupState', src.includes('function getFolderBackupState'));
    assert('crypto.js has writeFolderBackup', src.includes('async function writeFolderBackup'));
    assert('crypto.js has showDirectoryPicker check', src.includes('showDirectoryPicker'));
    assert('crypto.js has folder-handle store constant', src.includes("'folder-handle'"));
    assert('performAutoBackup calls writeFolderBackup', src.includes('writeFolderBackup()'));
  } catch (e) {
    assert('crypto.js source inspection', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 8. main.js calls initFolderBackup
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/main.js').then(r => r.text());
    assert('main.js imports initFolderBackup', src.includes('initFolderBackup'));
    assert('main.js awaits initFolderBackup', src.includes('await initFolderBackup()'));
  } catch (e) {
    assert('main.js folder backup init', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 9. export.js has buildAllDataBundle
  // ═══════════════════════════════════════════════
  try {
    const src = await fetch('js/export.js').then(r => r.text());
    assert('export.js has buildAllDataBundle function', src.includes('async function buildAllDataBundle'));
    assert('export.js exposes buildAllDataBundle on window', src.includes('buildAllDataBundle'));
    assert('exportAllDataJSON uses buildAllDataBundle', src.includes('await buildAllDataBundle()'));
  } catch (e) {
    assert('export.js buildAllDataBundle', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════
  console.log(results.join('\n'));
  const color = fail === 0 ? '#22c55e' : '#ef4444';
  console.log(`%c[test-folder-backup] ${pass} passed, ${fail} failed (${pass + fail} total)`, `color:${color};font-weight:bold`);
  if (fail > 0) console.warn('[test-folder-backup] Some tests failed — check above for details');
})();
