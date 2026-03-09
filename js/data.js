// data.js — Data pipeline, unit conversion, date range, trend detection

import { state } from './state.js';
import { MARKER_SCHEMA, UNIT_CONVERSIONS, OPTIMAL_RANGES, PHASE_RANGES } from './schema.js';
import { hashString, getStatus, formatValue, linearRegression, showNotification } from './utils.js';
import { profileStorageKey, touchProfileTimestamp } from './profile.js';
import { encryptedSetItem, broadcastDataChanged, getEncryptionEnabled, scheduleAutoBackup } from './crypto.js';

// ═══════════════════════════════════════════════
// PRIVATE CYCLE PHASE HELPER (avoids circular dep with cycle.js)
// ═══════════════════════════════════════════════
function _getCyclePhase(dateStr, mc) {
  if (!mc || !mc.periods || mc.periods.length === 0) return null;
  const target = new Date(dateStr + 'T00:00:00');
  const sorted = mc.periods.slice().sort((a, b) => b.startDate.localeCompare(a.startDate));
  let periodStart = null;
  for (const p of sorted) {
    if (new Date(p.startDate + 'T00:00:00') <= target) { periodStart = p.startDate; break; }
  }
  if (!periodStart) return null;
  const startDate = new Date(periodStart + 'T00:00:00');
  const cycleDay = Math.floor((target - startDate) / 86400000) + 1;
  const cycleLen = mc.cycleLength || 28;
  if (cycleDay > cycleLen + 7) return null;
  const periodLen = mc.periodLength || 5;
  const ovulationDay = cycleLen - 14;
  let phase, phaseName;
  if (cycleDay <= periodLen) { phase = 'menstrual'; phaseName = 'Menstrual'; }
  else if (cycleDay < ovulationDay - 1) { phase = 'follicular'; phaseName = 'Follicular'; }
  else if (cycleDay <= ovulationDay + 1) { phase = 'ovulatory'; phaseName = 'Ovulatory'; }
  else { phase = 'luteal'; phaseName = 'Luteal'; }
  return { cycleDay, phase, phaseName };
}

// ═══════════════════════════════════════════════
// REFRESH CALLBACK
// ═══════════════════════════════════════════════
let _refreshCallback = null;
export function registerRefreshCallback(fn) { _refreshCallback = fn; }

// ═══════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════
export async function saveImportedData() {
  try {
    const key = profileStorageKey(state.currentProfile, 'imported');
    const value = JSON.stringify(state.importedData);
    if (getEncryptionEnabled()) {
      await encryptedSetItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
    broadcastDataChanged(state.currentProfile);
    scheduleAutoBackup();
    touchProfileTimestamp(state.currentProfile);
  } catch (e) {
    showNotification('Storage limit reached — clear old data or profiles to free space.', 'error');
  }
}

export function getFocusCardFingerprint() {
  const parts = [
    (state.importedData.entries || []).map(e => e.date + ':' + Object.keys(e.markers || {}).length).join(','),
    state.profileSex || '',
    state.profileDob || '',
    JSON.stringify(state.importedData.diagnoses || null),
    (state.importedData.healthGoals || []).map(g => g.text).join(','),
    JSON.stringify(state.importedData.diet || null),
    JSON.stringify(state.importedData.exercise || null),
    JSON.stringify(state.importedData.sleepRest || null),
    JSON.stringify(state.importedData.lightCircadian || null),
    JSON.stringify(state.importedData.stress || null),
    JSON.stringify(state.importedData.loveLife || null),
    JSON.stringify(state.importedData.environment || null),
    state.importedData.interpretiveLens || '',
    state.importedData.contextNotes || '',
    JSON.stringify(state.importedData.menstrualCycle || null),
    JSON.stringify((state.importedData.supplements || []).map(s => s.name + ':' + s.startDate))
  ];
  return hashString(parts.join('|'));
}

// ═══════════════════════════════════════════════
// DATA PIPELINE
// ═══════════════════════════════════════════════
export function getActiveData() {
  const data = {
    dates: [],
    dateLabels: [],
    categories: JSON.parse(JSON.stringify(MARKER_SCHEMA))
  };

  // Merge custom markers into categories
  const custom = (state.importedData && state.importedData.customMarkers) ? state.importedData.customMarkers : {};
  for (const [fullKey, def] of Object.entries(custom)) {
    const [catKey, markerKey] = fullKey.split('.');
    if (!markerKey) continue;
    if (!data.categories[catKey]) {
      // Create new category
      data.categories[catKey] = {
        label: def.categoryLabel || catKey.charAt(0).toUpperCase() + catKey.slice(1),
        icon: def.icon || '\uD83D\uDD16',
        singlePoint: !!def.singlePoint,
        group: def.group || null,
        markers: {}
      };
    }
    // Add marker if not already in schema
    if (!data.categories[catKey].markers[markerKey]) {
      data.categories[catKey].markers[markerKey] = {
        name: def.name,
        unit: def.unit || '',
        refMin: def.refMin,
        refMax: def.refMax,
        custom: true
      };
    }
  }

  // Apply sex-specific reference ranges
  if (state.profileSex === 'female') {
    for (const cat of Object.values(data.categories)) {
      for (const marker of Object.values(cat.markers)) {
        if (marker.refMin_f !== undefined) { marker.refMin = marker.refMin_f; marker.refMax = marker.refMax_f; }
      }
    }
  }

  // Merge optimal ranges into markers
  for (const [fullKey, opt] of Object.entries(OPTIMAL_RANGES)) {
    const [catKey, markerKey] = fullKey.split('.');
    const cat = data.categories[catKey];
    if (cat && cat.markers[markerKey]) {
      const marker = cat.markers[markerKey];
      if (state.profileSex === 'female' && opt.optimalMin_f !== undefined) {
        marker.optimalMin = opt.optimalMin_f;
        marker.optimalMax = opt.optimalMax_f;
      } else {
        marker.optimalMin = opt.optimalMin;
        marker.optimalMax = opt.optimalMax;
      }
    }
  }

  // Apply user range overrides (ref + optimal, after schema defaults are set)
  const refOverrides = state.importedData?.refOverrides || {};
  for (const [fullKey, ovr] of Object.entries(refOverrides)) {
    const [catKey, markerKey] = fullKey.split('.');
    const cat = data.categories[catKey];
    if (cat && cat.markers[markerKey]) {
      const m = cat.markers[markerKey];
      if (ovr.refMin != null) m.refMin = ovr.refMin;
      if (ovr.refMax != null) m.refMax = ovr.refMax;
      if (ovr.optimalMin != null) m.optimalMin = ovr.optimalMin;
      if (ovr.optimalMax != null) m.optimalMax = ovr.optimalMax;
    }
  }

  const entries = (state.importedData && state.importedData.entries) ? state.importedData.entries : [];
  const hasEntries = entries.length > 0;

  // Build entry lookup: date → merged markers
  const entryLookup = {};
  for (const entry of entries) {
    if (!entryLookup[entry.date]) entryLookup[entry.date] = {};
    Object.assign(entryLookup[entry.date], entry.markers);
  }

  // Identify singlePoint categories
  const singlePointCats = new Set();
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) singlePointCats.add(catKey);
  }

  // Collect dates from entries that have non-singlePoint markers
  const regularDates = new Set();
  if (hasEntries) {
    for (const entry of entries) {
      for (const key of Object.keys(entry.markers || {})) {
        if (!singlePointCats.has(key.split('.')[0])) {
          regularDates.add(entry.date);
          break;
        }
      }
    }
  }

  const sortedDates = [...regularDates].sort();
  data.dates = sortedDates;
  data.dateLabels = sortedDates.map(d => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  // Cycle phase gating — shared by phase labels (charts) and phase-specific ref ranges
  const isFemale = state.profileSex === 'female';
  const mc = state.importedData && state.importedData.menstrualCycle;
  const _hormonalContraceptives = ['ocp', 'pill', 'patch', 'ring', 'implant', 'mirena', 'hormonal iud', 'depo', 'injection'];
  const _isHormonalBC = mc?.contraceptive && _hormonalContraceptives.some(h => mc.contraceptive.toLowerCase().includes(h));
  const _isActiveCycle = !mc?.cycleStatus || mc.cycleStatus === 'regular' || mc.cycleStatus === 'perimenopause';
  const _hasCyclePhases = isFemale && mc && mc.periods && mc.periods.length > 0 && !_isHormonalBC && _isActiveCycle;

  // Compute top-level phase labels for charts (female + active cycle, no hormonal BC)
  if (_hasCyclePhases) {
    data.phaseLabels = sortedDates.map(d => {
      const p = _getCyclePhase(d, mc);
      return p ? p.phase : null;
    });
  }

  // Populate values for each category
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) {
      // Find the latest entry that has any marker in this category
      let singleDate = null;
      for (let ei = entries.length - 1; ei >= 0; ei--) {
        for (const key of Object.keys(entries[ei].markers || {})) {
          if (key.startsWith(catKey + '.')) { singleDate = entries[ei].date; break; }
        }
        if (singleDate) break;
      }
      cat.singleDate = singleDate;
      const singleDateLabel = singleDate
        ? new Date(singleDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : null;
      cat.singleDateLabel = singleDateLabel;
      for (const [markerKey, marker] of Object.entries(cat.markers)) {
        marker.singlePoint = true;
        marker.singleDateLabel = singleDateLabel;
        const fullKey = `${catKey}.${markerKey}`;
        if (singleDate && entryLookup[singleDate] && entryLookup[singleDate][fullKey] !== undefined) {
          marker.values = [entryLookup[singleDate][fullKey]];
        } else {
          marker.values = [];
        }
      }
    } else {
      for (const [markerKey, marker] of Object.entries(cat.markers)) {
        const fullKey = `${catKey}.${markerKey}`;
        marker.values = sortedDates.map(date => {
          if (entryLookup[date] && entryLookup[date][fullKey] !== undefined) {
            return entryLookup[date][fullKey];
          }
          return null;
        });
      }
    }
  }

  // Compute phase-specific reference ranges for cycle-dependent markers
  if (_hasCyclePhases) {
    for (const [fullKey, phaseMap] of Object.entries(PHASE_RANGES)) {
      const [catKey, markerKey] = fullKey.split('.');
      const marker = data.categories[catKey] && data.categories[catKey].markers[markerKey];
      if (!marker) continue;
      marker.phaseRefRanges = sortedDates.map(d => {
        const p = _getCyclePhase(d, mc);
        return p ? (phaseMap[p.phase] || null) : null;
      });
      marker.phaseLabels = sortedDates.map(d => {
        const p = _getCyclePhase(d, mc);
        return p ? p.phaseName : null;
      });
    }
  }

  // Calculate ratios from component markers
  const ratios = data.categories.calculatedRatios;
  if (ratios) {
    const getVals = (catKey, markerKey) => {
      const cat = data.categories[catKey];
      return cat && cat.markers[markerKey] ? cat.markers[markerKey].values : null;
    };
    const divide = (numVals, denVals) => {
      if (!numVals || !denVals) return sortedDates.map(() => null);
      return sortedDates.map((_, i) => {
        const n = numVals[i], d = denVals[i];
        return (n != null && d != null && d !== 0) ? Math.round((n / d) * 1000) / 1000 : null;
      });
    };
    ratios.markers.tgHdlRatio.values = divide(getVals('lipids', 'triglycerides'), getVals('lipids', 'hdl'));
    ratios.markers.ldlHdlRatio.values = divide(getVals('lipids', 'ldl'), getVals('lipids', 'hdl'));
    ratios.markers.apoBapoAIRatio.values = divide(getVals('lipids', 'apoB'), getVals('lipids', 'apoAI'));
    ratios.markers.nlr.values = divide(getVals('differential', 'neutrophils'), getVals('differential', 'lymphocytes'));
    ratios.markers.plr.values = divide(getVals('hematology', 'platelets'), getVals('differential', 'lymphocytes'));
    ratios.markers.deRitisRatio.values = divide(getVals('biochemistry', 'ast'), getVals('biochemistry', 'alt'));
    ratios.markers.copperZincRatio.values = divide(getVals('electrolytes', 'copper'), getVals('electrolytes', 'zinc'));

    // BUN/Creatinine Ratio — computed in US units: (urea×2.801) / (creatinine×0.01131)
    const ureaVals = getVals('biochemistry', 'urea');
    const creatVals = getVals('biochemistry', 'creatinine');
    ratios.markers.bunCreatRatio.values = sortedDates.map((_, i) => {
      const u = ureaVals?.[i], c = creatVals?.[i];
      if (u == null || c == null || c === 0) return null;
      return Math.round((u * 2.801) / (c * 0.01131) * 10) / 10;
    });

    // Free Water Deficit — TBW × (Na/140 − 1), assumes 70kg body weight
    const sodiumVals = getVals('electrolytes', 'sodium');
    ratios.markers.freeWaterDeficit.values = sortedDates.map((_, i) => {
      const na = sodiumVals ? sodiumVals[i] : null;
      if (na == null || na <= 0) return null;
      const tbwFactor = state.profileSex === 'female' ? 0.5 : 0.6;
      const tbw = 70 * tbwFactor;
      const fwd = tbw * (na / 140 - 1);
      return Math.round(fwd * 100) / 100;
    });

    // PhenoAge (Levine 2018) — biological age from 9 biomarkers + chronological age
    ratios.markers.phenoAge.values = sortedDates.map((dateStr, i) => {
      if (!state.profileDob) return null;
      const albumin_si   = getVals('proteins', 'albumin')?.[i];        // g/l
      const creatinine_si = getVals('biochemistry', 'creatinine')?.[i]; // µmol/l
      const glucose_si   = getVals('biochemistry', 'glucose')?.[i];    // mmol/l
      const crp          = getVals('proteins', 'hsCRP')?.[i];          // mg/l (same)
      const lymphPct_si  = getVals('differential', 'lymphocytesPct')?.[i]; // fraction 0–1
      const mcv          = getVals('hematology', 'mcv')?.[i];          // fL (same)
      const rdw          = getVals('hematology', 'rdwcv')?.[i];        // % (same)
      const alp_si       = getVals('biochemistry', 'alp')?.[i];        // µkat/l
      const wbc          = getVals('hematology', 'wbc')?.[i];          // 10^9/l (same)
      if ([albumin_si, creatinine_si, glucose_si, crp, lymphPct_si, mcv, rdw, alp_si, wbc].some(v => v == null)) return null;
      if (crp <= 0) return null; // ln(CRP) undefined for non-positive

      // Chronological age at blood draw date
      const dob = new Date(state.profileDob + 'T00:00:00');
      const drawDate = new Date(dateStr + 'T00:00:00');
      let age = (drawDate - dob) / (365.25 * 24 * 60 * 60 * 1000);
      if (age <= 0) return null;

      // Levine 2018 coefficients — calibrated for SI units as stored in the schema:
      // albumin g/L, creatinine µmol/L, glucose mmol/L, CRP mg/L (ln),
      // lymphocytes fraction 0–1, MCV fL, RDW %, ALP µkat/L, WBC 10^9/L
      const xb = -19.907
        - 0.0336  * albumin_si
        + 0.0095  * creatinine_si
        + 0.1953  * glucose_si
        + 0.0954  * Math.log(crp)
        - 0.0120  * lymphPct_si
        + 0.0268  * mcv
        + 0.3306  * rdw
        + 0.00188 * alp_si
        + 0.0554  * wbc
        + 0.0804  * age;

      const mortalityScore = 1 - Math.exp(-Math.exp(xb) * (Math.exp(120 * 0.0076927) - 1) / 0.0076927);
      if (mortalityScore <= 0 || mortalityScore >= 1) return null;
      const phenoAge = 141.50225 + Math.log(-0.00553 * Math.log(1 - mortalityScore)) / 0.090165;
      return Math.round(phenoAge * 10) / 10;
    });
  }

  if (state.unitSystem === 'US') applyUnitConversion(data);
  return data;
}

export function convertDisplayToSI(dotKey, value) {
  if (state.unitSystem !== 'US') return value;
  const conv = UNIT_CONVERSIONS[dotKey];
  if (!conv) return value;
  if (conv.type === 'multiply') return parseFloat((value / conv.factor).toPrecision(6));
  if (conv.type === 'hba1c') return parseFloat(((value - 2.15) * 10.929).toFixed(1));
  return value;
}

export function applyUnitConversion(data) {
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [markerKey, marker] of Object.entries(cat.markers)) {
      const conv = UNIT_CONVERSIONS[`${catKey}.${markerKey}`];
      if (!conv) continue;
      if (conv.type === 'multiply') {
        marker.values = marker.values.map(v => v !== null ? parseFloat((v * conv.factor).toPrecision(4)) : null);
        if (marker.refMin != null) marker.refMin = parseFloat((marker.refMin * conv.factor).toPrecision(4));
        if (marker.refMax != null) marker.refMax = parseFloat((marker.refMax * conv.factor).toPrecision(4));
        if (marker.optimalMin != null) marker.optimalMin = parseFloat((marker.optimalMin * conv.factor).toPrecision(4));
        if (marker.optimalMax != null) marker.optimalMax = parseFloat((marker.optimalMax * conv.factor).toPrecision(4));
        if (marker.phaseRefRanges) {
          marker.phaseRefRanges = marker.phaseRefRanges.map(r =>
            r ? { min: parseFloat((r.min * conv.factor).toPrecision(4)),
                  max: parseFloat((r.max * conv.factor).toPrecision(4)) } : null
          );
        }
        marker.unit = conv.usUnit;
      } else if (conv.type === 'hba1c') {
        marker.values = marker.values.map(v => v !== null ? parseFloat(((v / 10.929) + 2.15).toFixed(1)) : null);
        if (marker.refMin != null) marker.refMin = parseFloat(((marker.refMin / 10.929) + 2.15).toFixed(1));
        if (marker.refMax != null) marker.refMax = parseFloat(((marker.refMax / 10.929) + 2.15).toFixed(1));
        if (marker.optimalMin != null) marker.optimalMin = parseFloat(((marker.optimalMin / 10.929) + 2.15).toFixed(1));
        if (marker.optimalMax != null) marker.optimalMax = parseFloat(((marker.optimalMax / 10.929) + 2.15).toFixed(1));
        marker.unit = '%';
      }
    }
  }
}

// ═══════════════════════════════════════════════
// DATE RANGE FILTER
// ═══════════════════════════════════════════════
export function filterDatesByRange(data) {
  if (state.dateRangeFilter === 'all') return data;
  const months = state.dateRangeFilter === '3m' ? 3 : state.dateRangeFilter === '6m' ? 6 : 12;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const indices = [];
  for (let i = 0; i < data.dates.length; i++) {
    if (data.dates[i] >= cutoffStr) indices.push(i);
  }
  if (indices.length === 0) return data; // fallback: show all if no dates in range
  const filtered = {
    dates: indices.map(i => data.dates[i]),
    dateLabels: indices.map(i => data.dateLabels[i]),
    ...(data.phaseLabels && { phaseLabels: indices.map(i => data.phaseLabels[i]) }),
    categories: {}
  };
  for (const [catKey, cat] of Object.entries(data.categories)) {
    const filteredCat = { ...cat, markers: {} };
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      if (marker.singlePoint || cat.singlePoint) {
        filteredCat.markers[mKey] = marker;
      } else {
        filteredCat.markers[mKey] = {
          ...marker,
          values: indices.map(i => marker.values[i]),
          ...(marker.phaseRefRanges && { phaseRefRanges: indices.map(i => marker.phaseRefRanges[i]) }),
          ...(marker.phaseLabels && { phaseLabels: indices.map(i => marker.phaseLabels[i]) }),
        };
      }
    }
    filtered.categories[catKey] = filteredCat;
  }
  return filtered;
}

export function renderDateRangeFilter() {
  const ranges = [
    { key: '3m', label: '3M' },
    { key: '6m', label: '6M' },
    { key: '1y', label: '1Y' },
    { key: 'all', label: 'All' }
  ];
  return `<div class="date-range-filter">${ranges.map(r =>
    `<button class="range-btn${state.dateRangeFilter === r.key ? ' active' : ''}" onclick="setDateRange('${r.key}')">${r.label}</button>`
  ).join('')}</div>`;
}

export function setDateRange(range) {
  state.dateRangeFilter = range;
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  window.navigate(activeCat);
  window.buildSidebar();
}

export function renderChartLayersDropdown() {
  const hasNotes = (state.importedData.notes || []).length > 0;
  const hasSupps = (state.importedData.supplements || []).length > 0;
  const hasCycle = state.profileSex === 'female' && state.importedData.menstrualCycle?.periods?.length > 0;
  if (!hasNotes && !hasSupps && !hasCycle) return '';
  return `<div class="chart-layers-wrapper">
    <button class="view-btn chart-layers-trigger" onclick="toggleChartLayersDropdown(event)">Layers \u25BE</button>
    <div class="chart-layers-dropdown" id="chart-layers-dropdown">
      ${hasNotes ? `<label class="chart-layers-row" onclick="event.stopPropagation()">
        <input type="checkbox" ${state.noteOverlayMode === 'on' ? 'checked' : ''} onchange="setNoteOverlay(this.checked?'on':'off')">
        <span>\uD83D\uDCDD Notes</span>
      </label>` : ''}
      ${hasSupps ? `<label class="chart-layers-row" onclick="event.stopPropagation()">
        <input type="checkbox" ${state.suppOverlayMode === 'on' ? 'checked' : ''} onchange="setSuppOverlay(this.checked?'on':'off')">
        <span>\uD83D\uDC8A Supplements</span>
      </label>` : ''}
      ${hasCycle ? `<label class="chart-layers-row" onclick="event.stopPropagation()">
        <input type="checkbox" ${state.phaseOverlayMode === 'on' ? 'checked' : ''} onchange="setPhaseOverlay(this.checked?'on':'off')">
        <span>\uD83D\uDD34 Cycle Phases</span>
      </label>` : ''}
    </div>
  </div>`;
}

export function toggleChartLayersDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('chart-layers-dropdown');
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open', !isOpen);
  if (!isOpen) {
    const close = (ev) => {
      if (!ev.target.closest('.chart-layers-wrapper')) {
        dd.classList.remove('open');
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 0);
  }
}

export function setSuppOverlay(mode) {
  state.suppOverlayMode = mode === 'off' ? 'off' : 'on';
  localStorage.setItem(profileStorageKey(state.currentProfile, 'suppOverlay'), state.suppOverlayMode);
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  window.navigate(activeCat);
}

export function setNoteOverlay(mode) {
  state.noteOverlayMode = mode === 'off' ? 'off' : 'on';
  localStorage.setItem(profileStorageKey(state.currentProfile, 'noteOverlay'), state.noteOverlayMode);
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  window.navigate(activeCat);
}

export function setPhaseOverlay(mode) {
  state.phaseOverlayMode = mode === 'off' ? 'off' : 'on';
  localStorage.setItem(profileStorageKey(state.currentProfile, 'phaseOverlay'), state.phaseOverlayMode);
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  window.navigate(activeCat);
}

export function recalculateHOMAIR(entry) {
  const glucose = entry.markers["biochemistry.glucose"];
  const insulin = entry.markers["hormones.insulin"] || entry.markers["diabetes.insulin_d"];
  if (glucose !== undefined && insulin !== undefined) {
    entry.markers["diabetes.homaIR"] = Math.round((glucose * insulin) / 22.5 * 100) / 100;
  }
}

// ═══════════════════════════════════════════════
// CHART LIFECYCLE
// ═══════════════════════════════════════════════
export function destroyAllCharts() {
  for (const c of Object.values(state.chartInstances)) c.destroy();
  state.chartInstances = {};
}

// ═══════════════════════════════════════════════
// MARKER STATUS HELPERS
// ═══════════════════════════════════════════════
export function countFlagged(markers) {
  let c = 0;
  for (const m of markers) { const i = getLatestValueIndex(m.values); if (i!==-1) { const r = getEffectiveRangeForDate(m, i); if (getStatus(m.values[i],r.min,r.max)!=="normal") c++; } }
  return c;
}

export function countMissing(markers) {
  let c = 0;
  for (const m of markers) { if (m.values.every(v=>v===null)) c++; }
  return c;
}

export function getLatestValueIndex(values) {
  for (let i=values.length-1;i>=0;i--) if (values[i]!==null) return i;
  return -1;
}

export function getAllFlaggedMarkers(data) {
  if (!data) data = getActiveData();
  const flags = [];
  for (const [ck, cat] of Object.entries(data.categories)) {
    for (const [k, m] of Object.entries(cat.markers)) {
      const i = getLatestValueIndex(m.values);
      if (i!==-1) { const v=m.values[i], r=getEffectiveRangeForDate(m, i), s=getStatus(v,r.min,r.max);
        if (s==="high"||s==="low") flags.push({categoryKey:ck,markerKey:k,id:ck+'_'+k,name:m.name,value:formatValue(v),rawValue:v,unit:m.unit,refMin:m.refMin,refMax:m.refMax,optimalMin:m.optimalMin,optimalMax:m.optimalMax,effectiveMin:r.min,effectiveMax:r.max,status:s});
      }
    }
  }
  return flags;
}

export function statusIcon(s) {
  if (s === 'normal') return '\u2713';
  if (s === 'high') return '\u25B2';
  if (s === 'low') return '\u25BC';
  return '';
}

// ═══════════════════════════════════════════════
// TREND DETECTION
// ═══════════════════════════════════════════════
export function detectTrendAlerts(data) {
  const alerts = [];
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) continue;
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      if (marker.singlePoint) continue;
      const nonNull = marker.values.map((v, i) => ({ v, i })).filter(x => x.v !== null);
      if (nonNull.length < 2) continue;
      const r = getEffectiveRange(marker); // aggregate range for normalization width
      if (r.min == null || r.max == null) continue;
      const range = r.max - r.min;
      if (range <= 0) continue;
      const id = catKey + '_' + mKey;
      const latestEntry = nonNull[nonNull.length - 1];
      const latestVal = latestEntry.v;
      const lr = getEffectiveRangeForDate(marker, latestEntry.i); // phase-aware range for latest
      const prevVal = nonNull[nonNull.length - 2].v;
      const sparkVals = nonNull.slice(-Math.min(5, nonNull.length));

      // Sudden change detection (2+ values)
      const jump = Math.abs(latestVal - prevVal);
      if (jump > range * 0.25) {
        if (latestVal > lr.max) {
          alerts.push({ id, name: marker.name, category: cat.label, concern: 'sudden_high',
            spark: sparkVals.map(x => formatValue(x.v)), direction: 'rising' });
          continue;
        }
        if (latestVal < lr.min) {
          alerts.push({ id, name: marker.name, category: cat.label, concern: 'sudden_low',
            spark: sparkVals.map(x => formatValue(x.v)), direction: 'falling' });
          continue;
        }
      }

      // Linear regression (3+ values)
      if (nonNull.length < 3) continue;
      const vals = nonNull.map(x => x.v);
      const reg = linearRegression(vals);
      const normSlope = reg.slope / range;
      if (Math.abs(normSlope) < 0.02) continue;
      // R-squared filter only for 4+ points (2-3 points inherently have high R²)
      if (nonNull.length >= 4 && reg.r2 < 0.5) continue;
      const rising = normSlope > 0;
      let concern = null;
      if (rising && latestVal > lr.max) concern = 'past_high';
      else if (!rising && latestVal < lr.min) concern = 'past_low';
      else if (rising && latestVal >= lr.max - range * 0.15) concern = 'approaching_high';
      else if (!rising && latestVal <= lr.min + range * 0.15) concern = 'approaching_low';
      if (!concern) continue;
      alerts.push({ id, name: marker.name, category: cat.label, concern,
        spark: sparkVals.map(x => formatValue(x.v)), direction: rising ? 'rising' : 'falling' });
    }
  }
  // Sort: sudden first, then past, then approaching
  alerts.sort((a, b) => {
    const priority = c => c.startsWith('sudden_') ? 0 : c.startsWith('past_') ? 1 : 2;
    return priority(a.concern) - priority(b.concern);
  });
  return alerts;
}

export function getKeyTrendMarkers(filteredData) {
  const selected = [];
  const seen = new Set();
  const MAX = 8;

  function hasData(cat, key) {
    const c = filteredData.categories[cat];
    if (!c || c.singlePoint) return false;
    const m = c.markers[key];
    return m && m.values && m.values.some(v => v !== null);
  }

  function add(cat, key) {
    if (selected.length >= MAX) return;
    const id = cat + '_' + key;
    if (seen.has(id)) return;
    if (!hasData(cat, key)) return;
    seen.add(id);
    selected.push({ cat, key });
  }

  // Tier 1: Trend alerts (sudden > past > approaching — already sorted)
  const alerts = detectTrendAlerts(filteredData);
  for (const a of alerts) {
    const dot = a.id.indexOf('_');
    add(a.id.substring(0, dot), a.id.substring(dot + 1));
  }

  // Tier 2: Flagged (out-of-range) markers
  const flags = getAllFlaggedMarkers(filteredData);
  for (const f of flags) {
    add(f.categoryKey, f.markerKey);
  }

  // Tier 3: Sex-aware defaults
  const defaults = state.profileSex === 'female'
    ? [['diabetes','hba1c'],['diabetes','homaIR'],['lipids','ldl'],['vitamins','vitaminD'],
       ['thyroid','tsh'],['iron','ferritin'],['hormones','estradiol'],['proteins','hsCRP']]
    : state.profileSex === 'male'
    ? [['diabetes','hba1c'],['diabetes','homaIR'],['lipids','ldl'],['vitamins','vitaminD'],
       ['thyroid','tsh'],['hormones','testosterone'],['proteins','hsCRP'],['biochemistry','ggt']]
    : [['diabetes','hba1c'],['diabetes','homaIR'],['lipids','ldl'],['vitamins','vitaminD'],
       ['thyroid','tsh'],['proteins','hsCRP'],['biochemistry','ggt'],['hematology','hemoglobin']];
  for (const [cat, key] of defaults) add(cat, key);

  return selected;
}

// ═══════════════════════════════════════════════
// UNIT TOGGLE
// ═══════════════════════════════════════════════
export function switchUnitSystem(system) {
  state.unitSystem = system;
  localStorage.setItem(profileStorageKey(state.currentProfile, 'units'), system);
  const data = getActiveData();
  const activeNav = document.querySelector(".nav-item.active");
  const currentCategory = activeNav ? activeNav.dataset.category : "dashboard";
  window.buildSidebar(data);
  updateHeaderDates(data);
  window.navigate(currentCategory, data);
}

export function getEffectiveRange(marker) {
  if (state.rangeMode === 'optimal' || state.rangeMode === 'both') {
    if (marker.optimalMin != null && marker.optimalMax != null) {
      return { min: marker.optimalMin, max: marker.optimalMax };
    }
  }
  return { min: marker.refMin, max: marker.refMax };
}

export function getEffectiveRangeForDate(marker, dateIndex) {
  if (marker.phaseRefRanges && marker.phaseRefRanges[dateIndex]) {
    return marker.phaseRefRanges[dateIndex];
  }
  return getEffectiveRange(marker);
}

export function getPhaseRefEnvelope(marker) {
  if (!marker.phaseRefRanges) return null;
  let min = Infinity, max = -Infinity;
  for (const r of marker.phaseRefRanges) {
    if (!r) continue;
    if (r.min < min) min = r.min;
    if (r.max > max) max = r.max;
  }
  return min === Infinity ? null : { min, max };
}

export function switchRangeMode(mode) {
  state.rangeMode = mode;
  localStorage.setItem(profileStorageKey(state.currentProfile, 'rangeMode'), mode);
  updateHeaderRangeToggle();
  const data = getActiveData();
  const activeNav = document.querySelector(".nav-item.active");
  const currentCategory = activeNav ? activeNav.dataset.category : "dashboard";
  window.buildSidebar(data);
  window.navigate(currentCategory, data);
}

export function updateHeaderDates(data) {
  if (!data) data = getActiveData();
  const el = document.getElementById("header-dates");
  if (el) {
    if (data.dateLabels.length > 0) {
      const labels = data.dateLabels;
      const dateText = labels.length === 1 ? labels[0] : `${labels[0]} – ${labels[labels.length - 1]}`;
      el.innerHTML = `<span class="label">Dates:</span> ${dateText}`;
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }
}

export function updateHeaderRangeToggle() {
  const el = document.getElementById('header-range-toggle');
  if (!el) return;
  el.innerHTML = ['optimal', 'reference', 'both'].map(m =>
    `<button class="range-toggle-btn${state.rangeMode === m ? ' active' : ''}" onclick="switchRangeMode('${m}')">${m.charAt(0).toUpperCase() + m.slice(1)}</button>`
  ).join('');
}

Object.assign(window, { saveImportedData, getFocusCardFingerprint, getActiveData, applyUnitConversion, filterDatesByRange, recalculateHOMAIR, renderDateRangeFilter, setDateRange, renderChartLayersDropdown, toggleChartLayersDropdown, setSuppOverlay, setNoteOverlay, setPhaseOverlay, destroyAllCharts, countFlagged, countMissing, getLatestValueIndex, getAllFlaggedMarkers, statusIcon, detectTrendAlerts, getKeyTrendMarkers, switchUnitSystem, getEffectiveRange, getEffectiveRangeForDate, getPhaseRefEnvelope, switchRangeMode, updateHeaderDates, updateHeaderRangeToggle, registerRefreshCallback });
