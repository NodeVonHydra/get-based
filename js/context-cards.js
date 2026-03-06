// context-cards.js — 9 context card editors, summaries, health dots, interpretive lens

import { state } from './state.js';
import { COMMON_CONDITIONS, DIET_TYPES, DIET_RESTRICTIONS, DIET_PATTERNS, BOWEL_FREQUENCY, STOOL_CONSISTENCY, BLOATING_SEVERITY, GAS_SEVERITY, ACID_REFLUX, BURPING, NAUSEA, APPETITE, ABDOMINAL_PAIN, FOOD_SENSITIVITIES, EXERCISE_FREQ, EXERCISE_TYPES, EXERCISE_INTENSITY, DAILY_MOVEMENT, SLEEP_DURATIONS, SLEEP_QUALITY, SLEEP_SCHEDULE, SLEEP_ROOM_TEMP, SLEEP_ISSUES, SLEEP_ENVIRONMENT, SLEEP_PRACTICES, LIGHT_AM, LIGHT_DAYTIME, LIGHT_UV, LIGHT_EVENING, LIGHT_COLD, LIGHT_GROUNDING, LIGHT_SCREEN_TIME, LIGHT_TECH_ENV, LIGHT_MEAL_TIMING, STRESS_LEVELS, STRESS_SOURCES, STRESS_MGMT, LOVE_STATUS, LOVE_SATISFACTION, LOVE_LIBIDO, LOVE_FREQUENCY, LOVE_ORGASM, LOVE_RELATIONSHIP, LOVE_CONCERNS, ENV_SETTING, ENV_CLIMATE, ENV_WATER, ENV_WATER_CONCERNS, ENV_EMF, ENV_EMF_MITIGATION, ENV_HOME_LIGHT, ENV_AIR, ENV_TOXINS, ENV_BUILDING } from './constants.js';
import { escapeHTML, hashString, showNotification, hasCardContent } from './utils.js';
import { formatTime, getTimeFormat, parseTimeInput } from './theme.js';
import { saveImportedData, getActiveData } from './data.js';
import { getLatitudeFromLocation, profileStorageKey } from './profile.js';
import { callClaudeAPI, hasAIProvider } from './api.js';
import { getEMFSummary } from './emf.js';

// ── Context card summary generators ──

export function getConditionsSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.conditions && d.conditions.length) parts.push(d.conditions.map(c => {
    let s = c.name;
    if (c.severity && c.severity !== 'mild') s += ` (${c.severity})`;
    if (c.since) s += ` since ${c.since}`;
    return s;
  }).join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(' — ');
}

export function getDietSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.type) parts.push(d.type);
  if (d.pattern) parts.push(d.pattern);
  if (d.restrictions && d.restrictions.length) parts.push(d.restrictions.join(', '));
  if (d.breakfast) parts.push('B: ' + d.breakfast);
  if (d.lunch) parts.push('L: ' + d.lunch);
  if (d.dinner) parts.push('D: ' + d.dinner);
  if (d.snacks) parts.push('S: ' + d.snacks);
  if (d.bowelFrequency) parts.push(d.bowelFrequency);
  if (d.stoolConsistency) parts.push(d.stoolConsistency);
  if (d.bloating && d.bloating !== 'none') parts.push('bloating: ' + d.bloating);
  if (d.gas && d.gas !== 'none') parts.push('gas: ' + d.gas);
  if (d.acidReflux && d.acidReflux !== 'none') parts.push('reflux: ' + d.acidReflux);
  if (d.burping && d.burping !== 'none') parts.push('burping: ' + d.burping);
  if (d.nausea && d.nausea !== 'none') parts.push('nausea: ' + d.nausea);
  if (d.appetite && d.appetite !== 'normal') parts.push('appetite: ' + d.appetite);
  if (d.abdominalPain && d.abdominalPain !== 'none') parts.push('pain: ' + d.abdominalPain);
  if (d.foodSensitivities && d.foodSensitivities.length) parts.push('sensitivities: ' + d.foodSensitivities.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}

export function getExerciseSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.frequency) parts.push(d.frequency);
  if (d.types && d.types.length) parts.push(d.types.join(', '));
  if (d.intensity) parts.push(d.intensity);
  if (d.dailyMovement) parts.push(d.dailyMovement);
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}

export function getSleepSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.duration) parts.push(d.duration);
  if (d.quality) parts.push(d.quality + ' quality');
  if (d.schedule) parts.push(d.schedule);
  if (d.roomTemp) parts.push(d.roomTemp);
  if (d.issues && d.issues.length) parts.push(d.issues.join(', '));
  if (d.environment && d.environment.length) parts.push(d.environment.join(', '));
  if (d.practices && d.practices.length) parts.push(d.practices.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}

export function getLightCircadianSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.amLight) parts.push(d.amLight);
  if (d.daytime) parts.push(d.daytime);
  if (d.uvExposure) parts.push(d.uvExposure);
  if (d.evening && d.evening.length) parts.push(d.evening.join(', '));
  if (d.screenTime) parts.push(d.screenTime + ' screens');
  if (d.techEnv && d.techEnv.length) parts.push(d.techEnv.join(', '));
  if (d.cold) parts.push(d.cold);
  if (d.grounding) parts.push(d.grounding);
  if (d.mealTiming && d.mealTiming.length) parts.push(d.mealTiming.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}

export function getStressSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.level) parts.push(d.level + ' stress');
  if (d.sources && d.sources.length) parts.push(d.sources.join(', '));
  if (d.management && d.management.length) parts.push('manages: ' + d.management.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(' — ');
}

export function getLoveLifeSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.status) parts.push(d.status);
  if (d.relationship) parts.push(d.relationship);
  if (d.satisfaction) parts.push(d.satisfaction);
  if (d.libido) parts.push(d.libido + ' libido');
  if (d.frequency) parts.push(d.frequency);
  if (d.orgasm) parts.push('orgasm: ' + d.orgasm);
  if (d.concerns && d.concerns.length) parts.push(d.concerns.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}

export function getEnvironmentSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.setting) parts.push(d.setting);
  if (d.climate) parts.push(d.climate);
  if (d.water) parts.push(d.water);
  if (d.waterConcerns && d.waterConcerns.length) parts.push(d.waterConcerns.join(', '));
  if (d.emf && d.emf.length) parts.push(d.emf.length + ' EMF source' + (d.emf.length > 1 ? 's' : ''));
  if (d.emfMitigation && d.emfMitigation.length) parts.push(d.emfMitigation.length + ' EMF mitigation');
  if (d.homeLight) parts.push(d.homeLight);
  if (d.air && d.air.length) parts.push(d.air.join(', '));
  if (d.toxins && d.toxins.length) parts.push(d.toxins.length + ' toxin exposure' + (d.toxins.length > 1 ? 's' : ''));
  if (d.building) parts.push(d.building);
  if (d.note) parts.push(d.note);
  const emfSummary = getEMFSummary();
  if (emfSummary) parts.push(emfSummary);
  return parts.join(', ');
}

export function getGoalsSummary() {
  const healthGoals = state.importedData.healthGoals || [];
  if (healthGoals.length === 0) return '';
  const texts = healthGoals.slice(0, 3).map(g => g.text);
  const summary = texts.join(', ');
  if (healthGoals.length > 3) return summary + ` +${healthGoals.length - 3} more`;
  return summary;
}

export function isContextFilled(key) {
  if (key === 'healthGoals') return (state.importedData.healthGoals || []).length > 0;
  return state.importedData[key] != null;
}

export function renderProfileContextCards() {
  const cardDefs = [
    { key: 'healthGoals', emoji: '\uD83C\uDFAF', label: 'Health Goals', editor: 'openHealthGoalsEditor', tooltip: 'Define what you\'re trying to solve or improve. AI prioritizes analysis around your stated goals.', placeholder: 'Add health goals', summaryFn: getGoalsSummary },
    { key: 'diagnoses', emoji: '\uD83C\uDFE5', label: 'Medical Conditions', editor: 'openDiagnosesEditor', tooltip: 'Diagnoses directly affect how lab markers should be interpreted — what\'s abnormal for most may be expected for you.', placeholder: 'Add medical conditions', summaryFn: () => getConditionsSummary(state.importedData.diagnoses) },
    { key: 'diet', emoji: '\uD83E\uDD57', label: 'Diet & Digestion', editor: 'openDietEditor', tooltip: 'Nutrition and digestion directly affect blood markers — diet type impacts lipids, B12, iron; GI symptoms correlate with inflammation and nutrient absorption.', placeholder: 'Describe your diet & digestion', summaryFn: () => getDietSummary(state.importedData.diet) },
    { key: 'exercise', emoji: '\uD83C\uDFCB\uFE0F', label: 'Exercise', editor: 'openExerciseEditor', tooltip: 'Training type and intensity affect CK, liver enzymes, cholesterol, and inflammatory markers.', placeholder: 'Describe your routine', summaryFn: () => getExerciseSummary(state.importedData.exercise) },
    { key: 'sleepRest', emoji: '\uD83D\uDE34', label: 'Sleep & Rest', editor: 'openSleepRestEditor', tooltip: 'Sleep duration and quality directly affect inflammation, insulin sensitivity, cortisol, and immune function.', placeholder: 'Describe your sleep', summaryFn: () => getSleepSummary(state.importedData.sleepRest) },
    { key: 'lightCircadian', emoji: '\u2600\uFE0F', label: 'Light & Circadian', editor: 'openLightCircadianEditor', tooltip: 'Light, cold, grounding, screen time, and meal timing drive circadian rhythm, hormones, melatonin, cortisol, and metabolic health.', placeholder: 'Describe your light habits', summaryFn: () => getLightCircadianSummary(state.importedData.lightCircadian) },
    { key: 'stress', emoji: '\uD83E\uDDE0', label: 'Stress', editor: 'openStressEditor', tooltip: 'Chronic stress elevates cortisol, disrupts thyroid function, raises inflammation, and impairs immune response.', placeholder: 'Rate your stress level', summaryFn: () => getStressSummary(state.importedData.stress) },
    { key: 'loveLife', emoji: '\u2764\uFE0F', label: 'Love Life & Relationships', editor: 'openLoveLifeEditor', tooltip: 'Sexual health and relationships directly affect hormones (testosterone, estrogen, oxytocin, cortisol), immune function, and cardiovascular markers.', placeholder: 'Share your status', summaryFn: () => getLoveLifeSummary(state.importedData.loveLife) },
    { key: 'environment', emoji: '\uD83C\uDF0D', label: 'Environment', editor: 'openEnvironmentEditor', tooltip: 'Water quality, EMF exposure, air quality, toxins, and building materials shape mitochondrial function, inflammation, hormones, and oxidative stress.', placeholder: 'Describe your environment', summaryFn: () => getEnvironmentSummary(state.importedData.environment) },
  ];
  const filledCount = cardDefs.filter(c => isContextFilled(c.key)).length;
  const _ccData = getActiveData();
  const _ccHasLabs = _ccData.dates.length > 0 || Object.values(_ccData.categories).some(c => c.singleDate);
  const _ccMissingDemo = (!state.profileSex || !state.profileDob);
  const _ccDemoHint = _ccMissingDemo ? ' Set your sex and date of birth in Settings too \u2014 they shape which panels matter most.' : '';
  let _ccSubtitle = '';
  if (!_ccHasLabs && filledCount === 0) {
    _ccSubtitle = `<div class="context-section-subtitle">Fill all 9 cards and the AI can recommend exactly which labs to get \u2014 and why.${_ccDemoHint}</div>`;
  } else if (!_ccHasLabs && filledCount < cardDefs.length) {
    _ccSubtitle = `<div class="context-section-subtitle">The more you fill in, the better the recommendations \u2014 try to complete all 9, then open the chat.${_ccDemoHint}</div>`;
  } else if (!_ccHasLabs) {
    _ccSubtitle = `<div class="context-section-subtitle">${_ccMissingDemo ? 'Set your sex and date of birth in Settings, then open' : 'All filled \u2014 open'} the chat to get personalized test recommendations based on your profile.</div>`;
  }
  let html = `<div style="margin-top:16px"><span class="context-section-title">What your GP won't ask you (${filledCount}/${cardDefs.length} filled)</span>${_ccSubtitle}</div>`;
  html += `<div class="profile-context-cards">`;
  for (const c of cardDefs) {
    const filled = isContextFilled(c.key);
    const summary = c.summaryFn();
    html += `<div class="context-card" onclick="${c.editor}()">
      <div class="context-card-header">
        <span class="ctx-health-dot ctx-health-dot-gray" id="ctx-dot-${c.key}"></span>
        <span class="context-card-label">${c.emoji} ${c.label}</span>
        <span class="context-info-icon">i<span class="context-tooltip">${c.tooltip}</span></span>
        <button class="diagnoses-edit-btn" onclick="event.stopPropagation();${c.editor}()">${filled ? 'Edit' : '+ Add'}</button>
      </div>
      ${summary
        ? `<div class="context-card-body">${escapeHTML(summary)}</div>`
        : `<div class="context-card-placeholder">${c.placeholder}</div>`}
      <div class="ctx-ai-summary" id="ctx-ai-${c.key}"></div>
    </div>`;
  }
  html += `</div>`;
  // Additional Notes textarea
  const notes = state.importedData.contextNotes || '';
  html += `<div class="ctx-notes-section">
    <textarea class="ctx-notes-textarea" id="ctx-notes-textarea" placeholder="Additional notes for AI context (anything else that might affect your labs...)" oninput="debounceContextNotes()">${escapeHTML(notes)}</textarea>
  </div>`;
  return html;
}

let _ctxNotesTimer = null;
export function debounceContextNotes() {
  clearTimeout(_ctxNotesTimer);
  _ctxNotesTimer = setTimeout(() => {
    const ta = document.getElementById('ctx-notes-textarea');
    if (ta) {
      state.importedData.contextNotes = ta.value;
      saveImportedData();
    }
  }, 500);
}

// ── AI Health Status Dots ──

export function applyDotColor(key, color) {
  const dot = document.getElementById('ctx-dot-' + key);
  if (!dot) return;
  dot.className = 'ctx-health-dot ctx-health-dot-' + color;
  const dotLabels = { green: 'Good', yellow: 'Caution', red: 'Concern', gray: 'Not rated' };
  dot.title = dotLabels[color] || '';
  dot.setAttribute('aria-label', dotLabels[color] || '');
}

export function applyAISummary(key, text, color) {
  const el = document.getElementById('ctx-ai-' + key);
  if (!el) return;
  el.classList.remove('ctx-ai-summary-green', 'ctx-ai-summary-yellow', 'ctx-ai-summary-red');
  if (text) {
    const prefixes = { green: '\u2713 ', yellow: '\u26A0 ', red: '\u25B2 ' };
    el.textContent = (prefixes[color] || '') + text;
    el.classList.add('ctx-ai-summary-visible');
    if (color && color !== 'gray') el.classList.add('ctx-ai-summary-' + color);
  } else {
    el.textContent = '';
    el.classList.remove('ctx-ai-summary-visible');
  }
}

export function getCardFingerprint(key) {
  const labPart = (state.importedData.entries || []).map(e => {
    const m = e.markers || {};
    return e.date + ':' + hashString(JSON.stringify(m));
  }).join(',');
  const val = key === 'healthGoals' ? JSON.stringify(state.importedData.healthGoals || []) : JSON.stringify(state.importedData[key] || null);
  const shared = (state.importedData.contextNotes || '') + '|' + (state.importedData.interpretiveLens || '');
  return hashString(labPart + '|' + val + '|' + shared + '|' + (state.profileSex || '') + '|' + (state.profileDob || ''));
}

export async function loadContextHealthDots() {
  if (!hasAIProvider()) return;
  const keys = ['healthGoals', 'diagnoses', 'diet', 'exercise', 'sleepRest', 'lightCircadian', 'stress', 'loveLife', 'environment'];
  const cacheKey = profileStorageKey(state.currentProfile, 'contextHealth');
  let cached;
  try { cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch(e) { cached = null; }
  if (!cached || !cached.dots) cached = { dots: {}, fingerprints: {} };

  if (!cached.summaries) cached.summaries = {};

  // Determine which cards need re-fetching
  const staleKeys = [];
  for (const k of keys) {
    let fp;
    try { fp = getCardFingerprint(k); } catch(e) { staleKeys.push(k); continue; }
    if (cached.fingerprints && cached.fingerprints[k] === fp && cached.dots[k] && cached.summaries[k] !== undefined) {
      applyDotColor(k, cached.dots[k]);
      if (cached.summaries[k]) applyAISummary(k, cached.summaries[k], cached.dots[k]);
    } else {
      staleKeys.push(k);
    }
  }
  if (staleKeys.length === 0) return;

  // Show shimmer only on stale cards
  for (const k of staleKeys) {
    const dot = document.getElementById('ctx-dot-' + k);
    if (dot) dot.classList.add('ctx-health-dot-shimmer');
    const aiEl = document.getElementById('ctx-ai-' + k);
    if (aiEl) { aiEl.textContent = ''; aiEl.classList.remove('ctx-ai-summary-visible'); }
  }
  // If none of the stale cards have actual content, keep dots gray (nothing to assess)
  const _staleHaveContent = staleKeys.some(k => {
    if (k === 'healthGoals') return (state.importedData.healthGoals || []).length > 0;
    return hasCardContent(state.importedData[k]);
  });
  if (!_staleHaveContent) {
    // Also check if there's lab data — if there is, the AI can still rate cards
    const _dotData = getActiveData();
    const _dotHasLabs = _dotData.dates.length > 0 || Object.values(_dotData.categories).some(c => c.singleDate);
    if (!_dotHasLabs) {
      for (const k of staleKeys) applyDotColor(k, 'gray');
      return;
    }
  }
  const ctx = window.buildLabContext();
  const exampleObj = {};
  for (const k of staleKeys) exampleObj[k] = {"dot":"...","tip":"..."};
  const exampleJSON = JSON.stringify(exampleObj);
  const prompt = `Based on this person's lab data and profile context, assess each profile area. Return ONLY valid JSON with these keys, each having "dot" (green/yellow/red/gray) and "tip" (max 8 words — a brief, specific insight referencing their actual lab markers):
${exampleJSON}

Dot colors: green = supports health, yellow = needs attention, red = concerning, gray = not enough info.
Tips must be concise (8 words max, e.g. "Low D may link to limited sun" not "Consider improving this area"). Reference specific markers. If no data, use gray dot and empty tip.`;
  try {
    const result = await Promise.race([
      callClaudeAPI({ system: prompt, messages: [{ role: 'user', content: ctx }], maxTokens: 500 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 20000))
    ]);
    const text = (result && typeof result === 'object') ? (result.text || '') : (typeof result === 'string' ? result : '');
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      let parsed;
      try { parsed = JSON.parse(jsonMatch[0]); } catch(e) {
        // JSON parse failed — apply gray dots only to stale keys, preserve cached good keys
        for (const k of staleKeys) applyDotColor(k, 'gray');
        try { localStorage.setItem(cacheKey, JSON.stringify(cached)); } catch(e2) {}
        return;
      }
      if (!cached.fingerprints) cached.fingerprints = {};
      for (const k of staleKeys) {
        const entry = parsed[k] || {};
        const color = (typeof entry === 'string')
          ? (['green', 'yellow', 'red', 'gray'].includes(entry) ? entry : 'gray')
          : (['green', 'yellow', 'red', 'gray'].includes(entry.dot) ? entry.dot : 'gray');
        const tip = (typeof entry === 'object' && entry.tip) ? entry.tip : '';
        applyDotColor(k, color);
        applyAISummary(k, tip, color);
        cached.dots[k] = color;
        cached.summaries[k] = tip;
        cached.fingerprints[k] = getCardFingerprint(k);
      }
      try { localStorage.setItem(cacheKey, JSON.stringify(cached)); } catch(e) {}
    } else {
      // No JSON in response — apply gray dots so shimmer doesn't stay forever
      for (const k of staleKeys) applyDotColor(k, 'gray');
    }
  } catch(e) {
    for (const k of staleKeys) applyDotColor(k, 'gray');
  }
}

// ═══════════════════════════════════════════════
// CONTEXT CARD EDITOR HELPERS
// ═══════════════════════════════════════════════

export function renderSelectField(label, id, options, current) {
  return `<div class="ctx-field-group"><label class="ctx-field-label">${label}</label>
    <div class="ctx-btn-group" id="${id}">
      ${options.map(o => `<button type="button" class="ctx-btn-option${current === o ? ' active' : ''}" onclick="selectCtxOption(this,'${id}')">${escapeHTML(o)}</button>`).join('')}
    </div></div>`;
}

export function selectCtxOption(btn, groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const wasActive = btn.classList.contains('active');
  group.querySelectorAll('.ctx-btn-option').forEach(b => b.classList.remove('active'));
  if (!wasActive) btn.classList.add('active');
}

export function getSelectedOption(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return null;
  const active = group.querySelector('.ctx-btn-option.active');
  return active ? active.textContent : null;
}

export function renderTagsField(label, id, options, selected) {
  const sel = selected || [];
  return `<div class="ctx-field-group"><label class="ctx-field-label">${label}</label>
    <div class="ctx-tags" id="${id}">
      ${options.map(o => `<button type="button" class="ctx-tag${sel.includes(o) ? ' active' : ''}" onclick="toggleCtxTag(this)">${escapeHTML(o)}</button>`).join('')}
    </div></div>`;
}

export function toggleCtxTag(btn) { btn.classList.toggle('active'); }

export function getSelectedTags(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return [];
  return Array.from(el.querySelectorAll('.ctx-tag.active')).map(b => b.textContent);
}

export function renderNoteField(value) {
  return `<div class="ctx-field-group"><label class="ctx-field-label">Notes</label>
    <input type="text" class="ctx-note-input" id="ctx-note-input" placeholder="Anything else..." value="${escapeHTML(value || '')}"></div>`;
}

export function contextEditorActions(hasCurrent, saveFn, clearFn) {
  return `<div class="ctx-editor-actions">
    <button class="import-btn import-btn-primary" onclick="${saveFn}()">Save</button>
    <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
    ${hasCurrent ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="${clearFn}()">Clear</button>` : ''}
  </div>`;
}

export function saveAndRefresh(msg) {
  saveImportedData();
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(msg, 'success');
}

function getTimePlaceholder() {
  return getTimeFormat() === '24h' ? 'HH:MM' : 'H:MM AM';
}

// ═══════════════════════════════════════════════
// DIAGNOSES / MEDICAL CONDITIONS
// ═══════════════════════════════════════════════

export function openDiagnosesEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.diagnoses || { conditions: [], note: '' };
  renderDiagnosesModal(modal, current);
  overlay.classList.add("show");
}

export function renderDiagnosesModal(modal, current) {
  const conditions = current.conditions || [];
  let html = `<button class="modal-close" onclick="closeDiagnoses()">&times;</button>
    <h3>Medical Conditions</h3>
    <div class="modal-unit">Add diagnosed conditions. The AI will consider these when interpreting your labs.</div>`;
  if (conditions.length > 0) {
    html += `<div class="ctx-conditions-list" id="ctx-conditions-list">`;
    for (let i = 0; i < conditions.length; i++) {
      const c = conditions[i];
      html += `<div class="ctx-condition-item">
        <span class="ctx-condition-name">${escapeHTML(c.name)}</span>
        ${c.severity ? `<span class="goals-severity-badge severity-${c.severity}">${c.severity}</span>` : ''}
        ${c.since ? `<span class="ctx-condition-since">since ${escapeHTML(c.since)}</span>` : ''}
        <button class="goals-delete-btn" onclick="deleteCondition(${i})">&times;</button>
      </div>`;
    }
    html += `</div>`;
  }
  html += `<div class="ctx-field-group"><label class="ctx-field-label">Add condition</label>
    <div class="ctx-add-condition">
      <div class="ctx-autocomplete-wrapper">
        <input type="text" class="ctx-note-input" id="condition-input" placeholder="Type condition name..." oninput="filterConditionSuggestions()" onfocus="filterConditionSuggestions()">
        <div class="ctx-suggestions" id="condition-suggestions"></div>
      </div>
      <input type="text" class="ctx-note-input" id="condition-since" placeholder="Since (e.g. 2020)" style="width:100px">
      <button class="import-btn import-btn-primary" onclick="addCondition()">Add</button>
    </div>
    <div class="ctx-btn-group" id="condition-severity" style="margin-top:8px">
      <button type="button" class="ctx-btn-option active" onclick="selectCtxOption(this,'condition-severity')">major</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'condition-severity')">mild</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'condition-severity')">minor</button>
    </div>
  </div>`;
  html += renderNoteField(current.note);
  const hasCurrent = conditions.length > 0 || current.note;
  html += `<div class="ctx-editor-actions">
    <button class="import-btn import-btn-primary" onclick="saveDiagnoses()">Save</button>
    <button class="import-btn import-btn-secondary" onclick="closeDiagnoses()">Cancel</button>
    ${hasCurrent ? '<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearDiagnoses()">Clear</button>' : ''}
  </div>`;
  modal.innerHTML = html;
  setTimeout(() => {
    const input = document.getElementById('condition-input');
    if (input) {
      input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addCondition(); } };
    }
    document.removeEventListener('click', closeSuggestionsOnClickOutside);
    document.addEventListener('click', closeSuggestionsOnClickOutside);
  }, 50);
}

export function filterConditionSuggestions() {
  const input = document.getElementById('condition-input');
  const container = document.getElementById('condition-suggestions');
  if (!input || !container) return;
  const val = input.value.toLowerCase().trim();
  const existing = (state.importedData.diagnoses && state.importedData.diagnoses.conditions || []).map(c => c.name.toLowerCase());
  const matches = val ? COMMON_CONDITIONS.filter(c => c.toLowerCase().includes(val) && !existing.includes(c.toLowerCase())) : COMMON_CONDITIONS.filter(c => !existing.includes(c.toLowerCase()));
  if (matches.length === 0 || !val) { container.innerHTML = ''; return; }
  container.innerHTML = matches.slice(0, 8).map(m => `<div class="ctx-suggestion-item" onmousedown="selectConditionSuggestion('${escapeHTML(m)}')">${escapeHTML(m)}</div>`).join('');
}

export function selectConditionSuggestion(name) {
  const input = document.getElementById('condition-input');
  if (input) input.value = name;
  const container = document.getElementById('condition-suggestions');
  if (container) container.innerHTML = '';
}

export function closeSuggestionsOnClickOutside(e) {
  const container = document.getElementById('condition-suggestions');
  const input = document.getElementById('condition-input');
  if (container && input && !input.contains(e.target) && !container.contains(e.target)) {
    container.innerHTML = '';
  }
}

export function syncDiagnosesNote() {
  const noteEl = document.getElementById('ctx-note-input');
  if (noteEl && state.importedData.diagnoses) state.importedData.diagnoses.note = noteEl.value.trim();
}

export function addCondition() {
  const input = document.getElementById('condition-input');
  const severity = getSelectedOption('condition-severity') || 'mild';
  const since = document.getElementById('condition-since');
  const name = input ? input.value.trim() : '';
  if (!name) return;
  syncDiagnosesNote();
  if (!state.importedData.diagnoses) state.importedData.diagnoses = { conditions: [], note: '' };
  const cond = { name, severity };
  if (since && since.value.trim()) cond.since = since.value.trim();
  state.importedData.diagnoses.conditions.push(cond);
  saveImportedData();
  renderDiagnosesModal(document.getElementById("detail-modal"), state.importedData.diagnoses);
}

export function deleteCondition(idx) {
  if (!state.importedData.diagnoses || !state.importedData.diagnoses.conditions) return;
  syncDiagnosesNote();
  state.importedData.diagnoses.conditions.splice(idx, 1);
  saveImportedData();
  renderDiagnosesModal(document.getElementById("detail-modal"), state.importedData.diagnoses);
}

export function saveDiagnoses() {
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!state.importedData.diagnoses) state.importedData.diagnoses = { conditions: [], note: '' };
  state.importedData.diagnoses.note = note.trim();
  if (state.importedData.diagnoses.conditions.length === 0 && !state.importedData.diagnoses.note) {
    state.importedData.diagnoses = null;
  }
  saveAndRefresh('Medical conditions saved');
}

export function closeDiagnoses() {
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
}

export function clearDiagnoses() {
  state.importedData.diagnoses = null;
  saveAndRefresh('Medical conditions cleared');
}

// ═══════════════════════════════════════════════
// DIET
// ═══════════════════════════════════════════════

export function openDietEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.diet || { type: null, restrictions: [], pattern: null, breakfast: '', lunch: '', dinner: '', snacks: '', note: '', bowelFrequency: null, stoolConsistency: null, bloating: null, gas: null, acidReflux: null, burping: null, nausea: null, appetite: null, abdominalPain: null, foodSensitivities: [] };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Diet & Digestion</h3>
    <div class="modal-unit">Describe your typical diet and digestive health. The AI will factor this in when interpreting your labs.</div>
    ${renderSelectField('Diet type', 'diet-type', DIET_TYPES, current.type)}
    ${renderSelectField('Eating pattern', 'diet-pattern', DIET_PATTERNS, current.pattern)}
    ${renderTagsField('Restrictions', 'diet-restrictions', DIET_RESTRICTIONS, current.restrictions)}
    <div class="ctx-editor-divider"></div>
    <div class="ctx-field-group"><label class="ctx-field-label">Typical meals</label>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-breakfast-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.breakfastTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-breakfast" placeholder="Breakfast — e.g. eggs, avocado, coffee" value="${escapeHTML(current.breakfast || '')}"></div>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-lunch-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.lunchTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-lunch" placeholder="Lunch — e.g. salad with grilled chicken" value="${escapeHTML(current.lunch || '')}"></div>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-dinner-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.dinnerTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-dinner" placeholder="Dinner — e.g. salmon, rice, vegetables" value="${escapeHTML(current.dinner || '')}"></div>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-snacks-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.snacksTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-snacks" placeholder="Snacks — e.g. nuts, fruit, dark chocolate" value="${escapeHTML(current.snacks || '')}"></div>
    </div>
    <div class="ctx-editor-divider"></div>
    <div class="ctx-field-group"><label class="ctx-field-label">Digestion</label></div>
    ${renderSelectField('Bowel frequency', 'diet-bowel', BOWEL_FREQUENCY, current.bowelFrequency || null)}
    ${renderSelectField('Stool consistency', 'diet-stool', STOOL_CONSISTENCY, current.stoolConsistency || null)}
    ${renderSelectField('Bloating', 'diet-bloating', BLOATING_SEVERITY, current.bloating || null)}
    ${renderSelectField('Gas', 'diet-gas', GAS_SEVERITY, current.gas || null)}
    ${renderSelectField('Acid reflux', 'diet-reflux', ACID_REFLUX, current.acidReflux || null)}
    ${renderSelectField('Burping', 'diet-burping', BURPING, current.burping || null)}
    ${renderSelectField('Nausea', 'diet-nausea', NAUSEA, current.nausea || null)}
    ${renderSelectField('Appetite', 'diet-appetite', APPETITE, current.appetite || null)}
    ${renderSelectField('Abdominal pain', 'diet-abdpain', ABDOMINAL_PAIN, current.abdominalPain || null)}
    ${renderTagsField('Food sensitivities', 'diet-sensitivities', FOOD_SENSITIVITIES, current.foodSensitivities || [])}
    ${renderNoteField(current.note)}
    ${contextEditorActions(state.importedData.diet != null, 'saveDiet', 'clearDiet')}`;
  overlay.classList.add("show");
}

export function saveDiet() {
  const type = getSelectedOption('diet-type');
  const pattern = getSelectedOption('diet-pattern');
  const restrictions = getSelectedTags('diet-restrictions');
  const breakfast = (document.getElementById('diet-breakfast') || {}).value || '';
  const breakfastTime = parseTimeInput((document.getElementById('diet-breakfast-time') || {}).value || '');
  const lunch = (document.getElementById('diet-lunch') || {}).value || '';
  const lunchTime = parseTimeInput((document.getElementById('diet-lunch-time') || {}).value || '');
  const dinner = (document.getElementById('diet-dinner') || {}).value || '';
  const dinnerTime = parseTimeInput((document.getElementById('diet-dinner-time') || {}).value || '');
  const snacks = (document.getElementById('diet-snacks') || {}).value || '';
  const snacksTime = parseTimeInput((document.getElementById('diet-snacks-time') || {}).value || '');
  const bowelFrequency = getSelectedOption('diet-bowel');
  const stoolConsistency = getSelectedOption('diet-stool');
  const bloating = getSelectedOption('diet-bloating');
  const gas = getSelectedOption('diet-gas');
  const acidReflux = getSelectedOption('diet-reflux');
  const burping = getSelectedOption('diet-burping');
  const nausea = getSelectedOption('diet-nausea');
  const appetite = getSelectedOption('diet-appetite');
  const abdominalPain = getSelectedOption('diet-abdpain');
  const foodSensitivities = getSelectedTags('diet-sensitivities');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!type && !pattern && restrictions.length === 0 && !breakfast.trim() && !lunch.trim() && !dinner.trim() && !snacks.trim() && !bowelFrequency && !stoolConsistency && !bloating && !gas && !acidReflux && !burping && !nausea && !appetite && !abdominalPain && foodSensitivities.length === 0 && !note.trim()) {
    state.importedData.diet = null;
  } else {
    state.importedData.diet = { type, restrictions, pattern, breakfast: breakfast.trim(), breakfastTime, lunch: lunch.trim(), lunchTime, dinner: dinner.trim(), dinnerTime, snacks: snacks.trim(), snacksTime, bowelFrequency, stoolConsistency, bloating, gas, acidReflux, burping, nausea, appetite, abdominalPain, foodSensitivities, note: note.trim() };
  }
  saveAndRefresh('Diet & Digestion saved');
}

export function clearDiet() {
  state.importedData.diet = null;
  saveAndRefresh('Diet & Digestion cleared');
}

// ═══════════════════════════════════════════════
// SLEEP & REST
// ═══════════════════════════════════════════════

export function openSleepRestEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.sleepRest || { duration: null, quality: null, schedule: null, roomTemp: null, issues: [], environment: [], practices: [], note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Sleep & Rest</h3>
    <div class="modal-unit">Sleep is when the body repairs. Duration, temperature, darkness, and EMF exposure all affect hormones, inflammation, and recovery.</div>
    ${renderSelectField('Duration', 'sleep-duration', SLEEP_DURATIONS, current.duration)}
    ${renderSelectField('Quality', 'sleep-quality', SLEEP_QUALITY, current.quality)}
    ${renderSelectField('Schedule', 'sleep-schedule', SLEEP_SCHEDULE, current.schedule)}
    ${renderSelectField('Room temperature', 'sleep-temp', SLEEP_ROOM_TEMP, current.roomTemp)}
    ${renderTagsField('Sleep issues', 'sleep-issues', SLEEP_ISSUES, current.issues)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('Sleep environment', 'sleep-env', SLEEP_ENVIRONMENT, current.environment)}
    ${renderTagsField('Sleep practices', 'sleep-practices', SLEEP_PRACTICES, current.practices)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(state.importedData.sleepRest != null, 'saveSleepRest', 'clearSleepRest')}`;
  overlay.classList.add("show");
}

export function saveSleepRest() {
  const duration = getSelectedOption('sleep-duration');
  const quality = getSelectedOption('sleep-quality');
  const schedule = getSelectedOption('sleep-schedule');
  const roomTemp = getSelectedOption('sleep-temp');
  const issues = getSelectedTags('sleep-issues');
  const environment = getSelectedTags('sleep-env');
  const practices = getSelectedTags('sleep-practices');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!duration && !quality && !schedule && !roomTemp && issues.length === 0 && environment.length === 0 && practices.length === 0 && !note.trim()) {
    state.importedData.sleepRest = null;
  } else {
    state.importedData.sleepRest = { duration, quality, schedule, roomTemp, issues, environment, practices, note: note.trim() };
  }
  saveAndRefresh('Sleep saved');
}

export function clearSleepRest() {
  state.importedData.sleepRest = null;
  saveAndRefresh('Sleep cleared');
}

// ═══════════════════════════════════════════════
// LIGHT & CIRCADIAN
// ═══════════════════════════════════════════════

export function openLightCircadianEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.lightCircadian || { amLight: null, daytime: null, uvExposure: null, evening: [], screenTime: null, techEnv: [], cold: null, grounding: null, mealTiming: [], note: '' };
  const lat = getLatitudeFromLocation();
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Light & Circadian</h3>
    <div class="modal-unit">Light is the #1 circadian signal. Morning light sets cortisol, UV drives vitamin D and hormones, cold and grounding affect mitochondrial function.</div>
    ${renderSelectField('Morning light', 'light-am', LIGHT_AM, current.amLight)}
    ${renderSelectField('Daytime outdoor exposure', 'light-daytime', LIGHT_DAYTIME, current.daytime)}
    ${renderSelectField('UV / sun exposure', 'light-uv', LIGHT_UV, current.uvExposure)}
    ${renderTagsField('Evening light discipline', 'light-evening', LIGHT_EVENING, current.evening)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Daily screen time', 'light-screen', LIGHT_SCREEN_TIME, current.screenTime)}
    ${renderTagsField('Technology environment', 'light-tech', LIGHT_TECH_ENV, current.techEnv)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Cold exposure', 'light-cold', LIGHT_COLD, current.cold)}
    ${renderSelectField('Grounding / earthing', 'light-grounding', LIGHT_GROUNDING, current.grounding)}
    ${renderTagsField('Meal timing signals', 'light-meal', LIGHT_MEAL_TIMING, current.mealTiming)}
    ${lat ? `<div style="font-size:12px;color:var(--text-muted);margin-top:8px">📍 Latitude: <strong style="color:var(--text-primary)">${escapeHTML(lat)}</strong> <span style="font-size:11px">(from Settings → Location)</span></div>` : `<div style="font-size:12px;color:var(--text-muted);margin-top:8px">💡 Set your country in Settings → Profile for automatic latitude detection</div>`}
    ${renderNoteField(current.note)}
    ${contextEditorActions(state.importedData.lightCircadian != null, 'saveLightCircadian', 'clearLightCircadian')}`;
  overlay.classList.add("show");
}

export function saveLightCircadian() {
  const amLight = getSelectedOption('light-am');
  const daytime = getSelectedOption('light-daytime');
  const uvExposure = getSelectedOption('light-uv');
  const evening = getSelectedTags('light-evening');
  const screenTime = getSelectedOption('light-screen');
  const techEnv = getSelectedTags('light-tech');
  const cold = getSelectedOption('light-cold');
  const grounding = getSelectedOption('light-grounding');
  const mealTiming = getSelectedTags('light-meal');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!amLight && !daytime && !uvExposure && evening.length === 0 && !screenTime && techEnv.length === 0 && !cold && !grounding && mealTiming.length === 0 && !note.trim()) {
    state.importedData.lightCircadian = null;
  } else {
    state.importedData.lightCircadian = { amLight, daytime, uvExposure, evening, screenTime, techEnv, cold, grounding, mealTiming, note: note.trim() };
  }
  saveAndRefresh('Light & circadian saved');
}

export function clearLightCircadian() {
  state.importedData.lightCircadian = null;
  saveAndRefresh('Light & circadian cleared');
}

// ═══════════════════════════════════════════════
// EXERCISE
// ═══════════════════════════════════════════════

export function openExerciseEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.exercise || { frequency: null, types: [], intensity: null, dailyMovement: null, note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Exercise & Movement</h3>
    <div class="modal-unit">Describe your exercise routine. The AI considers this when interpreting your labs.</div>
    ${renderSelectField('Frequency', 'exercise-freq', EXERCISE_FREQ, current.frequency)}
    ${renderTagsField('Types', 'exercise-types', EXERCISE_TYPES, current.types)}
    ${renderSelectField('Intensity', 'exercise-intensity', EXERCISE_INTENSITY, current.intensity)}
    ${renderSelectField('Daily movement', 'exercise-movement', DAILY_MOVEMENT, current.dailyMovement)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(state.importedData.exercise != null, 'saveExercise', 'clearExercise')}`;
  overlay.classList.add("show");
}

export function saveExercise() {
  const frequency = getSelectedOption('exercise-freq');
  const types = getSelectedTags('exercise-types');
  const intensity = getSelectedOption('exercise-intensity');
  const dailyMovement = getSelectedOption('exercise-movement');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!frequency && types.length === 0 && !intensity && !dailyMovement && !note.trim()) {
    state.importedData.exercise = null;
  } else {
    state.importedData.exercise = { frequency, types, intensity, dailyMovement, note: note.trim() };
  }
  saveAndRefresh('Exercise saved');
}

export function clearExercise() {
  state.importedData.exercise = null;
  saveAndRefresh('Exercise cleared');
}

// ═══════════════════════════════════════════════
// STRESS
// ═══════════════════════════════════════════════

export function openStressEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.stress || { level: null, sources: [], management: [], note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Stress</h3>
    <div class="modal-unit">Chronic stress elevates cortisol, disrupts thyroid, raises inflammation, and impairs immunity.</div>
    ${renderSelectField('Stress level', 'stress-level', STRESS_LEVELS, current.level)}
    ${renderTagsField('Sources', 'stress-sources', STRESS_SOURCES, current.sources)}
    ${renderTagsField('Management', 'stress-mgmt', STRESS_MGMT, current.management)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(state.importedData.stress != null, 'saveStress', 'clearStress')}`;
  overlay.classList.add("show");
}

export function saveStress() {
  const level = getSelectedOption('stress-level');
  const sources = getSelectedTags('stress-sources');
  const management = getSelectedTags('stress-mgmt');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!level && sources.length === 0 && management.length === 0 && !note.trim()) {
    state.importedData.stress = null;
  } else {
    state.importedData.stress = { level, sources, management, note: note.trim() };
  }
  saveAndRefresh('Stress profile saved');
}

export function clearStress() {
  state.importedData.stress = null;
  saveAndRefresh('Stress profile cleared');
}

// ═══════════════════════════════════════════════
// LOVE LIFE
// ═══════════════════════════════════════════════

export function openLoveLifeEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.loveLife || { status: null, satisfaction: null, relationship: null, libido: null, frequency: null, orgasm: null, concerns: [], note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Love Life</h3>
    <div class="modal-unit">Sexual health and relationships directly affect hormones (testosterone, estrogen, oxytocin, cortisol), immune function, and cardiovascular markers.</div>
    ${renderSelectField('Relationship status', 'love-status', LOVE_STATUS, current.status)}
    ${renderSelectField('Relationship quality', 'love-relationship', LOVE_RELATIONSHIP, current.relationship)}
    ${renderSelectField('Overall satisfaction', 'love-satisfaction', LOVE_SATISFACTION, current.satisfaction)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Libido', 'love-libido', LOVE_LIBIDO, current.libido)}
    ${renderSelectField('Sexual frequency', 'love-frequency', LOVE_FREQUENCY, current.frequency)}
    ${renderSelectField('Orgasm', 'love-orgasm', LOVE_ORGASM, current.orgasm)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('Concerns', 'love-concerns', LOVE_CONCERNS, current.concerns)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(state.importedData.loveLife != null, 'saveLoveLife', 'clearLoveLife')}`;
  overlay.classList.add("show");
}

export function saveLoveLife() {
  const status = getSelectedOption('love-status');
  const relationship = getSelectedOption('love-relationship');
  const satisfaction = getSelectedOption('love-satisfaction');
  const libido = getSelectedOption('love-libido');
  const frequency = getSelectedOption('love-frequency');
  const orgasm = getSelectedOption('love-orgasm');
  const concerns = getSelectedTags('love-concerns');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!status && !relationship && !satisfaction && !libido && !frequency && !orgasm && concerns.length === 0 && !note.trim()) {
    state.importedData.loveLife = null;
  } else {
    state.importedData.loveLife = { status, relationship, satisfaction, libido, frequency, orgasm, concerns, note: note.trim() };
  }
  saveAndRefresh('Love life saved');
}

export function clearLoveLife() {
  state.importedData.loveLife = null;
  saveAndRefresh('Love life cleared');
}

// ═══════════════════════════════════════════════
// ENVIRONMENT
// ═══════════════════════════════════════════════

export function openEnvironmentEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.environment || { setting: null, climate: null, water: null, waterConcerns: [], emf: [], emfMitigation: [], homeLight: null, air: [], toxins: [], building: null, note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Environment</h3>
    <div class="modal-unit">Your environment shapes your biology — water quality, EMF, light, air, and toxin exposure directly impact mitochondria, inflammation, and hormone function.</div>
    ${renderSelectField('Living setting', 'env-setting', ENV_SETTING, current.setting)}
    ${renderSelectField('Climate', 'env-climate', ENV_CLIMATE, current.climate)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Primary water source', 'env-water', ENV_WATER, current.water)}
    ${renderTagsField('Water concerns', 'env-water-concerns', ENV_WATER_CONCERNS, current.waterConcerns)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('EMF exposure', 'env-emf', ENV_EMF, current.emf)}
    ${renderTagsField('EMF mitigation', 'env-emf-mit', ENV_EMF_MITIGATION, current.emfMitigation)}
    <div class="ctx-field-group" style="margin-top:8px">
      <button class="import-btn import-btn-secondary" onclick="closeModal();setTimeout(()=>openEMFAssessmentEditor(),100)">Open Baubiologie EMF Assessment →</button>
      ${getEMFSummary() ? `<div style="font-size:12px;color:var(--text-muted);margin-top:6px">${escapeHTML(getEMFSummary())}</div>` : ''}
    </div>
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Home/work lighting', 'env-light', ENV_HOME_LIGHT, current.homeLight)}
    ${renderTagsField('Air quality', 'env-air', ENV_AIR, current.air)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('Toxin exposure', 'env-toxins', ENV_TOXINS, current.toxins)}
    ${renderSelectField('Building', 'env-building', ENV_BUILDING, current.building)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(state.importedData.environment != null, 'saveEnvironment', 'clearEnvironment')}`;
  overlay.classList.add("show");
}

export function saveEnvironment() {
  const setting = getSelectedOption('env-setting');
  const climate = getSelectedOption('env-climate');
  const water = getSelectedOption('env-water');
  const waterConcerns = getSelectedTags('env-water-concerns');
  const emf = getSelectedTags('env-emf');
  const emfMitigation = getSelectedTags('env-emf-mit');
  const homeLight = getSelectedOption('env-light');
  const air = getSelectedTags('env-air');
  const toxins = getSelectedTags('env-toxins');
  const building = getSelectedOption('env-building');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!setting && !climate && !water && waterConcerns.length === 0 && emf.length === 0 && emfMitigation.length === 0 && !homeLight && air.length === 0 && toxins.length === 0 && !building && !note.trim()) {
    state.importedData.environment = null;
  } else {
    state.importedData.environment = { setting, climate, water, waterConcerns, emf, emfMitigation, homeLight, air, toxins, building, note: note.trim() };
  }
  saveAndRefresh('Environment saved');
}

export function clearEnvironment() {
  state.importedData.environment = null;
  saveAndRefresh('Environment cleared');
}

// ═══════════════════════════════════════════════
// HEALTH GOALS
// ═══════════════════════════════════════════════

export function openHealthGoalsEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  renderHealthGoalsModal(modal);
  overlay.classList.add("show");
}

export function renderHealthGoalsModal(modal) {
  const goals = state.importedData.healthGoals || [];
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Health Goals</h3>
    <div class="modal-unit">List things you want to solve or improve. The AI will prioritize analysis around your stated goals.</div>`;
  if (goals.length > 0) {
    html += `<div class="goals-list">`;
    for (let i = 0; i < goals.length; i++) {
      const g = goals[i];
      html += `<div class="goals-list-item">
        <span class="goals-severity-badge severity-${g.severity}">${g.severity}</span>
        <span class="goals-text">${escapeHTML(g.text)}</span>
        <button class="goals-delete-btn" onclick="deleteHealthGoal(${i})" title="Remove">&times;</button>
      </div>`;
    }
    html += `</div>`;
  }
  html += `<div class="ctx-field-group"><label class="ctx-field-label">Add goal</label>
    <div class="goals-add-row">
      <input type="text" class="ctx-note-input" id="goal-text-input" placeholder="e.g. Improve insulin sensitivity, Optimize thyroid function" style="flex:1">
      <button class="import-btn import-btn-primary" onclick="addHealthGoal()">Add</button>
    </div>
    <div class="ctx-btn-group" id="goal-severity-select" style="margin-top:8px">
      <button type="button" class="ctx-btn-option active" onclick="selectCtxOption(this,'goal-severity-select')">major</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'goal-severity-select')">mild</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'goal-severity-select')">minor</button>
    </div>
  </div>
  <div class="ctx-editor-actions">
    <button class="import-btn import-btn-secondary" onclick="closeHealthGoals()">Done</button>
    ${goals.length > 0 ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearHealthGoals()">Clear All</button>` : ''}
  </div>`;
  modal.innerHTML = html;
  setTimeout(() => {
    const input = document.getElementById('goal-text-input');
    if (input) {
      input.focus();
      input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addHealthGoal(); } };
    }
  }, 50);
}

export function addHealthGoal() {
  const input = document.getElementById('goal-text-input');
  const severity = getSelectedOption('goal-severity-select') || 'major';
  const text = input ? input.value.trim() : '';
  if (!text) return;
  if (!state.importedData.healthGoals) state.importedData.healthGoals = [];
  state.importedData.healthGoals.push({ text, severity });
  saveImportedData();
  renderHealthGoalsModal(document.getElementById("detail-modal"));
}

export function deleteHealthGoal(idx) {
  if (!state.importedData.healthGoals) return;
  state.importedData.healthGoals.splice(idx, 1);
  saveImportedData();
  renderHealthGoalsModal(document.getElementById("detail-modal"));
}

export function closeHealthGoals() {
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  if ((state.importedData.healthGoals || []).length > 0) showNotification('Health goals saved', 'success');
}

export function clearHealthGoals() {
  state.importedData.healthGoals = [];
  saveImportedData();
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Health goals cleared', 'info');
}

// ═══════════════════════════════════════════════
// INTERPRETIVE LENS
// ═══════════════════════════════════════════════

export function openInterpretiveLensEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = state.importedData.interpretiveLens || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Interpretive Lens</h3>
    <div class="modal-unit">List researchers, clinicians, or scientific paradigms whose frameworks you follow. The AI will consider their perspectives when interpreting your results.</div>
    <textarea class="note-editor" id="interpretive-lens-textarea" placeholder="e.g. Longevity medicine, quantum biology, functional endocrinology framework...">${escapeHTML(current)}</textarea>
    <div class="ctx-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveInterpretiveLens()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearInterpretiveLens()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('interpretive-lens-textarea');
    if (ta) ta.focus();
  }, 50);
}

export function saveInterpretiveLens() {
  const ta = document.getElementById('interpretive-lens-textarea');
  const text = ta ? ta.value.trim() : '';
  state.importedData.interpretiveLens = text || '';
  saveImportedData();
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Interpretive lens saved' : 'Interpretive lens cleared', 'success');
}

export function clearInterpretiveLens() {
  state.importedData.interpretiveLens = '';
  saveImportedData();
  window.closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  window.navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Interpretive lens cleared', 'info');
}

export function renderInterpretiveLensSection() {
  const lens = (state.importedData.interpretiveLens || '').trim();
  if (!lens) return `<div class="lens-section lens-section-empty" onclick="openInterpretiveLensEditor()" title="Set your interpretive lens"><span class="lens-section-icon">&#129694;</span><span class="lens-section-text">Set your interpretive lens — name researchers, paradigms, or frameworks the AI should use…</span></div>`;
  return `<div class="lens-section" onclick="openInterpretiveLensEditor()" title="Interpretive Lens — click to edit"><span class="lens-section-icon">&#129694;</span><span class="lens-section-body"><span class="lens-section-label">Interpretive Lens</span><span class="lens-section-text">${escapeHTML(lens)}</span></span><span class="lens-section-edit">&#9998;</span></div>`;
}

// ── Window exports for onclick handlers ──
Object.assign(window, {
  getConditionsSummary,
  getDietSummary,
  getExerciseSummary,
  getSleepSummary,
  getLightCircadianSummary,
  getStressSummary,
  getLoveLifeSummary,
  getEnvironmentSummary,
  getGoalsSummary,
  isContextFilled,
  renderProfileContextCards,
  debounceContextNotes,
  applyDotColor,
  applyAISummary,
  getCardFingerprint,
  loadContextHealthDots,
  renderSelectField,
  selectCtxOption,
  getSelectedOption,
  renderTagsField,
  toggleCtxTag,
  getSelectedTags,
  renderNoteField,
  contextEditorActions,
  saveAndRefresh,
  openDiagnosesEditor,
  renderDiagnosesModal,
  filterConditionSuggestions,
  selectConditionSuggestion,
  closeSuggestionsOnClickOutside,
  syncDiagnosesNote,
  addCondition,
  deleteCondition,
  saveDiagnoses,
  closeDiagnoses,
  clearDiagnoses,
  openDietEditor,
  saveDiet,
  clearDiet,
  openSleepRestEditor,
  saveSleepRest,
  clearSleepRest,
  openLightCircadianEditor,
  saveLightCircadian,
  clearLightCircadian,
  openExerciseEditor,
  saveExercise,
  clearExercise,
  openStressEditor,
  saveStress,
  clearStress,
  openLoveLifeEditor,
  saveLoveLife,
  clearLoveLife,
  openEnvironmentEditor,
  saveEnvironment,
  clearEnvironment,
  openHealthGoalsEditor,
  renderHealthGoalsModal,
  addHealthGoal,
  deleteHealthGoal,
  closeHealthGoals,
  clearHealthGoals,
  openInterpretiveLensEditor,
  saveInterpretiveLens,
  clearInterpretiveLens,
  renderInterpretiveLensSection,
});
