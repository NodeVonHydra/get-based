// test-prelab.js — Verify pre-lab onboarding: context cards → test recommendations
// Run: fetch('tests/test-prelab.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`%c PASS %c ${name}`, 'background:#22c55e;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
    else { fail++; console.error(`%c FAIL %c ${name}`, 'background:#ef4444;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
  }

  console.log('%c Pre-Lab Onboarding Tests ', 'background:#6366f1;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px');

  // ═══════════════════════════════════════
  // 1. buildLabContext() — no-data path
  // ═══════════════════════════════════════
  console.log('%c 1. buildLabContext() No-Data Path ', 'font-weight:bold;color:#f59e0b');

  const chatSrc = await fetch('js/chat.js').then(r => r.text());

  assert('No sentinel return string', !chatSrc.includes("return 'No lab data is currently loaded for this profile.'"),
    'The old sentinel early-return should be removed');
  assert('hasLabData variable declared', chatSrc.includes('const hasLabData = data.dates.length > 0 || Object.values(data.categories).some(c => c.singleDate)'),
    'Should compute hasLabData from dates + singleDate categories');
  assert('No-data header includes profile context', chatSrc.includes("Profile context (sex:"),
    'No-data header should say "Profile context" not "Lab data"');
  assert('No-data NOTE recommends tests and encourages all cards', chatSrc.includes('recommend which blood panels') && chatSrc.includes('encourage filling all of them'),
    'NOTE should instruct AI to recommend panels and push for all cards');
  assert('No-data path flags missing demographics', chatSrc.includes('missingDemo') && chatSrc.includes("urge the user to set"),
    'Should add IMPORTANT warning when sex/DOB missing');
  assert('Lab values section gated by hasLabData', chatSrc.includes('if (hasLabData) {\n    const rangeLabel'),
    'Lab values + flagged results should be wrapped in if (hasLabData)');
  assert('Flagged results inside hasLabData guard', chatSrc.includes("const flags = getAllFlaggedMarkers(data);\n    if (flags.length > 0)"),
    'Flagged results should be inside the hasLabData block');
  assert('Staleness uses hasLabData guard', chatSrc.includes('if (hasLabData && data.dates.length > 0)'),
    'Staleness signal should check hasLabData first');

  // Sections 5-16 (notes, conditions, supplements, cycle, lifestyle cards) should NOT be gated by hasLabData
  assert('User Notes section not gated by hasLabData', chatSrc.includes("// ── 5. User Notes ──\n  const notes"),
    'User Notes should be at top level, not inside hasLabData block');
  assert('Medical Conditions section not gated by hasLabData', chatSrc.includes("// ── 6. Medical Conditions"),
    'Conditions should serialize without lab data');
  assert('Diet section not gated by hasLabData', chatSrc.includes("// ── 9. Diet"),
    'Diet should serialize without lab data');

  // ═══════════════════════════════════════
  // 2. Context-aware chat prompts
  // ═══════════════════════════════════════
  console.log('%c 2. Context-Aware Chat Prompts ', 'font-weight:bold;color:#f59e0b');

  assert('_getNoDataPrompts helper exists', chatSrc.includes('function _getNoDataPrompts()'),
    'Module-private helper should exist');
  assert('0-cards prompts: "What should I tell you"', chatSrc.includes("'What should I tell you about myself first?'"),
    'Should have card-filling encouragement prompt');
  assert('0-cards prompts: "What blood tests"', chatSrc.includes("'What blood tests are worth getting?'"),
    'Should have general test advice prompt');
  assert('0-cards prompts: "Where do I start"', chatSrc.includes("'Where do I start with optimizing my health?'"),
    'Should have getting-started prompt');
  assert('Some-cards prompts: "Based on my profile"', chatSrc.includes("'Based on my profile, what blood tests should I get?'"),
    'Should have personalized recommendation prompt');
  assert('Some-cards prompts: "What panels"', chatSrc.includes("'What panels would help with my health goals?'"),
    'Should have goals-based panel prompt');
  assert('Some-cards prompts: "Tell my doctor"', chatSrc.includes("'What should I tell my doctor to test for?'"),
    'Should have doctor-facing prompt');
  assert('Some-cards prompts: "Most relevant"', chatSrc.includes("'Which markers are most relevant to my lifestyle?'"),
    'Should have lifestyle-based prompt');
  assert('renderChatMessages uses _getNoDataPrompts', chatSrc.includes('const noDataPrompts = _getNoDataPrompts()'),
    'renderChatMessages should call the helper');
  assert('Prompts rendered dynamically', chatSrc.includes('prompts.map(p =>'),
    'Prompt buttons should be generated from array');
  assert('Has lab data returns null', chatSrc.includes('if (hasLabs) return null'),
    '_getNoDataPrompts should return null when labs exist');
  assert('Counts filled cards', chatSrc.includes('filledCount === 0'),
    'Should branch on card fill count');

  // ═══════════════════════════════════════
  // 3. System prompt — no-data instructions
  // ═══════════════════════════════════════
  console.log('%c 3. System Prompt No-Data Section ', 'font-weight:bold;color:#f59e0b');

  const constSrc = await fetch('js/constants.js').then(r => r.text());

  assert('Has ## No Lab Data State section', constSrc.includes('## No Lab Data State'),
    'CHAT_SYSTEM_PROMPT should have no-data section');
  assert('Advises pre-lab advisor role', constSrc.includes('pre-lab advisor role'),
    'Should tell AI to shift to advisor role');
  assert('Recommends tailored panels', constSrc.includes('tailored to their health goals'),
    'Should instruct personalized recommendations');
  assert('Explains WHY for each panel', constSrc.includes('explain in one sentence WHY'),
    'Should instruct per-panel reasoning');
  assert('Encourages filling ALL 9 cards', constSrc.includes('encourage filling ALL 9 profile cards'),
    'Should push for all cards, not just a few');
  assert('Sex and age critical instruction', constSrc.includes('Sex and age are critical for test recommendations'),
    'Should instruct AI about importance of demographics');
  assert('Urge to set sex/DOB in Settings', constSrc.includes('tell the user to set these in Settings'),
    'Should direct user to Settings for demographics');
  assert('Never apologize instruction', constSrc.includes('Never apologize for missing lab data'),
    'Should not apologize');
  assert('Never pretend instruction', constSrc.includes('Never pretend to interpret lab results'),
    'Should not hallucinate results');
  assert('Suggests starter panels', constSrc.includes('CBC, CMP, lipid panel, thyroid, vitamin D, iron'),
    'Should suggest general starter panels');

  // ═══════════════════════════════════════
  // 4. Dashboard nudge subtitle
  // ═══════════════════════════════════════
  console.log('%c 4. Dashboard Nudge Subtitle ', 'font-weight:bold;color:#f59e0b');

  const ccSrc = await fetch('js/context-cards.js').then(r => r.text());

  assert('context-cards imports getActiveData', ccSrc.includes("import { saveImportedData, getActiveData } from './data.js'"),
    'Should import getActiveData for lab data check');
  assert('context-cards imports hasCardContent', ccSrc.includes("import { escapeHTML, hashString, showNotification, hasCardContent } from './utils.js'"),
    'Should import hasCardContent for health dots fix');
  assert('Checks hasLabs for subtitle', ccSrc.includes('_ccHasLabs'),
    'Should compute hasLabs in renderProfileContextCards');
  assert('0-cards subtitle text', ccSrc.includes('Fill all 9 cards and the AI can recommend exactly which labs to get'),
    'Should show fill-all-cards nudge');
  assert('Some-cards subtitle text', ccSrc.includes('The more you fill in, the better the recommendations'),
    'Should nudge toward filling all 9');
  assert('All-cards subtitle text', ccSrc.includes('All filled'),
    'Should show chat nudge when all cards filled');
  assert('context-section-subtitle class used', ccSrc.includes('context-section-subtitle'),
    'Should use the CSS class');
  assert('Dashboard checks missing demographics', ccSrc.includes('_ccMissingDemo'),
    'Should detect missing sex/DOB');
  assert('Dashboard sex/DOB hint in subtitle', ccSrc.includes('Set your sex and date of birth in Settings'),
    'Should nudge sex/DOB when missing');
  assert('No subtitle when has labs', ccSrc.includes("_ccSubtitle = ''") && ccSrc.includes("if (!_ccHasLabs"),
    'Should only show subtitle when no labs');

  // CSS check
  const cssSrc = await fetch('styles.css').then(r => r.text());
  assert('.context-section-subtitle in CSS', cssSrc.includes('.context-section-subtitle'),
    'CSS should define the subtitle class');
  assert('Subtitle font-size 13px', cssSrc.includes('.context-section-subtitle') && cssSrc.includes('font-size: 13px'),
    'Subtitle should be 13px');

  // ═══════════════════════════════════════
  // 5. Health dots sentinel fix
  // ═══════════════════════════════════════
  console.log('%c 5. Health Dots Sentinel Fix ', 'font-weight:bold;color:#f59e0b');

  assert('Old sentinel check removed from context-cards', !ccSrc.includes("=== 'No lab data is currently loaded for this profile.'"),
    'Should not compare against old sentinel string');
  assert('Content-based stale check', ccSrc.includes('_staleHaveContent'),
    'Should check if stale cards have content');
  assert('Falls through to AI when stale cards have content', ccSrc.includes('if (!_staleHaveContent)'),
    'Should only skip AI when stale cards are empty AND no lab data');
  assert('Uses hasCardContent for stale check', ccSrc.includes("hasCardContent(state.importedData[k])"),
    'Should use hasCardContent to check each stale card');
  assert('Checks lab data in health dots', ccSrc.includes('_dotHasLabs'),
    'Should check lab data availability as fallback');

  // ═══════════════════════════════════════
  // 6. Integration: buildLabContext with context cards, no labs
  // ═══════════════════════════════════════
  console.log('%c 6. Integration: No-Lab Context Assembly ', 'font-weight:bold;color:#f59e0b');

  // Verify that buildLabContext doesn't early-return anymore by checking structure
  assert('buildLabContext has no early return before section 1', (() => {
    const fnStart = chatSrc.indexOf('export function buildLabContext()');
    const section1 = chatSrc.indexOf('// ── 1. Health Goals', fnStart);
    const between = chatSrc.substring(fnStart, section1);
    // Should not have a bare return statement (only conditional ctx assignment)
    const returnCount = (between.match(/\breturn\b/g) || []).length;
    return returnCount === 0;
  })(), 'No early return between function start and section 1');

  assert('buildLabContext ends with return ctx', (() => {
    const fnStart = chatSrc.indexOf('export function buildLabContext()');
    const fnEnd = chatSrc.indexOf('\n// ═══', fnStart + 100);
    const fnBody = chatSrc.substring(fnStart, fnEnd);
    return fnBody.includes('return ctx;\n}');
  })(), 'Should always return the built context string');

  // ═══════════════════════════════════════
  // 7. Chat setup guide (no AI provider)
  // ═══════════════════════════════════════
  console.log('%c 7. Chat Setup Guide (No Provider) ', 'font-weight:bold;color:#f59e0b');

  assert('openChatPanel has no hasAIProvider gate', !(() => {
    const fnStart = chatSrc.indexOf('export async function openChatPanel(');
    const fnEnd = chatSrc.indexOf('\nexport', fnStart + 10);
    const fnBody = chatSrc.substring(fnStart, fnEnd);
    // Check if hasAIProvider is called before the panel opens
    const providerCheck = fnBody.indexOf('hasAIProvider()');
    const panelOpen = fnBody.indexOf("panel.classList.add('open')");
    return providerCheck !== -1 && providerCheck < panelOpen;
  })(), 'openChatPanel should let the panel open without a provider');

  assert('renderChatMessages shows setup guide when no provider', chatSrc.includes('if (!hasAIProvider())') && chatSrc.includes('chat-setup-guide'),
    'Should show friendly setup guide instead of error');
  assert('Setup guide has OpenRouter', chatSrc.includes('openrouter.ai/keys'),
    'Should link to OpenRouter key page');
  assert('Setup guide has Anthropic', chatSrc.includes('console.anthropic.com'),
    'Should link to Anthropic console');
  assert('Setup guide has Venice', chatSrc.includes('venice.ai/settings/api'),
    'Should link to Venice API settings');
  assert('Setup guide has Ollama', chatSrc.includes('ollama.com'),
    'Should link to Ollama download');
  assert('Setup guide has settings button', chatSrc.includes("openSettingsModal('ai')"),
    'Should have button that opens AI settings tab directly');
  assert('sendChatMessage guards no provider', (() => {
    const fnStart = chatSrc.indexOf('export async function sendChatMessage()');
    const fnBody = chatSrc.substring(fnStart, fnStart + 300);
    return fnBody.includes('if (!hasAIProvider())');
  })(), 'sendChatMessage should check for provider and re-render setup guide');

  // CSS checks
  assert('.chat-setup-guide in CSS', cssSrc.includes('.chat-setup-guide'),
    'CSS should define setup guide styles');
  assert('.chat-setup-provider in CSS', cssSrc.includes('.chat-setup-provider'),
    'CSS should define provider card styles');
  assert('.chat-setup-btn in CSS', cssSrc.includes('.chat-setup-btn'),
    'CSS should define setup button styles');

  // ═══════════════════════════════════════
  // Results
  // ═══════════════════════════════════════
  console.log(`\n%c Results: ${pass} passed, ${fail} failed `, fail > 0
    ? 'background:#ef4444;color:#fff;padding:4px 12px;border-radius:4px'
    : 'background:#22c55e;color:#fff;padding:4px 12px;border-radius:4px');
})();
