// test-demo.js — Verify demo data onboarding redesign
// Run: fetch('test-demo.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.error(`  ❌ ${name}` + (detail ? ` — ${detail}` : '')); }
  }

  console.log('%c🧪 Demo Data Onboarding Redesign Tests', 'font-weight:bold;font-size:14px');

  // ── 1. Source: views.js ──
  console.log('\n%c1. views.js — Onboarding HTML', 'font-weight:bold');
  const viewsSrc = await fetch('js/views.js').then(r => r.text());
  assert('Has onboarding-divider', viewsSrc.includes('onboarding-divider'));
  assert('Has onboarding-divider-line', viewsSrc.includes('onboarding-divider-line'));
  assert('Has onboarding-divider-text', viewsSrc.includes('onboarding-divider-text'));
  assert('Has demo-cards container', viewsSrc.includes('demo-cards'));
  assert('Has demo-card class', viewsSrc.includes('demo-card'));
  assert('Has female card with loadDemoData(\'female\')', viewsSrc.includes("loadDemoData('female')"));
  assert('Has male card with loadDemoData(\'male\')', viewsSrc.includes("loadDemoData('male')"));
  assert('Has Sarah, 34 label', viewsSrc.includes('Sarah, 34'));
  assert('Has Alex, 38 label', viewsSrc.includes('Alex, 38'));
  assert('Has demo-card-avatar', viewsSrc.includes('demo-card-avatar'));
  assert('Has demo-card-name', viewsSrc.includes('demo-card-name'));
  assert('Has demo-card-desc', viewsSrc.includes('demo-card-desc'));
  assert('No old onboarding-demo-btn', !viewsSrc.includes('onboarding-demo-btn'));

  // ── 2. Source: export.js ──
  console.log('\n%c2. export.js — loadDemoData(sex)', 'font-weight:bold');
  const exportSrc = await fetch('js/export.js').then(r => r.text());
  assert('loadDemoData accepts sex param', exportSrc.includes("loadDemoData(sex = 'male')"));
  assert('References demo-female.json', exportSrc.includes('demo-female.json'));
  assert('References demo-male.json', exportSrc.includes('demo-male.json'));
  assert('Calls setProfileSex', exportSrc.includes('setProfileSex'));
  assert('Calls setProfileDob', exportSrc.includes('setProfileDob'));
  assert('Sets DOB 1991-08-15 for female', exportSrc.includes('1991-08-15'));
  assert('Sets DOB 1987-11-22 for male', exportSrc.includes('1987-11-22'));
  assert('Sets onboarded to profile-set', exportSrc.includes("'profile-set'"));
  assert('Dynamic import of profile.js', exportSrc.includes("import('./profile.js')"));

  // ── 3. Source: styles.css ──
  console.log('\n%c3. styles.css — Demo card styles', 'font-weight:bold');
  const cssSrc = await fetch('styles.css').then(r => r.text());
  assert('Has .onboarding-divider rule', cssSrc.includes('.onboarding-divider'));
  assert('Has .onboarding-divider-line rule', cssSrc.includes('.onboarding-divider-line'));
  assert('Has .onboarding-divider-text rule', cssSrc.includes('.onboarding-divider-text'));
  assert('Has .demo-cards rule', cssSrc.includes('.demo-cards'));
  assert('Has .demo-card rule', cssSrc.includes('.demo-card {'));
  assert('Has .demo-card:hover rule', cssSrc.includes('.demo-card:hover'));
  assert('Has .demo-card-avatar rule', cssSrc.includes('.demo-card-avatar'));
  assert('Has .demo-card-name rule', cssSrc.includes('.demo-card-name'));
  assert('Has .demo-card-desc rule', cssSrc.includes('.demo-card-desc'));
  assert('No old .onboarding-demo-btn rule', !cssSrc.includes('.onboarding-demo-btn'));
  assert('Demo cards flex layout', cssSrc.includes('.demo-cards { display: flex'));
  assert('Demo card cursor pointer', cssSrc.includes('cursor: pointer'));
  assert('Mobile 480px: demo-cards flex-direction column', cssSrc.includes('.demo-cards { flex-direction: column'));

  // ── 4. Computed styles (if onboarding visible) ──
  console.log('\n%c4. Computed styles (live DOM)', 'font-weight:bold');
  const step1 = document.querySelector('.onboarding-step1');
  if (step1) {
    const step1Style = getComputedStyle(step1);
    assert('.onboarding-step1 has text-align center', step1Style.textAlign === 'center');

    const divider = document.querySelector('.onboarding-divider');
    assert('.onboarding-divider exists in DOM', !!divider);
    if (divider) {
      const divStyle = getComputedStyle(divider);
      assert('.onboarding-divider has flex display', divStyle.display === 'flex');
    }

    const cards = document.querySelectorAll('.demo-card');
    assert('Two .demo-card buttons in DOM', cards.length === 2);
    if (cards.length === 2) {
      assert('First card onclick has female', cards[0].getAttribute('onclick').includes("'female'"));
      assert('Second card onclick has male', cards[1].getAttribute('onclick').includes("'male'"));
      const cardStyle = getComputedStyle(cards[0]);
      assert('Demo card has pointer cursor', cardStyle.cursor === 'pointer');
    }

    const importBtn = document.querySelector('.onboarding-import-btn');
    assert('.onboarding-import-btn exists', !!importBtn);
    if (importBtn) {
      const btnStyle = getComputedStyle(importBtn);
      assert('Import btn is inline-block (centered by text-align)', btnStyle.display === 'inline-block');
    }
  } else {
    console.log('  ⚠️  Onboarding step 1 not visible (data already loaded) — skipping DOM checks');
  }

  // ── 5. Window exports ──
  console.log('\n%c5. Window exports', 'font-weight:bold');
  assert('loadDemoData on window', typeof window.loadDemoData === 'function');

  // ── 6. Service worker ──
  console.log('\n%c6. service-worker.js — Cache version', 'font-weight:bold');
  const swSrc = await fetch('service-worker.js').then(r => r.text());
  assert('Cache bumped to v43', swSrc.includes("labcharts-v43"));
  assert('No v27 reference', !swSrc.includes("labcharts-v27"));

  // ── Summary ──
  console.log(`\n%c${pass + fail} tests: ${pass} passed, ${fail} failed`, fail ? 'color:red;font-weight:bold' : 'color:green;font-weight:bold');
})();
