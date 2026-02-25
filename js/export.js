// export.js — PDF report, JSON export/import, clear all data

import { state } from './state.js';
import { getStatus, formatValue, showNotification, showConfirmDialog, getTrend } from './utils.js';
import { getActiveData, filterDatesByRange, getEffectiveRange, getAllFlaggedMarkers, getLatestValueIndex, saveImportedData } from './data.js';
import { getProfiles, profileStorageKey } from './profile.js';
import { getBloodDrawPhases } from './cycle.js';

// ═══════════════════════════════════════════════
// PDF REPORT EXPORT
// ═══════════════════════════════════════════════
export function exportPDFReport() {
  const rawData = getActiveData();
  const data = filterDatesByRange(rawData);
  const profiles = getProfiles();
  const profileName = (profiles.find(p => p.id === state.currentProfile) || { name: 'Profile' }).name;
  const sexLabel = state.profileSex === 'female' ? 'Female' : state.profileSex === 'male' ? 'Male' : 'Not specified';
  const flags = getAllFlaggedMarkers(data);
  const notes = (state.importedData.notes || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const supps = state.importedData.supplements || [];
  const contextSections = [];
  const fmtCtx = obj => {
    if (typeof obj === 'string') return obj;
    const parts = [];
    for (const [k, v] of Object.entries(obj)) {
      if (v == null || k === 'note') continue;
      if (Array.isArray(v)) { if (v.length) parts.push(`${k}: ${v.map(i => typeof i === 'object' ? (i.name || JSON.stringify(i)) : i).join(', ')}`); }
      else if (typeof v === 'object') parts.push(`${k}: ${JSON.stringify(v)}`);
      else parts.push(`${k}: ${v}`);
    }
    if (obj.note) parts.push(`Note: ${obj.note}`);
    return parts.join('. ');
  };
  if (state.importedData.diagnoses) contextSections.push({ title: 'Medical Conditions', text: fmtCtx(state.importedData.diagnoses) });
  if (state.importedData.diet) contextSections.push({ title: 'Diet', text: fmtCtx(state.importedData.diet) });
  if (state.importedData.exercise) contextSections.push({ title: 'Exercise & Movement', text: fmtCtx(state.importedData.exercise) });
  if (state.importedData.sleepRest) contextSections.push({ title: 'Sleep & Rest', text: fmtCtx(state.importedData.sleepRest) });
  if (state.importedData.lightCircadian) contextSections.push({ title: 'Light & Circadian', text: fmtCtx(state.importedData.lightCircadian) });
  if (state.importedData.stress) contextSections.push({ title: 'Stress', text: fmtCtx(state.importedData.stress) });
  if (state.importedData.loveLife) contextSections.push({ title: 'Love Life & Relationships', text: fmtCtx(state.importedData.loveLife) });
  if (state.importedData.environment) contextSections.push({ title: 'Environment', text: fmtCtx(state.importedData.environment) });
  if (state.importedData.interpretiveLens) contextSections.push({ title: 'Interpretive Lens', text: state.importedData.interpretiveLens });
  const hg = state.importedData.healthGoals || [];
  if (hg.length) {
    const goalsText = hg.map(g => `[${g.severity}] ${g.text}`).join('\n');
    contextSections.push({ title: 'Health Goals', text: goalsText });
  }
  const mc = state.importedData.menstrualCycle;
  if (mc && state.profileSex === 'female') {
    const regLabel = mc.regularity === 'very_irregular' ? 'very irregular' : mc.regularity || 'regular';
    let cycleText = `${mc.cycleLength || 28}-day cycle, ${regLabel}, ${mc.flow || 'moderate'} flow`;
    if (mc.contraceptive) cycleText += `. Contraceptive: ${mc.contraceptive}`;
    if (mc.conditions) cycleText += `. Conditions: ${mc.conditions}`;
    const phases = getBloodDrawPhases(mc, data.dates);
    const phaseDates = Object.entries(phases);
    if (phaseDates.length > 0) {
      cycleText += '\n\nBlood draw phases:\n' + phaseDates.map(([d, p]) => `${d}: Day ${p.cycleDay} (${p.phaseName})`).join('\n');
    }
    contextSections.push({ title: 'Menstrual Cycle', text: cycleText });
  }

  const html = buildReportHTML(profileName, sexLabel, data, flags, notes, supps, contextSections);
  const win = window.open('', '_blank');
  if (!win) { showNotification('Pop-up blocked — please allow pop-ups for this site', 'error'); return; }
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
}

export function buildReportHTML(profileName, sexLabel, data, flags, notes, supps, contextSections) {
  const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dateRange = data.dateLabels.length > 0
    ? `${data.dateLabels[0]} \u2013 ${data.dateLabels[data.dateLabels.length - 1]}`
    : 'No dates';
  const unitLabel = state.unitSystem === 'US' ? 'US (conventional)' : 'EU (SI)';
  const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  let body = '';

  // Header
  body += `<div class="report-header">
    <h1>Get Based Report</h1>
    <div class="report-meta">
      <span><strong>Profile:</strong> ${esc(profileName)}</span>
      <span><strong>Sex:</strong> ${sexLabel}</span>
      <span><strong>Units:</strong> ${unitLabel}</span>
      <span><strong>Date range:</strong> ${dateRange}</span>
      <span><strong>Generated:</strong> ${now}</span>
    </div>
  </div>`;

  // Flagged Results
  if (flags.length > 0) {
    body += `<h2>Flagged Results</h2><table><thead><tr><th>Biomarker</th><th>Value</th><th>Range</th><th>Status</th></tr></thead><tbody>`;
    for (const f of flags) {
      const cls = f.status === 'high' ? 'val-high' : 'val-low';
      const label = f.status === 'high' ? 'HIGH' : 'LOW';
      body += `<tr><td>${esc(f.name)}</td><td class="${cls}">${f.value} ${esc(f.unit)}</td>
        <td>${formatValue(f.effectiveMin)} \u2013 ${formatValue(f.effectiveMax)}</td><td class="${cls}">${label}</td></tr>`;
    }
    body += `</tbody></table>`;
  }

  // Category tables
  for (const [catKey, cat] of Object.entries(data.categories)) {
    const markersWithData = Object.entries(cat.markers).filter(([_, m]) => m.values && m.values.some(v => v !== null));
    if (markersWithData.length === 0) continue;
    const labels = cat.singleDate ? [cat.singleDateLabel || 'N/A'] : data.dateLabels;
    body += `<h2>${cat.icon} ${esc(cat.label)}</h2><table><thead><tr><th>Biomarker</th><th>Unit</th><th>Reference</th>`;
    if (cat.singleDate) {
      body += `<th>${labels[0]}</th>`;
    } else {
      for (const l of labels) body += `<th>${l}</th>`;
    }
    body += `<th>Trend</th></tr></thead><tbody>`;
    for (const [mKey, marker] of markersWithData) {
      const trend = getTrend(marker.values);
      const r = getEffectiveRange(marker);
      let rangeStr = r.min != null && r.max != null ? `${formatValue(r.min)} \u2013 ${formatValue(r.max)}` : '\u2014';
      if (state.rangeMode === 'both' && marker.optimalMin != null) {
        rangeStr = `${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}<br><span class="optimal">opt: ${formatValue(marker.optimalMin)} \u2013 ${formatValue(marker.optimalMax)}</span>`;
      }
      body += `<tr><td>${esc(marker.name)}</td><td class="muted">${esc(marker.unit)}</td><td class="muted">${rangeStr}</td>`;
      for (let i = 0; i < marker.values.length; i++) {
        const v = marker.values[i];
        const s = v !== null ? getStatus(v, r.min, r.max) : 'missing';
        const sPrefix = s === 'high' ? '\u25B2 ' : s === 'low' ? '\u25BC ' : '';
        body += `<td class="val-${s}">${v !== null ? sPrefix + formatValue(v) : '\u2014'}</td>`;
      }
      body += `<td>${trend.arrow}</td></tr>`;
    }
    body += `</tbody></table>`;
  }

  // Supplements
  if (supps.length > 0) {
    body += `<h2>Supplements & Medications</h2><table><thead><tr><th>Name</th><th>Dosage</th><th>Type</th><th>Period</th></tr></thead><tbody>`;
    for (const s of supps) {
      body += `<tr><td>${esc(s.name)}</td><td>${esc(s.dosage || '\u2014')}</td><td>${s.type}</td>
        <td>${fmtDate(s.startDate)} \u2192 ${s.endDate ? fmtDate(s.endDate) : 'ongoing'}</td></tr>`;
    }
    body += `</tbody></table>`;
  }

  // Notes
  if (notes.length > 0) {
    body += `<h2>Notes</h2>`;
    for (const n of notes) {
      body += `<div class="note-item"><strong>${fmtDate(n.date)}</strong>: ${esc(n.text)}</div>`;
    }
  }

  // Context sections
  if (contextSections.length > 0) {
    body += `<h2>Profile Context</h2>`;
    for (const s of contextSections) {
      body += `<div class="context-item"><strong>${esc(s.title)}:</strong> ${esc(s.text)}</div>`;
    }
  }

  // Summary for Healthcare Provider
  body += `<h2>Summary for Healthcare Provider</h2>`;
  body += `<p style="font-size:13px;color:#555;margin-bottom:12px">Generated from <strong>${data.dates.length}</strong> collection date${data.dates.length !== 1 ? 's' : ''}${data.dateLabels.length >= 2 ? ` spanning ${data.dateLabels[0]} \u2013 ${data.dateLabels[data.dateLabels.length - 1]}` : ''}.</p>`;

  if (flags.length > 0) {
    body += `<p style="font-size:14px;font-weight:700;margin:12px 0 6px">Out of Range (${flags.length}):</p><ul style="font-size:13px;margin:0 0 12px 20px">`;
    for (const f of flags) {
      const boundary = f.status === 'high' ? f.effectiveMax : f.effectiveMin;
      const diff = f.status === 'high' ? f.rawValue - boundary : boundary - f.rawValue;
      const pctBeyond = boundary !== 0 ? ((diff / boundary) * 100).toFixed(0) : '?';
      body += `<li><strong>${esc(f.name)}</strong>: ${f.value} ${esc(f.unit)} \u2014 <span class="val-${f.status}">${f.status.toUpperCase()}</span> (${pctBeyond}% beyond ${f.status === 'high' ? 'upper' : 'lower'} limit; ref: ${formatValue(f.refMin)}\u2013${formatValue(f.refMax)}${f.optimalMin != null ? ', optimal: ' + formatValue(f.optimalMin) + '\u2013' + formatValue(f.optimalMax) : ''})</li>`;
    }
    body += `</ul>`;
  } else {
    body += `<p style="font-size:13px;color:#059669;margin-bottom:12px"><strong>No out-of-range results.</strong></p>`;
  }

  // Notable trends (>10% change between first and last value)
  const trendItems = [];
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      const nonNull = marker.values.map((v,i) => ({v,i})).filter(x => x.v !== null);
      if (nonNull.length < 2) continue;
      const first = nonNull[0], last = nonNull[nonNull.length - 1];
      if (first.v === 0) continue;
      const pctChange = ((last.v - first.v) / first.v) * 100;
      if (Math.abs(pctChange) > 10) {
        const dir = pctChange > 0 ? 'increased' : 'decreased';
        const firstDate = data.dateLabels[first.i] || '';
        const lastDate = data.dateLabels[last.i] || '';
        trendItems.push(`<li><strong>${esc(marker.name)}</strong> ${dir} ${Math.abs(pctChange).toFixed(0)}% (${formatValue(first.v)} \u2192 ${formatValue(last.v)} ${esc(marker.unit)}, ${firstDate} to ${lastDate})</li>`);
      }
    }
  }
  if (trendItems.length > 0) {
    body += `<p style="font-size:14px;font-weight:700;margin:12px 0 6px">Notable Trends (&gt;10% change):</p><ul style="font-size:13px;margin:0 0 12px 20px">${trendItems.join('')}</ul>`;
  }

  // Summary counts
  let totalWithData = 0, totalInRange = 0;
  for (const cat of Object.values(data.categories)) {
    for (const m of Object.values(cat.markers)) {
      const li = getLatestValueIndex(m.values);
      if (li !== -1) {
        totalWithData++;
        const r = getEffectiveRange(m);
        if (getStatus(m.values[li], r.min, r.max) === 'normal') totalInRange++;
      }
    }
  }
  body += `<p style="font-size:13px;margin-bottom:8px"><strong>Within ${state.rangeMode === 'reference' ? 'Reference' : 'Optimal'} Range:</strong> ${totalInRange} of ${totalWithData} markers with data</p>`;

  if (supps.length > 0) {
    const suppList = supps.map(s => `${esc(s.name)}${s.dosage ? ' (' + esc(s.dosage) + ')' : ''}`).join(', ');
    body += `<p style="font-size:13px;margin-bottom:8px"><strong>Supplements/Medications:</strong> ${suppList}</p>`;
  }

  body += `<p style="font-size:11px;color:#888;font-style:italic;margin-top:12px">This summary was auto-generated by Get Based. Values should be interpreted in clinical context.</p>`;

  // Footer
  body += `<div class="report-footer">
    <p>Generated by Get Based &middot; ${now}</p>
    <p class="disclaimer">This report is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for interpretation of lab results.</p>
  </div>`;

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Get Based Report - ${esc(profileName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; line-height: 1.5; padding: 32px; max-width: 1000px; margin: 0 auto; }
  .report-header { border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 24px; }
  .report-header h1 { font-size: 28px; font-weight: 700; }
  .report-meta { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #555; margin-top: 8px; }
  h2 { font-size: 18px; font-weight: 700; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #ddd; page-break-after: avoid; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
  th { background: #f5f5f5; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #ddd; }
  td { padding: 6px 10px; border-bottom: 1px solid #eee; font-variant-numeric: tabular-nums; }
  .val-normal { color: #059669; font-weight: 600; }
  .val-high { color: #dc2626; font-weight: 600; }
  .val-low { color: #d97706; font-weight: 600; }
  .val-missing { color: #999; }
  .muted { color: #777; font-size: 11px; }
  .optimal { color: #059669; font-size: 10px; }
  .note-item { padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
  .context-item { padding: 6px 0; font-size: 13px; white-space: pre-line; }
  .report-footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #888; }
  .disclaimer { margin-top: 8px; font-style: italic; }
  @media print {
    body { padding: 16px; }
    h2 { page-break-after: avoid; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
    .report-footer { position: fixed; bottom: 0; width: 100%; }
  }
</style></head><body>${body}</body></html>`;
}

// ═══════════════════════════════════════════════
// JSON EXPORT / IMPORT
// ═══════════════════════════════════════════════
export function exportDataJSON() {
  const entries = (state.importedData && state.importedData.entries) ? state.importedData.entries : [];
  const notes = (state.importedData && state.importedData.notes) ? state.importedData.notes : [];
  if (entries.length === 0 && notes.length === 0) { showNotification("No data to export", "error"); return; }
  const diagnoses = state.importedData.diagnoses || null;
  const diet = state.importedData.diet || null;
  const exercise = state.importedData.exercise || null;
  const sleepRest = state.importedData.sleepRest || null;
  const lightCircadian = state.importedData.lightCircadian || null;
  const stress = state.importedData.stress || null;
  const loveLife = state.importedData.loveLife || null;
  const environment = state.importedData.environment || null;
  const interpretiveLens = state.importedData.interpretiveLens || '';
  const contextNotes = state.importedData.contextNotes || '';
  const customMarkers = state.importedData.customMarkers || {};
  const supplements = state.importedData.supplements || [];
  const healthGoals = state.importedData.healthGoals || [];
  const menstrualCycle = state.importedData.menstrualCycle || null;
  const exportObj = { version: 2, exportedAt: new Date().toISOString(), entries, notes, supplements, diagnoses, diet, exercise, sleepRest, lightCircadian, stress, loveLife, environment, interpretiveLens, contextNotes, healthGoals, customMarkers, menstrualCycle };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const profiles = getProfiles();
  const profileName = (profiles.find(p => p.id === state.currentProfile) || { name: 'export' }).name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.download = `getbased-${profileName}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification('Data exported successfully', 'success');
}

export function importDataJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      if (!json.entries || !Array.isArray(json.entries)) {
        showNotification('Invalid JSON format: missing entries array', 'error');
        return;
      }
      let count = 0;
      for (const entry of json.entries) {
        if (!entry.date || !entry.markers) continue;
        if (!state.importedData.entries) state.importedData.entries = [];
        state.importedData.entries = state.importedData.entries.filter(ex => ex.date !== entry.date);
        state.importedData.entries.push(entry);
        count++;
      }
      if (count === 0 && (!json.notes || json.notes.length === 0)) { showNotification('No valid entries found in JSON', 'error'); return; }
      // Import context fields — handle both old string format (v1) and new object format (v2)
      function importContextField(field) {
        const val = json[field];
        if (!val) return;
        if (typeof val === 'object' && val !== null) {
          // v2 structured format — use directly
          state.importedData[field] = val;
        } else if (typeof val === 'string' && val.trim()) {
          // v1 legacy string — migrate to structured with note
          const migrations = {
            diagnoses: { conditions: [], note: val.trim() },
            diet: { type: null, restrictions: [], pattern: null, note: val.trim() },
            exercise: { frequency: null, types: [], intensity: null, dailyMovement: null, note: val.trim() },
            sleepRest: { duration: null, quality: null, schedule: null, issues: [], note: val.trim() }
          };
          if (migrations[field]) state.importedData[field] = migrations[field];
        }
      }
      importContextField('diagnoses');
      importContextField('diet');
      importContextField('exercise');
      // Import sleep & light/circadian (handle old sleepCircadian, old separate fields, or new split fields)
      if (json.sleepRest) {
        importContextField('sleepRest');
      } else if (json.sleepCircadian) {
        // Migrate old sleepCircadian → sleepRest
        const sc = json.sleepCircadian;
        if (typeof sc === 'object' && sc !== null) {
          const sleepIssues = (sc.issues || []).filter(i => !['blue light blockers', 'morning sunlight'].includes(i));
          const circPractices = (sc.issues || []).filter(i => ['blue light blockers', 'morning sunlight'].includes(i));
          state.importedData.sleepRest = { duration: sc.duration || null, quality: sc.quality || null, schedule: sc.schedule || null, issues: sleepIssues, note: sc.note || '' };
          if (circPractices.length && !state.importedData.lightCircadian) {
            state.importedData.lightCircadian = { practices: circPractices, timing: null, mealTiming: [], note: '' };
          }
        } else if (typeof sc === 'string' && sc.trim()) {
          state.importedData.sleepRest = { duration: null, quality: null, schedule: null, issues: [], note: sc.trim() };
        }
      } else {
        const parts = [json.circadian, json.sleep].filter(s => typeof s === 'string' && s.trim());
        if (parts.length) state.importedData.sleepRest = { duration: null, quality: null, schedule: null, issues: [], note: parts.map(s => s.trim()).join('\n\n') };
      }
      if (json.lightCircadian && typeof json.lightCircadian === 'object') state.importedData.lightCircadian = json.lightCircadian;
      // Import new context fields (v2 only)
      if (json.stress && typeof json.stress === 'object') state.importedData.stress = json.stress;
      if (json.loveLife && typeof json.loveLife === 'object') state.importedData.loveLife = json.loveLife;
      if (json.environment && typeof json.environment === 'object') state.importedData.environment = json.environment;
      if (json.contextNotes && typeof json.contextNotes === 'string') state.importedData.contextNotes = json.contextNotes;
      // Import interpretive lens (new merged field, or migrate old separate fields)
      if (json.interpretiveLens && typeof json.interpretiveLens === 'string' && json.interpretiveLens.trim()) {
        state.importedData.interpretiveLens = json.interpretiveLens.trim();
      } else {
        const parts = [json.fieldExperts, json.fieldLens].filter(s => typeof s === 'string' && s.trim());
        if (parts.length) state.importedData.interpretiveLens = parts.map(s => s.trim()).join('\n\n');
      }
      // Import health goals (merge, deduplicate by text)
      if (json.healthGoals && Array.isArray(json.healthGoals)) {
        if (!state.importedData.healthGoals) state.importedData.healthGoals = [];
        for (const g of json.healthGoals) {
          if (!g.text || !g.severity) continue;
          const exists = state.importedData.healthGoals.some(x => x.text === g.text);
          if (!exists) state.importedData.healthGoals.push({ text: g.text, severity: g.severity });
        }
      }
      // Import custom markers (merge, don't overwrite existing definitions)
      if (json.customMarkers && typeof json.customMarkers === 'object') {
        if (!state.importedData.customMarkers) state.importedData.customMarkers = {};
        for (const [key, def] of Object.entries(json.customMarkers)) {
          if (!state.importedData.customMarkers[key]) {
            state.importedData.customMarkers[key] = def;
          }
        }
      }
      // Import menstrual cycle
      if (json.menstrualCycle && typeof json.menstrualCycle === 'object') {
        if (!state.importedData.menstrualCycle) {
          state.importedData.menstrualCycle = json.menstrualCycle;
        } else {
          // Merge: overwrite profile fields, merge periods by startDate
          const mc = state.importedData.menstrualCycle;
          mc.cycleLength = json.menstrualCycle.cycleLength || mc.cycleLength;
          mc.periodLength = json.menstrualCycle.periodLength || mc.periodLength;
          mc.regularity = json.menstrualCycle.regularity || mc.regularity;
          mc.flow = json.menstrualCycle.flow || mc.flow;
          if (json.menstrualCycle.contraceptive) mc.contraceptive = json.menstrualCycle.contraceptive;
          if (json.menstrualCycle.conditions) mc.conditions = json.menstrualCycle.conditions;
          if (json.menstrualCycle.periods && Array.isArray(json.menstrualCycle.periods)) {
            if (!mc.periods) mc.periods = [];
            for (const p of json.menstrualCycle.periods) {
              if (!p.startDate) continue;
              const exists = mc.periods.some(x => x.startDate === p.startDate);
              if (!exists) mc.periods.push(p);
            }
          }
        }
      }
      // Import supplements
      if (json.supplements && Array.isArray(json.supplements)) {
        if (!state.importedData.supplements) state.importedData.supplements = [];
        for (const s of json.supplements) {
          if (!s.name || !s.startDate) continue;
          const exists = state.importedData.supplements.some(x => x.name === s.name && x.startDate === s.startDate);
          if (!exists) state.importedData.supplements.push({ name: s.name, dosage: s.dosage || '', startDate: s.startDate, endDate: s.endDate || null, type: s.type || 'supplement' });
        }
      }
      // Import notes
      if (json.notes && Array.isArray(json.notes)) {
        if (!state.importedData.notes) state.importedData.notes = [];
        for (const note of json.notes) {
          if (!note.date || !note.text) continue;
          // Avoid duplicates (same date + same text)
          const exists = state.importedData.notes.some(n => n.date === note.date && n.text === note.text);
          if (!exists) state.importedData.notes.push({ date: note.date, text: note.text });
        }
      }
      saveImportedData();
      window.buildSidebar();
      window.updateHeaderDates();
      window.navigate('dashboard');
      showNotification(`Imported ${count} date entr${count === 1 ? 'y' : 'ies'} from JSON`, 'success');
    } catch (err) {
      showNotification('Error parsing JSON: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

export function clearAllData() {
  showConfirmDialog('Are you sure you want to clear all imported data? This cannot be undone.', () => {
    state.importedData = { entries: [], notes: [], supplements: [], healthGoals: [], diagnoses: null, diet: null, exercise: null, sleepRest: null, lightCircadian: null, stress: null, loveLife: null, environment: null, interpretiveLens: '', contextNotes: '', customMarkers: {}, menstrualCycle: null };
    localStorage.removeItem(profileStorageKey(state.currentProfile, 'contextHealth'));
    localStorage.removeItem(`labcharts-${state.currentProfile}-focusCard`);
    localStorage.removeItem(profileStorageKey(state.currentProfile, 'imported'));
    window.buildSidebar();
    window.updateHeaderDates();
    window.navigate('dashboard');
    showNotification('All data cleared', 'info');
  });
}

export async function loadDemoData(sex = 'male') {
  try {
    const file = sex === 'female' ? 'data/demo-female.json' : 'data/demo-male.json';
    const resp = await fetch(file);
    if (!resp.ok) throw new Error('Failed to load');
    const blob = await resp.blob();
    const { setProfileSex, setProfileDob } = await import('./profile.js');
    const dob = sex === 'female' ? '1991-08-15' : '1987-11-22';
    state.profileSex = sex;
    setProfileSex(state.currentProfile, sex);
    state.profileDob = dob;
    setProfileDob(state.currentProfile, dob);
    localStorage.setItem(profileStorageKey(state.currentProfile, 'onboarded'), 'profile-set');
    importDataJSON(new File([blob], file, { type: 'application/json' }));
  } catch (err) {
    showNotification('Could not load demo data: ' + err.message, 'error');
  }
}

Object.assign(window, { exportPDFReport, exportDataJSON, importDataJSON, clearAllData, loadDemoData });
