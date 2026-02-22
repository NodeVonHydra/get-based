// test-landing.js — Verify landing page redesign
// Run on site.html: fetch('test-landing.js').then(r=>r.text()).then(s=>Function(s)())

(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`  ✅ ${name}`); }
    else { fail++; console.error(`  ❌ ${name}` + (detail ? ` — ${detail}` : '')); }
  }

  console.log('%c🧪 Landing Page Redesign Tests', 'font-weight:bold;font-size:14px');

  // ── 1. Routing config ──
  console.log('\n%c1. vercel.json — Routing', 'font-weight:bold');
  const vercelSrc = await fetch('vercel.json').then(r => r.text());
  const vercel = JSON.parse(vercelSrc);
  // vercel.json uses "routes" with src/dest (not rewrites with source/destination)
  const routes = vercel.routes || vercel.rewrites || [];
  const rootRoute = routes.find(r => (r.src === '^/$' || r.source === '/'));
  assert('Root / routes to site.html', rootRoute && (rootRoute.dest === '/site.html' || rootRoute.destination === '/site.html'));
  const appRoute = routes.find(r => (r.src === '^/app/?$' || r.source === '/app'));
  assert('/app routes to index.html', appRoute && (appRoute.dest === '/index.html' || appRoute.destination === '/index.html'));
  assert('No /landing route', !routes.find(r => r.src === '/landing' || r.source === '/landing'));

  // ── 2. manifest.json ──
  console.log('\n%c2. manifest.json — PWA', 'font-weight:bold');
  const manifestSrc = await fetch('manifest.json').then(r => r.text());
  const manifest = JSON.parse(manifestSrc);
  assert('start_url is /app', manifest.start_url === '/app');

  // ── 3. service-worker.js ──
  console.log('\n%c3. service-worker.js — Cache', 'font-weight:bold');
  const swSrc = await fetch('service-worker.js').then(r => r.text());
  assert('Cache bumped to v38', swSrc.includes('labcharts-v38'));
  assert('No standalone / in APP_SHELL', !swSrc.match(/\n\s*'\/'\s*,/));
  assert('/index.html in APP_SHELL', swSrc.includes("'/index.html'"));

  // ── 4. site.html source checks ──
  console.log('\n%c4. site.html — Source content', 'font-weight:bold');
  const siteSrc = await fetch('site.html').then(r => r.text());

  // Hero copy
  assert('Hero: "better than a PDF"', siteSrc.includes('better than a PDF'));
  assert('Hero: "Open source"', siteSrc.includes('Open source'));
  assert('Hero sub: no "109+"', !/hero-sub[^<]*109\+/.test(siteSrc));

  // Why section
  assert('Has #why section', siteSrc.includes('id="why"'));
  assert('Has .why CSS rule', /\.why\s*\{/.test(siteSrc));
  assert('Has "Because your doctor" heading', siteSrc.includes('Because your doctor'));
  assert('Has why-story class', siteSrc.includes('why-story'));
  assert('Has who-cards class', siteSrc.includes('who-cards'));
  assert('Has 4 who-card items', (siteSrc.match(/who-card reveal/g) || []).length === 4);
  assert('Persona: The biohacker', siteSrc.includes('The biohacker'));
  assert('Persona: The patient', siteSrc.includes('The patient'));
  assert('Persona: The doctor who cares', siteSrc.includes('The doctor who cares'));
  assert('Persona: been dismissed', siteSrc.includes('been dismissed'));

  // Repetition removed
  assert('No PII Scrubbing feature card', !siteSrc.includes('<h3>PII Scrubbing</h3>'));
  assert('No Encryption feature card in features', !/<h3>Encryption &amp; Auto-Backup<\/h3>/.test(siteSrc));
  assert('No Biological Age feature card', !siteSrc.includes('<h3>Biological Age</h3>'));
  assert('No markers scroll section', !siteSrc.includes('markers-scroll'));
  assert('No marker-chip CSS', !siteSrc.includes('.marker-chip'));
  assert('PII still in Privacy section', siteSrc.includes('PII Obfuscation'));
  assert('Encrypted still in Privacy section', siteSrc.includes('Encrypted &amp; Backed Up'));

  // Feature count
  const featureCards = (siteSrc.match(/class="feature-card/g) || []).length;
  assert('6 feature cards (removed PII, Encryption, BioAge)', featureCards === 6, `found ${featureCards}`);

  // Nav/footer
  assert('Nav has Why link', siteSrc.includes('<a href="#why">Why</a>'));
  assert('Footer has Why link', /footer[\s\S]*#why/.test(siteSrc));

  // CTA tightened
  assert('CTA: no "install as an app"', !siteSrc.includes('Install as an app'));

  // CSS: why section responsive
  assert('Why-grid responsive in 1024px', siteSrc.includes('.why-grid{grid-template-columns:1fr'));

  // ── 5. DOM checks (if on site.html) ──
  console.log('\n%c5. DOM checks', 'font-weight:bold');
  const whySection = document.getElementById('why');
  if (whySection) {
    assert('#why section in DOM', true);
    const whyGrid = whySection.querySelector('.why-grid');
    assert('.why-grid exists', !!whyGrid);
    const cards = whySection.querySelectorAll('.who-card');
    assert('4 who-card elements', cards.length === 4);

    const heroH1 = document.querySelector('.hero h1');
    assert('Hero h1: "better than a PDF"', heroH1 && heroH1.textContent.includes('better than a PDF'));

    const navWhyLink = document.querySelector('nav a[href="#why"]');
    assert('Nav #why link in DOM', !!navWhyLink);

    assert('No .markers in DOM', !document.querySelector('.markers'));

    const domFeatureCards = document.querySelectorAll('.feature-card');
    assert('6 feature cards in DOM', domFeatureCards.length === 6, `found ${domFeatureCards.length}`);

    if (whyGrid) {
      const style = getComputedStyle(whyGrid);
      assert('.why-grid display: grid', style.display === 'grid');
    }
  } else {
    console.log('  ⚠️  Not on site.html — skipping DOM checks');
  }

  // ── 6. Link integrity ──
  console.log('\n%c6. Link integrity', 'font-weight:bold');
  const appLinks = (siteSrc.match(/href="\/app"/g) || []).length;
  assert('/app links present (CTAs)', appLinks >= 3, `found ${appLinks}`);
  assert('No /landing links', !siteSrc.includes('href="/landing"'));

  // ── Summary ──
  console.log(`\n%c${pass + fail} tests: ${pass} passed, ${fail} failed`, fail ? 'color:red;font-weight:bold' : 'color:green;font-weight:bold');
})();
