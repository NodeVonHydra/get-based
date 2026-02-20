// chat.js — AI chat panel, markdown rendering, personalities

import { state } from './state.js';
import { CHAT_PERSONALITIES, CHAT_SYSTEM_PROMPT } from './constants.js';
import { calculateCost, formatCost } from './schema.js';
import { escapeHTML, showNotification, isDebugMode, formatValue, getStatus } from './utils.js';
import { formatTime } from './theme.js';
import { getActiveData, getEffectiveRange, getLatestValueIndex, getAllFlaggedMarkers } from './data.js';
import { getProfileLocation, getLatitudeFromLocation } from './profile.js';
import { callClaudeAPI, hasAIProvider, getAIProvider, getAnthropicModel, getVeniceModel, getOllamaMainModel } from './api.js';
import { getBloodDrawPhases, getNextBestDrawDate } from './cycle.js';

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
      const refStr = mr.min != null && mr.max != null ? `ref: ${mr.min}–${mr.max}, ` : '';
      ctx += `- ${m.name}: ${vals} ${m.unit} (${refStr}status: ${status})\n`;
    }
    ctx += '\n';
  }
  const flags = getAllFlaggedMarkers(data);
  if (flags.length > 0) {
    ctx += `## Flagged Results (Latest)\n`;
    for (const f of flags) {
      ctx += `- ${f.name}: ${f.value} ${f.unit} (${f.status.toUpperCase()}, range: ${f.effectiveMin}–${f.effectiveMax})\n`;
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

export function getChatStorageKey() {
  return `labcharts-${state.currentProfile}-chat`;
}

export function getActivePersonality() {
  return CHAT_PERSONALITIES.find(p => p.id === state.currentChatPersonality) || CHAT_PERSONALITIES[0];
}

export function getCustomPersonalityText() {
  return localStorage.getItem(`labcharts-${state.currentProfile}-chatPersonalityCustom`) || '';
}

export function setChatPersonality(id) {
  const prev = state.currentChatPersonality;
  if (prev === id) {
    // Collapse bar if same personality clicked
    const bar = document.querySelector('.chat-personality-bar');
    if (bar) bar.classList.remove('open');
    return;
  }
  state.currentChatPersonality = id;
  localStorage.setItem(`labcharts-${state.currentProfile}-chatPersonality`, id);
  updateChatHeaderTitle();
  updatePersonalityBar();
  const personality = getActivePersonality();
  showNotification(`Switched to ${personality.name}`, 'info');
  renderChatMessages();
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

export function loadChatHistory() {
  try {
    const stored = localStorage.getItem(getChatStorageKey());
    state.chatHistory = stored ? JSON.parse(stored) : [];
  } catch { state.chatHistory = []; }
  renderChatMessages();
}

export function saveChatHistory() {
  // Keep last 20 messages
  if (state.chatHistory.length > 20) state.chatHistory = state.chatHistory.slice(-20);
  localStorage.setItem(getChatStorageKey(), JSON.stringify(state.chatHistory));
}

export function clearChatHistory() {
  state.chatHistory = [];
  localStorage.removeItem(getChatStorageKey());
  renderChatMessages();
  showNotification('Chat history cleared', 'info');
}

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
  for (const msg of state.chatHistory) {
    const cls = msg.role === 'user' ? 'chat-user' : 'chat-ai';
    html += `<div class="chat-msg ${cls}">${renderMarkdown(msg.content)}</div>`;
  }
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

export function useChatPrompt(text) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = text; sendChatMessage(); }
}

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

export function toggleChatPanel() {
  const panel = document.getElementById('chat-panel');
  if (panel.classList.contains('open')) {
    closeChatPanel();
  } else {
    openChatPanel();
  }
}

export function openChatPanel(prefillMessage) {
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
  loadChatHistory();
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

export async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const container = document.getElementById('chat-messages');
  const text = input.value.trim();
  if (!text) return;

  // Add user message
  state.chatHistory.push({ role: 'user', content: text });
  input.value = '';
  input.style.height = '';
  renderChatMessages();

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'typing-indicator';
  typingEl.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typingEl);
  container.scrollTop = container.scrollHeight;

  sendBtn.disabled = true;
  sendBtn.textContent = '...';

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
    const systemPrompt = CHAT_SYSTEM_PROMPT + personalityPrompt + '\n\nCurrent lab data:\n' + labContext;

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
    aiMsgEl.innerHTML = renderMarkdown(fullText);
    // Cost footnote
    if (usage && (usage.inputTokens || usage.outputTokens)) {
      const provider = getAIProvider();
      const modelId = provider === 'anthropic' ? getAnthropicModel() : provider === 'venice' ? getVeniceModel() : getOllamaMainModel();
      const cost = calculateCost(provider, modelId, usage.inputTokens, usage.outputTokens);
      const totalTokens = (usage.inputTokens || 0) + (usage.outputTokens || 0);
      const footnote = document.createElement('div');
      footnote.className = 'chat-cost-footnote';
      footnote.textContent = `${formatCost(cost)} \u00b7 ${totalTokens.toLocaleString()} tokens`;
      aiMsgEl.appendChild(footnote);
    }
    container.scrollTop = container.scrollHeight;

    state.chatHistory.push({ role: 'assistant', content: fullText });
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
  const prompt = `Tell me about my ${marker.name} results. Values: ${valuesText}. Reference range: ${marker.refMin}–${marker.refMax} ${marker.unit}${marker.optimalMin != null ? `. Optimal range: ${marker.optimalMin}–${marker.optimalMax}` : ''}. Current status: ${status}. What does this mean and should I be concerned about anything?`;
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
    return `- ${marker.name}: ${valuesText} (ref: ${marker.refMin}–${marker.refMax} ${marker.unit}${marker.optimalMin != null ? `, optimal: ${marker.optimalMin}–${marker.optimalMax}` : ''}, status: ${status})`;
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
window.buildLabContext = buildLabContext;
window.getChatStorageKey = getChatStorageKey;
window.getActivePersonality = getActivePersonality;
window.getCustomPersonalityText = getCustomPersonalityText;
window.setChatPersonality = setChatPersonality;
window.loadChatPersonality = loadChatPersonality;
window.updateChatHeaderTitle = updateChatHeaderTitle;
window.updatePersonalityBar = updatePersonalityBar;
window.togglePersonalityBar = togglePersonalityBar;
window.saveCustomPersonality = saveCustomPersonality;
window.loadChatHistory = loadChatHistory;
window.saveChatHistory = saveChatHistory;
window.clearChatHistory = clearChatHistory;
window.renderChatMessages = renderChatMessages;
window.useChatPrompt = useChatPrompt;
window.applyInlineMarkdown = applyInlineMarkdown;
window.renderMarkdown = renderMarkdown;
window.toggleChatPanel = toggleChatPanel;
window.openChatPanel = openChatPanel;
window.closeChatPanel = closeChatPanel;
window.sendChatMessage = sendChatMessage;
window.handleChatKeydown = handleChatKeydown;
window.askAIAboutMarker = askAIAboutMarker;
window.askAIAboutCorrelations = askAIAboutCorrelations;
