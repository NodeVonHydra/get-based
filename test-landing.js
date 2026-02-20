// test-landing.js — Browser-based verification for landing page update, Vercel routing, demo data
// Run: fetch('test-landing.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  const results = [];
  function assert(name, condition, detail) {
    if (condition) { pass++; results.push(`  PASS: ${name}`); }
    else { fail++; results.push(`  FAIL: ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('%c[test-landing] Starting verification...', 'color:#6366f1;font-weight:bold');

  // ═══════════════════════════════════════════════
  // 1. vercel.json exists and has correct routing
  // ═══════════════════════════════════════════════
  let vercelJson;
  try {
    const resp = await fetch('vercel.json');
    assert('vercel.json fetchable', resp.ok);
    vercelJson = await resp.json();
    assert('vercel.json has rewrites array', Array.isArray(vercelJson.rewrites));
    const rootRewrite = vercelJson.rewrites.find(r => r.source === '/');
    assert('Root rewrite to site.html', rootRewrite && rootRewrite.destination === '/site.html');
    const appRewrite = vercelJson.rewrites.find(r => r.source === '/app');
    assert('/app rewrite to index.html', appRewrite && appRewrite.destination === '/index.html');
  } catch (e) {
    assert('vercel.json parseable', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 2. site.html link updates (href="/app" not "index.html")
  // ═══════════════════════════════════════════════
  let siteText;
  try {
    const resp = await fetch('site.html');
    siteText = await resp.text();
    assert('site.html fetchable', resp.ok);

    // No more href="index.html" links
    const indexLinks = (siteText.match(/href="index\.html"/g) || []).length;
    assert('No href="index.html" links remain', indexLinks === 0, `found ${indexLinks}`);

    // Check /app links exist
    const appLinks = (siteText.match(/href="\/app"/g) || []).length;
    assert('site.html has /app links', appLinks >= 4, `found ${appLinks}, expected >= 4`);

    // Nav CTA
    assert('Nav CTA links to /app', siteText.includes('class="nav-cta">Open App') && siteText.includes('href="/app" class="nav-cta"'));

    // Footer link
    assert('Footer Open App links to /app', siteText.includes('<a href="/app">Open App</a>'));
  } catch (e) {
    assert('site.html fetchable', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 3. site.html — Privacy section has 4th card (encryption)
  // ═══════════════════════════════════════════════
  assert('Privacy section has encryption card', siteText && siteText.includes('Encrypted &amp; Backed Up'));
  assert('Privacy card mentions AES-256-GCM', siteText && siteText.includes('AES-256-GCM encryption at rest'));
  assert('Privacy card mentions IndexedDB snapshots', siteText && siteText.includes('Automatic IndexedDB snapshots'));

  // Count priv-card occurrences
  const privCards = (siteText.match(/class="priv-card/g) || []).length;
  assert('Privacy section has 4 cards', privCards === 4, `found ${privCards}`);

  // ═══════════════════════════════════════════════
  // 4. site.html — Features grid has encryption card (replaced PDF Reports)
  // ═══════════════════════════════════════════════
  assert('Features grid has Encryption & Auto-Backup card', siteText && siteText.includes('Encryption &amp; Auto-Backup'));
  assert('Features encryption card mentions AES-256-GCM', siteText && siteText.includes('AES-256-GCM encryption with your passphrase'));
  assert('Features encryption card has Security tag', siteText && siteText.includes('>Security</span>'));
  assert('PDF Reports card removed from features', !siteText || !siteText.includes('<h3>PDF Reports</h3>'));

  // Count feature cards
  const featureCards = (siteText.match(/class="feature-card/g) || []).length;
  assert('Features grid still has 9 cards', featureCards === 9, `found ${featureCards}`);

  // ═══════════════════════════════════════════════
  // 5. service-worker.js — cache v21 + site.html in APP_SHELL
  // ═══════════════════════════════════════════════
  let swText;
  try {
    const resp = await fetch('service-worker.js');
    swText = await resp.text();
    assert('Service worker cache is v21', swText.includes("labcharts-v21"));
    assert('Service worker APP_SHELL includes site.html', swText.includes("'/site.html'"));
    assert('Service worker no longer v20', !swText.includes("labcharts-v20"));
  } catch (e) {
    assert('service-worker.js fetchable', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 6. js/export.js — loadDemoData function exists
  // ═══════════════════════════════════════════════
  let exportText;
  try {
    const resp = await fetch('js/export.js');
    exportText = await resp.text();
    assert('export.js has loadDemoData function', exportText.includes('async function loadDemoData'));
    assert('loadDemoData fetches demo-male.json', exportText.includes("fetch('demo-male.json')"));
    assert('loadDemoData calls importDataJSON', exportText.includes('importDataJSON(new File'));
    assert('loadDemoData is window-exported', exportText.includes('loadDemoData'));
    assert('window.loadDemoData exists', typeof window.loadDemoData === 'function');
  } catch (e) {
    assert('export.js fetchable', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 7. js/views.js — onboarding has demo button
  // ═══════════════════════════════════════════════
  let viewsText;
  try {
    const resp = await fetch('js/views.js');
    viewsText = await resp.text();
    assert('views.js has onboarding-demo-btn', viewsText.includes('onboarding-demo-btn'));
    assert('views.js demo btn calls loadDemoData()', viewsText.includes("onclick=\"loadDemoData()\""));
    assert('views.js removed old onboarding-hint text', !viewsText.includes('or drag and drop onto the area above'));
  } catch (e) {
    assert('views.js fetchable', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 8. styles.css — demo button style
  // ═══════════════════════════════════════════════
  let cssText;
  try {
    const resp = await fetch('styles.css');
    cssText = await resp.text();
    assert('CSS has .onboarding-demo-btn rule', cssText.includes('.onboarding-demo-btn'));
    assert('Demo btn has no background', cssText.includes('.onboarding-demo-btn') && cssText.includes('background: none'));
    assert('Demo btn has underline', cssText.includes('text-decoration: underline'));
    assert('Demo btn has hover rule', cssText.includes('.onboarding-demo-btn:hover'));
  } catch (e) {
    assert('styles.css fetchable', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // 9. DOM check — onboarding demo button (if no data loaded)
  // ═══════════════════════════════════════════════
  const demoBtn = document.querySelector('.onboarding-demo-btn');
  if (demoBtn) {
    assert('DOM: demo button visible', demoBtn.offsetParent !== null || demoBtn.offsetHeight > 0);
    assert('DOM: demo button text', demoBtn.textContent.includes('demo data'));
    assert('DOM: demo button onclick', demoBtn.getAttribute('onclick') === 'loadDemoData()');
    const styles = getComputedStyle(demoBtn);
    assert('DOM: demo button has no background', styles.backgroundColor === 'rgba(0, 0, 0, 0)' || styles.background.includes('none'));
  } else {
    results.push('  SKIP: DOM demo button checks (data already loaded, onboarding not shown)');
  }

  // ═══════════════════════════════════════════════
  // 10. demo-male.json is fetchable
  // ═══════════════════════════════════════════════
  try {
    const resp = await fetch('demo-male.json');
    assert('demo-male.json fetchable', resp.ok);
    const json = await resp.json();
    assert('demo-male.json has entries', Array.isArray(json.entries) && json.entries.length > 0);
  } catch (e) {
    assert('demo-male.json fetchable', false, e.message);
  }

  // ═══════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════
  console.log(results.join('\n'));
  const color = fail === 0 ? '#34d399' : '#f87171';
  console.log(`%c[test-landing] ${pass} passed, ${fail} failed`, `color:${color};font-weight:bold`);
  if (fail > 0) console.warn('[test-landing] Some tests failed!');
})();
