// nav.js — Sidebar, compact profile button

import { state } from './state.js';
import { escapeHTML, hashString } from './utils.js';
import { getActiveData, countFlagged } from './data.js';
import { getProfiles } from './profile.js';

function _buildNavItem(key, cat) {
  const markers = Object.values(cat.markers);
  const withData = markers.filter(m => m.values && m.values.some(v => v !== null)).length;
  if (withData === 0) return null;
  const flagged = countFlagged(markers);
  const flagHtml = flagged > 0
    ? `<span class="flag-count">${flagged}</span>`
    : `<span class="count">${withData}</span>`;
  const markerNames = markers.map(m => m.name).join('|');
  // Strip redundant group prefix from label when shown under a group header
  let label = cat.label;
  if (cat.group && label.startsWith(cat.group + ': ')) {
    label = label.slice(cat.group.length + 2);
  }
  return { withData, flagged, html: `<div class="nav-item" data-category="${key}" data-markers="${escapeHTML(markerNames)}" data-group="${escapeHTML(cat.group || '')}" tabindex="0" role="button" onclick="window.navigate('${key}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.navigate('${key}')}">
      <span class="icon">${cat.icon}</span> ${escapeHTML(label)} ${flagHtml}</div>` };
}

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

  // Separate categories into blood work (no group) and specialty groups
  const bloodWork = [];
  const specialtyGroups = {};
  for (const [key, cat] of Object.entries(data.categories)) {
    const item = _buildNavItem(key, cat);
    if (!item) continue;
    if (cat.group) {
      if (!specialtyGroups[cat.group]) specialtyGroups[cat.group] = { items: [], totalFlagged: 0 };
      specialtyGroups[cat.group].items.push(item);
      specialtyGroups[cat.group].totalFlagged += item.flagged;
    } else {
      bloodWork.push(item);
    }
  }

  // Render blood work categories
  html += `<div class="sidebar-title">Categories</div>`;
  for (const item of bloodWork) html += item.html;

  // Render specialty groups
  for (const [groupName, group] of Object.entries(specialtyGroups)) {
    const collapsed = _getGroupCollapsed(groupName);
    const flagHtml = group.totalFlagged > 0
      ? `<span class="flag-count">${group.totalFlagged}</span>`
      : '';
    html += `<div class="sidebar-group-header${collapsed ? ' collapsed' : ''}" data-group-name="${escapeHTML(groupName)}" onclick="toggleNavGroup('${escapeHTML(groupName)}')" tabindex="0" role="button" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleNavGroup('${escapeHTML(groupName)}')}">
      <span class="sidebar-group-label">${escapeHTML(groupName)}</span>
      ${flagHtml}
      <span class="sidebar-group-arrow">\u25B8</span>
    </div>`;
    html += `<div class="sidebar-group-items" data-group-items="${escapeHTML(groupName)}"${collapsed ? ' style="display:none"' : ''}>`;
    for (const item of group.items) html += item.html;
    html += `</div>`;
  }

  nav.innerHTML = html;
}

function _getGroupCollapsed(groupName) {
  try { return localStorage.getItem(`labcharts-navgroup-${groupName}`) === 'collapsed'; } catch(e) { return false; }
}

export function toggleNavGroup(groupName) {
  const header = document.querySelector(`.sidebar-group-header[data-group-name="${groupName}"]`);
  const items = document.querySelector(`.sidebar-group-items[data-group-items="${groupName}"]`);
  if (!header || !items) return;
  const isCollapsed = header.classList.toggle('collapsed');
  items.style.display = isCollapsed ? 'none' : '';
  try { localStorage.setItem(`labcharts-navgroup-${groupName}`, isCollapsed ? 'collapsed' : 'expanded'); } catch(e) {}
}

export function filterSidebar() {
  const query = (document.getElementById('sidebar-search')?.value || '').toLowerCase().trim();
  const items = document.querySelectorAll('#sidebar-nav .nav-item');
  const titles = document.querySelectorAll('#sidebar-nav .sidebar-title');
  const groupHeaders = document.querySelectorAll('#sidebar-nav .sidebar-group-header');
  const groupItemContainers = document.querySelectorAll('#sidebar-nav .sidebar-group-items');
  if (!query) {
    items.forEach(el => el.style.display = '');
    titles.forEach(el => el.style.display = '');
    // Restore saved collapse state for groups
    groupHeaders.forEach(el => {
      const gn = el.dataset.groupName;
      const collapsed = _getGroupCollapsed(gn);
      el.style.display = '';
      el.classList.toggle('collapsed', collapsed);
    });
    groupItemContainers.forEach(el => {
      const gn = el.dataset.groupItems;
      el.style.display = _getGroupCollapsed(gn) ? 'none' : '';
    });
    return;
  }
  // When searching: show matching items, expand groups with matches, hide empty groups
  items.forEach(el => {
    const cat = el.dataset.category;
    if (cat === 'dashboard' || cat === 'correlations' || cat === 'compare') { el.style.display = ''; return; }
    const label = el.textContent.toLowerCase();
    const markers = (el.dataset.markers || '').toLowerCase();
    el.style.display = (label.includes(query) || markers.includes(query)) ? '' : 'none';
  });
  titles.forEach(el => el.style.display = '');
  // Expand groups with matching items, hide groups with none
  groupItemContainers.forEach(el => {
    const gn = el.dataset.groupItems;
    const visibleItems = el.querySelectorAll('.nav-item:not([style*="display: none"])');
    const header = document.querySelector(`.sidebar-group-header[data-group-name="${gn}"]`);
    if (visibleItems.length > 0) {
      el.style.display = '';
      if (header) { header.style.display = ''; header.classList.remove('collapsed'); }
    } else {
      el.style.display = 'none';
      if (header) header.style.display = 'none';
    }
  });
}

// Avatar color palette — 10 distinct hues that work on dark & light
const AVATAR_COLORS = ['#4f8cff','#f472b6','#34d399','#fbbf24','#a78bfa','#f87171','#38bdf8','#fb923c','#22d3ee','#a3e635'];

export function getAvatarColor(id) {
  const h = parseInt(hashString(id || ''), 36);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

export function renderProfileButton() {
  const container = document.getElementById('profile-selector');
  if (!container) return;
  const profiles = getProfiles();
  const active = profiles.find(p => p.id === state.currentProfile) || profiles[0];
  if (!active) return;
  const dot = active.avatar
    ? `<img class="profile-compact-dot profile-compact-img" src="${active.avatar}" alt="">`
    : `<span class="profile-compact-dot" style="background:${getAvatarColor(active.id)}">${escapeHTML((active.name || '?')[0].toUpperCase())}</span>`;
  container.innerHTML = `<button class="profile-compact-btn" onclick="openClientList()" title="Manage clients">
    ${dot}
    <span class="profile-compact-name">${escapeHTML(active.name)}</span>
    <span class="profile-compact-arrow">\u25BC</span>
  </button>`;
}

// Keep renderProfileDropdown as alias for backward compat (tests, other modules)
export function renderProfileDropdown() { renderProfileButton(); }

Object.assign(window, { buildSidebar, filterSidebar, toggleNavGroup, renderProfileDropdown, renderProfileButton, getAvatarColor });
