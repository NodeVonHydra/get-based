// pdf-import.js — PDF parsing pipeline, import preview, drop zone, batch import

import { state } from './state.js';
import { MARKER_SCHEMA, calculateCost, formatCost } from './schema.js';
import { IMPORT_STEPS } from './constants.js';
import { escapeHTML, showNotification, isDebugMode, isPIIReviewEnabled } from './utils.js';
import { saveImportedData, getActiveData, recalculateHOMAIR } from './data.js';
import { callClaudeAPI, hasAIProvider, getAIProvider, getAnthropicModel, getVeniceModel, getOpenRouterModel, /* ROUTSTR DISABLED: getRoutstrModel, */ getOllamaMainModel, getAnthropicModelDisplay, getVeniceModelDisplay, getOpenRouterModelDisplay, /* ROUTSTR DISABLED: getRoutstrModelDisplay, */ getOllamaPIIModel } from './api.js';
import { obfuscatePDFText, sanitizeWithOllama, checkOllamaPII, reviewPIIBeforeSend } from './pii.js';

// ═══════════════════════════════════════════════
// AI-POWERED PDF IMPORT
// ═══════════════════════════════════════════════
export function buildMarkerReference() {
  const ref = {};
  const isFemale = state.profileSex === 'female';
  for (const [catKey, cat] of Object.entries(MARKER_SCHEMA)) {
    if (cat.calculated) continue;
    for (const [markerKey, marker] of Object.entries(cat.markers)) {
      const rMin = isFemale && marker.refMin_f != null ? marker.refMin_f : marker.refMin;
      const rMax = isFemale && marker.refMax_f != null ? marker.refMax_f : marker.refMax;
      ref[`${catKey}.${markerKey}`] = { name: marker.name, unit: marker.unit, refMin: rMin, refMax: rMax };
    }
  }
  // Include custom markers from previous imports
  const custom = (state.importedData && state.importedData.customMarkers) ? state.importedData.customMarkers : {};
  for (const [fullKey, def] of Object.entries(custom)) {
    if (!ref[fullKey]) {
      ref[fullKey] = { name: def.name, unit: def.unit, refMin: def.refMin, refMax: def.refMax };
    }
  }
  return ref;
}

export async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let allItems = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    for (const item of textContent.items) {
      if (item.str.trim()) {
        allItems.push({ text: item.str.trim(), x: Math.round(item.transform[4]), y: Math.round(item.transform[5]), page: i });
      }
    }
  }
  // Page-aware row grouping (same logic as old parser — robust geometric approach)
  const sorted = [...allItems].sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    const dy = b.y - a.y;
    return Math.abs(dy) > 3 ? dy : a.x - b.x;
  });
  if (sorted.length === 0) return '';
  let text = '';
  let currentPage = sorted[0].page;
  text += `=== Page ${currentPage} ===\n`;
  let currentRow = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].page !== currentPage) {
      text += currentRow.sort((a, b) => a.x - b.x).map(r => r.text).join('  ') + '\n';
      currentPage = sorted[i].page;
      text += `\n=== Page ${currentPage} ===\n`;
      currentRow = [sorted[i]];
    } else if (Math.abs(sorted[i].y - currentRow[0].y) < 3) {
      currentRow.push(sorted[i]);
    } else {
      text += currentRow.sort((a, b) => a.x - b.x).map(r => r.text).join('  ') + '\n';
      currentRow = [sorted[i]];
    }
  }
  if (currentRow.length > 0) {
    text += currentRow.sort((a, b) => a.x - b.x).map(r => r.text).join('  ') + '\n';
  }
  return text;
}

export function tryParseJSON(str) {
  try { return JSON.parse(str); } catch {}
  // Try trimming to last complete object (handles truncated output)
  const lastBrace = str.lastIndexOf('}');
  if (lastBrace > 0 && lastBrace < str.length - 1) {
    try { return JSON.parse(str.slice(0, lastBrace + 1)); } catch {}
  }
  // Attempt to repair truncated JSON from local models
  let s = str;
  // Close any unterminated string
  const quotes = (s.match(/"/g) || []).length;
  if (quotes % 2 !== 0) s += '"';
  // Try closing open arrays and objects
  const opens = { '{': 0, '[': 0 };
  let inString = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '"' && (i === 0 || s[i - 1] !== '\\')) { inString = !inString; continue; }
    if (inString) continue;
    if (s[i] === '{') opens['{']++;
    if (s[i] === '}') opens['{']--;
    if (s[i] === '[') opens['[']++;
    if (s[i] === ']') opens['[']--;
  }
  // Remove trailing comma before closing
  s = s.replace(/,\s*$/, '');
  // Close unclosed brackets/braces
  for (let i = 0; i < opens['[']; i++) s += ']';
  for (let i = 0; i < opens['{']; i++) s += '}';
  try {
    const result = JSON.parse(s);
    if (isDebugMode()) console.log('[PDF Parse] Repaired truncated JSON from model');
    return result;
  } catch (e2) {
    throw new Error(`Model returned invalid JSON that could not be repaired. Try a more capable model.`);
  }
}

export async function parseLabPDFWithAI(pdfText, fileName) {
  const markerRef = buildMarkerReference();
  const system = `You are a lab report data extraction assistant. You extract biomarker results from lab report text and map them to a known set of marker keys.

Here is the complete list of known markers with their keys, expected units, and reference ranges:
${JSON.stringify(markerRef)}

Your task:
1. Find the sample collection date in the text. Return it as YYYY-MM-DD. Look for dates near keywords like "collection", "collected", "date", "odběr", "datum", or similar in any language.
2. For each biomarker result found in the text, extract:
   - rawName: the test name exactly as it appears in the PDF
   - value: the numeric result (parse comma as decimal point, strip < > prefixes)
   - mappedKey: the matching key from the known markers list (e.g. "biochemistry.glucose"), or null if no match
3. Match based on medical/biochemical equivalence, not just string similarity. For example:
   - "Glukóza" → "biochemistry.glucose" (Czech for glucose)
   - "Triacylglyceroly" → "lipids.triglycerides"
   - Use the units and reference ranges to help disambiguate
4. Only map to a marker if you're confident it's the correct match
5. Skip non-numeric results (text-only findings, interpretive notes)
6. For differential WBC: only map absolute count values (marked with # or abs.) to the # markers; percentage values go to the Pct markers
7. For markers that do NOT match any known key (mappedKey is null), also return:
   - suggestedKey: a "category.camelCaseKey" string. Use an existing category from the reference if the marker fits (e.g. "biochemistry", "hormones", "vitamins"), otherwise use "custom". The key part should be a concise camelCase identifier. NEVER use a suggestedKey that already exists in the known markers list above.
   - suggestedName: a clean English display name for the marker
   - unit: the unit as shown in the PDF
   - refMin: the lower reference range bound from the PDF (number or null)
   - refMax: the upper reference range bound from the PDF (number or null)

Return ONLY valid JSON in this exact format, no other text:
{
  "date": "YYYY-MM-DD",
  "markers": [
    {"rawName": "Test Name", "value": 5.23, "mappedKey": "category.marker"},
    {"rawName": "Unknown Test", "value": 1.0, "mappedKey": null, "suggestedKey": "biochemistry.someMarker", "suggestedName": "Some Marker", "unit": "mg/l", "refMin": 0.5, "refMax": 3.0}
  ]
}`;

  const provider = getAIProvider();
  const { text: response, usage } = await callClaudeAPI({
    system,
    messages: [{ role: 'user', content: `Extract all biomarker results from this lab report:\n\n${pdfText}` }],
    maxTokens: 8192
  });

  // Parse JSON from response (handle markdown code blocks, truncated output)
  let jsonStr = (response || '').trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
  // Strip any leading text before the JSON object
  const jsonStart = jsonStr.indexOf('{');
  if (jsonStart > 0) jsonStr = jsonStr.slice(jsonStart);
  const parsed = tryParseJSON(jsonStr);

  return {
    date: parsed.date || null,
    markers: (parsed.markers || []).map(m => ({
      rawName: m.rawName,
      value: typeof m.value === 'number' ? m.value : parseFloat(String(m.value).replace(',', '.')),
      mappedKey: m.mappedKey || null,
      matched: !!m.mappedKey,
      suggestedKey: m.suggestedKey || null,
      suggestedName: m.suggestedName || null,
      unit: m.unit || null,
      refMin: m.refMin != null ? m.refMin : null,
      refMax: m.refMax != null ? m.refMax : null
    })).filter(m => !isNaN(m.value)),
    fileName,
    usage,
    provider
  };
}

// ═══════════════════════════════════════════════
// IMPORT PREVIEW & CONFIRM
// ═══════════════════════════════════════════════
export function showImportPreview(parseResult) {
  const { date, markers, fileName } = parseResult;
  const modal = document.getElementById("import-modal");
  const overlay = document.getElementById("import-modal-overlay");
  const dateFormatted = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown';
  const matched = markers.filter(m => m.matched);
  const newMarkers = markers.filter(m => !m.matched && m.suggestedKey);
  const unmatched = markers.filter(m => !m.matched && !m.suggestedKey);
  const importCount = matched.length + newMarkers.length;
  const batchCtx = window._batchImportContext;
  const batchLabel = batchCtx ? `<div class="batch-counter">File ${batchCtx.current} of ${batchCtx.total}</div>` : '';
  let html = `<button class="modal-close" onclick="closeImportModal()">&times;</button>
    ${batchLabel}<h3>Import Preview</h3>
    <p style="color:var(--text-secondary);margin-bottom:16px">
      File: ${fileName}<br>Collection Date: <strong>${dateFormatted}</strong><br>
      Matched: <span style="color:var(--green)">${matched.length}</span> \u00b7
      New: <span style="color:var(--accent)">${newMarkers.length}</span> \u00b7
      Unmatched: <span style="color:var(--yellow)">${unmatched.length}</span></p>`;
  if (!date) {
    html += `<div style="background:var(--yellow-bg);border:1px solid var(--yellow);border-radius:var(--radius-sm);padding:12px;margin-bottom:16px;color:var(--yellow)">
      Could not extract collection date from PDF. Please enter it manually:
      <input type="date" id="import-manual-date" style="margin-left:8px;padding:4px 8px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-family:var(--font-mono)" onchange="applyManualImportDate(this.value)"></div>`;
  }
  html += `<table class="import-table"><thead><tr><th>Status</th><th>Test Name</th><th>Value</th><th>Maps To</th></tr></thead><tbody>`;
  for (const m of matched) {
    html += `<tr><td class="matched">\u2713 Matched</td><td>${m.rawName}</td>
      <td>${m.value}</td><td>${m.mappedKey}</td></tr>`;
  }
  for (const m of newMarkers) {
    const refInfo = (m.refMin != null || m.refMax != null) ? ` (${m.refMin ?? '?'}\u2013${m.refMax ?? '?'} ${m.unit || ''})` : '';
    html += `<tr><td class="new-marker">\u271A New</td><td>${m.rawName}</td>
      <td>${m.value}</td><td>${m.suggestedKey}${refInfo}</td></tr>`;
  }
  for (const m of unmatched) {
    html += `<tr><td class="unmatched">? Unmatched</td><td>${m.rawName}</td>
      <td>${m.value}</td><td>\u2014</td></tr>`;
  }
  html += `</tbody></table>`;

  // Specialty test warning
  const SPECIALTY_PREFIXES = ['oat', 'urineAmino', 'urineAminoMetab', 'toxicElements', 'nutrientElements', 'oxidativeStress'];
  const importHasSpecialty = markers.some(m => {
    const key = (m.mappedKey || m.suggestedKey || '').split('.')[0];
    return SPECIALTY_PREFIXES.some(p => key === p || key.startsWith(p));
  });
  if (importHasSpecialty) {
    const existingHasSpecialty = (state.importedData.entries || []).some(entry =>
      Object.keys(entry.markers || {}).some(k => {
        const cat = k.split('.')[0];
        return SPECIALTY_PREFIXES.some(p => cat === p || cat.startsWith(p));
      })
    );
    if (existingHasSpecialty) {
      html += `<div style="background:var(--yellow-bg);border:1px solid var(--yellow);border-radius:var(--radius-sm);padding:12px;margin-top:12px;color:var(--yellow);font-size:13px;line-height:1.5">\u26A0 You already have specialty test data. Different labs use different reference ranges for the same markers \u2014 status colors may not match your new lab's stated ranges.</div>`;
    } else {
      html += `<div style="background:rgba(79,140,255,0.10);border:1px solid var(--accent);border-radius:var(--radius-sm);padding:12px;margin-top:12px;color:var(--accent);font-size:13px;line-height:1.5">\u2139 Reference ranges for specialty tests vary between laboratories \u2014 the ranges in this app may differ from your lab's stated ranges.</div>`;
    }
  }

  // Privacy notice
  if (parseResult.privacyMethod === 'ollama') {
    html += `<div class="privacy-notice privacy-notice-success">&#128274; Personal information scrubbed by local AI</div>`;
  } else if (parseResult.privacyMethod === 'regex') {
    html += `<div class="privacy-notice privacy-notice-warning">&#128274; ${parseResult.privacyReplacements} personal detail${parseResult.privacyReplacements !== 1 ? 's' : ''} replaced with fake data`;
    html += `<span style="font-size:12px;display:block;margin-top:4px;opacity:0.8">Set up Local AI in Settings for comprehensive language-aware protection</span></div>`;
  }
  // Cost info (always visible)
  if (parseResult.costInfo) {
    const ci = parseResult.costInfo;
    const totalTokens = (ci.inputTokens || 0) + (ci.outputTokens || 0);
    const modelLabel = ci.provider === 'ollama' ? getOllamaMainModel() : ci.provider === 'venice' ? getVeniceModelDisplay() : ci.provider === 'openrouter' ? getOpenRouterModelDisplay() : getAnthropicModelDisplay();
    html += `<div style="font-size:12px;color:var(--text-muted);margin-top:8px">\ud83d\udcca ${escapeHTML(modelLabel)} \u00b7 ${totalTokens.toLocaleString()} tokens \u00b7 ${formatCost(ci.cost)}</div>`;
  }
  // Debug: timings and diff button
  if (isDebugMode()) {
    const t = parseResult.timings;
    if (t) {
      const piiLabel = parseResult.privacyMethod === 'ollama' ? `PII: ${t.pii}s (${getOllamaPIIModel()})` : `PII: regex`;
      const provider = getAIProvider();
      const modelLabel = provider === 'ollama' ? getOllamaMainModel() : provider === 'venice' ? getVeniceModelDisplay() : provider === 'openrouter' ? getOpenRouterModelDisplay() : getAnthropicModelDisplay();
      html += `<div style="font-size:12px;color:var(--text-muted);margin-top:8px;font-family:monospace">&#9202; ${piiLabel} &nbsp;|&nbsp; Analysis: ${t.analysis}s (${modelLabel})</div>`;
    }
    if (parseResult.privacyOriginal && parseResult.privacyObfuscated) {
      html += `<button class="import-btn import-btn-secondary" style="margin-top:8px;font-size:12px" onclick="showPIIDiffViewer(window._pendingImport.privacyOriginal, window._pendingImport.privacyObfuscated)">&#128269; View privacy details</button>`;
    }
  }

  const cancelLabel = batchCtx ? 'Skip' : 'Cancel';
  const importDisabled = !date ? ' disabled style="opacity:0.5;cursor:not-allowed"' : '';
  html += `<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px">
    <button class="import-btn import-btn-secondary" onclick="closeImportModal()">${cancelLabel}</button>
    <button class="import-btn import-btn-primary" id="import-confirm-btn" onclick="confirmImport()"${importDisabled}>Import ${importCount} Markers</button></div>`;
  parseResult._importProfileId = state.currentProfile;
  window._pendingImport = parseResult;
  modal.innerHTML = html;
  overlay.classList.add("show");
}

export function applyManualImportDate(dateStr) {
  if (!window._pendingImport || !dateStr) return;
  window._pendingImport.date = dateStr;
  const btn = document.getElementById('import-confirm-btn');
  if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; }
}

export function closeImportModal() {
  document.getElementById("import-modal-overlay").classList.remove("show");
  window._pendingImport = null;
  if (window._batchImportResolve) {
    const resolve = window._batchImportResolve;
    window._batchImportResolve = null;
    window._batchImportContext = null;
    resolve('skip');
  }
}

export function confirmImport() {
  const result = window._pendingImport;
  if (!result || !result.date) return;
  // Guard: if profile changed during async import, abort to prevent saving to wrong profile
  if (result._importProfileId && result._importProfileId !== state.currentProfile) {
    showNotification('Profile changed during import — import cancelled for safety.', 'error');
    window.closeImportModal();
    return;
  }
  const matched = result.markers.filter(m => m.matched);
  const newMarkers = result.markers.filter(m => !m.matched && m.suggestedKey);
  const importCount = matched.length + newMarkers.length;
  if (importCount === 0) { showNotification("No markers to import", "error"); window.closeImportModal(); return; }
  if (!state.importedData.entries) state.importedData.entries = [];
  let entry = state.importedData.entries.find(e => e.date === result.date);
  if (!entry) {
    entry = { date: result.date, markers: {} };
    state.importedData.entries.push(entry);
  }
  for (const m of matched) entry.markers[m.mappedKey] = m.value;
  // Save new (custom) marker values and definitions
  if (!state.importedData.customMarkers) state.importedData.customMarkers = {};
  for (const m of newMarkers) {
    entry.markers[m.suggestedKey] = m.value;
    // Save definition only if not already defined
    if (!state.importedData.customMarkers[m.suggestedKey]) {
      const [catKey] = m.suggestedKey.split('.');
      // Determine category label: use schema label if category exists, else title-case the key
      const schemaCategory = MARKER_SCHEMA[catKey];
      const categoryLabel = schemaCategory ? schemaCategory.label : catKey.charAt(0).toUpperCase() + catKey.slice(1);
      state.importedData.customMarkers[m.suggestedKey] = {
        name: m.suggestedName || m.rawName,
        unit: m.unit || '',
        refMin: m.refMin,
        refMax: m.refMax,
        categoryLabel
      };
    }
  }
  if (entry.markers["hormones.insulin"] !== undefined) entry.markers["diabetes.insulin_d"] = entry.markers["hormones.insulin"];
  recalculateHOMAIR(entry);
  saveImportedData();
  // Resolve batch promise before closeImportModal (which would resolve with 'skip')
  if (window._batchImportResolve) {
    const resolve = window._batchImportResolve;
    window._batchImportResolve = null;
    window._batchImportContext = null;
    document.getElementById("import-modal-overlay").classList.remove("show");
    window._pendingImport = null;
    resolve('import');
  } else {
    window.closeImportModal();
  }
  window.buildSidebar();
  window.updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Imported ${importCount} markers from ${result.date}`, "success");
}

export function removeImportedEntry(date) {
  if (!state.importedData.entries) return;
  state.importedData.entries = state.importedData.entries.filter(e => e.date !== date);
  saveImportedData();
  window.buildSidebar();
  window.updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Removed imported data from ${date}`, "info");
}

// ═══════════════════════════════════════════════
// DROP ZONE
// ═══════════════════════════════════════════════
export function setupDropZone() {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  dropZone.addEventListener("click", () => { document.getElementById('pdf-input').click(); });
  dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone.addEventListener("dragleave", e => { e.preventDefault(); dropZone.classList.remove("drag-over"); });
  dropZone.addEventListener("drop", async e => {
    e.preventDefault(); dropZone.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const jsonFiles = files.filter(f => f.name.endsWith('.json') || f.type === 'application/json');
    const pdfFiles = files.filter(f => f.name.endsWith('.pdf') || f.type === 'application/pdf');
    const unsupported = files.length - jsonFiles.length - pdfFiles.length;
    if (unsupported > 0 && jsonFiles.length === 0 && pdfFiles.length === 0) {
      showNotification("Unsupported file type. Use PDF or JSON.", "error");
      return;
    }
    for (const f of jsonFiles) window.importDataJSON(f);
    if (pdfFiles.length === 1) await handlePDFFile(pdfFiles[0]);
    else if (pdfFiles.length > 1) await handleBatchPDFs(pdfFiles);
  });
}

export async function showImportProgress(step, fileName) {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  let html = '<div class="import-progress">';
  for (let i = 0; i < IMPORT_STEPS.length; i++) {
    const isDone = i < step;
    const isActive = i === step;
    const cls = isDone ? "done" : isActive ? "active" : "";
    const icon = isDone
      ? '<span class="step-icon">\u2713</span>'
      : isActive
        ? '<span class="step-icon"><span class="progress-spinner"></span></span>'
        : '<span class="step-icon">\u25CB</span>';
    html += `<div class="progress-step ${cls}">${icon}<span>${IMPORT_STEPS[i]}${isActive ? "..." : ""}</span></div>`;
  }
  if (fileName) html += `<div class="import-progress-filename">${fileName}</div>`;
  html += '</div>';
  dropZone.innerHTML = html;
  // Yield to browser so it actually paints the progress before heavy work continues
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
}

export function hideImportProgress() {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  dropZone.innerHTML = `<div class="drop-zone-icon">\uD83D\uDCC4</div>
    <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
    <div class="drop-zone-hint">AI-powered \u2014 works with any lab PDF report or Get Based JSON export</div>`;
}

export async function handlePDFFile(file) {
  if (!hasAIProvider()) {
    showNotification("AI provider not configured. Opening settings...", "info");
    setTimeout(() => window.openSettingsModal(), 500);
    return;
  }
  try {
    await showImportProgress(0, file.name);
    const pdfText = await extractPDFText(file);
    if (!pdfText.trim()) { hideImportProgress(); showNotification("PDF appears empty — no text extracted", "error"); return; }

    // PII obfuscation step
    await showImportProgress(1, file.name);
    let textForAI = pdfText;
    let privacyMethod = null;
    let privacyReplacements = 0;
    let privacyOriginal = null;
    let piiTime = 0;
    const ollama = await checkOllamaPII();
    if (ollama.available) {
      try {
        const piiStart = performance.now();
        textForAI = await sanitizeWithOllama(pdfText);
        piiTime = Math.round((performance.now() - piiStart) / 1000);
        privacyMethod = 'ollama';
        privacyOriginal = pdfText;
        if (isDebugMode()) console.log(`[PII] Obfuscated via Ollama (${piiTime}s)`);
      } catch (e) {
        if (isDebugMode()) console.warn('[PII] Ollama failed, falling back to regex:', e.message);
        try {
          const result = obfuscatePDFText(pdfText);
          textForAI = result.obfuscated;
          privacyReplacements = result.replacements;
          privacyOriginal = result.original;
          privacyMethod = 'regex';
        } catch (e2) {
          hideImportProgress();
          showNotification('Privacy protection failed — PDF not sent to AI. Try again or check Settings.', 'error');
          return;
        }
      }
    } else {
      try {
        const result = obfuscatePDFText(pdfText);
        textForAI = result.obfuscated;
        privacyReplacements = result.replacements;
        privacyOriginal = result.original;
        privacyMethod = 'regex';
      } catch (e) {
        hideImportProgress();
        showNotification('Privacy protection failed — PDF not sent to AI. Try again or check Settings.', 'error');
        return;
      }
    }
    if (isDebugMode()) { console.log('[PII] Original:', pdfText); console.log('[PII] Obfuscated:', textForAI); }

    if (isPIIReviewEnabled()) {
      const decision = await reviewPIIBeforeSend(privacyOriginal || pdfText, textForAI);
      if (decision === 'cancel') { hideImportProgress(); showNotification('Import cancelled.', 'info'); return; }
    }

    await showImportProgress(2, file.name);
    const analysisStart = performance.now();
    const result = await parseLabPDFWithAI(textForAI, file.name);
    const analysisTime = Math.round((performance.now() - analysisStart) / 1000);
    if (isDebugMode()) console.log(`[Analysis] Parsed in ${analysisTime}s`);
    result.privacyMethod = privacyMethod;
    result.privacyReplacements = privacyReplacements;
    result.timings = { pii: piiTime, analysis: analysisTime };
    const prov = result.provider || getAIProvider();
    const mid = prov === 'anthropic' ? getAnthropicModel() : prov === 'venice' ? getVeniceModel() : prov === 'openrouter' ? getOpenRouterModel() : getOllamaMainModel();
    result.costInfo = {
      provider: prov, modelId: mid,
      inputTokens: result.usage?.inputTokens || 0,
      outputTokens: result.usage?.outputTokens || 0,
      cost: calculateCost(prov, mid, result.usage?.inputTokens || 0, result.usage?.outputTokens || 0)
    };
    if (isDebugMode()) { result.privacyOriginal = privacyOriginal; result.privacyObfuscated = textForAI; }
    if (!result.date) { showNotification("Could not find collection date in PDF", "error"); }
    if (result.markers.length === 0) { hideImportProgress(); showNotification("No biomarkers found in PDF", "error"); return; }
    await showImportProgress(3, file.name);
    showImportPreview(result);
    hideImportProgress();
  } catch (err) {
    hideImportProgress();
    if (isDebugMode()) console.error("PDF parse error:", err);
    showNotification("Error parsing PDF: " + err.message, "error");
  }
}

// ═══════════════════════════════════════════════
// BATCH PDF IMPORT
// ═══════════════════════════════════════════════
export async function handleBatchPDFs(pdfFiles) {
  if (!hasAIProvider()) {
    showNotification("AI provider not configured. Opening settings...", "info");
    setTimeout(() => window.openSettingsModal(), 500);
    return;
  }
  const ollama = await checkOllamaPII();
  let imported = 0, skipped = 0, failed = 0;
  for (let i = 0; i < pdfFiles.length; i++) {
    const file = pdfFiles[i];
    try {
      await showBatchImportProgress(0, file.name, i + 1, pdfFiles.length);
      const pdfText = await extractPDFText(file);
      if (!pdfText.trim()) { showNotification(`${file.name}: PDF appears empty`, 'error'); failed++; continue; }

      // PII obfuscation
      await showBatchImportProgress(1, file.name, i + 1, pdfFiles.length);
      let textForAI = pdfText;
      let privacyMethod = null;
      let privacyReplacements = 0;
      let privacyOriginal = null;
      let piiTime = 0;
      if (ollama.available) {
        try {
          const piiStart = performance.now();
          textForAI = await sanitizeWithOllama(pdfText);
          piiTime = Math.round((performance.now() - piiStart) / 1000);
          privacyMethod = 'ollama';
          privacyOriginal = pdfText;
        } catch (e) {
          if (isDebugMode()) console.warn(`[PII] Ollama failed for ${file.name}, regex fallback:`, e.message);
          try {
            const r = obfuscatePDFText(pdfText);
            textForAI = r.obfuscated; privacyReplacements = r.replacements; privacyOriginal = r.original;
            privacyMethod = 'regex';
          } catch (e2) {
            showNotification(`${file.name}: Privacy protection failed — skipped`, 'error');
            failed++; continue;
          }
        }
      } else {
        try {
          const r = obfuscatePDFText(pdfText);
          textForAI = r.obfuscated; privacyReplacements = r.replacements; privacyOriginal = r.original;
          privacyMethod = 'regex';
        } catch (e) {
          showNotification(`${file.name}: Privacy protection failed — skipped`, 'error');
          failed++; continue;
        }
      }
      if (isDebugMode()) console.log(`[PII] ${file.name} — method: ${privacyMethod}, ${piiTime}s`);

      if (isPIIReviewEnabled()) {
        const decision = await reviewPIIBeforeSend(privacyOriginal || pdfText, textForAI);
        if (decision === 'cancel') { skipped++; continue; }
      }

      await showBatchImportProgress(2, file.name, i + 1, pdfFiles.length);
      const analysisStart = performance.now();
      const result = await parseLabPDFWithAI(textForAI, file.name);
      const analysisTime = Math.round((performance.now() - analysisStart) / 1000);
      if (isDebugMode()) console.log(`[Analysis] ${file.name} parsed in ${analysisTime}s`);
      result.privacyMethod = privacyMethod;
      result.privacyReplacements = privacyReplacements;
      result.timings = { pii: piiTime, analysis: analysisTime };
      const prov = result.provider || getAIProvider();
      const mid = prov === 'anthropic' ? getAnthropicModel() : prov === 'venice' ? getVeniceModel() : prov === 'openrouter' ? getOpenRouterModel() : getOllamaMainModel();
      result.costInfo = {
        provider: prov, modelId: mid,
        inputTokens: result.usage?.inputTokens || 0,
        outputTokens: result.usage?.outputTokens || 0,
        cost: calculateCost(prov, mid, result.usage?.inputTokens || 0, result.usage?.outputTokens || 0)
      };
      if (isDebugMode()) { result.privacyOriginal = privacyOriginal; result.privacyObfuscated = textForAI; }
      if (result.markers.length === 0) { showNotification(`${file.name}: No markers found`, 'error'); failed++; continue; }
      await showBatchImportProgress(3, file.name, i + 1, pdfFiles.length);
      const action = await showImportPreviewAsync(result, file.name, i + 1, pdfFiles.length);
      if (action === 'skip') { skipped++; } else { imported++; }
    } catch (err) {
      if (isDebugMode()) console.error(`Batch import error (${file.name}):`, err);
      showNotification(`Error: ${file.name} — ${err.message}`, 'error');
      failed++;
    }
  }
  hideImportProgress();
  const parts = [];
  if (imported > 0) parts.push(`${imported} imported`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  if (failed > 0) parts.push(`${failed} failed`);
  showNotification(`Batch import complete: ${parts.join(', ')}`, imported > 0 ? 'success' : 'info');
}

export async function showBatchImportProgress(step, fileName, current, total) {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  let html = `<div class="batch-progress-counter">Processing file ${current} of ${total}</div>`;
  html += '<div class="import-progress">';
  for (let i = 0; i < IMPORT_STEPS.length; i++) {
    const isDone = i < step;
    const isActive = i === step;
    const cls = isDone ? "done" : isActive ? "active" : "";
    const icon = isDone
      ? '<span class="step-icon">\u2713</span>'
      : isActive
        ? '<span class="step-icon"><span class="progress-spinner"></span></span>'
        : '<span class="step-icon">\u25CB</span>';
    html += `<div class="progress-step ${cls}">${icon}<span>${IMPORT_STEPS[i]}${isActive ? "..." : ""}</span></div>`;
  }
  if (fileName) html += `<div class="import-progress-filename">${fileName}</div>`;
  html += '</div>';
  dropZone.innerHTML = html;
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
}

export function showImportPreviewAsync(result, fileName, current, total) {
  return new Promise(resolve => {
    window._batchImportResolve = resolve;
    window._batchImportContext = { current, total };
    showImportPreview(result);
  });
}

// ═══════════════════════════════════════════════
// WINDOW EXPORTS
// ═══════════════════════════════════════════════
Object.assign(window, {
  buildMarkerReference,
  extractPDFText,
  tryParseJSON,
  parseLabPDFWithAI,
  showImportPreview,
  applyManualImportDate,
  closeImportModal,
  confirmImport,
  removeImportedEntry,
  setupDropZone,
  showImportProgress,
  hideImportProgress,
  handlePDFFile,
  handleBatchPDFs,
  showBatchImportProgress,
  showImportPreviewAsync,
});
