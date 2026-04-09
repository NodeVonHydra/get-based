// test-supplement-impact.js — Supplement-biomarker impact analysis tests
(async function() {
  let pass = 0, fail = 0;
  function assert(name, condition, detail) {
    if (condition) { pass++; console.log(`  ✓ ${name}`); }
    else { fail++; console.error(`  ✗ ${name}${detail ? ' — ' + detail : ''}`); }
  }

  console.log('%c Supplement Impact Tests ', 'background:#6366f1;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold');

  // Import computeSupplementImpact and computeAllImpacts
  const { computeSupplementImpact, computeAllImpacts } = await import('/js/supplements.js');

  // ═══════════════════════════════════════
  // 1. computeSupplementImpact — basic case
  // ═══════════════════════════════════════
  console.log('%c 1. Basic Impact Computation ', 'font-weight:bold;color:#f59e0b');

  const supp1 = { name: 'Creatine', startDate: '2024-06-01', endDate: null };
  const dates1 = ['2024-03-15', '2024-04-15', '2024-05-15', '2024-07-15', '2024-08-15', '2024-09-15'];
  const values1 = [80, 85, 82, 92, 95, 93];

  const result1 = computeSupplementImpact(supp1, 'biochemistry.creatinine', 'Creatinine', 'µmol/L', values1, dates1, 62, 106);

  assert('Returns object', result1 !== null);
  assert('markerName correct', result1.markerName === 'Creatinine');
  assert('nBefore = 3', result1.nBefore === 3, `got ${result1.nBefore}`);
  assert('nAfter = 3', result1.nAfter === 3, `got ${result1.nAfter}`);
  assert('beforeMean ≈ 82.3', Math.abs(result1.beforeMean - 82.333) < 0.1, `got ${result1.beforeMean}`);
  assert('afterMean ≈ 93.3', Math.abs(result1.afterMean - 93.333) < 0.1, `got ${result1.afterMean}`);
  assert('pctChange ≈ 13.4', Math.abs(result1.pctChange - 13.36) < 0.5, `got ${result1.pctChange}`);
  assert('direction = up', result1.direction === 'up');
  assert('confidence = high (3+/3+)', result1.confidence === 'high');

  // ═══════════════════════════════════════
  // 2. No before data
  // ═══════════════════════════════════════
  console.log('%c 2. No Before Data ', 'font-weight:bold;color:#f59e0b');

  const supp2 = { name: 'VitD', startDate: '2024-01-01', endDate: null };
  const dates2 = ['2024-03-15', '2024-06-15'];
  const values2 = [75, 120];

  const result2 = computeSupplementImpact(supp2, 'vitamins.d', 'Vitamin D', 'nmol/L', values2, dates2, 75, 150);
  assert('Returns object with no before data', result2 !== null);
  assert('nBefore = 0', result2.nBefore === 0);
  assert('pctChange = null', result2.pctChange === null);
  assert('confidence = low', result2.confidence === 'low');

  // ═══════════════════════════════════════
  // 3. Ended supplement — only active window counts
  // ═══════════════════════════════════════
  console.log('%c 3. Ended Supplement ', 'font-weight:bold;color:#f59e0b');

  const supp3 = { name: 'Zinc', startDate: '2024-04-01', endDate: '2024-07-01' };
  const dates3 = ['2024-03-15', '2024-05-15', '2024-06-15', '2024-08-15'];
  const values3 = [10, 14, 15, 11];

  const result3 = computeSupplementImpact(supp3, 'electrolytes.zinc', 'Zinc', 'µmol/L', values3, dates3, 11, 23);
  assert('nBefore = 1 (only March)', result3.nBefore === 1);
  assert('nAfter = 2 (May + June, not August)', result3.nAfter === 2, `got ${result3.nAfter}`);
  assert('afterMean = 14.5', Math.abs(result3.afterMean - 14.5) < 0.01);

  // ═══════════════════════════════════════
  // 4. Null values skipped
  // ═══════════════════════════════════════
  console.log('%c 4. Null Values ', 'font-weight:bold;color:#f59e0b');

  const supp4 = { name: 'Mag', startDate: '2024-06-01', endDate: null };
  const dates4 = ['2024-03-15', '2024-04-15', '2024-07-15', '2024-08-15'];
  const values4 = [0.8, null, 0.9, null];

  const result4 = computeSupplementImpact(supp4, 'electrolytes.magnesium', 'Magnesium', 'mmol/L', values4, dates4, 0.7, 1.0);
  assert('nBefore = 1 (null skipped)', result4.nBefore === 1);
  assert('nAfter = 1 (null skipped)', result4.nAfter === 1);

  // ═══════════════════════════════════════
  // 5. No data at all
  // ═══════════════════════════════════════
  console.log('%c 5. No Data ', 'font-weight:bold;color:#f59e0b');

  const supp5 = { name: 'Empty', startDate: '2024-06-01', endDate: null };
  const result5 = computeSupplementImpact(supp5, 'x.y', 'X', 'U', [null, null], ['2024-03-15', '2024-07-15'], 0, 10);
  assert('Returns null for all-null values', result5 === null);

  // ═══════════════════════════════════════
  // 6. Confidence levels
  // ═══════════════════════════════════════
  console.log('%c 6. Confidence Levels ', 'font-weight:bold;color:#f59e0b');

  const suppC = { name: 'C', startDate: '2024-06-01', endDate: null };
  // 1 before, 1 after = low
  const resLow = computeSupplementImpact(suppC, 'x.y', 'X', 'U', [5, 10], ['2024-05-15', '2024-07-15'], 0, 20);
  assert('1/1 = low confidence', resLow.confidence === 'low');
  // 2 before, 2 after = moderate
  const resMod = computeSupplementImpact(suppC, 'x.y', 'X', 'U', [5, 6, 10, 11], ['2024-04-15', '2024-05-15', '2024-07-15', '2024-08-15'], 0, 20);
  assert('2/2 = moderate confidence', resMod.confidence === 'moderate');
  // 3 before, 3 after = high
  const resHigh = computeSupplementImpact(suppC, 'x.y', 'X', 'U', [5, 6, 7, 10, 11, 12], ['2024-03-15', '2024-04-15', '2024-05-15', '2024-07-15', '2024-08-15', '2024-09-15'], 0, 20);
  assert('3/3 = high confidence', resHigh.confidence === 'high');

  // ═══════════════════════════════════════
  // 7. computeAllImpacts
  // ═══════════════════════════════════════
  console.log('%c 7. computeAllImpacts ', 'font-weight:bold;color:#f59e0b');

  const mockData = {
    dates: ['2024-03-15', '2024-04-15', '2024-05-15', '2024-07-15', '2024-08-15', '2024-09-15'],
    categories: {
      biochemistry: {
        markers: {
          glucose: { name: 'Glucose', unit: 'mmol/L', values: [5.0, 5.1, 5.2, 5.0, 5.1, 5.0], refMin: 3.9, refMax: 5.8 },
          creatinine: { name: 'Creatinine', unit: 'µmol/L', values: [80, 85, 82, 92, 95, 93], refMin: 62, refMax: 106 }
        }
      }
    }
  };
  const suppAll = { name: 'Creatine', startDate: '2024-06-01', endDate: null };
  const allResults = computeAllImpacts(suppAll, mockData);
  assert('computeAllImpacts returns array', Array.isArray(allResults));
  assert('Filters out <1% changes', allResults.every(r => Math.abs(r.pctChange) >= 1));
  assert('Sorted by |pctChange| desc', allResults.length < 2 || Math.abs(allResults[0].pctChange) >= Math.abs(allResults[allResults.length - 1].pctChange));
  // Creatinine has ~13% change, glucose has ~1.6% change — creatinine should be first
  if (allResults.length > 0) {
    assert('Highest impact first (creatinine)', allResults[0].marker === 'biochemistry.creatinine', `got ${allResults[0].marker}`);
  }

  // ═══════════════════════════════════════
  // 8. Source code checks
  // ═══════════════════════════════════════
  console.log('%c 8. Source & UI Integration ', 'font-weight:bold;color:#f59e0b');

  const suppSrc = await fetch('/js/supplements.js').then(r => r.text());
  assert('renderSupplementImpact exists', suppSrc.includes('function renderSupplementImpact'));
  assert('Wired into openSupplementsEditor', suppSrc.includes('renderSupplementImpact(editing'));
  assert('Detects overlapping supplements', suppSrc.includes('getOverlappingSupplements'));
  assert('computeAllImpacts on window', suppSrc.includes('computeAllImpacts'));

  // AI-driven display (health dots pattern)
  assert('Uses callClaudeAPI', suppSrc.includes('callClaudeAPI'));
  assert('Uses hasAIProvider', suppSrc.includes('hasAIProvider'));
  assert('Batch fingerprint for all supps', suppSrc.includes('getBatchFingerprint'));
  assert('Batch AI call for all supps', suppSrc.includes('loadBatchImpactAI'));
  assert('Deduplicates in-flight calls', suppSrc.includes('_batchPromise'));
  assert('Uses health dot CSS classes', suppSrc.includes('ctx-health-dot'));
  assert('AI returns dot+summary JSON per supp', suppSrc.includes('"dot":"green|yellow|red|gray"'));
  assert('Shimmer while loading', suppSrc.includes('ctx-health-dot-shimmer'));
  assert('Falls back without AI', suppSrc.includes('Set up an AI provider'));

  // Focus card integration
  const viewsSrc = await fetch('/js/views.js').then(r => r.text());
  assert('Focus card uses computeAllImpacts', viewsSrc.includes('computeAllImpacts'));

  // CSS
  const cssSrc = await fetch('/styles.css').then(r => r.text());
  assert('Impact CSS exists', cssSrc.includes('.supp-impact-section'));
  assert('Impact summary CSS exists', cssSrc.includes('.supp-impact-summary'));
  assert('Summary color variants', cssSrc.includes('.supp-impact-summary-green'));

  // ═══════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════
  console.log(`\n%c Supplement Impact: ${pass} passed, ${fail} failed `, fail === 0 ? 'background:#22c55e;color:#fff;padding:4px 12px;border-radius:4px' : 'background:#ef4444;color:#fff;padding:4px 12px;border-radius:4px');
  window.__testResults = { pass, fail };
})();
