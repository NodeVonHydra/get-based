// test-cycle-stats.js — Browser test for auto-calculated menstrual cycle stats
// Run: fetch('test-cycle-stats.js').then(r=>r.text()).then(s=>Function(s)())
(async function() {
  let passed = 0, failed = 0;
  function assert(name, condition, detail) {
    if (condition) { passed++; console.log(`✅ ${name}`); }
    else { failed++; console.error(`❌ ${name}`, detail || ''); }
  }

  // ========== 1. calculateCycleStats exists ==========
  console.log('\n=== 1. Function exists ===');
  assert('calculateCycleStats is a function', typeof window.calculateCycleStats === 'function');

  // ========== 2. Empty / null periods ==========
  console.log('\n=== 2. Empty periods ===');
  let s = window.calculateCycleStats([]);
  assert('Empty array → cycleLength null', s.cycleLength === null);
  assert('Empty array → periodLength null', s.periodLength === null);
  assert('Empty array → regularity null', s.regularity === null);

  s = window.calculateCycleStats(null);
  assert('Null → cycleLength null', s.cycleLength === null);
  assert('Null → periodLength null', s.periodLength === null);
  assert('Null → regularity null', s.regularity === null);

  s = window.calculateCycleStats(undefined);
  assert('Undefined → all null', s.cycleLength === null && s.periodLength === null && s.regularity === null);

  // ========== 3. Single period (periodLength only) ==========
  console.log('\n=== 3. Single period ===');
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' }
  ]);
  assert('1 period → periodLength = 5', s.periodLength === 5, `got ${s.periodLength}`);
  assert('1 period → cycleLength null', s.cycleLength === null);
  assert('1 period → regularity null', s.regularity === null);

  // Single period with 3-day length
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-03', flow: 'light' }
  ]);
  assert('1 period (3 days) → periodLength = 3', s.periodLength === 3, `got ${s.periodLength}`);

  // ========== 4. Two periods (cycleLength + periodLength, no regularity) ==========
  console.log('\n=== 4. Two periods ===');
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-29', endDate: '2026-02-02', flow: 'moderate' }
  ]);
  assert('2 periods → cycleLength = 28', s.cycleLength === 28, `got ${s.cycleLength}`);
  assert('2 periods → periodLength = 5', s.periodLength === 5, `got ${s.periodLength}`);
  assert('2 periods → regularity null (need 3+)', s.regularity === null);

  // ========== 5. Three periods — regular (stdev ≤ 2) ==========
  console.log('\n=== 5. Three periods — regular ===');
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-29', endDate: '2026-02-02', flow: 'moderate' },  // 28 days
    { startDate: '2026-02-26', endDate: '2026-03-02', flow: 'moderate' }   // 28 days
  ]);
  assert('3 periods regular → cycleLength = 28', s.cycleLength === 28, `got ${s.cycleLength}`);
  assert('3 periods regular → regularity = regular', s.regularity === 'regular', `got ${s.regularity}`);
  assert('3 periods → periodLength = 5', s.periodLength === 5, `got ${s.periodLength}`);

  // ========== 6. Three periods — irregular (stdev > 2, ≤ 7) ==========
  console.log('\n=== 6. Three periods — irregular ===');
  // Intervals: 28 and 35 → mean=31.5, stdev=3.5 → irregular
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-29', endDate: '2026-02-02', flow: 'moderate' },  // 28 days
    { startDate: '2026-03-05', endDate: '2026-03-09', flow: 'moderate' }   // 35 days
  ]);
  assert('Irregular → regularity = irregular', s.regularity === 'irregular', `got ${s.regularity}`);
  assert('Irregular → cycleLength = 32 (avg 28+35)', s.cycleLength === 32, `got ${s.cycleLength}`);

  // ========== 7. Four periods — very irregular (stdev > 7) ==========
  console.log('\n=== 7. Four periods — very irregular ===');
  // Intervals: 22, 40, 25 → mean=29, deviations: -7, 11, -4 → variance=(49+121+16)/3=62, stdev≈7.87
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-04', flow: 'moderate' },
    { startDate: '2026-01-23', endDate: '2026-01-26', flow: 'moderate' },  // 22 days
    { startDate: '2026-03-04', endDate: '2026-03-07', flow: 'moderate' },  // 40 days
    { startDate: '2026-03-29', endDate: '2026-04-01', flow: 'moderate' }   // 25 days
  ]);
  assert('Very irregular → regularity = very_irregular', s.regularity === 'very_irregular', `got ${s.regularity}`);

  // ========== 8. Period length clamping ==========
  console.log('\n=== 8. Period length clamping ===');
  // 1-day period (endDate = startDate) → 1 day, clamped to min 2
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-01', flow: 'light' }
  ]);
  assert('1-day period clamped to 2', s.periodLength === 2, `got ${s.periodLength}`);

  // 14-day period → clamped to max 10
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-14', flow: 'heavy' }
  ]);
  assert('14-day period clamped to 10', s.periodLength === 10, `got ${s.periodLength}`);

  // ========== 9. Cycle length clamping ==========
  console.log('\n=== 9. Cycle length clamping ===');
  // 15-day cycle → clamped to 20
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-04', flow: 'moderate' },
    { startDate: '2026-01-16', endDate: '2026-01-19', flow: 'moderate' }
  ]);
  assert('15-day interval clamped to 20', s.cycleLength === 20, `got ${s.cycleLength}`);

  // 60-day cycle → clamped to 45
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-03-02', endDate: '2026-03-06', flow: 'moderate' }
  ]);
  assert('60-day interval clamped to 45', s.cycleLength === 45, `got ${s.cycleLength}`);

  // ========== 10. Unsorted input ==========
  console.log('\n=== 10. Unsorted input ===');
  s = window.calculateCycleStats([
    { startDate: '2026-02-26', endDate: '2026-03-02', flow: 'moderate' },
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-29', endDate: '2026-02-02', flow: 'moderate' }
  ]);
  assert('Unsorted → still correct cycleLength = 28', s.cycleLength === 28, `got ${s.cycleLength}`);
  assert('Unsorted → regularity = regular', s.regularity === 'regular', `got ${s.regularity}`);

  // ========== 11. Mixed period lengths ==========
  console.log('\n=== 11. Mixed period lengths ===');
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-04', flow: 'light' },   // 4 days
    { startDate: '2026-01-29', endDate: '2026-02-04', flow: 'heavy' },   // 7 days
    { startDate: '2026-02-26', endDate: '2026-03-01', flow: 'moderate' }  // 4 days
  ]);
  assert('Mixed periods → avg periodLength = 5', s.periodLength === 5, `got ${s.periodLength}`);

  // ========== 12. Source code inspection ==========
  console.log('\n=== 12. Source code inspection ===');
  const cycleSource = await fetch('js/cycle.js').then(r => r.text());
  assert('calculateCycleStats exported', cycleSource.includes('export function calculateCycleStats('));
  assert('Window export includes calculateCycleStats', cycleSource.includes('calculateCycleStats,'));
  assert('Editor calls calculateCycleStats', cycleSource.includes('const stats = calculateCycleStats('));
  assert('mc-auto-value class in editor', cycleSource.includes('mc-auto-value'));
  assert('mc-cycle-length-auto id in editor', cycleSource.includes('mc-cycle-length-auto'));
  assert('mc-period-length-auto id in editor', cycleSource.includes('mc-period-length-auto'));
  assert('mc-regularity-auto id in editor', cycleSource.includes('mc-regularity-auto'));
  assert('Auto-value shows unit text', cycleSource.includes('days</div>'));
  assert('syncMenstrualCycleProfileFromForm reads auto elements', cycleSource.includes("getElementById('mc-cycle-length-auto')"));

  // ========== 13. CSS styles ==========
  console.log('\n=== 13. CSS styles ===');
  const cssSource = await fetch('styles.css').then(r => r.text());
  assert('.mc-auto-value style exists', cssSource.includes('.mc-auto-value'));
  assert('cycle-editor-form flex-wrap', cssSource.includes('.cycle-editor-form .supp-form-row'));

  // ========== 14. Editor UI — no periods (manual inputs) ==========
  console.log('\n=== 14. Editor UI — no periods ===');
  const st = window._labState;
  const origMC = JSON.parse(JSON.stringify(st.importedData.menstrualCycle || null));
  const origSex = st.profileSex;
  st.profileSex = 'female';
  st.importedData.menstrualCycle = { cycleLength: 28, periodLength: 5, regularity: 'regular', flow: 'moderate', contraceptive: '', conditions: '', periods: [] };
  window.openMenstrualCycleEditor();
  const modal = document.getElementById('detail-modal');
  assert('No periods → manual cycle length input exists', !!modal.querySelector('#mc-cycle-length'), 'missing #mc-cycle-length');
  assert('No periods → manual period length input exists', !!modal.querySelector('#mc-period-length'), 'missing #mc-period-length');
  assert('No periods → manual regularity select exists', !!modal.querySelector('#mc-regularity'), 'missing #mc-regularity');
  assert('No periods → no auto-calculated elements', !modal.querySelector('#mc-cycle-length-auto'), 'found auto element unexpectedly');

  // ========== 15. Editor UI — 1 period (only periodLength auto) ==========
  console.log('\n=== 15. Editor UI — 1 period ===');
  st.importedData.menstrualCycle.periods = [
    { startDate: '2026-01-01', endDate: '2026-01-06', flow: 'moderate' }
  ];
  window.openMenstrualCycleEditor();
  assert('1 period → periodLength auto-calculated', !!modal.querySelector('#mc-period-length-auto'), 'missing auto period length');
  assert('1 period → periodLength auto value = 6', modal.querySelector('#mc-period-length-auto')?.dataset.value === '6', `got ${modal.querySelector('#mc-period-length-auto')?.dataset.value}`);
  assert('1 period → cycleLength still manual', !!modal.querySelector('#mc-cycle-length'), 'missing manual cycle length');
  assert('1 period → regularity still manual', !!modal.querySelector('#mc-regularity'), 'missing manual regularity');

  // ========== 16. Editor UI — 2 periods (cycleLength + periodLength auto) ==========
  console.log('\n=== 16. Editor UI — 2 periods ===');
  st.importedData.menstrualCycle.periods = [
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-29', endDate: '2026-02-02', flow: 'moderate' }
  ];
  window.openMenstrualCycleEditor();
  assert('2 periods → cycleLength auto', !!modal.querySelector('#mc-cycle-length-auto'));
  assert('2 periods → cycleLength auto = 28', modal.querySelector('#mc-cycle-length-auto')?.dataset.value === '28');
  assert('2 periods → periodLength auto', !!modal.querySelector('#mc-period-length-auto'));
  assert('2 periods → regularity still manual', !!modal.querySelector('#mc-regularity'));

  // ========== 17. Editor UI — 3+ periods (all auto) ==========
  console.log('\n=== 17. Editor UI — 3+ periods (all auto) ===');
  st.importedData.menstrualCycle.periods = [
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-29', endDate: '2026-02-02', flow: 'moderate' },
    { startDate: '2026-02-26', endDate: '2026-03-02', flow: 'moderate' }
  ];
  window.openMenstrualCycleEditor();
  assert('3 periods → cycleLength auto', !!modal.querySelector('#mc-cycle-length-auto'));
  assert('3 periods → periodLength auto', !!modal.querySelector('#mc-period-length-auto'));
  assert('3 periods → regularity auto', !!modal.querySelector('#mc-regularity-auto'));
  assert('3 periods → no manual inputs for auto fields', !modal.querySelector('#mc-cycle-length') && !modal.querySelector('#mc-period-length') && !modal.querySelector('#mc-regularity'));
  assert('3 periods → auto value shows days', modal.querySelector('#mc-cycle-length-auto')?.textContent.includes('days'));

  // ========== 18. syncMenstrualCycleProfileFromForm uses auto values ==========
  console.log('\n=== 18. Sync uses auto values ===');
  // Editor still open from section 17 with 3 periods
  window.syncMenstrualCycleProfileFromForm();
  const mc = st.importedData.menstrualCycle;
  assert('Synced cycleLength = 28', mc.cycleLength === 28, `got ${mc.cycleLength}`);
  assert('Synced periodLength = 5', mc.periodLength === 5, `got ${mc.periodLength}`);
  assert('Synced regularity = regular', mc.regularity === 'regular', `got ${mc.regularity}`);

  // ========== 19. Sync with manual inputs (no periods) ==========
  console.log('\n=== 19. Sync with manual inputs ===');
  st.importedData.menstrualCycle.periods = [];
  window.openMenstrualCycleEditor();
  document.getElementById('mc-cycle-length').value = '30';
  document.getElementById('mc-period-length').value = '6';
  document.getElementById('mc-regularity').value = 'irregular';
  window.syncMenstrualCycleProfileFromForm();
  assert('Manual sync → cycleLength = 30', st.importedData.menstrualCycle.cycleLength === 30, `got ${st.importedData.menstrualCycle.cycleLength}`);
  assert('Manual sync → periodLength = 6', st.importedData.menstrualCycle.periodLength === 6, `got ${st.importedData.menstrualCycle.periodLength}`);
  assert('Manual sync → regularity = irregular', st.importedData.menstrualCycle.regularity === 'irregular', `got ${st.importedData.menstrualCycle.regularity}`);

  // ========== 20. Regularity boundary — stdev exactly 2 ==========
  console.log('\n=== 20. Regularity boundaries ===');
  // Intervals: 26, 30 → mean=28, deviations: -2, 2 → variance=4, stdev=2 → regular
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-27', endDate: '2026-01-31', flow: 'moderate' },  // 26 days
    { startDate: '2026-02-26', endDate: '2026-03-02', flow: 'moderate' }   // 30 days
  ]);
  assert('stdev=2 → regular', s.regularity === 'regular', `got ${s.regularity}`);

  // Intervals: 25, 31 → mean=28, deviations: -3, 3 → variance=9, stdev=3 → irregular
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-26', endDate: '2026-01-30', flow: 'moderate' },  // 25 days
    { startDate: '2026-02-26', endDate: '2026-03-02', flow: 'moderate' }   // 31 days
  ]);
  assert('stdev=3 → irregular', s.regularity === 'irregular', `got ${s.regularity}`);

  // Intervals: 21, 35 → mean=28, deviations: -7, 7 → variance=49, stdev=7 → irregular
  s = window.calculateCycleStats([
    { startDate: '2026-01-01', endDate: '2026-01-05', flow: 'moderate' },
    { startDate: '2026-01-22', endDate: '2026-01-26', flow: 'moderate' },  // 21 days
    { startDate: '2026-02-26', endDate: '2026-03-02', flow: 'moderate' }   // 35 days
  ]);
  assert('stdev=7 → irregular (boundary)', s.regularity === 'irregular', `got ${s.regularity}`);

  // ========== 21. Clickable cycle summary ==========
  console.log('\n=== 21. Clickable cycle summary ===');
  assert('cycle-summary has onclick in source', cycleSource.includes('cycle-summary" onclick="openMenstrualCycleEditor()"'));
  assert('cycle-summary has cursor:pointer', cycleSource.includes('style="cursor:pointer"'));

  // ========== 22. Modal overflow fix ==========
  console.log('\n=== 22. Modal overflow fix ===');
  assert('modal overflow-x hidden', cssSource.includes('overflow-x: hidden'));
  assert('modal form rows flex-wrap', cssSource.includes('.modal .supp-form-row') && cssSource.includes('flex-wrap: wrap'));
  assert('modal form fields min-width', cssSource.includes('.modal .supp-form-field') && cssSource.includes('min-width: min(140px'));

  // ========== Cleanup ==========
  console.log('\n=== Cleanup ===');
  window.closeModal();
  st.importedData.menstrualCycle = origMC;
  st.profileSex = origSex;

  console.log(`\n${'='.repeat(40)}\nResults: ${passed} passed, ${failed} failed, ${passed + failed} total\n${'='.repeat(40)}`);
  if (failed > 0) console.error(`⚠️ ${failed} test(s) failed!`);
  else console.log('🎉 All tests passed!');
})();
