// chat.js — AI chat panel, markdown rendering, personalities, conversation threads

import { state } from './state.js';
import { CHAT_PERSONALITIES, CHAT_SYSTEM_PROMPT } from './constants.js';
import { calculateCost, formatCost } from './schema.js';
import { escapeHTML, showNotification, showConfirmDialog, isDebugMode, formatValue, getStatus } from './utils.js';
import { formatTime } from './theme.js';
import { getActiveData, getEffectiveRange, getLatestValueIndex, getAllFlaggedMarkers } from './data.js';
import { encryptedSetItem, encryptedGetItem, getEncryptionEnabled } from './crypto.js';
import { getProfileLocation, getLatitudeFromLocation } from './profile.js';
import { callClaudeAPI, hasAIProvider, getAIProvider, getAnthropicModel, getVeniceModel, getOpenRouterModel, getOllamaMainModel } from './api.js';
import { getBloodDrawPhases, getNextBestDrawDate } from './cycle.js';

// ═══════════════════════════════════════════════
// THREAD STORAGE HELPERS
// ═══════════════════════════════════════════════
const MAX_THREADS = 50;

export function getChatThreadsKey() {
  return `labcharts-${state.currentProfile}-chat-threads`;
}

export function getChatThreadKey(threadId) {
  return `labcharts-${state.currentProfile}-chat-t_${threadId}`;
}

function generateThreadId() {
  return 't_' + Date.now().toString(36);
}

// ═══════════════════════════════════════════════
// THREAD INDEX CRUD
// ═══════════════════════════════════════════════
export function loadChatThreads() {
  const raw = localStorage.getItem(getChatThreadsKey());
  if (raw) {
    try {
      state.chatThreads = JSON.parse(raw);
    } catch { state.chatThreads = []; }
  } else {
    // Migration: convert legacy flat chat array to a thread
    state.chatThreads = [];
    const legacyKey = `labcharts-${state.currentProfile}-chat`;
    const legacyRaw = localStorage.getItem(legacyKey);
    if (legacyRaw) {
      try {
        const messages = JSON.parse(legacyRaw);
        if (Array.isArray(messages) && messages.length > 0) {
          const threadId = 't_migrated';
          const now = new Date().toISOString();
          state.chatThreads = [{
            id: threadId,
            name: 'Previous Chat',
            createdAt: now,
            updatedAt: now,
            messageCount: messages.length,
            personality: state.currentChatPersonality || 'default'
          }];
          // Write per-thread messages (plaintext — encryption handled by save)
          localStorage.setItem(getChatThreadKey(threadId), legacyRaw);
          saveChatThreadIndex();
          // Leave legacy key in place for rollback safety
        }
      } catch {}
    }
  }
}

export function saveChatThreadIndex() {
  localStorage.setItem(getChatThreadsKey(), JSON.stringify(state.chatThreads));
}

export function ensureActiveThread() {
  if (state.currentThreadId) {
    const exists = state.chatThreads.find(t => t.id === state.currentThreadId);
    if (exists) return;
  }
  // Pick most recent thread or create new
  if (state.chatThreads.length > 0) {
    const sorted = state.chatThreads.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    state.currentThreadId = sorted[0].id;
  } else {
    createNewThread();
  }
}

export function createNewThread() {
  const id = generateThreadId();
  const now = new Date().toISOString();
  const thread = {
    id,
    name: 'New Conversation',
    createdAt: now,
    updatedAt: now,
    messageCount: 0,
    personality: state.currentChatPersonality || 'default'
  };
  state.chatThreads.unshift(thread);
  pruneOldThreads();
  saveChatThreadIndex();
  state.currentThreadId = id;
  state.chatHistory = [];
  renderChatMessages();
  renderThreadList();
  // Focus input
  const input = document.getElementById('chat-input');
  if (input) input.focus();
}

export async function switchToThread(threadId) {
  if (threadId === state.currentThreadId) return;
  // Save current thread messages
  await saveChatHistory();
  // Switch
  state.currentThreadId = threadId;
  await loadChatHistory();
  // Update thread personality
  const thread = state.chatThreads.find(t => t.id === threadId);
  if (thread && thread.personality) {
    state.currentChatPersonality = thread.personality;
    localStorage.setItem(`labcharts-${state.currentProfile}-chatPersonality`, thread.personality);
    updateChatHeaderTitle();
    updatePersonalityBar();
  }
  renderThreadList();
}

export function deleteThread(threadId) {
  showConfirmDialog('Delete this conversation? This cannot be undone.', () => {
    // Remove from index
    state.chatThreads = state.chatThreads.filter(t => t.id !== threadId);
    saveChatThreadIndex();
    // Remove per-thread messages
    localStorage.removeItem(getChatThreadKey(threadId));
    // If we deleted the active thread, switch
    if (state.currentThreadId === threadId) {
      if (state.chatThreads.length > 0) {
        state.currentThreadId = state.chatThreads[0].id;
        loadChatHistory();
      } else {
        createNewThread();
      }
    }
    renderThreadList();
    showNotification('Conversation deleted', 'info');
  });
}

export function renameThread(threadId, newName) {
  const thread = state.chatThreads.find(t => t.id === threadId);
  if (thread && newName && newName.trim()) {
    thread.name = newName.trim().slice(0, 60);
    saveChatThreadIndex();
    renderThreadList();
  }
}

export function renameThreadPrompt(threadId) {
  const thread = state.chatThreads.find(t => t.id === threadId);
  if (!thread) return;
  const name = prompt('Rename conversation:', thread.name);
  if (name !== null && name.trim()) {
    renameThread(threadId, name);
  }
}

export function autoNameThread(threadId, firstMessage) {
  const thread = state.chatThreads.find(t => t.id === threadId);
  if (!thread || thread.name !== 'New Conversation') return;
  // Extract first 40 chars from the message, trimmed at word boundary
  let excerpt = firstMessage.replace(/\s+/g, ' ').trim();
  if (excerpt.length > 40) {
    excerpt = excerpt.slice(0, 40);
    const lastSpace = excerpt.lastIndexOf(' ');
    if (lastSpace > 20) excerpt = excerpt.slice(0, lastSpace);
    excerpt += '\u2026';
  }
  thread.name = excerpt;
  saveChatThreadIndex();
  renderThreadList();
}

export function pruneOldThreads() {
  if (state.chatThreads.length <= MAX_THREADS) return;
  // Sort by updatedAt desc, remove oldest
  const sorted = state.chatThreads.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const toRemove = sorted.slice(MAX_THREADS);
  for (const t of toRemove) {
    localStorage.removeItem(getChatThreadKey(t.id));
  }
  state.chatThreads = sorted.slice(0, MAX_THREADS);
  saveChatThreadIndex();
  if (toRemove.length > 0) {
    showNotification(`Pruned ${toRemove.length} old conversation(s)`, 'info');
  }
}

// ═══════════════════════════════════════════════
// THREAD RAIL UI
// ═══════════════════════════════════════════════
export function renderThreadList(filter) {
  const list = document.getElementById('chat-thread-list');
  if (!list) return;
  let threads = state.chatThreads.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (filter && filter.trim()) {
    const q = filter.toLowerCase().trim();
    threads = threads.filter(t => t.name.toLowerCase().includes(q));
  }
  if (threads.length === 0) {
    list.innerHTML = '<div style="padding:12px 10px;font-size:11px;color:var(--text-muted);text-align:center">' +
      (filter ? 'No matching conversations' : 'No conversations yet') + '</div>';
    return;
  }
  const personalityMap = {};
  for (const p of CHAT_PERSONALITIES) personalityMap[p.id] = p.icon;

  list.innerHTML = threads.map(t => {
    const isActive = t.id === state.currentThreadId;
    const date = new Date(t.updatedAt);
    const dateStr = formatThreadDate(date);
    const icon = personalityMap[t.personality] || personalityMap.default || '';
    return `<div class="chat-thread-item${isActive ? ' active' : ''}" onclick="switchToThread('${escapeHTML(t.id)}')" data-thread-id="${escapeHTML(t.id)}">
      <div class="chat-thread-item-name">${escapeHTML(t.name)}</div>
      <div class="chat-thread-item-meta">
        <span>${icon}</span>
        <span>${dateStr}</span>
        <span>${t.messageCount} msg${t.messageCount !== 1 ? 's' : ''}</span>
      </div>
      <div class="chat-thread-item-actions">
        <button class="chat-thread-item-action" onclick="event.stopPropagation();renameThreadPrompt('${escapeHTML(t.id)}')" title="Rename">&#9998;</button>
        <button class="chat-thread-item-action delete" onclick="event.stopPropagation();deleteThread('${escapeHTML(t.id)}')" title="Delete">&#10005;</button>
      </div>
    </div>`;
  }).join('');
}

function formatThreadDate(date) {
  const now = new Date();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function filterThreadList(value) {
  renderThreadList(value);
}

export function toggleThreadRail() {
  const rail = document.getElementById('chat-thread-rail');
  if (!rail) return;
  const isOpen = rail.classList.toggle('open');
  localStorage.setItem(`labcharts-${state.currentProfile}-chatRailOpen`, isOpen ? 'true' : 'false');
}

function restoreRailState() {
  const rail = document.getElementById('chat-thread-rail');
  if (!rail) return;
  const saved = localStorage.getItem(`labcharts-${state.currentProfile}-chatRailOpen`);
  if (saved === 'true') {
    rail.classList.add('open');
  } else {
    rail.classList.remove('open');
  }
}

// ═══════════════════════════════════════════════
// LAB CONTEXT (unchanged)
// ═══════════════════════════════════════════════
export function buildLabContext() {
  const data = getActiveData();
  if (!data.dates.length && !Object.values(data.categories).some(c => c.singleDate)) {
    return 'No lab data is currently loaded for this profile.';
  }
  const sexLabel = state.profileSex === 'female' ? 'female' : state.profileSex === 'male' ? 'male' : 'not specified';
  let ctx = `Lab data for current profile (sex: ${sexLabel}, dates: ${data.dateLabels.join(', ')}):\n\n`;
  // Medical Conditions (structured)
  const diag = state.importedData.diagnoses;
  if (diag) {
    ctx += `## Medical Conditions / Diagnoses\n`;
    if (diag.conditions && diag.conditions.length) {
      for (const c of diag.conditions) {
        ctx += `- ${c.name} (${c.severity}${c.since ? ', since ' + c.since : ''})\n`;
      }
    }
    if (diag.note) ctx += `Notes: ${diag.note}\n`;
    ctx += '\n';
  }
  // Diet (structured)
  const diet = state.importedData.diet;
  if (diet) {
    ctx += `## Diet\n`;
    const parts = [];
    if (diet.type) parts.push(`Type: ${diet.type}`);
    if (diet.pattern) parts.push(`Pattern: ${diet.pattern}`);
    if (diet.restrictions && diet.restrictions.length) parts.push(`Restrictions: ${diet.restrictions.join(', ')}`);
    ctx += parts.join('. ') + '\n';
    if (diet.breakfast) ctx += `Breakfast${diet.breakfastTime ? ' (' + formatTime(diet.breakfastTime) + ')' : ''}: ${diet.breakfast}\n`;
    if (diet.lunch) ctx += `Lunch${diet.lunchTime ? ' (' + formatTime(diet.lunchTime) + ')' : ''}: ${diet.lunch}\n`;
    if (diet.dinner) ctx += `Dinner${diet.dinnerTime ? ' (' + formatTime(diet.dinnerTime) + ')' : ''}: ${diet.dinner}\n`;
    if (diet.snacks) ctx += `Snacks${diet.snacksTime ? ' (' + formatTime(diet.snacksTime) + ')' : ''}: ${diet.snacks}\n`;
    if (diet.note) ctx += `Notes: ${diet.note}\n`;
    ctx += '\n';
  }
  // Exercise (structured)
  const ex = state.importedData.exercise;
  if (ex) {
    ctx += `## Exercise & Movement\n`;
    const parts = [];
    if (ex.frequency) parts.push(`Frequency: ${ex.frequency}`);
    if (ex.types && ex.types.length) parts.push(`Types: ${ex.types.join(', ')}`);
    if (ex.intensity) parts.push(`Intensity: ${ex.intensity}`);
    if (ex.dailyMovement) parts.push(`Daily movement: ${ex.dailyMovement}`);
    ctx += parts.join('. ') + '\n';
    if (ex.note) ctx += `Notes: ${ex.note}\n`;
    ctx += '\n';
  }
  // Sleep & Rest (structured)
  const sl = state.importedData.sleepRest;
  if (sl) {
    ctx += `## Sleep & Rest\n`;
    const parts = [];
    if (sl.duration) parts.push(`Duration: ${sl.duration}`);
    if (sl.quality) parts.push(`Quality: ${sl.quality}`);
    if (sl.schedule) parts.push(`Schedule: ${sl.schedule}`);
    if (sl.roomTemp) parts.push(`Room temp: ${sl.roomTemp}`);
    if (sl.issues && sl.issues.length) parts.push(`Issues: ${sl.issues.join(', ')}`);
    if (sl.environment && sl.environment.length) parts.push(`Environment: ${sl.environment.join(', ')}`);
    if (sl.practices && sl.practices.length) parts.push(`Practices: ${sl.practices.join(', ')}`);
    ctx += parts.join('. ') + '\n';
    if (sl.note) ctx += `Notes: ${sl.note}\n`;
    ctx += '\n';
  }
  // Light & Circadian (structured)
  const lc = state.importedData.lightCircadian;
  const autoLat = getLatitudeFromLocation();
  if (lc || autoLat) {
    ctx += `## Light & Circadian\n`;
    const parts = [];
    if (lc) {
      if (lc.amLight) parts.push(`Morning light: ${lc.amLight}`);
      if (lc.daytime) parts.push(`Daytime outdoor: ${lc.daytime}`);
      if (lc.uvExposure) parts.push(`UV exposure: ${lc.uvExposure}`);
      if (lc.evening && lc.evening.length) parts.push(`Evening light: ${lc.evening.join(', ')}`);
      if (lc.screenTime) parts.push(`Daily screen time: ${lc.screenTime}`);
      if (lc.techEnv && lc.techEnv.length) parts.push(`Tech environment: ${lc.techEnv.join(', ')}`);
      if (lc.cold) parts.push(`Cold exposure: ${lc.cold}`);
      if (lc.grounding) parts.push(`Grounding: ${lc.grounding}`);
      if (lc.mealTiming && lc.mealTiming.length) parts.push(`Meal timing: ${lc.mealTiming.join(', ')}`);
    }
    if (autoLat) parts.push(`Latitude: ${autoLat}`);
    const loc = getProfileLocation();
    if (loc.country) parts.push(`Location: ${loc.country}${loc.zip ? ' ' + loc.zip : ''}`);
    ctx += parts.join('. ') + '\n';
    if (lc && lc.note) ctx += `Notes: ${lc.note}\n`;
    ctx += '\n';
  }
  // Stress (structured)
  const st = state.importedData.stress;
  if (st) {
    ctx += `## Stress\n`;
    const parts = [];
    if (st.level) parts.push(`Level: ${st.level}`);
    if (st.sources && st.sources.length) parts.push(`Sources: ${st.sources.join(', ')}`);
    if (st.management && st.management.length) parts.push(`Management: ${st.management.join(', ')}`);
    ctx += parts.join('. ') + '\n';
    if (st.note) ctx += `Notes: ${st.note}\n`;
    ctx += '\n';
  }
  // Love Life (structured)
  const ll = state.importedData.loveLife;
  if (ll) {
    ctx += `## Love Life & Sexual Health\n`;
    const parts = [];
    if (ll.status) parts.push(`Status: ${ll.status}`);
    if (ll.relationship) parts.push(`Relationship quality: ${ll.relationship}`);
    if (ll.satisfaction) parts.push(`Satisfaction: ${ll.satisfaction}`);
    if (ll.libido) parts.push(`Libido: ${ll.libido}`);
    if (ll.frequency) parts.push(`Sexual frequency: ${ll.frequency}`);
    if (ll.orgasm) parts.push(`Orgasm: ${ll.orgasm}`);
    if (ll.concerns && ll.concerns.length) parts.push(`Concerns: ${ll.concerns.join(', ')}`);
    ctx += parts.join('. ') + '\n';
    if (ll.note) ctx += `Notes: ${ll.note}\n`;
    ctx += '\n';
  }
  // Environment (structured)
  const env = state.importedData.environment;
  if (env) {
    ctx += `## Environment\n`;
    const parts = [];
    if (env.setting) parts.push(`Setting: ${env.setting}`);
    if (env.climate) parts.push(`Climate: ${env.climate}`);
    if (env.water) parts.push(`Water: ${env.water}`);
    if (env.waterConcerns && env.waterConcerns.length) parts.push(`Water concerns: ${env.waterConcerns.join(', ')}`);
    if (env.emf && env.emf.length) parts.push(`EMF exposure: ${env.emf.join(', ')}`);
    if (env.emfMitigation && env.emfMitigation.length) parts.push(`EMF mitigation: ${env.emfMitigation.join(', ')}`);
    if (env.homeLight) parts.push(`Home lighting: ${env.homeLight}`);
    if (env.air && env.air.length) parts.push(`Air quality: ${env.air.join(', ')}`);
    if (env.toxins && env.toxins.length) parts.push(`Toxin exposure: ${env.toxins.join(', ')}`);
    if (env.building) parts.push(`Building: ${env.building}`);
    ctx += parts.join('. ') + '\n';
    if (env.note) ctx += `Notes: ${env.note}\n`;
    ctx += '\n';
  }
  // Health Goals (unchanged)
  const healthGoals = state.importedData.healthGoals || [];
  if (healthGoals.length > 0) {
    ctx += `## Health Goals (Things to Solve)\n`;
    const byPriority = { major: [], mild: [], minor: [] };
    for (const g of healthGoals) (byPriority[g.severity] || byPriority.minor).push(g.text);
    for (const [sev, items] of Object.entries(byPriority)) {
      if (items.length > 0) {
        ctx += `### ${sev.charAt(0).toUpperCase() + sev.slice(1)} Priority\n`;
        for (const t of items) ctx += `- ${t}\n`;
      }
    }
    ctx += '\n';
  }
  // Interpretive Lens (unchanged)
  const interpretiveLens = state.importedData.interpretiveLens || '';
  if (interpretiveLens.trim()) {
    ctx += `## Interpretive Lens\n${interpretiveLens.trim()}\n\n`;
  }
  // Additional context notes
  const ctxNotes = state.importedData.contextNotes || '';
  if (ctxNotes.trim()) {
    ctx += `## Additional Context Notes\n${ctxNotes.trim()}\n\n`;
  }
  const mc = state.importedData.menstrualCycle;
  if (mc && state.profileSex === 'female') {
    const regLabel = mc.regularity === 'very_irregular' ? 'very irregular' : mc.regularity || 'regular';
    ctx += `## Menstrual Cycle\n`;
    ctx += `Profile: ${mc.cycleLength || 28}-day cycle (${mc.periodLength || 5}-day period), ${regLabel}, ${mc.flow || 'moderate'} flow.`;
    if (mc.contraceptive) ctx += ` Contraceptive: ${mc.contraceptive}.`;
    if (mc.conditions) ctx += ` Conditions: ${mc.conditions}.`;
    ctx += '\n';
    const periods = (mc.periods || []).slice().sort((a, b) => b.startDate.localeCompare(a.startDate));
    if (periods.length > 0) {
      const fmtD = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx += `Recent periods: ${periods.slice(0, 6).map(p => `${fmtD(p.startDate)}-${fmtD(p.endDate)} (${p.flow})`).join(', ')}\n`;
    }
    if (data.dates.length > 0) {
      const phases = getBloodDrawPhases(mc, data.dates);
      const phaseDates = Object.entries(phases);
      if (phaseDates.length > 0) {
        ctx += `\nBlood draw cycle context:\n`;
        for (const [date, p] of phaseDates) {
          const dateLabel = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          ctx += `- ${dateLabel}: Day ${p.cycleDay} (${p.phaseName} phase)\n`;
        }
      }
    }
    const drawRec = getNextBestDrawDate(mc);
    if (drawRec) {
      ctx += `\nNext optimal blood draw window: ${drawRec.description}\n`;
    }
    ctx += '\n';
  }
  const supps = state.importedData.supplements || [];
  if (supps.length > 0) {
    ctx += `## Supplements & Medications\n`;
    const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    for (const s of supps) {
      const dateRange = `${fmtDate(s.startDate)} \u2192 ${s.endDate ? fmtDate(s.endDate) : 'ongoing'}`;
      ctx += `- ${s.name}${s.dosage ? ' (' + s.dosage + ')' : ''} [${s.type}]: ${dateRange}\n`;
    }
    ctx += '\n';
  }
  const rangeLabel = state.rangeMode === 'optimal' ? 'optimal' : 'reference';
  ctx += `Note: status labels below use ${rangeLabel} ranges.\n\n`;
  for (const [catKey, cat] of Object.entries(data.categories)) {
    const markersWithData = Object.entries(cat.markers).filter(([_, m]) => m.values.some(v => v !== null));
    if (markersWithData.length === 0) continue;
    ctx += `## ${cat.label}\n`;
    for (const [key, m] of markersWithData) {
      const vals = m.singlePoint
        ? m.values.filter(v => v !== null).map(v => `${v}`).join('')
        : m.values.map((v, i) => v !== null ? `${data.dateLabels[i]}: ${v}` : null).filter(Boolean).join(', ');
      const latestIdx = getLatestValueIndex(m.values);
      const mr = getEffectiveRange(m);
      const status = latestIdx !== -1 ? getStatus(m.values[latestIdx], mr.min, mr.max) : 'no data';
      const refStr = mr.min != null && mr.max != null ? `ref: ${mr.min}\u2013${mr.max}, ` : '';
      ctx += `- ${m.name}: ${vals} ${m.unit} (${refStr}status: ${status})\n`;
    }
    ctx += '\n';
  }
  const flags = getAllFlaggedMarkers(data);
  if (flags.length > 0) {
    ctx += `## Flagged Results (Latest)\n`;
    for (const f of flags) {
      ctx += `- ${f.name}: ${f.value} ${f.unit} (${f.status.toUpperCase()}, range: ${f.effectiveMin}\u2013${f.effectiveMax})\n`;
    }
    ctx += '\n';
  }
  const notes = (state.importedData.notes || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  if (notes.length > 0) {
    ctx += `## User Notes\n`;
    for (const n of notes) {
      const d = new Date(n.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      ctx += `- ${d}: ${n.text}\n`;
    }
  }
  return ctx;
}

// ═══════════════════════════════════════════════
// CONTEXT SUMMARY (snapshot what data areas were sent)
// ═══════════════════════════════════════════════
export function getContextSummary() {
  const areas = [];
  const data = getActiveData();
  // Lab values
  const markerCount = Object.values(data.categories).reduce((sum, cat) =>
    sum + Object.values(cat.markers).filter(m => m.values.some(v => v !== null)).length, 0);
  if (markerCount > 0) areas.push({ label: 'Lab values', detail: `${markerCount} markers` });
  // Context cards
  const diag = state.importedData.diagnoses;
  if (diag && ((diag.conditions && diag.conditions.length) || diag.note)) areas.push({ label: 'Medical Conditions', detail: diag.conditions ? `${diag.conditions.length} condition${diag.conditions.length !== 1 ? 's' : ''}` : 'notes' });
  if (state.importedData.diet) areas.push({ label: 'Diet', detail: state.importedData.diet.type || 'filled' });
  if (state.importedData.exercise) areas.push({ label: 'Exercise', detail: state.importedData.exercise.frequency || 'filled' });
  if (state.importedData.sleepRest) areas.push({ label: 'Sleep & Rest', detail: state.importedData.sleepRest.duration || 'filled' });
  const lc = state.importedData.lightCircadian;
  const autoLat = getLatitudeFromLocation();
  if (lc || autoLat) areas.push({ label: 'Light & Circadian', detail: autoLat ? `lat ${autoLat}` : 'filled' });
  if (state.importedData.stress) areas.push({ label: 'Stress', detail: state.importedData.stress.level || 'filled' });
  if (state.importedData.loveLife) areas.push({ label: 'Love Life', detail: 'filled' });
  if (state.importedData.environment) areas.push({ label: 'Environment', detail: state.importedData.environment.setting || 'filled' });
  // Goals, lens, notes
  const goals = state.importedData.healthGoals || [];
  if (goals.length > 0) areas.push({ label: 'Health Goals', detail: `${goals.length} goal${goals.length !== 1 ? 's' : ''}` });
  const lens = state.importedData.interpretiveLens || '';
  if (lens.trim()) areas.push({ label: 'Interpretive Lens', detail: 'set' });
  const ctxNotes = state.importedData.contextNotes || '';
  if (ctxNotes.trim()) areas.push({ label: 'Context Notes', detail: 'set' });
  // Cycle
  const mc = state.importedData.menstrualCycle;
  if (mc && state.profileSex === 'female') areas.push({ label: 'Menstrual Cycle', detail: `${mc.cycleLength || 28}-day` });
  // Supplements
  const supps = state.importedData.supplements || [];
  if (supps.length > 0) areas.push({ label: 'Supplements', detail: `${supps.length} item${supps.length !== 1 ? 's' : ''}` });
  // Notes
  const notes = state.importedData.notes || [];
  if (notes.length > 0) areas.push({ label: 'User Notes', detail: `${notes.length} note${notes.length !== 1 ? 's' : ''}` });
  // Flagged
  const flags = getAllFlaggedMarkers(data);
  if (flags.length > 0) areas.push({ label: 'Flagged Results', detail: `${flags.length} flagged` });
  return areas;
}

// ═══════════════════════════════════════════════
// CHAT SOURCES (OpenAlex)
// ═══════════════════════════════════════════════
export function getChatSourcesEnabled() {
  return localStorage.getItem('labcharts-chat-sources') === 'on';
}

export function setChatSourcesEnabled(val) {
  localStorage.setItem('labcharts-chat-sources', val ? 'on' : 'off');
}

export async function searchOpenAlex(terms) {
  if (!terms || terms.length === 0) return [];
  const query = encodeURIComponent(terms.join(' '));
  try {
    const resp = await fetch(`https://api.openalex.org/works?search=${query}&per_page=5&mailto=user@labcharts.app&select=id,title,authorships,publication_year,doi,cited_by_count,primary_location`, { signal: AbortSignal.timeout(10000) });
    if (!resp.ok) return [];
    const data = await resp.json();
    return (data.results || []).map(w => {
      const allAuthors = (w.authorships || []).map(a => a.author?.display_name || '').filter(Boolean);
      const authorStr = allAuthors.length > 3 ? allAuthors.slice(0, 2).join(', ') + ' et al.' : allAuthors.join(', ');
      const doi = w.doi ? w.doi.replace('https://doi.org/', '') : null;
      // Fallback chain: landing page → DOI link → OpenAlex page
      const oaId = w.id ? w.id.replace('https://openalex.org/', '') : null;
      const url = w.primary_location?.landing_page_url
        || (doi ? `https://doi.org/${doi}` : null)
        || (oaId ? `https://openalex.org/${oaId}` : null);
      return {
        title: w.title || 'Untitled',
        authors: authorStr,
        year: w.publication_year,
        doi,
        url,
        citations: w.cited_by_count || 0
      };
    }).filter(s => s.url);
  } catch { return []; }
}

export function parseSearchTerms(fullText) {
  const lines = fullText.split('\n');
  // Strip backticks, markdown prefixes (>, -, *) before matching
  const cleanLine = l => l.trim().replace(/^[`>*-]+\s*/, '').replace(/`+$/, '').trim();
  const termLine = lines.findIndex(l => /^SEARCH_TERMS:\s*/i.test(cleanLine(l)));
  if (termLine === -1) return { cleanText: fullText, terms: null };
  const raw = cleanLine(lines[termLine]).replace(/^SEARCH_TERMS:\s*/i, '').trim();
  const terms = raw.split(',').map(t => t.trim()).filter(Boolean);
  const cleanLines = lines.slice(0, termLine).concat(lines.slice(termLine + 1));
  // Remove trailing empty lines
  while (cleanLines.length > 0 && cleanLines[cleanLines.length - 1].trim() === '') cleanLines.pop();
  return { cleanText: cleanLines.join('\n'), terms: terms.length > 0 ? terms : null };
}

// ═══════════════════════════════════════════════
// ACTION BAR RENDERING
// ═══════════════════════════════════════════════
export function buildActionBar(msgIndex) {
  const msg = state.chatHistory[msgIndex];
  if (!msg || msg.role !== 'assistant') return '';
  const isLast = msgIndex === state.chatHistory.length - 1;

  let html = '<div class="chat-action-bar">';
  if (isLast) {
    html += `<button class="chat-action-btn" onclick="regenerateLastMessage()" title="Regenerate response">\u21BB Regenerate</button>`;
  }
  html += `<button class="chat-action-btn" onclick="copyMessage(${msgIndex})" id="chat-copy-btn-${msgIndex}" title="Copy to clipboard">\uD83D\uDCCB Copy</button>`;
  html += '</div>';

  // Context used section
  if (msg.context && msg.context.length > 0) {
    html += `<div class="chat-context-toggle" onclick="toggleContextDetails(${msgIndex})">`;
    html += `<span class="chat-toggle-arrow" id="chat-ctx-arrow-${msgIndex}">\u25B8</span> Context used (${msg.context.length} area${msg.context.length !== 1 ? 's' : ''})`;
    html += '</div>';
    html += `<div class="chat-context-details" id="chat-ctx-details-${msgIndex}" style="display:none">`;
    for (const area of msg.context) {
      html += `<span class="chat-context-item">\u2713 ${escapeHTML(area.label)}${area.detail ? ' (' + escapeHTML(area.detail) + ')' : ''}</span>`;
    }
    html += '</div>';
  }

  // Sources section
  if (msg.sources && msg.sources.length > 0) {
    html += `<div class="chat-sources-toggle" onclick="toggleSourcesDetails(${msgIndex})">`;
    html += `<span class="chat-toggle-arrow" id="chat-src-arrow-${msgIndex}">\u25B8</span> Sources (${msg.sources.length} paper${msg.sources.length !== 1 ? 's' : ''})`;
    html += '</div>';
    html += renderSourcesSection(msg.sources, msgIndex);
  } else if (msg.sourcesPending) {
    html += '<div class="chat-sources-loading"><span class="chat-sources-shimmer"></span> Finding relevant papers\u2026</div>';
  }

  return html;
}

export function renderSourcesSection(sources, msgIndex) {
  let html = `<div class="chat-sources-details" id="chat-src-details-${msgIndex}" style="display:none">`;
  for (const s of sources) {
    const linkUrl = s.url ? escapeHTML(s.url) : '#';
    html += `<div class="chat-source-item">`;
    html += `<a href="${linkUrl}" target="_blank" rel="noopener" class="chat-source-title">\uD83D\uDCC4 ${escapeHTML(s.title)}</a>`;
    const meta = [];
    if (s.authors) meta.push(escapeHTML(s.authors));
    if (s.year) meta.push(s.year);
    if (s.citations > 0) meta.push(`${s.citations} cite${s.citations !== 1 ? 's' : ''}`);
    if (meta.length > 0) html += `<div class="chat-source-meta">${meta.join(' \u00b7 ')}</div>`;
    html += '</div>';
  }
  html += '</div>';
  return html;
}

// ═══════════════════════════════════════════════
// ACTION HANDLERS
// ═══════════════════════════════════════════════
export function regenerateLastMessage() {
  if (state.chatHistory.length < 2) return;
  const sendBtn = document.getElementById('chat-send-btn');
  if (sendBtn && sendBtn.disabled) return; // streaming in progress
  // Pop the last assistant message
  state.chatHistory.pop();
  // Get the last user message
  const lastUserMsg = state.chatHistory[state.chatHistory.length - 1];
  if (!lastUserMsg || lastUserMsg.role !== 'user') return;
  // Re-fill input and re-send
  const input = document.getElementById('chat-input');
  if (input) input.value = lastUserMsg.content;
  // Remove the user message too (sendChatMessage will re-add it)
  state.chatHistory.pop();
  saveChatHistory();
  renderChatMessages();
  sendChatMessage();
}

export function copyMessage(msgIndex) {
  const msg = state.chatHistory[msgIndex];
  if (!msg) return;
  const btn = document.getElementById(`chat-copy-btn-${msgIndex}`);
  navigator.clipboard.writeText(msg.content).then(() => {
    if (btn) {
      btn.innerHTML = '\u2713 Copied!';
      setTimeout(() => { btn.innerHTML = '\uD83D\uDCCB Copy'; }, 1500);
    }
  }).catch(() => {
    if (btn) { btn.innerHTML = '\u2717 Failed'; setTimeout(() => { btn.innerHTML = '\uD83D\uDCCB Copy'; }, 1500); }
  });
}

export function toggleContextDetails(msgIndex) {
  const details = document.getElementById(`chat-ctx-details-${msgIndex}`);
  const arrow = document.getElementById(`chat-ctx-arrow-${msgIndex}`);
  if (!details) return;
  const open = details.style.display !== 'none';
  details.style.display = open ? 'none' : 'flex';
  if (arrow) arrow.textContent = open ? '\u25B8' : '\u25BE';
}

export function toggleSourcesDetails(msgIndex) {
  const details = document.getElementById(`chat-src-details-${msgIndex}`);
  const arrow = document.getElementById(`chat-src-arrow-${msgIndex}`);
  if (!details) return;
  const open = details.style.display !== 'none';
  details.style.display = open ? 'none' : 'block';
  if (arrow) arrow.textContent = open ? '\u25B8' : '\u25BE';
}

// ═══════════════════════════════════════════════
// LEGACY STORAGE KEY (for migration detection)
// ═══════════════════════════════════════════════
export function getChatStorageKey() {
  return `labcharts-${state.currentProfile}-chat`;
}

// ═══════════════════════════════════════════════
// PERSONALITY
// ═══════════════════════════════════════════════
export function getActivePersonality() {
  return CHAT_PERSONALITIES.find(p => p.id === state.currentChatPersonality) || CHAT_PERSONALITIES[0];
}

export function getCustomPersonalityText() {
  return localStorage.getItem(`labcharts-${state.currentProfile}-chatPersonalityCustom`) || '';
}

export async function setChatPersonality(id) {
  const prev = state.currentChatPersonality;
  if (prev === id) {
    // Collapse bar if same personality clicked
    const bar = document.querySelector('.chat-personality-bar');
    if (bar) bar.classList.remove('open');
    return;
  }
  const hasMessages = state.chatHistory.length > 0;
  if (hasMessages) {
    // Save current thread BEFORE changing personality — preserves old thread's identity
    await saveChatHistory();
  }
  // Now switch personality
  state.currentChatPersonality = id;
  localStorage.setItem(`labcharts-${state.currentProfile}-chatPersonality`, id);
  if (hasMessages) {
    // Start fresh thread for the new personality
    createNewThread();
  } else {
    // Current thread is empty — just update its personality in place
    const thread = state.chatThreads.find(t => t.id === state.currentThreadId);
    if (thread) {
      thread.personality = id;
      saveChatThreadIndex();
    }
    renderChatMessages(); // re-render empty state with new personality greeting
    renderThreadList();
  }
  updateChatHeaderTitle();
  updatePersonalityBar();
  const personality = getActivePersonality();
  showNotification(`Switched to ${personality.name}`, 'info');
  const bar = document.querySelector('.chat-personality-bar');
  if (bar) bar.classList.remove('open');
}

export function loadChatPersonality() {
  const saved = localStorage.getItem(`labcharts-${state.currentProfile}-chatPersonality`);
  state.currentChatPersonality = saved && CHAT_PERSONALITIES.some(p => p.id === saved) ? saved : 'default';
}

export function updateChatHeaderTitle() {
  const el = document.querySelector('.chat-header-title');
  if (el) {
    const p = getActivePersonality();
    el.textContent = p.name;
  }
}

export function updatePersonalityBar() {
  const currentEl = document.querySelector('.chat-personality-current');
  if (currentEl) {
    const p = getActivePersonality();
    currentEl.querySelector('.chat-personality-current-icon').textContent = p.icon;
    currentEl.querySelector('.chat-personality-current-name').textContent = p.name;
  }
  // Update active states
  document.querySelectorAll('.chat-personality-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.personality === state.currentChatPersonality);
  });
  // Show/hide custom area
  const customArea = document.querySelector('.chat-personality-custom-area');
  if (customArea) {
    customArea.style.display = state.currentChatPersonality === 'custom' ? 'block' : 'none';
    if (state.currentChatPersonality === 'custom') {
      const textarea = customArea.querySelector('textarea');
      if (textarea) textarea.value = getCustomPersonalityText();
    }
  }
}

export function togglePersonalityBar() {
  const options = document.querySelector('.chat-personality-options');
  const bar = document.querySelector('.chat-personality-bar');
  if (options && bar) {
    bar.classList.toggle('open');
  }
}

export function saveCustomPersonality() {
  const textarea = document.querySelector('.chat-personality-custom-textarea');
  if (textarea) {
    localStorage.setItem(`labcharts-${state.currentProfile}-chatPersonalityCustom`, textarea.value.trim());
    showNotification('Custom personality saved', 'success');
  }
}

// ═══════════════════════════════════════════════
// CHAT HISTORY (now thread-aware)
// ═══════════════════════════════════════════════
export async function loadChatHistory() {
  if (!state.currentThreadId) {
    state.chatHistory = [];
    renderChatMessages();
    return;
  }
  try {
    const key = getChatThreadKey(state.currentThreadId);
    const stored = await encryptedGetItem(key);
    state.chatHistory = stored ? JSON.parse(stored) : [];
  } catch { state.chatHistory = []; }
  renderChatMessages();
}

export async function saveChatHistory() {
  if (!state.currentThreadId) return;
  // No message limit per thread (API still sends last 10)
  const key = getChatThreadKey(state.currentThreadId);
  // Strip transient sourcesPending flag — must never reach storage
  const value = JSON.stringify(state.chatHistory, (k, v) => k === 'sourcesPending' ? undefined : v);
  if (getEncryptionEnabled()) {
    await encryptedSetItem(key, value);
  } else {
    localStorage.setItem(key, value);
  }
  // Update thread index metadata
  const thread = state.chatThreads.find(t => t.id === state.currentThreadId);
  if (thread) {
    thread.updatedAt = new Date().toISOString();
    thread.messageCount = state.chatHistory.length;
    thread.personality = state.currentChatPersonality;
    saveChatThreadIndex();
    renderThreadList();
  }
}

export function clearChatHistory() {
  state.chatHistory = [];
  if (state.currentThreadId) {
    localStorage.removeItem(getChatThreadKey(state.currentThreadId));
    // Update thread metadata
    const thread = state.chatThreads.find(t => t.id === state.currentThreadId);
    if (thread) {
      thread.messageCount = 0;
      thread.updatedAt = new Date().toISOString();
      saveChatThreadIndex();
      renderThreadList();
    }
  }
  renderChatMessages();
  showNotification('Chat history cleared', 'info');
}

// ═══════════════════════════════════════════════
// MESSAGE RENDERING
// ═══════════════════════════════════════════════
export function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  if (state.chatHistory.length === 0) {
    const personality = getActivePersonality();
    container.innerHTML = `<div class="chat-empty">
      <div class="chat-empty-icon">${personality.icon}</div>
      <div>${escapeHTML(personality.greeting)}</div>
      <div class="chat-prompts">
        <button class="chat-prompt-btn" onclick="useChatPrompt('What are my most concerning results?')">What are my most concerning results?</button>
        <button class="chat-prompt-btn" onclick="useChatPrompt('How has my bloodwork changed over time?')">How has my bloodwork changed over time?</button>
        <button class="chat-prompt-btn" onclick="useChatPrompt('Are there any patterns in my flagged markers?')">Are there any patterns in my flagged markers?</button>
        <button class="chat-prompt-btn" onclick="useChatPrompt('Explain my thyroid panel')">Explain my thyroid panel</button>
        <button class="chat-prompt-btn" onclick="useChatPrompt('What should I test next?')">What should I test next?</button>
      </div>
    </div>`;
    return;
  }
  let html = '';
  for (let i = 0; i < state.chatHistory.length; i++) {
    const msg = state.chatHistory[i];
    const cls = msg.role === 'user' ? 'chat-user' : 'chat-ai';
    html += `<div class="chat-msg ${cls}">${renderMarkdown(msg.content)}`;
    if (msg.role === 'assistant') {
      html += buildActionBar(i);
    }
    html += '</div>';
  }
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

export function useChatPrompt(text) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = text; sendChatMessage(); }
}

// ═══════════════════════════════════════════════
// MARKDOWN
// ═══════════════════════════════════════════════
export function applyInlineMarkdown(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const safe = /^(https?:|mailto:)/.test(url) ? url : '#';
      return `<a href="${safe}" target="_blank" rel="noopener">${label}</a>`;
    });
}

export function renderMarkdown(text) {
  const lines = text.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trimStart().startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const escaped = codeLines.join('\n').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      blocks.push(`<pre class="chat-code-block"><code>${escaped}</code></pre>`);
      continue;
    }

    // Horizontal rule
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      blocks.push('<hr class="chat-hr">');
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<div class="chat-h${level}">${applyInlineMarkdown(headingMatch[2])}</div>`);
      i++;
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(applyInlineMarkdown(lines[i].replace(/^\s*[-*+]\s+/, '')));
        i++;
      }
      blocks.push(`<ul class="chat-list">${items.map(it => `<li>${it}</li>`).join('')}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(applyInlineMarkdown(lines[i].replace(/^\s*\d+[.)]\s+/, '')));
        i++;
      }
      blocks.push(`<ol class="chat-list">${items.map(it => `<li>${it}</li>`).join('')}</ol>`);
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' &&
      !lines[i].trimStart().startsWith('```') &&
      !/^(#{1,3})\s+/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+[.)]\s+/.test(lines[i]) &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push(`<div class="chat-para">${applyInlineMarkdown(paraLines.join(' '))}</div>`);
    }
  }

  return blocks.join('');
}

// ═══════════════════════════════════════════════
// PANEL OPEN/CLOSE
// ═══════════════════════════════════════════════
export function toggleChatPanel() {
  const panel = document.getElementById('chat-panel');
  if (panel.classList.contains('open')) {
    closeChatPanel();
  } else {
    openChatPanel();
  }
}

export async function openChatPanel(prefillMessage) {
  if (!hasAIProvider()) {
    showNotification("AI provider not configured. Opening settings...", "info");
    setTimeout(() => window.openSettingsModal(), 500);
    return;
  }
  const panel = document.getElementById('chat-panel');
  const backdrop = document.getElementById('chat-backdrop');
  panel.classList.add('open');
  backdrop.classList.add('open');
  loadChatPersonality();
  updateChatHeaderTitle();
  updatePersonalityBar();
  // Sync sources toggle
  const srcCb = document.getElementById('chat-sources-checkbox');
  if (srcCb) srcCb.checked = getChatSourcesEnabled();
  // Load threads and ensure active thread
  loadChatThreads();
  ensureActiveThread();
  restoreRailState();
  renderThreadList();
  await loadChatHistory();
  if (prefillMessage) {
    const input = document.getElementById('chat-input');
    if (input) { input.value = prefillMessage; input.focus(); }
  } else {
    const input = document.getElementById('chat-input');
    if (input) input.focus();
  }
}

export function closeChatPanel() {
  document.getElementById('chat-panel').classList.remove('open');
  document.getElementById('chat-backdrop').classList.remove('open');
}

// ═══════════════════════════════════════════════
// SEND MESSAGE
// ═══════════════════════════════════════════════
export async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const container = document.getElementById('chat-messages');
  const text = input.value.trim();
  if (!text) return;

  // Ensure we have a thread
  if (!state.currentThreadId) {
    createNewThread();
  }

  // Auto-name thread from first user message
  const isFirstMessage = state.chatHistory.length === 0;

  // Add user message
  state.chatHistory.push({ role: 'user', content: text });
  input.value = '';
  input.style.height = '';
  renderChatMessages();

  if (isFirstMessage) {
    autoNameThread(state.currentThreadId, text);
  }

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'typing-indicator';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typingEl);
  container.scrollTop = container.scrollHeight;

  sendBtn.disabled = true;
  sendBtn.textContent = '...';

  // Snapshot context areas before sending
  const contextSnapshot = getContextSummary();
  const sourcesEnabled = getChatSourcesEnabled();

  try {
    const labContext = buildLabContext();
    const personality = getActivePersonality();
    let personalityPrompt = '';
    if (personality.id === 'custom') {
      const customText = getCustomPersonalityText();
      if (customText) {
        personalityPrompt = `\n\nCommunication style: ${customText}\n\nIMPORTANT: This affects ONLY tone. All medical facts must remain evidence-based.`;
      }
    } else if (personality.promptAddition) {
      personalityPrompt = '\n\n' + personality.promptAddition;
    }
    let searchInstruction = '';
    if (sourcesEnabled) {
      searchInstruction = '\n\nAfter your response, on its own line output SEARCH_TERMS: followed by 2-3 concise medical/scientific search terms separated by commas. Example:\nSEARCH_TERMS: vitamin D deficiency, immune function, 25-hydroxyvitamin D';
    }
    const systemPrompt = CHAT_SYSTEM_PROMPT + personalityPrompt + searchInstruction + '\n\nCurrent lab data:\n' + labContext;

    // Send last 10 messages for context
    const apiMessages = state.chatHistory.slice(-10).map(m => ({ role: m.role, content: m.content }));

    // Create AI message placeholder
    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-msg chat-ai';
    aiMsgEl.style.whiteSpace = 'pre-wrap';

    // Throttle plain-text updates during streaming (markdown only on completion)
    let _streamLatest = '';
    let _streamRaf = null;

    const { text: fullText, usage } = await callClaudeAPI({
      system: systemPrompt,
      messages: apiMessages,
      maxTokens: 4096,
      onStream(text) {
        _streamLatest = text;
        if (!_streamRaf) {
          _streamRaf = requestAnimationFrame(() => {
            _streamRaf = null;
            if (typingEl.parentNode) typingEl.remove();
            if (!aiMsgEl.parentNode) container.appendChild(aiMsgEl);
            aiMsgEl.textContent = _streamLatest;
            container.scrollTop = container.scrollHeight;
          });
        }
      }
    });

    // Final render with full markdown
    if (_streamRaf) { cancelAnimationFrame(_streamRaf); _streamRaf = null; }
    aiMsgEl.style.whiteSpace = '';
    if (typingEl.parentNode) typingEl.remove();
    if (!aiMsgEl.parentNode) container.appendChild(aiMsgEl);

    // Parse search terms if sources enabled
    let displayText = fullText;
    let searchTerms = null;
    if (sourcesEnabled) {
      const parsed = parseSearchTerms(fullText);
      displayText = parsed.cleanText;
      searchTerms = parsed.terms;
      // Fallback: if AI didn't output SEARCH_TERMS, derive from user's question
      if (!searchTerms && text.length > 10) {
        searchTerms = [text.slice(0, 120)];
      }
    }

    aiMsgEl.innerHTML = renderMarkdown(displayText);
    // Cost footnote
    if (usage && (usage.inputTokens || usage.outputTokens)) {
      const provider = getAIProvider();
      const modelId = provider === 'anthropic' ? getAnthropicModel() : provider === 'venice' ? getVeniceModel() : provider === 'openrouter' ? getOpenRouterModel() : getOllamaMainModel();
      const cost = calculateCost(provider, modelId, usage.inputTokens, usage.outputTokens);
      const totalTokens = (usage.inputTokens || 0) + (usage.outputTokens || 0);
      const footnote = document.createElement('div');
      footnote.className = 'chat-cost-footnote';
      footnote.textContent = `${formatCost(cost)} \u00b7 ${totalTokens.toLocaleString()} tokens`;
      aiMsgEl.appendChild(footnote);
    }

    // Build assistant message object with context snapshot
    const assistantMsg = { role: 'assistant', content: displayText, context: contextSnapshot };
    if (searchTerms) assistantMsg.sourcesPending = true;
    state.chatHistory.push(assistantMsg);

    // Append action bar (with possible sources placeholder)
    const msgIndex = state.chatHistory.length - 1;
    const actionBarHtml = buildActionBar(msgIndex);
    const actionBarContainer = document.createElement('div');
    actionBarContainer.innerHTML = actionBarHtml;
    while (actionBarContainer.firstChild) aiMsgEl.appendChild(actionBarContainer.firstChild);

    container.scrollTop = container.scrollHeight;

    // Fetch OpenAlex sources async (capture thread ID for correct save target)
    if (searchTerms) {
      const sourceThreadId = state.currentThreadId;
      searchOpenAlex(searchTerms).then(sources => {
        delete assistantMsg.sourcesPending;
        if (sources.length > 0) {
          assistantMsg.sources = sources;
        }
        // Update DOM — guard against stale reference (re-render may have detached node)
        if (aiMsgEl.isConnected) {
          const loadingEl = aiMsgEl.querySelector('.chat-sources-loading');
          if (loadingEl) loadingEl.remove();
          if (sources.length > 0) {
            const srcToggle = document.createElement('div');
            srcToggle.className = 'chat-sources-toggle';
            srcToggle.setAttribute('onclick', `toggleSourcesDetails(${msgIndex})`);
            srcToggle.innerHTML = `<span class="chat-toggle-arrow" id="chat-src-arrow-${msgIndex}">\u25B8</span> Sources (${sources.length} paper${sources.length !== 1 ? 's' : ''})`;
            aiMsgEl.appendChild(srcToggle);
            const srcDetails = document.createElement('div');
            srcDetails.innerHTML = renderSourcesSection(sources, msgIndex);
            while (srcDetails.firstChild) aiMsgEl.appendChild(srcDetails.firstChild);
          }
          container.scrollTop = container.scrollHeight;
        } else if (state.currentThreadId === sourceThreadId) {
          // DOM was detached but still on same thread — re-render to pick up sources
          renderChatMessages();
        }
        // Only save to original thread (user may have switched threads during fetch)
        if (state.currentThreadId === sourceThreadId) {
          saveChatHistory();
        }
      }).catch(() => {
        // Network/API error — clean up shimmer, save without sources
        delete assistantMsg.sourcesPending;
        if (aiMsgEl.isConnected) {
          const loadingEl = aiMsgEl.querySelector('.chat-sources-loading');
          if (loadingEl) loadingEl.remove();
        }
        if (state.currentThreadId === sourceThreadId) {
          saveChatHistory();
        }
      });
    }

    // Always save immediately — sourcesPending is stripped from serialization by saveChatHistory
    saveChatHistory();
  } catch (err) {
    if (typeof _streamRaf !== 'undefined' && _streamRaf) { cancelAnimationFrame(_streamRaf); _streamRaf = null; }
    if (typingEl.parentNode) typingEl.remove();
    const errEl = document.createElement('div');
    errEl.className = 'chat-msg chat-ai';
    errEl.innerHTML = `<span style="color:var(--red)">Error: ${escapeHTML(err.message)}</span>`;
    container.appendChild(errEl);
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Send';
  container.scrollTop = container.scrollHeight;
}

export function handleChatKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

export function askAIAboutMarker(markerId) {
  const marker = state.markerRegistry[markerId];
  if (!marker) return;
  const data = getActiveData();
  const dates = marker.singlePoint ? [marker.singleDateLabel || 'N/A'] : data.dateLabels;
  const valuesText = marker.values
    .map((v, i) => v !== null ? `${dates[i]}: ${formatValue(v)} ${marker.unit}` : null)
    .filter(Boolean).join(', ');
  const latestIdx = getLatestValueIndex(marker.values);
  const mr = getEffectiveRange(marker);
  const status = latestIdx !== -1 ? getStatus(marker.values[latestIdx], mr.min, mr.max) : 'no data';
  const prompt = `Tell me about my ${marker.name} results. Values: ${valuesText}. Reference range: ${marker.refMin}\u2013${marker.refMax} ${marker.unit}${marker.optimalMin != null ? `. Optimal range: ${marker.optimalMin}\u2013${marker.optimalMax}` : ''}. Current status: ${status}. What does this mean and should I be concerned about anything?`;
  window.closeModal();
  openChatPanel(prompt);
}

export function askAIAboutCorrelations() {
  if (state.selectedCorrelationMarkers.length < 2) return;
  const data = getActiveData();
  const parts = state.selectedCorrelationMarkers.map(key => {
    const [catKey, markerKey] = key.split('.');
    const marker = data.categories[catKey]?.markers[markerKey];
    if (!marker) return null;
    const valuesText = marker.values
      .map((v, i) => v !== null ? `${data.dateLabels[i]}: ${formatValue(v)} ${marker.unit}` : null)
      .filter(Boolean).join(', ');
    const mr = getEffectiveRange(marker);
    const latestIdx = getLatestValueIndex(marker.values);
    const status = latestIdx !== -1 ? getStatus(marker.values[latestIdx], mr.min, mr.max) : 'no data';
    return `- ${marker.name}: ${valuesText} (ref: ${marker.refMin}\u2013${marker.refMax} ${marker.unit}${marker.optimalMin != null ? `, optimal: ${marker.optimalMin}\u2013${marker.optimalMax}` : ''}, status: ${status})`;
  }).filter(Boolean);
  const names = state.selectedCorrelationMarkers.map(key => {
    const [catKey, markerKey] = key.split('.');
    return data.categories[catKey]?.markers[markerKey]?.name || key;
  });
  const prompt = `Analyze the correlation between these biomarkers: ${names.join(', ')}.\n\nHere are my values:\n${parts.join('\n')}\n\nHow do these markers relate to each other? Are there any patterns, imbalances, or concerns based on their combined trends?`;
  openChatPanel(prompt);
}

// ═══════════════════════════════════════════════
// WINDOW EXPORTS (for onclick handlers)
// ═══════════════════════════════════════════════
Object.assign(window, {
  buildLabContext,
  getChatStorageKey,
  getChatThreadsKey,
  getChatThreadKey,
  getActivePersonality,
  getCustomPersonalityText,
  setChatPersonality,
  loadChatPersonality,
  updateChatHeaderTitle,
  updatePersonalityBar,
  togglePersonalityBar,
  saveCustomPersonality,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory,
  renderChatMessages,
  useChatPrompt,
  applyInlineMarkdown,
  renderMarkdown,
  toggleChatPanel,
  openChatPanel,
  closeChatPanel,
  sendChatMessage,
  handleChatKeydown,
  askAIAboutMarker,
  askAIAboutCorrelations,
  // Thread functions
  loadChatThreads,
  saveChatThreadIndex,
  ensureActiveThread,
  createNewThread,
  switchToThread,
  deleteThread,
  renameThread,
  renameThreadPrompt,
  autoNameThread,
  pruneOldThreads,
  renderThreadList,
  filterThreadList,
  toggleThreadRail,
  // Action bar functions
  getContextSummary,
  buildActionBar,
  regenerateLastMessage,
  copyMessage,
  toggleContextDetails,
  toggleSourcesDetails,
  getChatSourcesEnabled,
  setChatSourcesEnabled,
  searchOpenAlex,
  parseSearchTerms,
  renderSourcesSection,
});
