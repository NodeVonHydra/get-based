// views.js — Navigate, dashboard, category views, detail modal, compare, correlations

import { state } from './state.js';
import { CORRELATION_PRESETS, CHIP_COLORS } from './schema.js';
import { escapeHTML, getStatus, getRangePosition, formatValue, getTrend, showNotification } from './utils.js';
import { getChartColors } from './theme.js';
import { getActiveData, filterDatesByRange, destroyAllCharts, getEffectiveRange, getEffectiveRangeForDate, getLatestValueIndex, getAllFlaggedMarkers, statusIcon, detectTrendAlerts, getKeyTrendMarkers, getFocusCardFingerprint, saveImportedData, recalculateHOMAIR, updateHeaderDates, renderDateRangeFilter, renderChartLayersDropdown } from './data.js';
import { profileStorageKey, setProfileSex, setProfileDob } from './profile.js';
import { createLineChart, getMarkerDescription, getNotesForChart, getSupplementsForChart, refBandPlugin, noteAnnotationPlugin, supplementBarPlugin, phaseBandPlugin } from './charts.js';
import { renderSupplementsSection } from './supplements.js';
import { renderMenstrualCycleSection } from './cycle.js';
import { renderProfileContextCards, renderInterpretiveLensSection, loadContextHealthDots, closeSuggestionsOnClickOutside } from './context-cards.js';
import { callClaudeAPI, hasAIProvider } from './api.js';
import { setupDropZone } from './pdf-import.js';
import { buildLabContext } from './chat.js';

// ═══════════════════════════════════════════════
// NAVIGATE (router)
// ═══════════════════════════════════════════════

export function navigate(category, data) {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.category === category);
  });
  destroyAllCharts();
  if (category === "dashboard") showDashboard(data);
  else if (category === "correlations") showCorrelations(data);
  else if (category === "compare") showCompare(data);
  else showCategory(category, data);
}

// ═══════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════

export function showDashboard(data) {
  if (!data) data = getActiveData();
  const main = document.getElementById("main-content");
  const hasData = data.dates.length > 0 || Object.values(data.categories).some(c => c.singlePoint && c.singleDate);

  // ── Empty state: welcome hero + collapsed context ──
  if (!hasData) {
    let html = `<div class="welcome-hero">
      <h2>Welcome to Get Based</h2>
      <p class="welcome-hero-subtitle">Import your blood work to track biomarker trends over time</p>
      <div class="drop-zone" id="drop-zone">
        <div class="drop-zone-icon">\uD83D\uDCC4</div>
        <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
        <div class="drop-zone-hint">AI-powered — works with any lab PDF report or Get Based JSON export</div></div>
      <div class="onboarding-divider">
        <span class="onboarding-divider-line"></span>
        <span class="onboarding-divider-text">or explore with demo data</span>
        <span class="onboarding-divider-line"></span>
      </div>
      <div class="demo-cards">
        <button class="demo-card" onclick="loadDemoData('female')">
          <span class="demo-card-avatar">\uD83D\uDC69</span>
          <span class="demo-card-name">Sarah, 34</span>
          <span class="demo-card-desc">Iron & hormones story</span>
        </button>
        <button class="demo-card" onclick="loadDemoData('male')">
          <span class="demo-card-avatar">\uD83D\uDC68</span>
          <span class="demo-card-name">Alex, 38</span>
          <span class="demo-card-desc">Metabolic health journey</span>
        </button>
      </div>
    </div>`;
    html += `<details class="welcome-context-details">
      <summary class="welcome-context-summary">Don\u2019t have labs yet? Tell the AI about yourself</summary>`;
    html += renderProfileContextCards();
    if (state.profileSex === 'female') html += renderMenstrualCycleSection(data);
    html += renderSupplementsSection();
    html += `</details>`;
    main.innerHTML = html;
    setupDropZone();
    return;
  }

  // ── Has data: full dashboard ──
  let html = `<div class="category-header"><h2>Dashboard Overview</h2>
    <p>Summary of all blood work results across ${data.dates.length} collection date${data.dates.length !== 1 ? 's' : ''}</p></div>`;

  // ── 1. Drop zone ──
  html += `<div class="drop-zone" id="drop-zone">
    <div class="drop-zone-icon">\uD83D\uDCC4</div>
    <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
    <div class="drop-zone-hint">AI-powered — works with any lab PDF report or Get Based JSON export</div></div>`;

  // ── 2. Onboarding Banner (Step 2) ──
  html += renderOnboardingBanner();

  // ── 3. Interpretive Lens ──
  html += renderInterpretiveLensSection();

  // ── 3b. Focus Card ──
  if (hasAIProvider()) html += renderFocusCard();

  // ── 4. Profile Context Cards ──
  html += renderProfileContextCards();

  // ── 5. Menstrual Cycle (female only) ──
  if (state.profileSex === 'female') html += renderMenstrualCycleSection(data);

  // ── 6. Supplements & Medications ──
  html += renderSupplementsSection();

  // ── 7. Key Trends ──
  const filteredData = filterDatesByRange(data);
  html += `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:16px">
    <div class="category-header" style="margin:0"><h2>Key Trends</h2>
    <p>Auto-selected from your data</p></div>
    ${renderDateRangeFilter()}
    ${renderChartLayersDropdown()}
  </div>`;

  const keyMarkers = getKeyTrendMarkers(filteredData);
  if (keyMarkers.length > 0) {
    html += `<div class="charts-grid charts-grid-4col">`;
    for (const km of keyMarkers) {
      const marker = filteredData.categories[km.cat].markers[km.key];
      html += renderChartCard(km.cat + "_" + km.key, marker, filteredData.dateLabels);
    }
    html += `</div>`;
  }

  // ── 8. Trends & Critical Flags ──
  const trendAlerts = detectTrendAlerts(filteredData);
  const trendMarkerIds = new Set(trendAlerts.map(a => a.id));
  const allFlags = getAllFlaggedMarkers(data);
  // Critical flags always use reference range (not optimal) — critical is a medical concept
  const criticalFlags = allFlags.filter(f => {
    if (trendMarkerIds.has(f.id)) return false;
    const refRange = f.refMax - f.refMin;
    if (refRange <= 0 || f.refMin == null || f.refMax == null) return false;
    const distance = f.status === 'high' ? (f.rawValue - f.refMax) : (f.refMin - f.rawValue);
    return distance > refRange * 0.5;
  });
  const totalAttention = trendAlerts.length + criticalFlags.length;
  if (totalAttention > 0) {
    html += `<div class="alerts-section"><div class="alerts-title">Trends & Alerts (${totalAttention})</div>`;
    for (const alert of trendAlerts) {
      const isSudden = alert.concern.startsWith('sudden_');
      const isPast = alert.concern.startsWith('past_');
      const cls = isSudden ? 'trend-alert-sudden' : isPast ? 'trend-alert-danger' : 'trend-alert-warning';
      const arrow = isSudden ? '\u26A1' : alert.direction === 'rising' ? '\u2197' : '\u2198';
      const label = alert.concern === 'sudden_high' ? 'Sudden jump above range'
        : alert.concern === 'sudden_low' ? 'Sudden drop below range'
        : alert.concern === 'past_high' ? 'Above range & rising'
        : alert.concern === 'past_low' ? 'Below range & falling'
        : alert.concern === 'approaching_high' ? 'Approaching upper limit'
        : 'Approaching lower limit';
      html += `<div class="trend-alert-card ${cls}" onclick="showDetailModal('${alert.id}')">
        <span class="trend-alert-arrow">${arrow}</span>
        <div class="trend-alert-info">
          <div class="trend-alert-name">${escapeHTML(alert.name)} <span class="trend-alert-cat">${escapeHTML(alert.category)}</span></div>
          <div class="trend-alert-label">${label}</div>
        </div>
        <div class="trend-alert-spark">${alert.spark.join(' \u2192 ')}</div>
      </div>`;
    }
    for (const f of criticalFlags) {
      const cls = f.status === "high" ? "alert-high" : "alert-low";
      const label = f.status === "high" ? "\u25B2 CRITICAL HIGH" : "\u25BC CRITICAL LOW";
      html += `<div class="alert-card ${cls}" onclick="navigate('${f.categoryKey}')">
        <span class="alert-indicator">${label}</span>
        <span class="alert-name">${escapeHTML(f.name)}</span>
        <span class="alert-value">${escapeHTML(String(f.value))} ${escapeHTML(f.unit)}</span>
        <span class="alert-ref">${formatValue(f.effectiveMin)} \u2013 ${formatValue(f.effectiveMax)}</span></div>`;
    }
    html += `</div>`;
  }

  // ── 9. Data & Notes (bottom) ──
  const hasEntries = state.importedData.entries && state.importedData.entries.length > 0;
  const hasNotes = state.importedData.notes && state.importedData.notes.length > 0;
  if (hasEntries || hasNotes) {
    const entryCount = (state.importedData.entries || []).length;
    const noteCount = (state.importedData.notes || []).length;
    const dataBadge = [entryCount ? `${entryCount} entries` : '', noteCount ? `${noteCount} notes` : ''].filter(Boolean).join(', ');
    html += `<div style="margin-top:20px"><span class="context-section-title">Data & Notes (${dataBadge})</span></div>`;
    html += `<div class="imported-entries">`;
    html += `<button class="add-note-btn" onclick="openNoteEditor()">+ Add Note</button>`;
    const items = [];
    if (hasEntries) {
      for (const entry of state.importedData.entries) {
        items.push({ type: 'entry', date: entry.date, entry });
      }
    }
    if (hasNotes) {
      for (let i = 0; i < state.importedData.notes.length; i++) {
        items.push({ type: 'note', date: state.importedData.notes[i].date, noteIdx: i, note: state.importedData.notes[i] });
      }
    }
    items.sort((a, b) => a.date.localeCompare(b.date));
    for (const item of items) {
      const d = new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (item.type === 'entry') {
        const cnt = Object.keys(item.entry.markers).length;
        html += `<div class="imported-entry">
          <span class="ie-info"><span class="ie-date">${d}</span><span class="ie-count">${cnt} markers</span></span>
          <div class="ie-actions">
            <button class="ie-remove" onclick="removeImportedEntry('${item.entry.date}')">\u2715 Remove</button>
          </div>
        </div>`;
      } else {
        const preview = escapeHTML(item.note.text.length > 80 ? item.note.text.slice(0, 80) + '...' : item.note.text);
        html += `<div class="note-row" onclick="openNoteEditor(null, ${item.noteIdx})">
          <span class="note-row-icon">\uD83D\uDCDD</span>
          <span class="note-row-date">${d}</span>
          <span class="note-row-text">${preview}</span>
          <div class="note-row-actions">
            <button class="ie-remove" onclick="event.stopPropagation();deleteNote(${item.noteIdx})">\u2715</button>
          </div>
        </div>`;
      }
    }
    html += `<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
      <button class="import-btn import-btn-secondary" onclick="exportDataJSON()">Export JSON</button>
      <button class="import-btn import-btn-secondary" onclick="exportPDFReport()">Export Report</button>
      <button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red)" onclick="clearAllData()">Clear All Data</button></div>`;
    html += `</div>`;
  }

  html += `<p class="app-disclaimer">For educational and informational purposes only. Not medical advice. Always consult a qualified healthcare provider before making health decisions.</p>`;
  html += `<p class="app-footer-version">v${escapeHTML(window.APP_VERSION || '')} · <span id="app-commit-hash">···</span></p>`;

  main.innerHTML = html;

  for (const km of keyMarkers) {
    const marker = filteredData.categories[km.cat].markers[km.key];
    createLineChart(km.cat + "_" + km.key, marker, filteredData.dateLabels, filteredData.dates, filteredData.phaseLabels);
  }
  setupDropZone();

  // Non-blocking: load focus card and health dots after DOM is ready
  if (hasData && hasAIProvider()) loadFocusCard();
  loadContextHealthDots();
  loadCommitHash();

  // Auto-trigger guided tour on first visit
  if (window.startTour) window.startTour(true);
}

// ── Commit Hash ──

let _cachedCommitHash = null;
function loadCommitHash() {
  const el = document.getElementById('app-commit-hash');
  if (!el) return;
  if (_cachedCommitHash) { el.innerHTML = `<a href="https://github.com/elkimek/get-based/commit/${_cachedCommitHash}" target="_blank" rel="noopener">${_cachedCommitHash}</a>`; return; }
  fetch('https://api.github.com/repos/elkimek/get-based/commits/main', { headers: { Accept: 'application/vnd.github.sha' } })
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(sha => { _cachedCommitHash = sha.slice(0, 7); const e = document.getElementById('app-commit-hash'); if (e) e.innerHTML = `<a href="https://github.com/elkimek/get-based/commit/${_cachedCommitHash}" target="_blank" rel="noopener">${_cachedCommitHash}</a>`; })
    .catch(() => { const e = document.getElementById('app-commit-hash'); if (e) e.textContent = ''; });
}

// ── Focus Card ──

export function renderFocusCard() {
  const cacheKey = profileStorageKey(state.currentProfile, 'focusCard');
  const cached = (() => { try { return JSON.parse(localStorage.getItem(cacheKey)); } catch(e) { return null; } })();
  const fp = getFocusCardFingerprint();
  const text = (cached && cached.fingerprint === fp) ? cached.text : null;
  return `<div class="focus-card" id="focus-card">
    <div class="focus-card-icon">\uD83D\uDD2C</div>
    <div class="focus-card-body" id="focus-card-body">${text
      ? `<span class="focus-card-text">${escapeHTML(text)}</span>`
      : `<span class="focus-card-shimmer"></span>`}</div>
    <button class="focus-card-refresh" onclick="refreshFocusCard()" title="Regenerate insight">\u21BB</button>
  </div>`;
}

export function buildFocusContext() {
  const data = getActiveData();
  if (!data.dates.length && !Object.values(data.categories).some(c => c.singleDate)) {
    return null;
  }
  const sexLabel = state.profileSex === 'female' ? 'female' : state.profileSex === 'male' ? 'male' : 'not specified';
  const age = state.profileDob ? Math.floor((new Date() - new Date(state.profileDob)) / (365.25 * 24 * 60 * 60 * 1000)) : null;
  const today = new Date().toISOString().slice(0, 10);
  const lastDate = data.dates[data.dates.length - 1];
  let ctx = `Profile: ${sexLabel}${age !== null ? ', age ' + age : ''}, today ${today}, last labs ${lastDate}\n`;

  // Major health goals (if any)
  const healthGoals = state.importedData.healthGoals || [];
  const majorGoals = healthGoals.filter(g => g.severity === 'major');
  if (majorGoals.length > 0) {
    ctx += `Goals: ${majorGoals.map(g => g.text).join('; ')}\n`;
  }

  // Flagged/non-normal markers (latest values only)
  const flags = getAllFlaggedMarkers(data);
  if (flags.length > 0) {
    ctx += `Flagged:\n`;
    for (const f of flags) {
      ctx += `- ${f.name}: ${f.value} ${f.unit} (${f.status}, ref ${f.effectiveMin}\u2013${f.effectiveMax})\n`;
    }
  }

  // Also include any markers that changed significantly (latest vs previous)
  const changes = [];
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [key, m] of Object.entries(cat.markers)) {
      const nonNull = m.values.filter(v => v !== null);
      if (nonNull.length < 2) continue;
      const prev = nonNull[nonNull.length - 2];
      const last = nonNull[nonNull.length - 1];
      if (prev === 0) continue;
      const pct = Math.abs((last - prev) / prev * 100);
      if (pct > 20) {
        const dir = last > prev ? 'up' : 'down';
        changes.push(`${m.name}: ${dir} ${pct.toFixed(0)}%`);
      }
    }
  }
  if (changes.length > 0) {
    ctx += `Notable changes: ${changes.slice(0, 5).join(', ')}\n`;
  }

  return ctx;
}

export async function loadFocusCard() {
  const el = document.getElementById('focus-card-body');
  if (!el) return;
  const cacheKey = profileStorageKey(state.currentProfile, 'focusCard');
  const cached = (() => { try { return JSON.parse(localStorage.getItem(cacheKey)); } catch(e) { return null; } })();
  const fp = getFocusCardFingerprint();
  if (cached && cached.fingerprint === fp && cached.text) {
    el.innerHTML = `<span class="focus-card-text">${escapeHTML(cached.text)}</span>`;
    return;
  }
  el.innerHTML = `<span class="focus-card-shimmer"></span>`;
  try {
    const ctx = buildFocusContext();
    if (!ctx) {
      el.innerHTML = `<span class="focus-card-text" style="color:var(--text-muted)">No insight available</span>`;
      return;
    }
    const healthGoals = state.importedData.healthGoals || [];
    const hasGoals = healthGoals.some(g => g.severity === 'major');
    const focusSystem = hasGoals
      ? 'You are a blood work analyst. Respond with ONE sentence, max 40 words. If the patient has health goals listed, connect your finding to their most relevant goal. Name the single most actionable marker finding, its direction, and why it matters. No preamble, no disclaimer.'
      : 'You are a blood work analyst. Respond with exactly ONE sentence, max 40 words. Name the single most important marker finding, its direction (rising/falling/high/low), and briefly why it matters clinically. No preamble, no disclaimer.';
    const apiCall = callClaudeAPI({
      system: focusSystem,
      messages: [{ role: 'user', content: ctx }],
      maxTokens: 100
    });
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000));
    const result = await Promise.race([apiCall, timeout]);
    const text = (result && typeof result === 'object') ? result.text : (result || '');
    const trimmed = (text || '').trim();
    if (trimmed) {
      localStorage.setItem(cacheKey, JSON.stringify({ fingerprint: fp, text: trimmed }));
      el.innerHTML = `<span class="focus-card-text">${escapeHTML(trimmed)}</span>`;
    } else {
      el.innerHTML = `<span class="focus-card-text" style="color:var(--text-muted)">No insight available</span>`;
    }
  } catch(e) {
    el.innerHTML = `<span class="focus-card-text" style="color:var(--text-muted)">Could not load insight</span>`;
  }
}

export function refreshFocusCard() {
  const cacheKey = profileStorageKey(state.currentProfile, 'focusCard');
  localStorage.removeItem(cacheKey);
  loadFocusCard();
}

// ── Onboarding ──

export function renderOnboardingBanner() {
  const onboarded = localStorage.getItem(profileStorageKey(state.currentProfile, 'onboarded'));
  if (onboarded) return '';
  if (state.profileSex && state.profileDob) {
    localStorage.setItem(profileStorageKey(state.currentProfile, 'onboarded'), 'profile-set');
    return '';
  }
  return `<div class="onboarding-banner" id="onboarding-banner">
    <div class="onboarding-steps">
      <span class="onboarding-step completed">\u2713</span>
      <span class="onboarding-step-line"></span>
      <span class="onboarding-step active">2</span>
      <span class="onboarding-step-line"></span>
      <span class="onboarding-step">3</span>
    </div>
    <div class="onboarding-step-labels">
      <span class="onboarding-step-label">Import</span>
      <span class="onboarding-step-label active">Profile</span>
      <span class="onboarding-step-label">Ready</span>
    </div>
    <h3 class="onboarding-title">Set up your profile</h3>
    <p class="onboarding-subtitle">Sex and date of birth help us show the right reference ranges for your results.</p>
    <div class="onboarding-form">
      <div class="onboarding-field">
        <label class="onboarding-label">Sex</label>
        <div class="onboarding-sex-toggle">
          <button class="onboarding-sex-btn${state.profileSex === 'male' ? ' active' : ''}" onclick="completeOnboardingSex('male')">Male</button>
          <button class="onboarding-sex-btn${state.profileSex === 'female' ? ' active' : ''}" onclick="completeOnboardingSex('female')">Female</button>
        </div>
      </div>
      <div class="onboarding-field">
        <label class="onboarding-label">Date of Birth</label>
        <input type="date" class="onboarding-dob-input" id="onboarding-dob" value="${state.profileDob || ''}" />
      </div>
      <div class="onboarding-actions">
        <button class="onboarding-save-btn" onclick="completeOnboardingProfile()">Save & Continue</button>
        <button class="onboarding-skip-btn" onclick="dismissOnboarding()">Skip for now</button>
      </div>
    </div>
  </div>`;
}

export function completeOnboardingSex(sex) {
  document.querySelectorAll('.onboarding-sex-btn').forEach(b => b.classList.remove('active'));
  const btns = document.querySelectorAll('.onboarding-sex-btn');
  if (sex === 'male' && btns[0]) btns[0].classList.add('active');
  if (sex === 'female' && btns[1]) btns[1].classList.add('active');
}

export function completeOnboardingProfile() {
  const activeSexBtn = document.querySelector('.onboarding-sex-btn.active');
  const sex = activeSexBtn ? (activeSexBtn.textContent.toLowerCase()) : null;
  const dobInput = document.getElementById('onboarding-dob');
  const dob = dobInput ? dobInput.value : null;
  localStorage.setItem(profileStorageKey(state.currentProfile, 'onboarded'), 'profile-set');
  if (sex) { state.profileSex = sex; setProfileSex(state.currentProfile, sex); }
  if (dob) { state.profileDob = dob; setProfileDob(state.currentProfile, dob); }
  const data = getActiveData();
  window.buildSidebar(data);
  updateHeaderDates(data);
  navigate('dashboard', data);
  showNotification("Profile set up — you're all set!", 'success');
}

export function dismissOnboarding() {
  localStorage.setItem(profileStorageKey(state.currentProfile, 'onboarded'), 'dismissed');
  const banner = document.getElementById('onboarding-banner');
  if (banner) {
    banner.style.transition = 'opacity 0.3s, transform 0.3s';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-10px)';
    setTimeout(() => banner.remove(), 300);
  }
  showNotification('You can set sex and DOB anytime in Settings.', 'info');
}

// ═══════════════════════════════════════════════
// CATEGORY VIEWS
// ═══════════════════════════════════════════════

export function showCategory(categoryKey, preData) {
  const rawData = preData || getActiveData();
  const data = filterDatesByRange(rawData);
  const cat = data.categories[categoryKey];
  const main = document.getElementById("main-content");
  let html = `<div class="category-header"><h2>${cat.icon} ${escapeHTML(cat.label)}</h2>
    <p>${Object.keys(cat.markers).length} biomarkers tracked</p></div>`;

  html += `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px">`;
  html += `<div class="view-toggle" style="margin-bottom:0">
    <button class="view-btn active" onclick="switchView('charts','${categoryKey}',this)">Charts</button>
    <button class="view-btn" onclick="switchView('table','${categoryKey}',this)">Table</button>
    <button class="view-btn" onclick="switchView('heatmap','${categoryKey}',this)">Heatmap</button></div>`;
  html += renderDateRangeFilter();
  html += renderChartLayersDropdown();
  html += `</div>`;

  const hasValues = Object.values(cat.markers).some(m => m.values && m.values.length > 0 && m.values.some(v => v !== null));

  html += `<div id="view-content">`;
  if (!hasValues) {
    html += `<div class="empty-state"><div class="empty-state-icon">${cat.icon}</div>
      <h3>No Data Available</h3><p>Import lab results containing ${escapeHTML(cat.label.toLowerCase())} markers to see data here.</p></div>`;
  } else if (cat.singleDate) {
    html += renderFattyAcidsView(cat);
  } else {
    html += `<div class="charts-grid">`;
    for (const [key, marker] of Object.entries(cat.markers)) {
      html += renderChartCard(categoryKey + "_" + key, marker, data.dateLabels);
    }
    html += `</div>`;
  }
  html += `</div>`;
  main.innerHTML = html;

  if (!hasValues) { /* no charts to render */ }
  else if (cat.singleDate) { renderFattyAcidsCharts(cat); }
  else {
    for (const [key, marker] of Object.entries(cat.markers)) {
      createLineChart(categoryKey + "_" + key, marker, data.dateLabels, data.dates, data.phaseLabels);
    }
  }
}

export function switchView(view, categoryKey, btn) {
  document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  destroyAllCharts();
  const rawData = getActiveData();
  const data = filterDatesByRange(rawData);
  const cat = data.categories[categoryKey];
  const container = document.getElementById("view-content");
  if (view === "table") {
    container.innerHTML = renderTableView(cat, data.dateLabels);
  } else if (view === "heatmap") {
    container.innerHTML = renderHeatmapView(cat, data.dateLabels, data.dates, categoryKey);
  } else {
    if (cat.singleDate) {
      container.innerHTML = renderFattyAcidsView(cat);
      renderFattyAcidsCharts(cat);
    } else {
      let html = `<div class="charts-grid">`;
      for (const [key, marker] of Object.entries(cat.markers)) {
        html += renderChartCard(categoryKey + "_" + key, marker, data.dateLabels);
      }
      html += `</div>`;
      container.innerHTML = html;
      for (const [key, marker] of Object.entries(cat.markers)) {
        createLineChart(categoryKey + "_" + key, marker, data.dateLabels, data.dates, data.phaseLabels);
      }
    }
  }
}

export function renderChartCard(id, marker, dateLabels) {
  state.markerRegistry[id] = marker;
  const latestIdx = getLatestValueIndex(marker.values);
  const latestVal = latestIdx !== -1 ? marker.values[latestIdx] : null;
  const lr = getEffectiveRangeForDate(marker, latestIdx);
  const status = latestVal !== null ? getStatus(latestVal, lr.min, lr.max) : "missing";
  const statusLabel = status === "normal" ? "Normal" : status === "high" ? "High" : status === "low" ? "Low" : "N/A";
  const sIcon = statusIcon(status);

  const trend = getTrend(marker.values);
  const trendBadge = trend.cls !== 'trend-stable' || trend.arrow !== '\u2014' ? `<span class="chart-card-trend ${trend.cls}">${trend.arrow}</span>` : '';

  let html = `<div class="chart-card" onclick="showDetailModal('${id}')">
    <div class="chart-card-header"><div>
      <div class="chart-card-title">${escapeHTML(marker.name)}</div>
      <div class="chart-card-unit">${escapeHTML(marker.unit)}</div></div>
      <div><span class="chart-card-status status-${status}">${sIcon ? sIcon + ' ' : ''}${statusLabel}</span>${trendBadge}</div></div>
    <div class="chart-container"><canvas id="chart-${id}"></canvas></div>
    <div class="chart-values">`;
  const labels = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : dateLabels;
  for (let i = 0; i < marker.values.length; i++) {
    const v = marker.values[i];
    const ri = getEffectiveRangeForDate(marker, i);
    const s = v !== null ? getStatus(v, ri.min, ri.max) : "missing";
    html += `<div class="chart-value-item"><div class="chart-value-date">${labels[i] || ''}</div>
      <div class="chart-value-num val-${s}">${v !== null ? formatValue(v) : "\u2014"}</div></div>`;
  }
  const r = getEffectiveRange(marker);
  const rangeLabel = state.rangeMode === 'optimal' && marker.optimalMin != null ? 'Optimal' : 'Reference';
  html += `</div>${r.min != null && r.max != null ? `<div class="chart-ref-range">${rangeLabel}: ${formatValue(r.min)} \u2013 ${formatValue(r.max)} ${escapeHTML(marker.unit)}</div>` : ''}</div>`;
  return html;
}

export function renderTableView(cat, dateLabels) {
  const labels = cat.singleDate ? [cat.singleDateLabel || "N/A"] : dateLabels;
  let html = `<div class="data-table-wrapper"><table class="data-table"><thead><tr>
    <th>Biomarker</th><th>Unit</th><th>Reference</th>`;
  for (const d of labels) html += `<th>${d}</th>`;
  html += `<th>Trend</th><th>Range</th></tr></thead><tbody>`;
  for (const [key, marker] of Object.entries(cat.markers)) {
    const r = getEffectiveRange(marker);
    let refCell = r.min != null && r.max != null ? `${formatValue(r.min)} \u2013 ${formatValue(r.max)}` : '\u2014';
    if (state.rangeMode === 'both') {
      if (marker.optimalMin != null) refCell = `${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}<br><span style="color:var(--green);font-size:11px">opt: ${formatValue(marker.optimalMin)} \u2013 ${formatValue(marker.optimalMax)}</span>`;
    }
    html += `<tr><td class="marker-name">${escapeHTML(marker.name)}</td>
      <td class="unit-col">${escapeHTML(marker.unit)}</td>
      <td class="ref-col">${refCell}</td>`;
    for (let i = 0; i < marker.values.length; i++) {
      const v = marker.values[i];
      const ri = getEffectiveRangeForDate(marker, i);
      const s = v !== null ? getStatus(v, ri.min, ri.max) : "missing";
      html += `<td class="value-cell val-${s}">${v !== null ? formatValue(v) : "\u2014"}</td>`;
    }
    const trend = getTrend(marker.values);
    html += `<td><span class="trend-arrow ${trend.cls}">${trend.arrow}</span></td>`;
    const li = getLatestValueIndex(marker.values);
    if (li !== -1 && r.min != null && r.max != null) {
      const lr = getEffectiveRangeForDate(marker, li);
      const pos = Math.max(0, Math.min(100, getRangePosition(marker.values[li], lr.min, lr.max)));
      const s = getStatus(marker.values[li], lr.min, lr.max);
      html += `<td><div class="range-bar"><div class="range-bar-fill" style="left:0;width:100%"></div>
        <div class="range-bar-marker marker-${s}" style="left:${pos}%"></div></div></td>`;
    } else html += `<td>\u2014</td>`;
    html += `</tr>`;
  }
  html += `</tbody></table></div>`;
  return html;
}

export function renderHeatmapView(cat, dateLabels, dates, categoryKey) {
  const labels = cat.singleDate ? [cat.singleDateLabel || "N/A"] : dateLabels;
  let html = `<div class="heatmap-wrapper"><table class="heatmap-table"><thead><tr><th>Biomarker</th>`;
  for (const d of labels) html += `<th>${d}</th>`;
  html += `</tr></thead><tbody>`;
  for (const [key, marker] of Object.entries(cat.markers)) {
    const id = categoryKey + "_" + key;
    state.markerRegistry[id] = marker;
    html += `<tr><td>${escapeHTML(marker.name)}</td>`;
    for (let i = 0; i < marker.values.length; i++) {
      const v = marker.values[i];
      const ri = getEffectiveRangeForDate(marker, i);
      const s = v !== null ? getStatus(v, ri.min, ri.max) : "missing";
      html += `<td class="heatmap-${s}" onclick="showDetailModal('${id}')">${v !== null ? formatValue(v) : "\u2014"}</td>`;
    }
    html += `</tr>`;
  }
  html += `</tbody></table></div>`;
  return html;
}

export function renderFattyAcidsView(cat) {
  let html = `<div style="background:var(--bg-card);border-radius:var(--radius);padding:20px;margin-bottom:20px;border:1px solid var(--border)">
    <h3 style="margin-bottom:16px;font-size:16px">Fatty Acid Profile${cat.singleDate ? ' \u2014 ' + new Date(cat.singleDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</h3>
    <div class="fa-bar-chart-container"><canvas id="chart-fa-bar"></canvas></div></div>`;
  html += `<div class="fatty-acids-grid">`;
  for (const [key, marker] of Object.entries(cat.markers)) {
    const r = getEffectiveRange(marker);
    const v = marker.values[0], s = getStatus(v, r.min, r.max);
    const pos = Math.max(0, Math.min(100, getRangePosition(v, r.min, r.max)));
    const rangeLabel = state.rangeMode === 'optimal' && marker.optimalMin != null ? 'Optimal' : 'Ref';
    html += `<div class="fa-card"><div class="fa-card-name">${escapeHTML(marker.name)}</div>
      <div class="fa-card-value val-${s}">${formatValue(v)}${marker.unit ? " " + escapeHTML(marker.unit) : ""}</div>
      <div class="fa-card-ref">${rangeLabel}: ${formatValue(r.min)} \u2013 ${formatValue(r.max)}</div>
      <div class="range-bar" style="margin-top:8px;width:100%"><div class="range-bar-fill" style="left:0;width:100%"></div>
      <div class="range-bar-marker marker-${s}" style="left:${pos}%"></div></div></div>`;
  }
  html += `</div>`;
  return html;
}

export function renderFattyAcidsCharts(cat) {
  const tc = getChartColors();
  const names=[], vals=[], mins=[], maxs=[], bgC=[], brC=[];
  for (const m of Object.values(cat.markers)) {
    const r = getEffectiveRange(m);
    names.push(m.name.replace(/\(.+\)/,"").trim());
    vals.push(m.values[0]); mins.push(r.min); maxs.push(r.max);
    const s = getStatus(m.values[0], r.min, r.max);
    bgC.push(s==="normal"?tc.green+"99":s==="high"?tc.red+"99":tc.yellow+"99");
    brC.push(s==="normal"?tc.green:s==="high"?tc.red:tc.yellow);
  }
  const ctx = document.getElementById("chart-fa-bar");
  if (!ctx) return;
  state.chartInstances["fa-bar"] = new Chart(ctx, {
    type: "bar",
    data: { labels: names, datasets: [
      { label:"Value", data:vals, backgroundColor:bgC, borderColor:brC, borderWidth:1, borderRadius:4 },
      { label:"Ref Min", data:mins, type:"line", borderColor:tc.lineColor+"80", borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 },
      { label:"Ref Max", data:maxs, type:"line", borderColor:tc.lineColor+"80", borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 }
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{display:false}, tooltip:{ backgroundColor:tc.tooltipBg, titleColor:tc.tooltipTitle, bodyColor:tc.tooltipBody, borderColor:tc.tooltipBorder, borderWidth:1 }},
      scales: { x:{ticks:{color:tc.tickColor,font:{size:10},maxRotation:45},grid:{display:false}}, y:{ticks:{color:tc.tickColor},grid:{color:tc.gridColor}} }
    }
  });
}

// ═══════════════════════════════════════════════
// DETAIL MODAL & MANUAL ENTRY
// ═══════════════════════════════════════════════

export async function fetchCustomMarkerDescription(markerId, markerName, unit) {
  const cacheKey = 'labcharts-marker-desc';
  const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  if (cache[markerId]) return cache[markerId];
  if (!hasAIProvider()) return null;
  try {
    const { text: resp } = await callClaudeAPI({
      system: 'You are a concise medical reference. Reply with exactly one sentence (max 30 words) explaining what this blood biomarker measures and why it matters clinically. No preamble.',
      messages: [{ role: 'user', content: `${markerName} (${unit})` }],
      maxTokens: 100
    });
    const text = (resp || '').trim();
    if (text) {
      cache[markerId] = text;
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    }
    return text || null;
  } catch { return null; }
}

export function showDetailModal(id) {
  let marker = state.markerRegistry[id];
  if (!marker) {
    const data = getActiveData();
    const [catKey, mKey] = id.split('_');
    marker = data.categories[catKey]?.markers[mKey];
    if (marker) state.markerRegistry[id] = marker;
  }
  if (!marker) return;
  const data = getActiveData();
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const dates = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : data.dateLabels;
  const r = getEffectiveRange(marker);
  let rangeInfo = '';
  if (state.rangeMode === 'both') {
    if (marker.refMin != null && marker.refMax != null) rangeInfo += ` &middot; Reference: ${marker.refMin} \u2013 ${marker.refMax}`;
    if (marker.optimalMin != null) rangeInfo += ` &middot; <span style="color:var(--green)">Optimal: ${marker.optimalMin} \u2013 ${marker.optimalMax}</span>`;
  } else if (state.rangeMode === 'optimal' && marker.optimalMin != null) {
    rangeInfo = ` &middot; <span style="color:var(--green)">Optimal: ${marker.optimalMin} \u2013 ${marker.optimalMax}</span>`;
  } else if (marker.refMin != null && marker.refMax != null) {
    rangeInfo = ` &middot; Reference: ${marker.refMin} \u2013 ${marker.refMax}`;
  }
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>${escapeHTML(marker.name)}</h3>
    <div class="modal-unit">${escapeHTML(marker.unit)}${rangeInfo}</div>
    <div class="marker-description" id="marker-desc"></div>
    <div class="modal-chart"><canvas id="modal-chart"></canvas></div>
    <div class="modal-values-grid">`;
  for (let i = 0; i < marker.values.length; i++) {
    const v = marker.values[i];
    const ri = getEffectiveRangeForDate(marker, i);
    const s = v !== null ? getStatus(v, ri.min, ri.max) : "missing";
    const sl = s==="normal"?"\u2713 In Range":s==="high"?"\u25B2 Above Range":s==="low"?"\u25BC Below Range":"N/A";
    const phaseLabel = marker.phaseLabels && marker.phaseLabels[i];
    const phaseInfo = phaseLabel ? `<div class="mv-phase">${phaseLabel} \u2022 ${formatValue(ri.min)}\u2013${formatValue(ri.max)}</div>` : '';
    const rawDate = marker.singlePoint ? null : data.dates[i];
    const matchingNote = rawDate && state.importedData.notes ? state.importedData.notes.find(n => n.date === rawDate) : null;
    const noteIcon = matchingNote ? `<div class="mv-note" onclick="event.stopPropagation();this.parentElement.parentElement.querySelector('.mv-note-text').classList.toggle('show')">&#128221;</div><div class="mv-note-text">${escapeHTML(matchingNote.text)}</div>` : '';
    const dotKey = id.replace('_', '.');
    const isManual = rawDate && state.importedData.manualValues && state.importedData.manualValues[dotKey + ':' + rawDate];
    const deleteBtn = (v !== null && isManual) ? `<button class="mv-delete" onclick="event.stopPropagation();deleteMarkerValue('${id}','${rawDate}')" title="Remove this value">&times;</button>` : '';
    html += `<div class="modal-value-card">${deleteBtn}<div class="mv-date">${dates[i]}${noteIcon}</div>
      <div class="mv-value val-${s}">${v !== null ? formatValue(v) : "\u2014"}</div>
      <div class="mv-status val-${s}">${sl}</div>${phaseInfo}</div>`;
  }
  html += `</div>`;
  const nonNull = marker.values.map((v,i)=>({v,i})).filter(x=>x.v!==null);
  if (nonNull.length >= 2) {
    const f = nonNull[0], l = nonNull[nonNull.length-1];
    const ch = l.v - f.v, pct = ((ch/f.v)*100).toFixed(1);
    const dir = ch > 0 ? "increased" : ch < 0 ? "decreased" : "unchanged";
    html += `<div class="modal-ref-info"><strong>Trend:</strong> ${dir} by ${Math.abs(ch).toFixed(2)} ${escapeHTML(marker.unit)} (${ch>0?"+":""}${pct}%) from ${dates[f.i]} to ${dates[l.i]}</div>`;
  }
  html += `<button class="ask-ai-btn" onclick="event.stopPropagation();askAIAboutMarker('${id}')">Ask AI about this marker</button>`;
  html += `<button class="manual-entry-btn" onclick="event.stopPropagation();openManualEntryForm('${id}')">+ Add Value</button>`;
  modal.innerHTML = html;
  overlay.classList.add("show");
  setTimeout(() => {
    if (document.getElementById("modal-chart")) createLineChart("modal", marker, data.dateLabels, data.dates, data.phaseLabels);
  }, 50);
  // Display marker description (sync for schema markers, async fetch for custom)
  const descEl = document.getElementById('marker-desc');
  if (descEl) {
    const desc = getMarkerDescription(id);
    if (desc) {
      descEl.textContent = desc;
      descEl.classList.add('loaded');
    } else if (!marker.desc && hasAIProvider()) {
      descEl.classList.add('loading');
      fetchCustomMarkerDescription(id, marker.name, marker.unit).then(text => {
        const el = document.getElementById('marker-desc');
        if (text && el) {
          el.textContent = text;
          el.classList.remove('loading');
          el.classList.add('loaded');
        } else if (el) {
          el.remove();
        }
      });
    } else {
      descEl.remove();
    }
  }
}

export function openManualEntryForm(id) {
  const marker = state.markerRegistry[id];
  if (!marker) return;
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const today = new Date().toISOString().slice(0, 10);
  const refText = marker.refMin != null && marker.refMax != null
    ? `Reference: ${marker.refMin} \u2013 ${marker.refMax} ${escapeHTML(marker.unit)}`
    : '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Add Value \u2014 ${escapeHTML(marker.name)}</h3>
    <div class="modal-unit">${escapeHTML(marker.unit)}${refText ? ' \u00b7 ' + refText : ''}</div>
    <div class="manual-entry-form">
      <div class="me-field">
        <label>Date</label>
        <input type="date" id="me-date" value="${today}">
      </div>
      <div class="me-field">
        <label>Value (${marker.unit})</label>
        <input type="number" id="me-value" step="any" placeholder="Enter value..." autofocus>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="import-btn import-btn-primary" onclick="saveManualEntry('${id}')">Save</button>
        <button class="import-btn import-btn-secondary" onclick="showDetailModal('${id}')">Cancel</button>
      </div>
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => { const el = document.getElementById('me-value'); if (el) el.focus(); }, 50);
}

export function saveManualEntry(id) {
  const dateInput = document.getElementById('me-date');
  const valueInput = document.getElementById('me-value');
  if (!dateInput || !valueInput) return;
  const date = dateInput.value;
  const value = parseFloat(valueInput.value);
  if (!date) { showNotification('Please enter a date', 'error'); return; }
  if (isNaN(value)) { showNotification('Please enter a valid number', 'error'); return; }
  // Convert id format: "category_markerKey" → "category.markerKey"
  const dotKey = id.replace('_', '.');
  if (!state.importedData.entries) state.importedData.entries = [];
  let entry = state.importedData.entries.find(e => e.date === date);
  if (!entry) {
    entry = { date: date, markers: {} };
    state.importedData.entries.push(entry);
  }
  entry.markers[dotKey] = value;
  // Track as manually added
  if (!state.importedData.manualValues) state.importedData.manualValues = {};
  state.importedData.manualValues[dotKey + ':' + date] = true;
  // Insulin dual-mapping
  if (dotKey === 'hormones.insulin') entry.markers['diabetes.insulin_d'] = value;
  recalculateHOMAIR(entry);
  saveImportedData();
  window.buildSidebar();
  updateHeaderDates();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Added ${state.markerRegistry[id]?.name || id}: ${value} on ${date}`, 'success');
}

export function deleteMarkerValue(id, date) {
  const dotKey = id.replace('_', '.');
  if (!state.importedData.entries) return;
  const entry = state.importedData.entries.find(e => e.date === date);
  if (!entry || entry.markers[dotKey] === undefined) return;
  delete entry.markers[dotKey];
  // Clean up manual tracking
  if (state.importedData.manualValues) delete state.importedData.manualValues[dotKey + ':' + date];
  // Clean up insulin dual-mapping
  if (dotKey === 'hormones.insulin') { delete entry.markers['diabetes.insulin_d']; recalculateHOMAIR(entry); }
  // Remove entry entirely if no markers left
  if (Object.keys(entry.markers).length === 0) {
    state.importedData.entries = state.importedData.entries.filter(e => e.date !== date);
  }
  saveImportedData();
  window.buildSidebar();
  updateHeaderDates();
  // Re-open the detail modal to show updated values
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showDetailModal(id);
  showNotification(`Removed value from ${date}`, 'info');
}

export function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
  if (state.chartInstances["modal"]) { state.chartInstances["modal"].destroy(); delete state.chartInstances["modal"]; }
  document.removeEventListener('click', closeSuggestionsOnClickOutside);
}


// ═══════════════════════════════════════════════
// COMPARE DATES
// ═══════════════════════════════════════════════

export function showCompare(data) {
  if (!data) data = getActiveData();
  const main = document.getElementById("main-content");
  let html = `<div class="category-header"><h2>\u2194 Compare Dates</h2>
    <p>Side-by-side comparison of biomarker values between two collection dates</p></div>`;
  if (data.dates.length < 2) {
    html += `<div class="empty-state"><div class="empty-state-icon">\u2194</div>
      <h3>Not Enough Data</h3><p>Import at least 2 lab result dates to compare values side by side.</p></div>`;
    main.innerHTML = html;
    return;
  }
  if (!state.compareDate1 || !data.dates.includes(state.compareDate1)) state.compareDate1 = data.dates[0];
  if (!state.compareDate2 || !data.dates.includes(state.compareDate2)) state.compareDate2 = data.dates[data.dates.length - 1];
  const fmtOpt = d => {
    const label = new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `<option value="${d}">${label}</option>`;
  };
  html += `<div class="compare-controls">
    <label>Date 1:</label>
    <select id="compare-select-1" onchange="setCompareDate1(this.value)">${data.dates.map(d => fmtOpt(d)).join('')}</select>
    <button class="compare-swap-btn" onclick="swapCompareDates()" title="Swap dates">\u21C4</button>
    <label>Date 2:</label>
    <select id="compare-select-2" onchange="setCompareDate2(this.value)">${data.dates.map(d => fmtOpt(d)).join('')}</select>
  </div>`;
  html += `<div id="compare-results"></div>`;
  main.innerHTML = html;
  document.getElementById('compare-select-1').value = state.compareDate1;
  document.getElementById('compare-select-2').value = state.compareDate2;
  updateCompare();
}

export function setCompareDate1(value) { state.compareDate1 = value; updateCompare(); }
export function setCompareDate2(value) { state.compareDate2 = value; updateCompare(); }

export function updateCompare() {
  const data = getActiveData();
  const container = document.getElementById('compare-results');
  if (!container) return;
  const idx1 = data.dates.indexOf(state.compareDate1);
  const idx2 = data.dates.indexOf(state.compareDate2);
  if (idx1 === -1 || idx2 === -1) { container.innerHTML = ''; return; }
  container.innerHTML = renderCompareTable(data, idx1, idx2);
}

export function swapCompareDates() {
  const tmp = state.compareDate1;
  state.compareDate1 = state.compareDate2;
  state.compareDate2 = tmp;
  const s1 = document.getElementById('compare-select-1');
  const s2 = document.getElementById('compare-select-2');
  if (s1) s1.value = state.compareDate1;
  if (s2) s2.value = state.compareDate2;
  updateCompare();
}

export function renderCompareTable(data, idx1, idx2) {
  const d1Label = data.dateLabels[idx1];
  const d2Label = data.dateLabels[idx2];
  let html = `<div class="compare-table-wrapper"><table class="compare-table"><thead><tr>
    <th>Biomarker</th><th>Unit</th><th>Reference</th>
    <th>${d1Label}</th><th>${d2Label}</th><th>Delta</th><th>% Change</th></tr></thead><tbody>`;
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) continue;
    const rows = [];
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      const v1 = marker.values[idx1];
      const v2 = marker.values[idx2];
      if (v1 === null && v2 === null) continue;
      const mr1 = getEffectiveRangeForDate(marker, idx1);
      const mr2 = getEffectiveRangeForDate(marker, idx2);
      const mr = getEffectiveRange(marker);
      const s1 = v1 !== null ? getStatus(v1, mr1.min, mr1.max) : 'missing';
      const s2 = v2 !== null ? getStatus(v2, mr2.min, mr2.max) : 'missing';
      let delta = null, pctChange = null, directionClass = 'compare-neutral';
      if (v1 !== null && v2 !== null) {
        delta = v2 - v1;
        pctChange = v1 !== 0 ? (delta / v1) * 100 : null;
        if (mr.min != null && mr.max != null) {
          const mid = (mr.min + mr.max) / 2;
          const dist1 = Math.abs(v1 - mid);
          const dist2 = Math.abs(v2 - mid);
          if (dist2 < dist1 - 0.001) directionClass = 'compare-improved';
          else if (dist2 > dist1 + 0.001) directionClass = 'compare-worsened';
        }
      }
      const refStr = marker.refMin != null && marker.refMax != null ? `${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}` : '\u2014';
      rows.push(`<tr>
        <td class="marker-name">${escapeHTML(marker.name)}</td>
        <td style="color:var(--text-muted);font-size:12px">${escapeHTML(marker.unit)}</td>
        <td style="color:var(--text-secondary);font-size:12px">${refStr}</td>
        <td class="value-cell val-${s1}" style="font-weight:600">${v1 !== null ? formatValue(v1) : '\u2014'}</td>
        <td class="value-cell val-${s2}" style="font-weight:600">${v2 !== null ? formatValue(v2) : '\u2014'}</td>
        <td class="${directionClass}" style="font-weight:600">${delta !== null ? (delta > 0 ? '+' : '') + formatValue(delta) : '\u2014'}</td>
        <td class="${directionClass}" style="font-weight:600">${pctChange !== null ? (pctChange > 0 ? '+' : '') + pctChange.toFixed(1) + '%' : '\u2014'}</td>
      </tr>`);
    }
    if (rows.length > 0) {
      html += `<tr class="cat-row"><td colspan="7">${escapeHTML(cat.icon)} ${escapeHTML(cat.label)}</td></tr>`;
      html += rows.join('');
    }
  }
  html += `</tbody></table></div>`;
  return html;
}

// ═══════════════════════════════════════════════
// CORRELATIONS
// ═══════════════════════════════════════════════

export function showCorrelations(data) {
  if (!data) data = getActiveData();
  const main = document.getElementById("main-content");
  let html = `<div class="category-header"><h2>\uD83D\uDCC8 Correlations</h2>
    <p>Compare biomarkers across categories on a normalized scale</p></div>`;
  html += `<div class="correlation-controls">
    <h3>Select Biomarkers (2\u20138)</h3>
    <div class="corr-select-row">
      <div class="corr-dropdown">
        <input type="text" class="corr-search" id="corr-search" placeholder="Search biomarkers..."
          oninput="filterCorrelationOptions()" onfocus="showCorrelationDropdown()">
        <div class="corr-options" id="corr-options"></div>
      </div>
    </div>
    <div class="corr-chips" id="corr-chips"></div>
    <div class="corr-presets">
      <div class="corr-presets-label">Quick Presets:</div>`;
  for (let i = 0; i < CORRELATION_PRESETS.length; i++) {
    html += `<button class="corr-preset-btn" onclick="applyCorrelationPreset(${i})">${CORRELATION_PRESETS[i].label}</button>`;
  }
  html += `</div></div>`;
  html += `<div class="corr-chart-container" id="corr-chart-container" style="display:none">
    <h3>Normalized Comparison (% of Reference Range)
      <button class="corr-ask-ai-btn" onclick="askAIAboutCorrelations()" title="Ask AI about these correlations">Ask AI</button>
    </h3>
    <div class="corr-chart"><canvas id="chart-correlation"></canvas></div></div>`;
  main.innerHTML = html;
  populateCorrelationOptions(data);
  renderCorrelationChips();
  if (state.selectedCorrelationMarkers.length >= 2) renderCorrelationChart();
}

export function populateCorrelationOptions(data) {
  if (!data) data = getActiveData();
  const container = document.getElementById("corr-options");
  if (!container) return;
  let html = '';
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [markerKey, marker] of Object.entries(cat.markers)) {
      if (marker.singlePoint) continue;
      const fullKey = `${catKey}.${markerKey}`;
      const selected = state.selectedCorrelationMarkers.includes(fullKey);
      html += `<div class="corr-option ${selected ? 'selected' : ''}"
        data-key="${fullKey}" data-name="${escapeHTML(marker.name)}" data-cat="${escapeHTML(cat.label)}"
        onclick="toggleCorrelationMarker('${fullKey}')">
        ${escapeHTML(marker.name)} <span class="opt-cat">${escapeHTML(cat.label)}</span></div>`;
    }
  }
  container.innerHTML = html;
}

export function showCorrelationDropdown() {
  document.getElementById("corr-options").classList.add("show");
}

export function filterCorrelationOptions() {
  const search = document.getElementById("corr-search").value.toLowerCase();
  document.querySelectorAll(".corr-option").forEach(opt => {
    const name = opt.dataset.name.toLowerCase();
    const cat = opt.dataset.cat.toLowerCase();
    opt.style.display = (name.includes(search) || cat.includes(search)) ? '' : 'none';
  });
  document.getElementById("corr-options").classList.add("show");
}

export function toggleCorrelationMarker(key) {
  const idx = state.selectedCorrelationMarkers.indexOf(key);
  if (idx !== -1) state.selectedCorrelationMarkers.splice(idx, 1);
  else if (state.selectedCorrelationMarkers.length < 8) state.selectedCorrelationMarkers.push(key);
  renderCorrelationChips();
  populateCorrelationOptions();
  if (state.selectedCorrelationMarkers.length >= 2) renderCorrelationChart();
  else {
    document.getElementById("corr-chart-container").style.display = "none";
    if (state.chartInstances["correlation"]) { state.chartInstances["correlation"].destroy(); delete state.chartInstances["correlation"]; }
  }
}

export function applyCorrelationPreset(idx) {
  state.selectedCorrelationMarkers = [...CORRELATION_PRESETS[idx].markers];
  renderCorrelationChips();
  populateCorrelationOptions();
  if (state.selectedCorrelationMarkers.length >= 2) renderCorrelationChart();
}

export function renderCorrelationChips() {
  const container = document.getElementById("corr-chips");
  if (!container) return;
  const data = getActiveData();
  let html = '';
  state.selectedCorrelationMarkers.forEach((key, i) => {
    const [catKey, markerKey] = key.split('.');
    const marker = data.categories[catKey]?.markers[markerKey];
    if (!marker) return;
    const color = CHIP_COLORS[i % CHIP_COLORS.length];
    html += `<span class="corr-chip" style="background:${color}20;border-color:${color};color:${color}">
      ${escapeHTML(marker.name)} <span class="chip-remove" onclick="toggleCorrelationMarker('${key}')">&times;</span></span>`;
  });
  container.innerHTML = html;
}

export function renderCorrelationChart() {
  const data = getActiveData();
  const container = document.getElementById("corr-chart-container");
  container.style.display = "block";
  if (state.chartInstances["correlation"]) { state.chartInstances["correlation"].destroy(); delete state.chartInstances["correlation"]; }
  const canvas = document.getElementById("chart-correlation");
  if (!canvas) return;
  const datasets = [];
  state.selectedCorrelationMarkers.forEach((key, i) => {
    const [catKey, markerKey] = key.split('.');
    const marker = data.categories[catKey]?.markers[markerKey];
    if (!marker) return;
    const normalizedValues = marker.values.map(v => {
      if (v === null) return null;
      const range = marker.refMax - marker.refMin;
      return range !== 0 ? ((v - marker.refMin) / range) * 100 : 50;
    });
    const color = CHIP_COLORS[i % CHIP_COLORS.length];
    datasets.push({
      label: marker.name, data: normalizedValues,
      borderColor: color, backgroundColor: color + '20',
      borderWidth: 2.5, pointRadius: 5, pointHoverRadius: 7,
      pointBackgroundColor: color, tension: 0.3, fill: false, spanGaps: true,
      _realValues: marker.values, _unit: marker.unit, _refMin: marker.refMin, _refMax: marker.refMax
    });
  });
  const allVals = datasets.flatMap(ds => ds.data.filter(v => v !== null));
  const minY = Math.min(0, ...allVals) - 10;
  const maxY = Math.max(100, ...allVals) + 10;
  const tc = getChartColors();
  state.chartInstances["correlation"] = new Chart(canvas, {
    type: "line",
    data: { labels: data.dateLabels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: tc.legendColor, font: { size: 12 }, usePointStyle: true, pointStyle: "circle" } },
        tooltip: {
          backgroundColor: tc.tooltipBg, titleColor: tc.tooltipTitle, bodyColor: tc.tooltipBody,
          borderColor: tc.tooltipBorder, borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const ds = ctx.dataset;
              const realVal = ds._realValues[ctx.dataIndex];
              const pct = ctx.parsed.y;
              return `${ds.label}: ${formatValue(realVal)} ${ds._unit} (${pct !== null ? pct.toFixed(0) + '%' : 'N/A'})`;
            }
          }
        },
        refBand: { refMin: 0, refMax: 100 },
        noteAnnotations: (function() { const n = getNotesForChart(data.dates); return n.length ? { notes: n, chartDates: data.dates } : false; })(),
        supplementBars: (function() { const s = getSupplementsForChart(data.dates); return s.length ? { supplements: s, chartDates: data.dates } : false; })()
      },
      layout: { padding: { top: (function() { const s = getSupplementsForChart(data.dates); return s.length ? s.length * 14 + 6 : 0; })() } },
      scales: {
        x: { ticks: { color: tc.tickColor, font: { size: 11 } }, grid: { display: false } },
        y: { min: minY, max: maxY, ticks: { color: tc.tickColor, font: { size: 10 }, callback: v => v + '%' }, grid: { color: tc.gridColor } }
      }
    },
    plugins: [refBandPlugin, noteAnnotationPlugin, supplementBarPlugin]
  });
}

// ═══════════════════════════════════════════════
// WINDOW EXPORTS
// ═══════════════════════════════════════════════

Object.assign(window, {
  navigate,
  showDashboard,
  renderFocusCard,
  buildFocusContext,
  loadFocusCard,
  refreshFocusCard,
  renderOnboardingBanner,
  completeOnboardingSex,
  completeOnboardingProfile,
  dismissOnboarding,
  showCategory,
  switchView,
  renderChartCard,
  renderTableView,
  renderHeatmapView,
  renderFattyAcidsView,
  renderFattyAcidsCharts,
  fetchCustomMarkerDescription,
  showDetailModal,
  openManualEntryForm,
  saveManualEntry,
  deleteMarkerValue,
  closeModal,
  showCompare,
  setCompareDate1,
  setCompareDate2,
  updateCompare,
  swapCompareDates,
  renderCompareTable,
  showCorrelations,
  populateCorrelationOptions,
  showCorrelationDropdown,
  filterCorrelationOptions,
  toggleCorrelationMarker,
  applyCorrelationPreset,
  renderCorrelationChips,
  renderCorrelationChart,
});
