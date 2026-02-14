// ═══════════════════════════════════════════════
// MARKER SCHEMA (no personal data — just biomarker definitions)
// ═══════════════════════════════════════════════
const MARKER_SCHEMA = {
  biochemistry: {
    label: "Biochemistry", icon: "\u{1F9EA}",
    markers: {
      glucose: { name: "Glucose (Gluk\u00f3za)", unit: "mmol/l", refMin: 4.11, refMax: 5.60 },
      urea: { name: "Urea", unit: "mmol/l", refMin: 2.8, refMax: 8.3 },
      creatinine: { name: "Creatinine (Kreatinin)", unit: "\u00b5mol/l", refMin: 62, refMax: 106 },
      egfr: { name: "eGFR (CKD-EPI)", unit: "ml/s/1.73m\u00b2", refMin: 1.00, refMax: 2.30 },
      uricAcid: { name: "Uric Acid (Kyselina mo\u010dov\u00e1)", unit: "\u00b5mol/l", refMin: 202, refMax: 417 },
      bilirubinTotal: { name: "Bilirubin Total", unit: "\u00b5mol/l", refMin: 3.0, refMax: 24.0 },
      ast: { name: "AST", unit: "\u00b5kat/l", refMin: 0.17, refMax: 0.85 },
      alt: { name: "ALT", unit: "\u00b5kat/l", refMin: 0.17, refMax: 0.83 },
      alp: { name: "ALP", unit: "\u00b5kat/l", refMin: 0.67, refMax: 2.15 },
      ggt: { name: "GGT", unit: "\u00b5kat/l", refMin: 0.17, refMax: 1.19 },
      ldh: { name: "LDH", unit: "\u00b5kat/l", refMin: 2.25, refMax: 3.75 },
      creatineKinase: { name: "Creatine Kinase", unit: "\u00b5kat/l", refMin: 0.65, refMax: 5.14 },
      cystatinC: { name: "Cystatin C", unit: "mg/l", refMin: 0.61, refMax: 0.95 },
      gfrCystatin: { name: "GFR Cystatin", unit: "ml/s", refMin: 1.80, refMax: 2.63 }
    }
  },
  hormones: {
    label: "Hormones", icon: "\u26A1",
    markers: {
      testosterone: { name: "Testosterone", unit: "nmol/l", refMin: 8.64, refMax: 29.00 },
      freeTestosterone: { name: "Free Testosterone", unit: "pmol/l", refMin: 30.70, refMax: 161.70 },
      shbg: { name: "SHBG", unit: "nmol/l", refMin: 14.5, refMax: 54.1 },
      dheaS: { name: "DHEA-S", unit: "\u00b5mol/l", refMin: 2.41, refMax: 11.60 },
      fai: { name: "Free Androgen Index", unit: "%", refMin: 34.0, refMax: 106.0 },
      estradiol: { name: "Estradiol", unit: "pmol/l", refMin: 41.4, refMax: 159.0 },
      progesterone: { name: "Progesterone", unit: "nmol/l", refMin: 0.159, refMax: 0.474 },
      calcitonin: { name: "Calcitonin", unit: "ng/l", refMin: 1.0, refMax: 11.8 },
      dht: { name: "DHT", unit: "nmol/l", refMin: 0.86, refMax: 3.40 },
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
      iron: { name: "Iron", unit: "\u00b5mol/l", refMin: 5.8, refMax: 34.5 },
      ferritin: { name: "Ferritin", unit: "\u00b5g/l", refMin: 30, refMax: 400 },
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
      homocysteine: { name: "Homocysteine", unit: "\u00b5mol/l", refMin: 5.2, refMax: 15.0 }
    }
  },
  hematology: {
    label: "Hematology (CBC)", icon: "\uD83E\uDDE0",
    markers: {
      wbc: { name: "WBC", unit: "10^9/l", refMin: 4.00, refMax: 10.00 },
      rbc: { name: "RBC", unit: "10^12/l", refMin: 4.00, refMax: 5.80 },
      hemoglobin: { name: "Hemoglobin", unit: "g/l", refMin: 135, refMax: 175 },
      hematocrit: { name: "Hematocrit", unit: "", refMin: 0.400, refMax: 0.500 },
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
  'diabetes.hba1c': { type: 'hba1c' }
};

// ═══════════════════════════════════════════════
// SPADIA PDF NAME MAP — from virtuallab.spadia.cz/Verejne/LaboratorniPrirucka
// ═══════════════════════════════════════════════
const SPADIA_NAME_MAP = {
  // ── Biochemistry ──
  "Gluk\u00f3za":"biochemistry.glucose", "Glukosa":"biochemistry.glucose", "Glyk\u00e9mie":"biochemistry.glucose",
  "Gluk\u00f3za (plazma)":"biochemistry.glucose", "Gluk\u00f3za v s\u00e9ru":"biochemistry.glucose",
  "Urea":"biochemistry.urea", "Mo\u010dovina":"biochemistry.urea", "Mo\u010d":"biochemistry.urea",
  "Kreatinin":"biochemistry.creatinine", "Kreatinin enzymaticky":"biochemistry.creatinine", "Kreatinin v s\u00e9ru":"biochemistry.creatinine",
  "eGFR dle CKD-EPI":"biochemistry.egfr", "eGFR CKD-EPI":"biochemistry.egfr", "eGFR":"biochemistry.egfr",
  "V\u00fdpo\u010det glomerul\u00e1rn\u00ed filtrace dle rovnice CKD-EPI":"biochemistry.egfr",
  "Kyselina mo\u010dov\u00e1":"biochemistry.uricAcid", "Kyselina \u00fari\u010dov\u00e1":"biochemistry.uricAcid",
  "Bilirubin":"biochemistry.bilirubinTotal", "Bilirubin celkov\u00fd":"biochemistry.bilirubinTotal", "Bilirubin celk.":"biochemistry.bilirubinTotal",
  "AST":"biochemistry.ast", "Aspart\u00e1taminotransfer\u00e1za":"biochemistry.ast",
  "ALT":"biochemistry.alt", "Alaninaminotransfer\u00e1za":"biochemistry.alt",
  "ALP":"biochemistry.alp", "Alkalick\u00e1 fosfat\u00e1za":"biochemistry.alp",
  "GGT":"biochemistry.ggt", "y-glutamyltransfer\u00e1za":"biochemistry.ggt", "\u03b3-glutamyltransfer\u00e1za":"biochemistry.ggt", "GMT":"biochemistry.ggt",
  "LD":"biochemistry.ldh", "LDH":"biochemistry.ldh", "Lakt\u00e1tdehydrogen\u00e1za":"biochemistry.ldh",
  "CK":"biochemistry.creatineKinase", "Kreatinkin\u00e1za":"biochemistry.creatineKinase",
  "Kreatin kin\u00e1za":"biochemistry.creatineKinase", "Kreatin-kin\u00e1za":"biochemistry.creatineKinase",
  "Cystatin C":"biochemistry.cystatinC",
  "GFR dle Cyst C":"biochemistry.gfrCystatin", "GF Cystatin":"biochemistry.gfrCystatin",
  // ── Hormones ──
  "Testosteron":"hormones.testosterone", "Testosteron celk.":"hormones.testosterone", "Testosteron celkov\u00fd":"hormones.testosterone",
  "Testosteron voln\u00fd":"hormones.freeTestosterone",
  "SHBG":"hormones.shbg", "Sexu\u00e1ln\u00ed hormony v\u00e1zaj\u00edc\u00ed globulin":"hormones.shbg",
  "DHEA-S":"hormones.dheaS", "DHEA S":"hormones.dheaS", "DHEA-sulf\u00e1t":"hormones.dheaS",
  "Dehydroepiandrosteronsulf\u00e1t":"hormones.dheaS",
  "FAI":"hormones.fai", "Voln\u00fd androgenn\u00ed index":"hormones.fai",
  "Estradiol":"hormones.estradiol",
  "Progesteron":"hormones.progesterone",
  "Kalcitonin":"hormones.calcitonin",
  "DHT":"hormones.dht", "Dihydrotestosteron":"hormones.dht",
  "IGF-1":"hormones.igf1", "Inzulinu podobn\u00fd r\u016fstov\u00fd faktor 1":"hormones.igf1",
  "Inzul\u00edn":"hormones.insulin", "Insulin":"hormones.insulin", "Inzulin":"hormones.insulin",
  // ── Electrolytes & Minerals ──
  "Sod\u00edk":"electrolytes.sodium", "Natrium":"electrolytes.sodium", "Na":"electrolytes.sodium",
  "Drasl\u00edk":"electrolytes.potassium", "Kalium":"electrolytes.potassium", "K":"electrolytes.potassium",
  "Chloridy":"electrolytes.chloride", "Cl":"electrolytes.chloride",
  "V\u00e1pn\u00edk":"electrolytes.calciumTotal", "V\u00e1pn\u00edk (Kalcium)":"electrolytes.calciumTotal",
  "V\u00e1pn\u00edk celkov\u00fd":"electrolytes.calciumTotal", "Kalcium celkov\u00e9":"electrolytes.calciumTotal",
  "Kalcium":"electrolytes.calciumTotal", "Ca celk.":"electrolytes.calciumTotal", "Ca":"electrolytes.calciumTotal",
  "Fosfor anorganick\u00fd":"electrolytes.phosphorus", "Fosfor":"electrolytes.phosphorus", "Fosf\u00e1t":"electrolytes.phosphorus",
  "Ho\u0159\u010d\u00edk":"electrolytes.magnesium", "Mg":"electrolytes.magnesium", "Magnezium":"electrolytes.magnesium",
  "Ho\u0159\u010d\u00edk v erytrocytech":"electrolytes.magnesiumRBC", "Mg v ery.":"electrolytes.magnesiumRBC", "Magnezium v erytrocytech":"electrolytes.magnesiumRBC",
  "Zinek":"electrolytes.zinc", "Zn":"electrolytes.zinc",
  "M\u011b\u010f":"electrolytes.copper", "Cu":"electrolytes.copper",
  // ── Lipids ──
  "Cholesterol":"lipids.cholesterol", "Cholesterol celkov\u00fd":"lipids.cholesterol", "Cholesterol celk.":"lipids.cholesterol",
  "Triacylglyceroly":"lipids.triglycerides", "Triacylglyceridy":"lipids.triglycerides", "Triglyceridy":"lipids.triglycerides", "TAG":"lipids.triglycerides",
  "HDL-Cholesterol":"lipids.hdl", "HDL-cholesterol":"lipids.hdl", "HDL cholesterol":"lipids.hdl",
  "HDL-chol":"lipids.hdl", "HDL-chol.":"lipids.hdl", "HDL chol.":"lipids.hdl",
  "LDL-Cholesterol":"lipids.ldl", "LDL-cholesterol":"lipids.ldl", "LDL cholesterol":"lipids.ldl",
  "LDL-chol":"lipids.ldl", "LDL-chol.":"lipids.ldl", "LDL chol.":"lipids.ldl",
  "Non-HDL cholesterol":"lipids.nonHdl", "Non-HDL chol.":"lipids.nonHdl",
  "V\u00fdpo\u010det non-HDL":"lipids.nonHdl", "V\u00fdpo\u010det non HDL":"lipids.nonHdl", "non-HDL":"lipids.nonHdl",
  "Chol/HDL":"lipids.cholHdlRatio", "Chol/HDL pom\u011br":"lipids.cholHdlRatio", "V\u00fdpo\u010det Chol/HDL":"lipids.cholHdlRatio",
  "ApoA-I":"lipids.apoAI", "ApoA-1":"lipids.apoAI", "Apo AI":"lipids.apoAI", "Apo A1":"lipids.apoAI",
  "Apo A-I":"lipids.apoAI", "Apolipoprotein A1":"lipids.apoAI",
  "ApoB":"lipids.apoB", "Apo B":"lipids.apoB", "Apolipoprotein B":"lipids.apoB",
  // ── Iron Metabolism ──
  "\u017dele\u017eo":"iron.iron", "Fe":"iron.iron",
  "Ferritin":"iron.ferritin", "Feritin":"iron.ferritin",
  "Transferin":"iron.transferrin", "Transferrin":"iron.transferrin",
  "TIBC":"iron.tibc", "Celkov\u00e1 vazebn\u00e1 kapacita \u017eeleza":"iron.tibc", "Vazebn\u00e1 kap.Fe":"iron.tibc",
  "Saturace transferinu":"iron.transferrinSat", "Sat.transferinu":"iron.transferrinSat",
  // ── Proteins & Inflammation ──
  "hs-CRP":"proteins.hsCRP", "hs CRP":"proteins.hsCRP", "hsCRP":"proteins.hsCRP",
  "CRP ultrasenzit.":"proteins.hsCRP", "CRP ultrasenzitivn\u00ed":"proteins.hsCRP", "CRP":"proteins.hsCRP",
  "Celk.b\u00edlkovina":"proteins.totalProtein", "Celkov\u00e1 b\u00edlkovina":"proteins.totalProtein",
  "Celkov\u00e1 b\u00edl.":"proteins.totalProtein", "Celk. b\u00edlkovina":"proteins.totalProtein",
  "Albumin":"proteins.albumin",
  "Ceruloplazmin":"proteins.ceruloplasmin",
  // ── Thyroid ──
  "TSH":"thyroid.tsh", "Thyreotropin":"thyroid.tsh",
  "FT4":"thyroid.ft4", "fT4":"thyroid.ft4", "Voln\u00fd thyroxin":"thyroid.ft4", "Voln\u00fd T4":"thyroid.ft4",
  "FT3":"thyroid.ft3", "fT3":"thyroid.ft3", "Voln\u00fd trijodthyronin":"thyroid.ft3", "Voln\u00fd T3":"thyroid.ft3",
  "T4 celkov\u00fd":"thyroid.t4total", "Thyroxin":"thyroid.t4total", "T4":"thyroid.t4total",
  "T3 celkov\u00fd":"thyroid.t3total", "Trijodthyronin":"thyroid.t3total", "T3":"thyroid.t3total",
  // ── Vitamins ──
  "Vitamin D celk.":"vitamins.vitaminD", "Vitamin D celkov\u00fd":"vitamins.vitaminD", "Vitamin D":"vitamins.vitaminD",
  "25-OH vitamin D":"vitamins.vitaminD", "25OH vitamin D celk.":"vitamins.vitaminD", "25OH Vitamin D":"vitamins.vitaminD",
  "Vitamin D celkov\u00fd":"vitamins.vitaminD",
  "Vitamin D3":"vitamins.vitaminD3", "25-OH Vitamin D3":"vitamins.vitaminD3", "25-OH vitamin D3":"vitamins.vitaminD3",
  "Vitamin A":"vitamins.vitaminA", "Vitam\u00edn A":"vitamins.vitaminA", "Retinol":"vitamins.vitaminA",
  // ── Diabetes ──
  "HbA1c":"diabetes.hba1c", "Glyk.hemoglobin":"diabetes.hba1c", "Glykovan\u00fd hemoglobin":"diabetes.hba1c",
  "HOMA-IR":"diabetes.homaIR", "HOMA IR":"diabetes.homaIR", "HOMA-IR (calc)":"diabetes.homaIR",
  // ── Tumor Markers ──
  "PSA":"tumorMarkers.psa", "PSA celkov\u00fd":"tumorMarkers.psa", "PSA celk.":"tumorMarkers.psa",
  // ── Coagulation ──
  "Homocystein":"coagulation.homocysteine",
  // ── Hematology ──
  "Leukocyty":"hematology.wbc", "WBC":"hematology.wbc",
  "Erytrocyty":"hematology.rbc", "RBC":"hematology.rbc",
  "Hemoglobin":"hematology.hemoglobin", "HGB":"hematology.hemoglobin", "Hb":"hematology.hemoglobin",
  "Hematokrit":"hematology.hematocrit", "HCT":"hematology.hematocrit",
  "MCV":"hematology.mcv", "MCH":"hematology.mch", "MCHC":"hematology.mchc",
  "RDW-CV":"hematology.rdwcv", "RDW":"hematology.rdwcv",
  "Trombocyty":"hematology.platelets", "PLT":"hematology.platelets",
  "MPV":"hematology.mpv", "PDW":"hematology.pdw",
  // ── WBC Differential ──
  "Neutrofily abs.":"differential.neutrophils", "Neutrofily #":"differential.neutrophils",
  "Lymfocyty abs.":"differential.lymphocytes", "Lymfocyty #":"differential.lymphocytes",
  "Monocyty abs.":"differential.monocytes", "Monocyty #":"differential.monocytes",
  "Eozinofily abs.":"differential.eosinophils", "Eozinofily #":"differential.eosinophils",
  "Eosinofily abs.":"differential.eosinophils", "Eosinofily #":"differential.eosinophils",
  "Bazofily abs.":"differential.basophils", "Bazofily #":"differential.basophils",
  "Basofily abs.":"differential.basophils", "Basofily #":"differential.basophils",
  "Neutrofily":"differential.neutrophilsPct", "Lymfocyty":"differential.lymphocytesPct", "Monocyty":"differential.monocytesPct",
  "Eozinofily":"differential.eosinophils", "Eosinofily":"differential.eosinophils",
  "Bazofily":"differential.basophils", "Basofily":"differential.basophils",
  // ── Bone Metabolism ──
  "Osteokalcin":"boneMetabolism.osteocalcin",
  // ── Fatty Acids ──
  "Kyselina palmitov\u00e1 C16:0":"fattyAcids.palmiticC16", "Kyselina pamitov\u00e1 C16:0":"fattyAcids.palmiticC16",
  "Kyselina stearov\u00e1 C18:0":"fattyAcids.stearicC18",
  "Kyselina olejov\u00e1 C18:1":"fattyAcids.oleicC18_1",
  "Kyselina linolov\u00e1 C18:2":"fattyAcids.linoleicC18_2",
  "Kyselina gama-linolenovÃ\u00a1 C18:3":"fattyAcids.glaC18_3", "Kyselina gama-linolenov\u00e1 C18:3":"fattyAcids.glaC18_3",
  "Kyselina arachidonov\u00e1 C20:4":"fattyAcids.arachidonicC20_4",
  "Kyselina dihomo-gama-linolenov\u00e1 C20:3":"fattyAcids.dglaC20_3",
  "Kyselina alfa-linolenov\u00e1 C18:3":"fattyAcids.alaC18_3",
  "Kyselina eikosapentaenov\u00e1 C20:5":"fattyAcids.epaC20_5",
  "Kyselina dokosapentaenov\u00e1 C22:5":"fattyAcids.dpaC22_5",
  "Kyselina dokosahexaenov\u00e1 C22:6":"fattyAcids.dhaC22_6",
  "Omega-3 index":"fattyAcids.omega3Index",
  "Pom\u011br Omega-6/Omega-3":"fattyAcids.omega6to3Ratio",
  "Fluidita bun\u011b\u010dn\u00e9 membr\u00e1ny":"fattyAcids.membraneFluidity",
  "Index du\u0161evn\u00ed odolnosti":"fattyAcids.mentalResilience"
};

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

function getStatus(value, refMin, refMax) {
  if (value === null || value === undefined) return "missing";
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
let importedData = { entries: [] };
let unitSystem = 'EU';
let selectedCorrelationMarkers = [];

// ═══════════════════════════════════════════════
// DATA PIPELINE
// ═══════════════════════════════════════════════
function getActiveData() {
  const data = {
    dates: [],
    dateLabels: [],
    categories: JSON.parse(JSON.stringify(MARKER_SCHEMA))
  };

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
  const savedImported = localStorage.getItem('labcharts-imported');
  if (savedImported) { try { importedData = JSON.parse(savedImported); } catch(e) {} }
  const savedUnits = localStorage.getItem('labcharts-units');
  if (savedUnits === 'US') unitSystem = 'US';
  if (typeof pdfjsLib !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  }
  document.querySelectorAll('.unit-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.unit === unitSystem);
  });
  buildSidebar();
  showDashboard();
  updateHeaderDates();
  document.getElementById("pdf-input").addEventListener("change", async e => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.name.endsWith('.json')) importDataJSON(file);
      else await handlePDFFile(file);
      e.target.value = '';
    }
  });
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

  html += `<div class="drop-zone" id="drop-zone" onclick="document.getElementById('pdf-input').click()">
    <div class="drop-zone-icon">\uD83D\uDCC4</div>
    <div class="drop-zone-text">Drop PDF or JSON file here to import</div>
    <div class="drop-zone-hint">Supports SPADIA PDF reports and LabCharts JSON exports</div></div>`;

  if (importedData.entries && importedData.entries.length > 0) {
    html += `<div class="imported-entries">`;
    for (const entry of importedData.entries.sort((a,b) => a.date.localeCompare(b.date))) {
      const d = new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const cnt = Object.keys(entry.markers).length;
      html += `<div class="imported-entry">
        <span class="ie-info"><span class="ie-date">${d}</span><span class="ie-count">${cnt} markers</span></span>
        <button class="ie-remove" onclick="removeImportedEntry('${entry.date}')">\u2715 Remove</button></div>`;
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
        <li>Drop a SPADIA PDF lab report above, or click to browse</li>
        <li>Import a previously exported LabCharts JSON file</li>
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
    createLineChart(km.cat + "_" + km.key, marker, data.dateLabels);
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
      createLineChart(categoryKey + "_" + key, marker, data.dateLabels);
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
        createLineChart(categoryKey + "_" + key, marker, data.dateLabels);
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
  html += `</div><div class="chart-ref-range">Reference: ${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)} ${marker.unit}</div></div>`;
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
      <td class="ref-col">${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}</td>`;
    for (let i = 0; i < marker.values.length; i++) {
      const v = marker.values[i];
      const s = v !== null ? getStatus(v, marker.refMin, marker.refMax) : "missing";
      html += `<td class="value-cell val-${s}">${v !== null ? formatValue(v) : "\u2014"}</td>`;
    }
    const trend = getTrend(marker.values);
    html += `<td><span class="trend-arrow ${trend.cls}">${trend.arrow}</span></td>`;
    const li = getLatestValueIndex(marker.values);
    if (li !== -1) {
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
    if (!opts || !chart.chartArea) return;
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

function createLineChart(id, marker, dateLabels) {
  const canvas = document.getElementById("chart-" + id);
  if (!canvas) return;
  const dates = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : dateLabels;
  const values = marker.values;
  const valid = values.filter(v => v !== null);
  if (valid.length === 0) return;
  const minV = Math.min(...valid, marker.refMin);
  const maxV = Math.max(...valid, marker.refMax);
  const pad = (maxV - minV) * 0.15 || 1;
  const ptColors = values.map(v => {
    if (v === null) return "transparent";
    const s = getStatus(v, marker.refMin, marker.refMax);
    return s==="normal"?"#34d399":s==="high"?"#f87171":"#fbbf24";
  });
  chartInstances[id] = new Chart(canvas, {
    type: "line",
    data: { labels: dates, datasets: [{
      data: values, borderColor: "#4f8cff", backgroundColor: "rgba(79,140,255,0.1)",
      borderWidth: 2.5, pointBackgroundColor: ptColors, pointBorderColor: ptColors,
      pointRadius: 6, pointHoverRadius: 8, tension: 0.3, fill: false, spanGaps: false
    }]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{display:false},
        tooltip:{ backgroundColor:"#222635", titleColor:"#e8eaf0", bodyColor:"#8b90a0", borderColor:"#2e3348", borderWidth:1,
          callbacks:{ label:(c)=>`${formatValue(c.parsed.y)} ${marker.unit}`, afterLabel:()=>`Ref: ${marker.refMin} \u2013 ${marker.refMax}` }},
        refBand:{ refMin:marker.refMin, refMax:marker.refMax }},
      scales: { x:{ticks:{color:"#5a5f73",font:{size:11}},grid:{display:false}},
        y:{min:minV-pad, max:maxV+pad, ticks:{color:"#5a5f73",font:{size:10}}, grid:{color:"rgba(46,51,72,0.5)"}}}
    },
    plugins: [refBandPlugin]
  });
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
    <div class="modal-unit">${marker.unit} &middot; Reference: ${marker.refMin} \u2013 ${marker.refMax}</div>
    <div class="modal-chart"><canvas id="modal-chart"></canvas></div>
    <div class="modal-values-grid">`;
  for (let i = 0; i < marker.values.length; i++) {
    const v = marker.values[i];
    const s = v !== null ? getStatus(v, marker.refMin, marker.refMax) : "missing";
    const sl = s==="normal"?"In Range":s==="high"?"Above Range":s==="low"?"Below Range":"N/A";
    html += `<div class="modal-value-card"><div class="mv-date">${dates[i]}</div>
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
  modal.innerHTML = html;
  overlay.classList.add("show");
  setTimeout(() => {
    if (document.getElementById("modal-chart")) createLineChart("modal", marker, data.dateLabels);
  }, 50);
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
  if (chartInstances["modal"]) { chartInstances["modal"].destroy(); delete chartInstances["modal"]; }
}
document.addEventListener("click", e => {
  if (e.target.id === "modal-overlay") closeModal();
  if (e.target.id === "import-modal-overlay") closeImportModal();
  const dd = document.getElementById("corr-options");
  const si = document.getElementById("corr-search");
  if (dd && si && !dd.contains(e.target) && e.target !== si) dd.classList.remove("show");
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

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
  localStorage.setItem('labcharts-units', system);
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
      pointBackgroundColor: color, tension: 0.3, fill: false, spanGaps: false,
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
        refBand: { refMin: 0, refMax: 100 }
      },
      scales: {
        x: { ticks: { color: "#5a5f73", font: { size: 11 } }, grid: { display: false } },
        y: { min: minY, max: maxY, ticks: { color: "#5a5f73", font: { size: 10 }, callback: v => v + '%' }, grid: { color: "rgba(46,51,72,0.5)" } }
      }
    },
    plugins: [refBandPlugin]
  });
}

// ═══════════════════════════════════════════════
// PDF IMPORT
// ═══════════════════════════════════════════════
async function parseSpadiaPDF(file) {
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
  const date = extractDateFromPDFText(allItems);
  const markers = extractMarkersFromPDFText(allItems);
  return { date, markers, fileName: file.name };
}

function extractDateFromPDFText(items) {
  for (const item of items) {
    if (/od(?:b|\u011b)r|datum/i.test(item.text)) {
      const match = item.text.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
      if (match) return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`;
    }
  }
  for (let i = 0; i < items.length; i++) {
    if (/od(?:b|\u011b)r|datum/i.test(items[i].text)) {
      for (let j = i+1; j < Math.min(i+8, items.length); j++) {
        const match = items[j].text.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
        if (match) return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`;
      }
    }
  }
  for (const item of items) {
    const match = item.text.match(/(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/);
    if (match && parseInt(match[3]) >= 2020 && parseInt(match[3]) <= 2030) {
      return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`;
    }
  }
  return null;
}

function extractMarkersFromPDFText(items) {
  const sorted = [...items].sort((a, b) => {
    const dy = b.y - a.y;
    return Math.abs(dy) > 3 ? dy : a.x - b.x;
  });
  const rows = [];
  let currentRow = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (Math.abs(sorted[i].y - currentRow[0].y) < 3) {
      currentRow.push(sorted[i]);
    } else {
      rows.push(currentRow.sort((a, b) => a.x - b.x));
      currentRow = [sorted[i]];
    }
  }
  if (currentRow.length > 0) rows.push(currentRow.sort((a, b) => a.x - b.x));
  const markers = [];
  for (const row of rows) {
    const parsed = parseDataRow(row);
    if (parsed) markers.push(parsed);
  }
  return markers;
}

const SPADIA_SECTION_HEADERS = ['biochemie','lipidy','hematologie','hormony','elektrolyty','miner\u00e1ly',
  'imunologie','koagulace','s\u00e9rologie','n\u00e1dorov\u00e9','thyreoidea','metabolismus','speci\u00e1ln\u00ed',
  'krevn\u00ed','diferenci\u00e1l','mast','vitaminy','proteiny'];

function parseDataRow(row) {
  let texts = row.map(r => r.text).filter(t => t.trim());
  if (texts.length < 2) return null;
  const fullText = texts.join(' ');
  if (/^(Vy\u0161et\u0159en\u00ed|V\u00fdsledek|Jednotky|Referen\u010dn\u00ed|Laborato|Strana|Datum|Pacient|Rod\.|Poji\u0161t|SPADIA|Zpracoval|Telefon|www\.|Identif|Materi\u00e1l)/i.test(fullText)) return null;
  // Skip urine tests (material code U anywhere in row)
  if (texts.some(t => t.trim() === 'U')) return null;
  // Remove standalone material codes (S=serum, B=blood, P=plasma), flag codes, and section headers
  texts = texts.filter(t => {
    const s = t.trim();
    if (/^[SBP]$/.test(s)) return false;
    if (/^[SBP]\//.test(s)) return false; // S/xxx, B/xxx
    if (/^[01]$/.test(s)) return false; // Standalone 0/1 are pathological flags, not values
    if (/^\*+$/.test(s) || s === '!' || s === 'H' || s === 'L') return false; // Flag indicators
    if (/^\d{7,}$/.test(s)) return false; // Patient IDs, barcodes (7+ digit numbers)
    if (SPADIA_SECTION_HEADERS.some(h => s.toLowerCase() === h || s.toLowerCase().startsWith(h))) return false;
    return true;
  });
  if (texts.length < 2) return null;
  let valueIdx = -1, valueStr = '';
  for (let i = 0; i < texts.length; i++) {
    const cleaned = texts[i].replace(',', '.').replace(/^[<>]\s*/, '').trim();
    if (/^\d+\.?\d*$/.test(cleaned) && i > 0) { valueIdx = i; valueStr = texts[i]; break; }
  }
  if (valueIdx < 1) return null;
  let name = texts.slice(0, valueIdx).join(' ').trim();
  // Strip any remaining material code prefixes from the name
  name = name.replace(/^[SBP]\s+/, '').trim();
  if (!name || name.length < 2) return null;
  let value = parseFloat(valueStr.replace(',', '.').replace(/^[<>]\s*/, ''));
  if (isNaN(value)) return null;
  const restText = texts.slice(valueIdx + 1).join(' ');
  const refMatch = restText.match(/(\d+[.,]?\d*)\s*-\s*(\d+[.,]?\d*)/);
  let refMin = null, refMax = null;
  if (refMatch) {
    refMin = parseFloat(refMatch[1].replace(',', '.'));
    refMax = parseFloat(refMatch[2].replace(',', '.'));
  }
  // Name lookup: try exact, then case-insensitive, then fuzzy (best match)
  let mappedKey = SPADIA_NAME_MAP[name];
  if (!mappedKey) {
    // Try case-insensitive exact match
    const nameLower = name.toLowerCase();
    for (const [mapName, mapKey] of Object.entries(SPADIA_NAME_MAP)) {
      if (nameLower === mapName.toLowerCase()) { mappedKey = mapKey; break; }
    }
  }
  if (!mappedKey) {
    // Try prefix/suffix match — require min 3 chars on both sides, prefer longest match
    const nameLower = name.toLowerCase();
    let bestMatch = null, bestLen = 0;
    for (const [mapName, mapKey] of Object.entries(SPADIA_NAME_MAP)) {
      const ml = mapName.toLowerCase();
      if (ml.length < 3 || nameLower.length < 3) continue;
      if ((nameLower.startsWith(ml) || ml.startsWith(nameLower) ||
           nameLower.endsWith(ml) || ml.endsWith(nameLower)) &&
          mapName.length > bestLen) {
        bestMatch = mapKey;
        bestLen = mapName.length;
      }
    }
    if (bestMatch) mappedKey = bestMatch;
  }
  if (!mappedKey) {
    // Try stripping common prefixes/suffixes and re-match
    const cleaned = name.replace(/^(S|B|P|celk\.|celkov[ýá])\s*/i, '').replace(/\s*(celk\.|celkov[ýá]|abs\.)$/i, '').trim();
    if (cleaned !== name && cleaned.length >= 2) {
      mappedKey = SPADIA_NAME_MAP[cleaned];
      if (!mappedKey) {
        for (const [mapName, mapKey] of Object.entries(SPADIA_NAME_MAP)) {
          if (cleaned.toLowerCase() === mapName.toLowerCase()) { mappedKey = mapKey; break; }
        }
      }
    }
  }
  // Cross-validate: if we matched and have both extracted and schema ref ranges, reject gross mismatches
  if (mappedKey && refMin !== null && refMax !== null) {
    const [catKey, markerKey] = mappedKey.split('.');
    const schema = MARKER_SCHEMA[catKey] && MARKER_SCHEMA[catKey].markers[markerKey];
    if (schema && schema.refMin !== undefined && schema.refMax !== undefined) {
      const schemaMid = (schema.refMin + schema.refMax) / 2;
      const extractedMid = (refMin + refMax) / 2;
      const schemaSpan = schema.refMax - schema.refMin;
      // If midpoints differ by more than 10x the schema span, it's likely a wrong match
      if (schemaSpan > 0 && Math.abs(schemaMid - extractedMid) > schemaSpan * 10) {
        mappedKey = null;
      }
    }
  }
  return { rawName: name, value, refMin, refMax, mappedKey, matched: !!mappedKey };
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
  const unmatched = markers.filter(m => !m.matched);
  let html = `<button class="modal-close" onclick="closeImportModal()">&times;</button>
    <h3>Import Preview</h3>
    <p style="color:var(--text-secondary);margin-bottom:16px">
      File: ${fileName}<br>Collection Date: <strong>${dateFormatted}</strong><br>
      Matched: <span style="color:var(--green)">${matched.length}</span> \u00b7
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
  for (const m of unmatched) {
    html += `<tr><td class="unmatched">? Unmatched</td><td>${m.rawName}</td>
      <td>${m.value}</td><td>\u2014</td></tr>`;
  }
  html += `</tbody></table>`;
  html += `<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px">
    <button class="import-btn import-btn-secondary" onclick="closeImportModal()">Cancel</button>
    <button class="import-btn import-btn-primary" onclick="confirmImport()">Import ${matched.length} Markers</button></div>`;
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
  if (matched.length === 0) { showNotification("No matched markers to import", "error"); closeImportModal(); return; }
  const entry = { date: result.date, markers: {} };
  for (const m of matched) entry.markers[m.mappedKey] = m.value;
  if (entry.markers["hormones.insulin"] !== undefined) entry.markers["diabetes.insulin_d"] = entry.markers["hormones.insulin"];
  if (!importedData.entries) importedData.entries = [];
  importedData.entries = importedData.entries.filter(e => e.date !== result.date);
  importedData.entries.push(entry);
  recalculateHOMAIR(entry);
  localStorage.setItem('labcharts-imported', JSON.stringify(importedData));
  closeImportModal();
  buildSidebar();
  updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Imported ${matched.length} markers from ${result.date}`, "success");
}

function removeImportedEntry(date) {
  if (!importedData.entries) return;
  importedData.entries = importedData.entries.filter(e => e.date !== date);
  localStorage.setItem('labcharts-imported', JSON.stringify(importedData));
  buildSidebar();
  updateHeaderDates();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Removed imported data from ${date}`, "info");
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

async function handlePDFFile(file) {
  try {
    showNotification("Parsing PDF...", "info");
    const result = await parseSpadiaPDF(file);
    if (!result.date) { showNotification("Could not find collection date in PDF", "error"); return; }
    if (result.markers.length === 0) { showNotification("No biomarkers found in PDF", "error"); return; }
    showImportPreview(result);
  } catch (err) {
    console.error("PDF parse error:", err);
    showNotification("Error parsing PDF: " + err.message, "error");
  }
}

// ═══════════════════════════════════════════════
// JSON EXPORT / IMPORT
// ═══════════════════════════════════════════════
function exportDataJSON() {
  const entries = (importedData && importedData.entries) ? importedData.entries : [];
  if (entries.length === 0) { showNotification("No data to export", "error"); return; }
  const exportObj = { version: 1, exportedAt: new Date().toISOString(), entries };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `labcharts-export-${new Date().toISOString().slice(0, 10)}.json`;
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
      if (count === 0) { showNotification('No valid entries found in JSON', 'error'); return; }
      localStorage.setItem('labcharts-imported', JSON.stringify(importedData));
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
  importedData = { entries: [] };
  localStorage.removeItem('labcharts-imported');
  buildSidebar();
  updateHeaderDates();
  navigate('dashboard');
  showNotification('All data cleared', 'info');
}
