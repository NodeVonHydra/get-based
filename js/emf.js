// emf.js — Baubiologie EMF Assessment sub-module
// Room-by-room EMF measurements with SBM-2015 severity ratings

import { state } from './state.js';
import { SBM_2015_THRESHOLDS, getEMFSeverity } from './schema.js';
import { EMF_ROOM_PRESETS, EMF_SOURCES, EMF_MITIGATIONS } from './constants.js';
import { escapeHTML, showNotification } from './utils.js';
import { saveImportedData } from './data.js';

// ═══════════════════════════════════════════════
// MEASUREMENT TYPES (display order)
// ═══════════════════════════════════════════════
const MEASUREMENT_TYPES = [
  { key: 'acElectric',       short: 'AC Electric' },
  { key: 'acMagnetic',       short: 'AC Magnetic' },
  { key: 'rfMicrowave',      short: 'RF/Microwave' },
  { key: 'dirtyElectricity', short: 'Dirty Elec.' },
  { key: 'dcMagnetic',       short: 'DC Magnetic' },
];

// ═══════════════════════════════════════════════
// DATA HELPERS
// ═══════════════════════════════════════════════
function ensureAssessments() {
  if (!state.importedData.emfAssessment) {
    state.importedData.emfAssessment = { assessments: [] };
  }
  return state.importedData.emfAssessment.assessments;
}

function newRoom(name) {
  return {
    name: name || 'Bedroom',
    location: '',
    measurements: {},
    sources: [],
    mitigations: [],
    note: ''
  };
}

function newAssessment() {
  return {
    id: 'emf_' + Date.now(),
    date: new Date().toISOString().slice(0, 10),
    label: '',
    consultant: '',
    rooms: [newRoom('Bedroom')],
    note: ''
  };
}

/** Worst severity across all rooms in an assessment */
export function getWorstSeverity(assessment) {
  let worst = null;
  let worstIdx = -1;
  const tierOrder = ['green', 'yellow', 'orange', 'red'];
  for (const room of assessment.rooms) {
    for (const [type, m] of Object.entries(room.measurements || {})) {
      if (m && m.value != null) {
        const sev = getEMFSeverity(type, m.value);
        if (sev) {
          const idx = tierOrder.indexOf(sev.color);
          if (idx > worstIdx) { worst = sev; worstIdx = idx; }
        }
      }
    }
  }
  return worst;
}

/** Summary string for Environment card */
export function getEMFSummary() {
  const emf = state.importedData.emfAssessment;
  if (!emf || !emf.assessments || emf.assessments.length === 0) return '';
  const sorted = [...emf.assessments].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const worst = getWorstSeverity(latest);
  const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `EMF: ${sorted.length} assessment${sorted.length > 1 ? 's' : ''} (latest: ${fmtDate(latest.date)}${worst ? ', ' + worst.label : ''})`;
}

// ═══════════════════════════════════════════════
// SEVERITY DOT
// ═══════════════════════════════════════════════
function severityDot(type, value) {
  const sev = getEMFSeverity(type, value);
  if (!sev) return '';
  return `<span class="emf-severity-dot" style="background:var(--${sev.color})" title="${sev.label}"></span>`;
}

function severityBadge(assessment) {
  const worst = getWorstSeverity(assessment);
  if (!worst) return '<span class="emf-badge emf-badge-none">No data</span>';
  return `<span class="emf-badge emf-badge-${worst.color}">${worst.label}</span>`;
}

// ═══════════════════════════════════════════════
// EDITOR UI
// ═══════════════════════════════════════════════
let _editingAssessmentId = null;

export function openEMFAssessmentEditor() {
  const modal = document.getElementById('detail-modal');
  const overlay = document.getElementById('modal-overlay');
  _editingAssessmentId = null;
  renderEMFEditor(modal);
  overlay.classList.add('show');
}

function renderEMFEditor(modal) {
  const assessments = ensureAssessments();
  const sorted = [...assessments].sort((a, b) => b.date.localeCompare(a.date));

  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Baubiologie EMF Assessment</h3>
    <div class="modal-unit">Room-by-room electromagnetic field measurements rated against SBM-2015 sleeping area standards.</div>
    <div class="emf-editor-actions">
      <button class="import-btn import-btn-primary" onclick="addEMFAssessment()">+ New Assessment</button>
    </div>`;

  if (sorted.length === 0) {
    html += `<div class="emf-empty">No assessments yet. Add one manually or import a consultant's PDF report.</div>`;
  } else {
    for (const a of sorted) {
      const isExpanded = _editingAssessmentId === a.id;
      const fmtDate = new Date(a.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      html += `<div class="emf-assessment-card${isExpanded ? ' expanded' : ''}">
        <div class="emf-assessment-header" onclick="toggleEMFAssessment('${a.id}')">
          <div class="emf-assessment-info">
            <span class="emf-assessment-date">${fmtDate}</span>
            ${a.label ? `<span class="emf-assessment-label">${escapeHTML(a.label)}</span>` : ''}
            ${a.consultant ? `<span class="emf-assessment-consultant">by ${escapeHTML(a.consultant)}</span>` : ''}
          </div>
          ${severityBadge(a)}
        </div>`;

      if (isExpanded) {
        html += renderAssessmentDetail(a);
      }
      html += `</div>`;
    }
  }

  modal.innerHTML = html;
}

function renderAssessmentDetail(a) {
  let html = `<div class="emf-assessment-detail">
    <div class="emf-meta-row">
      <label>Date <input type="date" class="emf-input" value="${a.date}" onchange="updateEMFField('${a.id}','date',this.value)"></label>
      <label>Label <input type="text" class="emf-input" value="${escapeHTML(a.label)}" placeholder="e.g. Pre-mitigation" onchange="updateEMFField('${a.id}','label',this.value)"></label>
      <label>Consultant <input type="text" class="emf-input" value="${escapeHTML(a.consultant)}" placeholder="Optional" onchange="updateEMFField('${a.id}','consultant',this.value)"></label>
    </div>`;

  for (let ri = 0; ri < a.rooms.length; ri++) {
    html += renderRoomCard(a.id, ri, a.rooms[ri]);
  }

  html += `<button class="import-btn import-btn-secondary emf-add-room" onclick="addEMFRoom('${a.id}')">+ Add Room</button>
    <div class="emf-meta-row">
      <label style="flex:1">Notes <input type="text" class="emf-input" value="${escapeHTML(a.note)}" placeholder="General assessment notes" onchange="updateEMFField('${a.id}','note',this.value)"></label>
    </div>
    <div class="emf-assessment-footer">
      <button class="import-btn import-btn-primary" onclick="saveEMFData()">Save All</button>
      <button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red)" onclick="deleteEMFAssessment('${a.id}')">Delete Assessment</button>
    </div>
  </div>`;
  return html;
}

function renderRoomCard(assessmentId, roomIdx, room) {
  const roomOptions = EMF_ROOM_PRESETS.map(r =>
    `<option value="${escapeHTML(r)}"${room.name === r ? ' selected' : ''}>${escapeHTML(r)}</option>`
  ).join('');

  let html = `<div class="emf-room-card">
    <div class="emf-room-header">
      <select class="emf-input emf-room-select" onchange="updateEMFRoom('${assessmentId}',${roomIdx},'name',this.value)">
        ${roomOptions}
        <option value="_custom"${EMF_ROOM_PRESETS.includes(room.name) ? '' : ' selected'}>Custom...</option>
      </select>`;
  if (!EMF_ROOM_PRESETS.includes(room.name)) {
    html += `<input type="text" class="emf-input" value="${escapeHTML(room.name)}" placeholder="Room name" onchange="updateEMFRoom('${assessmentId}',${roomIdx},'name',this.value)">`;
  }
  html += `<input type="text" class="emf-input emf-location" value="${escapeHTML(room.location)}" placeholder="Location (e.g. bed pillow area)" onchange="updateEMFRoom('${assessmentId}',${roomIdx},'location',this.value)">
      ${a_rooms_length(assessmentId) > 1 ? `<button class="emf-remove-room" onclick="removeEMFRoom('${assessmentId}',${roomIdx})" title="Remove room">&times;</button>` : ''}
    </div>
    <div class="emf-measurements">`;

  for (const mt of MEASUREMENT_TYPES) {
    const def = SBM_2015_THRESHOLDS[mt.key];
    const m = (room.measurements && room.measurements[mt.key]) || {};
    const val = m.value != null ? m.value : '';
    html += `<div class="emf-measurement-row">
      <span class="emf-measurement-label">${mt.short}</span>
      <input type="number" class="emf-input emf-value-input" value="${val}" step="any" placeholder="—"
        onchange="updateEMFMeasurement('${assessmentId}',${roomIdx},'${mt.key}',this.value)">
      <span class="emf-measurement-unit">${def.unit}</span>
      ${val !== '' ? severityDot(mt.key, parseFloat(val)) : '<span class="emf-severity-dot-placeholder"></span>'}
      <input type="text" class="emf-input emf-meter-input" value="${escapeHTML(m.meter || '')}" placeholder="Meter"
        onchange="updateEMFMeter('${assessmentId}',${roomIdx},'${mt.key}',this.value)">
    </div>`;
  }

  html += `</div>`;

  // Sources
  html += `<div class="emf-tags-section">
    <label class="emf-tags-label">Sources identified</label>
    <div class="ctx-tags" id="emf-sources-${assessmentId}-${roomIdx}">
      ${EMF_SOURCES.map(s => `<button type="button" class="ctx-tag${(room.sources || []).includes(s) ? ' active' : ''}" onclick="toggleCtxTag(this)">${escapeHTML(s)}</button>`).join('')}
    </div></div>`;

  // Mitigations
  html += `<div class="emf-tags-section">
    <label class="emf-tags-label">Mitigations applied</label>
    <div class="ctx-tags" id="emf-mits-${assessmentId}-${roomIdx}">
      ${EMF_MITIGATIONS.map(s => `<button type="button" class="ctx-tag${(room.mitigations || []).includes(s) ? ' active' : ''}" onclick="toggleCtxTag(this)">${escapeHTML(s)}</button>`).join('')}
    </div></div>`;

  html += `<input type="text" class="emf-input emf-room-note" value="${escapeHTML(room.note)}" placeholder="Room notes" onchange="updateEMFRoom('${assessmentId}',${roomIdx},'note',this.value)">
  </div>`;
  return html;
}

function a_rooms_length(assessmentId) {
  const assessments = ensureAssessments();
  const a = assessments.find(x => x.id === assessmentId);
  return a ? a.rooms.length : 0;
}

// ═══════════════════════════════════════════════
// CRUD OPERATIONS
// ═══════════════════════════════════════════════
export function addEMFAssessment() {
  const assessments = ensureAssessments();
  const a = newAssessment();
  assessments.push(a);
  _editingAssessmentId = a.id;
  renderEMFEditor(document.getElementById('detail-modal'));
}

export function toggleEMFAssessment(id) {
  _editingAssessmentId = _editingAssessmentId === id ? null : id;
  renderEMFEditor(document.getElementById('detail-modal'));
}

export function addEMFRoom(assessmentId) {
  const assessments = ensureAssessments();
  const a = assessments.find(x => x.id === assessmentId);
  if (!a) return;
  a.rooms.push(newRoom(''));
  renderEMFEditor(document.getElementById('detail-modal'));
}

export function removeEMFRoom(assessmentId, roomIdx) {
  const assessments = ensureAssessments();
  const a = assessments.find(x => x.id === assessmentId);
  if (!a || a.rooms.length <= 1) return;
  a.rooms.splice(roomIdx, 1);
  renderEMFEditor(document.getElementById('detail-modal'));
}

export function deleteEMFAssessment(id) {
  const assessments = ensureAssessments();
  const idx = assessments.findIndex(x => x.id === id);
  if (idx === -1) return;
  assessments.splice(idx, 1);
  _editingAssessmentId = null;
  if (assessments.length === 0) state.importedData.emfAssessment = null;
  saveImportedData();
  renderEMFEditor(document.getElementById('detail-modal'));
  showNotification('Assessment deleted', 'info');
}

export function updateEMFField(assessmentId, field, value) {
  const assessments = ensureAssessments();
  const a = assessments.find(x => x.id === assessmentId);
  if (a) a[field] = value;
}

export function updateEMFRoom(assessmentId, roomIdx, field, value) {
  const assessments = ensureAssessments();
  const a = assessments.find(x => x.id === assessmentId);
  if (a && a.rooms[roomIdx]) a.rooms[roomIdx][field] = value;
  if (field === 'name') renderEMFEditor(document.getElementById('detail-modal'));
}

export function updateEMFMeasurement(assessmentId, roomIdx, type, value) {
  const assessments = ensureAssessments();
  const a = assessments.find(x => x.id === assessmentId);
  if (!a || !a.rooms[roomIdx]) return;
  if (!a.rooms[roomIdx].measurements) a.rooms[roomIdx].measurements = {};
  const numVal = value === '' ? null : parseFloat(value);
  if (numVal === null) {
    delete a.rooms[roomIdx].measurements[type];
  } else {
    const def = SBM_2015_THRESHOLDS[type];
    a.rooms[roomIdx].measurements[type] = {
      value: numVal,
      unit: def.unit,
      meter: (a.rooms[roomIdx].measurements[type] || {}).meter || null
    };
  }
  renderEMFEditor(document.getElementById('detail-modal'));
}

export function updateEMFMeter(assessmentId, roomIdx, type, value) {
  const assessments = ensureAssessments();
  const a = assessments.find(x => x.id === assessmentId);
  if (!a || !a.rooms[roomIdx]) return;
  const m = (a.rooms[roomIdx].measurements || {})[type];
  if (m) m.meter = value || null;
}

/** Collect tags from DOM and save all EMF data */
export function saveEMFData() {
  const assessments = ensureAssessments();
  // Collect source/mitigation tags from DOM for the expanded assessment
  if (_editingAssessmentId) {
    const a = assessments.find(x => x.id === _editingAssessmentId);
    if (a) {
      for (let ri = 0; ri < a.rooms.length; ri++) {
        const srcEl = document.getElementById(`emf-sources-${a.id}-${ri}`);
        if (srcEl) a.rooms[ri].sources = Array.from(srcEl.querySelectorAll('.ctx-tag.active')).map(b => b.textContent);
        const mitEl = document.getElementById(`emf-mits-${a.id}-${ri}`);
        if (mitEl) a.rooms[ri].mitigations = Array.from(mitEl.querySelectorAll('.ctx-tag.active')).map(b => b.textContent);
      }
    }
  }
  saveImportedData();
  showNotification('EMF assessment saved', 'success');
}

// ═══════════════════════════════════════════════
// WINDOW EXPORTS
// ═══════════════════════════════════════════════
Object.assign(window, {
  openEMFAssessmentEditor,
  addEMFAssessment,
  toggleEMFAssessment,
  addEMFRoom,
  removeEMFRoom,
  deleteEMFAssessment,
  updateEMFField,
  updateEMFRoom,
  updateEMFMeasurement,
  updateEMFMeter,
  saveEMFData,
});
