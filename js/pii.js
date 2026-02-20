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
  try { return JSON.parse(localStorage.getItem('labcharts-ollama')) || { url: 'http://localhost:11434', model: 'llama3.2' }; }
  catch { return { url: 'http://localhost:11434', model: 'llama3.2' }; }
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

export async function checkOllamaPII() {
  return checkOllama(getOllamaPIIUrl());
}

export function unloadOllamaPIIModel() {
  const piiUrl = getOllamaPIIUrl();
  const piiModel = getOllamaPIIModel();
  fetch(`${piiUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: piiModel, prompt: '', stream: false, keep_alive: 0 }),
    signal: AbortSignal.timeout(5000)
  }).catch(() => {});
}

export async function sanitizeWithOllama(pdfText) {
  const piiUrl = getOllamaPIIUrl();
  const piiModel = getOllamaPIIModel();
  const prompt = `TASK: Replace ONLY personal identifiers in this lab report. Output the FULL text with minimal changes.

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
${pdfText}`;
  try {
    const resp = await fetch(`${piiUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: piiModel, prompt, stream: false, keep_alive: 0 }),
      signal: AbortSignal.timeout(90000)
    });
    if (!resp.ok) throw new Error(`Ollama error: ${resp.status}`);
    const data = await resp.json();
    const result = (data.response || '').trim();

    // Validate output — if Ollama mangled the text, reject it
    if (!result) throw new Error('Ollama returned empty response');
    // Output should be at least 25% of input length (LLM shouldn't be summarizing)
    if (result.length < pdfText.length * 0.25) throw new Error(`Ollama output too short (${result.length} vs ${pdfText.length} chars)`);
    // Check that date-like patterns survived (YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY)
    const inputDates = pdfText.match(/\b\d{4}[-/.]\d{2}[-/.]\d{2}\b|\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/g) || [];
    const outputDates = result.match(/\b\d{4}[-/.]\d{2}[-/.]\d{2}\b|\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/g) || [];
    if (inputDates.length > 0 && outputDates.length === 0) throw new Error('Ollama lost all dates from the text');

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
  text = text.replace(/(?:\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}\b/g, (match, offset) => {
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

export function reviewPIIBeforeSend(originalText, obfuscatedText) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'pii-warning-overlay';
    const { leftHtml, rightHtml } = buildPIIDiffHTML(originalText, obfuscatedText);
    overlay.innerHTML = `
      <div class="pii-diff-modal">
        <h3>&#128274; Review — This is what AI will receive</h3>
        <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px">Personal information on the left has been replaced with fake data on the right. Verify no sensitive data remains before sending.</p>
        <div class="pii-diff-viewer">
          <div class="pii-diff-left"><div class="pii-diff-header">Original (stays local)</div>${leftHtml}</div>
          <div class="pii-diff-right"><div class="pii-diff-header">Sent to AI</div>${rightHtml}</div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
          <button class="import-btn import-btn-secondary" id="pii-review-cancel">Cancel Import</button>
          <button class="import-btn" id="pii-review-send">Send to AI</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    overlay.querySelector('#pii-review-send').addEventListener('click', () => { overlay.remove(); resolve('send'); });
    overlay.querySelector('#pii-review-cancel').addEventListener('click', () => { overlay.remove(); resolve('cancel'); });
  });
}

Object.assign(window, { obfuscatePDFText, sanitizeWithOllama, checkOllamaPII, reviewPIIBeforeSend, getOllamaConfig, checkOllama });
