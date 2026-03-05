// pii.js — PII obfuscation (Ollama + regex), diff viewer

import { isDebugMode, showNotification, escapeHTML } from './utils.js';
import { getOllamaPIIModel, getOllamaPIIUrl } from './api.js';
import { state } from './state.js';

// ═══════════════════════════════════════════════
// PII OBFUSCATION — Fake data generators & sanitization
// ═══════════════════════════════════════════════
export function detectSexFromPDF(text) {
  // Check for sex/gender labels in Czech and English lab reports
  // Note: \b doesn't work with accented chars (í,ž), so use [\s:] boundary instead
  if (/(?:pohlav[ií]|sex|gender)[\s:]+(?:ž|žena|female|f)(?:\s|$)/im.test(text)) return 'female';
  if (/(?:pohlav[ií]|sex|gender)[\s:]+(?:m|muž|male)(?:\s|$)/im.test(text)) return 'male';
  // Czech birth numbers: month 51-62 = female (month + 50)
  const bn = text.match(/\b\d{2}(5[1-9]|6[0-2])\d{2}\/\d{3,4}\b/);
  if (bn) return 'female';
  return null;
}
export function fakeName(sex) { return sex === 'female' ? 'Jana Nováková' : 'Jan Novák'; }
export const FAKE_STREETS = [
  'Sokolská 17', 'Národní 8', 'Lidická 32', 'Husova 5', 'Květná 12',
  'Nádražní 44', 'Masarykova 19', 'Palackého 7', 'Riegrova 23', 'Zahradní 3'
];
export const FAKE_CITIES = ['Brno', 'Olomouc', 'Plzeň', 'Ostrava', 'Liberec', 'České Budějovice', 'Hradec Králové', 'Pardubice'];
export const FAKE_DOCTORS = [
  'MUDr. Dvořák', 'MUDr. Procházka', 'MUDr. Horáková', 'MUDr. Novák',
  'MUDr. Šimková', 'MUDr. Veselý', 'MUDr. Kopecký', 'MUDr. Marková'
];

export function randomPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
export function randomDigits(n) { let s = ''; for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10); return s; }
export function fakeBirthNumber() {
  const y = 50 + Math.floor(Math.random() * 50);
  const m = 1 + Math.floor(Math.random() * 12);
  const d = 1 + Math.floor(Math.random() * 28);
  return `${String(y).padStart(2,'0')}${String(m).padStart(2,'0')}${String(d).padStart(2,'0')}/${randomDigits(4)}`;
}
export function fakePhone() { return `+420 7${randomDigits(2)} ${randomDigits(3)} ${randomDigits(3)}`; }
export function fakeEmail() { return `user${randomDigits(4)}@mail.com`; }
export function fakeDate() {
  const y = 1960 + Math.floor(Math.random() * 40);
  const m = 1 + Math.floor(Math.random() * 12);
  const d = 1 + Math.floor(Math.random() * 28);
  return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${y}`;
}
export function fakePatientId() { return randomDigits(10); }

// ═══════════════════════════════════════════════
// OLLAMA INTEGRATION
// ═══════════════════════════════════════════════
export function getOllamaConfig() {
  const defaults = { url: 'http://localhost:11434', model: 'llama3.2', mode: 'ollama', apiKey: '' };
  try { return { ...defaults, ...JSON.parse(localStorage.getItem('labcharts-ollama')) }; }
  catch { return defaults; }
}
export function saveOllamaConfig(config) { localStorage.setItem('labcharts-ollama', JSON.stringify(config)); }

export async function checkOllama(url) {
  const baseUrl = url || getOllamaConfig().url;
  try {
    const resp = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!resp.ok) return { available: false, models: [] };
    const data = await resp.json();
    const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
    return { available: true, models };
  } catch {
    return { available: false, models: [] };
  }
}

export async function checkOpenAICompatible(url, apiKey) {
  const baseUrl = (url || getOllamaConfig().url).replace(/\/+$/, '');
  try {
    const headers = {};
    if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
    const resp = await fetch(`${baseUrl}/v1/models`, { headers, signal: AbortSignal.timeout(3000) });
    if (!resp.ok) return { available: false, models: [] };
    const data = await resp.json();
    const models = (data.data || []).map(m => m.id).filter(Boolean);
    return { available: true, models };
  } catch {
    return { available: false, models: [] };
  }
}

export function isOllamaPIIEnabled() {
  return localStorage.getItem('labcharts-ollama-pii-enabled') === 'true';
}

export function setOllamaPIIEnabled(enabled) {
  localStorage.setItem('labcharts-ollama-pii-enabled', enabled ? 'true' : 'false');
}

export async function checkOllamaPII() {
  if (!isOllamaPIIEnabled()) return { available: false, models: [] };
  const config = getOllamaConfig();
  return checkOpenAICompatible(getOllamaPIIUrl(), config.apiKey);
}

export function unloadOllamaPIIModel() {
  // Best-effort: try Ollama-specific unload to free VRAM. Silently fails on non-Ollama servers.
  const piiUrl = getOllamaPIIUrl();
  const piiModel = getOllamaPIIModel();
  fetch(`${piiUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: piiModel, prompt: '', stream: false, keep_alive: 0 }),
    signal: AbortSignal.timeout(5000)
  }).catch(() => {});
}

const PII_PROMPT_PREFIX = `TASK: Replace ONLY personal identifiers in this lab report. Output the FULL text with minimal changes.

REPLACE these with fake data:
- Patient names → fictional names
- Birth numbers (e.g. 850115/1234) → random numbers in same format
- Addresses → fictional addresses
- Phone numbers → random phone numbers
- Emails → fictional emails
- Doctor names → fictional doctor names
- Patient IDs → random numbers

DO NOT CHANGE (copy exactly as-is):
- ALL dates (collection dates, sample dates, report dates) — these are critical
- ALL "=== Page N ===" headers
- ALL lab test names, numeric values, units, reference ranges
- ALL line structure and formatting

Output ONLY the modified text. No explanations, no markdown, no commentary.

TEXT TO PROCESS:
`;

function validatePIIResult(result, pdfText) {
  if (!result) return 'Local AI returned empty response';
  if (result.length < pdfText.length * 0.25) return `Local AI output too short (${result.length} vs ${pdfText.length} chars)`;
  const inputDates = pdfText.match(/\b\d{4}[-/.]\d{2}[-/.]\d{2}\b|\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/g) || [];
  const outputDates = result.match(/\b\d{4}[-/.]\d{2}[-/.]\d{2}\b|\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/g) || [];
  if (inputDates.length > 0 && outputDates.length === 0) return 'Local AI lost all dates from the text';
  return null;
}

export async function sanitizeWithOllamaStreaming(pdfText, onChunk, signal) {
  const piiUrl = getOllamaPIIUrl();
  const piiModel = getOllamaPIIModel();
  const config = getOllamaConfig();
  const promptText = PII_PROMPT_PREFIX + pdfText;
  const baseUrl = piiUrl.replace(/\/+$/, '');
  const headers = { 'Content-Type': 'application/json' };
  if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

  const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ model: piiModel, messages: [{ role: 'user', content: promptText }], stream: true }),
    signal
  });
  if (!resp.ok) throw new Error(`Local server error: ${resp.status}`);

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const payload = trimmed.slice(6);
        if (payload === '[DONE]') break;
        try {
          const json = JSON.parse(payload);
          const delta = json.choices?.[0]?.delta?.content;
          if (delta) {
            accumulated += delta;
            onChunk(delta);
          }
        } catch { /* skip malformed chunks */ }
      }
    }
  } finally {
    reader.releaseLock();
  }

  const result = accumulated.trim();
  const validationError = validatePIIResult(result, pdfText);
  if (validationError) throw new Error(validationError);

  unloadOllamaPIIModel();
  return result;
}

export async function sanitizeWithOllama(pdfText) {
  const piiUrl = getOllamaPIIUrl();
  const piiModel = getOllamaPIIModel();
  const config = getOllamaConfig();
  const promptText = PII_PROMPT_PREFIX + pdfText;
  try {
    const baseUrl = piiUrl.replace(/\/+$/, '');
    const headers = { 'Content-Type': 'application/json' };
    if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;
    const resp = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ model: piiModel, messages: [{ role: 'user', content: promptText }], stream: false }),
      signal: AbortSignal.timeout(90000)
    });
    if (!resp.ok) throw new Error(`Local server error: ${resp.status}`);
    const data = await resp.json();
    const result = (data.choices?.[0]?.message?.content || '').trim();

    const validationError = validatePIIResult(result, pdfText);
    if (validationError) throw new Error(validationError);

    unloadOllamaPIIModel();
    return result;
  } catch (e) {
    unloadOllamaPIIModel();
    if (e.name === 'TimeoutError' || e.message.includes('timed out')) {
      showNotification(`PII model "${piiModel}" timed out. Falling back to regex. Try a smaller model in Settings → Privacy.`, 'info', 6000);
    }
    throw e;
  }
}

// ═══════════════════════════════════════════════
// REGEX PII OBFUSCATION (fallback when no Ollama)
// ═══════════════════════════════════════════════
export function obfuscatePDFText(pdfText) {
  let text = pdfText;
  let replacements = 0;
  const original = pdfText;
  const pdfSex = detectSexFromPDF(pdfText) || state.profileSex;

  // Unit keywords that indicate a result line — never strip digits from these
  const unitKeywords = /\b(mmol|µmol|µkat|umol|ukat|g\/l|mg\/l|ng\/l|µg|ug|mU\/l|pmol|nmol|ml\/s|fL|pg|×10|10\^|u\/l|iu\/l|%|sec|s\/1)\b/i;
  // Collection date line — protect entirely
  const collectionDateLine = /^.*\b(odb[eě]r|collect|datum|sample|vzork|nasb[ií]r|drawn)\b.*$/gim;
  const protectedLines = new Set();
  let m;
  while ((m = collectionDateLine.exec(pdfText)) !== null) {
    protectedLines.add(m.index);
  }

  function isProtectedLine(matchIndex) {
    // Check if this match falls on a collection date line
    const lineStart = text.lastIndexOf('\n', matchIndex) + 1;
    return protectedLines.has(lineStart) || protectedLines.has(matchIndex);
  }

  // Phase 1 — Label-based: lines with PII-identifying labels
  const labelReplacements = [
    { pattern: /^(.*?\b(?:jm[eé]no|name|pacient|patient|p[rř][ií]jmen[ií]|surname)\b[:\s]+)(.+)$/gim, gen: () => fakeName(pdfSex) },
    { pattern: /^(.*?\b(?:adresa|address|bydli[sš]t[eě]|residence)\b[:\s]+)(.+)$/gim, gen: () => `${randomPick(FAKE_STREETS)}, ${randomPick(FAKE_CITIES)}` },
    { pattern: /^(.*?\b(?:datum\s*narozen|date\s*of\s*birth|nar(?:ozen[ií])?\.?)\b[:\s]+)(.+)$/gim, gen: () => fakeDate() },
    { pattern: /^(.*?\b(?:l[eé]ka[rř]|doctor|phy?sician|o[sš]et[rř]uj[ií]c[ií])\b\.?[:\s]+)(.+)$/gim, gen: () => randomPick(FAKE_DOCTORS) },
    { pattern: /^(.*?\b(?:rodn[eé]\s*[cč][ií]slo|birth\s*number|r[\.\s]?[cč][\.\s]?)\b[:\s]+)(.+)$/gim, gen: () => fakeBirthNumber() },
    { pattern: /^(.*?\b(?:[cč][ií]slo\s*(?:poji[sš]t[eě]n|insurance)|insurance\s*(?:no|number|id)|poji[sš][tť]ovna)\b[:\s]+)(.+)$/gim, gen: () => randomDigits(3) },
    { pattern: /^(.*?\b(?:id\s*pacienta|patient\s*id|[cč][ií]slo\s*pacienta)\b[:\s]+)(.+)$/gim, gen: () => fakePatientId() },
  ];

  for (const { pattern, gen } of labelReplacements) {
    text = text.replace(pattern, (match, label, value, offset) => {
      if (isProtectedLine(offset)) return match;
      replacements++;
      return label + gen();
    });
  }

  // Phase 2 — Pattern-based: anywhere in text
  // Czech/Slovak birth number (YYMMDD/XXXX)
  text = text.replace(/\b(\d{2})(0[1-9]|1[0-2]|5[1-9]|6[0-2])(0[1-9]|[12]\d|3[01])\/(\d{3,4})\b/g, (match, _y, _m, _d, _s, offset) => {
    if (isProtectedLine(offset)) return match;
    replacements++;
    return fakeBirthNumber();
  });

  // SSN (XXX-XX-XXXX)
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    replacements++;
    return `${randomDigits(3)}-${randomDigits(2)}-${randomDigits(4)}`;
  });

  // Email
  text = text.replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    replacements++;
    return fakeEmail();
  });

  // Phone numbers (international and local)
  // Require +country code OR leading tel/phone/fax label to avoid matching reference ranges like "150-380"
  text = text.replace(/(?:(?:\+\d{1,3}[\s-]?)\(?\d{2,3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}\b)|(?:(?:tel|phone|fax|mobil|telefon)\.?[\s:]+\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}\b)/gi, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    const lineStart = text.lastIndexOf('\n', offset) + 1;
    const lineEnd = text.indexOf('\n', offset);
    const line = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
    // Skip result lines and lines already handled by label-based phase (IDs, birth numbers)
    if (unitKeywords.test(line)) return match;
    if (/\b(id\s*pacienta|patient\s*id|rodn[eé]\s*[cč][ií]slo|birth\s*number|[cč][ií]slo\s*pacienta|i[cč]p)\b/i.test(line)) return match;
    replacements++;
    return fakePhone();
  });

  // Long digit sequences (8+ digits) on non-result lines — likely patient/sample IDs
  text = text.replace(/\b\d{8,}\b/g, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    const lineStart = text.lastIndexOf('\n', offset) + 1;
    const lineEnd = text.indexOf('\n', offset);
    const line = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
    if (unitKeywords.test(line)) return match;
    // Skip page headers
    if (/===\s*Page/i.test(line)) return match;
    replacements++;
    return randomDigits(match.length);
  });

  return { obfuscated: text, original, replacements };
}

// ═══════════════════════════════════════════════
// PII DIFF VIEWER (debug mode)
// ═══════════════════════════════════════════════
export function buildPIIDiffHTML(originalText, obfuscatedText) {
  const origLines = originalText.split('\n');
  const obfLines = obfuscatedText.split('\n');
  const maxLines = Math.max(origLines.length, obfLines.length);
  let leftHtml = '', rightHtml = '';
  for (let i = 0; i < maxLines; i++) {
    const origLine = origLines[i] || '';
    const obfLine = obfLines[i] || '';
    const changed = origLine !== obfLine;
    leftHtml += `<div class="${changed ? 'pii-diff-highlight-removed' : ''}">${escapeHTML(origLine) || '&nbsp;'}</div>`;
    rightHtml += `<div class="${changed ? 'pii-diff-highlight-added' : ''}">${escapeHTML(obfLine) || '&nbsp;'}</div>`;
  }
  return { leftHtml, rightHtml };
}

export function showPIIDiffViewer(originalText, obfuscatedText) {
  const overlay = document.createElement('div');
  overlay.className = 'pii-warning-overlay';
  const { leftHtml, rightHtml } = buildPIIDiffHTML(originalText, obfuscatedText);
  overlay.innerHTML = `
    <div class="pii-diff-modal">
      <button class="modal-close" onclick="this.closest('.pii-warning-overlay').remove()">&times;</button>
      <h3>&#128269; Privacy Diff — Before / After</h3>
      <div class="pii-diff-viewer">
        <div class="pii-diff-left"><div class="pii-diff-header">Original</div>${leftHtml}</div>
        <div class="pii-diff-right"><div class="pii-diff-header">Obfuscated</div>${rightHtml}</div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px">
        <button class="import-btn import-btn-secondary" onclick="this.closest('.pii-warning-overlay').remove()">Close</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
}

export function reviewPIIBeforeSend(originalText, { obfuscatedText, streamFn }) {
  return new Promise(resolve => {
    const isStreaming = typeof streamFn === 'function';
    const overlay = document.createElement('div');
    overlay.className = 'pii-warning-overlay';
    const { leftHtml } = buildPIIDiffHTML(originalText, obfuscatedText || originalText);
    const initialText = obfuscatedText ? escapeHTML(obfuscatedText) : '';
    overlay.innerHTML = `
      <div class="pii-diff-modal">
        <h3>&#128274; Review &amp; Edit — This is what AI will receive</h3>
        <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px">Personal information on the left has been replaced with fake data on the right. You can edit the right side to fix any remaining PII before sending.</p>
        <div class="pii-search-bar">
          <input type="text" class="pii-search-input" id="pii-search-input" placeholder="Search for your name, address, phone\u2026" autocomplete="off">
          <span class="pii-search-count" id="pii-search-count"></span>
        </div>
        <div class="pii-diff-viewer">
          <div class="pii-diff-left"><div class="pii-diff-header">Original (stays local)</div>${leftHtml}</div>
          <div class="pii-diff-right">
            <div class="pii-diff-header">Sent to AI (editable)</div>
            <textarea class="pii-edit-textarea" id="pii-edit-textarea" spellcheck="false"${isStreaming ? ' readonly' : ''}>${initialText}</textarea>
            ${isStreaming ? '<div class="pii-stream-status pii-stream-waiting" id="pii-stream-status">Waiting for model response\u2026</div>' : ''}
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px;flex-wrap:wrap">
          <button class="import-btn import-btn-secondary" id="pii-review-regex" title="Run regex-based obfuscation instead">Use regex instead</button>
          ${isStreaming ? '<button class="import-btn import-btn-secondary" id="pii-stream-stop">Stop</button>' : ''}
          <span style="flex:1"></span>
          <button class="import-btn import-btn-secondary" id="pii-review-cancel">Cancel Import</button>
          <button class="import-btn" id="pii-review-send"${isStreaming ? ' disabled' : ''}>Send to AI</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    const searchInput = overlay.querySelector('#pii-search-input');
    const searchCount = overlay.querySelector('#pii-search-count');
    const textarea = overlay.querySelector('#pii-edit-textarea');
    const sendBtn = overlay.querySelector('#pii-review-send');
    const statusEl = overlay.querySelector('#pii-stream-status');
    const stopBtn = overlay.querySelector('#pii-stream-stop');
    let dirty = false;

    // Search handler
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (!query || query.length < 2) {
        searchCount.textContent = '';
        searchCount.className = 'pii-search-count';
        return;
      }
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = textarea.value.match(regex);
      const total = matches ? matches.length : 0;
      if (total > 0) {
        searchCount.textContent = `${total} found \u2014 PII may still be present`;
        searchCount.className = 'pii-search-count pii-search-warn';
      } else {
        searchCount.textContent = 'Not found';
        searchCount.className = 'pii-search-count pii-search-clear';
      }
    });

    // Dirty flag — update button text when user edits
    textarea.addEventListener('input', () => {
      if (!dirty) { dirty = true; sendBtn.textContent = 'Save & Send to AI'; }
    });

    // Regex fallback button
    overlay.querySelector('#pii-review-regex').addEventListener('click', () => {
      const result = obfuscatePDFText(originalText);
      textarea.value = result.obfuscated;
      textarea.readOnly = false;
      sendBtn.disabled = false;
      if (statusEl) statusEl.textContent = `Regex applied \u2014 ${result.replacements} replacement${result.replacements !== 1 ? 's' : ''}`;
      if (stopBtn) stopBtn.style.display = 'none';
      if (abortController) { abortController.abort(); abortController = null; }
    });

    // Send & cancel
    sendBtn.addEventListener('click', () => { overlay.remove(); resolve(textarea.value); });
    overlay.querySelector('#pii-review-cancel').addEventListener('click', () => {
      if (abortController) abortController.abort();
      overlay.remove();
      resolve('cancel');
    });

    // Streaming mode
    let abortController = null;
    if (isStreaming) {
      abortController = new AbortController();

      // Stop button
      stopBtn.addEventListener('click', () => {
        abortController.abort();
        abortController = null;
        textarea.readOnly = false;
        sendBtn.disabled = false;
        statusEl.textContent = 'Stopped \u2014 review partial result and edit below';
        stopBtn.style.display = 'none';
      });

      // Start streaming
      let charCount = 0;
      let rafPending = false;
      let pendingText = '';

      const flushToTextarea = () => {
        if (pendingText) {
          textarea.value += pendingText;
          charCount += pendingText.length;
          pendingText = '';
          statusEl.classList.remove('pii-stream-waiting');
          statusEl.textContent = `Streaming\u2026 ${charCount.toLocaleString()} chars`;
          textarea.scrollTop = textarea.scrollHeight;
        }
        rafPending = false;
      };

      streamFn(
        (chunk) => {
          pendingText += chunk;
          if (!rafPending) { rafPending = true; requestAnimationFrame(flushToTextarea); }
        },
        abortController.signal
      ).then(() => {
        flushToTextarea();
        textarea.readOnly = false;
        sendBtn.disabled = false;
        if (statusEl) statusEl.textContent = `Complete \u2014 ${charCount.toLocaleString()} chars \u2014 review and edit below`;
        if (stopBtn) stopBtn.style.display = 'none';
      }).catch(err => {
        flushToTextarea();
        if (err.name === 'AbortError') return; // stop button already handled
        textarea.readOnly = false;
        sendBtn.disabled = false;
        if (statusEl) statusEl.textContent = `Error: ${err.message}`;
        if (stopBtn) stopBtn.style.display = 'none';
      });
    }
  });
}

Object.assign(window, { obfuscatePDFText, sanitizeWithOllama, sanitizeWithOllamaStreaming, checkOllamaPII, reviewPIIBeforeSend, getOllamaConfig, checkOllama, checkOpenAICompatible, showPIIDiffViewer, isOllamaPIIEnabled, setOllamaPIIEnabled });
