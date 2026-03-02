// main.js — Entry point, DOMContentLoaded, global event listeners

import { state } from './state.js';
import './schema.js';
import './constants.js';
import './utils.js';
import { getTheme, setTheme } from './theme.js';
import { exchangeOpenRouterCode, saveOpenRouterKey, setAIProvider, fetchOpenRouterModels } from './api.js';
import { saveProfiles, getActiveProfileId, setActiveProfileId, getProfileSex, getProfileDob, profileStorageKey, migrateProfileData, initProfilesCache } from './profile.js';
import { updateHeaderDates, updateHeaderRangeToggle, registerRefreshCallback } from './data.js';
import './pii.js';
import './charts.js';
import './notes.js';
import './supplements.js';
import './recommendations.js';
import './cycle.js';
import './context-cards.js';
import './pdf-import.js';
import './export.js';
import './chat.js';
import './settings.js';
import './glossary.js';
import './feedback.js';
import './tour.js';
import { maybeShowChangelog } from './changelog.js';
import { buildSidebar, renderProfileDropdown } from './nav.js';
import './views.js';
import { initEncryption, initBroadcastChannel, encryptedGetItem } from './crypto.js';

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize encryption (shows passphrase modal if enabled, blocks until unlocked)
  await initEncryption();
  // Initialize cross-tab sync
  initBroadcastChannel();

  // Handle OpenRouter OAuth callback (?code=...)
  const urlParams = new URLSearchParams(window.location.search);
  const oauthCode = urlParams.get('code');
  if (oauthCode) {
    history.replaceState(null, '', window.location.pathname);
    try {
      const key = await exchangeOpenRouterCode(oauthCode);
      saveOpenRouterKey(key);
      setAIProvider('openrouter');
      fetchOpenRouterModels(key);
      window._openSettingsAfterInit = 'ai';
      window.showNotification('Connected to OpenRouter successfully!', 'success');
    } catch (e) {
      window.showNotification('OpenRouter connection failed: ' + e.message, 'error', 6000);
    }
  }

  // Migrate legacy data to profile system on first load
  if (!localStorage.getItem('labcharts-profiles')) {
    const profiles = [{ id: 'default', name: 'Default' }];
    await saveProfiles(profiles);
    setActiveProfileId('default');
    const oldImported = localStorage.getItem('labcharts-imported');
    if (oldImported) {
      localStorage.setItem(profileStorageKey('default', 'imported'), oldImported);
      localStorage.removeItem('labcharts-imported');
    }
    const oldUnits = localStorage.getItem('labcharts-units');
    if (oldUnits) {
      localStorage.setItem(profileStorageKey('default', 'units'), oldUnits);
      localStorage.removeItem('labcharts-units');
    }
  }
  // Populate profiles cache from (possibly encrypted) storage
  await initProfilesCache();
  // Load active profile
  state.currentProfile = getActiveProfileId();
  const savedImported = await encryptedGetItem(profileStorageKey(state.currentProfile, 'imported'));
  if (savedImported) { try { state.importedData = JSON.parse(savedImported); if (!state.importedData.notes) state.importedData.notes = []; migrateProfileData(state.importedData); } catch(e) {} }
  const savedUnits = localStorage.getItem(profileStorageKey(state.currentProfile, 'units'));
  if (savedUnits === 'US') state.unitSystem = 'US';
  const savedRange = localStorage.getItem(profileStorageKey(state.currentProfile, 'rangeMode'));
  state.rangeMode = savedRange === 'reference' ? 'reference' : savedRange === 'both' ? 'both' : 'optimal';
  state.profileSex = getProfileSex(state.currentProfile);
  state.profileDob = getProfileDob(state.currentProfile);
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  }
  document.querySelectorAll('.unit-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === state.unitSystem);
  });
  document.querySelectorAll('.sex-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sex === state.profileSex);
  });
  document.querySelectorAll('.range-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === state.rangeMode);
  });
  const dobInputInit = document.getElementById('dob-input');
  if (dobInputInit) dobInputInit.value = state.profileDob || '';
  setTheme(getTheme());
  buildSidebar();
  window.showDashboard();
  maybeShowChangelog();
  if (window._openSettingsAfterInit) {
    window.openSettingsModal(window._openSettingsAfterInit);
    delete window._openSettingsAfterInit;
  }
  updateHeaderDates();
  updateHeaderRangeToggle();
  renderProfileDropdown();
  document.getElementById("pdf-input").addEventListener("change", async e => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const jsonFiles = files.filter(f => f.name.endsWith('.json') || f.type === 'application/json');
      const pdfFiles = files.filter(f => f.name.endsWith('.pdf') || f.type === 'application/pdf');
      for (const f of jsonFiles) window.importDataJSON(f);
      if (pdfFiles.length === 1) await window.handlePDFFile(pdfFiles[0]);
      else if (pdfFiles.length > 1) await window.handleBatchPDFs(pdfFiles);
      e.target.value = '';
    }
  });
  // Prevent browser from opening dropped files outside drop zone
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => e.preventDefault());
});

// ═══════════════════════════════════════════════
// GLOBAL EVENT LISTENERS
// ═══════════════════════════════════════════════
document.addEventListener("click", e => {
  if (e.target.id === "modal-overlay") window.closeModal();
  if (e.target.id === "import-modal-overlay") {
    const importModal = document.getElementById("import-modal");
    if (!importModal.innerHTML.trim()) { window.closeImportModal(); }
    else { importModal.classList.add("modal-nudge"); importModal.addEventListener("animationend", () => importModal.classList.remove("modal-nudge"), { once: true }); }
  }
  if (e.target.id === "settings-modal-overlay") window.closeSettingsModal();
  if (e.target.id === "glossary-modal-overlay") window.closeGlossary();
  if (e.target.id === "changelog-modal-overlay") window.closeChangelog();
  if (e.target.id === "feedback-modal-overlay") window.closeFeedbackModal();
  const dd = document.getElementById("corr-options");
  const si = document.getElementById("corr-search");
  if (dd && si && !dd.contains(e.target) && e.target !== si) dd.classList.remove("show");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    // Passphrase overlay should not be dismissible via Escape
    const passphraseOverlay = document.getElementById("passphrase-overlay");
    if (passphraseOverlay && passphraseOverlay.style.display === 'flex') return;
    const tourOverlay = document.getElementById("tour-overlay");
    if (tourOverlay) { window.endTour(); return; }
    const confirmOverlay = document.getElementById("confirm-dialog-overlay");
    if (confirmOverlay && confirmOverlay.classList.contains("show")) { confirmOverlay.classList.remove("show"); return; }
    const chatPanel = document.getElementById("chat-panel");
    if (chatPanel && chatPanel.classList.contains("open")) { window.closeChatPanel(); return; }
    const importOverlay = document.getElementById("import-modal-overlay");
    if (importOverlay && importOverlay.classList.contains("show")) {
      if (!document.getElementById("import-modal").innerHTML.trim()) window.closeImportModal();
      return;
    }
    const changelogOverlay = document.getElementById("changelog-modal-overlay");
    if (changelogOverlay && changelogOverlay.classList.contains("show")) { window.closeChangelog(); return; }
    const feedbackOverlay = document.getElementById("feedback-modal-overlay");
    if (feedbackOverlay && feedbackOverlay.classList.contains("show")) { window.closeFeedbackModal(); return; }
    const glossaryOverlay = document.getElementById("glossary-modal-overlay");
    if (glossaryOverlay && glossaryOverlay.classList.contains("show")) { window.closeGlossary(); return; }
    const settingsOverlay = document.getElementById("settings-modal-overlay");
    if (settingsOverlay && settingsOverlay.classList.contains("show")) { window.closeSettingsModal(); return; }
    const modalOverlay = document.getElementById("modal-overlay");
    if (modalOverlay && modalOverlay.classList.contains("show")) { window.closeModal(); return; }
    return;
  }
  // Focus trap for open modals
  if (e.key === "Tab") {
    const overlayIds = ["changelog-modal-overlay","settings-modal-overlay","import-modal-overlay","glossary-modal-overlay","feedback-modal-overlay","modal-overlay"];
    for (const oid of overlayIds) {
      const ov = document.getElementById(oid);
      if (ov && ov.classList.contains("show")) {
        const modal = ov.querySelector('[role="dialog"]') || ov.querySelector('.modal') || ov;
        const focusable = modal.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
        else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
        return;
      }
    }
  }
  // Skip shortcuts when typing in an input/textarea or when modifier keys are held
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (e.key === "c" || e.key === "C") { e.preventDefault(); window.toggleChatPanel(); }
  if (e.key === "/") { e.preventDefault(); const sb = document.getElementById("sidebar-search"); if (sb) { sb.focus(); sb.select(); } }
});

// ═══════════════════════════════════════════════
// REFRESH CALLBACK
// ═══════════════════════════════════════════════
registerRefreshCallback(() => {
  buildSidebar();
  const activeNav = document.querySelector('.nav-item.active');
  window.navigate(activeNav ? activeNav.dataset.category : 'dashboard');
});
