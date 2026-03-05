// pdf-import.js — PDF parsing pipeline, import preview, drop zone, batch import

import { state } from './state.js';
import { MARKER_SCHEMA, SPECIALTY_MARKER_DEFS, UNIT_CONVERSIONS, calculateCost, formatCost } from './schema.js';
import { IMPORT_STEPS } from './constants.js';
import { escapeHTML, showNotification, isDebugMode, isPIIReviewEnabled, hashString } from './utils.js';
import { saveImportedData, getActiveData, recalculateHOMAIR } from './data.js';
import { callClaudeAPI, hasAIProvider, getAIProvider, setAIProvider, getAnthropicModel, setAnthropicModel, getVeniceModel, setVeniceModel, getOpenRouterModel, setOpenRouterModel, /* ROUTSTR DISABLED: getRoutstrModel, */ getOllamaMainModel, setOllamaMainModel, getAnthropicModelDisplay, getVeniceModelDisplay, getOpenRouterModelDisplay, /* ROUTSTR DISABLED: getRoutstrModelDisplay, */ getOllamaPIIModel } from './api.js';
import { obfuscatePDFText, sanitizeWithOllama, sanitizeWithOllamaStreaming, checkOllamaPII, reviewPIIBeforeSend } from './pii.js';


// ═══════════════════════════════════════════════
// UNIT NORMALIZATION — convert US-unit values to SI before storage
// ═══════════════════════════════════════════════
function normalizeUnitStr(s) {
  return s.toLowerCase().replace(/\s/g, '').replace(/[\u00b5\u03bc]/g, 'u').replace(/^mcg/, 'ug');
}

function normalizeToSI(key, value, unit) {
  if (value == null || !unit) return value;
  const conv = UNIT_CONVERSIONS[key];
  if (!conv) return value;
  const aiUnit = normalizeUnitStr(unit);
  if (conv.type === 'multiply') {
    if (aiUnit === normalizeUnitStr(conv.usUnit)) return parseFloat((value / conv.factor).toPrecision(6));
  } else if (conv.type === 'hba1c' && aiUnit === '%') {
    return parseFloat(((value - 2.15) * 10.929).toFixed(1));
  }
  return value;
}

// ═══════════════════════════════════════════════
// PRE-FLIGHT CHECKS (before spending tokens)
// ═══════════════════════════════════════════════
function _showPreflightConfirm(message, confirmLabel = 'Import Anyway') {
  return new Promise(resolve => {
    let overlay = document.getElementById('confirm-dialog-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'confirm-dialog-overlay';
      overlay.className = 'confirm-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="confirm-dialog" role="alertdialog" aria-modal="true">
      <p class="confirm-message">${message}</p>
      <div class="confirm-actions">
        <button class="confirm-btn confirm-btn-cancel" id="confirm-cancel">Cancel</button>
        <button class="confirm-btn confirm-btn-danger" id="confirm-ok">${escapeHTML(confirmLabel)}</button>
      </div></div>`;
    overlay.classList.add('show');
    document.getElementById('confirm-ok').onclick = () => { overlay.classList.remove('show'); resolve(true); };
    document.getElementById('confirm-cancel').onclick = () => { overlay.classList.remove('show'); resolve(false); };
    overlay.onclick = (e) => { if (e.target === overlay) { overlay.classList.remove('show'); resolve(false); } };
  });
}

function checkDuplicateHash(pdfText) {
  const hash = hashString(pdfText);
  for (const e of (state.importedData?.entries || [])) {
    if (e.importHash === hash) return e.date;
  }
  return null;
}

// Normalize model IDs for comparison across providers
// "anthropic/claude-sonnet-4.6" / "claude-sonnet-4-6" / "claude-sonnet-4.6" → "claude-sonnet-4-6"
function normalizeModelId(id) {
  return id.replace(/^[^/]+\//, '').replace(/-\d{8}$/, '').replace(/\./g, '-');
}

function checkModelMismatch() {
  const provider = getAIProvider();
  const currentModel = provider === 'anthropic' ? getAnthropicModel() : provider === 'venice' ? getVeniceModel() : provider === 'openrouter' ? getOpenRouterModel() : getOllamaMainModel();
  // Find the most recent entry with a different model
  const entries = (state.importedData?.entries || []).filter(e => e.importedWith?.modelId);
  if (entries.length === 0) return null;
  const lastEntry = entries[entries.length - 1];
  // Compare normalized IDs to avoid false positives across providers
  if (normalizeModelId(lastEntry.importedWith.modelId) === normalizeModelId(currentModel)) return null;
  return {
    currentModel,
    prevModel: lastEntry.importedWith.modelId,
    prevProvider: lastEntry.importedWith.provider
  };
}

function tryAutoSwitchModel(prevModel, prevProvider) {
  // Try to switch to the previous model/provider combo
  if (prevProvider && prevProvider !== getAIProvider()) {
    setAIProvider(prevProvider);
  }
  const provider = getAIProvider();
  if (provider === 'openrouter') setOpenRouterModel(prevModel);
  else if (provider === 'anthropic') setAnthropicModel(prevModel);
  else if (provider === 'venice') setVeniceModel(prevModel);
  else if (provider === 'ollama') setOllamaMainModel(prevModel);
}

function _showModelMismatchDialog(mismatch) {
  return new Promise(resolve => {
    let overlay = document.getElementById('confirm-dialog-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'confirm-dialog-overlay';
      overlay.className = 'confirm-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="confirm-dialog" role="alertdialog" aria-modal="true">
      <p class="confirm-message">Previous imports used <strong>${escapeHTML(mismatch.prevModel)}</strong>. Using <strong>${escapeHTML(mismatch.currentModel)}</strong> may cause marker key mismatches and break trend lines.</p>
      <div class="confirm-actions" style="flex-wrap:wrap;gap:8px">
        <button class="confirm-btn confirm-btn-cancel" id="confirm-cancel">Cancel</button>
        <button class="confirm-btn" id="confirm-continue" style="background:var(--yellow);color:#000">Continue Anyway</button>
        <button class="confirm-btn confirm-btn-danger" id="confirm-switch">Switch to ${escapeHTML(mismatch.prevModel.split('/').pop())}</button>
      </div></div>`;
    overlay.classList.add('show');
    document.getElementById('confirm-switch').onclick = () => {
      tryAutoSwitchModel(mismatch.prevModel, mismatch.prevProvider);
      overlay.classList.remove('show');
      resolve('switched');
    };
    document.getElementById('confirm-continue').onclick = () => { overlay.classList.remove('show'); resolve('continue'); };
    document.getElementById('confirm-cancel').onclick = () => { overlay.classList.remove('show'); resolve('cancel'); };
    overlay.onclick = (e) => { if (e.target === overlay) { overlay.classList.remove('show'); resolve('cancel'); } };
  });
}

async function runPreflightChecks(pdfText) {
  // 1. Duplicate file check (hash-based)
  const dupDate = checkDuplicateHash(pdfText);
  if (dupDate) {
    const dateLabel = new Date(dupDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const proceed = await _showPreflightConfirm(
      `This file was already imported (<strong>${dateLabel}</strong>). Importing again will use tokens and may overwrite existing values.`
    );
    if (!proceed) return false;
  }
  // 2. Model mismatch check
  const mismatch = checkModelMismatch();
  if (mismatch) {
    const result = await _showModelMismatchDialog(mismatch);
    if (result === 'cancel') return false;
    // 'switched' or 'continue' both proceed with import
  }
  return true;
}

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
  // Include custom markers from previous imports (override specialty defaults)
  const custom = (state.importedData && state.importedData.customMarkers) ? state.importedData.customMarkers : {};
  for (const [fullKey, def] of Object.entries(custom)) {
    if (!ref[fullKey]) {
      ref[fullKey] = { name: def.name, unit: def.unit, refMin: def.refMin, refMax: def.refMax };
    }
  }
  // Include specialty marker definitions (fallback for first-time imports)
  for (const [key, def] of Object.entries(SPECIALTY_MARKER_DEFS)) {
    if (!ref[key]) {
      ref[key] = { name: def.name, unit: def.unit, refMin: def.refMin, refMax: def.refMax };
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

export async function parseLabPDFWithAI(pdfText, fileName, onProgress) {
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
   - unit: the unit as shown in the PDF
   - refMin: the lower reference range bound from the PDF (number or null)
   - refMax: the upper reference range bound from the PDF (number or null)
3. Match based on medical/biochemical equivalence, not just string similarity. For example:
   - "Glukóza" → "biochemistry.glucose" (Czech for glucose)
   - "Triacylglyceroly" → "lipids.triglycerides"
   - Use the units and reference ranges to help disambiguate
4. Only map to a marker if you're confident it's the correct match
5. For differential WBC: only map absolute count values (marked with # or abs.) to the # markers; percentage values go to the Pct markers
6. Skip non-numeric results (text-only findings, interpretive notes)
7. Identify the type of lab test this PDF represents. Return as "testType" field:
   - "blood" for standard blood panels (CBC, metabolic, lipids, hormones, etc.)
   - "OAT" for Organic Acids Tests (Mosaic, Genova, Great Plains)
   - "Metabolomix+" for Genova Metabolomix+ profiles (combo: organic acids + amino acids + fatty acids)
   - "DUTCH" for dried urine hormone panels
   - "HTMA" for Hair Tissue Mineral Analysis
   - "GI" for stool tests (GI-MAP, Gut Zoomer)
   - Or a descriptive name for other specialty tests
8. CRITICAL for specialty tests (testType ≠ "blood"): You MUST NOT set mappedKey to any standard blood work category key (biochemistry, hormones, electrolytes, lipids, iron, proteins, thyroid, vitamins, diabetes, tumorMarkers, coagulation, hematology, differential, fattyAcids, boneMetabolism). Even if a marker name matches (e.g., "Creatinine" in a urine OAT test is NOT "biochemistry.creatinine" which is serum). Always use test-type-prefixed keys from the reference list (oatMicrobial, oatMetabolic, etc.) or set mappedKey to null so it becomes a new custom marker. Different specimen types = different markers.
9. For markers that do NOT match any known key (mappedKey is null), also return:
   - suggestedKey: a "category.camelCaseKey" string. For specialty tests (testType ≠ "blood"), ALWAYS use a test-type-prefixed category (e.g., "oatNutritional", "dutchHormones"). Never use standard blood work categories for specialty test markers. The key part should be a concise camelCase identifier. NEVER use a suggestedKey that already exists in the known markers list above.
   - suggestedName: a clean English display name for the marker
   - suggestedCategoryLabel: short category label (e.g., "Microbial Overgrowth")
   - suggestedGroup: test type group (e.g., "OAT", "DUTCH", "HTMA") — omit for standard blood work

Return ONLY valid JSON in this exact format, no other text:
{
  "testType": "blood",
  "date": "YYYY-MM-DD",
  "markers": [
    {"rawName": "Test Name", "value": 5.23, "mappedKey": "category.marker", "unit": "mg/dL", "refMin": 70, "refMax": 100},
    {"rawName": "Unknown Test", "value": 1.0, "mappedKey": null, "suggestedKey": "oatMicrobial.someMarker", "suggestedName": "Some Marker", "suggestedCategoryLabel": "Microbial Overgrowth", "suggestedGroup": "OAT", "unit": "mg/l", "refMin": 0.5, "refMax": 3.0}
  ]
}`;

  const provider = getAIProvider();
  const maxTokens = 32768;
  // Stream AI response to report real-time progress during analysis (15% → 90%)
  let onStream;
  if (onProgress) {
    let lastPct = -1;
    onStream = (text) => {
      const pct = Math.min(15 + Math.round((text.length / (maxTokens * 3)) * 75), 90);
      if (pct !== lastPct) { lastPct = pct; onProgress(pct); }
    };
  }
  const { text: response, usage } = await callClaudeAPI({
    system,
    messages: [{ role: 'user', content: `Extract all biomarker results from this lab report${fileName ? ' (file: ' + fileName + ')' : ''}:\n\n${pdfText}` }],
    maxTokens,
    onStream
  });

  // Parse JSON from response (handle markdown code blocks, truncated output)
  let jsonStr = (response || '').trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
  // Strip any leading text before the JSON object
  const jsonStart = jsonStr.indexOf('{');
  if (jsonStart > 0) jsonStr = jsonStr.slice(jsonStart);
  const parsed = tryParseJSON(jsonStr);

  const testType = parsed.testType || 'blood';
  const standardCats = new Set(Object.keys(MARKER_SCHEMA));
  return {
    date: parsed.date || null,
    testType,
    markers: (parsed.markers || []).map(m => {
      let mappedKey = m.mappedKey || null;
      let matched = !!mappedKey;
      // Guard: never allow standard blood work mappings for specialty tests
      if (matched && testType !== 'blood') {
        const catKey = mappedKey.split('.')[0];
        if (standardCats.has(catKey)) {
          if (isDebugMode()) console.log(`[Import Guard] Demoted ${mappedKey} — standard category in ${testType} test`);
          // Preserve AI's suggested fields or construct fallback from the standard category
          if (!m.suggestedKey) {
            const markerPart = mappedKey.split('.')[1] || m.rawName.replace(/[^a-zA-Z0-9]/g, '');
            const prefix = testType.toLowerCase().replace(/[^a-z]/g, '');
            const originalCat = MARKER_SCHEMA[catKey];
            const catSuffix = catKey.charAt(0).toUpperCase() + catKey.slice(1);
            m.suggestedKey = `${prefix}${catSuffix}.${markerPart}`;
            m.suggestedName = m.suggestedName || (originalCat?.markers?.[markerPart]?.name) || m.rawName;
            m.suggestedCategoryLabel = m.suggestedCategoryLabel || (originalCat?.label) || catSuffix;
            m.suggestedGroup = m.suggestedGroup || testType;
          }
          mappedKey = null;
          matched = false;
        }
      }
      // Guard: also rewrite suggestedKey if AI used a standard category for specialty test
      if (!matched && m.suggestedKey && testType !== 'blood') {
        const sugCat = m.suggestedKey.split('.')[0];
        if (standardCats.has(sugCat)) {
          const markerPart = m.suggestedKey.split('.')[1] || m.rawName.replace(/[^a-zA-Z0-9]/g, '');
          const prefix = testType.toLowerCase().replace(/[^a-z]/g, '');
          const catSuffix = sugCat.charAt(0).toUpperCase() + sugCat.slice(1);
          if (isDebugMode()) console.log(`[Import Guard] Rewrote suggestedKey ${m.suggestedKey} → ${prefix}${catSuffix}.${markerPart}`);
          m.suggestedKey = `${prefix}${catSuffix}.${markerPart}`;
          m.suggestedCategoryLabel = m.suggestedCategoryLabel || MARKER_SCHEMA[sugCat]?.label || catSuffix;
          m.suggestedGroup = testType;
        }
      }
      return {
        rawName: m.rawName,
        value: typeof m.value === 'number' ? m.value : parseFloat(String(m.value).replace(',', '.')),
        mappedKey,
        matched,
        suggestedKey: m.suggestedKey || null,
        suggestedName: m.suggestedName || null,
        suggestedCategoryLabel: m.suggestedCategoryLabel || null,
        unit: m.unit || null,
        refMin: m.refMin != null ? m.refMin : null,
        refMax: m.refMax != null ? m.refMax : null,
        group: m.suggestedGroup || m.group || (testType !== 'blood' ? testType : null) || null
      };
    }).filter(m => !isNaN(m.value)),
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
  entry.importedWith = {
    provider: result.costInfo?.provider || null,
    modelId: result.costInfo?.modelId || null
  };
  if (result.importHash) entry.importHash = result.importHash;
  for (const m of matched) entry.markers[m.mappedKey] = normalizeToSI(m.mappedKey, m.value, m.unit);
  // For non-blood imports, testType is the authoritative sidebar group for all markers
  const importGroup = (result.testType && result.testType !== 'blood') ? result.testType : null;
  // Auto-create custom markers for matched specialty keys (uses PDF's reference ranges)
  if (!state.importedData.customMarkers) state.importedData.customMarkers = {};
  for (const m of matched) {
    if (SPECIALTY_MARKER_DEFS[m.mappedKey] && !state.importedData.customMarkers[m.mappedKey]) {
      const def = SPECIALTY_MARKER_DEFS[m.mappedKey];
      state.importedData.customMarkers[m.mappedKey] = {
        name: def.name,
        unit: m.unit || def.unit,
        refMin: m.refMin != null ? m.refMin : def.refMin,
        refMax: m.refMax != null ? m.refMax : def.refMax,
        categoryLabel: def.categoryLabel,
        icon: def.icon,
        group: importGroup || def.group || null
      };
    }
  }
  // Save new (custom) marker values and definitions
  if (!state.importedData.customMarkers) state.importedData.customMarkers = {};
  for (const m of newMarkers) {
    entry.markers[m.suggestedKey] = normalizeToSI(m.suggestedKey, m.value, m.unit);
    // Save definition only if not already defined
    if (!state.importedData.customMarkers[m.suggestedKey]) {
      const [catKey] = m.suggestedKey.split('.');
      // Determine category label: use schema label if category exists, else AI-suggested or title-case the key
      const schemaCategory = MARKER_SCHEMA[catKey];
      const categoryLabel = schemaCategory ? schemaCategory.label : m.suggestedCategoryLabel || catKey.charAt(0).toUpperCase() + catKey.slice(1);
      state.importedData.customMarkers[m.suggestedKey] = {
        name: m.suggestedName || m.rawName,
        unit: m.unit || '',
        refMin: m.refMin,
        refMax: m.refMax,
        categoryLabel,
        group: importGroup || m.group || null
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
  // During batch mode, defer expensive UI refreshes until the batch completes
  if (!_batchMode) {
    window.buildSidebar();
    window.updateHeaderDates();
    const activeNav = document.querySelector(".nav-item.active");
    window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  }
  showNotification(`Imported ${importCount} markers from ${result.date}`, "success");
  if (!_batchMode && typeof window.maybeShowEncryptionNudge === 'function') window.maybeShowEncryptionNudge();
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

// Weighted step percentages: text extraction and PII are fast, AI analysis is the bulk
const STEP_START_PCT = [5, 10, 15, 95];

function _updateProgressPct(pct) {
  const fill = document.querySelector('.import-progress-bar-fill');
  const label = document.querySelector('.import-progress-pct');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = pct + '%';
}

function _buildProgressHTML(step, fileName) {
  const pct = STEP_START_PCT[step] || 0;
  let html = `<div class="import-progress-bar"><div class="import-progress-bar-fill" style="width:${pct}%"></div></div>`;
  html += `<div class="import-progress-pct">${pct}%</div>`;
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
  return html;
}

export async function showImportProgress(step, fileName) {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  dropZone.innerHTML = _buildProgressHTML(step, fileName);
  // Yield to browser so it actually paints the progress before heavy work continues
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
}

export function hideImportProgress() {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  dropZone.innerHTML = `<div class="drop-zone-icon">\uD83D\uDCC4</div>
    <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
    <div class="drop-zone-hint">AI-powered \u2014 works with any lab PDF report or getbased JSON export</div>`;
}

export async function handlePDFFile(file) {
  try {
    await showImportProgress(0, file.name);
    const pdfText = await extractPDFText(file);
    if (!pdfText.trim()) { hideImportProgress(); showNotification("PDF appears empty — no text extracted", "error"); return; }

    if (!hasAIProvider()) {
      hideImportProgress();
      showNotification("AI provider not configured. Opening settings...", "info");
      setTimeout(() => window.openSettingsModal(), 500);
      return;
    }

    // Pre-flight checks — before spending tokens
    hideImportProgress();
    const preflight = await runPreflightChecks(pdfText);
    if (!preflight) return;
    await showImportProgress(0, file.name);

    // PII obfuscation step
    await showImportProgress(1, file.name);
    let textForAI = pdfText;
    let privacyMethod = null;
    let privacyReplacements = 0;
    let privacyOriginal = null;
    let piiTime = 0;
    const ollama = await checkOllamaPII();

    if (ollama.available && isPIIReviewEnabled()) {
      // Streaming mode — modal opens immediately, AI streams into it
      const piiStart = performance.now();
      const reviewResult = await reviewPIIBeforeSend(pdfText, {
        streamFn: (onChunk, signal) => sanitizeWithOllamaStreaming(pdfText, onChunk, signal)
      });
      piiTime = Math.round((performance.now() - piiStart) / 1000);
      if (reviewResult === 'cancel') { hideImportProgress(); showNotification('Import cancelled.', 'info'); return; }
      textForAI = reviewResult;
      privacyMethod = 'ollama+review';
      privacyOriginal = pdfText;
    } else if (ollama.available) {
      // Non-streaming background path (review disabled)
      try {
        const piiStart = performance.now();
        textForAI = await sanitizeWithOllama(pdfText);
        piiTime = Math.round((performance.now() - piiStart) / 1000);
        privacyMethod = 'ollama';
        privacyOriginal = pdfText;
        if (isDebugMode()) console.log(`[PII] Obfuscated via Local AI (${piiTime}s)`);
      } catch (e) {
        if (isDebugMode()) console.warn('[PII] Local AI failed, falling back to regex:', e.message);
        try {
          const result = obfuscatePDFText(pdfText);
          textForAI = result.obfuscated;
          privacyReplacements = result.replacements;
          privacyOriginal = result.original;
          privacyMethod = 'regex';
        } catch (e2) {
          hideImportProgress();
          showNotification('Privacy protection failed \u2014 PDF not sent to AI. Try again or check Settings.', 'error');
          return;
        }
      }
    } else {
      // Regex-only path
      try {
        const result = obfuscatePDFText(pdfText);
        textForAI = result.obfuscated;
        privacyReplacements = result.replacements;
        privacyOriginal = result.original;
        privacyMethod = 'regex';
      } catch (e) {
        hideImportProgress();
        showNotification('Privacy protection failed \u2014 PDF not sent to AI. Try again or check Settings.', 'error');
        return;
      }
      if (isPIIReviewEnabled()) {
        const reviewResult = await reviewPIIBeforeSend(pdfText, { obfuscatedText: textForAI });
        if (reviewResult === 'cancel') { hideImportProgress(); showNotification('Import cancelled.', 'info'); return; }
        textForAI = reviewResult;
      }
    }
    if (isDebugMode()) { console.log('[PII] Original:', pdfText); console.log('[PII] Obfuscated:', textForAI); }

    await showImportProgress(2, file.name);
    const analysisStart = performance.now();
    const result = await parseLabPDFWithAI(textForAI, file.name, _updateProgressPct);
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
    result.importHash = hashString(pdfText);
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
let _batchMode = false;

async function _processBatchFile(file, ollama, fileNum, totalFiles) {
  await showBatchImportProgress(0, file.name, fileNum, totalFiles);
  const pdfText = await extractPDFText(file);
  if (!pdfText.trim()) { showNotification(`${file.name}: PDF appears empty`, 'error'); return 'empty'; }

  // Pre-flight checks — before spending tokens
  const preflight = await runPreflightChecks(pdfText);
  if (!preflight) return 'skipped';

  // PII obfuscation
  await showBatchImportProgress(1, file.name, fileNum, totalFiles);
  let textForAI = pdfText;
  let privacyMethod = null;
  let privacyReplacements = 0;
  let privacyOriginal = null;
  let piiTime = 0;

  if (ollama.available && isPIIReviewEnabled()) {
    // Streaming mode — modal opens immediately, AI streams into it
    const piiStart = performance.now();
    const reviewResult = await reviewPIIBeforeSend(pdfText, {
      streamFn: (onChunk, signal) => sanitizeWithOllamaStreaming(pdfText, onChunk, signal)
    });
    piiTime = Math.round((performance.now() - piiStart) / 1000);
    if (reviewResult === 'cancel') { return 'skipped'; }
    textForAI = reviewResult;
    privacyMethod = 'ollama+review';
    privacyOriginal = pdfText;
  } else if (ollama.available) {
    try {
      const piiStart = performance.now();
      textForAI = await sanitizeWithOllama(pdfText);
      piiTime = Math.round((performance.now() - piiStart) / 1000);
      privacyMethod = 'ollama';
      privacyOriginal = pdfText;
    } catch (e) {
      if (isDebugMode()) console.warn(`[PII] Local AI failed for ${file.name}, regex fallback:`, e.message);
      try {
        const r = obfuscatePDFText(pdfText);
        textForAI = r.obfuscated; privacyReplacements = r.replacements; privacyOriginal = r.original;
        privacyMethod = 'regex';
      } catch (e2) {
        showNotification(`${file.name}: Privacy protection failed \u2014 skipped`, 'error');
        return 'pii-fail';
      }
    }
  } else {
    try {
      const r = obfuscatePDFText(pdfText);
      textForAI = r.obfuscated; privacyReplacements = r.replacements; privacyOriginal = r.original;
      privacyMethod = 'regex';
    } catch (e) {
      showNotification(`${file.name}: Privacy protection failed \u2014 skipped`, 'error');
      return 'pii-fail';
    }
    if (isPIIReviewEnabled()) {
      const reviewResult = await reviewPIIBeforeSend(pdfText, { obfuscatedText: textForAI });
      if (reviewResult === 'cancel') { return 'skipped'; }
      textForAI = reviewResult;
    }
  }
  if (isDebugMode()) console.log(`[PII] ${file.name} \u2014 method: ${privacyMethod}, ${piiTime}s`);

  await showBatchImportProgress(2, file.name, fileNum, totalFiles);
  const analysisStart = performance.now();
  const result = await parseLabPDFWithAI(textForAI, file.name, _updateProgressPct);
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
  result.importHash = hashString(pdfText);
  if (isDebugMode()) { result.privacyOriginal = privacyOriginal; result.privacyObfuscated = textForAI; }
  if (result.markers.length === 0) { showNotification(`${file.name}: No markers found`, 'error'); return 'no-markers'; }
  await showBatchImportProgress(3, file.name, fileNum, totalFiles);
  const action = await showImportPreviewAsync(result, file.name, fileNum, totalFiles);
  return action === 'skip' ? 'skipped' : 'imported';
}

export async function handleBatchPDFs(pdfFiles) {
  if (!hasAIProvider()) {
    showNotification("AI provider not configured. Opening settings...", "info");
    setTimeout(() => window.openSettingsModal(), 500);
    return;
  }
  _batchMode = true;
  const ollama = await checkOllamaPII();
  let imported = 0, skipped = 0, failed = 0;
  const failedFiles = [];
  for (let i = 0; i < pdfFiles.length; i++) {
    const file = pdfFiles[i];
    try {
      const result = await _processBatchFile(file, ollama, i + 1, pdfFiles.length);
      if (result === 'imported') imported++;
      else if (result === 'skipped') skipped++;
      else if (result === 'empty' || result === 'pii-fail' || result === 'no-markers') failed++;
    } catch (err) {
      if (isDebugMode()) console.error(`Batch import error (${file.name}):`, err);
      showNotification(`Error: ${file.name} — ${err.message}`, 'error');
      failedFiles.push({ file, error: err.message });
    }
  }
  // Retry failed files once (rate limit / API error recovery)
  let retryImported = 0, retryFailed = 0;
  if (failedFiles.length > 0) {
    showNotification(`Retrying ${failedFiles.length} failed file(s)...`, 'info');
    await new Promise(r => setTimeout(r, 5000));
    for (let i = 0; i < failedFiles.length; i++) {
      const { file } = failedFiles[i];
      try {
        const result = await _processBatchFile(file, ollama, i + 1, failedFiles.length);
        if (result === 'imported') { retryImported++; imported++; }
        else if (result === 'skipped') skipped++;
        else failed++;
      } catch (err) {
        if (isDebugMode()) console.error(`Retry failed (${file.name}):`, err);
        retryFailed++;
        failed++;
      }
      if (i < failedFiles.length - 1) await new Promise(r => setTimeout(r, 3000));
    }
  }
  _batchMode = false;
  // Refresh UI once after all files processed
  window.buildSidebar();
  window.updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  hideImportProgress();
  const parts = [];
  if (imported > 0) parts.push(`${imported} imported`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  if (failed > 0) parts.push(`${failed} failed`);
  if (retryImported > 0) parts.push(`${retryImported} recovered on retry`);
  showNotification(`Batch import complete: ${parts.join(', ')}`, imported > 0 ? 'success' : 'info');
  if (imported > 0 && typeof window.maybeShowEncryptionNudge === 'function') window.maybeShowEncryptionNudge();
}

export async function showBatchImportProgress(step, fileName, current, total) {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  let html = `<div class="batch-progress-counter">Processing file ${current} of ${total}</div>`;
  html += _buildProgressHTML(step, fileName);
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
