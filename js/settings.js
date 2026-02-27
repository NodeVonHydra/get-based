// settings.js — Settings modal (profile, display, AI provider, privacy)

import { state } from './state.js';
import { escapeHTML, showNotification, isDebugMode, setDebugMode, isPIIReviewEnabled, setPIIReviewEnabled } from './utils.js';
import { getTheme, setTheme, getTimeFormat, setTimeFormat } from './theme.js';
import { getApiKey, saveApiKey, getVeniceKey, saveVeniceKey, getOpenRouterKey, saveOpenRouterKey, /* ROUTSTR DISABLED: getRoutstrKey, saveRoutstrKey, */ getAIProvider, setAIProvider, getAnthropicModel, setAnthropicModel, getVeniceModel, setVeniceModel, getOpenRouterModel, setOpenRouterModel, /* ROUTSTR DISABLED: getRoutstrModel, setRoutstrModel, */ getOllamaMainModel, setOllamaMainModel, getOllamaPIIModel, setOllamaPIIModel, getOllamaPIIUrl, setOllamaPIIUrl, validateApiKey, validateVeniceKey, validateOpenRouterKey, /* ROUTSTR DISABLED: validateRoutstrKey, */ fetchAnthropicModels, fetchVeniceModels, fetchOpenRouterModels, /* ROUTSTR DISABLED: fetchRoutstrModels, */ renderModelPricingHint, getAnthropicModelDisplay, getVeniceModelDisplay, getOpenRouterModelDisplay /* ROUTSTR DISABLED: , getRoutstrModelDisplay */ } from './api.js';
import { getProfileLocation, updateLocationLat } from './profile.js';
import { getOllamaConfig, checkOllama, saveOllamaConfig } from './pii.js';
import { renderEncryptionSection, renderBackupSection, loadBackupSnapshots } from './crypto.js';


// ═══════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════
let _activeSettingsTab = 'profile';

export function openSettingsModal(tab) {
  const overlay = document.getElementById('settings-modal-overlay');
  const modal = document.getElementById('settings-modal');
  const currentTheme = getTheme();
  const provider = getAIProvider();
  if (tab) _activeSettingsTab = tab;

  modal.innerHTML = `
    <button class="modal-close" onclick="closeSettingsModal()">&times;</button>
    <h3>Settings</h3>

    <div class="settings-tabs-bar">
      <button class="settings-tab-btn${_activeSettingsTab === 'profile' ? ' active' : ''}" data-tab="profile" onclick="switchSettingsTab('profile')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Profile
      </button>
      <button class="settings-tab-btn${_activeSettingsTab === 'display' ? ' active' : ''}" data-tab="display" onclick="switchSettingsTab('display')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        Display
      </button>
      <button class="settings-tab-btn${_activeSettingsTab === 'ai' ? ' active' : ''}" data-tab="ai" onclick="switchSettingsTab('ai')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>
        AI
      </button>
      <button class="settings-tab-btn${_activeSettingsTab === 'data' ? ' active' : ''}" data-tab="data" onclick="switchSettingsTab('data')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        Data
      </button>
    </div>

    <!-- Profile Tab -->
    <div class="settings-tab-panel${_activeSettingsTab === 'profile' ? ' active' : ''}" data-tab-panel="profile">
      <div class="settings-section">
        <label class="settings-label">Sex</label>
        <div class="sex-toggle">
          <button class="sex-toggle-btn${state.profileSex === 'male' ? ' active' : ''}" data-sex="male" onclick="switchSex('male');updateSettingsUI()">&#9794;</button>
          <button class="sex-toggle-btn${state.profileSex === 'female' ? ' active' : ''}" data-sex="female" onclick="switchSex('female');updateSettingsUI()">&#9792;</button>
        </div>
      </div>

      <div class="settings-section">
        <label class="settings-label">Date of Birth</label>
        <div class="dob-input">
          <input type="date" id="dob-input" value="${state.profileDob || ''}" onchange="switchDob(this.value)">
        </div>
      </div>

      <div class="settings-section">
        <label class="settings-label">Location <span style="font-weight:400;color:var(--text-muted);font-size:11px">(for latitude / circadian context)</span></label>
        <div class="loc-inputs">
          <input class="ctx-note-input" id="loc-country" placeholder="Country" value="${escapeHTML(getProfileLocation().country)}" oninput="updateLocationLat()">
          <input class="ctx-note-input loc-zip-input" id="loc-zip" placeholder="ZIP / postal code (refines latitude)" value="${escapeHTML(getProfileLocation().zip)}" oninput="updateLocationLat()">
        </div>
        <div id="loc-lat-display" style="font-size:11px;margin-top:4px"></div>
      </div>
    </div>

    <!-- Display Tab -->
    <div class="settings-tab-panel${_activeSettingsTab === 'display' ? ' active' : ''}" data-tab-panel="display">
      <div class="settings-section">
        <label class="settings-label">Unit System</label>
        <div class="unit-toggle">
          <button class="unit-toggle-btn${state.unitSystem === 'EU' ? ' active' : ''}" data-unit="EU" onclick="switchUnitSystem('EU');updateSettingsUI()">EU (SI)</button>
          <button class="unit-toggle-btn${state.unitSystem === 'US' ? ' active' : ''}" data-unit="US" onclick="switchUnitSystem('US');updateSettingsUI()">US</button>
        </div>
      </div>

      <div class="settings-section">
        <label class="settings-label">Range Display</label>
        <div class="range-toggle">
          <button class="range-toggle-btn${state.rangeMode === 'optimal' ? ' active' : ''}" data-range="optimal" onclick="switchRangeMode('optimal');updateSettingsUI()">Optimal</button>
          <button class="range-toggle-btn${state.rangeMode === 'reference' ? ' active' : ''}" data-range="reference" onclick="switchRangeMode('reference');updateSettingsUI()">Reference</button>
          <button class="range-toggle-btn${state.rangeMode === 'both' ? ' active' : ''}" data-range="both" onclick="switchRangeMode('both');updateSettingsUI()">Both</button>
        </div>
      </div>

      <div class="settings-section">
        <label class="settings-label">Theme</label>
        <div class="settings-theme-toggle">
          <button class="settings-theme-btn${currentTheme === 'dark' ? ' active' : ''}" onclick="setTheme('dark');updateSettingsUI();destroyAllCharts();navigate(document.querySelector('.nav-item.active')?.dataset.category||'dashboard')">Dark</button>
          <button class="settings-theme-btn${currentTheme === 'light' ? ' active' : ''}" onclick="setTheme('light');updateSettingsUI();destroyAllCharts();navigate(document.querySelector('.nav-item.active')?.dataset.category||'dashboard')">Light</button>
        </div>
      </div>

      <div class="settings-section">
        <label class="settings-label">Time Format</label>
        <div class="unit-toggle">
          <button class="time-toggle-btn${getTimeFormat() === '24h' ? ' active' : ''}" data-timefmt="24h" onclick="setTimeFormat('24h');updateSettingsUI()">24h</button>
          <button class="time-toggle-btn${getTimeFormat() === '12h' ? ' active' : ''}" data-timefmt="12h" onclick="setTimeFormat('12h');updateSettingsUI()">12h (AM/PM)</button>
        </div>
      </div>

      <div class="settings-section">
        <label class="settings-label">Guided Tour</label>
        <button class="import-btn import-btn-secondary" onclick="closeSettingsModal();setTimeout(()=>startTour(false),300)">Take a Tour</button>
      </div>

      <div class="settings-section">
        <label class="settings-label">Changelog</label>
        <button class="import-btn import-btn-secondary" onclick="closeSettingsModal();setTimeout(()=>openChangelog(true),300)">What's New</button>
      </div>

      <div style="margin-top:16px;text-align:center;font-size:11px;color:var(--text-muted);font-family:var(--font-mono);opacity:0.6">v${escapeHTML(window.APP_VERSION || '')} · <span id="settings-commit-hash">···</span></div>
    </div>

    <!-- AI Tab -->
    <div class="settings-tab-panel${_activeSettingsTab === 'ai' ? ' active' : ''}" data-tab-panel="ai">
      <div class="settings-group-title">Provider</div>

      <div class="settings-section">
        <div class="ai-provider-desc" style="margin-bottom:10px">For medical data like blood work, state-of-the-art models give the most accurate analysis. Claude is recommended — fastest and best results.</div>
        <div class="ai-provider-toggle">
          <button class="ai-provider-btn${provider === 'openrouter' ? ' active' : ''}" data-provider="openrouter" onclick="switchAIProvider('openrouter')"><svg class="ai-provider-logo" viewBox="0 0 512 512" fill="currentColor" stroke="currentColor"><path d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945" stroke-width="90" fill="none"/><path d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z" stroke="none"/><path d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377" stroke-width="90" fill="none"/><path d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z" stroke="none"/></svg> OpenRouter</button>
          <button class="ai-provider-btn${provider === 'anthropic' ? ' active' : ''}" data-provider="anthropic" onclick="switchAIProvider('anthropic')"><svg class="ai-provider-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg> Claude</button>
          <!-- ROUTSTR DISABLED — waiting for CORS fix (github.com/Routstr/routstr-core/issues/375)
          <button class="ai-provider-btn${provider === 'routstr' ? ' active' : ''}" data-provider="routstr" onclick="switchAIProvider('routstr')"><svg class="ai-provider-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg> Routstr</button>
          -->
          <button class="ai-provider-btn${provider === 'venice' ? ' active' : ''}" data-provider="venice" onclick="switchAIProvider('venice')"><svg class="ai-provider-logo" viewBox="0 0 326 366" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M105.481 245.984C99.4744 241.518 92.2244 237.777 84.2074 235.504C76.1903 233.231 67.406 232.427 58.8167 233.38C50.2272 234.332 41.8327 237.042 34.5086 241.017C27.1847 244.991 20.931 250.231 16.0487 255.905C11.1531 261.567 6.88803 268.522 4.0314 276.35C1.17477 284.178-0.273403 292.879 0.0448796 301.515C0.36299 310.152 2.44756 318.723 5.87231 326.319C9.29724 333.916 14.0625 340.538 19.3617 345.825C24.6482 351.124 31.2704 355.889 38.867 359.314C46.4637 362.739 55.0349 364.823 63.671 365.142C72.3073 365.46 81.0085 364.012 88.8366 361.155C96.6647 358.298 103.62 354.033 109.282 349.138C114.956 344.256 120.195 338.002 124.17 330.678C128.144 323.354 130.854 314.959 131.807 306.37C132.76 297.781 131.956 288.996 129.683 280.979C127.41 272.962 123.668 265.712 119.203 259.705L133.953 244.954L144.69 255.691H150.789L158.149 248.331V242.233L147.412 231.496L163 215.908L178.588 231.496L167.851 242.233V248.331L175.211 255.691H181.31L192.047 244.954L206.797 259.705C202.332 265.712 198.59 272.962 196.317 280.979C194.044 288.996 193.24 297.781 194.193 306.37C195.146 314.959 197.856 323.354 201.83 330.678C205.805 338.002 211.044 344.256 216.718 349.138C222.38 354.033 229.335 358.298 237.163 361.155C244.991 364.012 253.693 365.46 262.329 365.142C270.965 364.823 279.536 362.739 287.133 359.314C294.73 355.889 301.352 351.124 306.638 345.825C311.937 340.538 316.703 333.916 320.128 326.319C323.552 318.723 325.637 310.152 325.955 301.515C326.273 292.879 324.825 284.178 321.969 276.35C319.112 268.522 314.847 261.567 309.951 255.905C305.069 250.231 298.815 244.991 291.491 241.017C284.167 237.042 275.773 234.332 267.183 233.38C258.594 232.427 249.81 233.231 241.793 235.504C233.776 237.777 226.526 241.518 220.519 245.984L206.042 231.484L216.773 220.753V214.655L209.151 207.032H203.052L192.315 217.769L176.721 202.186L258.473 120.434L291.567 153.528V119.095H326L292.907 86.0012L326 52.9077V46.8095L318.377 39.1865H312.279L163 188.465L13.7212 39.1865H7.62295L0 46.8095V52.9077L33.0934 86.0012L0 119.095H34.4331V153.528L67.5263 120.434L149.279 202.186L133.685 217.769L122.948 207.032H116.849L109.226 214.655V220.753L119.958 231.484L105.481 245.984ZM238.144 321.715C234.778 328.62 235.477 338.188 239.811 344.531C243.793 351.1 252.216 355.693 259.895 355.484C267.574 355.693 275.997 351.1 279.979 344.531C284.313 338.188 285.012 328.62 281.646 321.715L282.484 320.812C289.389 324.196 298.971 323.511 305.324 319.178C311.904 315.2 316.508 306.768 316.297 299.081C316.508 291.395 311.904 282.963 305.324 278.984C298.971 274.652 289.389 273.966 282.484 277.351L281.646 276.448C285.012 269.543 284.313 259.974 279.979 253.632C275.997 247.063 267.574 242.469 259.895 242.679C252.216 242.469 243.793 247.063 239.811 253.632C235.477 259.974 234.778 269.543 238.144 276.448L237.306 277.351C230.401 273.966 220.818 274.652 214.466 278.984C207.886 282.963 203.282 291.395 203.492 299.081C203.282 306.768 207.886 315.2 214.466 319.178C220.818 323.511 230.401 324.196 237.306 320.812L238.144 321.715ZM86.1857 344.531C90.52 338.188 91.2191 328.62 87.8528 321.715L88.6913 320.812C95.5956 324.196 105.178 323.511 111.531 319.178C118.11 315.2 122.715 306.768 122.504 299.081C122.715 291.395 118.11 282.963 111.531 278.984C105.178 274.652 95.5956 273.966 88.6913 277.351L87.8528 276.448C91.2191 269.543 90.52 259.974 86.1857 253.632C82.2037 247.063 73.7808 242.469 66.1018 242.679C58.423 242.469 50.0001 247.063 46.0181 253.632C41.6839 259.974 40.9847 269.543 44.351 276.448L43.5126 277.351C36.6082 273.966 27.0255 274.652 20.6731 278.984C14.0932 282.963 9.48904 291.395 9.69934 299.081C9.48904 306.768 14.0932 315.2 20.6731 319.178C27.0255 323.511 36.6082 324.196 43.5126 320.812L44.351 321.715C40.9847 328.62 41.6839 338.188 46.0181 344.531C50.0001 351.1 58.423 355.693 66.1018 355.484C73.7808 355.693 82.2037 351.1 86.1857 344.531Z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M162.891 39.1864L202.078 0L221.482 19.4047V84.8147L167.742 138.555H158.04L104.3 84.8147V19.4047L123.705 0L162.891 39.1864ZM123.705 13.7213L158.04 48.0567V111.112L123.705 76.7773V13.7213ZM167.744 48.0567L202.079 13.7213V76.7773L167.744 111.112V48.0567Z"/></svg> Venice</button>
          <button class="ai-provider-btn${provider === 'ollama' ? ' active' : ''}" data-provider="ollama" onclick="switchAIProvider('ollama')"><svg class="ai-provider-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M16.361 10.26a.894.894 0 0 0-.558.47l-.072.148.001.207c0 .193.004.217.059.353.076.193.152.312.291.448.24.238.51.3.872.205a.86.86 0 0 0 .517-.436.752.752 0 0 0 .08-.498c-.064-.453-.33-.782-.724-.897a1.06 1.06 0 0 0-.466 0zm-9.203.005c-.305.096-.533.32-.65.639a1.187 1.187 0 0 0-.06.52c.057.309.31.59.598.667.362.095.632.033.872-.205.14-.136.215-.255.291-.448.055-.136.059-.16.059-.353l.001-.207-.072-.148a.894.894 0 0 0-.565-.472 1.02 1.02 0 0 0-.474.007Zm4.184 2c-.131.071-.223.25-.195.383.031.143.157.288.353.407.105.063.112.072.117.136.004.038-.01.146-.029.243-.02.094-.036.194-.036.222.002.074.07.195.143.253.064.052.076.054.255.059.164.005.198.001.264-.03.169-.082.212-.234.15-.525-.052-.243-.042-.28.087-.355.137-.08.281-.219.324-.314a.365.365 0 0 0-.175-.48.394.394 0 0 0-.181-.033c-.126 0-.207.03-.355.124l-.085.053-.053-.032c-.219-.13-.259-.145-.391-.143a.396.396 0 0 0-.193.032zm.39-2.195c-.373.036-.475.05-.654.086-.291.06-.68.195-.951.328-.94.46-1.589 1.226-1.787 2.114-.04.176-.045.234-.045.53 0 .294.005.357.043.524.264 1.16 1.332 2.017 2.714 2.173.3.033 1.596.033 1.896 0 1.11-.125 2.064-.727 2.493-1.571.114-.226.169-.372.22-.602.039-.167.044-.23.044-.523 0-.297-.005-.355-.045-.531-.288-1.29-1.539-2.304-3.072-2.497a6.873 6.873 0 0 0-.855-.031zm.645.937a3.283 3.283 0 0 1 1.44.514c.223.148.537.458.671.662.166.251.26.508.303.82.02.143.01.251-.043.482-.08.345-.332.705-.672.957a3.115 3.115 0 0 1-.689.348c-.382.122-.632.144-1.525.138-.582-.006-.686-.01-.853-.042-.57-.107-1.022-.334-1.35-.68-.264-.28-.385-.535-.45-.946-.03-.192.025-.509.137-.776.136-.326.488-.73.836-.963.403-.269.934-.46 1.422-.512.187-.02.586-.02.773-.002zm-5.503-11a1.653 1.653 0 0 0-.683.298C5.617.74 5.173 1.666 4.985 2.819c-.07.436-.119 1.04-.119 1.503 0 .544.064 1.24.155 1.721.02.107.031.202.023.208a8.12 8.12 0 0 1-.187.152 5.324 5.324 0 0 0-.949 1.02 5.49 5.49 0 0 0-.94 2.339 6.625 6.625 0 0 0-.023 1.357c.091.78.325 1.438.727 2.04l.13.195-.037.064c-.269.452-.498 1.105-.605 1.732-.084.496-.095.629-.095 1.294 0 .67.009.803.088 1.266.095.555.288 1.143.503 1.534.071.128.243.393.264.407.007.003-.014.067-.046.141a7.405 7.405 0 0 0-.548 1.873c-.062.417-.071.552-.071.991 0 .56.031.832.148 1.279L3.42 24h1.478l-.05-.091c-.297-.552-.325-1.575-.068-2.597.117-.472.25-.819.498-1.296l.148-.29v-.177c0-.165-.003-.184-.057-.293a.915.915 0 0 0-.194-.25 1.74 1.74 0 0 1-.385-.543c-.424-.92-.506-2.286-.208-3.451.124-.486.329-.918.544-1.154a.787.787 0 0 0 .223-.531c0-.195-.07-.355-.224-.522a3.136 3.136 0 0 1-.817-1.729c-.14-.96.114-2.005.69-2.834.563-.814 1.353-1.336 2.237-1.475.199-.033.57-.028.776.01.226.04.367.028.512-.041.179-.085.268-.19.374-.431.093-.215.165-.333.36-.576.234-.29.46-.489.822-.729.413-.27.884-.467 1.352-.561.17-.035.25-.04.569-.04.319 0 .398.005.569.04a4.07 4.07 0 0 1 1.914.997c.117.109.398.457.488.602.034.057.095.177.132.267.105.241.195.346.374.43.14.068.286.082.503.045.343-.058.607-.053.943.016 1.144.23 2.14 1.173 2.581 2.437.385 1.108.276 2.267-.296 3.153-.097.15-.193.27-.333.419-.301.322-.301.722-.001 1.053.493.539.801 1.866.708 3.036-.062.772-.26 1.463-.533 1.854a2.096 2.096 0 0 1-.224.258.916.916 0 0 0-.194.25c-.054.109-.057.128-.057.293v.178l.148.29c.248.476.38.823.498 1.295.253 1.008.231 2.01-.059 2.581a.845.845 0 0 0-.044.098c0 .006.329.009.732.009h.73l.02-.074.036-.134c.019-.076.057-.3.088-.516.029-.217.029-1.016 0-1.258-.11-.875-.295-1.57-.597-2.226-.032-.074-.053-.138-.046-.141.008-.005.057-.074.108-.152.376-.569.607-1.284.724-2.228.031-.26.031-1.378 0-1.628-.083-.645-.182-1.082-.348-1.525a6.083 6.083 0 0 0-.329-.7l-.038-.064.131-.194c.402-.604.636-1.262.727-2.04a6.625 6.625 0 0 0-.024-1.358 5.512 5.512 0 0 0-.939-2.339 5.325 5.325 0 0 0-.95-1.02 8.097 8.097 0 0 1-.186-.152.692.692 0 0 1 .023-.208c.208-1.087.201-2.443-.017-3.503-.19-.924-.535-1.658-.98-2.082-.354-.338-.716-.482-1.15-.455-.996.059-1.8 1.205-2.116 3.01a6.805 6.805 0 0 0-.097.726c0 .036-.007.066-.015.066a.96.96 0 0 1-.149-.078A4.857 4.857 0 0 0 12 3.03c-.832 0-1.687.243-2.456.698a.958.958 0 0 1-.148.078c-.008 0-.015-.03-.015-.066a6.71 6.71 0 0 0-.097-.725C8.997 1.392 8.337.319 7.46.048a2.096 2.096 0 0 0-.585-.041Zm.293 1.402c.248.197.523.759.682 1.388.03.113.06.244.069.292.007.047.026.152.041.233.067.365.098.76.102 1.24l.002.475-.12.175-.118.178h-.278c-.324 0-.646.041-.954.124l-.238.06c-.033.007-.038-.003-.057-.144a8.438 8.438 0 0 1 .016-2.323c.124-.788.413-1.501.696-1.711.067-.05.079-.049.157.013zm9.825-.012c.17.126.358.46.498.888.28.854.36 2.028.212 3.145-.019.14-.024.151-.057.144l-.238-.06a3.693 3.693 0 0 0-.954-.124h-.278l-.119-.178-.119-.175.002-.474c.004-.669.066-1.19.214-1.772.157-.623.434-1.185.68-1.382.078-.062.09-.063.159-.012z"/></svg> Ollama</button>
        </div>
        <div id="ai-provider-panel">${renderAIProviderPanel(provider)}</div>
      </div>

      <div class="settings-group-title">PDF Import Privacy</div>

      <div class="settings-section" id="privacy-section">
        ${renderPrivacySection()}
      </div>
    </div>

    <!-- Data Tab -->
    <div class="settings-tab-panel${_activeSettingsTab === 'data' ? ' active' : ''}" data-tab-panel="data">
      <div class="settings-group-title">Security</div>

      <div class="settings-section" id="encryption-section">
        ${renderEncryptionSection()}
      </div>

      <div class="settings-group-title">Backup &amp; Restore</div>

      <div class="settings-section" id="backup-section">
        ${renderBackupSection()}
      </div>
    </div>`;
  overlay.classList.add('show');
  updateLocationLat();
  initSettingsOllamaCheck();
  initSettingsModelFetch();
  loadBackupSnapshots();
  loadSettingsCommitHash();
}

function loadSettingsCommitHash() {
  const el = document.getElementById('settings-commit-hash');
  if (!el) return;
  fetch('https://api.github.com/repos/elkimek/get-based/commits/main', { headers: { Accept: 'application/vnd.github.sha' } })
    .then(r => r.ok ? r.text() : Promise.reject())
    .then(sha => { const short = sha.slice(0, 7); const e = document.getElementById('settings-commit-hash'); if (e) e.innerHTML = `<a href="https://github.com/elkimek/get-based/commit/${short}" target="_blank" rel="noopener" style="color:var(--text-muted);text-decoration:none">${short}</a>`; })
    .catch(() => { const e = document.getElementById('settings-commit-hash'); if (e) e.textContent = ''; });
}

export function switchSettingsTab(tabId) {
  _activeSettingsTab = tabId;
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  modal.querySelectorAll('.settings-tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.dataset.tabPanel === tabId);
  });
  // Re-run init for tabs that need async setup
  if (tabId === 'ai') {
    initSettingsOllamaCheck();
    initSettingsModelFetch();
  }
  if (tabId === 'data') {
    loadBackupSnapshots();
  }
  if (tabId === 'profile') {
    updateLocationLat();
  }
}

export function renderAIProviderPanel(provider) {
  if (provider === 'anthropic') {
    const currentKey = getApiKey();
    let cachedModels = []; try { cachedModels = JSON.parse(localStorage.getItem('labcharts-anthropic-models') || '[]'); } catch(e) {}
    const currentModel = getAnthropicModel();
    let modelHtml;
    if (cachedModels.length > 0) {
      const opts = cachedModels.map(function(m) {
        const label = m.display_name || m.id;
        return '<option value="' + m.id + '"' + (currentModel === m.id ? ' selected' : '') + '>' + label + '</option>';
      }).join('');
      modelHtml = `<div style="margin-top:12px" id="anthropic-model-area">
        <label style="font-size:12px;color:var(--text-muted)">Model</label>
        <select class="api-key-input" id="anthropic-model-select" style="margin-top:4px" onchange="setAnthropicModel(this.value);updateAnthropicModelPricing(this.value)">${opts}</select>
        <div id="anthropic-model-pricing" style="margin-top:4px">${renderModelPricingHint('anthropic', currentModel)}</div>
      </div>`;
    } else {
      modelHtml = `<div style="margin-top:12px;font-size:12px;color:var(--text-muted)" id="anthropic-model-area">Model: <span style="color:var(--text-primary)">${escapeHTML(getAnthropicModelDisplay())}</span>${currentKey ? ' <span style="font-size:11px">(save key to load models)</span>' : ''}</div>`;
    }
    return `<div class="ai-provider-panel">
      <div class="ai-provider-desc">Anthropic's AI models, run in the cloud. Requires an API key (pay-per-use).</div>
      <div class="api-key-status" id="api-key-status">
        ${currentKey ? '<span style="color:var(--green)">&#10003; Connected</span>' : '<span style="color:var(--text-muted)">No key set</span>'}
      </div>
      <input type="password" class="api-key-input" id="api-key-input" placeholder="sk-ant-api03-..." value="${currentKey}">
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="import-btn import-btn-primary" id="save-api-key-btn" onclick="handleSaveApiKey()">Save & Validate</button>
        ${currentKey ? '<button class="import-btn import-btn-secondary" onclick="handleRemoveApiKey()">Remove Key</button>' : ''}
      </div>
      ${modelHtml}
      <div class="api-key-notice">Your API key is stored locally in your browser and sent directly to Anthropic's API. It never passes through any third-party server.</div>
    </div>`;
  }
  if (provider === 'openrouter') {
    const currentKey = getOpenRouterKey();
    const orModel = getOpenRouterModel();
    let cachedORModels = []; try { cachedORModels = JSON.parse(localStorage.getItem('labcharts-openrouter-models') || '[]'); } catch(e) {}
    let orModelHtml;
    if (cachedORModels.length > 0) {
      const opts = cachedORModels.map(function(m) {
        const label = m.name || m.id;
        return '<option value="' + m.id + '"' + (orModel === m.id ? ' selected' : '') + '>' + escapeHTML(label) + '</option>';
      }).join('');
      orModelHtml = `<div style="margin-top:12px" id="openrouter-model-area">
        <label style="font-size:12px;color:var(--text-muted)">Model</label>
        <select class="api-key-input" id="openrouter-model-select" style="margin-top:4px" onchange="setOpenRouterModel(this.value);updateOpenRouterModelPricing(this.value)">${opts}</select>
        <div id="openrouter-model-pricing" style="margin-top:4px">${renderModelPricingHint('openrouter', orModel)}</div>
      </div>`;
    } else {
      orModelHtml = `<div style="margin-top:12px;font-size:12px;color:var(--text-muted)" id="openrouter-model-area">Model: <span style="color:var(--text-primary)">${escapeHTML(getOpenRouterModelDisplay())}</span>${currentKey ? ' <span style="font-size:11px">(save key to load models)</span>' : ''}</div>`;
    }
    return `<div class="ai-provider-panel">
      <div class="ai-provider-desc">API marketplace routing to 200+ models (Claude, GPT, Llama, Gemini, and more). Pay-per-use with a single key.</div>
      ${currentKey ? '' : '<button class="or-oauth-btn" onclick="startOpenRouterOAuth()">Connect with OpenRouter</button><div class="or-oauth-divider"><span>or enter key manually</span></div>'}
      <div class="api-key-status" id="openrouter-key-status">
        ${currentKey ? '<span style="color:var(--green)">&#10003; Connected</span>' : '<span style="color:var(--text-muted)">No key set</span>'}
      </div>
      <input type="password" class="api-key-input" id="openrouter-key-input" placeholder="sk-or-..." value="${currentKey}">
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="import-btn import-btn-primary" id="save-openrouter-key-btn" onclick="handleSaveOpenRouterKey()">Save & Validate</button>
        ${currentKey ? '<button class="import-btn import-btn-secondary" onclick="handleRemoveOpenRouterKey()">Remove Key</button>' : ''}
      </div>
      ${orModelHtml}
      <div class="api-key-notice">Your key is stored locally and sent directly to OpenRouter. <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" style="color:var(--accent)">Get an API key</a></div>
    </div>`;
  }
  /* ROUTSTR DISABLED — waiting for CORS fix (github.com/Routstr/routstr-core/issues/375)
  if (provider === 'routstr') { ... }
  */
  if (provider === 'venice') {
    const currentKey = getVeniceKey();
    const veniceModel = getVeniceModel();
    let cachedVeniceModels = []; try { cachedVeniceModels = JSON.parse(localStorage.getItem('labcharts-venice-models') || '[]'); } catch(e) {}
    let veniceModelHtml;
    if (cachedVeniceModels.length > 0) {
      const opts = cachedVeniceModels.map(function(m) {
        const label = m.name || m.id;
        return '<option value="' + m.id + '"' + (veniceModel === m.id ? ' selected' : '') + '>' + escapeHTML(label) + '</option>';
      }).join('');
      veniceModelHtml = `<div style="margin-top:12px" id="venice-model-area">
        <label style="font-size:12px;color:var(--text-muted)">Model</label>
        <select class="api-key-input" id="venice-model-select" style="margin-top:4px" onchange="setVeniceModel(this.value);updateVeniceModelPricing(this.value)">${opts}</select>
        <div id="venice-model-pricing" style="margin-top:4px">${renderModelPricingHint('venice', veniceModel)}</div>
      </div>`;
    } else {
      veniceModelHtml = `<div style="margin-top:12px;font-size:12px;color:var(--text-muted)" id="venice-model-area">Model: <span style="color:var(--text-primary)">${escapeHTML(getVeniceModelDisplay())}</span>${currentKey ? ' <span style="font-size:11px">(save key to load models)</span>' : ''}</div>`;
    }
    return `<div class="ai-provider-panel">
      <div class="ai-provider-desc">Privacy-focused cloud AI. Uncensored models, no data stored. Requires API key.</div>
      <div class="api-key-status" id="venice-key-status">
        ${currentKey ? '<span style="color:var(--green)">&#10003; Connected</span>' : '<span style="color:var(--text-muted)">No key set</span>'}
      </div>
      <input type="password" class="api-key-input" id="venice-key-input" placeholder="venice-..." value="${currentKey}">
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="import-btn import-btn-primary" id="save-venice-key-btn" onclick="handleSaveVeniceKey()">Save & Validate</button>
        ${currentKey ? '<button class="import-btn import-btn-secondary" onclick="handleRemoveVeniceKey()">Remove Key</button>' : ''}
      </div>
      ${veniceModelHtml}
      <div class="api-key-notice">Your key is stored locally and sent directly to Venice AI. No data is stored on their servers. <a href="https://venice.ai/settings/api" target="_blank" rel="noopener" style="color:var(--accent)">Get an API key</a></div>
    </div>`;
  }
  // Local AI (Ollama) panel
  const config = getOllamaConfig();
  return `<div class="ai-provider-panel">
    <div class="ai-provider-desc">Runs AI on your computer. Free, private, no data leaves your machine. Requires Apple M-chip, CPU with NPU, or a strong GPU.</div>
    <div class="ollama-status" id="ollama-status">
      <span class="ollama-status-dot" id="ollama-dot"></span>
      <span id="ollama-status-text">Checking connection...</span>
    </div>
    <div style="margin-top:8px">
      <label style="font-size:12px;color:var(--text-muted)">Server address</label>
      <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
        <input type="text" class="api-key-input" id="ollama-url-input" value="${config.url}" placeholder="http://localhost:11434" style="flex:1">
        <button class="import-btn import-btn-secondary" onclick="testOllamaConnection()" style="white-space:nowrap">Test</button>
      </div>
    </div>
    <div id="ollama-model-section" style="margin-top:8px;display:none">
      <label style="font-size:12px;color:var(--text-muted)">AI Model</label>
      <select class="api-key-input" id="ollama-model-select" style="margin-top:4px" onchange="setOllamaMainModel(this.value)"></select>
      <div style="margin-top:4px">${renderModelPricingHint('ollama', '')}</div>
    </div>
    <div class="api-key-notice" style="margin-top:12px">
      Requires <a href="https://ollama.com" target="_blank" rel="noopener" style="color:var(--accent)">Ollama</a> installed on your computer. After installing, run <code style="font-size:11px;padding:2px 4px;background:var(--bg-primary);border-radius:3px">ollama pull llama3.2</code> to get a model.
    </div>
  </div>`;
}

export function renderPrivacySection() {
  const piiUrl = getOllamaPIIUrl();
  return `<div class="ollama-settings">
    <div class="ai-provider-desc" style="margin-bottom:10px">Before your lab PDF is sent to AI for analysis, personal information (name, date of birth, ID numbers, address) is detected and replaced with fake data. Only lab results and marker values reach the AI provider.</div>
    <div class="privacy-status-card" id="privacy-status-card">
      <div class="privacy-status-icon" id="privacy-status-icon">&#128274;</div>
      <div class="privacy-status-body">
        <div class="privacy-status-title" id="privacy-status-title">Checking...</div>
        <div class="privacy-status-detail" id="privacy-status-detail"></div>
      </div>
    </div>
    <div class="privacy-configure-toggle" onclick="togglePrivacyConfigure()">
      <span class="privacy-configure-arrow" id="privacy-configure-arrow">&#9654;</span>
      Configure Local AI
    </div>
    <div class="privacy-configure-body" id="privacy-configure-body" style="display:none">
      <div id="pii-model-section">
        <div class="ollama-status" id="pii-ollama-status">
          <span class="ollama-status-dot" id="pii-ollama-dot"></span>
          <span id="pii-ollama-status-text">Click Test to check</span>
        </div>
        <div style="margin-top:8px">
          <label style="font-size:12px;color:var(--text-muted)">Server address</label>
          <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
            <input type="text" class="api-key-input" id="pii-ollama-url-input" value="${piiUrl}" placeholder="http://localhost:11434" style="flex:1">
            <button class="import-btn import-btn-secondary" onclick="testPIIOllamaConnection()" style="white-space:nowrap">Test</button>
          </div>
        </div>
        <div id="pii-model-dropdown" style="margin-top:8px;display:none">
          <label style="font-size:12px;color:var(--text-muted)">Privacy model <span style="font-size:11px">(can be a smaller, faster model)</span></label>
          <select class="api-key-input" id="pii-model-select" style="margin-top:4px" onchange="setOllamaPIIModel(this.value)"></select>
        </div>
      </div>
      <div style="margin-top:8px">
        <label style="font-size:13px;cursor:pointer;display:flex;align-items:start;gap:6px">
          <input type="checkbox" id="pii-review-toggle" style="margin-top:2px" ${isPIIReviewEnabled() ? 'checked' : ''} onchange="setPIIReviewEnabled(this.checked)">
          <span>Review obfuscated text before sending to AI<br><span style="font-size:11px;color:var(--text-muted)">Pause after privacy protection to inspect what AI will receive</span></span>
        </label>
      </div>
      <div style="margin-top:8px">
        <label style="font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px">
          <input type="checkbox" id="debug-mode-toggle" ${isDebugMode() ? 'checked' : ''} onchange="setDebugMode(this.checked)">
          Show privacy details in import preview
        </label>
      </div>
    </div>
  </div>`;
}

export function togglePrivacyConfigure() {
  const body = document.getElementById('privacy-configure-body');
  const arrow = document.getElementById('privacy-configure-arrow');
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.innerHTML = open ? '&#9654;' : '&#9660;';
}

export async function updatePrivacyStatusCard(enhanced) {
  const icon = document.getElementById('privacy-status-icon');
  const title = document.getElementById('privacy-status-title');
  const detail = document.getElementById('privacy-status-detail');
  const card = document.getElementById('privacy-status-card');
  if (!title || !detail || !card) return;
  // If not passed explicitly, check PII Ollama
  if (enhanced === undefined) {
    try {
      const piiUrl = getOllamaPIIUrl();
      const resp = await fetch(`${piiUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
      if (resp.ok) {
        const data = await resp.json();
        const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
        enhanced = models.length > 0;
      } else {
        enhanced = false;
      }
    } catch { enhanced = false; }
  }
  if (enhanced) {
    const model = getOllamaPIIModel();
    card.className = 'privacy-status-card privacy-status-enhanced';
    if (icon) icon.innerHTML = '&#128274;';
    title.textContent = 'Enhanced protection';
    detail.textContent = `Local AI (${model}) understands context and language, so it reliably finds and replaces all personal info — including uncommon formats and non-English text.`;
  } else {
    card.className = 'privacy-status-card privacy-status-basic';
    if (icon) icon.innerHTML = '&#128274;';
    title.textContent = 'Basic protection';
    detail.innerHTML = 'Regex pattern matching catches common formats (names on labeled lines, IDs, emails, phone numbers). May miss unusual layouts or non-English personal data.<br><span style="margin-top:4px;display:inline-block">Install <a href="https://ollama.com" target="_blank" rel="noopener" style="color:var(--accent)">Ollama</a> for enhanced protection — a free local AI that reliably catches all personal info.</span>';
  }
}

export function switchAIProvider(provider) {
  setAIProvider(provider);
  const panel = document.getElementById('ai-provider-panel');
  if (panel) panel.innerHTML = renderAIProviderPanel(provider);
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.querySelectorAll('.ai-provider-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.provider === provider));
  }
  initSettingsOllamaCheck();
  initSettingsModelFetch();
}

export function initSettingsModelFetch() {
  const key = getApiKey();
  if (key && document.getElementById('anthropic-model-area')) {
    fetchAnthropicModels(key).then(function(models) { if (models.length) renderAnthropicModelDropdown(models); });
  }
  const orKey = getOpenRouterKey();
  if (orKey && document.getElementById('openrouter-model-area')) {
    fetchOpenRouterModels(orKey).then(function(models) { if (models.length) renderOpenRouterModelDropdown(models); });
  }
  /* ROUTSTR DISABLED
  const routstrKey = getRoutstrKey();
  if (routstrKey && document.getElementById('routstr-model-area')) {
    fetchRoutstrModels(routstrKey).then(function(models) { if (models.length) renderRoutstrModelDropdown(models); });
  }
  */
  const veniceKey = getVeniceKey();
  if (veniceKey && document.getElementById('venice-model-area')) {
    fetchVeniceModels(veniceKey).then(function(models) { if (models.length) renderVeniceModelDropdown(models); });
  }
}

export function initSettingsOllamaCheck() {
  const mainUrl = getOllamaConfig().url;
  const piiUrl = getOllamaPIIUrl();
  const sameUrl = mainUrl === piiUrl;

  // Check main Ollama if the panel is visible (Ollama provider selected)
  if (document.getElementById('ollama-dot')) {
    checkOllama().then(result => {
      const dot = document.getElementById('ollama-dot');
      const text = document.getElementById('ollama-status-text');
      const modelSection = document.getElementById('ollama-model-section');
      const modelSelect = document.getElementById('ollama-model-select');
      if (!dot || !text) return;
      if (result.available && result.models.length > 0) {
        dot.classList.add('connected');
        let currentModel = getOllamaMainModel();
        if (!result.models.includes(currentModel)) {
          currentModel = result.models[0];
          setOllamaMainModel(currentModel);
        }
        text.textContent = `Connected (${currentModel})`;
        if (modelSection && modelSelect) {
          modelSection.style.display = 'block';
          modelSelect.innerHTML = result.models.map(m => `<option value="${escapeHTML(m)}" ${m === currentModel ? 'selected' : ''}>${escapeHTML(m)}</option>`).join('');
        }
      } else if (result.available) {
        dot.classList.add('disconnected');
        text.textContent = 'Connected but no models found. Run: ollama pull llama3.2';
      } else {
        dot.classList.add('disconnected');
        text.textContent = 'Not connected — start Ollama to use';
      }
      // Reuse result for privacy card if same URL
      if (sameUrl) {
        updatePrivacyStatusCard(result.available && result.models.length > 0);
      } else {
        updatePrivacyStatusCard();
      }
    });
  } else {
    // Main panel not visible — just update privacy card
    updatePrivacyStatusCard();
  }
}

export function updateSettingsUI() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.querySelectorAll('.sex-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.sex === state.profileSex));
  modal.querySelectorAll('.unit-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.unit === state.unitSystem));
  modal.querySelectorAll('.range-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.range === state.rangeMode));
  const theme = getTheme();
  modal.querySelectorAll('.settings-theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === theme);
  });
  const timeFmt = getTimeFormat();
  modal.querySelectorAll('.time-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.timefmt === timeFmt));
}

export function closeSettingsModal() {
  document.getElementById('settings-modal-overlay').classList.remove('show');
}

export async function testOllamaConnection() {
  const urlInput = document.getElementById('ollama-url-input');
  const dot = document.getElementById('ollama-dot');
  const text = document.getElementById('ollama-status-text');
  const modelSection = document.getElementById('ollama-model-section');
  const modelSelect = document.getElementById('ollama-model-select');
  if (!urlInput || !text) return;
  const url = urlInput.value.trim().replace(/\/+$/, '');
  text.textContent = 'Testing...';
  dot.className = 'ollama-status-dot';
  try {
    const resp = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
    if (models.length === 0) {
      dot.classList.add('disconnected');
      text.textContent = 'Connected but no models found. Run: ollama pull llama3.2';
    } else {
      dot.classList.add('connected');
      saveOllamaConfig({ url, model: models[0] });
      if (!localStorage.getItem('labcharts-ollama-model')) setOllamaMainModel(models[0]);
      text.textContent = `Connected (${getOllamaMainModel()})`;
      if (modelSection && modelSelect) {
        const currentModel = getOllamaMainModel();
        modelSection.style.display = 'block';
        modelSelect.innerHTML = models.map(m => `<option value="${escapeHTML(m)}" ${m === currentModel ? 'selected' : ''}>${escapeHTML(m)}</option>`).join('');
      }
    }
    // Also refresh privacy section status
    initSettingsOllamaCheck();
    updatePrivacyStatusCard();
  } catch {
    dot.classList.add('disconnected');
    text.textContent = 'Not connected — check URL and ensure Ollama is running';
  }
}

export async function testPIIOllamaConnection() {
  const urlInput = document.getElementById('pii-ollama-url-input');
  const dot = document.getElementById('pii-ollama-dot');
  const text = document.getElementById('pii-ollama-status-text');
  const piiDropdown = document.getElementById('pii-model-dropdown');
  const piiSelect = document.getElementById('pii-model-select');
  if (!urlInput || !text) return;
  const url = urlInput.value.trim().replace(/\/+$/, '');
  text.textContent = 'Testing...';
  dot.className = 'ollama-status-dot';
  try {
    const resp = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
    if (models.length === 0) {
      dot.classList.add('disconnected');
      text.textContent = 'Connected but no models found';
    } else {
      dot.classList.add('connected');
      setOllamaPIIUrl(url);
      let currentPII = getOllamaPIIModel();
      if (!models.includes(currentPII)) { currentPII = models[0]; setOllamaPIIModel(currentPII); }
      text.textContent = `Connected — using ${currentPII}`;
      if (piiDropdown && piiSelect) {
        piiDropdown.style.display = 'block';
        piiSelect.innerHTML = models.map(m => `<option value="${escapeHTML(m)}" ${m === currentPII ? 'selected' : ''}>${escapeHTML(m)}</option>`).join('');
      }
    }
    updatePrivacyStatusCard();
  } catch {
    dot.classList.add('disconnected');
    text.textContent = 'Not connected — check URL and ensure Ollama is running';
    updatePrivacyStatusCard();
  }
}

export function updateAnthropicModelPricing(modelId) {
  const el = document.getElementById('anthropic-model-pricing');
  if (el) el.innerHTML = renderModelPricingHint('anthropic', modelId || getAnthropicModel());
}

export function updateVeniceModelPricing(modelId) {
  const el = document.getElementById('venice-model-pricing');
  if (el) el.innerHTML = renderModelPricingHint('venice', modelId || getVeniceModel());
}

export async function handleSaveApiKey() {
  const input = document.getElementById('api-key-input');
  const btn = document.getElementById('save-api-key-btn');
  const status = document.getElementById('api-key-status');
  const key = input.value.trim();
  if (!key) { status.innerHTML = '<span style="color:var(--red)">Please enter an API key</span>'; return; }
  btn.disabled = true; btn.textContent = 'Validating...';
  const result = await validateApiKey(key);
  if (result.valid) {
    saveApiKey(key);
    status.innerHTML = '<span style="color:var(--green)">Connected — loading models…</span>';
    const models = await fetchAnthropicModels(key);
    if (models.length) {
      renderAnthropicModelDropdown(models);
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    } else {
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    }
    showNotification('API key saved', 'success');
  } else {
    status.innerHTML = `<span style="color:var(--red)">${result.error}</span>`;
  }
  btn.disabled = false; btn.textContent = 'Save & Validate';
}

export function handleRemoveApiKey() {
  localStorage.removeItem('labcharts-api-key');
  localStorage.removeItem('labcharts-anthropic-models');
  localStorage.removeItem('labcharts-anthropic-model');
  showNotification('API key removed', 'info');
  openSettingsModal();
}

export function renderAnthropicModelDropdown(models) {
  const area = document.getElementById('anthropic-model-area');
  if (!area || !models.length) return;
  const currentModel = getAnthropicModel();
  const opts = models.map(function(m) {
    const label = m.display_name || m.id;
    return '<option value="' + m.id + '"' + (currentModel === m.id ? ' selected' : '') + '>' + label + '</option>';
  }).join('');
  area.innerHTML = '<label style="font-size:12px;color:var(--text-muted)">Model</label>' +
    '<select class="api-key-input" id="anthropic-model-select" style="margin-top:4px" onchange="setAnthropicModel(this.value);updateAnthropicModelPricing(this.value)">' + opts + '</select>' +
    '<div id="anthropic-model-pricing" style="margin-top:4px">' + renderModelPricingHint('anthropic', currentModel) + '</div>';
}

export async function handleSaveVeniceKey() {
  const input = document.getElementById('venice-key-input');
  const btn = document.getElementById('save-venice-key-btn');
  const status = document.getElementById('venice-key-status');
  const key = input.value.trim();
  if (!key) { status.innerHTML = '<span style="color:var(--red)">Please enter an API key</span>'; return; }
  btn.disabled = true; btn.textContent = 'Validating...';
  const result = await validateVeniceKey(key);
  if (result.valid) {
    saveVeniceKey(key);
    status.innerHTML = '<span style="color:var(--green)">Connected — loading models…</span>';
    const models = await fetchVeniceModels(key);
    if (models.length) {
      renderVeniceModelDropdown(models);
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    } else {
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    }
    showNotification('Venice API key saved', 'success');
  } else {
    status.innerHTML = `<span style="color:var(--red)">${result.error}</span>`;
  }
  btn.disabled = false; btn.textContent = 'Save & Validate';
}

export function handleRemoveVeniceKey() {
  localStorage.removeItem('labcharts-venice-key');
  localStorage.removeItem('labcharts-venice-models');
  localStorage.removeItem('labcharts-venice-model');
  showNotification('Venice API key removed', 'info');
  openSettingsModal();
}

export function renderVeniceModelDropdown(models) {
  const area = document.getElementById('venice-model-area');
  if (!area || !models.length) return;
  const currentModel = getVeniceModel();
  const opts = models.map(function(m) {
    const label = m.name || m.id;
    return '<option value="' + m.id + '"' + (currentModel === m.id ? ' selected' : '') + '>' + escapeHTML(label) + '</option>';
  }).join('');
  area.innerHTML = '<label style="font-size:12px;color:var(--text-muted)">Model</label>' +
    '<select class="api-key-input" id="venice-model-select" style="margin-top:4px" onchange="setVeniceModel(this.value);updateVeniceModelPricing(this.value)">' + opts + '</select>' +
    '<div id="venice-model-pricing" style="margin-top:4px">' + renderModelPricingHint('venice', currentModel) + '</div>';
}

export function updateOpenRouterModelPricing(modelId) {
  const el = document.getElementById('openrouter-model-pricing');
  if (el) el.innerHTML = renderModelPricingHint('openrouter', modelId || getOpenRouterModel());
}

export async function handleSaveOpenRouterKey() {
  const input = document.getElementById('openrouter-key-input');
  const btn = document.getElementById('save-openrouter-key-btn');
  const status = document.getElementById('openrouter-key-status');
  const key = input.value.trim();
  if (!key) { status.innerHTML = '<span style="color:var(--red)">Please enter an API key</span>'; return; }
  btn.disabled = true; btn.textContent = 'Validating...';
  const result = await validateOpenRouterKey(key);
  if (result.valid) {
    saveOpenRouterKey(key);
    status.innerHTML = '<span style="color:var(--green)">Connected — loading models\u2026</span>';
    const models = await fetchOpenRouterModels(key);
    if (models.length) {
      renderOpenRouterModelDropdown(models);
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    } else {
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    }
    showNotification('OpenRouter API key saved', 'success');
  } else {
    status.innerHTML = `<span style="color:var(--red)">${result.error}</span>`;
  }
  btn.disabled = false; btn.textContent = 'Save & Validate';
}

export function handleRemoveOpenRouterKey() {
  localStorage.removeItem('labcharts-openrouter-key');
  localStorage.removeItem('labcharts-openrouter-models');
  localStorage.removeItem('labcharts-openrouter-model');
  localStorage.removeItem('labcharts-openrouter-pricing');
  showNotification('OpenRouter API key removed', 'info');
  openSettingsModal();
}

export function renderOpenRouterModelDropdown(models) {
  const area = document.getElementById('openrouter-model-area');
  if (!area || !models.length) return;
  const currentModel = getOpenRouterModel();
  const opts = models.map(function(m) {
    const label = m.name || m.id;
    return '<option value="' + m.id + '"' + (currentModel === m.id ? ' selected' : '') + '>' + escapeHTML(label) + '</option>';
  }).join('');
  area.innerHTML = '<label style="font-size:12px;color:var(--text-muted)">Model</label>' +
    '<select class="api-key-input" id="openrouter-model-select" style="margin-top:4px" onchange="setOpenRouterModel(this.value);updateOpenRouterModelPricing(this.value)">' + opts + '</select>' +
    '<div id="openrouter-model-pricing" style="margin-top:4px">' + renderModelPricingHint('openrouter', currentModel) + '</div>';
}

/* ROUTSTR DISABLED — waiting for CORS fix (github.com/Routstr/routstr-core/issues/375)
export function updateRoutstrModelPricing(modelId) { ... }
export async function handleSaveRoutstrKey() { ... }
export function handleRemoveRoutstrKey() { ... }
export function renderRoutstrModelDropdown(models) { ... }
*/






Object.assign(window, {
  openSettingsModal,
  closeSettingsModal,
  switchSettingsTab,
  renderAIProviderPanel,
  renderPrivacySection,
  togglePrivacyConfigure,
  updatePrivacyStatusCard,
  switchAIProvider,
  initSettingsModelFetch,
  initSettingsOllamaCheck,
  updateSettingsUI,
  testOllamaConnection,
  testPIIOllamaConnection,
  updateAnthropicModelPricing,
  updateVeniceModelPricing,
  updateOpenRouterModelPricing,
  // ROUTSTR DISABLED: updateRoutstrModelPricing,
  handleSaveApiKey,
  handleRemoveApiKey,
  renderAnthropicModelDropdown,
  handleSaveVeniceKey,
  handleRemoveVeniceKey,
  renderVeniceModelDropdown,
  handleSaveOpenRouterKey,
  handleRemoveOpenRouterKey,
  renderOpenRouterModelDropdown,
  /* ROUTSTR DISABLED
  handleSaveRoutstrKey,
  handleRemoveRoutstrKey,
  renderRoutstrModelDropdown,
  */
});
