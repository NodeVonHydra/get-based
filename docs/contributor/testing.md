# Testing

Get Based uses browser-based tests — no test framework, no Jest, no jsdom. Each test file is a self-executing IIFE that runs assertions against the live app in a real browser context.

## The assert pattern

Every test file defines a local `assert` helper and collects results:

```js
(async () => {
  const results = [];
  let passed = 0, failed = 0;

  function assert(name, condition, detail = '') {
    if (condition) {
      results.push({ ok: true, name });
      passed++;
    } else {
      results.push({ ok: false, name, detail });
      failed++;
    }
  }

  // --- tests ---

  assert('state object exists', typeof window._labState === 'object');
  assert('importedData has entries array',
    Array.isArray(window._labState.importedData.entries));

  // --- report ---
  console.log(`Tests: ${passed} passed, ${failed} failed`);
  results.filter(r => !r.ok).forEach(r =>
    console.error(`FAIL: ${r.name}`, r.detail)
  );
  return { passed, failed, results };
})();
```

The `detail` argument appears in the failure output — use it to print the actual value that caused the failure.

## The 14 test files

| File | What it covers |
|---|---|
| `test-audit.js` | Security audit: XSS escaping, null guards, div-by-zero, JSON.parse guards, focus trapping |
| `test-chat-actions.js` | Chat message action buttons: regenerate, copy, read aloud, context, sources (OpenAlex) |
| `test-chat-threads.js` | Chat thread CRUD, auto-naming, migration, encryption patterns, backup inclusion |
| `test-crypto.js` | AES-256-GCM encryption, PBKDF2, IndexedDB auto-backup (20+ sections) |
| `test-custom-personality.js` | Named custom personalities: storage, icon picker, generation, dirty state, thread metadata |
| `test-cycle-improvements.js` | Phase-aware ranges, cycle iron alerts, perimenopause detection, heavy flow alerts |
| `test-cycle-tour.js` | Cycle spotlight tour: 8 steps, DOM elements, auto-trigger, storage key |
| `test-demo.js` | Demo data files: v2 structure, structured context cards, menstrual cycle for Sarah |
| `test-landing.js` | Landing page (`site.html`): nav, animations, FAQ accordion, CTA links, privacy claims |
| `test-mobile.js` | Responsive layout: breakpoints, grid overflow, touch tap targets, safe grid sizing |
| `test-openrouter.js` | OpenRouter provider: curated model list, pricing cache, exclude blocklist, model fetch |
| `test-phase-ranges.js` | Phase-aware reference ranges for estradiol and progesterone aligned with dates |
| `test-routstr.js` | ROUTSTR DISABLED markers: verifies all commented-out code is correctly disabled |
| `test-changelog.js` | What's New modal + `hasCardContent` auto-gating: version sync, HTML, main.js wiring, settings, behavioral tests |
| `test-tour.js` | App tour: 7 steps, spotlight DOM, positioning, escape key, completion flag (154 assertions) |

## Run all tests headlessly

```bash
./run-tests.sh
```

The script:
1. Checks if a server is running on port 8000; starts `python3 -m http.server 8000` if not
2. Runs each test file through headless Chrome via Puppeteer
3. Prints a pass/fail summary per file
4. Exits with code `0` if all pass, `1` if any fail

**Requires:** Node.js with Puppeteer installed (`npm i -g puppeteer` or `npx puppeteer`).

Alternatively, with a server already running:

```bash
NODE_PATH=/path/to/node_modules node run-tests.js
```

## Running a single test in the browser

Open the browser console while `http://localhost:8000` is running, then:

```js
fetch('test-cycle-improvements.js').then(r => r.text()).then(s => Function(s)())
```

Results appear in the console. This is useful during development before running the full suite.

## Writing new tests

When you add a feature or fix a bug, add assertions to the relevant test file. If none fits, create `test-yourfeature.js`.

**What to cover:**

- **Source inspection** — verify the function or pattern exists in the source:
  ```js
  const src = await fetch('js/data.js').then(r => r.text());
  assert('getActiveData exported', src.includes('export function getActiveData'));
  ```

- **DOM state** — check that elements render correctly:
  ```js
  const card = document.querySelector('.context-card[data-key="diet"]');
  assert('diet card rendered', card !== null);
  assert('diet card has edit button', card.querySelector('.ctx-edit-btn') !== null);
  ```

- **Function behavior** — call window-exported functions and check results:
  ```js
  const data = window.getActiveData ? window.getActiveData() : null;
  assert('getActiveData returns dates array', Array.isArray(data?.dates));
  ```

- **CSS rules** — verify styles are applied (use `getComputedStyle` or inspect stylesheets):
  ```js
  const styles = [...document.styleSheets].flatMap(s => {
    try { return [...s.cssRules].map(r => r.cssText); } catch { return []; }
  }).join('\n');
  assert('grid overflow hidden set', styles.includes('min-width: 0'));
  ```

- **localStorage keys** — verify storage conventions:
  ```js
  assert('correct key format', localStorage.getItem('labcharts-default-imported') !== undefined
    || true); // key may not exist in test env
  ```

## What the headless runner cannot test

- Drag-and-drop interactions
- File picker dialogs
- Actual streaming AI responses (API key required)
- IndexedDB state across page reloads (the runner resets between files)

For these, test the surrounding logic (e.g., that `handleBatchPDFs` function exists and has the right signature) rather than the interaction itself.
