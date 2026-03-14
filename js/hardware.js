// hardware.js — GPU detection + model advisor for Local AI settings
// Pure functions, no DOM manipulation, no app imports

// GPU database — sorted by match length descending at init for specificity
const GPU_DB = [
  // Apple Silicon — unified memory (values = minimum config per chip)
  { match: 'Apple M1 Ultra',    vram: 64, unified: true },
  { match: 'Apple M1 Max',      vram: 32, unified: true },
  { match: 'Apple M1 Pro',      vram: 16, unified: true },
  { match: 'Apple M1',          vram: 8,  unified: true },
  { match: 'Apple M2 Ultra',    vram: 64, unified: true },
  { match: 'Apple M2 Max',      vram: 32, unified: true },
  { match: 'Apple M2 Pro',      vram: 16, unified: true },
  { match: 'Apple M2',          vram: 8,  unified: true },
  { match: 'Apple M3 Ultra',    vram: 64, unified: true },
  { match: 'Apple M3 Max',      vram: 36, unified: true },
  { match: 'Apple M3 Pro',      vram: 18, unified: true },
  { match: 'Apple M3',          vram: 8,  unified: true },
  { match: 'Apple M4 Ultra',    vram: 64, unified: true },
  { match: 'Apple M4 Max',      vram: 36, unified: true },
  { match: 'Apple M4 Pro',      vram: 24, unified: true },
  { match: 'Apple M4',          vram: 16, unified: true },
  // NVIDIA RTX 50xx
  { match: 'RTX 5090',          vram: 32 },
  { match: 'RTX 5080',          vram: 16 },
  { match: 'RTX 5070 Ti',       vram: 16 },
  { match: 'RTX 5070',          vram: 12 },
  { match: 'RTX 5060 Ti',       vram: 16 },
  { match: 'RTX 5060',          vram: 8  },
  // NVIDIA RTX 40xx
  { match: 'RTX 4090',          vram: 24 },
  { match: 'RTX 4080 SUPER',    vram: 16 },
  { match: 'RTX 4080',          vram: 16 },
  { match: 'RTX 4070 Ti SUPER', vram: 16 },
  { match: 'RTX 4070 Ti',       vram: 12 },
  { match: 'RTX 4070 SUPER',    vram: 12 },
  { match: 'RTX 4070',          vram: 12 },
  { match: 'RTX 4060 Ti',       vram: 8  },
  { match: 'RTX 4060',          vram: 8  },
  // NVIDIA RTX 30xx
  { match: 'RTX 3090 Ti',       vram: 24 },
  { match: 'RTX 3090',          vram: 24 },
  { match: 'RTX 3080 Ti',       vram: 12 },
  { match: 'RTX 3080',          vram: 10 },
  { match: 'RTX 3070 Ti',       vram: 8  },
  { match: 'RTX 3070',          vram: 8  },
  { match: 'RTX 3060 Ti',       vram: 8  },
  { match: 'RTX 3060',          vram: 12 },
  // NVIDIA GTX (older but still common)
  { match: 'GTX 1660 Ti',       vram: 6  },
  { match: 'GTX 1660 SUPER',    vram: 6  },
  { match: 'GTX 1660',          vram: 6  },
  { match: 'GTX 1650',          vram: 4  },
  { match: 'GTX 1080 Ti',       vram: 11 },
  { match: 'GTX 1080',          vram: 8  },
  // NVIDIA RTX laptop
  { match: 'RTX 4090 Laptop',   vram: 16 },
  { match: 'RTX 4080 Laptop',   vram: 12 },
  { match: 'RTX 4070 Laptop',   vram: 8  },
  { match: 'RTX 4060 Laptop',   vram: 8  },
  { match: 'RTX 3080 Laptop',   vram: 8  },
  { match: 'RTX 3070 Laptop',   vram: 8  },
  { match: 'RTX 3060 Laptop',   vram: 6  },
  // AMD RX 7000
  { match: 'RX 7900 XTX',       vram: 24 },
  { match: 'RX 7900 XT',        vram: 20 },
  { match: 'RX 7800 XT',        vram: 16 },
  { match: 'RX 7700 XT',        vram: 12 },
  { match: 'RX 7600',           vram: 8  },
  // AMD RX 6000
  { match: 'RX 6950 XT',        vram: 16 },
  { match: 'RX 6900 XT',        vram: 16 },
  { match: 'RX 6800 XT',        vram: 16 },
  { match: 'RX 6800',           vram: 16 },
  { match: 'RX 6700 XT',        vram: 12 },
  { match: 'RX 6600 XT',        vram: 8  },
  // Intel Arc
  { match: 'Arc A770',          vram: 16 },
  { match: 'Arc A750',          vram: 8  },
  { match: 'Arc A580',          vram: 8  },
  // AMD Vega (older/hybrid)
  { match: 'Vega M GH',         vram: 4  },
  { match: 'Vega M GL',         vram: 4  },
  { match: 'Vega 56',           vram: 8  },
  { match: 'Vega 64',           vram: 8  },
];

// Sort by match length descending — "RTX 4070 Ti SUPER" must match before "RTX 4070"
GPU_DB.sort((a, b) => b.match.length - a.match.length);

const LS_KEY = 'labcharts-hw-vram-override';

export function getHardwareOverride() {
  try {
    const v = parseFloat(localStorage.getItem(LS_KEY));
    return isNaN(v) || v <= 0 ? null : v;
  } catch { return null; }
}

export function saveHardwareOverride(vram) {
  if (vram === null || vram === undefined) {
    localStorage.removeItem(LS_KEY);
  } else {
    localStorage.setItem(LS_KEY, String(vram));
  }
}

function detectGPU() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return { name: null, vram: null, unified: false, renderer: null, source: 'unavailable' };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return { name: null, vram: null, unified: false, renderer: null, source: 'blocked' };
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
    const upper = renderer.toUpperCase();
    for (const entry of GPU_DB) {
      if (upper.includes(entry.match.toUpperCase())) {
        return { name: entry.match, vram: entry.vram, unified: !!entry.unified, renderer, source: 'webgl' };
      }
    }
    // No DB match — return raw renderer string
    return { name: renderer, vram: null, unified: false, renderer, source: 'webgl-unmatched' };
  } catch {
    return { name: null, vram: null, unified: false, renderer: null, source: 'error' };
  }
}

export async function detectHardware() {
  const gpu = detectGPU();
  const override = getHardwareOverride();
  if (override !== null) {
    gpu.vram = override;
    gpu.source = 'manual';
  }
  return {
    gpu,
    ram: { gb: navigator.deviceMemory || null, source: navigator.deviceMemory ? 'deviceMemory' : 'unknown' },
    cpuThreads: navigator.hardwareConcurrency || null,
  };
}

export function assessModel(modelObj, hardware) {
  const vramNeeded = (modelObj.size / 1e9) * 1.15; // file size + 15% runtime overhead
  const available = hardware.gpu.vram;
  if (!available || !modelObj.size) {
    return { tier: 'unknown', badge: '?', vramNeeded, label: 'Unknown' };
  }
  // Apple Silicon unified memory — Ollama can use ~75% of total
  const usable = hardware.gpu.unified ? available * 0.75 : available;
  if (vramNeeded <= usable * 0.85) {
    return { tier: 'fits', badge: '\u25CF', vramNeeded, label: 'Fits well' };
  }
  if (vramNeeded <= usable) {
    return { tier: 'tight', badge: '\u25D1', vramNeeded, label: 'Tight fit' };
  }
  return { tier: 'toobig', badge: '\u25CB', vramNeeded, label: 'Too large' };
}

// ═══════════════════════════════════════════════
// MODEL FITNESS for getbased use case
// ═══════════════════════════════════════════════
// Reference: Sonnet 4.6 via API. Local models are rated against that bar.
// getbased needs: strict JSON extraction from messy lab PDFs (dozens of markers,
// units, reference ranges), long system prompts (~2k tokens), medical knowledge,
// and interpretive chat. Most models under 14B will struggle.
//
// Tiers:  recommended — closest to cloud quality, reliable for all lab reports
//         capable     — handles most reports, occasional JSON issues on complex ones
//         underpowered — will frequently miss markers or break JSON structure
//         inadequate   — don't use for lab analysis
const MODEL_FITNESS = [
  // Qwen 2.5 — best family for structured extraction
  { match: 'qwen2.5:72b',     tier: 'recommended', note: 'Cloud-grade quality' },
  { match: 'qwen2.5:32b',     tier: 'recommended', note: 'Excellent structured extraction' },
  { match: 'qwen2.5:14b',     tier: 'recommended', note: 'Best value — reliable lab parsing at moderate size' },
  { match: 'qwen2.5:7b',      tier: 'capable',     note: 'Handles simple reports, may struggle with complex ones' },
  { match: 'qwen2.5:3b',      tier: 'underpowered', note: 'Frequent JSON errors on multi-page reports' },
  { match: 'qwen2.5:1.5b',    tier: 'inadequate',  note: 'Cannot reliably parse lab reports' },
  { match: 'qwen2.5:0.5b',    tier: 'inadequate',  note: 'Cannot parse lab reports' },
  // Qwen 3.5
  { match: 'qwen3.5:72b',     tier: 'recommended', note: 'Cloud-grade, latest generation' },
  { match: 'qwen3.5:32b',     tier: 'recommended', note: 'Excellent for all lab report types' },
  { match: 'qwen3.5:14b',     tier: 'recommended', note: 'Reliable parsing + strong medical knowledge' },
  { match: 'qwen3.5:9b',      tier: 'capable',     note: 'Good for most reports, may miss edge cases' },
  { match: 'qwen3.5:4b',      tier: 'underpowered', note: 'Misses markers on complex reports' },
  { match: 'qwen3.5:1.5b',    tier: 'inadequate',  note: 'Cannot reliably parse lab reports' },
  // Qwen 3
  { match: 'qwen3:30b',       tier: 'recommended', note: 'Strong reasoning + structured output' },
  { match: 'qwen3:14b',       tier: 'recommended', note: 'Reliable for lab analysis' },
  { match: 'qwen3:8b',        tier: 'capable',     note: 'Decent but verbose, may need retries' },
  { match: 'qwen3:4b',        tier: 'underpowered', note: 'Struggles with strict JSON format' },
  { match: 'qwen3:1.7b',      tier: 'inadequate',  note: 'Cannot parse lab reports' },
  { match: 'qwen3:0.6b',      tier: 'inadequate',  note: 'Cannot parse lab reports' },
  { match: 'qwq:',            tier: 'capable',     note: 'Strong reasoning but very verbose output' },
  // Llama 3.x
  { match: 'llama3.3:70b',    tier: 'recommended', note: 'Top-tier instruction following' },
  { match: 'llama3.1:70b',    tier: 'recommended', note: 'Reliable for complex lab reports' },
  { match: 'llama3.1:8b',     tier: 'capable',     note: 'Handles basic reports, weaker on specialty labs' },
  { match: 'llama3.2:3b',     tier: 'underpowered', note: 'Misses markers, inconsistent JSON' },
  { match: 'llama3.2:1b',     tier: 'inadequate',  note: 'Cannot parse lab reports' },
  // Gemma
  { match: 'gemma3:27b',      tier: 'recommended', note: 'Strong scientific understanding' },
  { match: 'gemma3:12b',      tier: 'recommended', note: 'Good balance of quality and speed' },
  { match: 'gemma3:4b',       tier: 'underpowered', note: 'Limited medical knowledge at this size' },
  { match: 'gemma3:1b',       tier: 'inadequate',  note: 'Cannot parse lab reports' },
  { match: 'gemma2:27b',      tier: 'recommended', note: 'Strong scientific/medical text' },
  { match: 'gemma2:9b',       tier: 'capable',     note: 'Decent structured extraction' },
  { match: 'gemma2:2b',       tier: 'inadequate',  note: 'Cannot parse lab reports' },
  // Mistral
  { match: 'mistral-small:',  tier: 'capable',     note: '22B — decent medical comprehension' },
  { match: 'mistral:7b',      tier: 'underpowered', note: 'Weak at structured JSON output' },
  { match: 'mistral-nemo:',   tier: 'capable',     note: 'Reasonable instruction following' },
  { match: 'mixtral:',        tier: 'capable',     note: 'MoE — fast but inconsistent on complex reports' },
  // DeepSeek
  { match: 'deepseek-r1:70b', tier: 'recommended', note: 'Excellent reasoning for complex cases' },
  { match: 'deepseek-r1:32b', tier: 'recommended', note: 'Strong reasoning at reasonable size' },
  { match: 'deepseek-r1:14b', tier: 'capable',     note: 'Decent but very verbose, slow' },
  { match: 'deepseek-r1:8b',  tier: 'underpowered', note: 'Reasoning too limited for reliable parsing' },
  { match: 'deepseek-r1:1.5b',tier: 'inadequate',  note: 'Cannot parse lab reports' },
  { match: 'deepseek-v2:',    tier: 'capable',     note: 'MoE, decent at structured tasks' },
  { match: 'deepseek-v3:',    tier: 'recommended', note: 'Strong across all tasks' },
  // Phi
  { match: 'phi4:14b',        tier: 'capable',     note: 'Decent at 14B but weaker JSON compliance' },
  { match: 'phi4:',           tier: 'underpowered', note: 'Struggles with strict JSON format' },
  { match: 'phi3:',           tier: 'inadequate',  note: 'Cannot handle getbased prompts reliably' },
  // Command R
  { match: 'command-r-plus:', tier: 'recommended', note: 'Designed for structured extraction' },
  { match: 'command-r:',      tier: 'capable',     note: 'Good at format instructions' },
  // Others
  { match: 'solar:',          tier: 'underpowered', note: 'Inconsistent JSON output' },
  { match: 'yi:',             tier: 'underpowered', note: 'Weak at strict structured output' },
  { match: 'codellama:',      tier: 'inadequate',  note: 'Code-specialized, no medical knowledge' },
  { match: 'tinyllama:',      tier: 'inadequate',  note: 'Far too small' },
  { match: 'orca-mini:',      tier: 'inadequate',  note: 'Outdated, unreliable' },
];
// Sort by match length descending for specificity
MODEL_FITNESS.sort((a, b) => b.match.length - a.match.length);

export function assessFitness(modelName) {
  if (!modelName) return null;
  const lower = modelName.toLowerCase();
  // Exact/specific match first (sorted by length descending)
  for (const entry of MODEL_FITNESS) {
    if (lower.includes(entry.match.replace(/:$/, '')) || lower.startsWith(entry.match)) {
      return { tier: entry.tier, note: entry.note };
    }
  }
  // Fallback: if model has :latest or unknown size tag, try matching just the family
  // e.g. "qwen3.5:latest" → look for any qwen3.5 entry. Be conservative — unknown size
  // could be the small default variant, so cap at "capable"
  const family = lower.split(':')[0];
  const familyEntries = MODEL_FITNESS.filter(e => e.match.startsWith(family + ':'));
  if (familyEntries.length > 0) {
    const bestTier = Math.max(...familyEntries.map(e => TIER_RANK[e.tier] || 0));
    // Cap at "capable" since we don't know the actual size
    const cappedRank = Math.min(bestTier, TIER_RANK.capable);
    const tierName = Object.entries(TIER_RANK).find(([, v]) => v === cappedRank)?.[0] || 'capable';
    return { tier: tierName, note: 'Depends on model size — pull a specific variant (e.g. :14b) for best results' };
  }
  return null; // unknown model family
}

const TIER_RANK = { recommended: 4, capable: 3, underpowered: 2, inadequate: 1 };

export function getBestModel(modelDetails, hardware) {
  const candidates = modelDetails.map(m => {
    const fitness = assessFitness(m.name);
    const vram = hardware ? assessModel(m, hardware) : null;
    const fitsInVram = !vram || vram.tier === 'fits' || vram.tier === 'tight' || vram.tier === 'unknown';
    return { name: m.name, fitness, fitsInVram, rank: fitness ? TIER_RANK[fitness.tier] || 0 : 0 };
  });
  const fitting = candidates.filter(c => c.fitsInVram).sort((a, b) => b.rank - a.rank);
  return fitting.length > 0 ? fitting[0] : null;
}

// Best model to pull per VRAM tier — always the strongest "recommended" model that fits
const VRAM_RECOMMENDATIONS = [
  { minVram: 0,  maxVram: 6,  model: 'qwen3.5:4b',   note: 'Best available for low VRAM, but expect frequent errors. Consider a cloud provider for reliable results.' },
  { minVram: 6,  maxVram: 8,  model: 'qwen3.5:9b',   note: 'Handles most reports. For complex specialty labs, a cloud provider will be more reliable.' },
  { minVram: 8,  maxVram: 12, model: 'qwen3.5:14b',  note: 'Recommended — reliable lab parsing and medical chat. Closest local experience to cloud AI.' },
  { minVram: 12, maxVram: 16, model: 'qwen3.5:14b',  note: 'Recommended — runs comfortably with room for long reports.' },
  { minVram: 16, maxVram: 24, model: 'qwen3.5:32b',  note: 'Near-cloud quality. Handles all report types including specialty labs.' },
  { minVram: 24, maxVram: 48, model: 'qwen3.5:72b',  note: 'Cloud-grade lab analysis, fully private.' },
  { minVram: 48, maxVram: Infinity, model: 'qwen3.5:72b', note: 'Top-tier — cloud-grade quality, fully local.' },
];

// Returns a suggestion to pull a better model, or null if the user already has a recommended one
export function getUpgradeSuggestion(modelDetails, hardware) {
  const best = getBestModel(modelDetails, hardware);
  // Already has a recommended model that fits? No upgrade needed
  if (best && best.fitness && best.fitness.tier === 'recommended') return null;
  const vram = hardware?.gpu?.vram;
  if (!vram) return null;
  const rec = VRAM_RECOMMENDATIONS.find(r => vram >= r.minVram && vram < r.maxVram);
  if (!rec) return null;
  // Don't suggest a model the user already has
  if (modelDetails.some(m => m.name.startsWith(rec.model.split(':')[0]) && m.name.includes(rec.model.split(':')[1] || ''))) return null;
  return rec;
}

// Kept for backward compat with tests — delegates to getUpgradeSuggestion
export function getModelSuggestions(hardware) {
  // Returns array for compat; new code should use getUpgradeSuggestion
  const vram = hardware?.gpu?.vram;
  if (!vram) return [];
  const rec = VRAM_RECOMMENDATIONS.find(r => vram >= r.minVram && vram < r.maxVram);
  return rec ? [{ model: rec.model, why: rec.note }] : [];
}
