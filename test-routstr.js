// test-routstr.js — Verify Routstr as 5th AI provider
// Run: fetch('test-routstr.js').then(r=>r.text()).then(s=>Function(s)())
(async function() {
  const results = [];
  let passed = 0, failed = 0;
  function assert(name, condition, detail) {
    if (condition) { passed++; results.push(`  PASS: ${name}`); }
    else { failed++; results.push(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('=== Routstr Integration Tests ===\n');

  // ─── 1. Window exports ───
  console.log('1. Window exports');
  assert('window.getRoutstrKey is function', typeof window.getRoutstrKey === 'function');
  assert('window.saveRoutstrKey is function', typeof window.saveRoutstrKey === 'function');
  assert('window.hasRoutstrKey is function', typeof window.hasRoutstrKey === 'function');
  assert('window.getRoutstrModel is function', typeof window.getRoutstrModel === 'function');
  assert('window.setRoutstrModel is function', typeof window.setRoutstrModel === 'function');
  assert('window.getRoutstrModelDisplay is function', typeof window.getRoutstrModelDisplay === 'function');
  assert('window.fetchRoutstrModels is function', typeof window.fetchRoutstrModels === 'function');
  assert('window.validateRoutstrKey is function', typeof window.validateRoutstrKey === 'function');
  assert('window.callRoutstrAPI is function', typeof window.callRoutstrAPI === 'function');
  assert('window.getRoutstrPricing is function', typeof window.getRoutstrPricing === 'function');
  assert('window.handleSaveRoutstrKey is function', typeof window.handleSaveRoutstrKey === 'function');
  assert('window.handleRemoveRoutstrKey is function', typeof window.handleRemoveRoutstrKey === 'function');
  assert('window.renderRoutstrModelDropdown is function', typeof window.renderRoutstrModelDropdown === 'function');
  assert('window.updateRoutstrModelPricing is function', typeof window.updateRoutstrModelPricing === 'function');

  // ─── 2. hasAIProvider recognizes routstr ───
  console.log('\n2. hasAIProvider recognizes routstr');
  const oldProvider = localStorage.getItem('labcharts-ai-provider');
  const oldKey = localStorage.getItem('labcharts-routstr-key');
  window.setAIProvider('routstr');
  localStorage.removeItem('labcharts-routstr-key');
  assert('hasAIProvider false for routstr without key', window.hasAIProvider() === false);
  window.saveRoutstrKey('sk-test-123');
  assert('hasAIProvider true for routstr with key', window.hasAIProvider() === true);
  // Restore
  if (oldProvider) localStorage.setItem('labcharts-ai-provider', oldProvider);
  else localStorage.removeItem('labcharts-ai-provider');
  if (oldKey) localStorage.setItem('labcharts-routstr-key', oldKey);
  else localStorage.removeItem('labcharts-routstr-key');

  // ─── 3. callClaudeAPI source contains routstr branch ───
  console.log('\n3. api.js source inspection');
  const apiSrc = await fetch('js/api.js').then(r => r.text());
  assert('getRoutstrKey exists', apiSrc.includes('function getRoutstrKey()'));
  assert('saveRoutstrKey exists', apiSrc.includes('function saveRoutstrKey('));
  assert('hasRoutstrKey exists', apiSrc.includes('function hasRoutstrKey()'));
  assert('getRoutstrModel exists', apiSrc.includes('function getRoutstrModel()'));
  assert('setRoutstrModel exists', apiSrc.includes('function setRoutstrModel('));
  assert('getRoutstrModelDisplay exists', apiSrc.includes('function getRoutstrModelDisplay()'));
  assert('fetchRoutstrModels exists', apiSrc.includes('function fetchRoutstrModels('));
  assert('validateRoutstrKey exists', apiSrc.includes('function validateRoutstrKey('));
  assert('callRoutstrAPI exists', apiSrc.includes('function callRoutstrAPI('));
  assert('getRoutstrPricing exists', apiSrc.includes('function getRoutstrPricing('));
  assert('hasAIProvider handles routstr', apiSrc.includes("provider === 'routstr') return hasRoutstrKey()"));
  assert('callClaudeAPI handles routstr', apiSrc.includes("provider === 'routstr') return callRoutstrAPI("));
  assert('Routstr API endpoint', apiSrc.includes('api.routstr.com/v1/chat/completions'));
  assert('Routstr models endpoint', apiSrc.includes('api.routstr.com/v1/models'));
  assert('Routstr default model is claude-sonnet', apiSrc.includes("'anthropic/claude-sonnet-4-6'"));

  // ─── 4. Settings UI ───
  console.log('\n4. Settings UI');
  const settingsSrc = await fetch('js/settings.js').then(r => r.text());
  assert('imports getRoutstrKey', settingsSrc.includes('getRoutstrKey'));
  assert('imports saveRoutstrKey', settingsSrc.includes('saveRoutstrKey'));
  assert('imports getRoutstrModel', settingsSrc.includes('getRoutstrModel'));
  assert('imports setRoutstrModel', settingsSrc.includes('setRoutstrModel'));
  assert('imports getRoutstrModelDisplay', settingsSrc.includes('getRoutstrModelDisplay'));
  assert('imports validateRoutstrKey', settingsSrc.includes('validateRoutstrKey'));
  assert('imports fetchRoutstrModels', settingsSrc.includes('fetchRoutstrModels'));
  assert('provider button data-provider="routstr"', settingsSrc.includes('data-provider="routstr"'));
  assert("switchAIProvider('routstr') in onclick", settingsSrc.includes("switchAIProvider('routstr')"));
  assert('renderAIProviderPanel handles routstr', settingsSrc.includes("provider === 'routstr'"));
  assert('handleSaveRoutstrKey exists', settingsSrc.includes('function handleSaveRoutstrKey()'));
  assert('handleRemoveRoutstrKey exists', settingsSrc.includes('function handleRemoveRoutstrKey()'));
  assert('renderRoutstrModelDropdown exists', settingsSrc.includes('function renderRoutstrModelDropdown('));
  assert('updateRoutstrModelPricing exists', settingsSrc.includes('function updateRoutstrModelPricing('));
  assert('routstr-key-input element', settingsSrc.includes('routstr-key-input'));
  assert('routstr-model-area element', settingsSrc.includes('routstr-model-area'));
  assert('Routstr link to routstr.com', settingsSrc.includes('routstr.com'));
  assert('initSettingsModelFetch fetches Routstr', settingsSrc.includes('fetchRoutstrModels(routstrKey)'));
  // Ordering: Routstr panel check between OpenRouter and Venice
  const routstrPanelIdx = settingsSrc.indexOf("provider === 'routstr'");
  const orPanelIdx = settingsSrc.indexOf("provider === 'openrouter'");
  const venicePanelIdx = settingsSrc.indexOf("provider === 'venice'");
  assert('renderAIProviderPanel: routstr after openrouter', routstrPanelIdx > orPanelIdx);
  assert('renderAIProviderPanel: routstr before venice', routstrPanelIdx < venicePanelIdx);
  assert('window exports handleSaveRoutstrKey', settingsSrc.includes('handleSaveRoutstrKey,'));
  assert('window exports handleRemoveRoutstrKey', settingsSrc.includes('handleRemoveRoutstrKey,'));
  assert('window exports renderRoutstrModelDropdown', settingsSrc.includes('renderRoutstrModelDropdown,'));
  assert('window exports updateRoutstrModelPricing', settingsSrc.includes('updateRoutstrModelPricing,'));

  // ─── 5. GLOBAL_SETTINGS_KEYS includes routstr ───
  console.log('\n5. Backup keys');
  const cryptoSrc = await fetch('js/crypto.js').then(r => r.text());
  assert('GLOBAL_SETTINGS_KEYS has routstr-key', cryptoSrc.includes("'labcharts-routstr-key'"));
  assert('GLOBAL_SETTINGS_KEYS has routstr-model', cryptoSrc.includes("'labcharts-routstr-model'"));

  // ─── 6. MODEL_PRICING.routstr exists ───
  console.log('\n6. Model pricing');
  const schemaSrc = await fetch('js/schema.js').then(r => r.text());
  assert('MODEL_PRICING has routstr block', schemaSrc.includes('routstr:'));
  assert('routstr has _default fallback', schemaSrc.includes('routstr:') && schemaSrc.includes('approx: true'));
  assert('getModelPricing checks routstr-pricing cache', schemaSrc.includes('labcharts-routstr-pricing'));
  // Dynamic pricing
  const savedPr = localStorage.getItem('labcharts-routstr-pricing');
  localStorage.setItem('labcharts-routstr-pricing', JSON.stringify({
    'anthropic/claude-sonnet-4-6': { input: 3.00, output: 15.00 }
  }));
  const dynResult = window.getRoutstrPricing('anthropic/claude-sonnet-4-6');
  assert('getRoutstrPricing reads cached pricing', dynResult && dynResult.input === 3.00 && dynResult.output === 15.00);
  assert('getRoutstrPricing returns null for unknown', window.getRoutstrPricing('unknown/model') === null);
  if (savedPr) localStorage.setItem('labcharts-routstr-pricing', savedPr);
  else localStorage.removeItem('labcharts-routstr-pricing');

  // ─── 7. Service worker bypasses api.routstr.com ───
  console.log('\n7. Service worker');
  const swSrc = await fetch('service-worker.js').then(r => r.text());
  assert('SW cache is v49', swSrc.includes('labcharts-v49'));
  assert('SW bypasses api.routstr.com', swSrc.includes('api.routstr.com'));

  // ─── 8. getModelPricing checks routstr dynamic pricing ───
  console.log('\n8. getModelPricing integration');
  localStorage.setItem('labcharts-routstr-pricing', JSON.stringify({
    'test/model': { input: 2.00, output: 8.00 }
  }));
  const pricing = window.renderModelPricingHint('routstr', 'test/model');
  assert('renderModelPricingHint returns content for routstr', pricing.length > 0);
  assert('pricing includes dollar amounts', pricing.includes('$'));
  // Unknown model falls back to _default (approximate)
  const unknownPricing = window.renderModelPricingHint('routstr', 'unknown/model-xyz');
  assert('unknown model pricing is approximate', unknownPricing.includes('~'));
  localStorage.removeItem('labcharts-routstr-pricing');

  // ─── 9. Settings modal DOM — 5 provider buttons ───
  console.log('\n9. Settings modal DOM');
  const savedProvider = localStorage.getItem('labcharts-ai-provider');
  window.openSettingsModal('ai');
  await new Promise(r => setTimeout(r, 100));
  const providerBtns = document.querySelectorAll('.ai-provider-btn');
  assert('5 provider buttons in settings', providerBtns.length === 5, `found ${providerBtns.length}`);
  const providerValues = Array.from(providerBtns).map(b => b.dataset.provider);
  assert('provider buttons include routstr', providerValues.includes('routstr'));
  assert('button order: routstr after openrouter', providerValues.indexOf('routstr') > providerValues.indexOf('openrouter'));
  assert('button order: routstr before venice', providerValues.indexOf('routstr') < providerValues.indexOf('venice'));
  // Switch to Routstr panel
  window.switchAIProvider('routstr');
  await new Promise(r => setTimeout(r, 100));
  assert('routstr-key-input exists in DOM', !!document.getElementById('routstr-key-input'));
  assert('routstr-key-status exists in DOM', !!document.getElementById('routstr-key-status'));
  assert('routstr-model-area exists in DOM', !!document.getElementById('routstr-model-area'));
  assert('save-routstr-key-btn exists in DOM', !!document.getElementById('save-routstr-key-btn'));
  // Restore provider and close settings
  if (savedProvider) window.setAIProvider(savedProvider);
  else localStorage.removeItem('labcharts-ai-provider');
  window.closeSettingsModal();

  // ─── 10. Key/model management (localStorage) ───
  console.log('\n10. Key/model management');
  const origKey = localStorage.getItem('labcharts-routstr-key');
  window.saveRoutstrKey('test-key-456');
  assert('saveRoutstrKey stores to localStorage', localStorage.getItem('labcharts-routstr-key') === 'test-key-456');
  assert('getRoutstrKey returns saved key', window.getRoutstrKey() === 'test-key-456');
  assert('hasRoutstrKey returns true with key', window.hasRoutstrKey() === true);
  localStorage.removeItem('labcharts-routstr-key');
  assert('hasRoutstrKey returns false without key', window.hasRoutstrKey() === false);
  assert('getRoutstrKey returns empty without key', window.getRoutstrKey() === '');
  if (origKey) localStorage.setItem('labcharts-routstr-key', origKey);
  // Model defaults
  const origModel = localStorage.getItem('labcharts-routstr-model');
  localStorage.removeItem('labcharts-routstr-model');
  assert('getRoutstrModel defaults to anthropic/claude-sonnet-4-6', window.getRoutstrModel() === 'anthropic/claude-sonnet-4-6');
  window.setRoutstrModel('openai/gpt-4o');
  assert('setRoutstrModel persists', window.getRoutstrModel() === 'openai/gpt-4o');
  if (origModel) localStorage.setItem('labcharts-routstr-model', origModel);
  else localStorage.removeItem('labcharts-routstr-model');

  // ─── 11. Key removal clears all caches ───
  console.log('\n11. Key removal clears caches');
  const rmSrc = await fetch('js/settings.js').then(r => r.text());
  assert('handleRemoveRoutstrKey clears key', rmSrc.includes("removeItem('labcharts-routstr-key')"));
  assert('handleRemoveRoutstrKey clears models', rmSrc.includes("removeItem('labcharts-routstr-models')"));
  assert('handleRemoveRoutstrKey clears model', rmSrc.includes("removeItem('labcharts-routstr-model')"));
  assert('handleRemoveRoutstrKey clears pricing', rmSrc.includes("removeItem('labcharts-routstr-pricing')"));

  // ─── 12. site.html ───
  console.log('\n12. site.html');
  const siteSrc = await fetch('site.html').then(r => r.text());
  assert('site.html has Routstr card', siteSrc.includes('<h3>Routstr</h3>'));
  assert('site.html mentions eCash', siteSrc.includes('eCash'));
  assert('site.html mentions Lightning Bitcoin', siteSrc.includes('Lightning Bitcoin'));
  assert('site.html has 5 provider-cards', (siteSrc.match(/class="provider-card/g) || []).length === 5);
  assert('site.html heading says Five providers', siteSrc.includes('Five providers'));
  assert('site.html stats say 5 AI providers', siteSrc.includes('>5</div>'));
  const routstrCardIdx = siteSrc.indexOf('<h3>Routstr</h3>');
  const orCardIdx2 = siteSrc.indexOf('<h3>OpenRouter</h3>');
  const veniceCardIdx2 = siteSrc.indexOf('<h3>Venice AI</h3>');
  assert('site.html: Routstr card after OpenRouter', routstrCardIdx > orCardIdx2);
  assert('site.html: Routstr card before Venice', routstrCardIdx < veniceCardIdx2);

  // ─── 13. chat.js + pdf-import.js include routstr ───
  console.log('\n13. Downstream modules');
  const chatSrc = await fetch('js/chat.js').then(r => r.text());
  assert('chat.js imports getRoutstrModel', chatSrc.includes('getRoutstrModel'));
  assert('chat.js has routstr model-ID case', chatSrc.includes("provider === 'routstr' ? getRoutstrModel()"));
  const pdfSrc = await fetch('js/pdf-import.js').then(r => r.text());
  assert('pdf-import imports getRoutstrModel', pdfSrc.includes('getRoutstrModel'));
  assert('pdf-import imports getRoutstrModelDisplay', pdfSrc.includes('getRoutstrModelDisplay'));
  assert('pdf-import has routstr model-display ternary', pdfSrc.includes("'routstr' ? getRoutstrModelDisplay()"));
  assert('pdf-import has routstr model-ID ternary', pdfSrc.includes("'routstr' ? getRoutstrModel()"));

  // ═══ SUMMARY ═══
  console.log('\n' + results.join('\n'));
  console.log(`\n=== ${passed} passed, ${failed} failed, ${passed + failed} total ===`);
  if (failed === 0) console.log('ALL TESTS PASSED');
  else console.warn(`${failed} test(s) failed`);
})();
