// glossary.js — Marker glossary modal

import { state } from './state.js';
import { escapeHTML, getStatus, formatValue } from './utils.js';
import { getActiveData, getEffectiveRange, getEffectiveRangeForDate, getLatestValueIndex } from './data.js';
import { getMarkerDescription } from './charts.js';

export function openGlossary() {
  const data = getActiveData();
  const modal = document.getElementById('glossary-modal');
  const overlay = document.getElementById('glossary-modal-overlay');
  let html = `<button class="modal-close" onclick="closeGlossary()">&times;</button>
    <h3 style="margin-bottom:12px">Marker Glossary</h3>
    <input type="text" class="glossary-search" id="glossary-search" placeholder="Search markers..." oninput="filterGlossary()">
    <div class="glossary-body" id="glossary-body">`;
  for (const [catKey, cat] of Object.entries(data.categories)) {
    const markers = Object.entries(cat.markers);
    if (markers.length === 0) continue;
    html += `<div class="glossary-category" data-cat="${catKey}">
      <div class="glossary-cat-header" onclick="this.parentElement.classList.toggle('collapsed')">
        <span>${cat.icon} ${cat.label}</span>
        <span class="glossary-cat-count">${markers.length}</span>
      </div>
      <div class="glossary-cat-body">`;
    for (const [mKey, marker] of markers) {
      const id = catKey + '_' + mKey;
      state.markerRegistry[id] = marker;
      const latestIdx = getLatestValueIndex(marker.values);
      const latestVal = latestIdx !== -1 ? marker.values[latestIdx] : null;
      const lr = getEffectiveRangeForDate(marker, latestIdx);
      const status = latestVal !== null ? getStatus(latestVal, lr.min, lr.max) : 'missing';
      const r = getEffectiveRange(marker);
      const desc = getMarkerDescription(id) || '';
      html += `<div class="glossary-marker" data-name="${escapeHTML(marker.name.toLowerCase())}" onclick="closeGlossary();showDetailModal('${id}')">
        <div class="glossary-marker-top">
          <span class="glossary-marker-name">${escapeHTML(marker.name)}</span>
          <span class="glossary-marker-value val-${status}">${latestVal !== null ? formatValue(latestVal) : '\u2014'} <span class="glossary-marker-unit">${escapeHTML(marker.unit)}</span></span>
        </div>
        <div class="glossary-marker-meta">
          ${r.min != null && r.max != null ? `<span>Ref: ${formatValue(r.min)}\u2013${formatValue(r.max)}</span>` : ''}
          ${marker.optimalMin != null ? `<span style="color:var(--green)">Opt: ${formatValue(marker.optimalMin)}\u2013${formatValue(marker.optimalMax)}</span>` : ''}
        </div>
        ${desc ? `<div class="glossary-marker-desc">${escapeHTML(desc)}</div>` : ''}
      </div>`;
    }
    html += `</div></div>`;
  }
  html += `</div>`;
  modal.innerHTML = html;
  overlay.classList.add('show');
}

export function closeGlossary() {
  document.getElementById('glossary-modal-overlay').classList.remove('show');
}

export function filterGlossary() {
  const q = (document.getElementById('glossary-search')?.value || '').toLowerCase().trim();
  const cats = document.querySelectorAll('.glossary-category');
  cats.forEach(cat => {
    const markers = cat.querySelectorAll('.glossary-marker');
    let visible = 0;
    markers.forEach(m => {
      const show = !q || m.dataset.name.includes(q);
      m.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    cat.style.display = visible > 0 || !q ? '' : 'none';
  });
}

Object.assign(window, { openGlossary, closeGlossary, filterGlossary });
