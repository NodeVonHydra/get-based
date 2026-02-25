// api.js — AI provider management, API calls (Anthropic, Venice, Ollama)

import { getModelPricing } from './schema.js';
import { isDebugMode, showNotification } from './utils.js';

// ═══════════════════════════════════════════════
// AI PROVIDER MANAGEMENT
// ═══════════════════════════════════════════════
export function getApiKey() { return localStorage.getItem('labcharts-api-key') || ''; }
export function saveApiKey(key) { localStorage.setItem('labcharts-api-key', key); }
export function hasApiKey() { return !!getApiKey(); }
export function getAnthropicModel() { return localStorage.getItem('labcharts-anthropic-model') || 'claude-sonnet-4-6'; }
export function setAnthropicModel(id) { localStorage.setItem('labcharts-anthropic-model', id); }
export function getAnthropicModelDisplay() {
  const id = getAnthropicModel();
  let cached = []; try { cached = JSON.parse(localStorage.getItem('labcharts-anthropic-models') || '[]'); } catch(e) {}
  const m = cached.find(function(x) { return x.id === id; });
  return m ? m.display_name || m.id : id;
}
export function deduplicateModels(models, familyFn) {
  const seen = {};
  return models.filter(function(m) {
    const fam = familyFn(m.id);
    if (seen[fam]) return false;
    seen[fam] = true;
    return true;
  });
}
export async function fetchAnthropicModels(key) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/models?limit=100', {
      headers: { 'x-api-key': key || getApiKey(), 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' }
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Sort descending so latest version comes first per family
    const all = (json.data || []).filter(function(m) { return m.id && !m.id.includes('pdl-'); }).sort(function(a, b) { return b.id.localeCompare(a.id); });
    // Deduplicate: strip date suffix to keep one per version (e.g., claude-sonnet-4-5, claude-sonnet-4-6)
    const models = deduplicateModels(all, function(id) {
      return id.replace(/-\d{8}$/, '');
    });
    localStorage.setItem('labcharts-anthropic-models', JSON.stringify(models));
    if (!localStorage.getItem('labcharts-anthropic-model') && models.length) {
      const sonnet = models.find(function(m) { return m.id.includes('sonnet'); });
      if (sonnet) setAnthropicModel(sonnet.id);
    }
    return models;
  } catch (e) { return []; }
}

export function getAIProvider() { return localStorage.getItem('labcharts-ai-provider') || 'anthropic'; }
export function setAIProvider(provider) { localStorage.setItem('labcharts-ai-provider', provider); }
export function hasAIProvider() {
  const provider = getAIProvider();
  if (provider === 'anthropic') return hasApiKey();
  if (provider === 'venice') return hasVeniceKey();
  if (provider === 'openrouter') return hasOpenRouterKey();
  // ROUTSTR DISABLED: if (provider === 'routstr') return hasRoutstrKey();
  return true; // Ollama — optimistic, errors caught at call time
}

export function getOllamaMainModel() { return localStorage.getItem('labcharts-ollama-model') || window.getOllamaConfig().model || 'llama3.2'; }
export function setOllamaMainModel(model) { localStorage.setItem('labcharts-ollama-model', model); }
export function getOllamaPIIUrl() { return localStorage.getItem('labcharts-ollama-pii-url') || window.getOllamaConfig().url; }
export function setOllamaPIIUrl(url) { localStorage.setItem('labcharts-ollama-pii-url', url); }
export function getOllamaPIIModel() { return localStorage.getItem('labcharts-ollama-pii-model') || getOllamaMainModel(); }
export function setOllamaPIIModel(model) { localStorage.setItem('labcharts-ollama-pii-model', model); }

export function getVeniceKey() { return localStorage.getItem('labcharts-venice-key') || ''; }
export function saveVeniceKey(key) { localStorage.setItem('labcharts-venice-key', key); }
export function hasVeniceKey() { return !!getVeniceKey(); }
export function getVeniceModel() { return localStorage.getItem('labcharts-venice-model') || 'llama-3.3-70b'; }
export function setVeniceModel(model) { localStorage.setItem('labcharts-venice-model', model); }
export function getVeniceModelDisplay() {
  const id = getVeniceModel();
  let cached = []; try { cached = JSON.parse(localStorage.getItem('labcharts-venice-models') || '[]'); } catch(e) {}
  const m = cached.find(function(x) { return x.id === id; });
  return m ? (m.name || m.id) : id;
}

export function getOpenRouterKey() { return localStorage.getItem('labcharts-openrouter-key') || ''; }
export function saveOpenRouterKey(key) { localStorage.setItem('labcharts-openrouter-key', key); }
export function hasOpenRouterKey() { return !!getOpenRouterKey(); }
export function getOpenRouterModel() { return localStorage.getItem('labcharts-openrouter-model') || 'anthropic/claude-sonnet-4-6'; }
export function setOpenRouterModel(model) { localStorage.setItem('labcharts-openrouter-model', model); }
export function getOpenRouterModelDisplay() {
  const id = getOpenRouterModel();
  let cached = []; try { cached = JSON.parse(localStorage.getItem('labcharts-openrouter-models') || '[]'); } catch(e) {}
  const m = cached.find(function(x) { return x.id === id; });
  return m ? (m.name || m.id) : id;
}
// Curated: latest-gen medically capable models only (prefixes matched against IDs)
const OPENROUTER_CURATED = [
  'anthropic/claude-sonnet-4', 'anthropic/claude-opus-4',
  'openai/gpt-5',
  'google/gemini-3', 'google/gemini-2',
  'deepseek/deepseek',
  'qwen/qwen', 'qwen/qwq',
  'x-ai/grok',
];
// Exclude specialized variants not suited for medical analysis
const OPENROUTER_EXCLUDE = ['codex', 'audio', 'image', 'oss', 'safeguard', 'coder'];
export async function fetchOpenRouterModels(key) {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': 'Bearer ' + (key || getOpenRouterKey()) }
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Filter to curated medically capable models, exclude specialized variants
    const all = (json.data || []).filter(function(m) {
      if (!m.id) return false;
      if (OPENROUTER_EXCLUDE.some(function(ex) { return m.id.includes(ex); })) return false;
      return OPENROUTER_CURATED.some(function(prefix) { return m.id.startsWith(prefix); });
    }).sort(function(a, b) { return (a.name || a.id).localeCompare(b.name || b.id); });
    // Deduplicate: strip date/size suffixes after provider/ prefix
    const models = deduplicateModels(all, function(id) {
      return id.replace(/:\d{4}-\d{2}-\d{2}$/, '').replace(/-\d{8}$/, '');
    });
    // Extract per-million-token pricing from API response
    const pricingCache = {};
    for (const m of models) {
      if (m.pricing && m.pricing.prompt && m.pricing.completion) {
        pricingCache[m.id] = {
          input: parseFloat(m.pricing.prompt) * 1_000_000,
          output: parseFloat(m.pricing.completion) * 1_000_000
        };
      }
    }
    localStorage.setItem('labcharts-openrouter-pricing', JSON.stringify(pricingCache));
    localStorage.setItem('labcharts-openrouter-models', JSON.stringify(models));
    if (!localStorage.getItem('labcharts-openrouter-model') && models.length) {
      const claude = models.find(function(m) { return m.id === 'anthropic/claude-sonnet-4-6'; });
      if (claude) setOpenRouterModel(claude.id);
    }
    return models;
  } catch (e) { return []; }
}
export function getOpenRouterPricing(modelId) {
  let cached = {}; try { cached = JSON.parse(localStorage.getItem('labcharts-openrouter-pricing') || '{}'); } catch(e) {}
  return cached[modelId] || null;
}

/* ROUTSTR DISABLED — waiting for CORS fix (github.com/Routstr/routstr-core/issues/375)
// ═══════════════════════════════════════════════
// ROUTSTR (Decentralized AI — eCash/Lightning)
// ═══════════════════════════════════════════════
export function getRoutstrKey() { return localStorage.getItem('labcharts-routstr-key') || ''; }
export function saveRoutstrKey(key) { localStorage.setItem('labcharts-routstr-key', key); }
export function hasRoutstrKey() { return !!getRoutstrKey(); }
export function getRoutstrModel() { return localStorage.getItem('labcharts-routstr-model') || 'claude-sonnet-4.6'; }
export function setRoutstrModel(model) { localStorage.setItem('labcharts-routstr-model', model); }
export function getRoutstrModelDisplay() {
  const id = getRoutstrModel();
  const cached = JSON.parse(localStorage.getItem('labcharts-routstr-models') || '[]');
  const m = cached.find(function(x) { return x.id === id; });
  return m ? (m.name || m.id) : id;
}
export async function fetchRoutstrModels(key) { ... }
export function getRoutstrPricing(modelId) { ... }
export async function validateRoutstrKey(key) { ... }
export async function callRoutstrAPI(opts) { ... }
END ROUTSTR DISABLED */

export async function validateOpenRouterKey(key) {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { 'Authorization': 'Bearer ' + key }
    });
    if (res.ok) return { valid: true };
    if (res.status === 401) return { valid: false, error: 'Invalid API key' };
    if (res.status === 429) return { valid: true };
    const errBody = await res.json().catch(() => null);
    const errMsg = errBody?.error?.message || `status ${res.status}`;
    return { valid: false, error: `API error: ${errMsg}` };
  } catch (e) {
    return { valid: false, error: 'Cannot reach OpenRouter API: ' + e.message };
  }
}

export function renderModelPricingHint(provider, modelId) {
  if (provider === 'ollama') return '<span style="font-size:11px;color:var(--green)">Free (local)</span>';
  const p = getModelPricing(provider, modelId);
  if (p.input === 0 && p.output === 0) return '';
  const pre = p.approx ? '~' : '';
  return `<span style="font-size:11px;color:var(--text-muted)">${pre}$${p.input.toFixed(2)}/M in \u00b7 ${pre}$${p.output.toFixed(2)}/M out</span>`;
}
export async function fetchVeniceModels(key) {
  try {
    const res = await fetch('https://api.venice.ai/api/v1/models', {
      headers: { 'Authorization': 'Bearer ' + (key || getVeniceKey()) }
    });
    if (!res.ok) return [];
    const json = await res.json();
    // Sort descending so latest version comes first per family
    const all = (json.data || []).filter(function(m) { return m.id && m.type === 'text'; }).sort(function(a, b) { return b.id.localeCompare(a.id); });
    // Deduplicate: Venice curates Claude models (no date-stamped variants), so keep all.
    // For others, strip size/date suffixes to collapse duplicates.
    const models = deduplicateModels(all, function(id) {
      if (id.startsWith('claude-')) return id;
      return id.replace(/-\d{8}$/, '').replace(/-\d+[bB]$/, '');
    });
    // Re-sort alphabetically by display name
    models.sort(function(a, b) { return (a.name || a.id).localeCompare(b.name || b.id); });
    localStorage.setItem('labcharts-venice-models', JSON.stringify(models));
    if (!localStorage.getItem('labcharts-venice-model') && models.length) {
      const llama = models.find(function(m) { return m.id.includes('llama-3.3-70b'); });
      if (llama) setVeniceModel(llama.id);
    }
    return models;
  } catch (e) { return []; }
}

export async function validateApiKey(key) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/models?limit=1', {
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      }
    });
    if (res.ok) return { valid: true };
    if (res.status === 401) return { valid: false, error: 'Invalid API key' };
    if (res.status === 429) return { valid: true }; // Rate limited but key works
    const errBody = await res.json().catch(() => null);
    const errMsg = errBody?.error?.message || `status ${res.status}`;
    return { valid: false, error: `API error: ${errMsg}` };
  } catch (e) {
    return { valid: false, error: 'Cannot reach API: ' + e.message };
  }
}

export async function callAnthropicAPI({ system, messages, maxTokens, onStream, signal }) {
  const key = getApiKey();
  if (!key) throw new Error('No API key configured. Add your Claude API key in Settings.');
  const body = {
    model: getAnthropicModel(),
    max_tokens: maxTokens || 4096,
    messages
  };
  if (system) body.system = system;
  if (onStream) body.stream = true;

  const timeoutSignal = AbortSignal.timeout(300000);
  const fetchSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(body),
    signal: fetchSignal
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key. Check your settings.');
    if (res.status === 429) throw new Error('Rate limited. Please wait a moment and try again.');
    let errMsg = `API error (${res.status})`;
    try { const errBody = await res.json(); errMsg += `: ${errBody.error?.message || JSON.stringify(errBody.error)}`; } catch {}
    throw new Error(errMsg);
  }

  if (onStream) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let inputTokens = 0, outputTokens = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const event = JSON.parse(data);
          if (event.type === 'content_block_delta' && event.delta?.text) {
            fullText += event.delta.text;
            onStream(fullText);
          } else if (event.type === 'message_start' && event.message?.usage) {
            inputTokens = event.message.usage.input_tokens || 0;
          } else if (event.type === 'message_delta' && event.usage) {
            outputTokens = event.usage.output_tokens || 0;
          }
        } catch {}
      }
    }
    return { text: fullText, usage: { inputTokens, outputTokens } };
  } else {
    const data = await res.json();
    const usage = data.usage || {};
    return { text: data.content?.[0]?.text || '', usage: { inputTokens: usage.input_tokens || 0, outputTokens: usage.output_tokens || 0 } };
  }
}

export async function callOllamaChat({ system, messages, maxTokens, onStream, signal }) {
  const config = window.getOllamaConfig();
  const model = getOllamaMainModel();
  const ollamaMessages = [];
  if (system) ollamaMessages.push({ role: 'system', content: system });
  for (const msg of messages) ollamaMessages.push({ role: msg.role, content: msg.content });

  const body = { model, messages: ollamaMessages, stream: !!onStream };
  if (maxTokens) body.options = { num_predict: maxTokens };

  const timeoutSignal = AbortSignal.timeout(300000);
  const fetchSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let res;
  try {
    res = await fetch(`${config.url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: fetchSignal
    });
  } catch (e) {
    if (e.name === 'TimeoutError' || e.message.includes('timed out')) {
      const modelName = model;
      showNotification(`Model "${modelName}" timed out after 5 min. Try a smaller model in Settings → AI Provider.`, 'error', 8000);
      throw new Error(`Ollama timed out with "${modelName}". A smaller model (e.g. qwen3:32b or llama3.2) will be faster.`);
    }
    if (e.name === 'TypeError' && e.message.includes('Failed to fetch')) {
      throw new Error('Cannot reach Ollama. This is usually a CORS issue — try starting Ollama with: OLLAMA_ORIGINS=* ollama serve');
    }
    throw new Error(`Cannot reach Ollama. Check that it's running. (${e.message})`);
  }

  if (!res.ok) {
    let errMsg = `Ollama error (${res.status})`;
    try { const errBody = await res.json(); errMsg += `: ${errBody.error || JSON.stringify(errBody)}`; } catch {}
    throw new Error(errMsg);
  }

  if (onStream) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let inputTokens = 0, outputTokens = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line);
          if (event.message?.content) {
            fullText += event.message.content;
            onStream(fullText);
          }
          if (event.done === true) {
            inputTokens = event.prompt_eval_count || 0;
            outputTokens = event.eval_count || 0;
          }
        } catch {}
      }
    }
    return { text: fullText, usage: { inputTokens, outputTokens } };
  } else {
    const data = await res.json();
    return { text: data.message?.content || '', usage: { inputTokens: data.prompt_eval_count || 0, outputTokens: data.eval_count || 0 } };
  }
}

// ═══════════════════════════════════════════════
// SHARED OPENAI-COMPATIBLE API HELPER
// ═══════════════════════════════════════════════
async function callOpenAICompatibleAPI(endpoint, key, model, providerName, { system, messages, maxTokens, onStream, signal }, extraHeaders = {}) {
  const apiMessages = [];
  if (system) apiMessages.push({ role: 'system', content: system });
  for (const msg of messages) apiMessages.push({ role: msg.role, content: msg.content });

  const body = { model, messages: apiMessages, max_tokens: maxTokens || 4096 };
  if (onStream) { body.stream = true; body.stream_options = { include_usage: true }; }

  const timeoutSignal = AbortSignal.timeout(300000);
  const fetchSignal = signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal;

  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        ...extraHeaders
      },
      body: JSON.stringify(body),
      signal: fetchSignal
    });
  } catch (e) {
    if (e.name === 'TimeoutError' || e.message.includes('timed out')) throw new Error(`${providerName} API timed out after 5 min.`);
    throw new Error(`Cannot reach ${providerName} API: ${e.message}`);
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error(`Invalid ${providerName} API key. Check your settings.`);
    if (res.status === 429) throw new Error('Rate limited. Please wait a moment and try again.');
    let errMsg = `${providerName} API error (${res.status})`;
    try { const errBody = await res.json(); errMsg += `: ${errBody.error?.message || JSON.stringify(errBody.error)}`; } catch {}
    throw new Error(errMsg);
  }

  if (onStream) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
    let inputTokens = 0, outputTokens = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const event = JSON.parse(data);
          if (event.choices?.[0]?.delta?.content) {
            fullText += event.choices[0].delta.content;
            onStream(fullText);
          }
          if (event.usage) {
            inputTokens = event.usage.prompt_tokens || inputTokens;
            outputTokens = event.usage.completion_tokens || outputTokens;
          }
        } catch {}
      }
    }
    return { text: fullText, usage: { inputTokens, outputTokens } };
  } else {
    const data = await res.json();
    const usage = data.usage || {};
    return { text: data.choices?.[0]?.message?.content || '', usage: { inputTokens: usage.prompt_tokens || 0, outputTokens: usage.completion_tokens || 0 } };
  }
}

export async function callVeniceAPI(opts) {
  const key = getVeniceKey();
  if (!key) throw new Error('No Venice API key configured. Add your key in Settings.');
  return callOpenAICompatibleAPI('https://api.venice.ai/api/v1/chat/completions', key, getVeniceModel(), 'Venice', opts);
}

export async function callOpenRouterAPI(opts) {
  const key = getOpenRouterKey();
  if (!key) throw new Error('No OpenRouter API key configured. Add your key in Settings.');
  return callOpenAICompatibleAPI(
    'https://openrouter.ai/api/v1/chat/completions',
    key, getOpenRouterModel(), 'OpenRouter', opts,
    { 'HTTP-Referer': window.location.origin, 'X-Title': 'Get Based' }
  );
}

export async function validateVeniceKey(key) {
  try {
    const res = await fetch('https://api.venice.ai/api/v1/models', {
      headers: { 'Authorization': 'Bearer ' + key }
    });
    if (res.ok) return { valid: true };
    if (res.status === 401) return { valid: false, error: 'Invalid API key' };
    if (res.status === 429) return { valid: true };
    const errBody = await res.json().catch(() => null);
    const errMsg = errBody?.error?.message || `status ${res.status}`;
    return { valid: false, error: `API error: ${errMsg}` };
  } catch (e) {
    return { valid: false, error: 'Cannot reach Venice API: ' + e.message };
  }
}

export async function callClaudeAPI(opts) {
  const provider = getAIProvider();
  if (provider === 'ollama') return callOllamaChat(opts);
  if (provider === 'venice') return callVeniceAPI(opts);
  if (provider === 'openrouter') return callOpenRouterAPI(opts);
  // ROUTSTR DISABLED: if (provider === 'routstr') return callRoutstrAPI(opts);
  return callAnthropicAPI(opts);
}

Object.assign(window, {
  getApiKey, saveApiKey, hasApiKey,
  getAnthropicModel, setAnthropicModel, getAnthropicModelDisplay,
  getVeniceKey, saveVeniceKey, hasVeniceKey,
  getVeniceModel, setVeniceModel, getVeniceModelDisplay,
  getOpenRouterKey, saveOpenRouterKey, hasOpenRouterKey,
  getOpenRouterModel, setOpenRouterModel, getOpenRouterModelDisplay,
  /* ROUTSTR DISABLED
  getRoutstrKey, saveRoutstrKey, hasRoutstrKey,
  getRoutstrModel, setRoutstrModel, getRoutstrModelDisplay,
  */
  getOllamaMainModel, setOllamaMainModel,
  getOllamaPIIUrl, setOllamaPIIUrl,
  getOllamaPIIModel, setOllamaPIIModel,
  fetchAnthropicModels, fetchVeniceModels, fetchOpenRouterModels, getOpenRouterPricing,
  // ROUTSTR DISABLED: fetchRoutstrModels, getRoutstrPricing,
  deduplicateModels,
  renderModelPricingHint,
  getAIProvider, setAIProvider, hasAIProvider,
  validateApiKey, validateVeniceKey, validateOpenRouterKey, /* ROUTSTR DISABLED: validateRoutstrKey, */
  callAnthropicAPI, callOllamaChat, callVeniceAPI, callOpenRouterAPI, /* ROUTSTR DISABLED: callRoutstrAPI, */ callClaudeAPI
});
