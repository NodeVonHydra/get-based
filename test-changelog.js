// test-changelog.js — Verify What's New modal + hasCardContent auto-gating
// Run: fetch('test-changelog.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`%c PASS %c ${name}`, 'background:#22c55e;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
    else { fail++; console.error(`%c FAIL %c ${name}`, 'background:#ef4444;color:#fff;padding:2px 6px;border-radius:3px', '', detail || ''); }
  }

  console.log('%c What\'s New + Auto-Gating Tests ', 'background:#6366f1;color:#fff;font-size:14px;padding:4px 12px;border-radius:4px');

  const changelogSrc = await fetch('js/changelog.js').then(r => r.text());
  const chatSrc = await fetch('js/chat.js').then(r => r.text());
  const utilsSrc = await fetch('js/utils.js').then(r => r.text());
  const mainSrc = await fetch('js/main.js').then(r => r.text());
  const settingsSrc = await fetch('js/settings.js').then(r => r.text());
  const swSrc = await fetch('service-worker.js').then(r => r.text());
  const indexSrc = await fetch('index.html').then(r => r.text());

  // ═══════════════════════════════════════
  // 1. changelog.js module structure
  // ═══════════════════════════════════════
  console.log('%c 1. Changelog Module Structure ', 'font-weight:bold;color:#f59e0b');

  assert('changelog.js exports APP_VERSION', changelogSrc.includes('export const APP_VERSION'));
  assert('changelog.js has CHANGELOG array', changelogSrc.includes('const CHANGELOG'));
  assert('changelog.js exports openChangelog', changelogSrc.includes('export function openChangelog'));
  assert('changelog.js exports closeChangelog', changelogSrc.includes('export function closeChangelog'));
  assert('changelog.js exports maybeShowChangelog', changelogSrc.includes('export function maybeShowChangelog'));

  // ═══════════════════════════════════════
  // 2. Version sync: APP_VERSION matches SW CACHE_NAME
  // ═══════════════════════════════════════
  console.log('%c 2. Version Sync ', 'font-weight:bold;color:#f59e0b');

  const versionMatch = changelogSrc.match(/APP_VERSION\s*=\s*(\d+)/);
  const swMatch = swSrc.match(/labcharts-v(\d+)/);
  assert('APP_VERSION is a number', versionMatch !== null);
  assert('SW CACHE_NAME has version number', swMatch !== null);
  if (versionMatch && swMatch) {
    assert('APP_VERSION matches SW cache version', versionMatch[1] === swMatch[1], `changelog=${versionMatch[1]}, SW=${swMatch[1]}`);
  }

  // ═══════════════════════════════════════
  // 3. HTML: changelog modal exists
  // ═══════════════════════════════════════
  console.log('%c 3. HTML Modal Structure ', 'font-weight:bold;color:#f59e0b');

  assert('changelog-modal-overlay exists in HTML', indexSrc.includes('id="changelog-modal-overlay"'));
  assert('changelog-modal exists in HTML', indexSrc.includes('id="changelog-modal"'));
  assert('changelog modal has role=dialog', indexSrc.includes('changelog-modal') && indexSrc.includes('role="dialog"'));
  assert('changelog modal has aria-label', indexSrc.includes('aria-label="What\'s New"'));

  const overlayEl = document.getElementById('changelog-modal-overlay');
  const modalEl = document.getElementById('changelog-modal');
  assert('changelog-modal-overlay in DOM', !!overlayEl);
  assert('changelog-modal in DOM', !!modalEl);

  // ═══════════════════════════════════════
  // 4. main.js wiring
  // ═══════════════════════════════════════
  console.log('%c 4. main.js Wiring ', 'font-weight:bold;color:#f59e0b');

  assert('main.js imports maybeShowChangelog', mainSrc.includes("import { maybeShowChangelog } from './changelog.js'"));
  assert('main.js calls maybeShowChangelog', mainSrc.includes('maybeShowChangelog()'));
  assert('main.js has changelog overlay click handler', mainSrc.includes('changelog-modal-overlay') && mainSrc.includes('closeChangelog'));
  assert('main.js has changelog Escape handler', mainSrc.includes('changelogOverlay'));
  assert('main.js focus trap includes changelog', mainSrc.includes('"changelog-modal-overlay"'));

  // ═══════════════════════════════════════
  // 5. Settings: What's New button
  // ═══════════════════════════════════════
  console.log('%c 5. Settings Integration ', 'font-weight:bold;color:#f59e0b');

  assert('Settings references openChangelog', settingsSrc.includes('openChangelog'));
  assert('Settings has What\'s New button', settingsSrc.includes("What's New"));

  // ═══════════════════════════════════════
  // 6. hasCardContent utility
  // ═══════════════════════════════════════
  console.log('%c 6. hasCardContent Utility ', 'font-weight:bold;color:#f59e0b');

  assert('hasCardContent exported from utils.js', utilsSrc.includes('export function hasCardContent'));
  assert('hasCardContent on window', typeof window.hasCardContent === 'function');

  // Behavioral tests
  if (typeof window.hasCardContent === 'function') {
    const hcc = window.hasCardContent;
    assert('hasCardContent(null) => false', hcc(null) === false);
    assert('hasCardContent(undefined) => false', hcc(undefined) === false);
    assert('hasCardContent({}) => false', hcc({}) === false);
    assert('hasCardContent({note: ""}) => false', hcc({ note: '' }) === false);
    assert('hasCardContent({note: "  "}) => false', hcc({ note: '  ' }) === false);
    assert('hasCardContent({note: "hi"}) => true', hcc({ note: 'hi' }) === true);
    assert('hasCardContent({type: ""}) => false', hcc({ type: '' }) === false);
    assert('hasCardContent({type: null}) => false', hcc({ type: null }) === false);
    assert('hasCardContent({type: "vegan"}) => true', hcc({ type: 'vegan' }) === true);
    assert('hasCardContent({items: []}) => false', hcc({ items: [] }) === false);
    assert('hasCardContent({items: ["x"]}) => true', hcc({ items: ['x'] }) === true);
    assert('hasCardContent({a: null, b: "", note: ""}) => false', hcc({ a: null, b: '', note: '' }) === false);
    assert('hasCardContent({a: null, b: "val"}) => true', hcc({ a: null, b: 'val' }) === true);
  }

  // ═══════════════════════════════════════
  // 7. chat.js uses hasCardContent for 7 gates
  // ═══════════════════════════════════════
  console.log('%c 7. Auto-Gating in chat.js ', 'font-weight:bold;color:#f59e0b');

  const hccMatches = (chatSrc.match(/hasCardContent\(/g) || []).length;
  assert('chat.js has 7+ hasCardContent calls', hccMatches >= 7, `found ${hccMatches}`);
  assert('chat.js imports hasCardContent', chatSrc.includes('hasCardContent'));
  assert('Diagnoses gate: hasCardContent(diag)', chatSrc.includes('hasCardContent(diag)'));
  assert('Diet gate: hasCardContent(diet)', chatSrc.includes('hasCardContent(diet)'));
  assert('Exercise gate: hasCardContent(ex)', chatSrc.includes('hasCardContent(ex)'));
  assert('Sleep gate: hasCardContent(sl)', chatSrc.includes('hasCardContent(sl)'));
  assert('Stress gate: hasCardContent(st)', chatSrc.includes('hasCardContent(st)'));
  assert('LoveLife gate: hasCardContent(ll)', chatSrc.includes('hasCardContent(ll)'));
  assert('Environment gate: hasCardContent(env)', chatSrc.includes('hasCardContent(env)'));

  // ═══════════════════════════════════════
  // 8. Light & Circadian still uses custom gate
  // ═══════════════════════════════════════
  console.log('%c 8. Custom Gates Preserved ', 'font-weight:bold;color:#f59e0b');

  assert('Light & Circadian uses lc || autoLat', chatSrc.includes('lc || autoLat'));
  assert('No hasCardContent(lc)', !chatSrc.includes('hasCardContent(lc)'));

  // ═══════════════════════════════════════
  // 9. SW includes changelog.js
  // ═══════════════════════════════════════
  console.log('%c 9. Service Worker ', 'font-weight:bold;color:#f59e0b');

  assert('APP_SHELL includes /js/changelog.js', swSrc.includes('/js/changelog.js'));
  assert('SW cache is v53', swSrc.includes('labcharts-v53'));

  // ═══════════════════════════════════════
  // 10. Changelog data integrity
  // ═══════════════════════════════════════
  console.log('%c 10. Changelog Data ', 'font-weight:bold;color:#f59e0b');

  assert('CHANGELOG has version field', changelogSrc.includes('version:'));
  assert('CHANGELOG has date field', changelogSrc.includes('date:'));
  assert('CHANGELOG has title field', changelogSrc.includes('title:'));
  assert('CHANGELOG has items array', changelogSrc.includes('items:'));

  // ═══════════════════════════════════════
  // 11. Window exports
  // ═══════════════════════════════════════
  console.log('%c 11. Window Exports ', 'font-weight:bold;color:#f59e0b');

  assert('closeChangelog on window', typeof window.closeChangelog === 'function');
  assert('openChangelog on window', typeof window.openChangelog === 'function');
  assert('maybeShowChangelog on window', typeof window.maybeShowChangelog === 'function');

  // ═══════════════════════════════════════
  // 12. Open/close behavior
  // ═══════════════════════════════════════
  console.log('%c 12. Open/Close Behavior ', 'font-weight:bold;color:#f59e0b');

  // Test open
  window.openChangelog(true);
  const ovAfterOpen = document.getElementById('changelog-modal-overlay');
  assert('openChangelog adds show class', ovAfterOpen && ovAfterOpen.classList.contains('show'));
  const modalContent = document.getElementById('changelog-modal');
  assert('Modal has close button', modalContent && modalContent.innerHTML.includes('modal-close'));
  assert('Modal has What\'s New heading', modalContent && modalContent.innerHTML.includes("What's New"));

  // Test close
  window.closeChangelog();
  const ovAfterClose = document.getElementById('changelog-modal-overlay');
  assert('closeChangelog removes show class', ovAfterClose && !ovAfterClose.classList.contains('show'));
  assert('closeChangelog marks version as seen', localStorage.getItem('labcharts-changelog-seen') !== null);

  // Clean up
  localStorage.removeItem('labcharts-changelog-seen');

  // ═══════════════════════════════════════
  // Results
  // ═══════════════════════════════════════
  console.log(`\n%c Results: ${pass} passed, ${fail} failed `, `background:${fail?'#ef4444':'#22c55e'};color:#fff;font-size:14px;padding:4px 12px;border-radius:4px`);
})();
