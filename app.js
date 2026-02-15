// ═══════════════════════════════════════════════
// MARKER SCHEMA (no personal data — just biomarker definitions)
// ═══════════════════════════════════════════════
const MARKER_SCHEMA = {
  biochemistry: {
    label: "Biochemistry", icon: "\u{1F9EA}",
    markers: {
      glucose: { name: "Glucose (Gluk\u00f3za)", unit: "mmol/l", refMin: 4.11, refMax: 5.60 },
      urea: { name: "Urea", unit: "mmol/l", refMin: 2.8, refMax: 8.3 },
      creatinine: { name: "Creatinine (Kreatinin)", unit: "\u00b5mol/l", refMin: 62, refMax: 106, refMin_f: 44, refMax_f: 80 },
      egfr: { name: "eGFR (CKD-EPI)", unit: "ml/s/1.73m\u00b2", refMin: 1.00, refMax: 2.30 },
      uricAcid: { name: "Uric Acid (Kyselina mo\u010dov\u00e1)", unit: "\u00b5mol/l", refMin: 202, refMax: 417, refMin_f: 143, refMax_f: 339 },
      bilirubinTotal: { name: "Bilirubin Total", unit: "\u00b5mol/l", refMin: 3.0, refMax: 24.0 },
      ast: { name: "AST", unit: "\u00b5kat/l", refMin: 0.17, refMax: 0.85 },
      alt: { name: "ALT", unit: "\u00b5kat/l", refMin: 0.17, refMax: 0.83 },
      alp: { name: "ALP", unit: "\u00b5kat/l", refMin: 0.67, refMax: 2.15 },
      ggt: { name: "GGT", unit: "\u00b5kat/l", refMin: 0.17, refMax: 1.19 },
      ldh: { name: "LDH", unit: "\u00b5kat/l", refMin: 2.25, refMax: 3.75 },
      creatineKinase: { name: "Creatine Kinase", unit: "\u00b5kat/l", refMin: 0.65, refMax: 5.14, refMin_f: 0.42, refMax_f: 3.08 },
      cystatinC: { name: "Cystatin C", unit: "mg/l", refMin: 0.61, refMax: 0.95 },
      gfrCystatin: { name: "GFR Cystatin", unit: "ml/s", refMin: 1.80, refMax: 2.63 }
    }
  },
  hormones: {
    label: "Hormones", icon: "\u26A1",
    markers: {
      testosterone: { name: "Testosterone", unit: "nmol/l", refMin: 8.64, refMax: 29.00, refMin_f: 0.29, refMax_f: 1.67 },
      freeTestosterone: { name: "Free Testosterone", unit: "pmol/l", refMin: 30.70, refMax: 161.70, refMin_f: 0.30, refMax_f: 10.40 },
      shbg: { name: "SHBG", unit: "nmol/l", refMin: 14.5, refMax: 54.1, refMin_f: 26.1, refMax_f: 110.0 },
      dheaS: { name: "DHEA-S", unit: "\u00b5mol/l", refMin: 2.41, refMax: 11.60, refMin_f: 1.77, refMax_f: 9.22 },
      fai: { name: "Free Androgen Index", unit: "%", refMin: 34.0, refMax: 106.0, refMin_f: 0.5, refMax_f: 6.9 },
      estradiol: { name: "Estradiol", unit: "pmol/l", refMin: 41.4, refMax: 159.0, refMin_f: 45.4, refMax_f: 854.0 },
      progesterone: { name: "Progesterone", unit: "nmol/l", refMin: 0.159, refMax: 0.474, refMin_f: 0.181, refMax_f: 27.0 },
      calcitonin: { name: "Calcitonin", unit: "ng/l", refMin: 1.0, refMax: 11.8, refMin_f: 1.0, refMax_f: 4.6 },
      dht: { name: "DHT", unit: "nmol/l", refMin: 0.86, refMax: 3.40, refMin_f: 0.12, refMax_f: 0.86 },
      igf1: { name: "IGF-1", unit: "\u00b5g/l", refMin: 96.4, refMax: 227.8 },
      insulin: { name: "Insulin", unit: "mU/l", refMin: 2.6, refMax: 24.9 }
    }
  },
  electrolytes: {
    label: "Electrolytes & Minerals", icon: "\u2699\uFE0F",
    markers: {
      sodium: { name: "Sodium", unit: "mmol/l", refMin: 136, refMax: 145 },
      potassium: { name: "Potassium", unit: "mmol/l", refMin: 3.5, refMax: 5.1 },
      chloride: { name: "Chloride", unit: "mmol/l", refMin: 97, refMax: 108 },
      calciumTotal: { name: "Calcium Total", unit: "mmol/l", refMin: 2.15, refMax: 2.50 },
      phosphorus: { name: "Phosphorus", unit: "mmol/l", refMin: 0.81, refMax: 1.45 },
      magnesium: { name: "Magnesium (serum)", unit: "mmol/l", refMin: 0.66, refMax: 1.07 },
      magnesiumRBC: { name: "Magnesium RBC", unit: "mmol/l", refMin: 1.44, refMax: 2.60 },
      copper: { name: "Copper", unit: "\u00b5mol/l", refMin: 11.6, refMax: 20.6 },
      zinc: { name: "Zinc", unit: "\u00b5mol/l", refMin: 9.8, refMax: 18.0 }
    }
  },
  lipids: {
    label: "Lipid Panel", icon: "\uD83D\uDCA7",
    markers: {
      cholesterol: { name: "Total Cholesterol", unit: "mmol/l", refMin: 2.90, refMax: 5.00 },
      triglycerides: { name: "Triglycerides", unit: "mmol/l", refMin: 0.45, refMax: 1.70 },
      hdl: { name: "HDL Cholesterol", unit: "mmol/l", refMin: 1.00, refMax: 2.10 },
      ldl: { name: "LDL Cholesterol", unit: "mmol/l", refMin: 1.20, refMax: 3.00 },
      nonHdl: { name: "Non-HDL Cholesterol", unit: "mmol/l", refMin: 0.00, refMax: 3.80 },
      cholHdlRatio: { name: "Chol/HDL Ratio", unit: "", refMin: 0.0, refMax: 5.0 },
      apoAI: { name: "Apo A-I", unit: "g/l", refMin: 1.00, refMax: 1.70 },
      apoB: { name: "Apo B", unit: "g/l", refMin: 0.50, refMax: 1.00 }
    }
  },
  iron: {
    label: "Iron Metabolism", icon: "\uD83D\uDD34",
    markers: {
      iron: { name: "Iron", unit: "\u00b5mol/l", refMin: 5.8, refMax: 34.5, refMin_f: 6.6, refMax_f: 26.0 },
      ferritin: { name: "Ferritin", unit: "\u00b5g/l", refMin: 30, refMax: 400, refMin_f: 13, refMax_f: 150 },
      transferrin: { name: "Transferrin", unit: "g/l", refMin: 2.0, refMax: 3.6 },
      tibc: { name: "TIBC", unit: "\u00b5mol/l", refMin: 22.3, refMax: 61.7 },
      transferrinSat: { name: "Transferrin Sat.", unit: "%", refMin: 16.0, refMax: 45.0 }
    }
  },
  proteins: {
    label: "Proteins & Inflammation", icon: "\uD83D\uDEE1\uFE0F",
    markers: {
      hsCRP: { name: "hs-CRP", unit: "mg/l", refMin: 0.00, refMax: 3.00 },
      totalProtein: { name: "Total Protein", unit: "g/l", refMin: 64.0, refMax: 83.0 },
      albumin: { name: "Albumin", unit: "g/l", refMin: 35.0, refMax: 52.0 },
      ceruloplasmin: { name: "Ceruloplasmin", unit: "g/l", refMin: 0.15, refMax: 0.30 }
    }
  },
  thyroid: {
    label: "Thyroid", icon: "\uD83E\uDD8B",
    markers: {
      tsh: { name: "TSH", unit: "mU/l", refMin: 0.270, refMax: 4.200 },
      ft4: { name: "Free T4", unit: "pmol/l", refMin: 11.9, refMax: 21.6 },
      ft3: { name: "Free T3", unit: "pmol/l", refMin: 3.1, refMax: 6.8 },
      t4total: { name: "Total T4", unit: "nmol/l", refMin: 66.0, refMax: 181.0 },
      t3total: { name: "Total T3", unit: "nmol/l", refMin: 1.30, refMax: 3.10 }
    }
  },
  vitamins: {
    label: "Vitamins", icon: "\u2600\uFE0F",
    markers: {
      vitaminD: { name: "Vitamin D Total", unit: "nmol/l", refMin: 75.0, refMax: 250.0 },
      vitaminD3: { name: "Vitamin D3", unit: "nmol/l", refMin: 50.0, refMax: 175.0 },
      vitaminA: { name: "Vitamin A", unit: "\u00b5mol/l", refMin: 1.05, refMax: 2.80 }
    }
  },
  diabetes: {
    label: "Diabetes / Glucose", icon: "\uD83D\uDCCA",
    markers: {
      hba1c: { name: "HbA1c", unit: "mmol/mol", refMin: 20.0, refMax: 42.0 },
      insulin_d: { name: "Insulin", unit: "mU/l", refMin: 2.6, refMax: 24.9 },
      homaIR: { name: "HOMA-IR (calc)", unit: "", refMin: 0, refMax: 2.5 }
    }
  },
  tumorMarkers: {
    label: "Tumor Markers", icon: "\uD83D\uDD2C",
    markers: {
      psa: { name: "PSA", unit: "\u00b5g/l", refMin: 0.003, refMax: 1.400 }
    }
  },
  coagulation: {
    label: "Coagulation", icon: "\uD83E\uDE78",
    markers: {
      homocysteine: { name: "Homocysteine", unit: "\u00b5mol/l", refMin: 5.2, refMax: 15.0, refMin_f: 3.7, refMax_f: 10.4 }
    }
  },
  hematology: {
    label: "Hematology (CBC)", icon: "\uD83E\uDDE0",
    markers: {
      wbc: { name: "WBC", unit: "10^9/l", refMin: 4.00, refMax: 10.00 },
      rbc: { name: "RBC", unit: "10^12/l", refMin: 4.00, refMax: 5.80, refMin_f: 3.80, refMax_f: 5.20 },
      hemoglobin: { name: "Hemoglobin", unit: "g/l", refMin: 135, refMax: 175, refMin_f: 120, refMax_f: 160 },
      hematocrit: { name: "Hematocrit", unit: "", refMin: 0.400, refMax: 0.500, refMin_f: 0.350, refMax_f: 0.450 },
      mcv: { name: "MCV", unit: "fl", refMin: 82.0, refMax: 98.0 },
      mch: { name: "MCH", unit: "pg", refMin: 28.0, refMax: 34.0 },
      mchc: { name: "MCHC", unit: "g/l", refMin: 320, refMax: 360 },
      rdwcv: { name: "RDW-CV", unit: "%", refMin: 10.0, refMax: 15.2 },
      platelets: { name: "Platelets", unit: "10^9/l", refMin: 150, refMax: 400 },
      mpv: { name: "MPV", unit: "fl", refMin: 7.8, refMax: 12.8 },
      pdw: { name: "PDW", unit: "fl", refMin: 9.0, refMax: 17.0 }
    }
  },
  differential: {
    label: "WBC Differential", icon: "\uD83E\uDDEB",
    markers: {
      neutrophils: { name: "Neutrophils #", unit: "10^9/l", refMin: 2.0, refMax: 7.0 },
      lymphocytes: { name: "Lymphocytes #", unit: "10^9/l", refMin: 0.8, refMax: 4.0 },
      monocytes: { name: "Monocytes #", unit: "10^9/l", refMin: 0.08, refMax: 1.20 },
      eosinophils: { name: "Eosinophils #", unit: "10^9/l", refMin: 0.0, refMax: 0.5 },
      basophils: { name: "Basophils #", unit: "10^9/l", refMin: 0.0, refMax: 0.2 },
      neutrophilsPct: { name: "Neutrophils %", unit: "", refMin: 0.45, refMax: 0.70 },
      lymphocytesPct: { name: "Lymphocytes %", unit: "", refMin: 0.20, refMax: 0.45 },
      monocytesPct: { name: "Monocytes %", unit: "", refMin: 0.02, refMax: 0.12 }
    }
  },
  fattyAcids: {
    label: "Fatty Acids", icon: "\uD83D\uDC1F", singlePoint: true,
    markers: {
      palmiticC16: { name: "Palmitic Acid C16:0", unit: "%", refMin: 28.1, refMax: 30.1 },
      stearicC18: { name: "Stearic Acid C18:0", unit: "%", refMin: 12.5, refMax: 13.8 },
      oleicC18_1: { name: "Oleic Acid C18:1", unit: "%", refMin: 20.9, refMax: 23.4 },
      linoleicC18_2: { name: "Linoleic Acid C18:2", unit: "%", refMin: 18.4, refMax: 21.3 },
      glaC18_3: { name: "GLA C18:3", unit: "%", refMin: 0.11, refMax: 0.22 },
      arachidonicC20_4: { name: "Arachidonic C20:4", unit: "%", refMin: 5.50, refMax: 8.50 },
      dglaC20_3: { name: "DGLA C20:3", unit: "%", refMin: 0.91, refMax: 1.16 },
      alaC18_3: { name: "ALA C18:3", unit: "%", refMin: 0.58, refMax: 0.89 },
      epaC20_5: { name: "EPA C20:5", unit: "%", refMin: 3.23, refMax: 4.72 },
      dpaC22_5: { name: "DPA C22:5", unit: "%", refMin: 1.95, refMax: 2.36 },
      dhaC22_6: { name: "DHA C22:6", unit: "%", refMin: 3.95, refMax: 4.64 },
      omega3Index: { name: "Omega-3 Index", unit: "%", refMin: 8.0, refMax: 12.0 },
      omega6to3Ratio: { name: "Omega-6/3 Ratio", unit: "", refMin: 1.0, refMax: 4.0 },
      membraneFluidity: { name: "Membrane Fluidity", unit: "", refMin: 1.0, refMax: 4.0 },
      mentalResilience: { name: "Mental Resilience Idx", unit: "", refMin: 0.5, refMax: 1.0 }
    }
  },
  boneMetabolism: {
    label: "Bone Metabolism", icon: "\uD83E\uDDB4",
    markers: {
      osteocalcin: { name: "Osteocalcin", unit: "\u00b5g/l", refMin: 14.0, refMax: 42.0 }
    }
  },
  calculatedRatios: {
    label: "Calculated Ratios", icon: "\uD83D\uDCD0", calculated: true,
    markers: {
      tgHdlRatio: { name: "TG/HDL Ratio", unit: "", refMin: 0, refMax: 1.75 },
      ldlHdlRatio: { name: "LDL/HDL Ratio", unit: "", refMin: 0, refMax: 2.5, refMax_f: 2.0 },
      apoBapoAIRatio: { name: "ApoB/ApoA-I Ratio", unit: "", refMin: 0, refMax: 0.9, refMax_f: 0.8 },
      nlr: { name: "Neutrophil-Lymphocyte Ratio (NLR)", unit: "", refMin: 1.0, refMax: 3.0 },
      plr: { name: "Platelet-Lymphocyte Ratio (PLR)", unit: "", refMin: 50, refMax: 150 },
      deRitisRatio: { name: "De Ritis Ratio (AST/ALT)", unit: "", refMin: 0.8, refMax: 1.2 },
      copperZincRatio: { name: "Copper/Zinc Ratio", unit: "", refMin: 0.7, refMax: 1.0 },
      freeWaterDeficit: { name: "Free Water Deficit", unit: "L", refMin: -1.5, refMax: 1.5 },
      phenoAge: { name: "PhenoAge (Biological Age)", unit: "years", refMin: null, refMax: null }
    }
  }
};

// ═══════════════════════════════════════════════
// UNIT CONVERSIONS (EU SI → US conventional)
// ═══════════════════════════════════════════════
const UNIT_CONVERSIONS = {
  'biochemistry.glucose': { factor: 18.018, usUnit: 'mg/dl', type: 'multiply' },
  'biochemistry.urea': { factor: 2.801, usUnit: 'mg/dl', type: 'multiply' },
  'biochemistry.creatinine': { factor: 0.01131, usUnit: 'mg/dl', type: 'multiply' },
  'biochemistry.uricAcid': { factor: 0.01681, usUnit: 'mg/dl', type: 'multiply' },
  'biochemistry.bilirubinTotal': { factor: 0.05848, usUnit: 'mg/dl', type: 'multiply' },
  'biochemistry.ast': { factor: 60, usUnit: 'U/L', type: 'multiply' },
  'biochemistry.alt': { factor: 60, usUnit: 'U/L', type: 'multiply' },
  'biochemistry.alp': { factor: 60, usUnit: 'U/L', type: 'multiply' },
  'biochemistry.ggt': { factor: 60, usUnit: 'U/L', type: 'multiply' },
  'biochemistry.ldh': { factor: 60, usUnit: 'U/L', type: 'multiply' },
  'biochemistry.creatineKinase': { factor: 60, usUnit: 'U/L', type: 'multiply' },
  'hormones.testosterone': { factor: 28.818, usUnit: 'ng/dl', type: 'multiply' },
  'hormones.freeTestosterone': { factor: 0.2885, usUnit: 'pg/ml', type: 'multiply' },
  'hormones.estradiol': { factor: 0.2724, usUnit: 'pg/ml', type: 'multiply' },
  'hormones.progesterone': { factor: 0.3145, usUnit: 'ng/ml', type: 'multiply' },
  'hormones.dheaS': { factor: 36.87, usUnit: '\u00b5g/dl', type: 'multiply' },
  'hormones.dht': { factor: 28.818, usUnit: 'ng/dl', type: 'multiply' },
  'lipids.cholesterol': { factor: 38.67, usUnit: 'mg/dl', type: 'multiply' },
  'lipids.triglycerides': { factor: 88.57, usUnit: 'mg/dl', type: 'multiply' },
  'lipids.hdl': { factor: 38.67, usUnit: 'mg/dl', type: 'multiply' },
  'lipids.ldl': { factor: 38.67, usUnit: 'mg/dl', type: 'multiply' },
  'lipids.nonHdl': { factor: 38.67, usUnit: 'mg/dl', type: 'multiply' },
  'iron.iron': { factor: 5.585, usUnit: '\u00b5g/dl', type: 'multiply' },
  'vitamins.vitaminD': { factor: 0.4006, usUnit: 'ng/ml', type: 'multiply' },
  'vitamins.vitaminD3': { factor: 0.4006, usUnit: 'ng/ml', type: 'multiply' },
  'hematology.hemoglobin': { factor: 0.1, usUnit: 'g/dl', type: 'multiply' },
  'electrolytes.calciumTotal': { factor: 4.008, usUnit: 'mg/dl', type: 'multiply' },
  'electrolytes.phosphorus': { factor: 3.097, usUnit: 'mg/dl', type: 'multiply' },
  'electrolytes.magnesium': { factor: 2.431, usUnit: 'mg/dl', type: 'multiply' },
  'electrolytes.magnesiumRBC': { factor: 2.431, usUnit: 'mg/dl', type: 'multiply' },
  'electrolytes.copper': { factor: 6.355, usUnit: '\u00b5g/dl', type: 'multiply' },
  'electrolytes.zinc': { factor: 6.54, usUnit: '\u00b5g/dl', type: 'multiply' },
  'proteins.totalProtein': { factor: 0.1, usUnit: 'g/dl', type: 'multiply' },
  'proteins.albumin': { factor: 0.1, usUnit: 'g/dl', type: 'multiply' },
  'thyroid.t4total': { factor: 0.07769, usUnit: '\u00b5g/dl', type: 'multiply' },
  'diabetes.hba1c': { type: 'hba1c' },
  'calculatedRatios.tgHdlRatio': { factor: 2.29, usUnit: '', type: 'multiply' }
};

// (SPADIA_NAME_MAP removed — AI handles name matching)

// ═══════════════════════════════════════════════
// CORRELATION PRESETS
// ═══════════════════════════════════════════════
const CORRELATION_PRESETS = [
  { label: "Testosterone vs SHBG", markers: ["hormones.testosterone", "hormones.shbg"] },
  { label: "LDL vs hs-CRP", markers: ["lipids.ldl", "proteins.hsCRP"] },
  { label: "HbA1c vs Insulin vs HOMA-IR", markers: ["diabetes.hba1c", "diabetes.insulin_d", "diabetes.homaIR"] },
  { label: "Liver Enzymes", markers: ["biochemistry.ast", "biochemistry.alt", "biochemistry.alp", "biochemistry.ggt"] },
  { label: "Iron Panel", markers: ["iron.iron", "iron.ferritin", "iron.transferrin"] },
  { label: "Lipid Panel", markers: ["lipids.cholesterol", "lipids.hdl", "lipids.ldl", "lipids.triglycerides"] },
  { label: "Vitamin D vs Calcium", markers: ["vitamins.vitaminD", "electrolytes.calciumTotal"] },
  { label: "TSH vs T3 vs T4", markers: ["thyroid.tsh", "thyroid.ft3", "thyroid.ft4"] }
];
const CHIP_COLORS = ['#4f8cff','#34d399','#f87171','#fbbf24','#a78bfa','#f472b6','#38bdf8','#fb923c'];

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getStatus(value, refMin, refMax) {
  if (value === null || value === undefined) return "missing";
  if (refMin == null || refMax == null) return "normal";
  if (value < refMin) return "low";
  if (value > refMax) return "high";
  return "normal";
}
function getRangePosition(value, refMin, refMax) {
  if (value === null || value === undefined) return null;
  return ((value - refMin) / (refMax - refMin)) * 100;
}

// ═══════════════════════════════════════════════
// APP LOGIC
// ═══════════════════════════════════════════════
let chartInstances = {};
const markerRegistry = {};
let importedData = { entries: [], notes: [], supplements: [] };
let unitSystem = 'EU';
let selectedCorrelationMarkers = [];
let currentProfile = 'default';
let profileSex = null;
let profileDob = null;
let chatHistory = [];

// ═══════════════════════════════════════════════
// API KEY MANAGEMENT (global, not per-profile)
// ═══════════════════════════════════════════════
function getApiKey() { return localStorage.getItem('labcharts-api-key') || ''; }
function saveApiKey(key) { localStorage.setItem('labcharts-api-key', key); }
function hasApiKey() { return !!getApiKey(); }

async function validateApiKey(key) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 16,
        messages: [{ role: 'user', content: 'Reply with "ok"' }]
      })
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

async function callClaudeAPI({ system, messages, maxTokens, onStream }) {
  const key = getApiKey();
  if (!key) throw new Error('No API key configured');
  const body = {
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: maxTokens || 4096,
    messages
  };
  if (system) body.system = system;
  if (onStream) body.stream = true;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid API key. Check your settings.');
    if (res.status === 429) throw new Error('Rate limited. Please wait a moment and try again.');
    throw new Error(`API error (${res.status})`);
  }

  if (onStream) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';
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
          }
        } catch {}
      }
    }
    return fullText;
  } else {
    const data = await res.json();
    return data.content?.[0]?.text || '';
  }
}

// ═══════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════
function openSettingsModal() {
  const overlay = document.getElementById('settings-modal-overlay');
  const modal = document.getElementById('settings-modal');
  const currentKey = getApiKey();
  const masked = currentKey ? currentKey.slice(0, 10) + '...' + currentKey.slice(-4) : '';
  modal.innerHTML = `
    <button class="modal-close" onclick="closeSettingsModal()">&times;</button>
    <h3>Settings</h3>
    <div style="margin-top:20px">
      <label style="font-size:14px;font-weight:600;display:block;margin-bottom:8px">Anthropic API Key</label>
      <div class="api-key-status" id="api-key-status">
        ${currentKey ? `<span style="color:var(--green)">Key configured: ${masked}</span>` : '<span style="color:var(--text-muted)">No key set</span>'}
      </div>
      <input type="password" class="api-key-input" id="api-key-input" placeholder="sk-ant-api03-..." value="${currentKey}">
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="import-btn import-btn-primary" id="save-api-key-btn" onclick="handleSaveApiKey()">Save & Validate</button>
        ${currentKey ? '<button class="import-btn import-btn-secondary" onclick="handleRemoveApiKey()">Remove Key</button>' : ''}
      </div>
      <div class="privacy-notice">Your API key is stored locally in your browser and sent directly to Anthropic's API. It never passes through any third-party server.</div>
    </div>`;
  overlay.classList.add('show');
}

function closeSettingsModal() {
  document.getElementById('settings-modal-overlay').classList.remove('show');
}

async function handleSaveApiKey() {
  const input = document.getElementById('api-key-input');
  const btn = document.getElementById('save-api-key-btn');
  const status = document.getElementById('api-key-status');
  const key = input.value.trim();
  if (!key) { status.innerHTML = '<span style="color:var(--red)">Please enter an API key</span>'; return; }
  btn.disabled = true; btn.textContent = 'Validating...';
  const result = await validateApiKey(key);
  if (result.valid) {
    saveApiKey(key);
    status.innerHTML = '<span style="color:var(--green)">Connected successfully</span>';
    showNotification('API key saved', 'success');
    setTimeout(() => closeSettingsModal(), 1000);
  } else {
    status.innerHTML = `<span style="color:var(--red)">${result.error}</span>`;
  }
  btn.disabled = false; btn.textContent = 'Save & Validate';
}

function handleRemoveApiKey() {
  localStorage.removeItem('labcharts-api-key');
  showNotification('API key removed', 'info');
  openSettingsModal();
}

// ═══════════════════════════════════════════════
// PROFILE MANAGEMENT
// ═══════════════════════════════════════════════
function getProfiles() {
  try { return JSON.parse(localStorage.getItem('labcharts-profiles')) || []; }
  catch(e) { return []; }
}

function saveProfiles(profiles) {
  localStorage.setItem('labcharts-profiles', JSON.stringify(profiles));
}

function getActiveProfileId() {
  return localStorage.getItem('labcharts-active-profile') || 'default';
}

function setActiveProfileId(id) {
  localStorage.setItem('labcharts-active-profile', id);
}

function profileStorageKey(profileId, suffix) {
  return `labcharts-${profileId}-${suffix}`;
}

function loadProfile(profileId) {
  currentProfile = profileId;
  setActiveProfileId(profileId);
  const savedImported = localStorage.getItem(profileStorageKey(profileId, 'imported'));
  importedData = savedImported ? (function() { try { const d = JSON.parse(savedImported); if (!d.notes) d.notes = []; if (!d.supplements) d.supplements = []; return d; } catch(e) { return { entries: [], notes: [], supplements: [] }; } })() : { entries: [], notes: [], supplements: [] };
  const savedUnits = localStorage.getItem(profileStorageKey(profileId, 'units'));
  unitSystem = savedUnits === 'US' ? 'US' : 'EU';
  profileSex = getProfileSex(profileId);
  profileDob = getProfileDob(profileId);
  document.querySelectorAll('.unit-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === unitSystem);
  });
  document.querySelectorAll('.sex-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sex === profileSex);
  });
  const dobInput = document.getElementById('dob-input');
  if (dobInput) dobInput.value = profileDob || '';
  selectedCorrelationMarkers = [];
  chatHistory = [];
  destroyAllCharts();
  buildSidebar();
  showDashboard();
  updateHeaderDates();
  renderProfileDropdown();
}

function createProfile(name) {
  const profiles = getProfiles();
  const id = Date.now().toString(36);
  profiles.push({ id, name });
  saveProfiles(profiles);
  return id;
}

function renameProfile(profileId, newName) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  if (p) { p.name = newName; saveProfiles(profiles); }
}

function deleteProfile(profileId) {
  const profiles = getProfiles();
  if (profiles.length <= 1) { showNotification("Cannot delete the last profile", "error"); return; }
  if (!confirm('Delete this profile and all its data? This cannot be undone.')) return;
  const updated = profiles.filter(p => p.id !== profileId);
  saveProfiles(updated);
  localStorage.removeItem(profileStorageKey(profileId, 'imported'));
  localStorage.removeItem(profileStorageKey(profileId, 'units'));
  localStorage.removeItem(`labcharts-${profileId}-chat`);
  if (currentProfile === profileId) {
    loadProfile(updated[0].id);
  } else {
    renderProfileDropdown();
  }
  showNotification('Profile deleted', 'info');
}

function switchProfile(profileId) {
  if (profileId === currentProfile) return;
  loadProfile(profileId);
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  showNotification(`Switched to ${p ? p.name : 'profile'}`, 'info');
}

function getProfileSex(profileId) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  return (p && p.sex) || null;
}

function setProfileSex(profileId, sex) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  if (p) { p.sex = sex; saveProfiles(profiles); }
}

function switchSex(sex) {
  profileSex = sex;
  setProfileSex(currentProfile, sex);
  document.querySelectorAll('.sex-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sex === sex);
  });
  buildSidebar();
  updateHeaderDates();
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  navigate(activeCat);
}

function getProfileDob(profileId) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  return (p && p.dob) || null;
}

function setProfileDob(profileId, dob) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === profileId);
  if (p) { p.dob = dob || null; saveProfiles(profiles); }
}

function switchDob(dob) {
  profileDob = dob || null;
  setProfileDob(currentProfile, profileDob);
  buildSidebar();
  updateHeaderDates();
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  navigate(activeCat);
}

// ═══════════════════════════════════════════════
// DATA PIPELINE
// ═══════════════════════════════════════════════
function getActiveData() {
  const data = {
    dates: [],
    dateLabels: [],
    categories: JSON.parse(JSON.stringify(MARKER_SCHEMA))
  };

  // Merge custom markers into categories
  const custom = (importedData && importedData.customMarkers) ? importedData.customMarkers : {};
  for (const [fullKey, def] of Object.entries(custom)) {
    const [catKey, markerKey] = fullKey.split('.');
    if (!markerKey) continue;
    if (!data.categories[catKey]) {
      // Create new category
      data.categories[catKey] = {
        label: def.categoryLabel || catKey.charAt(0).toUpperCase() + catKey.slice(1),
        icon: '\uD83D\uDD16',
        markers: {}
      };
    }
    // Add marker if not already in schema
    if (!data.categories[catKey].markers[markerKey]) {
      data.categories[catKey].markers[markerKey] = {
        name: def.name,
        unit: def.unit || '',
        refMin: def.refMin,
        refMax: def.refMax,
        custom: true
      };
    }
  }

  // Apply sex-specific reference ranges
  if (profileSex === 'female') {
    for (const cat of Object.values(data.categories)) {
      for (const marker of Object.values(cat.markers)) {
        if (marker.refMin_f !== undefined) { marker.refMin = marker.refMin_f; marker.refMax = marker.refMax_f; }
      }
    }
  }

  const entries = (importedData && importedData.entries) ? importedData.entries : [];
  const hasEntries = entries.length > 0;

  // Build entry lookup: date → merged markers
  const entryLookup = {};
  for (const entry of entries) {
    if (!entryLookup[entry.date]) entryLookup[entry.date] = {};
    Object.assign(entryLookup[entry.date], entry.markers);
  }

  // Identify singlePoint categories
  const singlePointCats = new Set();
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) singlePointCats.add(catKey);
  }

  // Collect dates from entries that have non-singlePoint markers
  const regularDates = new Set();
  if (hasEntries) {
    for (const entry of entries) {
      for (const key of Object.keys(entry.markers)) {
        if (!singlePointCats.has(key.split('.')[0])) {
          regularDates.add(entry.date);
          break;
        }
      }
    }
  }

  const sortedDates = [...regularDates].sort();
  data.dates = sortedDates;
  data.dateLabels = sortedDates.map(d => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  // Populate values for each category
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) {
      // Find the first entry that has any marker in this category
      let singleDate = null;
      for (const entry of entries) {
        for (const key of Object.keys(entry.markers)) {
          if (key.startsWith(catKey + '.')) { singleDate = entry.date; break; }
        }
        if (singleDate) break;
      }
      cat.singleDate = singleDate;
      const singleDateLabel = singleDate
        ? new Date(singleDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : null;
      cat.singleDateLabel = singleDateLabel;
      for (const [markerKey, marker] of Object.entries(cat.markers)) {
        marker.singlePoint = true;
        marker.singleDateLabel = singleDateLabel;
        const fullKey = `${catKey}.${markerKey}`;
        if (singleDate && entryLookup[singleDate] && entryLookup[singleDate][fullKey] !== undefined) {
          marker.values = [entryLookup[singleDate][fullKey]];
        } else {
          marker.values = [];
        }
      }
    } else {
      for (const [markerKey, marker] of Object.entries(cat.markers)) {
        const fullKey = `${catKey}.${markerKey}`;
        marker.values = sortedDates.map(date => {
          if (entryLookup[date] && entryLookup[date][fullKey] !== undefined) {
            return entryLookup[date][fullKey];
          }
          return null;
        });
      }
    }
  }

  // Calculate ratios from component markers
  const ratios = data.categories.calculatedRatios;
  if (ratios) {
    const getVals = (catKey, markerKey) => {
      const cat = data.categories[catKey];
      return cat && cat.markers[markerKey] ? cat.markers[markerKey].values : null;
    };
    const divide = (numVals, denVals) => {
      if (!numVals || !denVals) return sortedDates.map(() => null);
      return sortedDates.map((_, i) => {
        const n = numVals[i], d = denVals[i];
        return (n != null && d != null && d !== 0) ? Math.round((n / d) * 1000) / 1000 : null;
      });
    };
    ratios.markers.tgHdlRatio.values = divide(getVals('lipids', 'triglycerides'), getVals('lipids', 'hdl'));
    ratios.markers.ldlHdlRatio.values = divide(getVals('lipids', 'ldl'), getVals('lipids', 'hdl'));
    ratios.markers.apoBapoAIRatio.values = divide(getVals('lipids', 'apoB'), getVals('lipids', 'apoAI'));
    ratios.markers.nlr.values = divide(getVals('differential', 'neutrophils'), getVals('differential', 'lymphocytes'));
    ratios.markers.plr.values = divide(getVals('hematology', 'platelets'), getVals('differential', 'lymphocytes'));
    ratios.markers.deRitisRatio.values = divide(getVals('biochemistry', 'ast'), getVals('biochemistry', 'alt'));
    ratios.markers.copperZincRatio.values = divide(getVals('electrolytes', 'copper'), getVals('electrolytes', 'zinc'));

    // Free Water Deficit — TBW × (Na/140 − 1), assumes 70kg body weight
    const sodiumVals = getVals('electrolytes', 'sodium');
    ratios.markers.freeWaterDeficit.values = sortedDates.map((_, i) => {
      const na = sodiumVals ? sodiumVals[i] : null;
      if (na == null || na <= 0) return null;
      const tbwFactor = profileSex === 'female' ? 0.5 : 0.6;
      const tbw = 70 * tbwFactor;
      const fwd = tbw * (na / 140 - 1);
      return Math.round(fwd * 100) / 100;
    });

    // PhenoAge (Levine 2018) — biological age from 9 biomarkers + chronological age
    ratios.markers.phenoAge.values = sortedDates.map((dateStr, i) => {
      if (!profileDob) return null;
      const albumin_si   = getVals('proteins', 'albumin')?.[i];        // g/l
      const creatinine_si = getVals('biochemistry', 'creatinine')?.[i]; // µmol/l
      const glucose_si   = getVals('biochemistry', 'glucose')?.[i];    // mmol/l
      const crp          = getVals('proteins', 'hsCRP')?.[i];          // mg/l (same)
      const lymphPct_si  = getVals('differential', 'lymphocytesPct')?.[i]; // fraction 0–1
      const mcv          = getVals('hematology', 'mcv')?.[i];          // fL (same)
      const rdw          = getVals('hematology', 'rdwcv')?.[i];        // % (same)
      const alp_si       = getVals('biochemistry', 'alp')?.[i];        // µkat/l
      const wbc          = getVals('hematology', 'wbc')?.[i];          // 10^9/l (same)
      if ([albumin_si, creatinine_si, glucose_si, crp, lymphPct_si, mcv, rdw, alp_si, wbc].some(v => v == null)) return null;
      if (crp <= 0) return null; // ln(CRP) undefined for non-positive

      // Chronological age at blood draw date
      const dob = new Date(profileDob + 'T00:00:00');
      const drawDate = new Date(dateStr + 'T00:00:00');
      let age = (drawDate - dob) / (365.25 * 24 * 60 * 60 * 1000);
      if (age <= 0) return null;

      // Levine 2018 coefficients expect SI units directly (g/L, µmol/L, mmol/L, etc.)
      const xb = -19.907
        - 0.0336  * albumin_si
        + 0.0095  * creatinine_si
        + 0.1953  * glucose_si
        + 0.0954  * Math.log(crp)
        - 0.0120  * lymphPct_si
        + 0.0268  * mcv
        + 0.3306  * rdw
        + 0.00188 * alp_si
        + 0.0554  * wbc
        + 0.0804  * age;

      const mortalityScore = 1 - Math.exp(-Math.exp(xb) * (Math.exp(120 * 0.0076927) - 1) / 0.0076927);
      if (mortalityScore <= 0 || mortalityScore >= 1) return null;
      const phenoAge = 141.50225 + Math.log(-0.00553 * Math.log(1 - mortalityScore)) / 0.090165;
      return Math.round(phenoAge * 10) / 10;
    });
  }

  if (unitSystem === 'US') applyUnitConversion(data);
  return data;
}

function applyUnitConversion(data) {
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [markerKey, marker] of Object.entries(cat.markers)) {
      const conv = UNIT_CONVERSIONS[`${catKey}.${markerKey}`];
      if (!conv) continue;
      if (conv.type === 'multiply') {
        marker.values = marker.values.map(v => v !== null ? parseFloat((v * conv.factor).toPrecision(4)) : null);
        marker.refMin = parseFloat((marker.refMin * conv.factor).toPrecision(4));
        marker.refMax = parseFloat((marker.refMax * conv.factor).toPrecision(4));
        marker.unit = conv.usUnit;
      } else if (conv.type === 'hba1c') {
        marker.values = marker.values.map(v => v !== null ? parseFloat(((v / 10.929) + 2.15).toFixed(1)) : null);
        marker.refMin = parseFloat(((marker.refMin / 10.929) + 2.15).toFixed(1));
        marker.refMax = parseFloat(((marker.refMax / 10.929) + 2.15).toFixed(1));
        marker.unit = '%';
      }
    }
  }
}

function recalculateHOMAIR(entry) {
  const glucose = entry.markers["biochemistry.glucose"];
  const insulin = entry.markers["hormones.insulin"] || entry.markers["diabetes.insulin_d"];
  if (glucose !== undefined && insulin !== undefined) {
    entry.markers["diabetes.homaIR"] = Math.round((glucose * insulin) / 22.5 * 100) / 100;
  }
}

// ═══════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  // Migrate legacy data to profile system on first load
  if (!localStorage.getItem('labcharts-profiles')) {
    const profiles = [{ id: 'default', name: 'Default' }];
    saveProfiles(profiles);
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
  // Load active profile
  currentProfile = getActiveProfileId();
  const savedImported = localStorage.getItem(profileStorageKey(currentProfile, 'imported'));
  if (savedImported) { try { importedData = JSON.parse(savedImported); if (!importedData.notes) importedData.notes = []; } catch(e) {} }
  const savedUnits = localStorage.getItem(profileStorageKey(currentProfile, 'units'));
  if (savedUnits === 'US') unitSystem = 'US';
  profileSex = getProfileSex(currentProfile);
  profileDob = getProfileDob(currentProfile);
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  }
  document.querySelectorAll('.unit-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === unitSystem);
  });
  document.querySelectorAll('.sex-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sex === profileSex);
  });
  const dobInputInit = document.getElementById('dob-input');
  if (dobInputInit) dobInputInit.value = profileDob || '';
  buildSidebar();
  showDashboard();
  updateHeaderDates();
  renderProfileDropdown();
  document.getElementById("pdf-input").addEventListener("change", async e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.json')) importDataJSON(file);
      else await handlePDFFile(file);
      e.target.value = '';
    }
  });
  // Prevent browser from opening dropped files outside drop zone
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => e.preventDefault());
});

function buildSidebar() {
  const data = getActiveData();
  const nav = document.getElementById("sidebar-nav");
  let html = `<div class="nav-item active" data-category="dashboard" onclick="navigate('dashboard')">
    <span class="icon">\uD83D\uDCCB</span> Dashboard</div>`;
  html += `<div class="nav-item" data-category="correlations" onclick="navigate('correlations')">
    <span class="icon">\uD83D\uDCC8</span> Correlations</div>`;
  html += `<div class="sidebar-title">Categories</div>`;
  for (const [key, cat] of Object.entries(data.categories)) {
    const markers = Object.values(cat.markers);
    const flagged = countFlagged(markers);
    const withData = markers.filter(m => m.values && m.values.some(v => v !== null)).length;
    const flagHtml = flagged > 0
      ? `<span class="flag-count">${flagged}</span>`
      : `<span class="count">${withData}</span>`;
    html += `<div class="nav-item" data-category="${key}" onclick="navigate('${key}')">
      <span class="icon">${cat.icon}</span> ${cat.label} ${flagHtml}</div>`;
  }
  nav.innerHTML = html;
}

function navigate(category) {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.category === category);
  });
  destroyAllCharts();
  if (category === "dashboard") showDashboard();
  else if (category === "correlations") showCorrelations();
  else showCategory(category);
}

function showDashboard() {
  const data = getActiveData();
  const main = document.getElementById("main-content");
  const hasData = data.dates.length > 0 || Object.values(data.categories).some(c => c.singlePoint && c.singleDate);

  let html = `<div class="category-header"><h2>Dashboard Overview</h2>`;
  if (hasData) {
    html += `<p>Summary of all blood work results across ${data.dates.length} collection date${data.dates.length !== 1 ? 's' : ''}</p>`;
  }
  html += `</div>`;

  html += `<div class="drop-zone" id="drop-zone">
    <div class="drop-zone-icon">\uD83D\uDCC4</div>
    <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
    <div class="drop-zone-hint">AI-powered — works with any lab PDF report or LabCharts JSON export</div></div>`;

  // Profile context cards
  html += `<div class="context-section-title">What your GP won't ask you</div>`;
  html += `<div class="profile-context-cards">`;
  const diagText = importedData.diagnoses || '';
  html += `<div class="diagnoses-card" onclick="openDiagnosesEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83C\uDFE5 Medical Conditions</span>
      <span class="context-info-icon">i<span class="context-tooltip">Diagnoses directly affect how lab markers should be interpreted — what's abnormal for most may be expected for you.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openDiagnosesEditor()">${diagText ? 'Edit' : '+ Add'}</button>
    </div>
    ${diagText
      ? `<div class="diagnoses-text">${escapeHTML(diagText.length > 200 ? diagText.slice(0, 200) + '...' : diagText)}</div>`
      : `<div class="diagnoses-placeholder">Add any medical conditions so AI can consider them</div>`}
  </div>`;
  const dietText = importedData.diet || '';
  html += `<div class="diagnoses-card" onclick="openDietEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83E\uDD57 Diet</span>
      <span class="context-info-icon">i<span class="context-tooltip">Nutrition has a major impact on blood markers — keto raises LDL, vegetarian diets affect B12 and iron, fasting changes glucose.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openDietEditor()">${dietText ? 'Edit' : '+ Add'}</button>
    </div>
    ${dietText
      ? `<div class="diagnoses-text">${escapeHTML(dietText.length > 200 ? dietText.slice(0, 200) + '...' : dietText)}</div>`
      : `<div class="diagnoses-placeholder">Describe your diet so AI can factor it into lab interpretation</div>`}
  </div>`;
  const circadianText = importedData.circadian || '';
  html += `<div class="diagnoses-card" onclick="openCircadianEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83C\uDF19 Circadian Habits</span>
      <span class="context-info-icon">i<span class="context-tooltip">Light exposure, meal timing, and shift work affect hormone rhythms, cortisol, and metabolic markers.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openCircadianEditor()">${circadianText ? 'Edit' : '+ Add'}</button>
    </div>
    ${circadianText
      ? `<div class="diagnoses-text">${escapeHTML(circadianText.length > 200 ? circadianText.slice(0, 200) + '...' : circadianText)}</div>`
      : `<div class="diagnoses-placeholder">Describe your circadian habits for AI context</div>`}
  </div>`;
  const sleepText = importedData.sleep || '';
  html += `<div class="diagnoses-card" onclick="openSleepEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83D\uDE34 Sleep</span>
      <span class="context-info-icon">i<span class="context-tooltip">Sleep quality and duration directly influence inflammation markers, insulin sensitivity, cortisol, and immune function.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openSleepEditor()">${sleepText ? 'Edit' : '+ Add'}</button>
    </div>
    ${sleepText
      ? `<div class="diagnoses-text">${escapeHTML(sleepText.length > 200 ? sleepText.slice(0, 200) + '...' : sleepText)}</div>`
      : `<div class="diagnoses-placeholder">Describe your sleep habits for AI context</div>`}
  </div>`;
  const exerciseText = importedData.exercise || '';
  html += `<div class="diagnoses-card" onclick="openExerciseEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83C\uDFCB\uFE0F Exercise & Movement</span>
      <span class="context-info-icon">i<span class="context-tooltip">Training type and intensity affect CK, liver enzymes, cholesterol, and inflammatory markers.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openExerciseEditor()">${exerciseText ? 'Edit' : '+ Add'}</button>
    </div>
    ${exerciseText
      ? `<div class="diagnoses-text">${escapeHTML(exerciseText.length > 200 ? exerciseText.slice(0, 200) + '...' : exerciseText)}</div>`
      : `<div class="diagnoses-placeholder">Describe your exercise routine for AI context</div>`}
  </div>`;
  const fieldExpertsText = importedData.fieldExperts || '';
  html += `<div class="diagnoses-card" onclick="openFieldExpertsEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83E\uDDEC Field Experts</span>
      <span class="context-info-icon">i<span class="context-tooltip">Name researchers or clinicians whose frameworks you follow — AI will consider their published work when interpreting your results.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openFieldExpertsEditor()">${fieldExpertsText ? 'Edit' : '+ Add'}</button>
    </div>
    ${fieldExpertsText
      ? `<div class="diagnoses-text">${escapeHTML(fieldExpertsText.length > 200 ? fieldExpertsText.slice(0, 200) + '...' : fieldExpertsText)}</div>`
      : `<div class="diagnoses-placeholder">List experts whose frameworks AI should consider</div>`}
  </div>`;
  html += `</div>`;

  // Supplements & Medications Timeline
  const supps = importedData.supplements || [];
  html += `<div class="supp-timeline-section">
    <div class="supp-timeline-header">
      <span class="context-section-title">Supplements & Medications</span>
      <button class="supp-add-btn" onclick="openSupplementsEditor()">+ Add</button>
    </div>`;
  if (supps.length > 0) {
    // Compute date range for timeline axis
    const today = new Date().toISOString().slice(0, 10);
    let allDates = [];
    for (const s of supps) {
      allDates.push(s.startDate);
      allDates.push(s.endDate || today);
    }
    if (importedData.entries) {
      for (const e of importedData.entries) allDates.push(e.date);
    }
    allDates.sort();
    const minDate = allDates[0];
    const maxDate = allDates[allDates.length - 1];
    const minT = new Date(minDate + 'T00:00:00').getTime();
    const maxT = new Date(maxDate + 'T00:00:00').getTime();
    const range = maxT - minT || 1;
    const fmtAxis = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const midDate = new Date((minT + maxT) / 2).toISOString().slice(0, 10);
    html += `<div class="supp-timeline">
      <div class="supp-timeline-axis">
        <span>${fmtAxis(minDate)}</span><span>${fmtAxis(midDate)}</span><span>${fmtAxis(maxDate)}</span>
      </div>`;
    for (let i = 0; i < supps.length; i++) {
      const s = supps[i];
      const isMed = s.type === 'medication';
      const sT = new Date(s.startDate + 'T00:00:00').getTime();
      const eT = new Date((s.endDate || today) + 'T00:00:00').getTime();
      const leftPct = ((sT - minT) / range * 100).toFixed(2);
      const widthPct = (((eT - sT) / range) * 100).toFixed(2);
      const ongoingCls = !s.endDate ? ' supp-bar-ongoing' : '';
      const typeCls = isMed ? 'supp-bar-medication' : 'supp-bar-supplement';
      html += `<div class="supp-bar-row" onclick="openSupplementsEditor(${i})">
        <span class="supp-bar-label">${escapeHTML(s.name)}${s.dosage ? `<span class="supp-bar-dosage"> ${escapeHTML(s.dosage)}</span>` : ''}</span>
        <div class="supp-bar-track"><div class="supp-bar ${typeCls}${ongoingCls}" style="left:${leftPct}%;width:${Math.max(parseFloat(widthPct), 0.5)}%"></div></div>
      </div>`;
    }
    html += `</div>`;
  } else {
    html += `<div class="supp-timeline"><div class="supp-empty">No supplements or medications tracked yet</div></div>`;
  }
  html += `</div>`;

  const hasEntries = importedData.entries && importedData.entries.length > 0;
  const hasNotes = importedData.notes && importedData.notes.length > 0;
  if (hasEntries || hasNotes) {
    html += `<div class="imported-entries">`;
    html += `<button class="add-note-btn" onclick="openNoteEditor()">+ Add Note</button>`;
    // Merge entries and notes into one sorted-by-date list
    const items = [];
    if (hasEntries) {
      for (const entry of importedData.entries) {
        items.push({ type: 'entry', date: entry.date, entry });
      }
    }
    if (hasNotes) {
      for (let i = 0; i < importedData.notes.length; i++) {
        items.push({ type: 'note', date: importedData.notes[i].date, noteIdx: i, note: importedData.notes[i] });
      }
    }
    items.sort((a, b) => a.date.localeCompare(b.date));
    for (const item of items) {
      const d = new Date(item.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      if (item.type === 'entry') {
        const cnt = Object.keys(item.entry.markers).length;
        html += `<div class="imported-entry">
          <span class="ie-info"><span class="ie-date">${d}</span><span class="ie-count">${cnt} markers</span></span>
          <div class="ie-actions">
            <button class="ie-remove" onclick="removeImportedEntry('${item.entry.date}')">\u2715 Remove</button>
          </div>
        </div>`;
      } else {
        const preview = escapeHTML(item.note.text.length > 80 ? item.note.text.slice(0, 80) + '...' : item.note.text);
        html += `<div class="note-row" onclick="openNoteEditor(null, ${item.noteIdx})">
          <span class="note-row-icon">\uD83D\uDCDD</span>
          <span class="note-row-date">${d}</span>
          <span class="note-row-text">${preview}</span>
          <div class="note-row-actions">
            <button class="ie-remove" onclick="event.stopPropagation();deleteNote(${item.noteIdx})">\u2715</button>
          </div>
        </div>`;
      }
    }
    html += `<div style="display:flex;gap:8px;margin-top:8px">
      <button class="import-btn import-btn-secondary" onclick="exportDataJSON()">Export JSON</button>
      <button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red)" onclick="clearAllData()">Clear All Data</button></div>`;
    html += `</div>`;
  }

  if (!hasData) {
    html += `<div class="empty-state">
      <div class="empty-state-icon">\uD83D\uDCCA</div>
      <h3>Welcome to LabCharts</h3>
      <p>Import your blood work results to get started.</p>
      <ul>
        <li>Drop any lab PDF report above — AI extracts your results automatically</li>
        <li>Import a previously exported LabCharts JSON file</li>
        <li>Use "Ask AI" to get insights about your biomarker trends</li>
      </ul></div>`;
    main.innerHTML = html;
    setupDropZone();
    return;
  }

  const allFlags = getAllFlaggedMarkers(data);
  if (allFlags.length > 0) {
    html += `<div class="alerts-section"><div class="alerts-title">Flagged Results (Latest Values)</div>`;
    for (const f of allFlags) {
      const cls = f.status === "high" ? "alert-high" : "alert-low";
      const label = f.status === "high" ? "HIGH" : "LOW";
      html += `<div class="alert-card ${cls}" onclick="navigate('${f.categoryKey}')">
        <span class="alert-indicator">${label}</span>
        <span class="alert-name">${f.name}</span>
        <span class="alert-value">${f.value} ${f.unit}</span>
        <span class="alert-ref">Ref: ${formatValue(f.refMin)} \u2013 ${formatValue(f.refMax)}</span></div>`;
    }
    html += `</div>`;
  }

  html += `<div class="overview-grid">`;
  for (const [key, cat] of Object.entries(data.categories)) {
    const markers = Object.values(cat.markers);
    const total = markers.length;
    const flagged = countFlagged(markers);
    const normal = total - flagged - countMissing(markers);
    html += `<div class="overview-card" onclick="navigate('${key}')">
      <div class="overview-card-header">
        <span class="overview-card-title">${cat.label}</span>
        <span class="overview-card-icon">${cat.icon}</span></div>
      <div class="overview-stats">
        <div class="overview-stat stat-normal"><div class="stat-value">${normal}</div><div class="stat-label">In Range</div></div>
        <div class="overview-stat stat-flagged"><div class="stat-value">${flagged}</div><div class="stat-label">Flagged</div></div>
        <div class="overview-stat stat-total"><div class="stat-value">${total}</div><div class="stat-label">Total</div></div>
      </div></div>`;
  }
  html += `</div>`;

  html += `<div class="category-header" style="margin-top:16px"><h2>Key Trends</h2>
    <p>Important biomarkers tracked over time</p></div>`;

  const keyMarkers = [
    { cat: "diabetes", key: "hba1c" }, { cat: "diabetes", key: "homaIR" },
    { cat: "lipids", key: "ldl" }, { cat: "vitamins", key: "vitaminD" },
    { cat: "thyroid", key: "tsh" }, { cat: "hormones", key: "testosterone" },
    { cat: "proteins", key: "hsCRP" }, { cat: "biochemistry", key: "ggt" }
  ];

  html += `<div class="charts-grid">`;
  for (const km of keyMarkers) {
    const marker = data.categories[km.cat].markers[km.key];
    html += renderChartCard(km.cat + "_" + km.key, marker, data.dateLabels);
  }
  html += `</div>`;
  main.innerHTML = html;

  for (const km of keyMarkers) {
    const marker = data.categories[km.cat].markers[km.key];
    createLineChart(km.cat + "_" + km.key, marker, data.dateLabels, data.dates);
  }
  setupDropZone();
}

function showCategory(categoryKey) {
  const data = getActiveData();
  const cat = data.categories[categoryKey];
  const main = document.getElementById("main-content");
  let html = `<div class="category-header"><h2>${cat.icon} ${cat.label}</h2>
    <p>${Object.keys(cat.markers).length} biomarkers tracked</p></div>`;

  html += `<div class="view-toggle">
    <button class="view-btn active" onclick="switchView('charts','${categoryKey}',this)">Charts</button>
    <button class="view-btn" onclick="switchView('table','${categoryKey}',this)">Table</button></div>`;

  const hasValues = Object.values(cat.markers).some(m => m.values && m.values.length > 0 && m.values.some(v => v !== null));

  html += `<div id="view-content">`;
  if (!hasValues) {
    html += `<div class="empty-state"><div class="empty-state-icon">${cat.icon}</div>
      <h3>No Data Available</h3><p>Import lab results containing ${cat.label.toLowerCase()} markers to see data here.</p></div>`;
  } else if (cat.singleDate) {
    html += renderFattyAcidsView(cat);
  } else {
    html += `<div class="charts-grid">`;
    for (const [key, marker] of Object.entries(cat.markers)) {
      html += renderChartCard(categoryKey + "_" + key, marker, data.dateLabels);
    }
    html += `</div>`;
  }
  html += `</div>`;
  main.innerHTML = html;

  if (!hasValues) { /* no charts to render */ }
  else if (cat.singleDate) { renderFattyAcidsCharts(cat); }
  else {
    for (const [key, marker] of Object.entries(cat.markers)) {
      createLineChart(categoryKey + "_" + key, marker, data.dateLabels, data.dates);
    }
  }
}

function switchView(view, categoryKey, btn) {
  document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  destroyAllCharts();
  const data = getActiveData();
  const cat = data.categories[categoryKey];
  const container = document.getElementById("view-content");
  if (view === "table") {
    container.innerHTML = renderTableView(cat, data.dateLabels);
  } else {
    if (cat.singleDate) {
      container.innerHTML = renderFattyAcidsView(cat);
      renderFattyAcidsCharts(cat);
    } else {
      let html = `<div class="charts-grid">`;
      for (const [key, marker] of Object.entries(cat.markers)) {
        html += renderChartCard(categoryKey + "_" + key, marker, data.dateLabels);
      }
      html += `</div>`;
      container.innerHTML = html;
      for (const [key, marker] of Object.entries(cat.markers)) {
        createLineChart(categoryKey + "_" + key, marker, data.dateLabels, data.dates);
      }
    }
  }
}

function renderChartCard(id, marker, dateLabels) {
  markerRegistry[id] = marker;
  const latestIdx = getLatestValueIndex(marker.values);
  const latestVal = latestIdx !== -1 ? marker.values[latestIdx] : null;
  const status = latestVal !== null ? getStatus(latestVal, marker.refMin, marker.refMax) : "missing";
  const statusLabel = status === "normal" ? "Normal" : status === "high" ? "High" : status === "low" ? "Low" : "N/A";

  let html = `<div class="chart-card" onclick="showDetailModal('${id}')">
    <div class="chart-card-header"><div>
      <div class="chart-card-title">${marker.name}</div>
      <div class="chart-card-unit">${marker.unit}</div></div>
      <span class="chart-card-status status-${status}">${statusLabel}</span></div>
    <div class="chart-container"><canvas id="chart-${id}"></canvas></div>
    <div class="chart-values">`;
  const labels = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : dateLabels;
  for (let i = 0; i < marker.values.length; i++) {
    const v = marker.values[i];
    const s = v !== null ? getStatus(v, marker.refMin, marker.refMax) : "missing";
    html += `<div class="chart-value-item"><div class="chart-value-date">${labels[i] || ''}</div>
      <div class="chart-value-num val-${s}">${v !== null ? formatValue(v) : "\u2014"}</div></div>`;
  }
  html += `</div>${marker.refMin != null && marker.refMax != null ? `<div class="chart-ref-range">Reference: ${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)} ${marker.unit}</div>` : ''}</div>`;
  return html;
}

function renderTableView(cat, dateLabels) {
  const labels = cat.singleDate ? [cat.singleDateLabel || "N/A"] : dateLabels;
  let html = `<div class="data-table-wrapper"><table class="data-table"><thead><tr>
    <th>Biomarker</th><th>Unit</th><th>Reference</th>`;
  for (const d of labels) html += `<th>${d}</th>`;
  html += `<th>Trend</th><th>Range</th></tr></thead><tbody>`;
  for (const [key, marker] of Object.entries(cat.markers)) {
    html += `<tr><td class="marker-name">${marker.name}</td>
      <td class="unit-col">${marker.unit}</td>
      <td class="ref-col">${marker.refMin != null && marker.refMax != null ? `${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}` : '\u2014'}</td>`;
    for (let i = 0; i < marker.values.length; i++) {
      const v = marker.values[i];
      const s = v !== null ? getStatus(v, marker.refMin, marker.refMax) : "missing";
      html += `<td class="value-cell val-${s}">${v !== null ? formatValue(v) : "\u2014"}</td>`;
    }
    const trend = getTrend(marker.values);
    html += `<td><span class="trend-arrow ${trend.cls}">${trend.arrow}</span></td>`;
    const li = getLatestValueIndex(marker.values);
    if (li !== -1 && marker.refMin != null && marker.refMax != null) {
      const pos = Math.max(0, Math.min(100, getRangePosition(marker.values[li], marker.refMin, marker.refMax)));
      const s = getStatus(marker.values[li], marker.refMin, marker.refMax);
      html += `<td><div class="range-bar"><div class="range-bar-fill" style="left:0;width:100%"></div>
        <div class="range-bar-marker marker-${s}" style="left:${pos}%"></div></div></td>`;
    } else html += `<td>\u2014</td>`;
    html += `</tr>`;
  }
  html += `</tbody></table></div>`;
  return html;
}

function renderFattyAcidsView(cat) {
  let html = `<div style="background:var(--bg-card);border-radius:var(--radius);padding:20px;margin-bottom:20px;border:1px solid var(--border)">
    <h3 style="margin-bottom:16px;font-size:16px">Fatty Acid Profile${cat.singleDate ? ' \u2014 ' + new Date(cat.singleDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</h3>
    <div style="height:400px"><canvas id="chart-fa-bar"></canvas></div></div>`;
  html += `<div class="fatty-acids-grid">`;
  for (const [key, marker] of Object.entries(cat.markers)) {
    const v = marker.values[0], s = getStatus(v, marker.refMin, marker.refMax);
    const pos = Math.max(0, Math.min(100, getRangePosition(v, marker.refMin, marker.refMax)));
    html += `<div class="fa-card"><div class="fa-card-name">${marker.name}</div>
      <div class="fa-card-value val-${s}">${formatValue(v)}${marker.unit ? " " + marker.unit : ""}</div>
      <div class="fa-card-ref">Ref: ${marker.refMin} \u2013 ${marker.refMax}</div>
      <div class="range-bar" style="margin-top:8px;width:100%"><div class="range-bar-fill" style="left:0;width:100%"></div>
      <div class="range-bar-marker marker-${s}" style="left:${pos}%"></div></div></div>`;
  }
  html += `</div>`;
  return html;
}

function renderFattyAcidsCharts(cat) {
  const names=[], vals=[], mins=[], maxs=[], bgC=[], brC=[];
  for (const m of Object.values(cat.markers)) {
    names.push(m.name.replace(/\(.+\)/,"").trim());
    vals.push(m.values[0]); mins.push(m.refMin); maxs.push(m.refMax);
    const s = getStatus(m.values[0], m.refMin, m.refMax);
    bgC.push(s==="normal"?"rgba(52,211,153,0.6)":s==="high"?"rgba(248,113,113,0.6)":"rgba(251,191,36,0.6)");
    brC.push(s==="normal"?"rgba(52,211,153,1)":s==="high"?"rgba(248,113,113,1)":"rgba(251,191,36,1)");
  }
  const ctx = document.getElementById("chart-fa-bar");
  if (!ctx) return;
  chartInstances["fa-bar"] = new Chart(ctx, {
    type: "bar",
    data: { labels: names, datasets: [
      { label:"Value", data:vals, backgroundColor:bgC, borderColor:brC, borderWidth:1, borderRadius:4 },
      { label:"Ref Min", data:mins, type:"line", borderColor:"rgba(79,140,255,0.5)", borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 },
      { label:"Ref Max", data:maxs, type:"line", borderColor:"rgba(79,140,255,0.5)", borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 }
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{display:false}, tooltip:{ backgroundColor:"#222635", titleColor:"#e8eaf0", bodyColor:"#8b90a0", borderColor:"#2e3348", borderWidth:1 }},
      scales: { x:{ticks:{color:"#5a5f73",font:{size:10},maxRotation:45},grid:{display:false}}, y:{ticks:{color:"#5a5f73"},grid:{color:"rgba(46,51,72,0.5)"}} }
    }
  });
}

// Chart.js plugin for reference range band
const refBandPlugin = {
  id: "refBand",
  beforeDraw(chart) {
    const opts = chart.options.plugins.refBand;
    if (!opts || !chart.chartArea || opts.refMin == null || opts.refMax == null) return;
    const { ctx, chartArea: { left, right }, scales: { y } } = chart;
    if (!y) return;
    const yMin = y.getPixelForValue(opts.refMin);
    const yMax = y.getPixelForValue(opts.refMax);
    ctx.save();
    ctx.fillStyle = "rgba(79,140,255,0.06)";
    ctx.fillRect(left, Math.min(yMin,yMax), right-left, Math.abs(yMax-yMin));
    ctx.strokeStyle = "rgba(79,140,255,0.2)";
    ctx.setLineDash([4,4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left,yMin); ctx.lineTo(right,yMin); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(left,yMax); ctx.lineTo(right,yMax); ctx.stroke();
    ctx.restore();
  }
};

// Chart.js plugin for note annotation dots with hover tooltip
const noteAnnotationPlugin = {
  id: "noteAnnotations",
  _getNoteDots(chart) {
    const opts = chart.options.plugins.noteAnnotations;
    if (!opts || !opts.notes || !opts.notes.length || !chart.chartArea) return [];
    const { chartArea: { top }, scales: { x } } = chart;
    if (!x) return [];
    const chartLabels = chart.data.labels || [];
    const dots = [];
    const DOT_RADIUS = 5;
    const DOT_Y = top + DOT_RADIUS + 2;
    for (const note of opts.notes) {
      let pixelX = null;
      const noteDateLabel = new Date(note.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const idx = chartLabels.indexOf(noteDateLabel);
      if (idx !== -1) {
        pixelX = x.getPixelForValue(idx);
      } else {
        const chartDates = opts.chartDates || [];
        if (chartDates.length >= 2 && note.date >= chartDates[0] && note.date <= chartDates[chartDates.length - 1]) {
          for (let i = 0; i < chartDates.length - 1; i++) {
            if (note.date >= chartDates[i] && note.date <= chartDates[i + 1]) {
              const d0 = new Date(chartDates[i]).getTime();
              const d1 = new Date(chartDates[i + 1]).getTime();
              const dn = new Date(note.date).getTime();
              const frac = (dn - d0) / (d1 - d0);
              const px0 = x.getPixelForValue(i);
              const px1 = x.getPixelForValue(i + 1);
              pixelX = px0 + frac * (px1 - px0);
              break;
            }
          }
        }
      }
      if (pixelX === null) continue;
      dots.push({ x: pixelX, y: DOT_Y, radius: DOT_RADIUS, note });
    }
    return dots;
  },
  afterDatasetsDraw(chart) {
    const dots = this._getNoteDots(chart);
    if (!dots.length) return;
    const { ctx } = chart;
    ctx.save();
    for (const dot of dots) {
      ctx.fillStyle = dot === chart._hoveredNoteDot
        ? "rgba(251, 191, 36, 1)"
        : "rgba(251, 191, 36, 0.7)";
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    // Draw tooltip for hovered dot
    if (chart._hoveredNoteDot) {
      const dot = chart._hoveredNoteDot;
      const dateStr = new Date(dot.note.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const text = dot.note.text.length > 60 ? dot.note.text.slice(0, 60) + '...' : dot.note.text;
      ctx.font = "12px Inter, sans-serif";
      const dateWidth = ctx.measureText(dateStr).width;
      const textWidth = ctx.measureText(text).width;
      const boxWidth = Math.max(dateWidth, textWidth) + 16;
      const boxHeight = 42;
      const boxPad = 8;
      // Position tooltip below the dot
      let tooltipX = dot.x - boxWidth / 2;
      let tooltipY = dot.y + dot.radius + 6;
      // Clamp to chart area
      const { left, right } = chart.chartArea;
      if (tooltipX < left) tooltipX = left;
      if (tooltipX + boxWidth > right) tooltipX = right - boxWidth;
      // Background
      ctx.fillStyle = "rgba(30, 34, 46, 0.95)";
      ctx.strokeStyle = "rgba(251, 191, 36, 0.6)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, boxWidth, boxHeight, 6);
      ctx.fill();
      ctx.stroke();
      // Date label (bold)
      ctx.fillStyle = "rgba(251, 191, 36, 1)";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(dateStr, tooltipX + boxPad, tooltipY + 15);
      // Note text
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "11px Inter, sans-serif";
      ctx.fillText(text, tooltipX + boxPad, tooltipY + 31);
    }
    ctx.restore();
  },
  afterEvent(chart, args) {
    const { event } = args;
    if (event.type !== 'mousemove') return;
    const dots = this._getNoteDots(chart);
    let hovered = null;
    for (const dot of dots) {
      const dx = event.x - dot.x;
      const dy = event.y - dot.y;
      if (dx * dx + dy * dy <= (dot.radius + 3) * (dot.radius + 3)) {
        hovered = dot;
        break;
      }
    }
    const prev = chart._hoveredNoteDot;
    chart._hoveredNoteDot = hovered;
    if (prev !== hovered) {
      chart.canvas.style.cursor = hovered ? 'pointer' : '';
      args.changed = true;
    }
  }
};

function getNotesForChart(chartDates) {
  const notes = (importedData.notes || []);
  if (!notes.length || !chartDates.length) return [];
  const minDate = chartDates[0];
  const maxDate = chartDates[chartDates.length - 1];
  return notes.filter(n => n.date >= minDate && n.date <= maxDate);
}

function getSupplementsForChart(chartDates) {
  const supps = (importedData.supplements || []);
  if (!supps.length || !chartDates.length) return [];
  const minDate = chartDates[0];
  const maxDate = chartDates[chartDates.length - 1];
  const today = new Date().toISOString().slice(0, 10);
  return supps.filter(s => {
    const end = s.endDate || today;
    return s.startDate <= maxDate && end >= minDate;
  });
}

const supplementBarPlugin = {
  id: 'supplementBars',
  _dateToPixelX(dateStr, chart) {
    const x = chart.scales.x;
    const labels = chart.data.labels;
    const chartDates = chart.options.plugins.supplementBars?.chartDates || [];
    // Exact label match
    const idx = chartDates.indexOf(dateStr);
    if (idx !== -1) return x.getPixelForValue(idx);
    // Interpolate between dates
    for (let i = 0; i < chartDates.length - 1; i++) {
      if (dateStr > chartDates[i] && dateStr < chartDates[i + 1]) {
        const d0 = new Date(chartDates[i] + 'T00:00:00').getTime();
        const d1 = new Date(chartDates[i + 1] + 'T00:00:00').getTime();
        const dt = new Date(dateStr + 'T00:00:00').getTime();
        const frac = (dt - d0) / (d1 - d0);
        const px0 = x.getPixelForValue(i);
        const px1 = x.getPixelForValue(i + 1);
        return px0 + frac * (px1 - px0);
      }
    }
    // Before first date or after last date — clamp
    if (dateStr <= chartDates[0]) return x.getPixelForValue(0);
    return x.getPixelForValue(chartDates.length - 1);
  },
  _getBarRects(chart) {
    const cfg = chart.options.plugins.supplementBars;
    if (!cfg || !cfg.supplements || !cfg.supplements.length) return [];
    const { left, right, top } = chart.chartArea;
    const BAR_H = 12, GAP = 2, TOP_PAD = 4;
    const today = new Date().toISOString().slice(0, 10);
    const rects = [];
    cfg.supplements.forEach((s, i) => {
      const startX = this._dateToPixelX(s.startDate, chart);
      const endDate = s.endDate || today;
      const endX = this._dateToPixelX(endDate, chart);
      const clampedLeft = Math.max(startX, left);
      const clampedRight = Math.min(endX, right);
      if (clampedRight <= clampedLeft) return;
      const y = top + TOP_PAD + i * (BAR_H + GAP);
      rects.push({
        x: clampedLeft, y, w: clampedRight - clampedLeft, h: BAR_H,
        supplement: s, ongoing: !s.endDate
      });
    });
    return rects;
  },
  afterDatasetsDraw(chart) {
    const rects = this._getBarRects(chart);
    if (!rects.length) return;
    const { ctx } = chart;
    ctx.save();
    for (const r of rects) {
      const isMed = r.supplement.type === 'medication';
      ctx.fillStyle = isMed ? 'rgba(167, 139, 250, 0.7)' : 'rgba(56, 189, 248, 0.6)';
      if (r.ongoing) {
        // Gradient fade for ongoing
        const grad = ctx.createLinearGradient(r.x, 0, r.x + r.w, 0);
        grad.addColorStop(0, isMed ? 'rgba(167, 139, 250, 0.7)' : 'rgba(56, 189, 248, 0.6)');
        grad.addColorStop(0.7, isMed ? 'rgba(167, 139, 250, 0.7)' : 'rgba(56, 189, 248, 0.6)');
        grad.addColorStop(1, isMed ? 'rgba(167, 139, 250, 0)' : 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = grad;
      }
      ctx.beginPath();
      ctx.roundRect(r.x, r.y, r.w, r.h, 3);
      ctx.fill();
      // Label inside bar if wide enough
      const label = r.supplement.name;
      ctx.font = '10px Inter, sans-serif';
      const textW = ctx.measureText(label).width;
      if (r.w > textW + 8) {
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, r.x + 4, r.y + r.h / 2);
      }
    }
    // Draw tooltip for hovered bar
    if (chart._hoveredSuppBar) {
      const r = chart._hoveredSuppBar;
      const s = r.supplement;
      const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const line1 = `${s.name}${s.dosage ? ' — ' + s.dosage : ''}`;
      const line2 = `${fmtDate(s.startDate)} → ${s.endDate ? fmtDate(s.endDate) : 'ongoing'}`;
      ctx.font = '12px Inter, sans-serif';
      const w1 = ctx.measureText(line1).width;
      const w2 = ctx.measureText(line2).width;
      const boxW = Math.max(w1, w2) + 16;
      const boxH = 38;
      let tx = r.x + r.w / 2 - boxW / 2;
      let ty = r.y + r.h + 6;
      const { left, right } = chart.chartArea;
      if (tx < left) tx = left;
      if (tx + boxW > right) tx = right - boxW;
      const isMed = s.type === 'medication';
      ctx.fillStyle = 'rgba(30, 34, 46, 0.95)';
      ctx.strokeStyle = isMed ? 'rgba(167, 139, 250, 0.6)' : 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(tx, ty, boxW, boxH, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = isMed ? 'rgba(167, 139, 250, 1)' : 'rgba(56, 189, 248, 1)';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(line1, tx + 8, ty + 6);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText(line2, tx + 8, ty + 22);
    }
    ctx.restore();
  },
  afterEvent(chart, args) {
    const { event } = args;
    if (event.type !== 'mousemove') return;
    const rects = this._getBarRects(chart);
    let hovered = null;
    for (const r of rects) {
      if (event.x >= r.x && event.x <= r.x + r.w && event.y >= r.y && event.y <= r.y + r.h) {
        hovered = r;
        break;
      }
    }
    const prev = chart._hoveredSuppBar;
    chart._hoveredSuppBar = hovered;
    if (prev !== hovered) {
      if (!chart._hoveredNoteDot) {
        chart.canvas.style.cursor = hovered ? 'pointer' : '';
      }
      args.changed = true;
    }
  }
};

function createLineChart(id, marker, dateLabels, chartDates) {
  const canvas = document.getElementById("chart-" + id);
  if (!canvas) return;
  const dates = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : dateLabels;
  const values = marker.values;
  const valid = values.filter(v => v !== null);
  if (valid.length === 0) return;

  // PhenoAge: add chronological age line for comparison
  const isPhenoAge = marker.name && marker.name.startsWith('PhenoAge');
  let chronoAgeValues = null;
  if (isPhenoAge && profileDob && chartDates && chartDates.length) {
    const dobDate = new Date(profileDob + 'T00:00:00');
    chronoAgeValues = chartDates.map(d => {
      const draw = new Date(d + 'T00:00:00');
      const age = (draw - dobDate) / (365.25 * 24 * 60 * 60 * 1000);
      return age > 0 ? Math.round(age * 10) / 10 : null;
    });
  }
  const allValid = chronoAgeValues ? [...valid, ...chronoAgeValues.filter(v => v !== null)] : valid;
  const refMinSafe = marker.refMin != null ? marker.refMin : Infinity;
  const refMaxSafe = marker.refMax != null ? marker.refMax : -Infinity;
  const minV = Math.min(...allValid, refMinSafe);
  const maxV = Math.max(...allValid, refMaxSafe);
  const pad = (maxV - minV) * 0.15 || 1;
  const ptColors = values.map(v => {
    if (v === null) return "transparent";
    const s = getStatus(v, marker.refMin, marker.refMax);
    return s==="normal"?"#34d399":s==="high"?"#f87171":"#fbbf24";
  });
  const rawDates = chartDates || [];
  const chartNotes = marker.singlePoint ? [] : getNotesForChart(rawDates);
  const chartSupps = marker.singlePoint ? [] : getSupplementsForChart(rawDates);
  const datasets = [{
    data: values, borderColor: "#4f8cff", backgroundColor: "rgba(79,140,255,0.1)",
    borderWidth: 2.5, pointBackgroundColor: ptColors, pointBorderColor: ptColors,
    pointRadius: 6, pointHoverRadius: 8, tension: 0.3, fill: false, spanGaps: true,
    label: isPhenoAge ? 'Biological Age' : ''
  }];
  if (chronoAgeValues) {
    datasets.push({
      data: chronoAgeValues, borderColor: "#5a5f73", backgroundColor: "transparent",
      borderWidth: 2, borderDash: [6, 4], pointRadius: 0, pointHoverRadius: 4,
      tension: 0.3, fill: false, spanGaps: true, label: 'Chronological Age'
    });
  }
  chartInstances[id] = new Chart(canvas, {
    type: "line",
    data: { labels: dates, datasets },
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ display: isPhenoAge && chronoAgeValues ? true : false, labels: { color: '#8b90a0', font: { size: 11 }, boxWidth: 20, padding: 10 } },
        tooltip:{ backgroundColor:"#222635", titleColor:"#e8eaf0", bodyColor:"#8b90a0", borderColor:"#2e3348", borderWidth:1,
          callbacks:{ label:(c)=>`${c.dataset.label ? c.dataset.label + ': ' : ''}${formatValue(c.parsed.y)} ${marker.unit}`, afterLabel:(c)=> c.datasetIndex === 0 && marker.refMin != null && marker.refMax != null ? `Ref: ${marker.refMin} \u2013 ${marker.refMax}` : '' }},
        refBand:{ refMin:marker.refMin, refMax:marker.refMax },
        noteAnnotations: chartNotes.length ? { notes: chartNotes, chartDates: rawDates } : false,
        supplementBars: chartSupps.length ? { supplements: chartSupps, chartDates: rawDates } : false},
      layout: { padding: { top: chartSupps.length ? chartSupps.length * 14 + 6 : 0 } },
      scales: { x:{ticks:{color:"#5a5f73",font:{size:11}},grid:{display:false}},
        y:{min:minV-pad, max:maxV+pad, ticks:{color:"#5a5f73",font:{size:10}}, grid:{color:"rgba(46,51,72,0.5)"}}}
    },
    plugins: [refBandPlugin, noteAnnotationPlugin, supplementBarPlugin]
  });
}

async function fetchMarkerDescription(markerId, markerName, unit) {
  const cacheKey = 'labcharts-marker-desc';
  const cache = JSON.parse(localStorage.getItem(cacheKey) || '{}');
  if (cache[markerId]) return cache[markerId];
  if (!hasApiKey()) return null;
  try {
    const resp = await callClaudeAPI({
      system: 'You are a concise medical reference. Reply with exactly one sentence (max 30 words) explaining what this blood biomarker measures and why it matters clinically. No preamble.',
      messages: [{ role: 'user', content: `${markerName} (${unit})` }],
      maxTokens: 100
    });
    const text = typeof resp === 'string' ? resp.trim() : (resp.content?.[0]?.text?.trim() || '');
    if (text) {
      cache[markerId] = text;
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    }
    return text || null;
  } catch { return null; }
}

function showDetailModal(id) {
  const marker = markerRegistry[id];
  if (!marker) return;
  const data = getActiveData();
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const dates = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : data.dateLabels;
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>${marker.name}</h3>
    <div class="modal-unit">${marker.unit}${marker.refMin != null && marker.refMax != null ? ` &middot; Reference: ${marker.refMin} \u2013 ${marker.refMax}` : ''}</div>
    <div class="marker-description" id="marker-desc"></div>
    <div class="modal-chart"><canvas id="modal-chart"></canvas></div>
    <div class="modal-values-grid">`;
  for (let i = 0; i < marker.values.length; i++) {
    const v = marker.values[i];
    const s = v !== null ? getStatus(v, marker.refMin, marker.refMax) : "missing";
    const sl = s==="normal"?"In Range":s==="high"?"Above Range":s==="low"?"Below Range":"N/A";
    const rawDate = marker.singlePoint ? null : data.dates[i];
    const matchingNote = rawDate && importedData.notes ? importedData.notes.find(n => n.date === rawDate) : null;
    const noteIcon = matchingNote ? `<div class="mv-note" onclick="event.stopPropagation();this.parentElement.parentElement.querySelector('.mv-note-text').classList.toggle('show')">&#128221;</div><div class="mv-note-text">${escapeHTML(matchingNote.text)}</div>` : '';
    html += `<div class="modal-value-card"><div class="mv-date">${dates[i]}${noteIcon}</div>
      <div class="mv-value val-${s}">${v !== null ? formatValue(v) : "\u2014"}</div>
      <div class="mv-status val-${s}">${sl}</div></div>`;
  }
  html += `</div>`;
  const nonNull = marker.values.map((v,i)=>({v,i})).filter(x=>x.v!==null);
  if (nonNull.length >= 2) {
    const f = nonNull[0], l = nonNull[nonNull.length-1];
    const ch = l.v - f.v, pct = ((ch/f.v)*100).toFixed(1);
    const dir = ch > 0 ? "increased" : ch < 0 ? "decreased" : "unchanged";
    html += `<div class="modal-ref-info"><strong>Trend:</strong> ${dir} by ${Math.abs(ch).toFixed(2)} ${marker.unit} (${ch>0?"+":""}${pct}%) from ${dates[f.i]} to ${dates[l.i]}</div>`;
  }
  html += `<button class="ask-ai-btn" onclick="event.stopPropagation();askAIAboutMarker('${id}')">Ask AI about this marker</button>`;
  modal.innerHTML = html;
  overlay.classList.add("show");
  setTimeout(() => {
    if (document.getElementById("modal-chart")) createLineChart("modal", marker, data.dateLabels, data.dates);
  }, 50);
  // Fetch and display AI marker description
  const descEl = document.getElementById('marker-desc');
  if (descEl) {
    const cached = JSON.parse(localStorage.getItem('labcharts-marker-desc') || '{}')[id];
    if (cached) {
      descEl.textContent = cached;
      descEl.classList.add('loaded');
    } else if (hasApiKey()) {
      descEl.classList.add('loading');
      fetchMarkerDescription(id, marker.name, marker.unit).then(text => {
        const el = document.getElementById('marker-desc');
        if (text && el) {
          el.textContent = text;
          el.classList.remove('loading');
          el.classList.add('loaded');
        } else if (el) {
          el.remove();
        }
      });
    }
  }
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
  if (chartInstances["modal"]) { chartInstances["modal"].destroy(); delete chartInstances["modal"]; }
}
document.addEventListener("click", e => {
  if (e.target.id === "modal-overlay") closeModal();
  if (e.target.id === "import-modal-overlay") closeImportModal();
  if (e.target.id === "settings-modal-overlay") closeSettingsModal();
  const dd = document.getElementById("corr-options");
  const si = document.getElementById("corr-search");
  if (dd && si && !dd.contains(e.target) && e.target !== si) dd.classList.remove("show");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const chatPanel = document.getElementById("chat-panel");
    if (chatPanel && chatPanel.classList.contains("open")) { closeChatPanel(); return; }
    closeSettingsModal();
    closeModal();
  }
});

function destroyAllCharts() {
  for (const c of Object.values(chartInstances)) c.destroy();
  chartInstances = {};
}
function countFlagged(markers) {
  let c = 0;
  for (const m of markers) { const i = getLatestValueIndex(m.values); if (i!==-1 && getStatus(m.values[i],m.refMin,m.refMax)!=="normal") c++; }
  return c;
}
function countMissing(markers) {
  let c = 0;
  for (const m of markers) { if (m.values.every(v=>v===null)) c++; }
  return c;
}
function getLatestValueIndex(values) {
  for (let i=values.length-1;i>=0;i--) if (values[i]!==null) return i;
  return -1;
}
function getAllFlaggedMarkers(data) {
  if (!data) data = getActiveData();
  const flags = [];
  for (const [ck, cat] of Object.entries(data.categories)) {
    for (const [k, m] of Object.entries(cat.markers)) {
      const i = getLatestValueIndex(m.values);
      if (i!==-1) { const v=m.values[i], s=getStatus(v,m.refMin,m.refMax);
        if (s==="high"||s==="low") flags.push({categoryKey:ck,name:m.name,value:formatValue(v),unit:m.unit,refMin:m.refMin,refMax:m.refMax,status:s});
      }
    }
  }
  return flags;
}
function getTrend(values) {
  const nn = values.filter(v=>v!==null);
  if (nn.length<2) return {arrow:"\u2014",cls:"trend-stable"};
  const pct = ((nn[nn.length-1]-nn[nn.length-2])/nn[nn.length-2])*100;
  if (Math.abs(pct)<2) return {arrow:"\u2192",cls:"trend-stable"};
  if (pct>0) return {arrow:`\u2191 +${pct.toFixed(1)}%`,cls:"trend-up"};
  return {arrow:`\u2193 ${pct.toFixed(1)}%`,cls:"trend-down"};
}
function formatValue(v) {
  if (v===null||v===undefined) return "\u2014";
  if (Number.isInteger(v)) return v.toString();
  if (Math.abs(v)>=100) return v.toFixed(0);
  if (Math.abs(v)>=10) return v.toFixed(1);
  if (Math.abs(v)>=1) return v.toFixed(2);
  return v.toFixed(3);
}

// ═══════════════════════════════════════════════
// UNIT TOGGLE
// ═══════════════════════════════════════════════
function switchUnitSystem(system) {
  unitSystem = system;
  localStorage.setItem(profileStorageKey(currentProfile, 'units'), system);
  document.querySelectorAll('.unit-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === system);
  });
  buildSidebar();
  updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  const currentCategory = activeNav ? activeNav.dataset.category : "dashboard";
  navigate(currentCategory);
}

function updateHeaderDates() {
  const data = getActiveData();
  const el = document.getElementById("header-dates");
  if (el) {
    if (data.dateLabels.length > 0) {
      el.innerHTML = `<span class="label">Dates:</span> ${data.dateLabels.join(' \u00b7 ')}`;
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }
}

// ═══════════════════════════════════════════════
// CORRELATIONS
// ═══════════════════════════════════════════════
function showCorrelations() {
  const data = getActiveData();
  const main = document.getElementById("main-content");
  let html = `<div class="category-header"><h2>\uD83D\uDCC8 Correlations</h2>
    <p>Compare biomarkers across categories on a normalized scale</p></div>`;
  html += `<div class="correlation-controls">
    <h3>Select Biomarkers (2\u20138)</h3>
    <div class="corr-select-row">
      <div class="corr-dropdown">
        <input type="text" class="corr-search" id="corr-search" placeholder="Search biomarkers..."
          oninput="filterCorrelationOptions()" onfocus="showCorrelationDropdown()">
        <div class="corr-options" id="corr-options"></div>
      </div>
    </div>
    <div class="corr-chips" id="corr-chips"></div>
    <div class="corr-presets">
      <div class="corr-presets-label">Quick Presets:</div>`;
  for (let i = 0; i < CORRELATION_PRESETS.length; i++) {
    html += `<button class="corr-preset-btn" onclick="applyCorrelationPreset(${i})">${CORRELATION_PRESETS[i].label}</button>`;
  }
  html += `</div></div>`;
  html += `<div class="corr-chart-container" id="corr-chart-container" style="display:none">
    <h3>Normalized Comparison (% of Reference Range)</h3>
    <div class="corr-chart"><canvas id="chart-correlation"></canvas></div></div>`;
  main.innerHTML = html;
  populateCorrelationOptions(data);
  renderCorrelationChips();
  if (selectedCorrelationMarkers.length >= 2) renderCorrelationChart();
}

function populateCorrelationOptions(data) {
  if (!data) data = getActiveData();
  const container = document.getElementById("corr-options");
  if (!container) return;
  let html = '';
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [markerKey, marker] of Object.entries(cat.markers)) {
      if (marker.singlePoint) continue;
      const fullKey = `${catKey}.${markerKey}`;
      const selected = selectedCorrelationMarkers.includes(fullKey);
      html += `<div class="corr-option ${selected ? 'selected' : ''}"
        data-key="${fullKey}" data-name="${marker.name}" data-cat="${cat.label}"
        onclick="toggleCorrelationMarker('${fullKey}')">
        ${marker.name} <span class="opt-cat">${cat.label}</span></div>`;
    }
  }
  container.innerHTML = html;
}

function showCorrelationDropdown() {
  document.getElementById("corr-options").classList.add("show");
}

function filterCorrelationOptions() {
  const search = document.getElementById("corr-search").value.toLowerCase();
  document.querySelectorAll(".corr-option").forEach(opt => {
    const name = opt.dataset.name.toLowerCase();
    const cat = opt.dataset.cat.toLowerCase();
    opt.style.display = (name.includes(search) || cat.includes(search)) ? '' : 'none';
  });
  document.getElementById("corr-options").classList.add("show");
}

function toggleCorrelationMarker(key) {
  const idx = selectedCorrelationMarkers.indexOf(key);
  if (idx !== -1) selectedCorrelationMarkers.splice(idx, 1);
  else if (selectedCorrelationMarkers.length < 8) selectedCorrelationMarkers.push(key);
  renderCorrelationChips();
  populateCorrelationOptions();
  if (selectedCorrelationMarkers.length >= 2) renderCorrelationChart();
  else {
    document.getElementById("corr-chart-container").style.display = "none";
    if (chartInstances["correlation"]) { chartInstances["correlation"].destroy(); delete chartInstances["correlation"]; }
  }
}

function applyCorrelationPreset(idx) {
  selectedCorrelationMarkers = [...CORRELATION_PRESETS[idx].markers];
  renderCorrelationChips();
  populateCorrelationOptions();
  if (selectedCorrelationMarkers.length >= 2) renderCorrelationChart();
}

function renderCorrelationChips() {
  const container = document.getElementById("corr-chips");
  if (!container) return;
  const data = getActiveData();
  let html = '';
  selectedCorrelationMarkers.forEach((key, i) => {
    const [catKey, markerKey] = key.split('.');
    const marker = data.categories[catKey]?.markers[markerKey];
    if (!marker) return;
    const color = CHIP_COLORS[i % CHIP_COLORS.length];
    html += `<span class="corr-chip" style="background:${color}20;border-color:${color};color:${color}">
      ${marker.name} <span class="chip-remove" onclick="toggleCorrelationMarker('${key}')">&times;</span></span>`;
  });
  container.innerHTML = html;
}

function renderCorrelationChart() {
  const data = getActiveData();
  const container = document.getElementById("corr-chart-container");
  container.style.display = "block";
  if (chartInstances["correlation"]) { chartInstances["correlation"].destroy(); delete chartInstances["correlation"]; }
  const canvas = document.getElementById("chart-correlation");
  if (!canvas) return;
  const datasets = [];
  selectedCorrelationMarkers.forEach((key, i) => {
    const [catKey, markerKey] = key.split('.');
    const marker = data.categories[catKey]?.markers[markerKey];
    if (!marker) return;
    const normalizedValues = marker.values.map(v => {
      if (v === null) return null;
      const range = marker.refMax - marker.refMin;
      return range !== 0 ? ((v - marker.refMin) / range) * 100 : 50;
    });
    const color = CHIP_COLORS[i % CHIP_COLORS.length];
    datasets.push({
      label: marker.name, data: normalizedValues,
      borderColor: color, backgroundColor: color + '20',
      borderWidth: 2.5, pointRadius: 5, pointHoverRadius: 7,
      pointBackgroundColor: color, tension: 0.3, fill: false, spanGaps: true,
      _realValues: marker.values, _unit: marker.unit, _refMin: marker.refMin, _refMax: marker.refMax
    });
  });
  const allVals = datasets.flatMap(ds => ds.data.filter(v => v !== null));
  const minY = Math.min(0, ...allVals) - 10;
  const maxY = Math.max(100, ...allVals) + 10;
  chartInstances["correlation"] = new Chart(canvas, {
    type: "line",
    data: { labels: data.dateLabels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: "#8b90a0", font: { size: 12 }, usePointStyle: true, pointStyle: "circle" } },
        tooltip: {
          backgroundColor: "#222635", titleColor: "#e8eaf0", bodyColor: "#8b90a0",
          borderColor: "#2e3348", borderWidth: 1,
          callbacks: {
            label: (ctx) => {
              const ds = ctx.dataset;
              const realVal = ds._realValues[ctx.dataIndex];
              const pct = ctx.parsed.y;
              return `${ds.label}: ${formatValue(realVal)} ${ds._unit} (${pct !== null ? pct.toFixed(0) + '%' : 'N/A'})`;
            }
          }
        },
        refBand: { refMin: 0, refMax: 100 },
        noteAnnotations: (function() { const n = getNotesForChart(data.dates); return n.length ? { notes: n, chartDates: data.dates } : false; })(),
        supplementBars: (function() { const s = getSupplementsForChart(data.dates); return s.length ? { supplements: s, chartDates: data.dates } : false; })()
      },
      layout: { padding: { top: (function() { const s = getSupplementsForChart(data.dates); return s.length ? s.length * 14 + 6 : 0; })() } },
      scales: {
        x: { ticks: { color: "#5a5f73", font: { size: 11 } }, grid: { display: false } },
        y: { min: minY, max: maxY, ticks: { color: "#5a5f73", font: { size: 10 }, callback: v => v + '%' }, grid: { color: "rgba(46,51,72,0.5)" } }
      }
    },
    plugins: [refBandPlugin, noteAnnotationPlugin, supplementBarPlugin]
  });
}

// ═══════════════════════════════════════════════
// AI-POWERED PDF IMPORT
// ═══════════════════════════════════════════════
function buildMarkerReference() {
  const ref = {};
  for (const [catKey, cat] of Object.entries(MARKER_SCHEMA)) {
    if (cat.calculated) continue;
    for (const [markerKey, marker] of Object.entries(cat.markers)) {
      ref[`${catKey}.${markerKey}`] = { name: marker.name, unit: marker.unit, refMin: marker.refMin, refMax: marker.refMax };
    }
  }
  // Include custom markers from previous imports
  const custom = (importedData && importedData.customMarkers) ? importedData.customMarkers : {};
  for (const [fullKey, def] of Object.entries(custom)) {
    if (!ref[fullKey]) {
      ref[fullKey] = { name: def.name, unit: def.unit, refMin: def.refMin, refMax: def.refMax };
    }
  }
  return ref;
}

async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let allItems = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    for (const item of textContent.items) {
      if (item.str.trim()) {
        allItems.push({ text: item.str.trim(), x: Math.round(item.transform[4]), y: Math.round(item.transform[5]), page: i });
      }
    }
  }
  // Page-aware row grouping (same logic as old parser — robust geometric approach)
  const sorted = [...allItems].sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    const dy = b.y - a.y;
    return Math.abs(dy) > 3 ? dy : a.x - b.x;
  });
  if (sorted.length === 0) return '';
  let text = '';
  let currentPage = sorted[0].page;
  text += `=== Page ${currentPage} ===\n`;
  let currentRow = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].page !== currentPage) {
      text += currentRow.sort((a, b) => a.x - b.x).map(r => r.text).join('  ') + '\n';
      currentPage = sorted[i].page;
      text += `\n=== Page ${currentPage} ===\n`;
      currentRow = [sorted[i]];
    } else if (Math.abs(sorted[i].y - currentRow[0].y) < 3) {
      currentRow.push(sorted[i]);
    } else {
      text += currentRow.sort((a, b) => a.x - b.x).map(r => r.text).join('  ') + '\n';
      currentRow = [sorted[i]];
    }
  }
  if (currentRow.length > 0) {
    text += currentRow.sort((a, b) => a.x - b.x).map(r => r.text).join('  ') + '\n';
  }
  return text;
}

async function parseLabPDFWithAI(pdfText, fileName) {
  const markerRef = buildMarkerReference();
  const system = `You are a lab report data extraction assistant. You extract biomarker results from lab report text and map them to a known set of marker keys.

Here is the complete list of known markers with their keys, expected units, and reference ranges:
${JSON.stringify(markerRef, null, 1)}

Your task:
1. Find the sample collection date in the text. Return it as YYYY-MM-DD. Look for dates near keywords like "collection", "collected", "date", "odběr", "datum", or similar in any language.
2. For each biomarker result found in the text, extract:
   - rawName: the test name exactly as it appears in the PDF
   - value: the numeric result (parse comma as decimal point, strip < > prefixes)
   - mappedKey: the matching key from the known markers list (e.g. "biochemistry.glucose"), or null if no match
3. Match based on medical/biochemical equivalence, not just string similarity. For example:
   - "Glukóza" → "biochemistry.glucose" (Czech for glucose)
   - "Triacylglyceroly" → "lipids.triglycerides"
   - Use the units and reference ranges to help disambiguate
4. Only map to a marker if you're confident it's the correct match
5. Skip non-numeric results (text-only findings, interpretive notes)
6. For differential WBC: only map absolute count values (marked with # or abs.) to the # markers; percentage values go to the Pct markers
7. For markers that do NOT match any known key (mappedKey is null), also return:
   - suggestedKey: a "category.camelCaseKey" string. Use an existing category from the reference if the marker fits (e.g. "biochemistry", "hormones", "vitamins"), otherwise use "custom". The key part should be a concise camelCase identifier. NEVER use a suggestedKey that already exists in the known markers list above.
   - suggestedName: a clean English display name for the marker
   - unit: the unit as shown in the PDF
   - refMin: the lower reference range bound from the PDF (number or null)
   - refMax: the upper reference range bound from the PDF (number or null)

Return ONLY valid JSON in this exact format, no other text:
{
  "date": "YYYY-MM-DD",
  "markers": [
    {"rawName": "Test Name", "value": 5.23, "mappedKey": "category.marker"},
    {"rawName": "Unknown Test", "value": 1.0, "mappedKey": null, "suggestedKey": "biochemistry.someMarker", "suggestedName": "Some Marker", "unit": "mg/l", "refMin": 0.5, "refMax": 3.0}
  ]
}`;

  const response = await callClaudeAPI({
    system,
    messages: [{ role: 'user', content: `Extract all biomarker results from this lab report:\n\n${pdfText}` }],
    maxTokens: 4096
  });

  // Parse JSON from response (handle markdown code blocks)
  let jsonStr = response.trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
  const parsed = JSON.parse(jsonStr);

  return {
    date: parsed.date || null,
    markers: (parsed.markers || []).map(m => ({
      rawName: m.rawName,
      value: typeof m.value === 'number' ? m.value : parseFloat(String(m.value).replace(',', '.')),
      mappedKey: m.mappedKey || null,
      matched: !!m.mappedKey,
      suggestedKey: m.suggestedKey || null,
      suggestedName: m.suggestedName || null,
      unit: m.unit || null,
      refMin: m.refMin != null ? m.refMin : null,
      refMax: m.refMax != null ? m.refMax : null
    })),
    fileName
  };
}

// ═══════════════════════════════════════════════
// IMPORT PREVIEW & CONFIRM
// ═══════════════════════════════════════════════
function showImportPreview(parseResult) {
  const { date, markers, fileName } = parseResult;
  const modal = document.getElementById("import-modal");
  const overlay = document.getElementById("import-modal-overlay");
  const dateFormatted = date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown';
  const matched = markers.filter(m => m.matched);
  const newMarkers = markers.filter(m => !m.matched && m.suggestedKey);
  const unmatched = markers.filter(m => !m.matched && !m.suggestedKey);
  const importCount = matched.length + newMarkers.length;
  let html = `<button class="modal-close" onclick="closeImportModal()">&times;</button>
    <h3>Import Preview</h3>
    <p style="color:var(--text-secondary);margin-bottom:16px">
      File: ${fileName}<br>Collection Date: <strong>${dateFormatted}</strong><br>
      Matched: <span style="color:var(--green)">${matched.length}</span> \u00b7
      New: <span style="color:var(--accent)">${newMarkers.length}</span> \u00b7
      Unmatched: <span style="color:var(--yellow)">${unmatched.length}</span></p>`;
  if (!date) {
    html += `<div style="background:var(--red-bg);border:1px solid var(--red);border-radius:var(--radius-sm);padding:12px;margin-bottom:16px;color:var(--red)">
      Could not extract collection date from PDF. Import cannot proceed.</div>`;
    modal.innerHTML = html;
    overlay.classList.add("show");
    return;
  }
  html += `<table class="import-table"><thead><tr><th>Status</th><th>Test Name</th><th>Value</th><th>Maps To</th></tr></thead><tbody>`;
  for (const m of matched) {
    html += `<tr><td class="matched">\u2713 Matched</td><td>${m.rawName}</td>
      <td>${m.value}</td><td>${m.mappedKey}</td></tr>`;
  }
  for (const m of newMarkers) {
    const refInfo = (m.refMin != null || m.refMax != null) ? ` (${m.refMin ?? '?'}\u2013${m.refMax ?? '?'} ${m.unit || ''})` : '';
    html += `<tr><td class="new-marker">\u271A New</td><td>${m.rawName}</td>
      <td>${m.value}</td><td>${m.suggestedKey}${refInfo}</td></tr>`;
  }
  for (const m of unmatched) {
    html += `<tr><td class="unmatched">? Unmatched</td><td>${m.rawName}</td>
      <td>${m.value}</td><td>\u2014</td></tr>`;
  }
  html += `</tbody></table>`;
  html += `<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px">
    <button class="import-btn import-btn-secondary" onclick="closeImportModal()">Cancel</button>
    <button class="import-btn import-btn-primary" onclick="confirmImport()">Import ${importCount} Markers</button></div>`;
  window._pendingImport = parseResult;
  modal.innerHTML = html;
  overlay.classList.add("show");
}

function closeImportModal() {
  document.getElementById("import-modal-overlay").classList.remove("show");
  window._pendingImport = null;
}

function confirmImport() {
  const result = window._pendingImport;
  if (!result || !result.date) return;
  const matched = result.markers.filter(m => m.matched);
  const newMarkers = result.markers.filter(m => !m.matched && m.suggestedKey);
  const importCount = matched.length + newMarkers.length;
  if (importCount === 0) { showNotification("No markers to import", "error"); closeImportModal(); return; }
  if (!importedData.entries) importedData.entries = [];
  let entry = importedData.entries.find(e => e.date === result.date);
  if (!entry) {
    entry = { date: result.date, markers: {} };
    importedData.entries.push(entry);
  }
  for (const m of matched) entry.markers[m.mappedKey] = m.value;
  // Save new (custom) marker values and definitions
  if (!importedData.customMarkers) importedData.customMarkers = {};
  for (const m of newMarkers) {
    entry.markers[m.suggestedKey] = m.value;
    // Save definition only if not already defined
    if (!importedData.customMarkers[m.suggestedKey]) {
      const [catKey] = m.suggestedKey.split('.');
      // Determine category label: use schema label if category exists, else title-case the key
      const schemaCategory = MARKER_SCHEMA[catKey];
      const categoryLabel = schemaCategory ? schemaCategory.label : catKey.charAt(0).toUpperCase() + catKey.slice(1);
      importedData.customMarkers[m.suggestedKey] = {
        name: m.suggestedName || m.rawName,
        unit: m.unit || '',
        refMin: m.refMin,
        refMax: m.refMax,
        categoryLabel
      };
    }
  }
  if (entry.markers["hormones.insulin"] !== undefined) entry.markers["diabetes.insulin_d"] = entry.markers["hormones.insulin"];
  recalculateHOMAIR(entry);
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeImportModal();
  buildSidebar();
  updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Imported ${importCount} markers from ${result.date}`, "success");
}

function removeImportedEntry(date) {
  if (!importedData.entries) return;
  importedData.entries = importedData.entries.filter(e => e.date !== date);
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  buildSidebar();
  updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Removed imported data from ${date}`, "info");
}

// ═══════════════════════════════════════════════
// STANDALONE NOTES
// ═══════════════════════════════════════════════
function openNoteEditor(date, existingIdx) {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const isEditing = existingIdx !== undefined && existingIdx !== null;
  const existing = isEditing ? (importedData.notes || [])[existingIdx] : null;
  const defaultDate = existing ? existing.date : (date || new Date().toISOString().slice(0, 10));
  const currentText = existing ? existing.text : '';
  const title = isEditing ? 'Edit Note' : 'Add Note';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>${title}</h3>
    <div class="modal-unit">Add context: medication changes, supplements, symptoms, lifestyle changes</div>
    <div style="margin:16px 0">
      <label style="font-size:13px;color:var(--text-secondary);display:block;margin-bottom:4px">Date</label>
      <input type="date" id="note-date-input" value="${defaultDate}" style="padding:8px 12px;border-radius:6px;border:1px solid var(--border);background:var(--bg-primary);color:var(--text-primary);font-size:13px;font-family:inherit">
    </div>
    <textarea class="note-editor" id="note-textarea" placeholder="e.g. Started creatine supplement, switched to low-carb diet...">${escapeHTML(currentText)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveNote(${isEditing ? existingIdx : 'null'})">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${isEditing ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="deleteNote(${existingIdx})">Delete</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('note-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveNote(idx) {
  const dateInput = document.getElementById('note-date-input');
  const ta = document.getElementById('note-textarea');
  const date = dateInput ? dateInput.value : '';
  const text = ta ? ta.value.trim() : '';
  if (!date) { showNotification('Please select a date', 'error'); return; }
  if (!text) { showNotification('Please enter note text', 'error'); return; }
  if (!importedData.notes) importedData.notes = [];
  if (idx !== null && idx !== undefined) {
    importedData.notes[idx] = { date, text };
  } else {
    importedData.notes.push({ date, text });
  }
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Note saved', 'success');
}

function deleteNote(idx) {
  if (!importedData.notes) return;
  importedData.notes.splice(idx, 1);
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Note deleted', 'info');
}

// ═══════════════════════════════════════════════
// DIAGNOSES / MEDICAL CONDITIONS
// ═══════════════════════════════════════════════
function openDiagnosesEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.diagnoses || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Medical Conditions</h3>
    <div class="modal-unit">List any diagnosed conditions, chronic illnesses, or relevant medical history. The AI will consider these when interpreting your lab results.</div>
    <textarea class="note-editor" id="diagnoses-textarea" placeholder="e.g. Type 2 diabetes, hypothyroidism, iron deficiency anemia...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveDiagnoses()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearDiagnoses()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('diagnoses-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveDiagnoses() {
  const ta = document.getElementById('diagnoses-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.diagnoses = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Medical conditions saved' : 'Medical conditions cleared', 'success');
}

function clearDiagnoses() {
  importedData.diagnoses = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Medical conditions cleared', 'info');
}

// ═══════════════════════════════════════════════
// DIET
// ═══════════════════════════════════════════════
function openDietEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.diet || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Diet</h3>
    <div class="modal-unit">Describe your typical diet, eating patterns, or any specific dietary approach. The AI will factor this in when interpreting your lab results.</div>
    <textarea class="note-editor" id="diet-textarea" placeholder="e.g. Low-carb / keto, intermittent fasting 16:8, vegetarian, high protein...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveDiet()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearDiet()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('diet-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveDiet() {
  const ta = document.getElementById('diet-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.diet = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Diet saved' : 'Diet cleared', 'success');
}

function clearDiet() {
  importedData.diet = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Diet cleared', 'info');
}

function openCircadianEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.circadian || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Circadian Habits</h3>
    <div class="modal-unit">Describe your typical sleep schedule, light exposure, shift work, or other circadian-related habits. The AI will factor this in when interpreting your lab results.</div>
    <textarea class="note-editor" id="circadian-textarea" placeholder="e.g. Sleep 11 PM – 7 AM, morning sunlight 20 min, night shift 2x/week, blue-light glasses after sunset...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveCircadian()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearCircadian()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('circadian-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveCircadian() {
  const ta = document.getElementById('circadian-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.circadian = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Circadian habits saved' : 'Circadian habits cleared', 'success');
}

function clearCircadian() {
  importedData.circadian = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Circadian habits cleared', 'info');
}

function openExerciseEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.exercise || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Exercise & Movement</h3>
    <div class="modal-unit">Describe your typical exercise routine, training frequency, and daily movement level. The AI will factor this in when interpreting your lab results.</div>
    <textarea class="note-editor" id="exercise-textarea" placeholder="e.g. Strength training 4x/week, zone 2 cardio 3x/week, 10k steps daily, sedentary desk job...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveExercise()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearExercise()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('exercise-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveExercise() {
  const ta = document.getElementById('exercise-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.exercise = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Exercise habits saved' : 'Exercise habits cleared', 'success');
}

function clearExercise() {
  importedData.exercise = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Exercise habits cleared', 'info');
}

function openSleepEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.sleep || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Sleep</h3>
    <div class="modal-unit">Describe your typical sleep patterns, quality, and any sleep-related conditions. The AI will factor this in when interpreting your lab results.</div>
    <textarea class="note-editor" id="sleep-textarea" placeholder="e.g. 7-8 hours/night, frequent waking, sleep apnea, use CPAP, melatonin supplement...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveSleep()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearSleep()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('sleep-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveSleep() {
  const ta = document.getElementById('sleep-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.sleep = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Sleep habits saved' : 'Sleep habits cleared', 'success');
}

function clearSleep() {
  importedData.sleep = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Sleep habits cleared', 'info');
}

function openFieldExpertsEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.fieldExperts || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Field Experts</h3>
    <div class="modal-unit">List researchers or clinicians whose frameworks you follow. The AI will consider their published work and perspectives when interpreting your results.</div>
    <textarea class="note-editor" id="field-experts-textarea" placeholder="e.g. Peter Attia (longevity medicine), Thomas Dayspring (lipidology), Robert Lustig (metabolic health)...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveFieldExperts()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearFieldExperts()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('field-experts-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveFieldExperts() {
  const ta = document.getElementById('field-experts-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.fieldExperts = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Field experts saved' : 'Field experts cleared', 'success');
}

function clearFieldExperts() {
  importedData.fieldExperts = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Field experts cleared', 'info');
}

// ═══════════════════════════════════════════════
// SUPPLEMENTS & MEDICATIONS
// ═══════════════════════════════════════════════
function openSupplementsEditor(editIdx) {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const supps = importedData.supplements || [];
  const editing = typeof editIdx === 'number' && supps[editIdx];
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Supplements & Medications</h3>
    <div class="modal-unit">Track what you're taking and when. This helps the AI correlate interventions with biomarker changes.</div>`;
  if (supps.length > 0) {
    html += `<div class="supp-list">`;
    for (let i = 0; i < supps.length; i++) {
      const s = supps[i];
      const isMed = s.type === 'medication';
      const icon = isMed ? '\uD83D\uDC8A' : '\uD83D\uDCA7';
      const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const dateRange = `${fmtDate(s.startDate)} \u2192 ${s.endDate ? fmtDate(s.endDate) : 'ongoing'}`;
      html += `<div class="supp-list-item${editing && editIdx === i ? ' style="border-color:var(--accent)"' : ''}">
        <span class="supp-list-icon">${icon}</span>
        <div class="supp-list-info">
          <div class="supp-list-name">${escapeHTML(s.name)}${s.dosage ? ` <span class="supp-list-meta">${escapeHTML(s.dosage)}</span>` : ''}</div>
          <div class="supp-list-meta">${dateRange}</div>
        </div>
        <div class="supp-list-actions">
          <button onclick="openSupplementsEditor(${i})">Edit</button>
          <button class="delete" onclick="deleteSupplement(${i})">\u2715</button>
        </div>
      </div>`;
    }
    html += `</div>`;
  }
  html += `<div class="supp-form">
    <div class="supp-form-title">${editing ? 'Edit' : 'Add New'}</div>
    <div class="supp-form-row">
      <div class="supp-form-field"><label>Name</label>
        <input type="text" id="supp-name" placeholder="e.g. Creatine, Metformin" value="${editing ? escapeHTML(editing.name) : ''}">
      </div>
      <div class="supp-form-field"><label>Dosage</label>
        <input type="text" id="supp-dosage" placeholder="e.g. 5g/day, 500mg 2x/day" value="${editing ? escapeHTML(editing.dosage || '') : ''}">
      </div>
    </div>
    <div class="supp-form-row">
      <div class="supp-form-field"><label>Type</label>
        <select id="supp-type">
          <option value="supplement"${editing && editing.type === 'medication' ? '' : ' selected'}>Supplement</option>
          <option value="medication"${editing && editing.type === 'medication' ? ' selected' : ''}>Medication</option>
        </select>
      </div>
      <div class="supp-form-field"><label>Start Date</label>
        <input type="date" id="supp-start" value="${editing ? editing.startDate : new Date().toISOString().slice(0, 10)}">
      </div>
      <div class="supp-form-field"><label>End Date (blank = ongoing)</label>
        <input type="date" id="supp-end" value="${editing && editing.endDate ? editing.endDate : ''}">
      </div>
    </div>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveSupplement(${editing ? editIdx : -1})">${editing ? 'Update' : 'Add'}</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
    </div>
  </div>`;
  modal.innerHTML = html;
  overlay.classList.add("show");
  setTimeout(() => {
    const nameInput = document.getElementById('supp-name');
    if (nameInput) nameInput.focus();
  }, 50);
}

function saveSupplement(idx) {
  const name = document.getElementById('supp-name').value.trim();
  const dosage = document.getElementById('supp-dosage').value.trim();
  const type = document.getElementById('supp-type').value;
  const startDate = document.getElementById('supp-start').value;
  const endDate = document.getElementById('supp-end').value || null;
  if (!name) { showNotification('Name is required', 'error'); return; }
  if (!startDate) { showNotification('Start date is required', 'error'); return; }
  if (endDate && endDate < startDate) { showNotification('End date must be after start date', 'error'); return; }
  if (!importedData.supplements) importedData.supplements = [];
  const entry = { name, dosage, startDate, endDate, type };
  if (idx >= 0) {
    importedData.supplements[idx] = entry;
  } else {
    importedData.supplements.push(entry);
  }
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(idx >= 0 ? 'Supplement updated' : 'Supplement added', 'success');
}

function deleteSupplement(idx) {
  if (!importedData.supplements || !importedData.supplements[idx]) return;
  const name = importedData.supplements[idx].name;
  importedData.supplements.splice(idx, 1);
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`"${name}" removed`, 'info');
}

// ═══════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════
function showNotification(message, type) {
  type = type || "info";
  const container = document.getElementById("notification-container");
  const toast = document.createElement("div");
  toast.className = `notification-toast ${type}`;
  const icons = { success: "\u2713", error: "\u2717", info: "\u2139" };
  toast.innerHTML = `<span>${icons[type] || "\u2139"}</span> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0"; toast.style.transform = "translateX(100%)"; toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ═══════════════════════════════════════════════
// DROP ZONE
// ═══════════════════════════════════════════════
function setupDropZone() {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  dropZone.addEventListener("click", () => { document.getElementById('pdf-input').click(); });
  dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone.addEventListener("dragleave", e => { e.preventDefault(); dropZone.classList.remove("drag-over"); });
  dropZone.addEventListener("drop", async e => {
    e.preventDefault(); dropZone.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const file = files[0];
    if (file.name.endsWith('.json') || file.type === 'application/json') {
      importDataJSON(file);
    } else if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
      await handlePDFFile(file);
    } else {
      showNotification("Unsupported file type. Use PDF or JSON.", "error");
    }
  });
}

const IMPORT_STEPS = [
  "Extracting text from PDF",
  "AI analyzing lab report",
  "Preparing preview"
];

async function showImportProgress(step, fileName) {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  let html = '<div class="import-progress">';
  for (let i = 0; i < IMPORT_STEPS.length; i++) {
    const isDone = i < step;
    const isActive = i === step;
    const cls = isDone ? "done" : isActive ? "active" : "";
    const icon = isDone
      ? '<span class="step-icon">\u2713</span>'
      : isActive
        ? '<span class="step-icon"><span class="progress-spinner"></span></span>'
        : '<span class="step-icon">\u25CB</span>';
    html += `<div class="progress-step ${cls}">${icon}<span>${IMPORT_STEPS[i]}${isActive ? "..." : ""}</span></div>`;
  }
  if (fileName) html += `<div class="import-progress-filename">${fileName}</div>`;
  html += '</div>';
  dropZone.innerHTML = html;
  // Yield to browser so it actually paints the progress before heavy work continues
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
}

function hideImportProgress() {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  dropZone.innerHTML = `<div class="drop-zone-icon">\uD83D\uDCC4</div>
    <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
    <div class="drop-zone-hint">AI-powered \u2014 works with any lab PDF report or LabCharts JSON export</div>`;
}

async function handlePDFFile(file) {
  if (!hasApiKey()) {
    showNotification("API key required for PDF import. Opening settings...", "info");
    setTimeout(() => openSettingsModal(), 500);
    return;
  }
  try {
    await showImportProgress(0, file.name);
    const pdfText = await extractPDFText(file);
    if (!pdfText.trim()) { hideImportProgress(); showNotification("PDF appears empty — no text extracted", "error"); return; }
    await showImportProgress(1, file.name);
    const result = await parseLabPDFWithAI(pdfText, file.name);
    if (!result.date) { showNotification("Could not find collection date in PDF", "error"); }
    if (result.markers.length === 0) { hideImportProgress(); showNotification("No biomarkers found in PDF", "error"); return; }
    await showImportProgress(2, file.name);
    showImportPreview(result);
    hideImportProgress();
  } catch (err) {
    hideImportProgress();
    console.error("PDF parse error:", err);
    showNotification("Error parsing PDF: " + err.message, "error");
  }
}

// ═══════════════════════════════════════════════
// JSON EXPORT / IMPORT
// ═══════════════════════════════════════════════
function exportDataJSON() {
  const entries = (importedData && importedData.entries) ? importedData.entries : [];
  const notes = (importedData && importedData.notes) ? importedData.notes : [];
  if (entries.length === 0 && notes.length === 0) { showNotification("No data to export", "error"); return; }
  const diagnoses = importedData.diagnoses || '';
  const diet = importedData.diet || '';
  const circadian = importedData.circadian || '';
  const exercise = importedData.exercise || '';
  const sleep = importedData.sleep || '';
  const fieldExperts = importedData.fieldExperts || '';
  const customMarkers = importedData.customMarkers || {};
  const supplements = importedData.supplements || [];
  const exportObj = { version: 1, exportedAt: new Date().toISOString(), entries, notes, supplements, diagnoses, diet, circadian, exercise, sleep, fieldExperts, customMarkers };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const profiles = getProfiles();
  const profileName = (profiles.find(p => p.id === currentProfile) || { name: 'export' }).name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.download = `labcharts-${profileName}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification('Data exported successfully', 'success');
}

function importDataJSON(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      if (!json.entries || !Array.isArray(json.entries)) {
        showNotification('Invalid JSON format: missing entries array', 'error');
        return;
      }
      let count = 0;
      for (const entry of json.entries) {
        if (!entry.date || !entry.markers) continue;
        if (!importedData.entries) importedData.entries = [];
        importedData.entries = importedData.entries.filter(ex => ex.date !== entry.date);
        importedData.entries.push(entry);
        count++;
      }
      if (count === 0 && (!json.notes || json.notes.length === 0)) { showNotification('No valid entries found in JSON', 'error'); return; }
      // Import diagnoses and diet
      if (json.diagnoses && typeof json.diagnoses === 'string' && json.diagnoses.trim()) {
        importedData.diagnoses = json.diagnoses.trim();
      }
      if (json.diet && typeof json.diet === 'string' && json.diet.trim()) {
        importedData.diet = json.diet.trim();
      }
      if (json.circadian && typeof json.circadian === 'string' && json.circadian.trim()) {
        importedData.circadian = json.circadian.trim();
      }
      if (json.exercise && typeof json.exercise === 'string' && json.exercise.trim()) {
        importedData.exercise = json.exercise.trim();
      }
      if (json.sleep && typeof json.sleep === 'string' && json.sleep.trim()) {
        importedData.sleep = json.sleep.trim();
      }
      if (json.fieldExperts && typeof json.fieldExperts === 'string' && json.fieldExperts.trim()) {
        importedData.fieldExperts = json.fieldExperts.trim();
      }
      // Import custom markers (merge, don't overwrite existing definitions)
      if (json.customMarkers && typeof json.customMarkers === 'object') {
        if (!importedData.customMarkers) importedData.customMarkers = {};
        for (const [key, def] of Object.entries(json.customMarkers)) {
          if (!importedData.customMarkers[key]) {
            importedData.customMarkers[key] = def;
          }
        }
      }
      // Import supplements
      if (json.supplements && Array.isArray(json.supplements)) {
        if (!importedData.supplements) importedData.supplements = [];
        for (const s of json.supplements) {
          if (!s.name || !s.startDate) continue;
          const exists = importedData.supplements.some(x => x.name === s.name && x.startDate === s.startDate);
          if (!exists) importedData.supplements.push({ name: s.name, dosage: s.dosage || '', startDate: s.startDate, endDate: s.endDate || null, type: s.type || 'supplement' });
        }
      }
      // Import notes
      if (json.notes && Array.isArray(json.notes)) {
        if (!importedData.notes) importedData.notes = [];
        for (const note of json.notes) {
          if (!note.date || !note.text) continue;
          // Avoid duplicates (same date + same text)
          const exists = importedData.notes.some(n => n.date === note.date && n.text === note.text);
          if (!exists) importedData.notes.push({ date: note.date, text: note.text });
        }
      }
      localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
      buildSidebar();
      updateHeaderDates();
      navigate('dashboard');
      showNotification(`Imported ${count} date entr${count === 1 ? 'y' : 'ies'} from JSON`, 'success');
    } catch (err) {
      showNotification('Error parsing JSON: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function clearAllData() {
  if (!confirm('Are you sure you want to clear all imported data? This cannot be undone.')) return;
  importedData = { entries: [], notes: [], supplements: [], diagnoses: '', diet: '', circadian: '', exercise: '', sleep: '', fieldExperts: '', customMarkers: {} };
  localStorage.removeItem(profileStorageKey(currentProfile, 'imported'));
  buildSidebar();
  updateHeaderDates();
  navigate('dashboard');
  showNotification('All data cleared', 'info');
}

// ═══════════════════════════════════════════════
// PROFILE DROPDOWN UI
// ═══════════════════════════════════════════════
function renderProfileDropdown() {
  const container = document.getElementById('profile-selector');
  if (!container) return;
  const profiles = getProfiles();
  const active = profiles.find(p => p.id === currentProfile) || profiles[0];
  if (!active) return;

  let html = `<div class="profile-dropdown">
    <button class="profile-dropdown-btn" onclick="toggleProfileMenu()">
      <span class="profile-label">${active.name}</span>
      <span class="profile-arrow">\u25BC</span>
    </button>
    <div class="profile-menu" id="profile-menu">`;

  for (const p of profiles) {
    const isActive = p.id === currentProfile;
    html += `<div class="profile-menu-item${isActive ? ' active' : ''}" onclick="switchProfile('${p.id}')">
      <span class="profile-name">${p.name}</span>
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

function toggleProfileMenu() {
  const menu = document.getElementById('profile-menu');
  const btn = document.querySelector('.profile-dropdown-btn');
  if (!menu) return;
  const show = !menu.classList.contains('show');
  menu.classList.toggle('show', show);
  if (btn) btn.classList.toggle('open', show);
}

function promptCreateProfile() {
  const name = prompt('Enter profile name:');
  if (!name || !name.trim()) return;
  const id = createProfile(name.trim());
  toggleProfileMenu();
  switchProfile(id);
}

function promptRenameProfile(id) {
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

// ═══════════════════════════════════════════════
// AI CHAT PANEL
// ═══════════════════════════════════════════════
const CHAT_SYSTEM_PROMPT = `You are an AI lab analyst assistant integrated into a blood work dashboard application called LabCharts. You help users understand their lab results.

Important guidelines:
- You are NOT a doctor. Always recommend consulting a physician for medical decisions.
- Explain biomarkers, trends, and correlations in accessible language.
- Reference specific values and dates from the user's data when relevant.
- Point out noteworthy patterns: values trending up/down, values outside reference ranges, combinations that may be clinically relevant.
- Keep responses concise but informative. Use plain language.
- If asked about a topic outside lab results, politely redirect to your area of expertise.
- If the user has added notes for specific dates, consider them when interpreting results (e.g. medication changes, supplement starts, fasting status, symptoms).
- If the user has listed medical conditions or diagnoses, always consider them when interpreting lab results. Explain how specific conditions may affect certain biomarkers, and flag results that are particularly relevant to their diagnoses.
- If the user has described their diet, consider how it may influence lab results (e.g. keto can raise LDL, vegetarian diets may affect B12/iron, high protein affects creatinine/urea).
- If the user has described their circadian habits, consider how sleep patterns, shift work, and light exposure may influence lab results (e.g. poor sleep can raise cortisol/hs-CRP/insulin resistance, shift work disrupts hormone rhythms, melatonin timing affects thyroid markers).
- If the user has described their exercise habits, consider how training type and intensity may influence lab results (e.g. heavy lifting raises CK/AST/ALT, endurance training lowers resting HR and raises HDL, overtraining elevates hs-CRP/cortisol, high protein intake affects creatinine/urea/BUN).
- If the user has described their sleep habits, consider how sleep quality, duration, and disorders affect lab results (e.g. poor sleep raises hs-CRP, cortisol, insulin resistance; sleep apnea affects RBC/hemoglobin; chronic sleep debt impairs immune markers).
- If the user has listed field experts, consider those experts' published research, frameworks, and clinical perspectives when interpreting results. Reference their specific work where relevant.
- If the user has logged supplements or medications with date ranges, correlate their start/stop dates with biomarker changes. Note when a marker shift coincides with beginning or ending a supplement/medication, and explain known effects of that substance on relevant biomarkers.
- Format responses with markdown where helpful (bold for emphasis, bullet points for lists).`;

function buildLabContext() {
  const data = getActiveData();
  if (!data.dates.length && !Object.values(data.categories).some(c => c.singleDate)) {
    return 'No lab data is currently loaded for this profile.';
  }
  const sexLabel = profileSex === 'female' ? 'female' : profileSex === 'male' ? 'male' : 'not specified';
  let ctx = `Lab data for current profile (sex: ${sexLabel}, dates: ${data.dateLabels.join(', ')}):\n\n`;
  const diagnoses = importedData.diagnoses || '';
  if (diagnoses.trim()) {
    ctx += `## Medical Conditions / Diagnoses\n${diagnoses.trim()}\n\n`;
  }
  const diet = importedData.diet || '';
  if (diet.trim()) {
    ctx += `## Diet\n${diet.trim()}\n\n`;
  }
  const circadian = importedData.circadian || '';
  if (circadian.trim()) {
    ctx += `## Circadian Habits\n${circadian.trim()}\n\n`;
  }
  const exercise = importedData.exercise || '';
  if (exercise.trim()) {
    ctx += `## Exercise & Movement\n${exercise.trim()}\n\n`;
  }
  const sleep = importedData.sleep || '';
  if (sleep.trim()) {
    ctx += `## Sleep\n${sleep.trim()}\n\n`;
  }
  const fieldExperts = importedData.fieldExperts || '';
  if (fieldExperts.trim()) {
    ctx += `## Field Experts\n${fieldExperts.trim()}\n\n`;
  }
  const supps = importedData.supplements || [];
  if (supps.length > 0) {
    ctx += `## Supplements & Medications\n`;
    const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    for (const s of supps) {
      const dateRange = `${fmtDate(s.startDate)} \u2192 ${s.endDate ? fmtDate(s.endDate) : 'ongoing'}`;
      ctx += `- ${s.name}${s.dosage ? ' (' + s.dosage + ')' : ''} [${s.type}]: ${dateRange}\n`;
    }
    ctx += '\n';
  }
  for (const [catKey, cat] of Object.entries(data.categories)) {
    const markersWithData = Object.entries(cat.markers).filter(([_, m]) => m.values.some(v => v !== null));
    if (markersWithData.length === 0) continue;
    ctx += `## ${cat.label}\n`;
    for (const [key, m] of markersWithData) {
      const vals = m.singlePoint
        ? m.values.filter(v => v !== null).map(v => `${v}`).join('')
        : m.values.map((v, i) => v !== null ? `${data.dateLabels[i]}: ${v}` : null).filter(Boolean).join(', ');
      const latestIdx = getLatestValueIndex(m.values);
      const status = latestIdx !== -1 ? getStatus(m.values[latestIdx], m.refMin, m.refMax) : 'no data';
      const refStr = m.refMin != null && m.refMax != null ? `ref: ${m.refMin}–${m.refMax}, ` : '';
      ctx += `- ${m.name}: ${vals} ${m.unit} (${refStr}status: ${status})\n`;
    }
    ctx += '\n';
  }
  const flags = getAllFlaggedMarkers(data);
  if (flags.length > 0) {
    ctx += `## Flagged Results (Latest)\n`;
    for (const f of flags) {
      ctx += `- ${f.name}: ${f.value} ${f.unit} (${f.status.toUpperCase()}, ref: ${f.refMin}–${f.refMax})\n`;
    }
    ctx += '\n';
  }
  const notes = (importedData.notes || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  if (notes.length > 0) {
    ctx += `## User Notes\n`;
    for (const n of notes) {
      const d = new Date(n.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      ctx += `- ${d}: ${n.text}\n`;
    }
  }
  return ctx;
}

function getChatStorageKey() {
  return `labcharts-${currentProfile}-chat`;
}

function loadChatHistory() {
  try {
    const stored = localStorage.getItem(getChatStorageKey());
    chatHistory = stored ? JSON.parse(stored) : [];
  } catch { chatHistory = []; }
  renderChatMessages();
}

function saveChatHistory() {
  // Keep last 20 messages
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
  localStorage.setItem(getChatStorageKey(), JSON.stringify(chatHistory));
}

function clearChatHistory() {
  chatHistory = [];
  localStorage.removeItem(getChatStorageKey());
  renderChatMessages();
  showNotification('Chat history cleared', 'info');
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  if (chatHistory.length === 0) {
    container.innerHTML = `<div class="chat-empty">
      <div class="chat-empty-icon">&#129302;</div>
      <div>Ask me about your lab results, trends, or what specific biomarkers mean.</div>
    </div>`;
    return;
  }
  let html = '';
  for (const msg of chatHistory) {
    const cls = msg.role === 'user' ? 'chat-user' : 'chat-ai';
    html += `<div class="chat-msg ${cls}">${renderMarkdown(msg.content)}</div>`;
  }
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

function renderMarkdown(text) {
  // Basic markdown: bold, inline code, line breaks
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

function toggleChatPanel() {
  const panel = document.getElementById('chat-panel');
  const backdrop = document.getElementById('chat-backdrop');
  if (panel.classList.contains('open')) {
    closeChatPanel();
  } else {
    openChatPanel();
  }
}

function openChatPanel(prefillMessage) {
  if (!hasApiKey()) {
    showNotification("API key required. Opening settings...", "info");
    setTimeout(() => openSettingsModal(), 500);
    return;
  }
  const panel = document.getElementById('chat-panel');
  const backdrop = document.getElementById('chat-backdrop');
  panel.classList.add('open');
  backdrop.classList.add('open');
  loadChatHistory();
  if (prefillMessage) {
    const input = document.getElementById('chat-input');
    if (input) { input.value = prefillMessage; input.focus(); }
  } else {
    const input = document.getElementById('chat-input');
    if (input) input.focus();
  }
}

function closeChatPanel() {
  document.getElementById('chat-panel').classList.remove('open');
  document.getElementById('chat-backdrop').classList.remove('open');
}

async function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const container = document.getElementById('chat-messages');
  const text = input.value.trim();
  if (!text) return;

  // Add user message
  chatHistory.push({ role: 'user', content: text });
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
    const systemPrompt = CHAT_SYSTEM_PROMPT + '\n\nCurrent lab data:\n' + labContext;

    // Send last 10 messages for context
    const apiMessages = chatHistory.slice(-10).map(m => ({ role: m.role, content: m.content }));

    // Create AI message placeholder
    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-msg chat-ai';
    aiMsgEl.innerHTML = '';

    const fullText = await callClaudeAPI({
      system: systemPrompt,
      messages: apiMessages,
      maxTokens: 2048,
      onStream: (text) => {
        // Remove typing indicator on first chunk
        if (typingEl.parentNode) typingEl.remove();
        if (!aiMsgEl.parentNode) container.appendChild(aiMsgEl);
        aiMsgEl.innerHTML = renderMarkdown(text);
        container.scrollTop = container.scrollHeight;
      }
    });

    // Ensure typing indicator removed
    if (typingEl.parentNode) typingEl.remove();
    if (!aiMsgEl.parentNode) {
      // Non-streaming fallback
      container.appendChild(aiMsgEl);
      aiMsgEl.innerHTML = renderMarkdown(fullText);
    }

    chatHistory.push({ role: 'assistant', content: fullText });
    saveChatHistory();
  } catch (err) {
    if (typingEl.parentNode) typingEl.remove();
    const errEl = document.createElement('div');
    errEl.className = 'chat-msg chat-ai';
    errEl.innerHTML = `<span style="color:var(--red)">Error: ${err.message}</span>`;
    container.appendChild(errEl);
  }

  sendBtn.disabled = false;
  sendBtn.textContent = 'Send';
  container.scrollTop = container.scrollHeight;
}

function handleChatKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

function askAIAboutMarker(markerId) {
  const marker = markerRegistry[markerId];
  if (!marker) return;
  const data = getActiveData();
  const dates = marker.singlePoint ? [marker.singleDateLabel || 'N/A'] : data.dateLabels;
  const valuesText = marker.values
    .map((v, i) => v !== null ? `${dates[i]}: ${formatValue(v)} ${marker.unit}` : null)
    .filter(Boolean).join(', ');
  const latestIdx = getLatestValueIndex(marker.values);
  const status = latestIdx !== -1 ? getStatus(marker.values[latestIdx], marker.refMin, marker.refMax) : 'no data';
  const prompt = `Tell me about my ${marker.name} results. Values: ${valuesText}. Reference range: ${marker.refMin}–${marker.refMax} ${marker.unit}. Current status: ${status}. What does this mean and should I be concerned about anything?`;
  closeModal();
  openChatPanel(prompt);
}
