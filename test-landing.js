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
  assert('Cache includes latest version', swSrc.includes('labcharts-v54'));
  assert('No standalone / in APP_SHELL', !swSrc.match(/\n\s*'\/'\s*,/));
  assert('/index.html in APP_SHELL', swSrc.includes("'/index.html'"));

  // ── 4. site.html source checks ──
  console.log('\n%c4. site.html — Source content', 'font-weight:bold');
  const siteSrc = await fetch('site.html').then(r => r.text());

  // Meta tags
  assert('og:description has 287+', siteSrc.includes('track 287+ biomarkers'));
  assert('og:url present', siteSrc.includes('og:url'));
  assert('og:image present', siteSrc.includes('og:image'));
  assert('canonical link present', siteSrc.includes('rel="canonical"'));
  assert('apple-touch-icon present', siteSrc.includes('apple-touch-icon'));

  // Hero copy
  assert('Hero: "better than a PDF"', siteSrc.includes('better than a PDF'));
  assert('Hero: "Open source"', siteSrc.includes('Open source'));
  assert('Hero badge: 287+ biomarkers', siteSrc.includes('287+ biomarkers'));
  assert('Hero sub: no PII explanation', !siteSrc.includes('personal info is stripped before anything reaches AI'));
  assert('Hero sub: no "109+"', !/hero-sub[^<]*109\+/.test(siteSrc));

  // Stats bar
  assert('Stats: 287+ biomarkers', siteSrc.includes('>287+</div>'));
  assert('Stats: 26 categories', siteSrc.includes('>26</div>'));
  assert('Stats: tightened label "Biomarkers"', siteSrc.includes('>Biomarkers</div>'));
  assert('Stats: tightened label "AI providers"', siteSrc.includes('>AI providers</div>'));
  assert('Stats: no "tracked" in biomarker label', !siteSrc.includes('Biomarkers tracked'));
  assert('Stats: no "to choose" in AI label', !siteSrc.includes('AI providers to choose'));

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
  assert('Value for Value link exists', siteSrc.includes('value4value.info'));

  // How It Works
  assert('Step 1: AI extracts', siteSrc.includes('AI extracts every biomarker'));
  assert('Step 2: trends over time', siteSrc.includes('trends over time'));
  assert('Step 2: optimal ranges', siteSrc.includes('optimal ranges'));
  assert('Step 3: Ask AI', siteSrc.includes('Ask AI about any marker'));

  // Unified features section (no standalone bento)
  assert('Has features-section-top', siteSrc.includes('features-section-top'));
  assert('Has features-section-bento', siteSrc.includes('features-section-bento'));
  assert('Has features-section-bottom', siteSrc.includes('features-section-bottom'));
  assert('No standalone .bento section', !/<section class="bento">/.test(siteSrc));
  assert('No .features-grid class', !siteSrc.includes('features-grid'));

  // Feature cards (top 3 + bottom 3 = 6 feature-card)
  const featureCards = (siteSrc.match(/class="feature-card/g) || []).length;
  assert('6 feature-card elements', featureCards === 6, `found ${featureCards}`);

  // Top row feature cards
  assert('Feature: Trend Charts', siteSrc.includes('Trend Charts'));
  assert('Feature: AI PDF Import', siteSrc.includes('AI PDF Import'));
  assert('Feature: Cycle-Aware Labs', siteSrc.includes('Cycle-Aware Labs'));

  // Bottom row feature cards
  assert('Feature: Is it actually working?', siteSrc.includes('Is it actually working?'));
  assert('Feature: More than a chatbot', siteSrc.includes('More than a chatbot'));
  assert('Feature: Ratios & Derived Markers', siteSrc.includes('Ratios &amp; Derived Markers'));

  // Bento cards (2 in middle row)
  const bentoCards = (siteSrc.match(/class="bento-card/g) || []).length;
  assert('2 bento-card elements', bentoCards === 2, `found ${bentoCards}`);

  // Context cards mockup (9 cards)
  const ctxCards = (siteSrc.match(/class="ctx-card"/g) || []).length;
  assert('9 context card mockups', ctxCards === 9, `found ${ctxCards}`);

  // Chat mockup with thread rail
  assert('Chat mock has thread rail', siteSrc.includes('Threads'));
  assert('Chat mock overflow hidden', /\.chat-mock\{[^}]*overflow:\s*hidden/.test(siteSrc));

  // Removed standalone cards
  assert('No standalone Health Goals card', !siteSrc.includes('<h3>Health Goals</h3>'));
  assert('No standalone Trend Alerts card', !siteSrc.includes('<h3>Trend Alerts</h3>'));
  assert('No "Multiple views" bento card', !siteSrc.includes('Multiple views for every category'));
  assert('No "Smart calculated markers" bento card', !siteSrc.includes('Smart calculated markers'));

  // Repetition removed
  assert('No PII Scrubbing feature card', !siteSrc.includes('<h3>PII Scrubbing</h3>'));
  assert('No Encryption feature card', !/<h3>Encryption &amp; Auto-Backup<\/h3>/.test(siteSrc));
  assert('No Biological Age feature card', !siteSrc.includes('<h3>Biological Age</h3>'));
  assert('No markers scroll section', !siteSrc.includes('markers-scroll'));
  assert('No marker-chip CSS', !siteSrc.includes('.marker-chip'));
  assert('PII still in Privacy section', siteSrc.includes('Personal info is stripped'));
  assert('Encrypted still in Privacy section', siteSrc.includes('Encrypted &amp; backed up'));

  // Privacy section tightened
  assert('Privacy: no "No account. No tracking."', !siteSrc.includes('No account. No tracking.'));

  // AI Providers updated
  assert('Anthropic: recommended badge', siteSrc.includes('Recommended'));
  assert('Anthropic: best results', /Anthropic[\s\S]*?best results/.test(siteSrc));
  assert('OpenRouter: marketplace badge', siteSrc.includes('Marketplace'));
  assert('OpenRouter: many models', /OpenRouter[\s\S]*?many models/.test(siteSrc));
  // ROUTSTR DISABLED: assert('Routstr: anonymous badge', /Routstr[\s\S]*?Anonymous/.test(siteSrc));
  assert('Venice: private badge', /Venice[\s\S]*?Private/.test(siteSrc));
  assert('Ollama: local free badge', /Ollama[\s\S]*?Local/.test(siteSrc));

  // CTA updated
  assert('CTA: "nothing to install"', siteSrc.includes('nothing to install'));
  assert('CTA: "Stop guessing"', /cta[\s\S]*?Stop guessing/i.test(siteSrc));
  assert('CTA: no "No account needed"', !siteSrc.includes('No account needed, your data stored locally'));

  // Nav/footer
  assert('Nav has Why link', siteSrc.includes('<a href="#why">Why</a>'));
  assert('Nav has Support link', siteSrc.includes('<a href="#support">Support</a>'));
  assert('Footer has Why link', /footer[\s\S]*#why/.test(siteSrc));
  assert('Footer has Support link', /footer[\s\S]*#support/.test(siteSrc));

  // CSS: responsive rules
  assert('CSS: features-section-top responsive at 768px', /768px[\s\S]*?\.features-section-top/.test(siteSrc));
  assert('CSS: features-section-bento responsive at 1024px', /1024px[\s\S]*?\.features-section-bento/.test(siteSrc));
  assert('Why-grid responsive in 1024px', siteSrc.includes('.why-grid{grid-template-columns:1fr'));
  assert('CSS: .feature-tag.cyan exists', siteSrc.includes('.feature-tag.cyan'));
  assert('CSS: providers-grid responsive at 1024px', /1024px[\s\S]*?\.providers-grid/.test(siteSrc));
  assert('CSS: bg layers hidden at 480px', /480px[\s\S]*?\.bg-grid/.test(siteSrc));

  // Hamburger menu
  assert('Has nav-hamburger button', siteSrc.includes('class="nav-hamburger"'));
  assert('Hamburger has 3 spans', (siteSrc.match(/id="nav-hamburger"[^>]*>[\s\S]*?<\/button>/)?.[0]?.match(/<span>/g) || []).length === 3);
  assert('Hamburger has aria-expanded', siteSrc.includes('aria-expanded="false"'));
  assert('Has nav-drawer div', siteSrc.includes('class="nav-drawer"'));
  assert('Nav drawer has links', /nav-drawer[\s\S]*?href="#why"/.test(siteSrc));
  assert('Nav drawer has Open App CTA', /nav-drawer[\s\S]*?href="\/app"/.test(siteSrc));
  assert('CSS: nav-hamburger hidden by default', /\.nav-hamburger\{[^}]*display:none/.test(siteSrc));
  assert('CSS: nav-hamburger shown at 768px', /768px[\s\S]*?\.nav-hamburger\{display:flex/.test(siteSrc));
  assert('CSS: nav-drawer transforms', /\.nav-drawer\{[^}]*transform:translateY\(-100%\)/.test(siteSrc));
  assert('CSS: nav-drawer.open transforms', /\.nav-drawer\.open\{[^}]*transform:translateY\(0\)/.test(siteSrc));
  assert('CSS: body.nav-open overflow hidden', /body\.nav-open\{overflow:hidden/.test(siteSrc));
  assert('JS: toggleDrawer function', siteSrc.includes('function toggleDrawer'));
  assert('JS: Escape closes drawer', /keydown[\s\S]*?Escape[\s\S]*?toggleDrawer/.test(siteSrc));

  // Mockup animations
  assert('Has chart-line-animated class', siteSrc.includes('class="chart-line-animated"'));
  assert('Has chart-end-dot class', siteSrc.includes('class="chart-end-dot"'));
  assert('Has 3 sparkline-animated classes', (siteSrc.match(/class="sparkline-animated"/g) || []).length === 3);
  assert('CSS: @keyframes drawLine', siteSrc.includes('@keyframes drawLine'));
  assert('CSS: @keyframes sparkDraw', siteSrc.includes('@keyframes sparkDraw'));
  assert('CSS: @keyframes dotPop', siteSrc.includes('@keyframes dotPop'));
  assert('Animations triggered by .hero-mockup.visible', siteSrc.includes('.hero-mockup.visible .chart-line-animated'));

  // Stats count-up
  assert('Stats have data-count attrs', (siteSrc.match(/data-count="/g) || []).length === 4);
  assert('First stat data-count=287', siteSrc.includes('data-count="287"'));
  assert('First stat data-suffix="+"', siteSrc.includes('data-suffix="+"'));
  assert('JS: animateCount function', siteSrc.includes('function animateCount'));
  assert('JS: easeOutExpo function', siteSrc.includes('function easeOutExpo'));
  assert('JS: count-up IntersectionObserver', /countObserver[\s\S]*?IntersectionObserver/.test(siteSrc));
  assert('JS: count-up threshold 0.5', /countObserver[\s\S]*?threshold:\s*0\.5/.test(siteSrc) || /IntersectionObserver[\s\S]*?threshold:\s*0\.5/.test(siteSrc));

  // GitHub stars
  assert('JS: fetches GitHub API', siteSrc.includes('api.github.com/repos/elkimek/get-based'));
  assert('JS: GitHub stars graceful (catch)', /fetchGitHubStars[\s\S]*?\.catch/.test(siteSrc) || /api\.github\.com[\s\S]*?\.catch/.test(siteSrc));

  // Reduced motion
  assert('Reduced motion: chart animations', /prefers-reduced-motion[\s\S]*?chart-line-animated/.test(siteSrc));
  assert('Reduced motion: sparkline animations', /prefers-reduced-motion[\s\S]*?sparkline-animated/.test(siteSrc));

  // Support section
  assert('Has #support section', siteSrc.includes('id="support"'));
  assert('Has #providers section', siteSrc.includes('id="providers"'));
  assert('Share on X intent URL', siteSrc.includes('x.com/intent/tweet'));

  // Provider cards use flexbox alignment
  assert('Provider cards use flex column', /\.provider-card\{[^}]*flex-direction:column/.test(siteSrc));
  assert('Provider badge margin-top auto', /\.provider-badge\{[^}]*margin-top:auto/.test(siteSrc));

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

    const domBentoCards = document.querySelectorAll('.bento-card');
    assert('2 bento cards in DOM', domBentoCards.length === 2, `found ${domBentoCards.length}`);

    const domCtxCards = document.querySelectorAll('.ctx-card');
    assert('9 context cards in DOM', domCtxCards.length === 9, `found ${domCtxCards.length}`);

    const domStatNumbers = document.querySelectorAll('.stat-number');
    if (domStatNumbers.length >= 2) {
      assert('First stat has data-count=287', domStatNumbers[0].dataset.count === '287');
      assert('Second stat has data-count=26', domStatNumbers[1].dataset.count === '26');
    }

    // Hamburger DOM checks
    const hamBtn = document.getElementById('nav-hamburger');
    assert('Hamburger button in DOM', !!hamBtn);
    if (hamBtn) {
      assert('Hamburger has 3 span children', hamBtn.querySelectorAll('span').length === 3);
      assert('Hamburger aria-expanded=false initially', hamBtn.getAttribute('aria-expanded') === 'false');
    }
    const drawerEl = document.getElementById('nav-drawer');
    assert('Nav drawer in DOM', !!drawerEl);
    if (drawerEl) {
      const drawerLinks = drawerEl.querySelectorAll('a');
      assert('Drawer has 6 links', drawerLinks.length === 6, `found ${drawerLinks.length}`);
    }

    // Animation class DOM checks
    const chartLine = document.querySelector('.chart-line-animated');
    assert('Chart line animated polyline in DOM', !!chartLine);
    const endDot = document.querySelector('.chart-end-dot');
    assert('Chart end dot in DOM', !!endDot);
    const sparklines = document.querySelectorAll('.sparkline-animated');
    assert('3 sparkline-animated in DOM', sparklines.length === 3, `found ${sparklines.length}`);

    if (whyGrid) {
      const style = getComputedStyle(whyGrid);
      assert('.why-grid display: grid', style.display === 'grid');
    }

    // Check no standalone bento section
    const bentoSections = document.querySelectorAll('section.bento');
    assert('No standalone bento section in DOM', bentoSections.length === 0);
  } else {
    console.log('  ⚠️  Not on site.html — skipping DOM checks');
  }

  // ── 6. Link integrity ──
  console.log('\n%c6. Link integrity', 'font-weight:bold');
  const appLinks = (siteSrc.match(/href="\/app"/g) || []).length;
  assert('/app links present (CTAs)', appLinks >= 3, `found ${appLinks}`);
  assert('No /landing links', !siteSrc.includes('href="/landing"'));

  // ── 7. Light mode support ──
  console.log('\n%c7. Light mode', 'font-weight:bold');
  assert('Has [data-theme="light"] CSS block', /\[data-theme="light"\]\s*\{/.test(siteSrc));
  assert('Light theme overrides --bg', /\[data-theme="light"\]\s*\{[^}]*--bg:#f5f7ff/.test(siteSrc));
  assert('Light theme overrides --text', /\[data-theme="light"\]\s*\{[^}]*--text:#1a1d27/.test(siteSrc));
  assert('Light theme overrides --nav-bg', /\[data-theme="light"\]\s*\{[^}]*--nav-bg:/.test(siteSrc));
  assert('prefers-color-scheme light no-JS fallback', /prefers-color-scheme:\s*light[\s\S]*?:root:not\(\[data-theme\]\)/.test(siteSrc));
  assert('Early theme detection script in head', /document\.documentElement\.setAttribute\('data-theme',\s*'light'\)/.test(siteSrc));
  assert('Live OS theme listener', /prefers-color-scheme: light[\s\S]*?addEventListener\('change'/.test(siteSrc));
  assert('meta theme-color for dark', /meta name="theme-color" content="#0a0c14" media="\(prefers-color-scheme: dark\)"/.test(siteSrc));
  assert('meta theme-color for light', /meta name="theme-color" content="#f5f7ff" media="\(prefers-color-scheme: light\)"/.test(siteSrc));
  assert('Nav uses --nav-bg var', /nav\{[^}]*background:var\(--nav-bg\)/.test(siteSrc));
  assert('Grid uses --grid-line var', /bg-grid[\s\S]*?var\(--grid-line\)/.test(siteSrc));
  assert('Selection uses --selection-color var', /::selection\{background:var\(--selection-color\)/.test(siteSrc));
  assert('GitHub stars pill uses var(--surface2)', siteSrc.includes("background:var(--surface2);border-radius:6px;font-size:12px"));
  assert('Light bg-glow reduced', /\[data-theme="light"\]\s+\.bg-glow\{opacity:0\.5\}/.test(siteSrc));
  assert('Light bg-noise reduced', /\[data-theme="light"\]\s+\.bg-noise\{opacity:0\.12\}/.test(siteSrc));
  assert('Theme toggle button in HTML', siteSrc.includes('id="theme-toggle"'));
  assert('Theme toggle has sun icon', siteSrc.includes('class="theme-icon-sun"'));
  assert('Theme toggle has moon icon', siteSrc.includes('class="theme-icon-moon"'));
  assert('CSS: .theme-toggle styles', /\.theme-toggle\{/.test(siteSrc));
  assert('CSS: light hides sun icon', /\[data-theme="light"\]\s+\.theme-icon-sun\{display:none\}/.test(siteSrc));
  assert('JS: toggle click sets localStorage', /theme-toggle[\s\S]*?localStorage\.setItem\('labcharts-theme'/.test(siteSrc));

  // ── Summary ──
  console.log(`\n%c${pass + fail} tests: ${pass} passed, ${fail} failed`, fail ? 'color:red;font-weight:bold' : 'color:green;font-weight:bold');
})();
