// test-tour.js — Browser test for guided tour feature
// Run: fetch('test-tour.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let passed = 0, failed = 0;
  function assert(name, condition, detail) {
    if (condition) { console.log(`  %c✓ ${name}`, 'color:#34d399'); passed++; }
    else { console.error(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); failed++; }
  }

  console.log('%c═══ Tour Module Tests ═══', 'font-weight:bold;font-size:14px');

  // ── 1. Source: tour.js exports ──
  console.log('\n%c1. Window exports', 'font-weight:bold');
  assert('startTour is a function', typeof window.startTour === 'function');
  assert('endTour is a function', typeof window.endTour === 'function');
  assert('_tourGoToStep is a function', typeof window._tourGoToStep === 'function');

  // ── 2. Source inspection ──
  console.log('\n%c2. Source inspection', 'font-weight:bold');
  const tourSrc = await fetch('js/tour.js').then(r => r.text());
  assert('TOUR_STEPS array exists', tourSrc.includes('const TOUR_STEPS'));
  assert('Has 7 tour steps', (tourSrc.match(/\{ target:/g) || []).length === 7);
  assert('Step 1 has null target (welcome)', tourSrc.includes("target: null, title: 'Welcome to Lab Charts'"));
  assert('Step 2 targets #drop-zone', tourSrc.includes("target: '#drop-zone'"));
  assert('Step 3 targets #sidebar-nav', tourSrc.includes("target: '#sidebar-nav'"));
  assert('Step 4 targets .profile-context-cards', tourSrc.includes("target: '.profile-context-cards'"));
  assert('Step 5 targets .settings-btn', tourSrc.includes("target: '.settings-btn'"));
  assert('Step 6 targets .feedback-btn', tourSrc.includes("target: '.feedback-btn'"));
  assert('Step 7 targets .chat-toggle-btn', tourSrc.includes("target: '.chat-toggle-btn'"));
  assert('isTourCompleted reads localStorage', tourSrc.includes("profileStorageKey(state.currentProfile, 'tour')"));
  assert('endTour stores completed in localStorage', tourSrc.includes("'completed'"));
  assert('positionTooltip handles bottom/right/left/top', tourSrc.includes("position === 'bottom'") && tourSrc.includes("position === 'right'") && tourSrc.includes("position === 'left'") && tourSrc.includes("position === 'top'"));
  assert('startTour respects auto flag', tourSrc.includes('if (auto && isTourCompleted()) return'));
  assert('Imports state and profileStorageKey', tourSrc.includes("import { state }") && tourSrc.includes("import { profileStorageKey }"));

  // ── 3. Tour start creates DOM elements ──
  console.log('\n%c3. Tour start creates DOM elements', 'font-weight:bold');
  // Clean up any existing tour elements
  ['tour-overlay', 'tour-spotlight', 'tour-tooltip'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  // Clear tour completion flag for testing
  const profileId = localStorage.getItem('labcharts-active-profile') || 'default';
  const tourKey = `labcharts-${profileId}-tour`;
  const savedTourState = localStorage.getItem(tourKey);
  localStorage.removeItem(tourKey);

  window.startTour(false);
  assert('#tour-overlay created', !!document.getElementById('tour-overlay'));
  assert('#tour-spotlight created', !!document.getElementById('tour-spotlight'));
  assert('#tour-tooltip created', !!document.getElementById('tour-tooltip'));

  // ── 4. Step 0 (welcome) ──
  console.log('\n%c4. Step 0 (welcome)', 'font-weight:bold');
  const tooltip0 = document.getElementById('tour-tooltip');
  assert('Tooltip has Welcome title', tooltip0.querySelector('h4')?.textContent === 'Welcome to Lab Charts');
  assert('Tooltip has description text', tooltip0.querySelector('p')?.textContent.includes('blood work dashboard'));
  assert('Spotlight is hidden on welcome step', document.getElementById('tour-spotlight').style.display === 'none');
  assert('Tooltip is centered (transform)', tooltip0.style.transform.includes('translate'));
  assert('Has Skip button', tooltip0.querySelector('.tour-btn-secondary')?.textContent.trim() === 'Skip');
  assert('Has Next button', tooltip0.querySelector('.tour-btn-primary')?.textContent.trim() === 'Next');
  assert('Has 7 progress dots', tooltip0.querySelectorAll('.tour-dot').length === 7);
  assert('First dot is active', tooltip0.querySelector('.tour-dot').classList.contains('active'));

  // ── 5. Step navigation ──
  console.log('\n%c5. Step navigation', 'font-weight:bold');
  window._tourGoToStep(1);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const tooltip1 = document.getElementById('tour-tooltip');
  assert('Step 1: title is Import Your Results', tooltip1.querySelector('h4')?.textContent === 'Import Your Results');
  assert('Step 1: dot 2 is active', tooltip1.querySelectorAll('.tour-dot')[1]?.classList.contains('active'));
  assert('Step 1: has Back button', tooltip1.querySelector('.tour-btn-secondary')?.textContent.trim() === 'Back');

  window._tourGoToStep(2);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const tooltip2 = document.getElementById('tour-tooltip');
  assert('Step 2: title is Category Navigation', tooltip2.querySelector('h4')?.textContent === 'Category Navigation');
  assert('Step 2: dot 3 is active', tooltip2.querySelectorAll('.tour-dot')[2]?.classList.contains('active'));

  // ── 6. Last step (Done button) ──
  console.log('\n%c6. Last step', 'font-weight:bold');
  window._tourGoToStep(6);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const tooltipLast = document.getElementById('tour-tooltip');
  assert('Last step: title is Ask AI', tooltipLast.querySelector('h4')?.textContent === 'Ask AI');
  assert('Last step: has Done button', tooltipLast.querySelector('.tour-btn-primary')?.textContent.trim() === 'Done');
  assert('Last step: dot 7 is active', tooltipLast.querySelectorAll('.tour-dot')[6]?.classList.contains('active'));

  // ── 7. Spotlight positioning ──
  console.log('\n%c7. Spotlight positioning', 'font-weight:bold');
  window._tourGoToStep(1);
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const spotlight = document.getElementById('tour-spotlight');
  const dropZone = document.getElementById('drop-zone');
  if (dropZone) {
    const rect = dropZone.getBoundingClientRect();
    const sLeft = parseFloat(spotlight.style.left);
    const sTop = parseFloat(spotlight.style.top);
    assert('Spotlight left near drop-zone', Math.abs(sLeft - (rect.left - 8)) < 2);
    assert('Spotlight top near drop-zone', Math.abs(sTop - (rect.top - 8)) < 2);
  } else {
    assert('Drop zone exists for positioning test', false, '#drop-zone not found');
  }

  // ── 8. Tooltip stays in viewport ──
  console.log('\n%c8. Viewport bounds', 'font-weight:bold');
  const ttRect = document.getElementById('tour-tooltip').getBoundingClientRect();
  assert('Tooltip left >= 0', ttRect.left >= 0);
  assert('Tooltip top >= 0', ttRect.top >= 0);
  assert('Tooltip right <= viewport width', ttRect.right <= window.innerWidth + 1);
  assert('Tooltip bottom <= viewport height', ttRect.bottom <= window.innerHeight + 1);

  // ── 9. End tour ──
  console.log('\n%c9. End tour', 'font-weight:bold');
  window.endTour();
  assert('Overlay removed after endTour', !document.getElementById('tour-overlay'));
  assert('Spotlight removed after endTour', !document.getElementById('tour-spotlight'));
  assert('Tooltip removed after endTour', !document.getElementById('tour-tooltip'));
  assert('localStorage tour key set to completed', localStorage.getItem(tourKey) === 'completed');

  // ── 10. Auto-trigger guard ──
  console.log('\n%c10. Auto-trigger guard', 'font-weight:bold');
  window.startTour(true);
  assert('startTour(true) does nothing when completed', !document.getElementById('tour-overlay'));

  // ── 11. Re-trigger works ──
  console.log('\n%c11. Re-trigger (forced)', 'font-weight:bold');
  window.startTour(false);
  assert('startTour(false) works even after completion', !!document.getElementById('tour-overlay'));
  window.endTour();

  // ── 12. Settings has Tour button ──
  console.log('\n%c12. Settings integration', 'font-weight:bold');
  const settingsSrc = await fetch('js/settings.js').then(r => r.text());
  assert('Settings has "Take a Tour" button', settingsSrc.includes('Take a Tour'));
  assert('Settings calls startTour(false)', settingsSrc.includes('startTour(false)'));
  assert('Settings closes modal before tour', settingsSrc.includes('closeSettingsModal()'));

  // ── 13. main.js imports tour.js ──
  console.log('\n%c13. main.js integration', 'font-weight:bold');
  const mainSrc = await fetch('js/main.js').then(r => r.text());
  assert('main.js imports tour.js', mainSrc.includes("import './tour.js'"));
  assert('main.js Escape handles tour overlay', mainSrc.includes('tour-overlay'));

  // ── 14. views.js auto-trigger ──
  console.log('\n%c14. views.js integration', 'font-weight:bold');
  const viewsSrc = await fetch('js/views.js').then(r => r.text());
  assert('views.js calls startTour(true)', viewsSrc.includes('window.startTour(true)'));

  // ── 15. Service worker ──
  console.log('\n%c15. Service worker', 'font-weight:bold');
  const swSrc = await fetch('service-worker.js').then(r => r.text());
  assert('SW APP_SHELL includes /js/tour.js', swSrc.includes("'/js/tour.js'"));
  assert('SW cache is v34', swSrc.includes('labcharts-v34'));

  // ── 16. CSS styles ──
  console.log('\n%c16. CSS styles', 'font-weight:bold');
  const cssSrc = await fetch('styles.css').then(r => r.text());
  assert('CSS has #tour-overlay styles', cssSrc.includes('#tour-overlay'));
  assert('CSS has #tour-spotlight styles', cssSrc.includes('#tour-spotlight'));
  assert('CSS has #tour-tooltip styles', cssSrc.includes('#tour-tooltip'));
  assert('CSS has .tour-dot styles', cssSrc.includes('.tour-dot'));
  assert('CSS has .tour-btn styles', cssSrc.includes('.tour-btn'));
  assert('CSS has mobile breakpoint for tooltip', cssSrc.includes('#tour-tooltip { max-width: calc(100vw - 32px)'));
  assert('Spotlight uses box-shadow technique', cssSrc.includes('box-shadow: 0 0 0 9999px'));

  // Restore original tour state
  if (savedTourState) localStorage.setItem(tourKey, savedTourState);
  else localStorage.removeItem(tourKey);

  console.log(`\n%c═══ Results: ${passed} passed, ${failed} failed ═══`, `font-weight:bold;color:${failed ? '#f87171' : '#34d399'}`);
})();
