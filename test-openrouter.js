// test-openrouter.js — Verify OpenRouter as 4th AI provider
// Run: fetch('test-openrouter.js').then(r=>r.text()).then(s=>Function(s)())
(async function() {
  const results = [];
  let passed = 0, failed = 0;
  function assert(name, condition, detail) {
    if (condition) { passed++; results.push(`  PASS: ${name}`); }
    else { failed++; results.push(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('=== OpenRouter Integration Tests ===\n');

  // ─── 1. api.js source inspection ───
  console.log('1. api.js source inspection');
  const apiSrc = await fetch('js/api.js').then(r => r.text());
  assert('getOpenRouterKey exists', apiSrc.includes('function getOpenRouterKey()'));
  assert('saveOpenRouterKey exists', apiSrc.includes('function saveOpenRouterKey('));
  assert('hasOpenRouterKey exists', apiSrc.includes('function hasOpenRouterKey()'));
  assert('getOpenRouterModel exists', apiSrc.includes('function getOpenRouterModel()'));
  assert('setOpenRouterModel exists', apiSrc.includes('function setOpenRouterModel('));
  assert('getOpenRouterModelDisplay exists', apiSrc.includes('function getOpenRouterModelDisplay()'));
  assert('fetchOpenRouterModels exists', apiSrc.includes('function fetchOpenRouterModels('));
  assert('validateOpenRouterKey exists', apiSrc.includes('function validateOpenRouterKey('));
  assert('callOpenRouterAPI exists', apiSrc.includes('function callOpenRouterAPI('));
  assert('extraHeaders in helper signature', apiSrc.includes('extraHeaders = {}'));
  assert('extraHeaders spread in fetch headers', apiSrc.includes('...extraHeaders'));
  assert('hasAIProvider handles openrouter', apiSrc.includes("provider === 'openrouter') return hasOpenRouterKey()"));
  assert('callClaudeAPI handles openrouter', apiSrc.includes("provider === 'openrouter') return callOpenRouterAPI("));
  assert('callOpenRouterAPI sends HTTP-Referer', apiSrc.includes("'HTTP-Referer'"));
  assert('callOpenRouterAPI sends X-Title', apiSrc.includes("'X-Title': 'Lab Charts'"));
  assert('OpenRouter default model is claude-sonnet-4-6', apiSrc.includes("'anthropic/claude-sonnet-4-6'"));
  assert('OpenRouter API endpoint', apiSrc.includes('openrouter.ai/api/v1/chat/completions'));
  assert('OpenRouter models endpoint', apiSrc.includes('openrouter.ai/api/v1/models'));

  // ─── 2. schema.js + api.js: curated models + dynamic pricing ───
  console.log('\n2. Curated models + dynamic pricing');
  const schemaSrc = await fetch('js/schema.js').then(r => r.text());
  assert('MODEL_PRICING has openrouter block', schemaSrc.includes('openrouter:'));
  assert('Has openrouter _default fallback', schemaSrc.includes("'_default':") && schemaSrc.includes('approx: true'));
  assert('getModelPricing checks openrouter-pricing cache', schemaSrc.includes('labcharts-openrouter-pricing'));
  // Curated whitelist in api.js
  assert('OPENROUTER_CURATED whitelist exists', apiSrc.includes('OPENROUTER_CURATED'));
  assert('Curated: anthropic/claude-sonnet-4.6', apiSrc.includes("'anthropic/claude-sonnet-4.6'"));
  assert('Curated: anthropic/claude-opus-4.6', apiSrc.includes("'anthropic/claude-opus-4.6'"));
  assert('Curated: openai/gpt-5.2', apiSrc.includes("'openai/gpt-5.2'"));
  assert('Curated: google/gemini-3.1-pro', apiSrc.includes("'google/gemini-3.1-pro'"));
  assert('Curated: google/gemini-3-flash', apiSrc.includes("'google/gemini-3-flash'"));
  assert('Curated: deepseek/deepseek-v3.2', apiSrc.includes("'deepseek/deepseek-v3.2'"));
  assert('Curated: qwen/qwen3.5', apiSrc.includes("'qwen/qwen3.5'"));
  assert('Curated: x-ai/grok-4', apiSrc.includes("'x-ai/grok-4'"));
  // Exclusion list
  assert('OPENROUTER_EXCLUDE exists', apiSrc.includes('OPENROUTER_EXCLUDE'));
  assert('Excludes codex variants', apiSrc.includes("'codex'"));
  assert('Excludes audio variants', apiSrc.includes("'audio'"));
  assert('Excludes image variants', apiSrc.includes("'image'"));
  assert('Exclude filter applied in fetch', apiSrc.includes('OPENROUTER_EXCLUDE.some'));
  // Dynamic pricing extraction
  assert('fetchOpenRouterModels extracts pricing.prompt', apiSrc.includes('m.pricing.prompt'));
  assert('fetchOpenRouterModels converts to per-million', apiSrc.includes('* 1_000_000'));
  assert('fetchOpenRouterModels caches pricing', apiSrc.includes("'labcharts-openrouter-pricing'"));
  assert('getOpenRouterPricing function exists', apiSrc.includes('function getOpenRouterPricing('));
  assert('window.getOpenRouterPricing is function', typeof window.getOpenRouterPricing === 'function');
  // Dynamic pricing localStorage integration
  const oldPricing = localStorage.getItem('labcharts-openrouter-pricing');
  localStorage.setItem('labcharts-openrouter-pricing', JSON.stringify({
    'anthropic/claude-sonnet-4-6': { input: 3.00, output: 15.00 }
  }));
  const dynResult = window.getOpenRouterPricing('anthropic/claude-sonnet-4-6');
  assert('getOpenRouterPricing reads cached pricing', dynResult && dynResult.input === 3.00 && dynResult.output === 15.00);
  assert('getOpenRouterPricing returns null for unknown', window.getOpenRouterPricing('unknown/model') === null);
  if (oldPricing) localStorage.setItem('labcharts-openrouter-pricing', oldPricing);
  else localStorage.removeItem('labcharts-openrouter-pricing');

  // ─── 3. settings.js source inspection ───
  console.log('\n3. settings.js source inspection');
  const settingsSrc = await fetch('js/settings.js').then(r => r.text());
  assert('imports getOpenRouterKey', settingsSrc.includes('getOpenRouterKey'));
  assert('imports saveOpenRouterKey', settingsSrc.includes('saveOpenRouterKey'));
  assert('imports getOpenRouterModel', settingsSrc.includes('getOpenRouterModel'));
  assert('imports setOpenRouterModel', settingsSrc.includes('setOpenRouterModel'));
  assert('imports getOpenRouterModelDisplay', settingsSrc.includes('getOpenRouterModelDisplay'));
  assert('imports validateOpenRouterKey', settingsSrc.includes('validateOpenRouterKey'));
  assert('imports fetchOpenRouterModels', settingsSrc.includes('fetchOpenRouterModels'));
  assert('4th provider button with data-provider="openrouter"', settingsSrc.includes('data-provider="openrouter"'));
  assert('switchAIProvider(\'openrouter\') in onclick', settingsSrc.includes("switchAIProvider('openrouter')"));
  assert('renderAIProviderPanel handles openrouter', settingsSrc.includes("provider === 'openrouter'"));
  assert('handleSaveOpenRouterKey exists', settingsSrc.includes('function handleSaveOpenRouterKey()'));
  assert('handleRemoveOpenRouterKey exists', settingsSrc.includes('function handleRemoveOpenRouterKey()'));
  assert('renderOpenRouterModelDropdown exists', settingsSrc.includes('function renderOpenRouterModelDropdown('));
  assert('updateOpenRouterModelPricing exists', settingsSrc.includes('function updateOpenRouterModelPricing('));
  assert('openrouter-key-input element', settingsSrc.includes('openrouter-key-input'));
  assert('openrouter-model-area element', settingsSrc.includes('openrouter-model-area'));
  assert('openrouter-model-pricing element', settingsSrc.includes('openrouter-model-pricing'));
  assert('OpenRouter link to openrouter.ai/keys', settingsSrc.includes('openrouter.ai/keys'));
  assert('initSettingsModelFetch fetches OpenRouter', settingsSrc.includes('fetchOpenRouterModels(orKey)'));
  // Ordering: OpenRouter panel check before Venice in renderAIProviderPanel
  const orPanelIdx = settingsSrc.indexOf("provider === 'openrouter'");
  const venicePanelIdx = settingsSrc.indexOf("provider === 'venice'");
  assert('renderAIProviderPanel: openrouter before venice', orPanelIdx < venicePanelIdx, `openrouter@${orPanelIdx}, venice@${venicePanelIdx}`);
  assert('window exports handleSaveOpenRouterKey', settingsSrc.includes('handleSaveOpenRouterKey,'));
  assert('window exports handleRemoveOpenRouterKey', settingsSrc.includes('handleRemoveOpenRouterKey,'));
  assert('window exports renderOpenRouterModelDropdown', settingsSrc.includes('renderOpenRouterModelDropdown,'));
  assert('window exports updateOpenRouterModelPricing', settingsSrc.includes('updateOpenRouterModelPricing,'));

  // ─── 4. chat.js source inspection ───
  console.log('\n4. chat.js source inspection');
  const chatSrc = await fetch('js/chat.js').then(r => r.text());
  assert('chat.js imports getOpenRouterModel', chatSrc.includes('getOpenRouterModel'));
  assert('chat.js has openrouter model-ID case', chatSrc.includes("provider === 'openrouter' ? getOpenRouterModel()"));

  // ─── 5. pdf-import.js source inspection ───
  console.log('\n5. pdf-import.js source inspection');
  const pdfSrc = await fetch('js/pdf-import.js').then(r => r.text());
  assert('pdf-import imports getOpenRouterModel', pdfSrc.includes('getOpenRouterModel'));
  assert('pdf-import imports getOpenRouterModelDisplay', pdfSrc.includes('getOpenRouterModelDisplay'));
  assert('pdf-import has openrouter model-label case (costInfo display)', pdfSrc.includes("ci.provider === 'openrouter' ? getOpenRouterModelDisplay()"));
  assert('pdf-import has openrouter debug model-label', pdfSrc.includes("provider === 'openrouter' ? getOpenRouterModelDisplay()"));
  // Count OpenRouter model-ID ternaries (should be at least 2 for mid = prov === ...)
  const orModelCount = (pdfSrc.match(/prov === 'openrouter' \? getOpenRouterModel\(\)/g) || []).length;
  assert('pdf-import has 2 openrouter model-ID ternaries', orModelCount === 2, `found ${orModelCount}`);

  // ─── 6. service-worker.js ───
  console.log('\n6. service-worker.js');
  const swSrc = await fetch('service-worker.js').then(r => r.text());
  assert('SW cache is v38', swSrc.includes("labcharts-v42"));
  assert('SW bypasses openrouter.ai', swSrc.includes("openrouter.ai"));

  // ─── 7. site.html ───
  console.log('\n7. site.html');
  const siteSrc = await fetch('site.html').then(r => r.text());
  assert('site.html has OpenRouter card', siteSrc.includes('OpenRouter'));
  assert('site.html mentions many models', siteSrc.includes('many models'));
  assert('site.html grid is 5-col', siteSrc.includes('repeat(5,1fr)'));
  assert('site.html has 5 provider-cards', (siteSrc.match(/class="provider-card/g) || []).length === 5);
  assert('site.html heading says Five providers', siteSrc.includes('Five providers'));
  const orCardIdx = siteSrc.indexOf('<h3>OpenRouter</h3>');
  const veniceCardIdx = siteSrc.indexOf('<h3>Venice AI</h3>');
  assert('site.html: OpenRouter card before Venice card', orCardIdx < veniceCardIdx, `OpenRouter@${orCardIdx}, Venice@${veniceCardIdx}`);

  // ─── 8. Window function exports ───
  console.log('\n8. Window function exports');
  assert('window.getOpenRouterKey is function', typeof window.getOpenRouterKey === 'function');
  assert('window.saveOpenRouterKey is function', typeof window.saveOpenRouterKey === 'function');
  assert('window.hasOpenRouterKey is function', typeof window.hasOpenRouterKey === 'function');
  assert('window.getOpenRouterModel is function', typeof window.getOpenRouterModel === 'function');
  assert('window.setOpenRouterModel is function', typeof window.setOpenRouterModel === 'function');
  assert('window.getOpenRouterModelDisplay is function', typeof window.getOpenRouterModelDisplay === 'function');
  assert('window.fetchOpenRouterModels is function', typeof window.fetchOpenRouterModels === 'function');
  assert('window.validateOpenRouterKey is function', typeof window.validateOpenRouterKey === 'function');
  assert('window.callOpenRouterAPI is function', typeof window.callOpenRouterAPI === 'function');
  assert('window.handleSaveOpenRouterKey is function', typeof window.handleSaveOpenRouterKey === 'function');
  assert('window.handleRemoveOpenRouterKey is function', typeof window.handleRemoveOpenRouterKey === 'function');
  assert('window.renderOpenRouterModelDropdown is function', typeof window.renderOpenRouterModelDropdown === 'function');
  assert('window.updateOpenRouterModelPricing is function', typeof window.updateOpenRouterModelPricing === 'function');

  // ─── 9. Key/model management (localStorage) ───
  console.log('\n9. Key/model management');
  // Save and retrieve key
  const oldKey = localStorage.getItem('labcharts-openrouter-key');
  window.saveOpenRouterKey('test-key-123');
  assert('saveOpenRouterKey stores to localStorage', localStorage.getItem('labcharts-openrouter-key') === 'test-key-123');
  assert('getOpenRouterKey returns saved key', window.getOpenRouterKey() === 'test-key-123');
  assert('hasOpenRouterKey returns true with key', window.hasOpenRouterKey() === true);
  // Remove key
  localStorage.removeItem('labcharts-openrouter-key');
  assert('hasOpenRouterKey returns false without key', window.hasOpenRouterKey() === false);
  assert('getOpenRouterKey returns empty without key', window.getOpenRouterKey() === '');
  // Restore original
  if (oldKey) localStorage.setItem('labcharts-openrouter-key', oldKey);

  // Model defaults
  const oldModel = localStorage.getItem('labcharts-openrouter-model');
  localStorage.removeItem('labcharts-openrouter-model');
  assert('getOpenRouterModel defaults to anthropic/claude-sonnet-4-6', window.getOpenRouterModel() === 'anthropic/claude-sonnet-4-6');
  window.setOpenRouterModel('openai/gpt-4o');
  assert('setOpenRouterModel persists', window.getOpenRouterModel() === 'openai/gpt-4o');
  // Restore
  if (oldModel) localStorage.setItem('labcharts-openrouter-model', oldModel);
  else localStorage.removeItem('labcharts-openrouter-model');

  // ─── 10. hasAIProvider with openrouter ───
  console.log('\n10. hasAIProvider integration');
  const oldProvider = localStorage.getItem('labcharts-ai-provider');
  const oldORKey = localStorage.getItem('labcharts-openrouter-key');
  window.setAIProvider('openrouter');
  localStorage.removeItem('labcharts-openrouter-key');
  assert('hasAIProvider false for openrouter without key', window.hasAIProvider() === false);
  window.saveOpenRouterKey('sk-or-test');
  assert('hasAIProvider true for openrouter with key', window.hasAIProvider() === true);
  // Restore
  if (oldProvider) localStorage.setItem('labcharts-ai-provider', oldProvider);
  else localStorage.removeItem('labcharts-ai-provider');
  if (oldORKey) localStorage.setItem('labcharts-openrouter-key', oldORKey);
  else localStorage.removeItem('labcharts-openrouter-key');

  // ─── 11. Settings modal DOM ───
  console.log('\n11. Settings modal DOM');
  window.openSettingsModal('ai');
  await new Promise(r => setTimeout(r, 100));
  const providerBtns = document.querySelectorAll('.ai-provider-btn');
  assert('5 provider buttons in settings', providerBtns.length === 5, `found ${providerBtns.length}`);
  const providerValues = Array.from(providerBtns).map(b => b.dataset.provider);
  assert('provider buttons include anthropic', providerValues.includes('anthropic'));
  assert('provider buttons include venice', providerValues.includes('venice'));
  assert('provider buttons include ollama', providerValues.includes('ollama'));
  assert('provider buttons include openrouter', providerValues.includes('openrouter'));
  assert('button order: OpenRouter before Venice', providerValues.indexOf('openrouter') < providerValues.indexOf('venice'), `openrouter@${providerValues.indexOf('openrouter')}, venice@${providerValues.indexOf('venice')}`);
  // Switch to OpenRouter panel
  window.switchAIProvider('openrouter');
  await new Promise(r => setTimeout(r, 100));
  assert('openrouter-key-input exists in DOM', !!document.getElementById('openrouter-key-input'));
  assert('openrouter-key-status exists in DOM', !!document.getElementById('openrouter-key-status'));
  assert('openrouter-model-area exists in DOM', !!document.getElementById('openrouter-model-area'));
  assert('save-openrouter-key-btn exists in DOM', !!document.getElementById('save-openrouter-key-btn'));
  // Restore provider and close settings
  if (oldProvider) window.setAIProvider(oldProvider);
  window.closeSettingsModal();

  // ─── 12. Model pricing ───
  console.log('\n12. Model pricing');
  // Seed dynamic pricing so hint shows exact values
  const savedPr = localStorage.getItem('labcharts-openrouter-pricing');
  localStorage.setItem('labcharts-openrouter-pricing', JSON.stringify({
    'anthropic/claude-sonnet-4-6': { input: 3.00, output: 15.00 }
  }));
  const pricing = window.renderModelPricingHint('openrouter', 'anthropic/claude-sonnet-4-6');
  assert('renderModelPricingHint returns content for openrouter', pricing.length > 0);
  assert('pricing includes dollar amounts', pricing.includes('$'));
  assert('pricing is not approximate with cached data', !pricing.includes('~'));
  // Unknown model falls back to _default (approximate)
  const unknownPricing = window.renderModelPricingHint('openrouter', 'unknown/model-xyz');
  assert('unknown model pricing is approximate', unknownPricing.includes('~'));
  // Restore
  if (savedPr) localStorage.setItem('labcharts-openrouter-pricing', savedPr);
  else localStorage.removeItem('labcharts-openrouter-pricing');
  const ollamaPricing = window.renderModelPricingHint('ollama', '');
  assert('ollama pricing still says Free', ollamaPricing.includes('Free'));

  // ─── 13. Key removal clears pricing cache ───
  console.log('\n13. Key removal clears pricing cache');
  const rmSrc = await fetch('js/settings.js').then(r => r.text());
  assert('handleRemoveOpenRouterKey clears pricing cache', rmSrc.includes("removeItem('labcharts-openrouter-pricing')"));

  // ═══ SUMMARY ═══
  console.log('\n' + results.join('\n'));
  console.log(`\n=== ${passed} passed, ${failed} failed, ${passed + failed} total ===`);
  if (failed === 0) console.log('ALL TESTS PASSED');
  else console.warn(`${failed} test(s) failed`);
})();
