// test-routstr.js — Verify Routstr is correctly disabled (all code behind ROUTSTR DISABLED comments)
// Run: fetch('tests/test-routstr.js').then(r=>r.text()).then(s=>Function(s)())
(async function() {
  const results = [];
  let passed = 0, failed = 0;
  function assert(name, condition, detail) {
    if (condition) { passed++; results.push(`  PASS: ${name}`); }
    else { failed++; results.push(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('=== Routstr Disabled State Tests ===\n');

  // ─── 1. Window exports should NOT exist (all disabled) ───
  console.log('1. Window exports are absent');
  assert('window.getRoutstrKey is undefined', typeof window.getRoutstrKey === 'undefined');
  assert('window.saveRoutstrKey is undefined', typeof window.saveRoutstrKey === 'undefined');
  assert('window.hasRoutstrKey is undefined', typeof window.hasRoutstrKey === 'undefined');
  assert('window.getRoutstrModel is undefined', typeof window.getRoutstrModel === 'undefined');
  assert('window.setRoutstrModel is undefined', typeof window.setRoutstrModel === 'undefined');
  assert('window.getRoutstrModelDisplay is undefined', typeof window.getRoutstrModelDisplay === 'undefined');
  assert('window.fetchRoutstrModels is undefined', typeof window.fetchRoutstrModels === 'undefined');
  assert('window.validateRoutstrKey is undefined', typeof window.validateRoutstrKey === 'undefined');
  assert('window.callRoutstrAPI is undefined', typeof window.callRoutstrAPI === 'undefined');
  assert('window.getRoutstrPricing is undefined', typeof window.getRoutstrPricing === 'undefined');
  assert('window.handleSaveRoutstrKey is undefined', typeof window.handleSaveRoutstrKey === 'undefined');
  assert('window.handleRemoveRoutstrKey is undefined', typeof window.handleRemoveRoutstrKey === 'undefined');
  assert('window.renderRoutstrModelDropdown is undefined', typeof window.renderRoutstrModelDropdown === 'undefined');
  assert('window.updateRoutstrModelPricing is undefined', typeof window.updateRoutstrModelPricing === 'undefined');

  // ─── 2. Source files have ROUTSTR DISABLED markers ───
  console.log('\n2. ROUTSTR DISABLED markers present');
  const apiSrc = await fetch('js/api.js').then(r => r.text());
  assert('api.js has ROUTSTR DISABLED comment', apiSrc.includes('ROUTSTR DISABLED'));
  assert('api.js has disabled callRoutstrAPI', apiSrc.includes('callRoutstrAPI'));
  const settingsSrc = await fetch('js/settings.js').then(r => r.text());
  assert('settings.js has ROUTSTR DISABLED comment', settingsSrc.includes('ROUTSTR DISABLED'));
  const swSrc = await fetch('service-worker.js').then(r => r.text());
  assert('SW has ROUTSTR DISABLED comment', swSrc.includes('ROUTSTR DISABLED'));

  // ─── 3. Settings modal shows 4 provider buttons (not 5) ───
  console.log('\n3. Settings UI excludes Routstr');
  const savedProvider = localStorage.getItem('labcharts-ai-provider');
  window.openSettingsModal('ai');
  await new Promise(r => setTimeout(r, 100));
  const providerBtns = document.querySelectorAll('.ai-provider-btn');
  assert('4 provider buttons in settings', providerBtns.length === 4, `found ${providerBtns.length}`);
  const providerValues = Array.from(providerBtns).map(b => b.dataset.provider);
  assert('provider buttons do NOT include routstr', !providerValues.includes('routstr'));
  if (savedProvider) window.setAIProvider(savedProvider);
  else localStorage.removeItem('labcharts-ai-provider');
  window.closeSettingsModal();

  // ═══ SUMMARY ═══
  console.log('\n' + results.join('\n'));
  console.log(`\n=== ${passed} passed, ${failed} failed, ${passed + failed} total ===`);
  if (failed === 0) console.log('ALL TESTS PASSED');
  else console.warn(`${failed} test(s) failed`);
})();
