#!/usr/bin/env node
// Headless browser test runner for Get Based
// Usage: node run-tests.js (requires http server on :8000)
// Or:    ./run-tests.sh (starts server automatically)

const puppeteer = require('puppeteer');

const TEST_FILES = [
  'test-crypto.js',
  'test-chat-threads.js',
  'test-chat-actions.js',
  'test-mobile.js',
  'test-demo.js',
  'test-landing.js',
  'test-openrouter.js',
  // ROUTSTR DISABLED: 'test-routstr.js',
  'test-tour.js',
  'test-phase-ranges.js',
  'test-cycle-improvements.js',
  'test-cycle-tour.js',
  'test-custom-personality.js',
  'test-audit.js'
];

const PORT = process.env.PORT || 8000;

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  const fails = [];
  let listening = false;

  page.on('console', msg => {
    if (!listening) return;
    const text = msg.text();

    // Strip %c style args for clean terminal output
    const clean = text.replace(/%c/g, '').replace(/[a-z\-]+:[^;]+;?/g, '').trim();
    if (!clean) return;

    if (clean.includes('FAIL') || clean.includes('\u274C')) {
      fails.push(clean);
      console.log('\x1b[31m' + clean + '\x1b[0m');
    } else if (clean.includes('passed') || clean.includes('Results')) {
      console.log('\x1b[36m' + clean + '\x1b[0m');
    } else if (clean.startsWith('\u25B6')) {
      console.log('\x1b[1m' + clean + '\x1b[0m');
    }
  });

  page.on('pageerror', err => {
    if (!listening) return;
    const msg = 'PAGE ERROR: ' + err.message;
    fails.push(msg);
    console.log('\x1b[31m' + msg + '\x1b[0m');
  });

  try {
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle2', timeout: 15000 });
  } catch (e) {
    console.error(`\x1b[31mCannot connect to http://localhost:${PORT}/ — is the server running?\x1b[0m`);
    console.error('Start it with: node dev-server.js ' + PORT);
    await browser.close();
    process.exit(2);
  }

  // Unregister service worker to prevent reload-triggered double execution
  await page.evaluate(async () => {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const r of regs) await r.unregister();
  });

  // Reload clean (no SW interference)
  await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle2', timeout: 15000 });

  console.log(`Running ${TEST_FILES.length} test files...\n`);
  listening = true;

  await page.evaluate(async (files) => {
    for (const t of files) {
      console.log(`\u25B6 Running ${t}`);
      try {
        const src = await fetch(t).then(r => r.text());
        await Function(src)();
      } catch (e) {
        console.log(`FAIL ${t}: ${e.message}`);
      }
    }
  }, TEST_FILES);

  // Wait for async console logs to flush
  await new Promise(r => setTimeout(r, 3000));
  listening = false;

  await browser.close();

  // Final summary
  console.log('\n' + '='.repeat(50));
  if (fails.length === 0) {
    console.log('\x1b[32m\x1b[1m  ALL TESTS PASSED\x1b[0m');
  } else {
    console.log(`\x1b[31m\x1b[1m  ${fails.length} FAILURE(S):\x1b[0m`);
    fails.forEach(f => console.log('  \x1b[31m' + f + '\x1b[0m'));
  }
  console.log('='.repeat(50));

  process.exit(fails.length > 0 ? 1 : 0);
})();
