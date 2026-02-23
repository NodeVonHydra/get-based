// nav.js — Sidebar, profile dropdown

import { state } from './state.js';
import { escapeHTML, showNotification } from './utils.js';
import { getActiveData, countFlagged } from './data.js';
import { getProfiles, createProfile, renameProfile, switchProfile } from './profile.js';

export function buildSidebar(data) {
  if (!data) data = getActiveData();
  const nav = document.getElementById("sidebar-nav");
  let html = `<input type="text" class="sidebar-search" id="sidebar-search" placeholder="Search markers..." oninput="filterSidebar()">`;
  html += `<div class="nav-item active" data-category="dashboard" tabindex="0" role="button" onclick="window.navigate('dashboard')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.navigate('dashboard')}">
    <span class="icon">\uD83D\uDCCB</span> Dashboard</div>`;
  html += `<div class="nav-item" data-category="correlations" tabindex="0" role="button" onclick="window.navigate('correlations')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.navigate('correlations')}">
    <span class="icon">\uD83D\uDCC8</span> Correlations</div>`;
  html += `<div class="nav-item" data-category="compare" tabindex="0" role="button" onclick="window.navigate('compare')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.navigate('compare')}">
    <span class="icon">\u2194</span> Compare Dates</div>`;
  html += `<div class="sidebar-title">Categories</div>`;
  for (const [key, cat] of Object.entries(data.categories)) {
    const markers = Object.values(cat.markers);
    const withData = markers.filter(m => m.values && m.values.some(v => v !== null)).length;
    if (withData === 0) continue;
    const flagged = countFlagged(markers);
    const flagHtml = flagged > 0
      ? `<span class="flag-count">${flagged}</span>`
      : `<span class="count">${withData}</span>`;
    const markerNames = markers.map(m => m.name).join('|');
    html += `<div class="nav-item" data-category="${key}" data-markers="${escapeHTML(markerNames)}" tabindex="0" role="button" onclick="window.navigate('${key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.navigate('${key}')}">
      <span class="icon">${cat.icon}</span> ${escapeHTML(cat.label)} ${flagHtml}</div>`;
  }
  nav.innerHTML = html;
}

export function filterSidebar() {
  const query = (document.getElementById('sidebar-search')?.value || '').toLowerCase().trim();
  const items = document.querySelectorAll('#sidebar-nav .nav-item');
  const titles = document.querySelectorAll('#sidebar-nav .sidebar-title');
  if (!query) {
    items.forEach(el => el.style.display = '');
    titles.forEach(el => el.style.display = '');
    return;
  }
  items.forEach(el => {
    const cat = el.dataset.category;
    if (cat === 'dashboard' || cat === 'correlations' || cat === 'compare') { el.style.display = ''; return; }
    const label = el.textContent.toLowerCase();
    const markers = (el.dataset.markers || '').toLowerCase();
    el.style.display = (label.includes(query) || markers.includes(query)) ? '' : 'none';
  });
  titles.forEach(el => el.style.display = '');
}

export function renderProfileDropdown() {
  const container = document.getElementById('profile-selector');
  if (!container) return;
  const profiles = getProfiles();
  const active = profiles.find(p => p.id === state.currentProfile) || profiles[0];
  if (!active) return;

  let html = `<div class="profile-dropdown">
    <button class="profile-dropdown-btn" onclick="toggleProfileMenu()">
      <span class="profile-label">${escapeHTML(active.name)}</span>
      <span class="profile-arrow">\u25BC</span>
    </button>
    <div class="profile-menu" id="profile-menu">`;

  for (const p of profiles) {
    const isActive = p.id === state.currentProfile;
    html += `<div class="profile-menu-item${isActive ? ' active' : ''}" onclick="switchProfile('${p.id}')">
      <span class="profile-name">${escapeHTML(p.name)}</span>
      <span class="profile-menu-actions">
        <button class="profile-menu-action" onclick="event.stopPropagation();promptRenameProfile('${p.id}')" title="Rename">Rename</button>
        <button class="profile-menu-action delete" onclick="event.stopPropagation();deleteProfile('${p.id}')" title="Delete">\u2715</button>
      </span>
    </div>`;
  }

  html += `<div class="profile-menu-divider"></div>
    <div class="profile-menu-new" onclick="promptCreateProfile()">+ New Profile</div>
    </div></div>`;
  container.innerHTML = html;
}

export function toggleProfileMenu() {
  const menu = document.getElementById('profile-menu');
  const btn = document.querySelector('.profile-dropdown-btn');
  if (!menu) return;
  const show = !menu.classList.contains('show');
  menu.classList.toggle('show', show);
  if (btn) btn.classList.toggle('open', show);
}

export function promptCreateProfile() {
  const name = prompt('Enter profile name:');
  if (!name || !name.trim()) return;
  const id = createProfile(name.trim());
  toggleProfileMenu();
  switchProfile(id);
}

export function promptRenameProfile(id) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === id);
  if (!p) return;
  const name = prompt('Rename profile:', p.name);
  if (!name || !name.trim() || name.trim() === p.name) return;
  renameProfile(id, name.trim());
  renderProfileDropdown();
  showNotification(`Profile renamed to "${name.trim()}"`, 'info');
}

// Close profile menu on click outside
document.addEventListener('click', (e) => {
  const dropdown = document.querySelector('.profile-dropdown');
  if (dropdown && !dropdown.contains(e.target)) {
    const menu = document.getElementById('profile-menu');
    const btn = document.querySelector('.profile-dropdown-btn');
    if (menu) menu.classList.remove('show');
    if (btn) btn.classList.remove('open');
  }
});

Object.assign(window, { buildSidebar, filterSidebar, renderProfileDropdown, toggleProfileMenu, promptCreateProfile, promptRenameProfile });
