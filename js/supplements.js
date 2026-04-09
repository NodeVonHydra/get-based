// supplements.js — Supplement/medication editor and dashboard section

import { state } from './state.js';
import { escapeHTML, showNotification, hashString } from './utils.js';
import { saveImportedData, getActiveData } from './data.js';
import { callClaudeAPI, hasAIProvider } from './api.js';
import { profileStorageKey } from './profile.js';
import { scanSupplementsForWarnings, humanizeEffect } from './supplement-warnings.js';

export function renderSupplementsSection() {
  const supps = state.importedData.supplements || [];
  let html = `<div class="supp-timeline-section">
    <div class="supp-timeline-header">
      <span class="context-section-title">Supplements & Medications</span>
      <button class="supp-add-btn" onclick="openSupplementsEditor()">+ Add</button>
    </div>`;
  if (supps.length > 0) {
    const today = new Date().toISOString().slice(0, 10);
    let allDates = [];
    for (const s of supps) {
      allDates.push(s.startDate);
      allDates.push(s.endDate || today);
    }
    if (state.importedData.entries) {
      for (const e of state.importedData.entries) allDates.push(e.date);
    }
    allDates.sort();
    const minDate = allDates[0];
    const maxDate = allDates[allDates.length - 1];
    const minT = new Date(minDate + 'T00:00:00').getTime();
    const maxT = new Date(maxDate + 'T00:00:00').getTime();
    const range = maxT - minT || 1;
    const fmtAxis = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const midDate = new Date((minT + maxT) / 2).toISOString().slice(0, 10);
    html += `<div class="supp-timeline">
      <div class="supp-timeline-axis">
        <span>${fmtAxis(minDate)}</span><span>${fmtAxis(midDate)}</span><span>${fmtAxis(maxDate)}</span>
      </div>`;
    for (let i = 0; i < supps.length; i++) {
      const s = supps[i];
      const isMed = s.type === 'medication';
      const sT = new Date(s.startDate + 'T00:00:00').getTime();
      const eT = new Date((s.endDate || today) + 'T00:00:00').getTime();
      const leftPct = ((sT - minT) / range * 100).toFixed(2);
      const widthPct = (((eT - sT) / range) * 100).toFixed(2);
      const ongoingCls = !s.endDate ? ' supp-bar-ongoing' : '';
      const typeCls = isMed ? 'supp-bar-medication' : 'supp-bar-supplement';
      html += `<div class="supp-bar-row" onclick="openSupplementsEditor(${i})">
        <span class="supp-bar-label">${escapeHTML(s.name)}${s.dosage ? `<span class="supp-bar-dosage"> ${escapeHTML(s.dosage)}</span>` : ''}</span>
        <div class="supp-bar-track"><div class="supp-bar ${typeCls}${ongoingCls}" style="left:${leftPct}%;width:${Math.max(parseFloat(widthPct), 0.5)}%"></div></div>
      </div>`;
    }
    html += `</div>`;
    // Mitochondrial harm warnings (only flags harmful effects, not protective)
    const mitoWarnings = scanSupplementsForWarnings(supps);
    if (mitoWarnings.length > 0) {
      html += `<div class="supp-mitotox">`;
      html += `<div class="supp-mitotox-header">Mitochondrial effects \u2014 <span class="supp-mitotox-ask" onclick="askAIMitoContext()">ask AI for context</span></div>`;
      for (const w of mitoWarnings) {
        const top = w.effects.slice(0, 2).map(e => humanizeEffect(e, { showContext: true })).join(' and ');
        html += `<div class="supp-mitotox-item">\u26A0\uFE0F <strong>${escapeHTML(w.match)}</strong>: ${escapeHTML(top)} <a href="${w.url}" target="_blank" rel="noopener" class="supp-mitotox-link">primary study</a> <a href="${w.searchUrl}" target="_blank" rel="noopener" class="supp-mitotox-link">more studies</a></div>`;
      }
      html += `</div>`;
    }
  } else {
    html += `<div class="supp-timeline"><div class="supp-empty">No supplements or medications tracked yet</div></div>`;
  }
  html += `</div>`;
  return html;
}

export function openSupplementsEditor(editIdx) {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const supps = state.importedData.supplements || [];
  const editing = typeof editIdx === 'number' && supps[editIdx];
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Supplements & Medications</h3>
    <div class="modal-unit">Track what you're taking and when. This helps the AI correlate interventions with biomarker changes.</div>`;
  if (supps.length > 0) {
    html += `<div class="supp-list">`;
    for (let i = 0; i < supps.length; i++) {
      const s = supps[i];
      const isMed = s.type === 'medication';
      const icon = isMed ? '\uD83D\uDC8A' : '\uD83D\uDCA7';
      const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const dateRange = `${fmtDate(s.startDate)} \u2192 ${s.endDate ? fmtDate(s.endDate) : 'ongoing'}`;
      html += `<div class="supp-list-item${editing && editIdx === i ? ' style="border-color:var(--accent)"' : ''}">
        <span class="supp-list-icon">${icon}</span>
        <div class="supp-list-info">
          <div class="supp-list-name">${escapeHTML(s.name)}${s.dosage ? ` <span class="supp-list-meta">${escapeHTML(s.dosage)}</span>` : ''}</div>
          <div class="supp-list-meta">${dateRange}</div>
          ${s.note ? `<div class="supp-list-note">${escapeHTML(s.note)}</div>` : ''}
        </div>
        <div class="supp-list-actions">
          <button onclick="openSupplementsEditor(${i})">Edit</button>
          <button class="delete" onclick="deleteSupplement(${i})">\u2715</button>
        </div>
      </div>`;
    }
    html += `</div>`;
  }
  if (editing) html += renderSupplementImpact(editing, editIdx);
  html += `<div class="supp-form">
    <div class="supp-form-title">${editing ? 'Edit' : 'Add New'}</div>
    <div class="supp-form-row">
      <div class="supp-form-field"><label>Name</label>
        <input type="text" id="supp-name" placeholder="e.g. Creatine, Metformin" value="${editing ? escapeHTML(editing.name) : ''}">
      </div>
      <div class="supp-form-field"><label>Dosage</label>
        <input type="text" id="supp-dosage" placeholder="e.g. 5g/day, 500mg 2x/day" value="${editing ? escapeHTML(editing.dosage || '') : ''}">
      </div>
    </div>
    <div class="supp-form-row">
      <div class="supp-form-field"><label>Type</label>
        <select id="supp-type">
          <option value="supplement"${editing && editing.type === 'medication' ? '' : ' selected'}>Supplement</option>
          <option value="medication"${editing && editing.type === 'medication' ? ' selected' : ''}>Medication</option>
        </select>
      </div>
      <div class="supp-form-field"><label>Start Date</label>
        <input type="date" id="supp-start" value="${editing ? editing.startDate : new Date().toISOString().slice(0, 10)}">
      </div>
      <div class="supp-form-field"><label>End Date (blank = ongoing)</label>
        <input type="date" id="supp-end" value="${editing && editing.endDate ? editing.endDate : ''}">
      </div>
    </div>
    <div class="supp-form-row">
      <div class="supp-form-field" style="flex:1"><label>Note / Reason</label>
        <input type="text" id="supp-note" placeholder="e.g. For low vitamin D, recommended by Dr. Smith" value="${editing ? escapeHTML(editing.note || '') : ''}">
      </div>
    </div>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveSupplement(${editing ? editIdx : -1})">${editing ? 'Update' : 'Add'}</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
    </div>
  </div>`;
  modal.innerHTML = html;
  overlay.classList.add("show");
  setTimeout(() => {
    const nameInput = document.getElementById('supp-name');
    if (nameInput) nameInput.focus();
  }, 50);
}

export function saveSupplement(idx) {
  const name = document.getElementById('supp-name').value.trim();
  const dosage = document.getElementById('supp-dosage').value.trim();
  const type = document.getElementById('supp-type').value;
  const startDate = document.getElementById('supp-start').value;
  const endDate = document.getElementById('supp-end').value || null;
  if (!name) { showNotification('Name is required', 'error'); return; }
  if (!startDate) { showNotification('Start date is required', 'error'); return; }
  if (endDate && endDate < startDate) { showNotification('End date must be after start date', 'error'); return; }
  const note = document.getElementById('supp-note').value.trim();
  if (!state.importedData.supplements) state.importedData.supplements = [];
  const entry = { name, dosage, startDate, endDate, type, note };
  if (idx >= 0) {
    state.importedData.supplements[idx] = entry;
  } else {
    state.importedData.supplements.push(entry);
  }
  saveImportedData();
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(idx >= 0 ? 'Supplement updated' : 'Supplement added', 'success');
}

export function deleteSupplement(idx) {
  if (!state.importedData.supplements || !state.importedData.supplements[idx]) return;
  const name = state.importedData.supplements[idx].name;
  state.importedData.supplements.splice(idx, 1);
  saveImportedData();
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`"${name}" removed`, 'info');
}

function askAIMitoContext() {
  document.querySelector('[aria-label="Ask AI"]')?.click();
  setTimeout(() => {
    const ta = document.querySelector('textarea.chat-input');
    if (ta) {
      ta.value = 'Explain the mitochondrial effects of my current supplements and medications. Which ones should I be concerned about and why?';
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      ta.focus();
    }
  }, 500);
}

// ═══════════════════════════════════════════════
// Supplement-Biomarker Impact Analysis
// ═══════════════════════════════════════════════

export function computeSupplementImpact(supplement, markerKey, markerName, unit, values, dates, refMin, refMax) {
  if (!values || !dates || values.length !== dates.length) return null;
  const start = supplement.startDate;
  const end = supplement.endDate;
  const beforeValues = [], afterValues = [];
  for (let i = 0; i < dates.length; i++) {
    if (values[i] === null) continue;
    if (dates[i] < start) {
      beforeValues.push(values[i]);
    } else if (!end || dates[i] <= end) {
      afterValues.push(values[i]);
    }
  }
  if (beforeValues.length === 0 && afterValues.length === 0) return null;
  const mean = arr => arr.reduce((s, v) => s + v, 0) / arr.length;
  const beforeMean = beforeValues.length > 0 ? mean(beforeValues) : null;
  const afterMean = afterValues.length > 0 ? mean(afterValues) : null;
  let pctChange = null, direction = 'stable';
  if (beforeMean !== null && afterMean !== null && beforeMean !== 0) {
    pctChange = ((afterMean - beforeMean) / Math.abs(beforeMean)) * 100;
    direction = Math.abs(pctChange) < 1 ? 'stable' : pctChange > 0 ? 'up' : 'down';
  }
  let confidence = 'low';
  if (beforeValues.length >= 3 && afterValues.length >= 3) confidence = 'high';
  else if (beforeValues.length >= 2 && afterValues.length >= 2) confidence = 'moderate';
  return {
    marker: markerKey, markerName, unit,
    beforeMean, afterMean, pctChange, direction, confidence,
    nBefore: beforeValues.length, nAfter: afterValues.length,
    refMin, refMax
  };
}

export function computeAllImpacts(supplement, data) {
  if (!data || !data.categories || !data.dates) return [];
  const results = [];
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      const dotKey = catKey + '.' + mKey;
      const impact = computeSupplementImpact(
        supplement, dotKey, marker.name, marker.unit,
        marker.values, data.dates, marker.refMin, marker.refMax
      );
      if (impact && impact.pctChange !== null && Math.abs(impact.pctChange) >= 1) {
        results.push(impact);
      }
    }
  }
  results.sort((a, b) => Math.abs(b.pctChange) - Math.abs(a.pctChange));
  return results;
}

function getOverlappingSupplements(supplement, supps) {
  const start = supplement.startDate;
  const end = supplement.endDate || '9999-12-31';
  return supps.filter(s => s !== supplement && s.startDate <= end && (s.endDate || '9999-12-31') >= start);
}

// Build a compact data summary for the AI prompt
// Fingerprint all supplements + lab data together — one cache entry for the whole batch
function getBatchFingerprint(supps, data) {
  const labPart = (data.dates || []).join(',');
  const suppPart = supps.map(s => `${s.name}|${s.startDate}|${s.endDate || ''}`).join(';');
  return hashString(labPart + '||' + suppPart);
}

function getImpactCache() {
  try {
    const key = profileStorageKey(state.currentProfile, 'suppImpact');
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function setImpactCache(cache) {
  try {
    const key = profileStorageKey(state.currentProfile, 'suppImpact');
    localStorage.setItem(key, JSON.stringify(cache));
  } catch { /* quota exceeded */ }
}

// In-flight promise to prevent duplicate batch calls
let _batchPromise = null;

export function renderSupplementImpact(supplement, editIdx) {
  const hasAI = hasAIProvider();
  const data = getActiveData();
  if (!data || !data.dates || data.dates.length < 2) return '';
  const impacts = computeAllImpacts(supplement, data);
  if (impacts.length === 0) return '';

  const supps = state.importedData.supplements || [];
  const fp = getBatchFingerprint(supps, data);
  const cache = getImpactCache();
  const batch = cache[fp]; // { "SupplementName": { dot, summary }, ... }
  const cached = batch?.[supplement.name];

  const dotColor = cached ? `ctx-health-dot-${cached.dot}` : (hasAI ? 'ctx-health-dot-shimmer' : 'ctx-health-dot-gray');
  const summaryClass = cached ? `supp-impact-summary-visible supp-impact-summary-${cached.dot}` : '';
  const summaryText = cached ? escapeHTML(cached.summary) : (hasAI ? '' : 'Set up an AI provider for impact insights');

  let html = `<div class="supp-impact-section">
    <div class="supp-impact-header">
      <span class="ctx-health-dot ${dotColor}" id="supp-impact-dot-${editIdx}"></span>
      <span>Impact Analysis</span>
    </div>
    <div class="supp-impact-summary ${summaryClass}" id="supp-impact-summary-${editIdx}">${summaryText}</div>
  </div>`;

  // If not cached and AI available, fire batch call (one call for ALL supplements)
  if (!cached && hasAI) {
    setTimeout(() => loadBatchImpactAI(supps, data, fp, editIdx), 50);
  }
  return html;
}

async function loadBatchImpactAI(supps, data, fp, currentEditIdx) {
  // Deduplicate: if a batch call is already in flight for this fingerprint, wait for it
  if (_batchPromise) {
    await _batchPromise;
    // After the batch completes, update the current DOM from cache
    const cache = getImpactCache();
    const batch = cache[fp];
    if (batch) applyImpactToDOM(currentEditIdx, batch, supps);
    return;
  }

  // Build prompt with ALL supplements
  const suppEntries = [];
  for (const s of supps) {
    const impacts = computeAllImpacts(s, data);
    if (impacts.length === 0) continue;
    suppEntries.push({ supplement: s, impacts });
  }
  if (suppEntries.length === 0) return;

  const fmtVal = v => v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
  let ctx = `Analyze ${suppEntries.length} supplements:\n`;
  for (const { supplement: s, impacts } of suppEntries) {
    const top = impacts.slice(0, 5);
    const overlapping = getOverlappingSupplements(s, supps);
    ctx += `\n[${s.name}] ${s.dosage || ''} (${s.type}) since ${s.startDate}${s.endDate ? ' until ' + s.endDate : ''}`;
    if (overlapping.length > 0) ctx += ` (also taking: ${overlapping.map(o => o.name).join(', ')})`;
    ctx += `\n`;
    for (const imp of top) {
      ctx += `  ${imp.markerName}: ${fmtVal(imp.beforeMean)}→${fmtVal(imp.afterMean)} ${imp.unit} (${imp.pctChange > 0 ? '+' : ''}${imp.pctChange.toFixed(0)}%)`;
      if (imp.refMin != null || imp.refMax != null) ctx += ` ref ${imp.refMin ?? ''}–${imp.refMax ?? ''}`;
      ctx += `\n`;
    }
  }

  const names = suppEntries.map(e => `"${e.supplement.name}"`).join(', ');
  const system = `Reply with ONLY JSON, no other text. One entry per supplement: {${names.replace(/"/g, '"')}: {"dot":"green|yellow|red|gray","summary":"1-2 sentences"}, ...}
green=beneficial/expected, yellow=mixed, red=concerning, gray=insufficient data. Name markers. Note expected changes.`;

  _batchPromise = (async () => {
    try {
      const result = await callClaudeAPI({ system, messages: [{ role: 'user', content: ctx }], maxTokens: 150 * suppEntries.length + 100 });
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return;
      const parsed = JSON.parse(jsonMatch[0]);

      // Normalize: AI may return nested or flat structure
      const batch = {};
      for (const { supplement: s } of suppEntries) {
        const entry = parsed[s.name];
        if (entry && typeof entry === 'object') {
          batch[s.name] = {
            dot: ['green', 'yellow', 'red', 'gray'].includes(entry.dot) ? entry.dot : 'gray',
            summary: typeof entry.summary === 'string' ? entry.summary : ''
          };
        }
      }

      // Cache the whole batch under one fingerprint
      const cache = getImpactCache();
      cache[fp] = batch;
      // Keep max 5 batch entries (each covers all supps)
      const keys = Object.keys(cache);
      if (keys.length > 5) { for (const k of keys.slice(0, keys.length - 5)) delete cache[k]; }
      setImpactCache(cache);

      // Update DOM for the currently visible supplement
      applyImpactToDOM(currentEditIdx, batch, supps);
    } catch { /* AI unavailable */ }
  })();

  await _batchPromise;
  _batchPromise = null;
}

function applyImpactToDOM(editIdx, batch, supps) {
  const s = supps[editIdx];
  if (!s) return;
  const cached = batch[s.name];
  if (!cached) return;
  const dotEl = document.getElementById(`supp-impact-dot-${editIdx}`);
  if (dotEl) dotEl.className = `ctx-health-dot ctx-health-dot-${cached.dot}`;
  const sumEl = document.getElementById(`supp-impact-summary-${editIdx}`);
  if (sumEl) {
    sumEl.textContent = cached.summary;
    sumEl.className = `supp-impact-summary supp-impact-summary-visible supp-impact-summary-${cached.dot}`;
  }
}

Object.assign(window, { renderSupplementsSection, openSupplementsEditor, saveSupplement, deleteSupplement, askAIMitoContext, computeAllImpacts });
