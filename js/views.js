// views.js — Navigate, dashboard, category views, detail modal, compare, correlations

import { state } from './state.js';
import { CORRELATION_PRESETS, CHIP_COLORS, trackUsage } from './schema.js';
import { escapeHTML, getStatus, getRangePosition, formatValue, getTrend, showNotification, showConfirmDialog } from './utils.js';
import { getChartColors } from './theme.js';
import { getActiveData, filterDatesByRange, destroyAllCharts, getEffectiveRange, getEffectiveRangeForDate, getLatestValueIndex, getAllFlaggedMarkers, statusIcon, detectTrendAlerts, getKeyTrendMarkers, getFocusCardFingerprint, saveImportedData, recalculateHOMAIR, updateHeaderDates, renderDateRangeFilter, renderChartLayersDropdown, convertDisplayToSI } from './data.js';
import { profileStorageKey } from './profile.js';
import { createLineChart, getMarkerDescription, getNotesForChart, getSupplementsForChart, refBandPlugin, noteAnnotationPlugin, supplementBarPlugin, phaseBandPlugin } from './charts.js';
import { renderSupplementsSection } from './supplements.js';
import { renderMenstrualCycleSection } from './cycle.js';
import { renderProfileContextCards, renderInterpretiveLensSection, loadContextHealthDots, closeSuggestionsOnClickOutside } from './context-cards.js';
import { callClaudeAPI, hasAIProvider, getAIProvider, getActiveModelId } from './api.js';
import { setupDropZone } from './pdf-import.js';
import { buildLabContext } from './chat.js';

function markerHasData(m) { return m.values?.some(v => v !== null) ?? false; }

// ═══════════════════════════════════════════════
// NAVIGATE (router)
// ═══════════════════════════════════════════════

export function navigate(category, data) {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.category === category);
  });
  // Close mobile sidebar on navigation
  if (window.closeMobileSidebar) window.closeMobileSidebar();
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

  // Show/hide import FAB based on whether dashboard has data
  const importFab = document.getElementById('import-fab');
  if (importFab) importFab.classList.toggle('hidden', !hasData);

  // ── Empty state: welcome hero + collapsed context ──
  if (!hasData) {
    let html = `<div class="welcome-hero">
      <h2>Welcome to getbased</h2>
      <p class="welcome-hero-subtitle">Track your biomarkers, understand your health</p>
      <div class="drop-zone" id="drop-zone">
        <div class="drop-zone-icon">\uD83D\uDCC4</div>
        <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
        <div class="drop-zone-hint">AI-powered — works with any lab PDF report or getbased JSON export</div>
        ${!hasAIProvider() ? '<div class="drop-zone-api-hint">Requires an AI connection — <a href="#" onclick="event.preventDefault();event.stopPropagation();closeChatPanel();window.openSettingsModal(\'ai\')">set up in 30 seconds</a></div>' : ''}</div>
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
    const detailsOpen = sessionStorage.getItem('welcome-details-open') === '1';
    html += `<details class="welcome-context-details"${detailsOpen ? ' open' : ''}>
      <summary class="welcome-context-summary" onclick="setTimeout(()=>sessionStorage.setItem('welcome-details-open',document.querySelector('.welcome-context-details')?.open?'1':'0'),0)">Don\u2019t have labs yet? Tell the AI about yourself</summary>`;
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
  // Drop zone hidden element for drag-drop + file input (no visible space on dashboard)
  html += `<div class="drop-zone drop-zone-hidden" id="drop-zone"></div>`;

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

  // ── 9. Notes (bottom) ──
  const hasNotes = state.importedData.notes && state.importedData.notes.length > 0;
  {
    const noteCount = (state.importedData.notes || []).length;
    const noteBadge = noteCount > 0 ? ` (${noteCount})` : '';
    html += `<div style="margin-top:20px"><span class="context-section-title">Notes${noteBadge}</span></div>`;
    html += `<div class="notes-section">`;
    html += `<button class="add-note-btn" onclick="openNoteEditor()">+ Add Note</button>`;
    if (hasNotes) {
      const notes = state.importedData.notes
        .map((note, i) => ({ note, idx: i }))
        .sort((a, b) => a.note.date.localeCompare(b.note.date));
      for (const { note, idx } of notes) {
        const d = new Date(note.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const preview = escapeHTML(note.text.length > 200 ? note.text.slice(0, 200) + '...' : note.text);
        html += `<div class="note-card" onclick="openNoteEditor(null, ${idx})">
          <div class="note-card-date">${d}</div>
          <div class="note-card-text">${preview}</div>
          <div class="note-card-actions">
            <button class="note-card-action" onclick="event.stopPropagation();openNoteEditor(null, ${idx})">Edit</button>
            <button class="note-card-action note-card-action-delete" onclick="event.stopPropagation();deleteNote(${idx})">Delete</button>
          </div>
        </div>`;
      }
    } else {
      html += `<div style="color:var(--text-muted);font-size:13px;padding:12px 0;font-style:italic">No notes yet — add notes to track context around your lab results</div>`;
    }
    html += `</div>`;
  }

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

  // Auto-trigger guided tour on first visit — but skip if no data (chat onboarding handles new users)
  const _p = window.getProfiles?.()?.find(p => p.id === state.currentProfile);
  const _hasProfile = _p?.name && _p.name !== 'Default' && state.profileSex;
  if (_hasProfile && hasData) {
    if (window.startTour) window.startTour(true);
  } else if (!hasData) {
    // First-time visitor: auto-open chat onboarding after a short delay
    setTimeout(() => window.openChatPanel?.(), 800);
  }
}

// ── Commit Hash ──

let _cachedCommitHash = null;
function loadCommitHash() {
  const vEl = document.getElementById('app-version-text');
  if (vEl && !vEl.textContent) vEl.textContent = window.APP_VERSION || '';
  const el = document.getElementById('app-commit-hash');
  if (!el) return;
  if (_cachedCommitHash) { el.innerHTML = `<a href="https://github.com/elkimek/get-based/commit/${_cachedCommitHash}" target="_blank" rel="noopener">${_cachedCommitHash}</a>`; return; }
  fetch('https://api.github.com/repos/elkimek/get-based/commits/main', { headers: { Accept: 'application/vnd.github.sha' } })
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(sha => { _cachedCommitHash = sha.slice(0, 7); const e = document.getElementById('app-commit-hash'); if (e) e.innerHTML = `<a href="https://github.com/elkimek/get-based/commit/${_cachedCommitHash}" target="_blank" rel="noopener">${_cachedCommitHash}</a>`; })
    .catch(() => {});
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
      ? 'You are a blood work analyst. The user\'s real lab results are provided below. Respond with ONE sentence, max 40 words. If the patient has health goals listed, connect your finding to their most relevant goal. Name the single most actionable marker finding, its value, direction, and why it matters. No preamble, no disclaimer.'
      : 'You are a blood work analyst. The user\'s real lab results are provided below. Respond with exactly ONE sentence, max 40 words. Name the single most important marker finding, its value, direction (rising/falling/high/low), and briefly why it matters clinically. No preamble, no disclaimer.';
    const apiCall = callClaudeAPI({
      system: focusSystem,
      messages: [{ role: 'user', content: ctx }],
      maxTokens: 100
    });
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000));
    const result = await Promise.race([apiCall, timeout]);
    if (result && typeof result === 'object' && result.usage) {
      trackUsage(getAIProvider(), getActiveModelId(), result.usage.inputTokens || 0, result.usage.outputTokens || 0);
    }
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
  const sex = activeSexBtn ? (activeSexBtn.textContent.trim().toLowerCase()) : null;
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
  const allEntries = Object.entries(cat.markers);
  const withData = allEntries.filter(([, m]) => markerHasData(m));
  const countLabel = withData.length < allEntries.length ? `${withData.length} of ${allEntries.length} biomarkers with data` : `${allEntries.length} biomarkers tracked`;
  let html = `<div class="category-header"><h2>${cat.icon} ${escapeHTML(cat.label)}</h2>
    <p>${countLabel}</p></div>`;

  html += `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px">`;
  html += `<div class="view-toggle" style="margin-bottom:0">
    <button class="view-btn active" onclick="switchView('charts','${categoryKey}',this)">Charts</button>
    <button class="view-btn" onclick="switchView('table','${categoryKey}',this)">Table</button>
    <button class="view-btn" onclick="switchView('heatmap','${categoryKey}',this)">Heatmap</button></div>`;
  html += renderDateRangeFilter();
  html += renderChartLayersDropdown();
  html += `</div>`;

  html += `<div id="view-content">`;
  if (withData.length === 0) {
    html += `<div class="empty-state"><div class="empty-state-icon">${cat.icon}</div>
      <h3>No Data Available</h3><p>Import lab results containing ${escapeHTML(cat.label.toLowerCase())} markers to see data here.</p></div>`;
  } else if (cat.singleDate) {
    html += renderFattyAcidsView(cat);
  } else {
    html += `<div class="charts-grid">`;
    for (const [key, marker] of withData) {
      html += renderChartCard(categoryKey + "_" + key, marker, data.dateLabels);
    }
    html += `</div>`;
  }
  html += `</div>`;
  main.innerHTML = html;

  if (withData.length === 0) { /* no charts to render */ }
  else if (cat.singleDate) { renderFattyAcidsCharts(cat); }
  else {
    for (const [key, marker] of withData) {
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
      const withData = Object.entries(cat.markers).filter(([, m]) => markerHasData(m));
      let html = `<div class="charts-grid">`;
      for (const [key, marker] of withData) {
        html += renderChartCard(categoryKey + "_" + key, marker, data.dateLabels);
      }
      html += `</div>`;
      container.innerHTML = html;
      for (const [key, marker] of withData) {
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
  let rangeHtml = '';
  if (state.rangeMode === 'both' && marker.optimalMin != null && marker.refMin != null) {
    rangeHtml = `<div class="chart-ref-range">Ref: ${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)} · <span style="color:var(--green)">Optimal: ${formatValue(marker.optimalMin)} \u2013 ${formatValue(marker.optimalMax)}</span> ${escapeHTML(marker.unit)}</div>`;
  } else {
    const r = getEffectiveRange(marker);
    const rangeLabel = state.rangeMode === 'optimal' && marker.optimalMin != null ? 'Optimal' : 'Reference';
    rangeHtml = r.min != null && r.max != null ? `<div class="chart-ref-range">${rangeLabel}: ${formatValue(r.min)} \u2013 ${formatValue(r.max)} ${escapeHTML(marker.unit)}</div>` : '';
  }
  html += `</div>${rangeHtml}</div>`;
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
    let faRangeText;
    if (state.rangeMode === 'both' && marker.optimalMin != null && marker.refMin != null) {
      faRangeText = `Ref: ${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)} · <span style="color:var(--green)">Opt: ${formatValue(marker.optimalMin)} \u2013 ${formatValue(marker.optimalMax)}</span>`;
    } else {
      const rangeLabel = state.rangeMode === 'optimal' && marker.optimalMin != null ? 'Optimal' : 'Ref';
      faRangeText = `${rangeLabel}: ${formatValue(r.min)} \u2013 ${formatValue(r.max)}`;
    }
    html += `<div class="fa-card"><div class="fa-card-name">${escapeHTML(marker.name)}</div>
      <div class="fa-card-value val-${s}">${formatValue(v)}${marker.unit ? " " + escapeHTML(marker.unit) : ""}</div>
      <div class="fa-card-ref">${faRangeText}</div>
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
    const descResult = await callClaudeAPI({
      system: 'You are a concise medical reference. Reply with exactly one sentence (max 30 words) explaining what this blood biomarker measures and why it matters clinically. No preamble.',
      messages: [{ role: 'user', content: `${markerName} (${unit})` }],
      maxTokens: 100
    });
    if (descResult && descResult.usage) {
      trackUsage(getAIProvider(), getActiveModelId(), descResult.usage.inputTokens || 0, descResult.usage.outputTokens || 0);
    }
    const resp = (descResult && descResult.text) || '';
    const text = resp.trim();
    if (text) {
      cache[markerId] = text;
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    }
    return text || null;
  } catch { return null; }
}

export function showDetailModal(id) {
  const data = getActiveData();
  const [catKey, mKey] = id.split('_');
  let marker = data.categories[catKey]?.markers[mKey];
  if (marker) state.markerRegistry[id] = marker;
  if (!marker) return;
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const dates = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : data.dateLabels;
  const r = getEffectiveRange(marker);
  const dotKey = id.replace('_', '.');
  let rangeInfo = '';
  const overrides = state.importedData?.refOverrides?.[dotKey] || {};
  const refEditable = (label, min, max, type) => {
    const isEdited = type === 'optimal' ? (overrides.optimalMin != null || overrides.optimalMax != null) : (overrides.refMin != null || overrides.refMax != null);
    const editedBadge = isEdited ? ` <span class="ref-edited-badge" title="Custom range from your lab — click to revert to default" onclick="event.stopPropagation();revertRefRange('${id}','${type}')">lab \u00d7</span>` : '';
    return ` &middot; ${type === 'optimal' ? '<span style="color:var(--green)">' : ''}${label}: <span class="ref-editable" onclick="editRefRange('${id}','${type}',event)" title="Click to edit">${min} \u2013 ${max}</span>${editedBadge}${type === 'optimal' ? '</span>' : ''}`;
  };
  if (state.rangeMode === 'both') {
    if (marker.refMin != null && marker.refMax != null) rangeInfo += refEditable('Reference', marker.refMin, marker.refMax, 'ref');
    if (marker.optimalMin != null) rangeInfo += refEditable('Optimal', marker.optimalMin, marker.optimalMax, 'optimal');
  } else if (state.rangeMode === 'optimal' && marker.optimalMin != null) {
    rangeInfo = refEditable('Optimal', marker.optimalMin, marker.optimalMax, 'optimal');
  } else if (marker.refMin != null && marker.refMax != null) {
    rangeInfo = refEditable('Reference', marker.refMin, marker.refMax, 'ref');
  }
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>${escapeHTML(marker.name)}</h3>
    <div class="modal-unit">${escapeHTML(marker.unit)}${rangeInfo}</div>
    <div class="marker-description" id="marker-desc"></div>
    <div class="modal-chart"><canvas id="chart-modal"></canvas></div>
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
    const mvKey = dotKey + ':' + rawDate;
    const manualVal = rawDate && state.importedData.manualValues && state.importedData.manualValues[mvKey];
    const isManual = manualVal !== undefined && manualVal !== null;
    const canRevert = isManual && manualVal !== true;
    const manualBadge = canRevert
      ? ` <span class="ref-edited-badge" title="Edited — click to revert" onclick="event.stopPropagation();revertMarkerValue('${id}','${rawDate}')">edited \u00d7</span>`
      : isManual ? ' <span class="ref-edited-badge" title="Manually entered">manual</span>' : '';
    const deleteBtn = (v !== null) ? `<button class="mv-delete" onclick="event.stopPropagation();deleteMarkerValue('${id}','${rawDate}')" title="Remove this value">&times;</button>` : '';
    const editClick = rawDate && v !== null ? ` onclick="event.stopPropagation();editMarkerValue('${id}','${rawDate}',${v},event)" title="Click to edit" style="cursor:pointer"` : '';
    html += `<div class="modal-value-card">${deleteBtn}<div class="mv-date">${dates[i]}${noteIcon}</div>
      <div class="mv-value val-${s}"${editClick}>${v !== null ? formatValue(v) : "\u2014"}${manualBadge}</div>
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
  // Show delete link for custom markers only
  if (state.importedData?.customMarkers?.[dotKey]) {
    html += `<div style="text-align:center;margin-top:8px"><a href="#" style="color:var(--text-muted);font-size:0.8rem" onclick="event.preventDefault();event.stopPropagation();deleteCustomMarker('${id}')">Delete this marker</a></div>`;
  }
  modal.innerHTML = html;
  overlay.classList.add("show");
  setTimeout(() => {
    if (document.getElementById("chart-modal")) createLineChart("modal", marker, data.dateLabels, data.dates, data.phaseLabels);
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
  const storedValue = convertDisplayToSI(dotKey, value);
  entry.markers[dotKey] = storedValue;
  // Track as manually added
  if (!state.importedData.manualValues) state.importedData.manualValues = {};
  state.importedData.manualValues[dotKey + ':' + date] = true;
  // Insulin dual-mapping
  if (dotKey === 'hormones.insulin') entry.markers['diabetes.insulin_d'] = storedValue;
  recalculateHOMAIR(entry);
  saveImportedData();
  window.buildSidebar();
  updateHeaderDates();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Added ${state.markerRegistry[id]?.name || id}: ${value} on ${date}`, 'success');
  // Re-open detail modal so user stays in context (#29)
  setTimeout(() => showDetailModal(id), 50);
}

export function openCreateMarkerModal() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  // Build category options from schema + existing custom categories
  const data = getActiveData();
  const catOptions = Object.entries(data.categories)
    .filter(([, c]) => !c.calculated)
    .map(([key, c]) => `<option value="${key}">${escapeHTML(c.label)}</option>`)
    .join('');
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Create New Biomarker</h3>
    <div class="manual-entry-form">
      <div class="me-field">
        <label>Category</label>
        <div class="cm-cat-row">
          <select id="cm-category" onchange="document.getElementById('cm-new-cat').style.display=this.value==='__new__'?'block':'none'">
            ${catOptions}
            <option value="__new__">+ New category...</option>
          </select>
          <input type="text" id="cm-new-cat" placeholder="Category name" style="display:none;margin-top:6px">
        </div>
      </div>
      <div class="me-field">
        <label>Marker name</label>
        <input type="text" id="cm-name" placeholder="e.g. Lipoprotein(a)" autofocus>
      </div>
      <div class="me-field">
        <label>Unit</label>
        <input type="text" id="cm-unit" placeholder="e.g. mg/dL, nmol/L, %">
      </div>
      <div class="me-field">
        <label>Reference range (optional)</label>
        <div style="display:flex;gap:8px">
          <input type="number" id="cm-ref-min" step="any" placeholder="Min">
          <span style="line-height:36px">\u2013</span>
          <input type="number" id="cm-ref-max" step="any" placeholder="Max">
        </div>
      </div>
      <div class="me-field">
        <label>Optimal range (optional)</label>
        <div style="display:flex;gap:8px">
          <input type="number" id="cm-opt-min" step="any" placeholder="Min">
          <span style="line-height:36px">\u2013</span>
          <input type="number" id="cm-opt-max" step="any" placeholder="Max">
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="import-btn import-btn-primary" onclick="saveCustomMarker()">Create</button>
        <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      </div>
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => { const el = document.getElementById('cm-name'); if (el) el.focus(); }, 50);
}

export function saveCustomMarker() {
  const catSelect = document.getElementById('cm-category');
  const newCatInput = document.getElementById('cm-new-cat');
  const nameInput = document.getElementById('cm-name');
  const unitInput = document.getElementById('cm-unit');
  const refMinInput = document.getElementById('cm-ref-min');
  const refMaxInput = document.getElementById('cm-ref-max');
  if (!nameInput?.value.trim()) { showNotification('Please enter a marker name', 'error'); return; }
  const name = nameInput.value.trim();
  // Determine category key and label
  let catKey, catLabel;
  if (catSelect.value === '__new__') {
    catLabel = (newCatInput?.value || '').trim();
    if (!catLabel) { showNotification('Please enter a category name', 'error'); return; }
    catKey = catLabel.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/)
      .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
    if (!catKey || /^\d/.test(catKey)) catKey = 'custom' + catKey.charAt(0).toUpperCase() + catKey.slice(1);
  } else {
    catKey = catSelect.value;
    catLabel = catSelect.options[catSelect.selectedIndex].text;
  }
  // Generate marker key from name (camelCase)
  const markerKey = name
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
  if (!markerKey) { showNotification('Could not generate a valid key from marker name', 'error'); return; }
  const fullKey = catKey + '.' + markerKey;
  // Check for conflicts
  const data = getActiveData();
  const existingCat = data.categories[catKey];
  if (existingCat?.markers[markerKey]) {
    showNotification('A marker with this name already exists in that category', 'error');
    return;
  }
  // Parse optional ref range
  const refMin = refMinInput?.value ? parseFloat(refMinInput.value) : null;
  const refMax = refMaxInput?.value ? parseFloat(refMaxInput.value) : null;
  const optMinInput = document.getElementById('cm-opt-min');
  const optMaxInput = document.getElementById('cm-opt-max');
  const optMin = optMinInput?.value ? parseFloat(optMinInput.value) : null;
  const optMax = optMaxInput?.value ? parseFloat(optMaxInput.value) : null;
  // Save custom marker definition
  if (!state.importedData.customMarkers) state.importedData.customMarkers = {};
  const cmDef = {
    name,
    unit: (unitInput?.value || '').trim(),
    refMin: isNaN(refMin) ? null : refMin,
    refMax: isNaN(refMax) ? null : refMax,
    categoryLabel: catLabel
  };
  state.importedData.customMarkers[fullKey] = cmDef;
  // Save optimal range as refOverride if provided
  if (optMin != null && !isNaN(optMin) && optMax != null && !isNaN(optMax)) {
    if (!state.importedData.refOverrides) state.importedData.refOverrides = {};
    state.importedData.refOverrides[fullKey] = {
      ...(state.importedData.refOverrides[fullKey] || {}),
      optimalMin: optMin,
      optimalMax: optMax
    };
  }
  saveImportedData();
  window.buildSidebar();
  closeModal();
  showNotification(`Created "${name}" in ${catLabel}`, 'success');
  // Register marker and open manual entry to add first value
  const id = catKey + '_' + markerKey;
  state.markerRegistry[id] = {
    name,
    unit: (unitInput?.value || '').trim(),
    refMin: isNaN(refMin) ? null : refMin,
    refMax: isNaN(refMax) ? null : refMax,
    custom: true
  };
  setTimeout(() => openManualEntryForm(id), 100);
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

export function deleteCustomMarker(id) {
  const dotKey = id.replace('_', '.');
  const catKey = dotKey.split('.')[0];
  const def = state.importedData?.customMarkers?.[dotKey];
  if (!def) return;
  // Find all custom markers in same category
  const siblingsInCat = Object.keys(state.importedData.customMarkers).filter(k => k.startsWith(catKey + '.'));
  const isLastInCat = siblingsInCat.length <= 1;
  const msg = isLastInCat
    ? `Delete "${def.name}" and the entire "${def.categoryLabel || catKey}" category? This cannot be undone.`
    : `Delete "${def.name}" and all its values? This cannot be undone.`;
  showConfirmDialog(msg, () => {
    // Determine which keys to delete — just this marker, or all in category
    const keysToDelete = isLastInCat ? siblingsInCat : [dotKey];
    for (const key of keysToDelete) {
      // Remove from all entries
      if (state.importedData.entries) {
        for (const entry of state.importedData.entries) {
          if (entry.markers) delete entry.markers[key];
        }
      }
      // Remove manual value tracking
      if (state.importedData.manualValues) {
        for (const k of Object.keys(state.importedData.manualValues)) {
          if (k.startsWith(key + ':')) delete state.importedData.manualValues[k];
        }
      }
      // Remove ref overrides
      if (state.importedData.refOverrides) delete state.importedData.refOverrides[key];
      // Remove custom marker definition
      delete state.importedData.customMarkers[key];
    }
    // Clean up empty entries
    if (state.importedData.entries) {
      state.importedData.entries = state.importedData.entries.filter(e => Object.keys(e.markers || {}).length > 0);
    }
    saveImportedData();
    closeModal();
    window.buildSidebar();
    updateHeaderDates();
    navigate('dashboard');
    showNotification(`Deleted "${def.name}"${isLastInCat && siblingsInCat.length > 1 ? ` and ${siblingsInCat.length - 1} other marker(s)` : ''}`, 'info');
  });
}

export function editMarkerValue(id, date, currentValue, event) {
  const el = event.target.closest('.mv-value');
  if (!el || el.querySelector('input')) return;
  const input = document.createElement('input');
  input.type = 'number';
  input.step = 'any';
  input.value = currentValue;
  input.className = 'ref-edit-input';
  input.style.cssText = 'width:80px;text-align:center;font-size:inherit';
  el.textContent = '';
  el.appendChild(input);
  input.focus();
  input.select();
  const save = () => {
    const newValue = parseFloat(input.value);
    if (isNaN(newValue)) { showDetailModal(id); return; }
    const dotKey = id.replace('_', '.');
    const entry = state.importedData.entries?.find(e => e.date === date);
    if (!entry) return;
    // Track as manually edited — store original value for revert (true = manual entry with no original)
    if (!state.importedData.manualValues) state.importedData.manualValues = {};
    const mvKey = dotKey + ':' + date;
    if (!(mvKey in state.importedData.manualValues)) {
      // First edit — save original SI value for revert
      state.importedData.manualValues[mvKey] = entry.markers[dotKey] != null ? entry.markers[dotKey] : true;
    }
    const storedValue = convertDisplayToSI(dotKey, newValue);
    entry.markers[dotKey] = storedValue;
    if (dotKey === 'hormones.insulin') { entry.markers['diabetes.insulin_d'] = storedValue; recalculateHOMAIR(entry); }
    saveImportedData();
    showDetailModal(id);
  };
  input.addEventListener('blur', save);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); else if (e.key === 'Escape') showDetailModal(id); });
}

export function revertMarkerValue(id, date) {
  const dotKey = id.replace('_', '.');
  const mvKey = dotKey + ':' + date;
  const original = state.importedData.manualValues?.[mvKey];
  if (original == null || original === true) return;
  const entry = state.importedData.entries?.find(e => e.date === date);
  if (!entry) return;
  entry.markers[dotKey] = original;
  if (dotKey === 'hormones.insulin') { entry.markers['diabetes.insulin_d'] = original; recalculateHOMAIR(entry); }
  delete state.importedData.manualValues[mvKey];
  saveImportedData();
  showDetailModal(id);
}

export function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
  if (state.chartInstances["modal"]) { state.chartInstances["modal"].destroy(); delete state.chartInstances["modal"]; }
  document.removeEventListener('click', closeSuggestionsOnClickOutside);
  // Clean up any child overlays (e.g. EMF interpretation) that may have been left open
  if (window.closeEMFInterpretation) window.closeEMFInterpretation();
  // Refresh background view to reflect any edits made while modal was open
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
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
// EDITABLE REFERENCE RANGES
// ═══════════════════════════════════════════════

export function editRefRange(id, type, evt) {
  const marker = state.markerRegistry[id];
  if (!marker) return;
  const isOptimal = type === 'optimal';
  const curMin = isOptimal ? marker.optimalMin : marker.refMin;
  const curMax = isOptimal ? marker.optimalMax : marker.refMax;
  const label = isOptimal ? 'Optimal' : 'Reference';

  const span = evt.target.closest('.ref-editable');
  if (!span) return;

  // Replace span with inline inputs
  const form = document.createElement('span');
  form.className = 'ref-edit-form';
  form.innerHTML = `${label}: <input type="number" step="any" value="${curMin ?? ''}" class="ref-edit-input" id="ref-edit-min"> \u2013 <input type="number" step="any" value="${curMax ?? ''}" class="ref-edit-input" id="ref-edit-max"> <button class="ref-edit-save" onclick="saveRefRange('${id}','${type}')">Save</button>`;
  span.replaceWith(form);
  form.querySelector('#ref-edit-min').focus();

  // Enter to save
  form.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); window.saveRefRange(id, type); } });
  // Escape to cancel
  form.addEventListener('keydown', e => { if (e.key === 'Escape') showDetailModal(id); });
}

export function saveRefRange(id, type) {
  const dotKey = id.replace('_', '.');
  const minEl = document.getElementById('ref-edit-min');
  const maxEl = document.getElementById('ref-edit-max');
  if (!minEl || !maxEl) return;
  let newMin = minEl.value !== '' ? parseFloat(minEl.value) : null;
  let newMax = maxEl.value !== '' ? parseFloat(maxEl.value) : null;

  // If user is in US mode, convert back to SI for storage (overrides are applied before unit conversion)
  if (newMin != null) newMin = convertDisplayToSI(dotKey, newMin);
  if (newMax != null) newMax = convertDisplayToSI(dotKey, newMax);

  if (!state.importedData.refOverrides) state.importedData.refOverrides = {};
  if (!state.importedData.refOverrides[dotKey]) state.importedData.refOverrides[dotKey] = {};

  if (type === 'optimal') {
    state.importedData.refOverrides[dotKey].optimalMin = newMin;
    state.importedData.refOverrides[dotKey].optimalMax = newMax;
  } else {
    state.importedData.refOverrides[dotKey].refMin = newMin;
    state.importedData.refOverrides[dotKey].refMax = newMax;
  }

  saveImportedData();
  // Refresh background view, then re-render modal with new ranges
  const activeNav = document.querySelector('.nav-item.active');
  navigate(activeNav ? activeNav.dataset.category : 'dashboard');
  showDetailModal(id);
  showNotification('Range updated', 'info');
}

export function revertRefRange(id, type) {
  const dotKey = id.replace('_', '.');
  const ovr = state.importedData?.refOverrides?.[dotKey];
  if (!ovr) return;
  if (type === 'optimal') { delete ovr.optimalMin; delete ovr.optimalMax; }
  else { delete ovr.refMin; delete ovr.refMax; }
  // Clean up empty override objects
  if (Object.keys(ovr).length === 0) delete state.importedData.refOverrides[dotKey];
  saveImportedData();
  const activeNav = document.querySelector('.nav-item.active');
  navigate(activeNav ? activeNav.dataset.category : 'dashboard');
  showDetailModal(id);
  showNotification('Range reverted to default', 'info');
}

// ═══════════════════════════════════════════════
// WELCOME INTRO (profile setup on first visit)
// ═══════════════════════════════════════════════


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
  editRefRange,
  saveRefRange,
  revertRefRange,
  openManualEntryForm,
  saveManualEntry,
  openCreateMarkerModal,
  saveCustomMarker,
  deleteMarkerValue,
  deleteCustomMarker,
  editMarkerValue,
  revertMarkerValue,
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
