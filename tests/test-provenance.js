// test-provenance.js — Import provenance (markerSources) tests
(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.error(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('%c Import Provenance Tests ', 'background:#6366f1;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold');

  // ═══════════════════════════════════════
  // 1. Source code verification
  // ═══════════════════════════════════════
  console.log('%c 1. PDF Import Provenance ', 'font-weight:bold;color:#f59e0b');

  const pdfSrc = await fetch('/js/pdf-import.js').then(r => r.text());

  // markerSources initialization
  assert('Init markerSources on entry', pdfSrc.includes('if (!entry.markerSources) entry.markerSources = {};'));
  assert('Uses importTs timestamp', pdfSrc.includes('const importTs = Date.now()'));

  // Matched markers get provenance
  assert('Matched markers get markerSources', pdfSrc.includes('entry.markerSources[m.mappedKey] = { file: result.fileName'));

  // New markers get provenance
  assert('New markers get markerSources', pdfSrc.includes('entry.markerSources[m.suggestedKey] = { file: result.fileName'));

  // ═══════════════════════════════════════
  // 2. Manual Entry Provenance
  // ═══════════════════════════════════════
  console.log('%c 2. Manual Entry Provenance ', 'font-weight:bold;color:#f59e0b');

  const viewsSrc = await fetch('/js/views.js').then(r => r.text());

  // saveManualEntry writes provenance
  assert('saveManualEntry inits markerSources', viewsSrc.includes('if (!entry.markerSources) entry.markerSources = {};'));
  assert('saveManualEntry sets file:null', viewsSrc.includes("entry.markerSources[dotKey] = { file: null, at: Date.now() }"));

  // editMarkerValue writes provenance
  const editSection = viewsSrc.split('function editMarkerValue')[1] || '';
  assert('editMarkerValue sets provenance', editSection.includes("entry.markerSources[dotKey] = { file: null, at: Date.now() }"));

  // ═══════════════════════════════════════
  // 3. Detail Modal Display
  // ═══════════════════════════════════════
  console.log('%c 3. Detail Modal Display ', 'font-weight:bold;color:#f59e0b');

  assert('Detail modal reads markerSources', viewsSrc.includes('srcEntry?.markerSources?.[dotKey]'));
  assert('Detail modal has mv-source class', viewsSrc.includes('class="mv-source"'));
  assert('Detail modal shows manual entry label', viewsSrc.includes('mv-source-manual'));
  assert('Detail modal falls back to sourceFile', viewsSrc.includes('srcEntry?.sourceFile'));

  // ═══════════════════════════════════════
  // 4. CSS
  // ═══════════════════════════════════════
  console.log('%c 4. CSS Styles ', 'font-weight:bold;color:#f59e0b');

  const cssSrc = await fetch('/styles.css').then(r => r.text());
  assert('mv-source style exists', cssSrc.includes('.mv-source'));
  assert('mv-source-manual style exists', cssSrc.includes('.mv-source-manual'));

  // ═══════════════════════════════════════
  // 5. Backward Compatibility
  // ═══════════════════════════════════════
  console.log('%c 5. Backward Compatibility ', 'font-weight:bold;color:#f59e0b');

  // Uses optional chaining — won't crash on old entries
  assert('Optional chaining on markerSources', viewsSrc.includes('markerSources?.[dotKey]'));

  // ═══════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════
  console.log(`\n%c Provenance: ${pass} passed, ${fail} failed `, fail === 0 ? 'background:#22c55e;color:#fff;padding:4px 12px;border-radius:4px' : 'background:#ef4444;color:#fff;padding:4px 12px;border-radius:4px');
  window.__testResults = { pass, fail };
})();
