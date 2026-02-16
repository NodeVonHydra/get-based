// ═══════════════════════════════════════════════
// MARKER SCHEMA (no personal data — just biomarker definitions)
// ═══════════════════════════════════════════════
const MARKER_SCHEMA = {
  biochemistry: {
    label: "Biochemistry", icon: "\u{1F9EA}",
    markers: {
      glucose: { name: "Glucose (Gluk\u00f3za)", unit: "mmol/l", refMin: 4.11, refMax: 5.60, desc: "Measures blood sugar level; the primary marker for diagnosing and monitoring diabetes and metabolic health." },
      urea: { name: "Urea", unit: "mmol/l", refMin: 2.8, refMax: 8.3, desc: "A waste product of protein metabolism filtered by the kidneys; elevated levels suggest impaired kidney function or dehydration." },
      creatinine: { name: "Creatinine (Kreatinin)", unit: "\u00b5mol/l", refMin: 62, refMax: 106, refMin_f: 44, refMax_f: 80, desc: "A muscle metabolism byproduct cleared by the kidneys; used to estimate kidney filtration rate and detect renal dysfunction." },
      egfr: { name: "eGFR (CKD-EPI)", unit: "ml/s/1.73m\u00b2", refMin: 1.00, refMax: 2.30, desc: "Estimates how well the kidneys filter waste from blood; the standard measure for staging chronic kidney disease." },
      uricAcid: { name: "Uric Acid (Kyselina mo\u010dov\u00e1)", unit: "\u00b5mol/l", refMin: 202, refMax: 417, refMin_f: 143, refMax_f: 339, desc: "End product of purine metabolism; high levels cause gout and are linked to kidney stones and cardiovascular risk." },
      bilirubinTotal: { name: "Bilirubin Total", unit: "\u00b5mol/l", refMin: 3.0, refMax: 24.0, desc: "A yellow pigment from red blood cell breakdown processed by the liver; elevated levels indicate liver disease or hemolysis." },
      ast: { name: "AST", unit: "\u00b5kat/l", refMin: 0.17, refMax: 0.85, desc: "A liver and muscle enzyme released during cell damage; elevated in liver disease, heart attack, or muscle injury." },
      alt: { name: "ALT", unit: "\u00b5kat/l", refMin: 0.17, refMax: 0.83, desc: "A liver-specific enzyme; the most sensitive marker for liver cell damage from hepatitis, fatty liver, or toxins." },
      alp: { name: "ALP", unit: "\u00b5kat/l", refMin: 0.67, refMax: 2.15, desc: "An enzyme found in liver and bone; elevated levels suggest bile duct obstruction, bone disorders, or liver disease." },
      ggt: { name: "GGT", unit: "\u00b5kat/l", refMin: 0.17, refMax: 1.19, desc: "A liver enzyme sensitive to alcohol and bile duct damage; often the earliest marker of liver stress." },
      ldh: { name: "LDH", unit: "\u00b5kat/l", refMin: 2.25, refMax: 3.75, desc: "A general tissue damage marker found in most organs; elevated in hemolysis, liver disease, heart attack, or cancer." },
      creatineKinase: { name: "Creatine Kinase", unit: "\u00b5kat/l", refMin: 0.65, refMax: 5.14, refMin_f: 0.42, refMax_f: 3.08, desc: "An enzyme released from damaged muscle tissue; elevated after intense exercise, muscle injury, or in myopathy." },
      cystatinC: { name: "Cystatin C", unit: "mg/l", refMin: 0.61, refMax: 0.95, desc: "A protein filtered by the kidneys; a more accurate kidney function marker than creatinine, unaffected by muscle mass." },
      gfrCystatin: { name: "GFR Cystatin", unit: "ml/s", refMin: 1.80, refMax: 2.63, desc: "Kidney filtration rate estimated from cystatin C; provides a muscle-mass-independent assessment of renal function." }
    }
  },
  hormones: {
    label: "Hormones", icon: "\u26A1",
    markers: {
      testosterone: { name: "Testosterone", unit: "nmol/l", refMin: 8.64, refMax: 29.00, refMin_f: 0.29, refMax_f: 1.67, desc: "The primary male sex hormone; critical for muscle mass, bone density, libido, and mood in both sexes." },
      freeTestosterone: { name: "Free Testosterone", unit: "pmol/l", refMin: 30.70, refMax: 161.70, refMin_f: 0.30, refMax_f: 10.40, desc: "The unbound, biologically active fraction of testosterone; a better indicator of androgen status than total testosterone." },
      shbg: { name: "SHBG", unit: "nmol/l", refMin: 14.5, refMax: 54.1, refMin_f: 26.1, refMax_f: 110.0, desc: "A protein that binds sex hormones and regulates their availability; high levels reduce free testosterone." },
      dheaS: { name: "DHEA-S", unit: "\u00b5mol/l", refMin: 2.41, refMax: 11.60, refMin_f: 1.77, refMax_f: 9.22, desc: "An adrenal hormone precursor to testosterone and estrogen; declines with age and reflects adrenal function." },
      fai: { name: "Free Androgen Index", unit: "%", refMin: 34.0, refMax: 106.0, refMin_f: 0.5, refMax_f: 6.9, desc: "Ratio of total testosterone to SHBG; estimates bioavailable androgen activity, useful for detecting hormonal imbalances." },
      estradiol: { name: "Estradiol", unit: "pmol/l", refMin: 41.4, refMax: 159.0, refMin_f: 45.4, refMax_f: 854.0, desc: "The primary estrogen hormone; essential for bone health, cardiovascular protection, and reproductive function." },
      progesterone: { name: "Progesterone", unit: "nmol/l", refMin: 0.159, refMax: 0.474, refMin_f: 0.181, refMax_f: 27.0, desc: "A hormone supporting pregnancy and menstrual cycle regulation; also has neuroprotective and calming effects." },
      calcitonin: { name: "Calcitonin", unit: "ng/l", refMin: 1.0, refMax: 11.8, refMin_f: 1.0, refMax_f: 4.6, desc: "A thyroid hormone that lowers blood calcium; used as a tumor marker for medullary thyroid carcinoma." },
      dht: { name: "DHT", unit: "nmol/l", refMin: 0.86, refMax: 3.40, refMin_f: 0.12, refMax_f: 0.86, desc: "A potent androgen converted from testosterone; drives male-pattern hair loss and prostate growth." },
      igf1: { name: "IGF-1", unit: "\u00b5g/l", refMin: 96.4, refMax: 227.8, desc: "A growth-factor hormone mediating the effects of growth hormone; reflects GH status and influences tissue repair." },
      insulin: { name: "Insulin", unit: "mU/l", refMin: 2.6, refMax: 24.9, desc: "The hormone regulating blood sugar uptake into cells; elevated fasting levels indicate insulin resistance." }
    }
  },
  electrolytes: {
    label: "Electrolytes & Minerals", icon: "\u2699\uFE0F",
    markers: {
      sodium: { name: "Sodium", unit: "mmol/l", refMin: 136, refMax: 145, desc: "The main extracellular electrolyte controlling fluid balance and blood pressure; abnormal levels affect nerve and muscle function." },
      potassium: { name: "Potassium", unit: "mmol/l", refMin: 3.5, refMax: 5.1, desc: "A critical intracellular electrolyte regulating heart rhythm and muscle contraction; abnormal levels can be life-threatening." },
      chloride: { name: "Chloride", unit: "mmol/l", refMin: 97, refMax: 108, desc: "An electrolyte that maintains fluid balance and acid-base status; usually changes in parallel with sodium." },
      calciumTotal: { name: "Calcium Total", unit: "mmol/l", refMin: 2.15, refMax: 2.50, desc: "Essential for bone strength, nerve signaling, and muscle contraction; regulated by parathyroid hormone and vitamin D." },
      phosphorus: { name: "Phosphorus", unit: "mmol/l", refMin: 0.81, refMax: 1.45, desc: "Works with calcium for bone mineralization and energy metabolism; imbalances affect bone health and kidney function." },
      magnesium: { name: "Magnesium (serum)", unit: "mmol/l", refMin: 0.66, refMax: 1.07, desc: "A cofactor in 300+ enzymatic reactions including energy production and nerve function; deficiency is common and underdiagnosed." },
      magnesiumRBC: { name: "Magnesium RBC", unit: "mmol/l", refMin: 1.44, refMax: 2.60, desc: "Intracellular magnesium level; a more accurate measure of true magnesium status than serum, which reflects only 1% of body stores." },
      copper: { name: "Copper", unit: "\u00b5mol/l", refMin: 11.6, refMax: 20.6, desc: "A trace mineral essential for iron metabolism, connective tissue, and antioxidant defense; excess is toxic to the liver." },
      zinc: { name: "Zinc", unit: "\u00b5mol/l", refMin: 9.8, refMax: 18.0, desc: "A trace mineral vital for immune function, wound healing, and testosterone production; deficiency impairs taste and immunity." }
    }
  },
  lipids: {
    label: "Lipid Panel", icon: "\uD83D\uDCA7",
    markers: {
      cholesterol: { name: "Total Cholesterol", unit: "mmol/l", refMin: 2.90, refMax: 5.00, desc: "The sum of all cholesterol fractions in blood; a basic cardiovascular risk indicator, though HDL/LDL ratio matters more." },
      triglycerides: { name: "Triglycerides", unit: "mmol/l", refMin: 0.45, refMax: 1.70, desc: "Blood fats from dietary intake and liver production; elevated levels increase cardiovascular and pancreatitis risk." },
      hdl: { name: "HDL Cholesterol", unit: "mmol/l", refMin: 1.00, refMax: 2.10, desc: "Protective cholesterol that transports fat away from arteries back to the liver; higher levels reduce cardiovascular risk." },
      ldl: { name: "LDL Cholesterol", unit: "mmol/l", refMin: 1.20, refMax: 3.00, desc: "The primary atherogenic cholesterol that deposits in artery walls; the main target for cardiovascular risk reduction." },
      nonHdl: { name: "Non-HDL Cholesterol", unit: "mmol/l", refMin: 0.00, refMax: 3.80, desc: "All atherogenic cholesterol particles combined (LDL + VLDL + remnants); a better cardiovascular predictor than LDL alone." },
      cholHdlRatio: { name: "Chol/HDL Ratio", unit: "", refMin: 0.0, refMax: 5.0, desc: "Total cholesterol divided by HDL; a simple cardiovascular risk ratio where lower values indicate better lipid balance." },
      apoAI: { name: "Apo A-I", unit: "g/l", refMin: 1.00, refMax: 1.70, desc: "The main protein of HDL particles; reflects protective cholesterol transport capacity and cardiovascular health." },
      apoB: { name: "Apo B", unit: "g/l", refMin: 0.50, refMax: 1.00, desc: "The protein on each LDL particle; directly counts atherogenic particles, making it a superior cardiovascular risk marker." }
    }
  },
  iron: {
    label: "Iron Metabolism", icon: "\uD83D\uDD34",
    markers: {
      iron: { name: "Iron", unit: "\u00b5mol/l", refMin: 5.8, refMax: 34.5, refMin_f: 6.6, refMax_f: 26.0, desc: "Serum iron level reflecting current iron availability; fluctuates with meals and inflammation, best interpreted with ferritin." },
      ferritin: { name: "Ferritin", unit: "\u00b5g/l", refMin: 30, refMax: 400, refMin_f: 13, refMax_f: 150, desc: "The primary iron storage protein; the most reliable marker for total body iron stores, though elevated by inflammation." },
      transferrin: { name: "Transferrin", unit: "g/l", refMin: 2.0, refMax: 3.6, desc: "The iron transport protein in blood; rises when iron stores are low as the body tries to capture more iron." },
      tibc: { name: "TIBC", unit: "\u00b5mol/l", refMin: 22.3, refMax: 61.7, desc: "Total iron-binding capacity of transferrin; high values suggest iron deficiency, low values suggest iron overload." },
      transferrinSat: { name: "Transferrin Sat.", unit: "%", refMin: 16.0, refMax: 45.0, desc: "Percentage of transferrin loaded with iron; low values confirm iron deficiency, high values suggest overload risk." }
    }
  },
  proteins: {
    label: "Proteins & Inflammation", icon: "\uD83D\uDEE1\uFE0F",
    markers: {
      hsCRP: { name: "hs-CRP", unit: "mg/l", refMin: 0.00, refMax: 3.00, desc: "High-sensitivity C-reactive protein; a key marker of systemic inflammation and independent predictor of cardiovascular events." },
      totalProtein: { name: "Total Protein", unit: "g/l", refMin: 64.0, refMax: 83.0, desc: "Sum of albumin and globulins in blood; reflects nutritional status, liver function, and immune system activity." },
      albumin: { name: "Albumin", unit: "g/l", refMin: 35.0, refMax: 52.0, desc: "The most abundant blood protein made by the liver; low levels indicate malnutrition, liver disease, or chronic inflammation." },
      ceruloplasmin: { name: "Ceruloplasmin", unit: "g/l", refMin: 0.15, refMax: 0.30, desc: "A copper-carrying protein produced by the liver; low levels suggest Wilson disease, high levels indicate inflammation." }
    }
  },
  thyroid: {
    label: "Thyroid", icon: "\uD83E\uDD8B",
    markers: {
      tsh: { name: "TSH", unit: "mU/l", refMin: 0.270, refMax: 4.200, desc: "Thyroid-stimulating hormone from the pituitary; the primary screening test for thyroid dysfunction (hypo- or hyperthyroidism)." },
      ft4: { name: "Free T4", unit: "pmol/l", refMin: 11.9, refMax: 21.6, desc: "The unbound, active form of thyroxine; reflects actual thyroid hormone available to tissues for metabolism regulation." },
      ft3: { name: "Free T3", unit: "pmol/l", refMin: 3.1, refMax: 6.8, desc: "The most metabolically active thyroid hormone; low levels despite normal T4 may indicate poor T4-to-T3 conversion." },
      t4total: { name: "Total T4", unit: "nmol/l", refMin: 66.0, refMax: 181.0, desc: "Total thyroxine including protein-bound fraction; affected by binding protein levels, making free T4 more reliable." },
      t3total: { name: "Total T3", unit: "nmol/l", refMin: 1.30, refMax: 3.10, desc: "Total triiodothyronine including bound fraction; useful for diagnosing hyperthyroidism when free T3 is unavailable." }
    }
  },
  vitamins: {
    label: "Vitamins", icon: "\u2600\uFE0F",
    markers: {
      vitaminD: { name: "Vitamin D Total", unit: "nmol/l", refMin: 75.0, refMax: 250.0, desc: "Sum of D2 and D3 forms; essential for calcium absorption, bone health, immune function, and mood regulation." },
      vitaminD3: { name: "Vitamin D3", unit: "nmol/l", refMin: 50.0, refMax: 175.0, desc: "The form of vitamin D produced by sun exposure and supplements; the most bioactive and clinically relevant form." },
      vitaminA: { name: "Vitamin A", unit: "\u00b5mol/l", refMin: 1.05, refMax: 2.80, desc: "A fat-soluble vitamin essential for vision, immune defense, and cell growth; both deficiency and excess are harmful." }
    }
  },
  diabetes: {
    label: "Diabetes / Glucose", icon: "\uD83D\uDCCA",
    markers: {
      hba1c: { name: "HbA1c", unit: "mmol/mol", refMin: 20.0, refMax: 42.0, desc: "Glycated hemoglobin reflecting average blood sugar over 2\u20133 months; the gold standard for long-term glucose control." },
      insulin_d: { name: "Insulin", unit: "mU/l", refMin: 2.6, refMax: 24.9, desc: "Fasting insulin level used in the diabetes context; elevated levels are an early sign of insulin resistance." },
      homaIR: { name: "HOMA-IR (calc)", unit: "", refMin: 0, refMax: 2.5, desc: "Calculated index of insulin resistance from fasting glucose and insulin; higher values indicate greater resistance." }
    }
  },
  tumorMarkers: {
    label: "Tumor Markers", icon: "\uD83D\uDD2C",
    markers: {
      psa: { name: "PSA", unit: "\u00b5g/l", refMin: 0.003, refMax: 1.400, desc: "Prostate-specific antigen; used to screen for prostate cancer and monitor treatment, though also elevated in benign conditions." }
    }
  },
  coagulation: {
    label: "Coagulation", icon: "\uD83E\uDE78",
    markers: {
      homocysteine: { name: "Homocysteine", unit: "\u00b5mol/l", refMin: 5.2, refMax: 15.0, refMin_f: 3.7, refMax_f: 10.4, desc: "An amino acid linked to cardiovascular and neurological risk when elevated; lowered by folate, B6, and B12." }
    }
  },
  hematology: {
    label: "Hematology (CBC)", icon: "\uD83E\uDDE0",
    markers: {
      wbc: { name: "WBC", unit: "10^9/l", refMin: 4.00, refMax: 10.00, desc: "White blood cell count; the primary measure of immune system activity, elevated in infection and inflammation." },
      rbc: { name: "RBC", unit: "10^12/l", refMin: 4.00, refMax: 5.80, refMin_f: 3.80, refMax_f: 5.20, desc: "Red blood cell count; reflects oxygen-carrying capacity, with low values indicating anemia and high values polycythemia." },
      hemoglobin: { name: "Hemoglobin", unit: "g/l", refMin: 135, refMax: 175, refMin_f: 120, refMax_f: 160, desc: "The oxygen-carrying protein in red blood cells; the definitive marker for diagnosing anemia or polycythemia." },
      hematocrit: { name: "Hematocrit", unit: "", refMin: 0.400, refMax: 0.500, refMin_f: 0.350, refMax_f: 0.450, desc: "The percentage of blood volume occupied by red blood cells; affected by hydration status, anemia, and altitude." },
      mcv: { name: "MCV", unit: "fl", refMin: 82.0, refMax: 98.0, desc: "Average red blood cell size; helps classify anemia as microcytic (iron deficiency) or macrocytic (B12/folate deficiency)." },
      mch: { name: "MCH", unit: "pg", refMin: 28.0, refMax: 34.0, desc: "Average hemoglobin content per red blood cell; low values suggest iron deficiency, high values suggest B12 deficiency." },
      mchc: { name: "MCHC", unit: "g/l", refMin: 320, refMax: 360, desc: "Average hemoglobin concentration in red blood cells; helps differentiate types of anemia and detect spherocytosis." },
      rdwcv: { name: "RDW-CV", unit: "%", refMin: 10.0, refMax: 15.2, desc: "Variation in red blood cell size; elevated values suggest mixed nutritional deficiencies or early iron deficiency." },
      platelets: { name: "Platelets", unit: "10^9/l", refMin: 150, refMax: 400, desc: "Blood cells essential for clotting; low counts risk bleeding, high counts risk clotting or indicate inflammation." },
      mpv: { name: "MPV", unit: "fl", refMin: 7.8, refMax: 12.8, desc: "Average platelet size; larger platelets are more reactive, and elevated MPV is linked to cardiovascular risk." },
      pdw: { name: "PDW", unit: "fl", refMin: 9.0, refMax: 17.0, desc: "Variation in platelet size; elevated values suggest active platelet production or consumption in clotting disorders." }
    }
  },
  differential: {
    label: "WBC Differential", icon: "\uD83E\uDDEB",
    markers: {
      neutrophils: { name: "Neutrophils #", unit: "10^9/l", refMin: 2.0, refMax: 7.0, desc: "The most abundant white blood cells; the first responders to bacterial infection, elevated in acute inflammation." },
      lymphocytes: { name: "Lymphocytes #", unit: "10^9/l", refMin: 0.8, refMax: 4.0, desc: "Immune cells (T-cells, B-cells, NK cells) driving adaptive immunity; elevated in viral infections, low in immunodeficiency." },
      monocytes: { name: "Monocytes #", unit: "10^9/l", refMin: 0.08, refMax: 1.20, desc: "White blood cells that become macrophages in tissues; elevated in chronic infections, autoimmune diseases, and recovery." },
      eosinophils: { name: "Eosinophils #", unit: "10^9/l", refMin: 0.0, refMax: 0.5, desc: "White blood cells that fight parasites and mediate allergic responses; elevated in allergies, asthma, and parasitic infections." },
      basophils: { name: "Basophils #", unit: "10^9/l", refMin: 0.0, refMax: 0.2, desc: "The rarest white blood cells involved in allergic reactions and histamine release; markedly elevated in some blood cancers." },
      neutrophilsPct: { name: "Neutrophils %", unit: "", refMin: 0.45, refMax: 0.70, desc: "Proportion of white blood cells that are neutrophils; shifts in percentage help distinguish bacterial from viral infections." },
      lymphocytesPct: { name: "Lymphocytes %", unit: "", refMin: 0.20, refMax: 0.45, desc: "Proportion of white blood cells that are lymphocytes; relatively elevated in viral infections and lymphoproliferative disorders." },
      monocytesPct: { name: "Monocytes %", unit: "", refMin: 0.02, refMax: 0.12, desc: "Proportion of white blood cells that are monocytes; elevated in chronic inflammation, tuberculosis, and recovery phases." }
    }
  },
  fattyAcids: {
    label: "Fatty Acids", icon: "\uD83D\uDC1F", singlePoint: true,
    markers: {
      palmiticC16: { name: "Palmitic Acid C16:0", unit: "%", refMin: 28.1, refMax: 30.1, desc: "The most common saturated fatty acid; elevated levels are associated with increased cardiovascular and metabolic risk." },
      stearicC18: { name: "Stearic Acid C18:0", unit: "%", refMin: 12.5, refMax: 13.8, desc: "A long-chain saturated fatty acid with neutral cardiovascular effects; partially converts to oleic acid in the body." },
      oleicC18_1: { name: "Oleic Acid C18:1", unit: "%", refMin: 20.9, refMax: 23.4, desc: "The main monounsaturated omega-9 fatty acid (olive oil); associated with cardiovascular protection and anti-inflammatory effects." },
      linoleicC18_2: { name: "Linoleic Acid C18:2", unit: "%", refMin: 18.4, refMax: 21.3, desc: "An essential omega-6 fatty acid from dietary sources; needed for cell membranes but excess may promote inflammation." },
      glaC18_3: { name: "GLA C18:3", unit: "%", refMin: 0.11, refMax: 0.22, desc: "Gamma-linolenic acid, an omega-6 with anti-inflammatory properties; paradoxically reduces inflammation despite being omega-6." },
      arachidonicC20_4: { name: "Arachidonic C20:4", unit: "%", refMin: 5.50, refMax: 8.50, desc: "A key omega-6 fatty acid and precursor to inflammatory prostaglandins; its ratio to EPA reflects inflammatory balance." },
      dglaC20_3: { name: "DGLA C20:3", unit: "%", refMin: 0.91, refMax: 1.16, desc: "An omega-6 fatty acid that produces anti-inflammatory mediators; competes with arachidonic acid to reduce inflammation." },
      alaC18_3: { name: "ALA C18:3", unit: "%", refMin: 0.58, refMax: 0.89, desc: "An essential omega-3 from plant sources (flax, chia); converts poorly to EPA/DHA but has independent cardiovascular benefits." },
      epaC20_5: { name: "EPA C20:5", unit: "%", refMin: 3.23, refMax: 4.72, desc: "A marine omega-3 fatty acid with potent anti-inflammatory effects; lowers triglycerides and reduces cardiovascular risk." },
      dpaC22_5: { name: "DPA C22:5", unit: "%", refMin: 1.95, refMax: 2.36, desc: "An intermediate omega-3 between EPA and DHA; contributes to anti-inflammatory and cardiovascular protective effects." },
      dhaC22_6: { name: "DHA C22:6", unit: "%", refMin: 3.95, refMax: 4.64, desc: "A marine omega-3 critical for brain and retinal structure; essential for cognitive function and neurodevelopment." },
      omega3Index: { name: "Omega-3 Index", unit: "%", refMin: 8.0, refMax: 12.0, desc: "EPA + DHA as percentage of red blood cell membranes; values above 8% are associated with lowest cardiovascular risk." },
      omega6to3Ratio: { name: "Omega-6/3 Ratio", unit: "", refMin: 1.0, refMax: 4.0, desc: "Balance between pro-inflammatory omega-6 and anti-inflammatory omega-3 fats; lower ratios indicate less systemic inflammation." },
      membraneFluidity: { name: "Membrane Fluidity", unit: "", refMin: 1.0, refMax: 4.0, desc: "Index of cell membrane flexibility based on fatty acid composition; optimal fluidity supports nutrient transport and cell signaling." },
      mentalResilience: { name: "Mental Resilience Idx", unit: "", refMin: 0.5, refMax: 1.0, desc: "Composite index derived from omega-3 levels reflecting neuronal membrane health and cognitive stress resilience." }
    }
  },
  boneMetabolism: {
    label: "Bone Metabolism", icon: "\uD83E\uDDB4",
    markers: {
      osteocalcin: { name: "Osteocalcin", unit: "\u00b5g/l", refMin: 14.0, refMax: 42.0, desc: "A protein secreted by bone-forming cells; reflects bone turnover rate and also influences glucose metabolism." }
    }
  },
  calculatedRatios: {
    label: "Calculated Ratios", icon: "\uD83D\uDCD0", calculated: true,
    markers: {
      tgHdlRatio: { name: "TG/HDL Ratio", unit: "", refMin: 0, refMax: 1.75, desc: "Triglycerides divided by HDL; a strong surrogate marker for insulin resistance and small dense LDL particles." },
      ldlHdlRatio: { name: "LDL/HDL Ratio", unit: "", refMin: 0, refMax: 2.5, refMax_f: 2.0, desc: "Balance of atherogenic to protective cholesterol; a simple predictor of coronary heart disease risk." },
      apoBapoAIRatio: { name: "ApoB/ApoA-I Ratio", unit: "", refMin: 0, refMax: 0.9, refMax_f: 0.8, desc: "Ratio of atherogenic to protective lipoprotein particles; considered the best single lipid marker for cardiovascular risk." },
      nlr: { name: "Neutrophil-Lymphocyte Ratio (NLR)", unit: "", refMin: 1.0, refMax: 3.0, desc: "A marker of systemic inflammation and immune stress; elevated in infections, chronic inflammation, and cancer prognosis." },
      plr: { name: "Platelet-Lymphocyte Ratio (PLR)", unit: "", refMin: 50, refMax: 150, desc: "Reflects the balance between thrombotic and immune responses; elevated in inflammation, cardiovascular disease, and cancer." },
      deRitisRatio: { name: "De Ritis Ratio (AST/ALT)", unit: "", refMin: 0.8, refMax: 1.2, desc: "AST divided by ALT; helps distinguish liver damage types \u2014 values above 2 suggest alcoholic liver disease or cirrhosis." },
      copperZincRatio: { name: "Copper/Zinc Ratio", unit: "", refMin: 0.7, refMax: 1.0, desc: "Balance between copper and zinc; elevated ratios indicate oxidative stress, inflammation, or immune dysfunction." },
      freeWaterDeficit: { name: "Free Water Deficit", unit: "L", refMin: -1.5, refMax: 1.5, desc: "Estimated water surplus or deficit based on sodium level; positive values indicate dehydration, negative values overhydration." },
      phenoAge: { name: "PhenoAge (Biological Age)", unit: "years", refMin: null, refMax: null, desc: "Biological age estimated from 9 blood biomarkers using the Levine formula; lower than chronological age suggests healthier aging." }
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

// Optimal ranges — evidence-based "ideal" bands from mortality meta-analyses,
// longevity research (Attia, Patrick, Levine), and functional medicine (Weatherby/OptimalDX).
// Sources: CKD Prognosis Consortium, ASH/Blood 2015, Harris & von Schacky 2004,
// Lancet non-HDL pooled analysis, PMC8844108 (IGF-1), PMC10324141 (sodium),
// PMC10866328 (thyroid/CVD), PMC11078084 (albumin), Gilbert syndrome studies.
const OPTIMAL_RANGES = {
  // Biochemistry
  'biochemistry.glucose': { optimalMin: 4.0, optimalMax: 5.0 },
  'biochemistry.urea': { optimalMin: 4.6, optimalMax: 6.4 },
  'biochemistry.creatinine': { optimalMin: 75, optimalMax: 97, optimalMin_f: 57, optimalMax_f: 80 },
  'biochemistry.egfr': { optimalMin: 1.50, optimalMax: 2.30 },
  'biochemistry.bilirubinTotal': { optimalMin: 8.0, optimalMax: 17.0 },
  'biochemistry.ast': { optimalMin: 0.17, optimalMax: 0.58 },
  'biochemistry.alt': { optimalMin: 0.17, optimalMax: 0.42 },
  'biochemistry.ggt': { optimalMin: 0.17, optimalMax: 0.42 },
  'biochemistry.ldh': { optimalMin: 2.25, optimalMax: 3.00 },
  'biochemistry.uricAcid': { optimalMin: 200, optimalMax: 350 },
  'biochemistry.cystatinC': { optimalMin: 0.61, optimalMax: 0.82 },
  // Hormones
  'hormones.insulin': { optimalMin: 2.6, optimalMax: 10.0 },
  'hormones.testosterone': { optimalMin: 15.0, optimalMax: 25.0, optimalMin_f: 0.5, optimalMax_f: 1.2 },
  'hormones.freeTestosterone': { optimalMin: 70, optimalMax: 130 },
  'hormones.shbg': { optimalMin: 20.0, optimalMax: 40.0 },
  'hormones.dheaS': { optimalMin: 4.0, optimalMax: 9.0 },
  'hormones.estradiol': { optimalMin: 70, optimalMax: 130 },
  'hormones.igf1': { optimalMin: 120, optimalMax: 160 },
  // Electrolytes & Minerals
  'electrolytes.sodium': { optimalMin: 139, optimalMax: 142 },
  'electrolytes.potassium': { optimalMin: 4.0, optimalMax: 4.5 },
  'electrolytes.calciumTotal': { optimalMin: 2.20, optimalMax: 2.40 },
  'electrolytes.magnesium': { optimalMin: 0.85, optimalMax: 0.95 },
  // Iron
  'iron.iron': { optimalMin: 12.0, optimalMax: 25.0 },
  'iron.ferritin': { optimalMin: 40, optimalMax: 200 },
  'iron.transferrinSat': { optimalMin: 25.0, optimalMax: 35.0 },
  // Lipids
  'lipids.cholesterol': { optimalMin: 3.9, optimalMax: 5.2 },
  'lipids.triglycerides': { optimalMin: 0.45, optimalMax: 1.00 },
  'lipids.hdl': { optimalMin: 1.50, optimalMax: 2.10 },
  'lipids.ldl': { optimalMin: 1.20, optimalMax: 2.60 },
  'lipids.nonHdl': { optimalMin: 1.80, optimalMax: 2.60 },
  'lipids.apoB': { optimalMin: 0.40, optimalMax: 0.70 },
  'lipids.apoAI': { optimalMin: 1.40, optimalMax: 1.80 },
  // Proteins & Inflammation
  'proteins.hsCRP': { optimalMin: 0.00, optimalMax: 1.00 },
  'proteins.totalProtein': { optimalMin: 69.0, optimalMax: 74.0 },
  'proteins.albumin': { optimalMin: 42.0, optimalMax: 50.0 },
  'proteins.ceruloplasmin': { optimalMin: 0.20, optimalMax: 0.30 },
  // Thyroid
  'thyroid.tsh': { optimalMin: 1.0, optimalMax: 2.5 },
  'thyroid.ft3': { optimalMin: 4.6, optimalMax: 6.0 },
  'thyroid.ft4': { optimalMin: 14.0, optimalMax: 17.0 },
  // Vitamins
  'vitamins.vitaminD': { optimalMin: 100.0, optimalMax: 200.0 },
  'vitamins.vitaminA': { optimalMin: 1.40, optimalMax: 2.10 },
  // Diabetes
  'diabetes.hba1c': { optimalMin: 20.0, optimalMax: 36.0 },
  'diabetes.insulin_d': { optimalMin: 2.6, optimalMax: 10.0 },
  'diabetes.homaIR': { optimalMin: 0, optimalMax: 1.5 },
  // Hematology
  'hematology.wbc': { optimalMin: 5.0, optimalMax: 7.0 },
  'hematology.rbc': { optimalMin: 4.4, optimalMax: 5.0, optimalMin_f: 4.0, optimalMax_f: 4.5 },
  'hematology.hemoglobin': { optimalMin: 140, optimalMax: 170, optimalMin_f: 125, optimalMax_f: 155 },
  'hematology.mcv': { optimalMin: 85.0, optimalMax: 92.0 },
  'hematology.rdwcv': { optimalMin: 11.5, optimalMax: 13.0 },
  'hematology.platelets': { optimalMin: 200, optimalMax: 300 },
  // WBC Differential
  'differential.neutrophils': { optimalMin: 2.0, optimalMax: 4.0 },
  'differential.lymphocytes': { optimalMin: 1.5, optimalMax: 3.0 },
  // Coagulation
  'coagulation.homocysteine': { optimalMin: 5.0, optimalMax: 8.0 },
  // Fatty Acids
  'fattyAcids.omega3Index': { optimalMin: 8.0, optimalMax: 12.0 }
};

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function hashString(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) hash = ((hash << 5) + hash) + str.charCodeAt(i);
  return (hash >>> 0).toString(36);
}

function getFocusCardFingerprint() {
  const parts = [
    JSON.stringify((importedData.entries || []).map(e => e.date + ':' + Object.keys(e.markers).length)),
    profileSex || '',
    profileDob || '',
    (importedData.diagnoses || '').slice(0, 100),
    (importedData.healthGoals || []).map(g => g.text).join(',')
  ];
  return hashString(parts.join('|'));
}

function getStatus(value, refMin, refMax) {
  if (value === null || value === undefined) return "missing";
  if (refMin == null && refMax == null) return "normal";
  if (refMin != null && value < refMin) return "low";
  if (refMax != null && value > refMax) return "high";
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
let importedData = { entries: [], notes: [], supplements: [], healthGoals: [], sleepCircadian: '', interpretiveLens: '', menstrualCycle: null };
let unitSystem = 'EU';
let selectedCorrelationMarkers = [];
let currentProfile = 'default';
let profileSex = null;
let profileDob = null;
let chatHistory = [];
let currentChatPersonality = 'default';
let dateRangeFilter = 'all';
let rangeMode = 'optimal';
let suppOverlayMode = 'off';
let noteOverlayMode = 'off';
let compareDate1 = null, compareDate2 = null;

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
  const currentTheme = getTheme();
  modal.innerHTML = `
    <button class="modal-close" onclick="closeSettingsModal()">&times;</button>
    <h3>Settings</h3>

    <div class="settings-section">
      <label class="settings-label">Sex</label>
      <div class="sex-toggle">
        <button class="sex-toggle-btn${profileSex === 'male' ? ' active' : ''}" data-sex="male" onclick="switchSex('male');updateSettingsUI()">&#9794;</button>
        <button class="sex-toggle-btn${profileSex === 'female' ? ' active' : ''}" data-sex="female" onclick="switchSex('female');updateSettingsUI()">&#9792;</button>
      </div>
    </div>

    <div class="settings-section">
      <label class="settings-label">Date of Birth</label>
      <div class="dob-input">
        <input type="date" id="dob-input" value="${profileDob || ''}" onchange="switchDob(this.value)">
      </div>
    </div>

    <div class="settings-section">
      <label class="settings-label">Unit System</label>
      <div class="unit-toggle">
        <button class="unit-toggle-btn${unitSystem === 'EU' ? ' active' : ''}" data-unit="EU" onclick="switchUnitSystem('EU');updateSettingsUI()">EU (SI)</button>
        <button class="unit-toggle-btn${unitSystem === 'US' ? ' active' : ''}" data-unit="US" onclick="switchUnitSystem('US');updateSettingsUI()">US</button>
      </div>
    </div>

    <div class="settings-section">
      <label class="settings-label">Range Display</label>
      <div class="range-toggle">
        <button class="range-toggle-btn${rangeMode === 'optimal' ? ' active' : ''}" data-range="optimal" onclick="switchRangeMode('optimal');updateSettingsUI()">Optimal</button>
        <button class="range-toggle-btn${rangeMode === 'reference' ? ' active' : ''}" data-range="reference" onclick="switchRangeMode('reference');updateSettingsUI()">Reference</button>
        <button class="range-toggle-btn${rangeMode === 'both' ? ' active' : ''}" data-range="both" onclick="switchRangeMode('both');updateSettingsUI()">Both</button>
      </div>
    </div>

    <div class="settings-section">
      <label class="settings-label">Theme</label>
      <div class="settings-theme-toggle">
        <button class="settings-theme-btn${currentTheme === 'dark' ? ' active' : ''}" onclick="setTheme('dark');updateSettingsUI();destroyAllCharts();navigate(document.querySelector('.nav-item.active')?.dataset.category||'dashboard')">Dark</button>
        <button class="settings-theme-btn${currentTheme === 'light' ? ' active' : ''}" onclick="setTheme('light');updateSettingsUI();destroyAllCharts();navigate(document.querySelector('.nav-item.active')?.dataset.category||'dashboard')">Light</button>
      </div>
    </div>

    <div class="settings-section">
      <label class="settings-label">Anthropic API Key</label>
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

function updateSettingsUI() {
  const modal = document.getElementById('settings-modal');
  if (!modal) return;
  modal.querySelectorAll('.sex-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.sex === profileSex));
  modal.querySelectorAll('.unit-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.unit === unitSystem));
  modal.querySelectorAll('.range-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.range === rangeMode));
  const theme = getTheme();
  modal.querySelectorAll('.settings-theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === theme);
  });
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

function migrateProfileData(data) {
  // Merge circadian + sleep → sleepCircadian
  if (!data.sleepCircadian) {
    const parts = [data.circadian, data.sleep].filter(s => s && s.trim());
    if (parts.length) data.sleepCircadian = parts.join('\n\n');
  }
  delete data.circadian;
  delete data.sleep;
  // Merge fieldExperts + fieldLens → interpretiveLens
  if (!data.interpretiveLens) {
    const parts = [data.fieldExperts, data.fieldLens].filter(s => s && s.trim());
    if (parts.length) data.interpretiveLens = parts.join('\n\n');
  }
  delete data.fieldExperts;
  delete data.fieldLens;
  return data;
}

function loadProfile(profileId) {
  currentProfile = profileId;
  setActiveProfileId(profileId);
  const savedImported = localStorage.getItem(profileStorageKey(profileId, 'imported'));
  importedData = savedImported ? (function() { try { const d = JSON.parse(savedImported); if (!d.notes) d.notes = []; if (!d.supplements) d.supplements = []; return migrateProfileData(d); } catch(e) { return { entries: [], notes: [], supplements: [] }; } })() : { entries: [], notes: [], supplements: [] };
  const savedUnits = localStorage.getItem(profileStorageKey(profileId, 'units'));
  unitSystem = savedUnits === 'US' ? 'US' : 'EU';
  const savedRange = localStorage.getItem(profileStorageKey(profileId, 'rangeMode'));
  rangeMode = savedRange === 'reference' ? 'reference' : savedRange === 'both' ? 'both' : 'optimal';
  const savedSuppOverlay = localStorage.getItem(profileStorageKey(profileId, 'suppOverlay'));
  suppOverlayMode = savedSuppOverlay === 'on' ? 'on' : 'off';
  const savedNoteOverlay = localStorage.getItem(profileStorageKey(profileId, 'noteOverlay'));
  noteOverlayMode = savedNoteOverlay === 'on' ? 'on' : 'off';
  profileSex = getProfileSex(profileId);
  profileDob = getProfileDob(profileId);
  selectedCorrelationMarkers = [];
  chatHistory = [];
  loadChatPersonality();
  destroyAllCharts();
  buildSidebar();
  showDashboard();
  updateHeaderDates();
  updateHeaderRangeToggle();
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
  showConfirmDialog('Delete this profile and all its data? This cannot be undone.', () => {
    const updated = profiles.filter(p => p.id !== profileId);
    saveProfiles(updated);
    localStorage.removeItem(profileStorageKey(profileId, 'imported'));
    localStorage.removeItem(profileStorageKey(profileId, 'units'));
    localStorage.removeItem(profileStorageKey(profileId, 'suppOverlay'));
    localStorage.removeItem(profileStorageKey(profileId, 'noteOverlay'));
    localStorage.removeItem(`labcharts-${profileId}-chat`);
    if (currentProfile === profileId) {
      loadProfile(updated[0].id);
    } else {
      renderProfileDropdown();
    }
    showNotification('Profile deleted', 'info');
  });
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
  const data = getActiveData();
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  buildSidebar(data);
  updateHeaderDates(data);
  navigate(activeCat, data);
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
  const data = getActiveData();
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  buildSidebar(data);
  updateHeaderDates(data);
  navigate(activeCat, data);
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

  // Merge optimal ranges into markers
  for (const [fullKey, opt] of Object.entries(OPTIMAL_RANGES)) {
    const [catKey, markerKey] = fullKey.split('.');
    const cat = data.categories[catKey];
    if (cat && cat.markers[markerKey]) {
      const marker = cat.markers[markerKey];
      if (profileSex === 'female' && opt.optimalMin_f !== undefined) {
        marker.optimalMin = opt.optimalMin_f;
        marker.optimalMax = opt.optimalMax_f;
      } else {
        marker.optimalMin = opt.optimalMin;
        marker.optimalMax = opt.optimalMax;
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
        if (marker.optimalMin != null) marker.optimalMin = parseFloat((marker.optimalMin * conv.factor).toPrecision(4));
        if (marker.optimalMax != null) marker.optimalMax = parseFloat((marker.optimalMax * conv.factor).toPrecision(4));
        marker.unit = conv.usUnit;
      } else if (conv.type === 'hba1c') {
        marker.values = marker.values.map(v => v !== null ? parseFloat(((v / 10.929) + 2.15).toFixed(1)) : null);
        marker.refMin = parseFloat(((marker.refMin / 10.929) + 2.15).toFixed(1));
        marker.refMax = parseFloat(((marker.refMax / 10.929) + 2.15).toFixed(1));
        if (marker.optimalMin != null) marker.optimalMin = parseFloat(((marker.optimalMin / 10.929) + 2.15).toFixed(1));
        if (marker.optimalMax != null) marker.optimalMax = parseFloat(((marker.optimalMax / 10.929) + 2.15).toFixed(1));
        marker.unit = '%';
      }
    }
  }
}

// ═══════════════════════════════════════════════
// DATE RANGE FILTER
// ═══════════════════════════════════════════════
function filterDatesByRange(data) {
  if (dateRangeFilter === 'all') return data;
  const months = dateRangeFilter === '3m' ? 3 : dateRangeFilter === '6m' ? 6 : 12;
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - months);
  const cutoffStr = cutoff.toISOString().slice(0, 10);
  const indices = [];
  for (let i = 0; i < data.dates.length; i++) {
    if (data.dates[i] >= cutoffStr) indices.push(i);
  }
  if (indices.length === 0) return data; // fallback: show all if no dates in range
  const filtered = {
    dates: indices.map(i => data.dates[i]),
    dateLabels: indices.map(i => data.dateLabels[i]),
    categories: {}
  };
  for (const [catKey, cat] of Object.entries(data.categories)) {
    const filteredCat = { ...cat, markers: {} };
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      if (marker.singlePoint || cat.singlePoint) {
        filteredCat.markers[mKey] = marker;
      } else {
        filteredCat.markers[mKey] = { ...marker, values: indices.map(i => marker.values[i]) };
      }
    }
    filtered.categories[catKey] = filteredCat;
  }
  return filtered;
}

function renderDateRangeFilter() {
  const ranges = [
    { key: '3m', label: '3M' },
    { key: '6m', label: '6M' },
    { key: '1y', label: '1Y' },
    { key: 'all', label: 'All' }
  ];
  return `<div class="date-range-filter">${ranges.map(r =>
    `<button class="range-btn${dateRangeFilter === r.key ? ' active' : ''}" onclick="setDateRange('${r.key}')">${r.label}</button>`
  ).join('')}</div>`;
}

function setDateRange(range) {
  dateRangeFilter = range;
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  navigate(activeCat);
}

function renderChartLayersDropdown() {
  const hasNotes = (importedData.notes || []).length > 0;
  const hasSupps = (importedData.supplements || []).length > 0;
  if (!hasNotes && !hasSupps) return '';
  return `<div class="chart-layers-wrapper">
    <button class="view-btn chart-layers-trigger" onclick="toggleChartLayersDropdown(event)">Layers \u25BE</button>
    <div class="chart-layers-dropdown" id="chart-layers-dropdown">
      ${hasNotes ? `<label class="chart-layers-row" onclick="event.stopPropagation()">
        <input type="checkbox" ${noteOverlayMode === 'on' ? 'checked' : ''} onchange="setNoteOverlay(this.checked?'on':'off')">
        <span>\uD83D\uDCDD Notes</span>
      </label>` : ''}
      ${hasSupps ? `<label class="chart-layers-row" onclick="event.stopPropagation()">
        <input type="checkbox" ${suppOverlayMode === 'on' ? 'checked' : ''} onchange="setSuppOverlay(this.checked?'on':'off')">
        <span>\uD83D\uDC8A Supplements</span>
      </label>` : ''}
    </div>
  </div>`;
}

function toggleChartLayersDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('chart-layers-dropdown');
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open', !isOpen);
  if (!isOpen) {
    const close = (ev) => {
      if (!ev.target.closest('.chart-layers-wrapper')) {
        dd.classList.remove('open');
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 0);
  }
}

function setSuppOverlay(mode) {
  suppOverlayMode = mode === 'off' ? 'off' : 'on';
  localStorage.setItem(profileStorageKey(currentProfile, 'suppOverlay'), suppOverlayMode);
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  navigate(activeCat);
}

function setNoteOverlay(mode) {
  noteOverlayMode = mode === 'off' ? 'off' : 'on';
  localStorage.setItem(profileStorageKey(currentProfile, 'noteOverlay'), noteOverlayMode);
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  navigate(activeCat);
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
  if (savedImported) { try { importedData = JSON.parse(savedImported); if (!importedData.notes) importedData.notes = []; migrateProfileData(importedData); } catch(e) {} }
  const savedUnits = localStorage.getItem(profileStorageKey(currentProfile, 'units'));
  if (savedUnits === 'US') unitSystem = 'US';
  const savedRange = localStorage.getItem(profileStorageKey(currentProfile, 'rangeMode'));
  rangeMode = savedRange === 'reference' ? 'reference' : savedRange === 'both' ? 'both' : 'optimal';
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
  document.querySelectorAll('.range-toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === rangeMode);
  });
  const dobInputInit = document.getElementById('dob-input');
  if (dobInputInit) dobInputInit.value = profileDob || '';
  setTheme(getTheme());
  buildSidebar();
  showDashboard();
  updateHeaderDates();
  updateHeaderRangeToggle();
  renderProfileDropdown();
  document.getElementById("pdf-input").addEventListener("change", async e => {
    if (e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const jsonFiles = files.filter(f => f.name.endsWith('.json') || f.type === 'application/json');
      const pdfFiles = files.filter(f => f.name.endsWith('.pdf') || f.type === 'application/pdf');
      for (const f of jsonFiles) importDataJSON(f);
      if (pdfFiles.length === 1) await handlePDFFile(pdfFiles[0]);
      else if (pdfFiles.length > 1) await handleBatchPDFs(pdfFiles);
      e.target.value = '';
    }
  });
  // Prevent browser from opening dropped files outside drop zone
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => e.preventDefault());
});

function buildSidebar(data) {
  if (!data) data = getActiveData();
  const nav = document.getElementById("sidebar-nav");
  let html = `<input type="text" class="sidebar-search" id="sidebar-search" placeholder="Search markers..." oninput="filterSidebar()">`;
  html += `<div class="nav-item active" data-category="dashboard" onclick="navigate('dashboard')">
    <span class="icon">\uD83D\uDCCB</span> Dashboard</div>`;
  html += `<div class="nav-item" data-category="correlations" onclick="navigate('correlations')">
    <span class="icon">\uD83D\uDCC8</span> Correlations</div>`;
  html += `<div class="nav-item" data-category="compare" onclick="navigate('compare')">
    <span class="icon">\u2194</span> Compare Dates</div>`;
  html += `<div class="sidebar-title">Categories</div>`;
  for (const [key, cat] of Object.entries(data.categories)) {
    const markers = Object.values(cat.markers);
    const flagged = countFlagged(markers);
    const withData = markers.filter(m => m.values && m.values.some(v => v !== null)).length;
    const flagHtml = flagged > 0
      ? `<span class="flag-count">${flagged}</span>`
      : `<span class="count">${withData}</span>`;
    const markerNames = markers.map(m => m.name).join('|');
    html += `<div class="nav-item" data-category="${key}" data-markers="${escapeHTML(markerNames)}" onclick="navigate('${key}')">
      <span class="icon">${cat.icon}</span> ${cat.label} ${flagHtml}</div>`;
  }
  nav.innerHTML = html;
}

function filterSidebar() {
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

function navigate(category, data) {
  document.querySelectorAll(".nav-item").forEach(el => {
    el.classList.toggle("active", el.dataset.category === category);
  });
  destroyAllCharts();
  if (category === "dashboard") showDashboard(data);
  else if (category === "correlations") showCorrelations(data);
  else if (category === "compare") showCompare(data);
  else showCategory(category, data);
}

function showDashboard(data) {
  if (!data) data = getActiveData();
  const main = document.getElementById("main-content");
  const hasData = data.dates.length > 0 || Object.values(data.categories).some(c => c.singlePoint && c.singleDate);

  let html = `<div class="category-header"><h2>Dashboard Overview</h2>`;
  if (hasData) {
    html += `<p>Summary of all blood work results across ${data.dates.length} collection date${data.dates.length !== 1 ? 's' : ''}</p>`;
  }
  html += `</div>`;

  // ── 1. Drop zone ──
  html += `<div class="drop-zone" id="drop-zone">
    <div class="drop-zone-icon">\uD83D\uDCC4</div>
    <div class="drop-zone-text">Drop PDF or JSON file here, or click to browse</div>
    <div class="drop-zone-hint">AI-powered — works with any lab PDF report or LabCharts JSON export</div></div>`;

  if (!hasData) {
    html += `<div class="onboarding-step1">
      <div class="onboarding-steps">
        <span class="onboarding-step active">1</span>
        <span class="onboarding-step-line"></span>
        <span class="onboarding-step">2</span>
        <span class="onboarding-step-line"></span>
        <span class="onboarding-step">3</span>
      </div>
      <div class="onboarding-step-labels">
        <span class="onboarding-step-label active">Import</span>
        <span class="onboarding-step-label">Profile</span>
        <span class="onboarding-step-label">Ready</span>
      </div>
      <h3>Welcome to LabCharts</h3>
      <p>Import your first lab results to get started.</p>
      <button class="onboarding-import-btn" onclick="document.getElementById('pdf-input').click()">Choose PDF or JSON file</button>
      <div class="onboarding-hint">or drag and drop onto the area above</div>
    </div>`;
    html += renderProfileContextCards();
    if (profileSex === 'female') html += renderMenstrualCycleSection(data);
    html += renderSupplementsSection();
    main.innerHTML = html;
    setupDropZone();
    return;
  }

  // ── 2. Onboarding Banner (Step 2) ──
  html += renderOnboardingBanner();

  // ── 3. Focus Card ──
  if (hasApiKey()) html += renderFocusCard();

  // ── 4. Profile Context Cards ──
  html += renderProfileContextCards();

  // ── 5. Menstrual Cycle (female only) ──
  if (profileSex === 'female') html += renderMenstrualCycleSection(data);

  // ── 6. Supplements & Medications ──
  html += renderSupplementsSection();

  // ── 7. Key Trends ──
  const filteredData = filterDatesByRange(data);
  html += `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:16px">
    <div class="category-header" style="margin:0"><h2>Key Trends</h2>
    <p>Important biomarkers tracked over time</p></div>
    ${renderDateRangeFilter()}
    ${renderChartLayersDropdown()}
  </div>`;

  const keyMarkers = [
    { cat: "diabetes", key: "hba1c" }, { cat: "diabetes", key: "homaIR" },
    { cat: "lipids", key: "ldl" }, { cat: "vitamins", key: "vitaminD" },
    { cat: "thyroid", key: "tsh" }, { cat: "hormones", key: "testosterone" },
    { cat: "proteins", key: "hsCRP" }, { cat: "biochemistry", key: "ggt" }
  ];
  html += `<div class="charts-grid charts-grid-4col">`;
  for (const km of keyMarkers) {
    const marker = filteredData.categories[km.cat].markers[km.key];
    html += renderChartCard(km.cat + "_" + km.key, marker, filteredData.dateLabels);
  }
  html += `</div>`;

  // ── 8. Trends & Critical Flags ──
  const trendAlerts = detectTrendAlerts(filteredData);
  const trendMarkerIds = new Set(trendAlerts.map(a => a.id));
  const allFlags = getAllFlaggedMarkers(data);
  // Critical flags always use reference range (not optimal) — critical is a medical concept
  const criticalFlags = allFlags.filter(f => {
    if (trendMarkerIds.has(f.id)) return false;
    const refRange = f.refMax - f.refMin;
    if (refRange <= 0 || f.refMin == null || f.refMax == null) return false;
    const distance = f.status === 'high' ? (f.rawValue - f.refMax) : (f.refMin - f.rawValue);
    return distance > refRange * 0.5;
  });
  const totalAttention = trendAlerts.length + criticalFlags.length;
  if (totalAttention > 0) {
    html += `<div class="alerts-section"><div class="alerts-title">Trends & Alerts (${totalAttention})</div>`;
    for (const alert of trendAlerts) {
      const isSudden = alert.concern.startsWith('sudden_');
      const isPast = alert.concern.startsWith('past_');
      const cls = isSudden ? 'trend-alert-sudden' : isPast ? 'trend-alert-danger' : 'trend-alert-warning';
      const arrow = isSudden ? '\u26A1' : alert.direction === 'rising' ? '\u2197' : '\u2198';
      const label = alert.concern === 'sudden_high' ? 'Sudden jump above range'
        : alert.concern === 'sudden_low' ? 'Sudden drop below range'
        : alert.concern === 'past_high' ? 'Above range & rising'
        : alert.concern === 'past_low' ? 'Below range & falling'
        : alert.concern === 'approaching_high' ? 'Approaching upper limit'
        : 'Approaching lower limit';
      html += `<div class="trend-alert-card ${cls}" onclick="showDetailModal('${alert.id}')">
        <span class="trend-alert-arrow">${arrow}</span>
        <div class="trend-alert-info">
          <div class="trend-alert-name">${alert.name} <span class="trend-alert-cat">${alert.category}</span></div>
          <div class="trend-alert-label">${label}</div>
        </div>
        <div class="trend-alert-spark">${alert.spark.join(' \u2192 ')}</div>
      </div>`;
    }
    for (const f of criticalFlags) {
      const cls = f.status === "high" ? "alert-high" : "alert-low";
      const label = f.status === "high" ? "\u25B2 CRITICAL HIGH" : "\u25BC CRITICAL LOW";
      html += `<div class="alert-card ${cls}" onclick="navigate('${f.categoryKey}')">
        <span class="alert-indicator">${label}</span>
        <span class="alert-name">${f.name}</span>
        <span class="alert-value">${f.value} ${f.unit}</span>
        <span class="alert-ref">${formatValue(f.effectiveMin)} \u2013 ${formatValue(f.effectiveMax)}</span></div>`;
    }
    html += `</div>`;
  }

  // ── 9. Data & Notes (bottom) ──
  const hasEntries = importedData.entries && importedData.entries.length > 0;
  const hasNotes = importedData.notes && importedData.notes.length > 0;
  if (hasEntries || hasNotes) {
    const entryCount = (importedData.entries || []).length;
    const noteCount = (importedData.notes || []).length;
    const dataBadge = [entryCount ? `${entryCount} entries` : '', noteCount ? `${noteCount} notes` : ''].filter(Boolean).join(', ');
    html += `<div style="margin-top:20px"><span class="context-section-title">Data & Notes (${dataBadge})</span></div>`;
    html += `<div class="imported-entries">`;
    html += `<button class="add-note-btn" onclick="openNoteEditor()">+ Add Note</button>`;
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
    html += `<div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap">
      <button class="import-btn import-btn-secondary" onclick="exportDataJSON()">Export JSON</button>
      <button class="import-btn import-btn-secondary" onclick="exportPDFReport()">Export Report</button>
      <button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red)" onclick="clearAllData()">Clear All Data</button></div>`;
    html += `</div>`;
  }

  main.innerHTML = html;

  for (const km of keyMarkers) {
    const marker = filteredData.categories[km.cat].markers[km.key];
    createLineChart(km.cat + "_" + km.key, marker, filteredData.dateLabels, filteredData.dates);
  }
  setupDropZone();

  // Non-blocking: load focus card after DOM is ready
  if (hasData && hasApiKey()) loadFocusCard();
}

// ── Focus Card ──

function renderFocusCard() {
  const cacheKey = profileStorageKey(currentProfile, 'focusCard');
  const cached = (() => { try { return JSON.parse(localStorage.getItem(cacheKey)); } catch(e) { return null; } })();
  const fp = getFocusCardFingerprint();
  const text = (cached && cached.fingerprint === fp) ? cached.text : null;
  return `<div class="focus-card" id="focus-card">
    <div class="focus-card-icon">\uD83D\uDD2C</div>
    <div class="focus-card-body" id="focus-card-body">${text
      ? `<span class="focus-card-text">${escapeHTML(text)}</span>`
      : `<span class="focus-card-shimmer"></span>`}</div>
    <button class="focus-card-refresh" onclick="refreshFocusCard()" title="Regenerate insight">\u21BB</button>
  </div>`;
}

async function loadFocusCard() {
  const el = document.getElementById('focus-card-body');
  if (!el) return;
  const cacheKey = profileStorageKey(currentProfile, 'focusCard');
  const cached = (() => { try { return JSON.parse(localStorage.getItem(cacheKey)); } catch(e) { return null; } })();
  const fp = getFocusCardFingerprint();
  if (cached && cached.fingerprint === fp && cached.text) {
    el.innerHTML = `<span class="focus-card-text">${escapeHTML(cached.text)}</span>`;
    return;
  }
  el.innerHTML = `<span class="focus-card-shimmer"></span>`;
  try {
    const ctx = buildLabContext();
    const text = await callClaudeAPI({
      system: 'You are a blood work analyst. Respond with exactly ONE sentence, max 40 words. Name the single most important marker finding, its direction (rising/falling/high/low), and briefly why it matters clinically. No preamble, no disclaimer.',
      messages: [{ role: 'user', content: ctx }],
      maxTokens: 100
    });
    const trimmed = (text || '').trim();
    if (trimmed) {
      localStorage.setItem(cacheKey, JSON.stringify({ fingerprint: fp, text: trimmed }));
      el.innerHTML = `<span class="focus-card-text">${escapeHTML(trimmed)}</span>`;
    } else {
      el.innerHTML = `<span class="focus-card-text" style="color:var(--text-muted)">No insight available</span>`;
    }
  } catch(e) {
    el.innerHTML = `<span class="focus-card-text" style="color:var(--text-muted)">Could not load insight</span>`;
  }
}

function refreshFocusCard() {
  const cacheKey = profileStorageKey(currentProfile, 'focusCard');
  localStorage.removeItem(cacheKey);
  loadFocusCard();
}

// ── Onboarding ──

function renderOnboardingBanner() {
  const onboarded = localStorage.getItem(profileStorageKey(currentProfile, 'onboarded'));
  if (onboarded) return '';
  if (profileSex && profileDob) {
    localStorage.setItem(profileStorageKey(currentProfile, 'onboarded'), 'profile-set');
    return '';
  }
  return `<div class="onboarding-banner" id="onboarding-banner">
    <div class="onboarding-steps">
      <span class="onboarding-step completed">\u2713</span>
      <span class="onboarding-step-line"></span>
      <span class="onboarding-step active">2</span>
      <span class="onboarding-step-line"></span>
      <span class="onboarding-step">3</span>
    </div>
    <div class="onboarding-step-labels">
      <span class="onboarding-step-label">Import</span>
      <span class="onboarding-step-label active">Profile</span>
      <span class="onboarding-step-label">Ready</span>
    </div>
    <h3 class="onboarding-title">Set up your profile</h3>
    <p class="onboarding-subtitle">Sex and date of birth help us show the right reference ranges for your results.</p>
    <div class="onboarding-form">
      <div class="onboarding-field">
        <label class="onboarding-label">Sex</label>
        <div class="onboarding-sex-toggle">
          <button class="onboarding-sex-btn${profileSex === 'male' ? ' active' : ''}" onclick="completeOnboardingSex('male')">Male</button>
          <button class="onboarding-sex-btn${profileSex === 'female' ? ' active' : ''}" onclick="completeOnboardingSex('female')">Female</button>
        </div>
      </div>
      <div class="onboarding-field">
        <label class="onboarding-label">Date of Birth</label>
        <input type="date" class="onboarding-dob-input" id="onboarding-dob" value="${profileDob || ''}" />
      </div>
      <div class="onboarding-actions">
        <button class="onboarding-save-btn" onclick="completeOnboardingProfile()">Save & Continue</button>
        <button class="onboarding-skip-btn" onclick="dismissOnboarding()">Skip for now</button>
      </div>
    </div>
  </div>`;
}

function completeOnboardingSex(sex) {
  document.querySelectorAll('.onboarding-sex-btn').forEach(b => b.classList.remove('active'));
  const btns = document.querySelectorAll('.onboarding-sex-btn');
  if (sex === 'male' && btns[0]) btns[0].classList.add('active');
  if (sex === 'female' && btns[1]) btns[1].classList.add('active');
}

function completeOnboardingProfile() {
  const activeSexBtn = document.querySelector('.onboarding-sex-btn.active');
  const sex = activeSexBtn ? (activeSexBtn.textContent.toLowerCase()) : null;
  const dobInput = document.getElementById('onboarding-dob');
  const dob = dobInput ? dobInput.value : null;
  localStorage.setItem(profileStorageKey(currentProfile, 'onboarded'), 'profile-set');
  if (sex) { profileSex = sex; setProfileSex(currentProfile, sex); }
  if (dob) { profileDob = dob; setProfileDob(currentProfile, dob); }
  const data = getActiveData();
  buildSidebar(data);
  updateHeaderDates(data);
  navigate('dashboard', data);
  showNotification("Profile set up — you're all set!", 'success');
}

function dismissOnboarding() {
  localStorage.setItem(profileStorageKey(currentProfile, 'onboarded'), 'dismissed');
  const banner = document.getElementById('onboarding-banner');
  if (banner) {
    banner.style.transition = 'opacity 0.3s, transform 0.3s';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-10px)';
    setTimeout(() => banner.remove(), 300);
  }
  showNotification('You can set sex and DOB anytime in Settings.', 'info');
}

// ── Dashboard section renderers ──

function renderProfileContextCards() {
  const filledCount = [
    (importedData.healthGoals || []).length > 0,
    !!(importedData.diagnoses || '').trim(),
    !!(importedData.diet || '').trim(),
    !!(importedData.exercise || '').trim(),
    !!(importedData.sleepCircadian || '').trim(),
    !!(importedData.interpretiveLens || '').trim()
  ].filter(Boolean).length;
  let html = `<div style="margin-top:16px"><span class="context-section-title">What your GP won't ask you (${filledCount}/6 filled)</span></div>`;
  html += `<div class="profile-context-cards">`;
  const healthGoals = importedData.healthGoals || [];
  const goalsSummary = healthGoals.length > 0
    ? (() => {
        const counts = { major: 0, mild: 0, minor: 0 };
        for (const g of healthGoals) counts[g.severity] = (counts[g.severity] || 0) + 1;
        return [counts.major ? `${counts.major} major` : '', counts.mild ? `${counts.mild} mild` : '', counts.minor ? `${counts.minor} minor` : ''].filter(Boolean).join(', ') + ` goal${healthGoals.length !== 1 ? 's' : ''}`;
      })()
    : '';
  html += `<div class="diagnoses-card" onclick="openHealthGoalsEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83C\uDFAF Health Goals</span>
      <span class="context-info-icon">i<span class="context-tooltip">Define what you're trying to solve or improve. AI prioritizes analysis around your stated goals, focusing on major priorities first.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openHealthGoalsEditor()">${healthGoals.length > 0 ? 'Edit' : '+ Add'}</button>
    </div>
    ${goalsSummary
      ? `<div class="diagnoses-text">${escapeHTML(goalsSummary)}</div>`
      : `<div class="diagnoses-placeholder">Add health goals so AI can prioritize analysis</div>`}
  </div>`;
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
  const sleepCircadianText = importedData.sleepCircadian || '';
  html += `<div class="diagnoses-card" onclick="openSleepCircadianEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83D\uDE34 Sleep & Circadian</span>
      <span class="context-info-icon">i<span class="context-tooltip">Sleep quality, duration, light exposure, and circadian rhythm affect inflammation, insulin sensitivity, cortisol, hormone rhythms, and immune function.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openSleepCircadianEditor()">${sleepCircadianText ? 'Edit' : '+ Add'}</button>
    </div>
    ${sleepCircadianText
      ? `<div class="diagnoses-text">${escapeHTML(sleepCircadianText.length > 200 ? sleepCircadianText.slice(0, 200) + '...' : sleepCircadianText)}</div>`
      : `<div class="diagnoses-placeholder">Describe your sleep and circadian habits for AI context</div>`}
  </div>`;
  const interpretiveLensText = importedData.interpretiveLens || '';
  html += `<div class="diagnoses-card" onclick="openInterpretiveLensEditor()">
    <div class="diagnoses-header">
      <span class="diagnoses-label">\uD83D\uDD2C Interpretive Lens</span>
      <span class="context-info-icon">i<span class="context-tooltip">Name experts and paradigms to frame AI interpretation — e.g. Dr. Jack Kruse's quantum biology, Functional Endocrinology, longevity medicine.</span></span>
      <button class="diagnoses-edit-btn" onclick="event.stopPropagation();openInterpretiveLensEditor()">${interpretiveLensText ? 'Edit' : '+ Add'}</button>
    </div>
    ${interpretiveLensText
      ? `<div class="diagnoses-text">${escapeHTML(interpretiveLensText.length > 200 ? interpretiveLensText.slice(0, 200) + '...' : interpretiveLensText)}</div>`
      : `<div class="diagnoses-placeholder">List experts and frameworks for AI interpretation</div>`}
  </div>`;
  html += `</div>`;
  return html;
}

function renderMenstrualCycleSection(data) {
  const mc = importedData.menstrualCycle;
  let html = `<div class="cycle-section">
    <div class="supp-timeline-header">
      <span class="context-section-title">Menstrual Cycle</span>
      <button class="supp-add-btn" onclick="openMenstrualCycleEditor()">${mc ? 'Edit' : '+ Set Up'}</button>
    </div>`;
  if (!mc) {
    html += `<div class="cycle-prompt" onclick="openMenstrualCycleEditor()">
      <span class="cycle-prompt-icon">\uD83D\uDD34</span>
      <div><strong>Track your cycle for better lab interpretation</strong><br>
      <span style="color:var(--text-muted);font-size:12px">Hormone, iron, and inflammation markers vary significantly by cycle phase. Set up cycle tracking so AI can factor this in.</span></div>
    </div>`;
  } else {
    const regLabel = mc.regularity === 'very_irregular' ? 'very irregular' : mc.regularity || 'regular';
    let summary = `${mc.cycleLength || 28}-day cycle, ${regLabel}, ${mc.flow || 'moderate'} flow`;
    if (mc.contraceptive) summary += ` \u2022 ${escapeHTML(mc.contraceptive)}`;
    if (mc.conditions) summary += ` \u2022 ${escapeHTML(mc.conditions)}`;
    html += `<div class="cycle-summary">${summary}</div>`;
    const drawRec = getNextBestDrawDate(mc);
    if (drawRec) {
      html += `<div class="cycle-draw-date">
        <span class="cycle-draw-icon">\uD83D\uDCC5</span>
        <div><strong>Next best blood draw:</strong> ${escapeHTML(drawRec.description)}
        <div class="cycle-draw-explain">Early follicular phase gives the most stable baseline for hormones, iron, and inflammation markers.</div></div>
      </div>`;
    }
    if (data.dates.length > 0) {
      const phases = getBloodDrawPhases(mc, data.dates);
      const phaseDates = Object.entries(phases);
      if (phaseDates.length > 0) {
        html += `<div class="cycle-draw-phases">`;
        const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        for (const [date, p] of phaseDates) {
          html += `<span class="cycle-draw-tag"><span class="cycle-phase-badge phase-${p.phase}">${p.phaseName}</span> ${fmtDate(date)} \u2014 Day ${p.cycleDay}</span>`;
        }
        html += `</div>`;
      }
    }
    const periods = (mc.periods || []).slice().sort((a, b) => b.startDate.localeCompare(a.startDate)).slice(0, 6);
    if (periods.length > 0) {
      const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      html += `<div class="cycle-period-log">`;
      for (const p of periods) {
        const flowCls = p.flow === 'heavy' ? 'severity-major' : p.flow === 'light' ? 'severity-minor' : 'severity-mild';
        html += `<span class="cycle-period-entry">${fmtDate(p.startDate)}\u2013${fmtDate(p.endDate)} <span class="goals-severity-badge ${flowCls}">${p.flow}</span>${p.notes ? ` <span class="cycle-period-note">${escapeHTML(p.notes)}</span>` : ''}</span>`;
      }
      html += `</div>`;
    }
  }
  html += `</div>`;
  return html;
}

function renderSupplementsSection() {
  const supps = importedData.supplements || [];
  let html = `<div class="supp-timeline-section">
    <div class="supp-timeline-header">
      <span class="context-section-title">Supplements & Medications</span>
      <button class="supp-add-btn" onclick="openSupplementsEditor()">+ Add</button>
    </div>`;
  if (supps.length > 0) {
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
  return html;
}

function showCategory(categoryKey, preData) {
  const rawData = preData || getActiveData();
  const data = filterDatesByRange(rawData);
  const cat = data.categories[categoryKey];
  const main = document.getElementById("main-content");
  let html = `<div class="category-header"><h2>${cat.icon} ${cat.label}</h2>
    <p>${Object.keys(cat.markers).length} biomarkers tracked</p></div>`;

  html += `<div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:20px">`;
  html += `<div class="view-toggle" style="margin-bottom:0">
    <button class="view-btn active" onclick="switchView('charts','${categoryKey}',this)">Charts</button>
    <button class="view-btn" onclick="switchView('table','${categoryKey}',this)">Table</button>
    <button class="view-btn" onclick="switchView('heatmap','${categoryKey}',this)">Heatmap</button></div>`;
  html += renderDateRangeFilter();
  html += renderChartLayersDropdown();
  html += `</div>`;

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
  const rawData = getActiveData();
  const data = filterDatesByRange(rawData);
  const cat = data.categories[categoryKey];
  const container = document.getElementById("view-content");
  if (view === "table") {
    container.innerHTML = renderTableView(cat, data.dateLabels);
  } else if (view === "heatmap") {
    container.innerHTML = renderHeatmapView(cat, data.dateLabels, data.dates, categoryKey);
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
  const r = getEffectiveRange(marker);
  const status = latestVal !== null ? getStatus(latestVal, r.min, r.max) : "missing";
  const statusLabel = status === "normal" ? "Normal" : status === "high" ? "High" : status === "low" ? "Low" : "N/A";
  const sIcon = statusIcon(status);

  const trend = getTrend(marker.values);
  const trendBadge = trend.cls !== 'trend-stable' || trend.arrow !== '\u2014' ? `<span class="chart-card-trend ${trend.cls}">${trend.arrow}</span>` : '';

  let html = `<div class="chart-card" onclick="showDetailModal('${id}')">
    <div class="chart-card-header"><div>
      <div class="chart-card-title">${marker.name}</div>
      <div class="chart-card-unit">${marker.unit}</div></div>
      <div><span class="chart-card-status status-${status}">${sIcon ? sIcon + ' ' : ''}${statusLabel}</span>${trendBadge}</div></div>
    <div class="chart-container"><canvas id="chart-${id}"></canvas></div>
    <div class="chart-values">`;
  const labels = marker.singlePoint ? [marker.singleDateLabel || "N/A"] : dateLabels;
  for (let i = 0; i < marker.values.length; i++) {
    const v = marker.values[i];
    const s = v !== null ? getStatus(v, r.min, r.max) : "missing";
    html += `<div class="chart-value-item"><div class="chart-value-date">${labels[i] || ''}</div>
      <div class="chart-value-num val-${s}">${v !== null ? formatValue(v) : "\u2014"}</div></div>`;
  }
  const rangeLabel = rangeMode === 'optimal' && marker.optimalMin != null ? 'Optimal' : 'Reference';
  html += `</div>${r.min != null && r.max != null ? `<div class="chart-ref-range">${rangeLabel}: ${formatValue(r.min)} \u2013 ${formatValue(r.max)} ${marker.unit}</div>` : ''}</div>`;
  return html;
}

function renderTableView(cat, dateLabels) {
  const labels = cat.singleDate ? [cat.singleDateLabel || "N/A"] : dateLabels;
  let html = `<div class="data-table-wrapper"><table class="data-table"><thead><tr>
    <th>Biomarker</th><th>Unit</th><th>Reference</th>`;
  for (const d of labels) html += `<th>${d}</th>`;
  html += `<th>Trend</th><th>Range</th></tr></thead><tbody>`;
  for (const [key, marker] of Object.entries(cat.markers)) {
    const r = getEffectiveRange(marker);
    let refCell = r.min != null && r.max != null ? `${formatValue(r.min)} \u2013 ${formatValue(r.max)}` : '\u2014';
    if (rangeMode === 'both') {
      if (marker.optimalMin != null) refCell = `${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}<br><span style="color:var(--green);font-size:11px">opt: ${formatValue(marker.optimalMin)} \u2013 ${formatValue(marker.optimalMax)}</span>`;
    }
    html += `<tr><td class="marker-name">${marker.name}</td>
      <td class="unit-col">${marker.unit}</td>
      <td class="ref-col">${refCell}</td>`;
    for (let i = 0; i < marker.values.length; i++) {
      const v = marker.values[i];
      const s = v !== null ? getStatus(v, r.min, r.max) : "missing";
      html += `<td class="value-cell val-${s}">${v !== null ? formatValue(v) : "\u2014"}</td>`;
    }
    const trend = getTrend(marker.values);
    html += `<td><span class="trend-arrow ${trend.cls}">${trend.arrow}</span></td>`;
    const li = getLatestValueIndex(marker.values);
    if (li !== -1 && r.min != null && r.max != null) {
      const pos = Math.max(0, Math.min(100, getRangePosition(marker.values[li], r.min, r.max)));
      const s = getStatus(marker.values[li], r.min, r.max);
      html += `<td><div class="range-bar"><div class="range-bar-fill" style="left:0;width:100%"></div>
        <div class="range-bar-marker marker-${s}" style="left:${pos}%"></div></div></td>`;
    } else html += `<td>\u2014</td>`;
    html += `</tr>`;
  }
  html += `</tbody></table></div>`;
  return html;
}

function renderHeatmapView(cat, dateLabels, dates, categoryKey) {
  const labels = cat.singleDate ? [cat.singleDateLabel || "N/A"] : dateLabels;
  let html = `<div class="heatmap-wrapper"><table class="heatmap-table"><thead><tr><th>Biomarker</th>`;
  for (const d of labels) html += `<th>${d}</th>`;
  html += `</tr></thead><tbody>`;
  for (const [key, marker] of Object.entries(cat.markers)) {
    const id = categoryKey + "_" + key;
    markerRegistry[id] = marker;
    const r = getEffectiveRange(marker);
    html += `<tr><td>${marker.name}</td>`;
    for (let i = 0; i < marker.values.length; i++) {
      const v = marker.values[i];
      const s = v !== null ? getStatus(v, r.min, r.max) : "missing";
      html += `<td class="heatmap-${s}" onclick="showDetailModal('${id}')">${v !== null ? formatValue(v) : "\u2014"}</td>`;
    }
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
    const r = getEffectiveRange(marker);
    const v = marker.values[0], s = getStatus(v, r.min, r.max);
    const pos = Math.max(0, Math.min(100, getRangePosition(v, r.min, r.max)));
    const rangeLabel = rangeMode === 'optimal' && marker.optimalMin != null ? 'Optimal' : 'Ref';
    html += `<div class="fa-card"><div class="fa-card-name">${marker.name}</div>
      <div class="fa-card-value val-${s}">${formatValue(v)}${marker.unit ? " " + marker.unit : ""}</div>
      <div class="fa-card-ref">${rangeLabel}: ${formatValue(r.min)} \u2013 ${formatValue(r.max)}</div>
      <div class="range-bar" style="margin-top:8px;width:100%"><div class="range-bar-fill" style="left:0;width:100%"></div>
      <div class="range-bar-marker marker-${s}" style="left:${pos}%"></div></div></div>`;
  }
  html += `</div>`;
  return html;
}

function renderFattyAcidsCharts(cat) {
  const tc = getChartColors();
  const names=[], vals=[], mins=[], maxs=[], bgC=[], brC=[];
  for (const m of Object.values(cat.markers)) {
    const r = getEffectiveRange(m);
    names.push(m.name.replace(/\(.+\)/,"").trim());
    vals.push(m.values[0]); mins.push(r.min); maxs.push(r.max);
    const s = getStatus(m.values[0], r.min, r.max);
    bgC.push(s==="normal"?tc.green+"99":s==="high"?tc.red+"99":tc.yellow+"99");
    brC.push(s==="normal"?tc.green:s==="high"?tc.red:tc.yellow);
  }
  const ctx = document.getElementById("chart-fa-bar");
  if (!ctx) return;
  chartInstances["fa-bar"] = new Chart(ctx, {
    type: "bar",
    data: { labels: names, datasets: [
      { label:"Value", data:vals, backgroundColor:bgC, borderColor:brC, borderWidth:1, borderRadius:4 },
      { label:"Ref Min", data:mins, type:"line", borderColor:tc.lineColor+"80", borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 },
      { label:"Ref Max", data:maxs, type:"line", borderColor:tc.lineColor+"80", borderDash:[4,4], pointRadius:0, fill:false, borderWidth:1.5 }
    ]},
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{display:false}, tooltip:{ backgroundColor:tc.tooltipBg, titleColor:tc.tooltipTitle, bodyColor:tc.tooltipBody, borderColor:tc.tooltipBorder, borderWidth:1 }},
      scales: { x:{ticks:{color:tc.tickColor,font:{size:10},maxRotation:45},grid:{display:false}}, y:{ticks:{color:tc.tickColor},grid:{color:tc.gridColor}} }
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
    const cs = getComputedStyle(document.documentElement);
    ctx.save();
    ctx.fillStyle = cs.getPropertyValue('--ref-band').trim();
    ctx.fillRect(left, Math.min(yMin,yMax), right-left, Math.abs(yMax-yMin));
    ctx.strokeStyle = cs.getPropertyValue('--ref-border').trim();
    ctx.setLineDash([4,4]); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left,yMin); ctx.lineTo(right,yMin); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(left,yMax); ctx.lineTo(right,yMax); ctx.stroke();
    ctx.restore();
  }
};

// Chart.js plugin for optimal range band (green dashed, inside ref band)
const optimalBandPlugin = {
  id: "optimalBand",
  beforeDraw(chart) {
    const opts = chart.options.plugins.optimalBand;
    if (!opts || !chart.chartArea || opts.optimalMin == null || opts.optimalMax == null) return;
    const { ctx, chartArea: { left, right }, scales: { y } } = chart;
    if (!y) return;
    const yMin = y.getPixelForValue(opts.optimalMin);
    const yMax = y.getPixelForValue(opts.optimalMax);
    ctx.save();
    ctx.fillStyle = "rgba(52, 211, 153, 0.06)";
    ctx.fillRect(left, Math.min(yMin,yMax), right-left, Math.abs(yMax-yMin));
    ctx.strokeStyle = "rgba(52, 211, 153, 0.3)";
    ctx.setLineDash([3,3]); ctx.lineWidth = 1;
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
    const DOT_RADIUS = window.innerWidth <= 768 ? 8 : 5;
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
      const cs = getComputedStyle(document.documentElement);
      ctx.fillStyle = cs.getPropertyValue('--chart-tooltip-bg').trim();
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
      ctx.fillStyle = cs.getPropertyValue('--text-primary').trim();
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
  if (noteOverlayMode === 'off') return [];
  const notes = (importedData.notes || []);
  if (!notes.length || !chartDates.length) return [];
  const minDate = chartDates[0];
  const maxDate = chartDates[chartDates.length - 1];
  return notes.filter(n => n.date >= minDate && n.date <= maxDate);
}

function getSupplementsForChart(chartDates) {
  if (suppOverlayMode === 'off') return [];
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
      const cs = getComputedStyle(document.documentElement);
      ctx.fillStyle = cs.getPropertyValue('--chart-tooltip-bg').trim();
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
      ctx.fillStyle = cs.getPropertyValue('--text-primary').trim();
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
  const tc = getChartColors();
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
  const optMinSafe = marker.optimalMin != null ? marker.optimalMin : Infinity;
  const optMaxSafe = marker.optimalMax != null ? marker.optimalMax : -Infinity;
  const minV = Math.min(...allValid, refMinSafe, optMinSafe);
  const maxV = Math.max(...allValid, refMaxSafe, optMaxSafe);
  const pad = (maxV - minV) * 0.15 || 1;
  const chartRange = getEffectiveRange(marker);
  const ptColors = values.map(v => {
    if (v === null) return "transparent";
    const s = getStatus(v, chartRange.min, chartRange.max);
    return s==="normal"?tc.green:s==="high"?tc.red:tc.yellow;
  });
  const rawDates = chartDates || [];
  const chartNotes = marker.singlePoint ? [] : getNotesForChart(rawDates);
  const chartSupps = marker.singlePoint ? [] : getSupplementsForChart(rawDates);
  const datasets = [{
    data: values, borderColor: tc.lineColor, backgroundColor: tc.lineFill,
    borderWidth: 2.5, pointBackgroundColor: ptColors, pointBorderColor: ptColors,
    pointRadius: 6, pointHoverRadius: 8, tension: 0.3, fill: false, spanGaps: true,
    label: isPhenoAge ? 'Biological Age' : ''
  }];
  if (chronoAgeValues) {
    datasets.push({
      data: chronoAgeValues, borderColor: tc.chronoLineColor, backgroundColor: "transparent",
      borderWidth: 2, borderDash: [6, 4], pointRadius: 0, pointHoverRadius: 4,
      tension: 0.3, fill: false, spanGaps: true, label: 'Chronological Age'
    });
  }
  chartInstances[id] = new Chart(canvas, {
    type: "line",
    data: { labels: dates, datasets },
    options: { responsive:true, maintainAspectRatio:false,
      plugins: { legend:{ display: isPhenoAge && chronoAgeValues ? true : false, labels: { color: tc.legendColor, font: { size: 11 }, boxWidth: 20, padding: 10 } },
        tooltip:{ backgroundColor:tc.tooltipBg, titleColor:tc.tooltipTitle, bodyColor:tc.tooltipBody, borderColor:tc.tooltipBorder, borderWidth:1,
          callbacks:{ label:(c)=>`${c.dataset.label ? c.dataset.label + ': ' : ''}${formatValue(c.parsed.y)} ${marker.unit}`, afterLabel:(c)=> { if (c.datasetIndex !== 0) return ''; const rl = rangeMode === 'optimal' && marker.optimalMin != null ? 'Optimal' : 'Ref'; return chartRange.min != null && chartRange.max != null ? `${rl}: ${formatValue(chartRange.min)} \u2013 ${formatValue(chartRange.max)}` : ''; } }},
        refBand: rangeMode === 'both' ? { refMin:marker.refMin, refMax:marker.refMax } : { refMin:chartRange.min, refMax:chartRange.max },
        optimalBand: rangeMode === 'both' && marker.optimalMin != null ? { optimalMin: marker.optimalMin, optimalMax: marker.optimalMax } : false,
        noteAnnotations: chartNotes.length ? { notes: chartNotes, chartDates: rawDates } : false,
        supplementBars: chartSupps.length ? { supplements: chartSupps, chartDates: rawDates } : false},
      layout: { padding: { top: chartSupps.length ? chartSupps.length * 14 + 6 : 0 } },
      scales: { x:{ticks:{color:tc.tickColor,font:{size:11}},grid:{display:false}},
        y:{min:minV-pad, max:maxV+pad, ticks:{color:tc.tickColor,font:{size:10}}, grid:{color:tc.gridColor}}}
    },
    plugins: [refBandPlugin, optimalBandPlugin, noteAnnotationPlugin, supplementBarPlugin]
  });
}

function getMarkerDescription(markerId) {
  const marker = markerRegistry[markerId];
  if (marker && marker.desc) return marker.desc;
  // Fallback to localStorage cache for custom markers
  const cache = JSON.parse(localStorage.getItem('labcharts-marker-desc') || '{}');
  return cache[markerId] || null;
}

async function fetchCustomMarkerDescription(markerId, markerName, unit) {
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
  const r = getEffectiveRange(marker);
  let rangeInfo = '';
  if (rangeMode === 'both') {
    if (marker.refMin != null && marker.refMax != null) rangeInfo += ` &middot; Reference: ${marker.refMin} \u2013 ${marker.refMax}`;
    if (marker.optimalMin != null) rangeInfo += ` &middot; <span style="color:var(--green)">Optimal: ${marker.optimalMin} \u2013 ${marker.optimalMax}</span>`;
  } else if (rangeMode === 'optimal' && marker.optimalMin != null) {
    rangeInfo = ` &middot; <span style="color:var(--green)">Optimal: ${marker.optimalMin} \u2013 ${marker.optimalMax}</span>`;
  } else if (marker.refMin != null && marker.refMax != null) {
    rangeInfo = ` &middot; Reference: ${marker.refMin} \u2013 ${marker.refMax}`;
  }
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>${marker.name}</h3>
    <div class="modal-unit">${marker.unit}${rangeInfo}</div>
    <div class="marker-description" id="marker-desc"></div>
    <div class="modal-chart"><canvas id="modal-chart"></canvas></div>
    <div class="modal-values-grid">`;
  for (let i = 0; i < marker.values.length; i++) {
    const v = marker.values[i];
    const s = v !== null ? getStatus(v, r.min, r.max) : "missing";
    const sl = s==="normal"?"\u2713 In Range":s==="high"?"\u25B2 Above Range":s==="low"?"\u25BC Below Range":"N/A";
    const rawDate = marker.singlePoint ? null : data.dates[i];
    const matchingNote = rawDate && importedData.notes ? importedData.notes.find(n => n.date === rawDate) : null;
    const noteIcon = matchingNote ? `<div class="mv-note" onclick="event.stopPropagation();this.parentElement.parentElement.querySelector('.mv-note-text').classList.toggle('show')">&#128221;</div><div class="mv-note-text">${escapeHTML(matchingNote.text)}</div>` : '';
    const dotKey = id.replace('_', '.');
    const isManual = rawDate && importedData.manualValues && importedData.manualValues[dotKey + ':' + rawDate];
    const deleteBtn = (v !== null && isManual) ? `<button class="mv-delete" onclick="event.stopPropagation();deleteMarkerValue('${id}','${rawDate}')" title="Remove this value">&times;</button>` : '';
    html += `<div class="modal-value-card">${deleteBtn}<div class="mv-date">${dates[i]}${noteIcon}</div>
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
  html += `<button class="manual-entry-btn" onclick="event.stopPropagation();openManualEntryForm('${id}')">+ Add Value</button>`;
  modal.innerHTML = html;
  overlay.classList.add("show");
  setTimeout(() => {
    if (document.getElementById("modal-chart")) createLineChart("modal", marker, data.dateLabels, data.dates);
  }, 50);
  // Display marker description (sync for schema markers, async fetch for custom)
  const descEl = document.getElementById('marker-desc');
  if (descEl) {
    const desc = getMarkerDescription(id);
    if (desc) {
      descEl.textContent = desc;
      descEl.classList.add('loaded');
    } else if (!marker.desc && hasApiKey()) {
      descEl.classList.add('loading');
      fetchCustomMarkerDescription(id, marker.name, marker.unit).then(text => {
        const el = document.getElementById('marker-desc');
        if (text && el) {
          el.textContent = text;
          el.classList.remove('loading');
          el.classList.add('loaded');
        } else if (el) {
          el.remove();
        }
      });
    } else {
      descEl.remove();
    }
  }
}

function openManualEntryForm(id) {
  const marker = markerRegistry[id];
  if (!marker) return;
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const today = new Date().toISOString().slice(0, 10);
  const refText = marker.refMin != null && marker.refMax != null
    ? `Reference: ${marker.refMin} \u2013 ${marker.refMax} ${marker.unit}`
    : '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Add Value \u2014 ${marker.name}</h3>
    <div class="modal-unit">${marker.unit}${refText ? ' \u00b7 ' + refText : ''}</div>
    <div class="manual-entry-form">
      <div class="me-field">
        <label>Date</label>
        <input type="date" id="me-date" value="${today}">
      </div>
      <div class="me-field">
        <label>Value (${marker.unit})</label>
        <input type="number" id="me-value" step="any" placeholder="Enter value..." autofocus>
      </div>
      <div style="display:flex;gap:8px;margin-top:16px">
        <button class="import-btn import-btn-primary" onclick="saveManualEntry('${id}')">Save</button>
        <button class="import-btn import-btn-secondary" onclick="showDetailModal('${id}')">Cancel</button>
      </div>
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => { const el = document.getElementById('me-value'); if (el) el.focus(); }, 50);
}

function saveManualEntry(id) {
  const dateInput = document.getElementById('me-date');
  const valueInput = document.getElementById('me-value');
  if (!dateInput || !valueInput) return;
  const date = dateInput.value;
  const value = parseFloat(valueInput.value);
  if (!date) { showNotification('Please enter a date', 'error'); return; }
  if (isNaN(value)) { showNotification('Please enter a valid number', 'error'); return; }
  // Convert id format: "category_markerKey" → "category.markerKey"
  const dotKey = id.replace('_', '.');
  if (!importedData.entries) importedData.entries = [];
  let entry = importedData.entries.find(e => e.date === date);
  if (!entry) {
    entry = { date: date, markers: {} };
    importedData.entries.push(entry);
  }
  entry.markers[dotKey] = value;
  // Track as manually added
  if (!importedData.manualValues) importedData.manualValues = {};
  importedData.manualValues[dotKey + ':' + date] = true;
  // Insulin dual-mapping
  if (dotKey === 'hormones.insulin') entry.markers['diabetes.insulin_d'] = value;
  recalculateHOMAIR(entry);
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  buildSidebar();
  updateHeaderDates();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`Added ${markerRegistry[id]?.name || id}: ${value} on ${date}`, 'success');
}

function deleteMarkerValue(id, date) {
  const dotKey = id.replace('_', '.');
  if (!importedData.entries) return;
  const entry = importedData.entries.find(e => e.date === date);
  if (!entry || entry.markers[dotKey] === undefined) return;
  delete entry.markers[dotKey];
  // Clean up manual tracking
  if (importedData.manualValues) delete importedData.manualValues[dotKey + ':' + date];
  // Clean up insulin dual-mapping
  if (dotKey === 'hormones.insulin') { delete entry.markers['diabetes.insulin_d']; recalculateHOMAIR(entry); }
  // Remove entry entirely if no markers left
  if (Object.keys(entry.markers).length === 0) {
    importedData.entries = importedData.entries.filter(e => e.date !== date);
  }
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  buildSidebar();
  updateHeaderDates();
  // Re-open the detail modal to show updated values
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showDetailModal(id);
  showNotification(`Removed value from ${date}`, 'info');
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("show");
  if (chartInstances["modal"]) { chartInstances["modal"].destroy(); delete chartInstances["modal"]; }
}

function showConfirmDialog(message, onConfirm) {
  let overlay = document.getElementById("confirm-dialog-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "confirm-dialog-overlay";
    overlay.className = "confirm-overlay";
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="confirm-dialog">
    <p class="confirm-message">${escapeHTML(message)}</p>
    <div class="confirm-actions">
      <button class="confirm-btn confirm-btn-cancel" id="confirm-cancel">Cancel</button>
      <button class="confirm-btn confirm-btn-danger" id="confirm-ok">Confirm</button>
    </div></div>`;
  overlay.classList.add("show");
  document.getElementById("confirm-ok").onclick = () => { overlay.classList.remove("show"); onConfirm(); };
  document.getElementById("confirm-cancel").onclick = () => { overlay.classList.remove("show"); };
  overlay.onclick = (e) => { if (e.target === overlay) overlay.classList.remove("show"); };
  document.getElementById("confirm-cancel").focus();
}
document.addEventListener("click", e => {
  if (e.target.id === "modal-overlay") closeModal();
  if (e.target.id === "import-modal-overlay") closeImportModal();
  if (e.target.id === "settings-modal-overlay") closeSettingsModal();
  if (e.target.id === "glossary-modal-overlay") closeGlossary();
  const dd = document.getElementById("corr-options");
  const si = document.getElementById("corr-search");
  if (dd && si && !dd.contains(e.target) && e.target !== si) dd.classList.remove("show");
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const confirmOverlay = document.getElementById("confirm-dialog-overlay");
    if (confirmOverlay && confirmOverlay.classList.contains("show")) { confirmOverlay.classList.remove("show"); return; }
    const chatPanel = document.getElementById("chat-panel");
    if (chatPanel && chatPanel.classList.contains("open")) { closeChatPanel(); return; }
    const importOverlay = document.getElementById("import-modal-overlay");
    if (importOverlay && importOverlay.classList.contains("show")) { closeImportModal(); return; }
    const glossaryOverlay = document.getElementById("glossary-modal-overlay");
    if (glossaryOverlay && glossaryOverlay.classList.contains("show")) { closeGlossary(); return; }
    const settingsOverlay = document.getElementById("settings-modal-overlay");
    if (settingsOverlay && settingsOverlay.classList.contains("show")) { closeSettingsModal(); return; }
    const modalOverlay = document.getElementById("modal-overlay");
    if (modalOverlay && modalOverlay.classList.contains("show")) { closeModal(); return; }
    return;
  }
  // Skip shortcuts when typing in an input/textarea or when modifier keys are held
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
  if (e.key === "c" || e.key === "C") { e.preventDefault(); toggleChatPanel(); }
  if (e.key === "/") { e.preventDefault(); const sb = document.getElementById("sidebar-search"); if (sb) { sb.focus(); sb.select(); } }
});

// ═══════════════════════════════════════════════
// THEME MANAGEMENT
// ═══════════════════════════════════════════════
function getTheme() { return localStorage.getItem('labcharts-theme') || 'dark'; }

function setTheme(theme) {
  localStorage.setItem('labcharts-theme', theme);
  if (theme === 'light') document.documentElement.dataset.theme = 'light';
  else delete document.documentElement.dataset.theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'light' ? '#ffffff' : '#1a1d27';
}

function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  const activeNav = document.querySelector('.nav-item.active');
  const activeCat = activeNav ? activeNav.dataset.category : 'dashboard';
  destroyAllCharts();
  navigate(activeCat);
}

function getChartColors() {
  const s = getComputedStyle(document.documentElement);
  const g = v => s.getPropertyValue(v).trim();
  return {
    tooltipBg: g('--bg-card'), tooltipTitle: g('--text-primary'),
    tooltipBody: g('--text-secondary'), tooltipBorder: g('--border'),
    tickColor: g('--text-muted'), gridColor: g('--chart-grid'),
    legendColor: g('--text-secondary'), lineColor: g('--accent'),
    lineFill: getTheme() === 'light' ? 'rgba(59,124,245,0.1)' : 'rgba(79,140,255,0.1)',
    canvasTooltipBg: g('--chart-tooltip-bg'), canvasTooltipText: g('--text-primary'),
    chronoLineColor: g('--text-muted'),
    green: g('--green'), red: g('--red'), yellow: g('--yellow'),
  };
}

function destroyAllCharts() {
  for (const c of Object.values(chartInstances)) c.destroy();
  chartInstances = {};
}
function countFlagged(markers) {
  let c = 0;
  for (const m of markers) { const i = getLatestValueIndex(m.values); if (i!==-1) { const r = getEffectiveRange(m); if (getStatus(m.values[i],r.min,r.max)!=="normal") c++; } }
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
      if (i!==-1) { const v=m.values[i], r=getEffectiveRange(m), s=getStatus(v,r.min,r.max);
        if (s==="high"||s==="low") flags.push({categoryKey:ck,markerKey:k,id:ck+'_'+k,name:m.name,value:formatValue(v),rawValue:v,unit:m.unit,refMin:m.refMin,refMax:m.refMax,optimalMin:m.optimalMin,optimalMax:m.optimalMax,effectiveMin:r.min,effectiveMax:r.max,status:s});
      }
    }
  }
  return flags;
}
function statusIcon(s) {
  if (s === 'normal') return '\u2713';
  if (s === 'high') return '\u25B2';
  if (s === 'low') return '\u25BC';
  return '';
}
function linearRegression(points) {
  const n = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += points[i];
    sumXY += i * points[i]; sumX2 += i * i; sumY2 += points[i] * points[i];
  }
  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return { slope: 0, intercept: points[0] || 0, r2: 0 };
  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const ssTot = sumY2 - (sumY * sumY) / n;
  const ssRes = points.reduce((s, y, i) => { const e = y - (intercept + slope * i); return s + e * e; }, 0);
  const r2 = ssTot > 0 ? 1 - ssRes / ssTot : 0;
  return { slope, intercept, r2 };
}

function detectTrendAlerts(data) {
  const alerts = [];
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) continue;
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      if (marker.singlePoint) continue;
      const nonNull = marker.values.map((v, i) => ({ v, i })).filter(x => x.v !== null);
      if (nonNull.length < 2) continue;
      const r = getEffectiveRange(marker);
      if (r.min == null || r.max == null) continue;
      const range = r.max - r.min;
      if (range <= 0) continue;
      const id = catKey + '_' + mKey;
      const latestVal = nonNull[nonNull.length - 1].v;
      const prevVal = nonNull[nonNull.length - 2].v;
      const sparkVals = nonNull.slice(-Math.min(5, nonNull.length));

      // Sudden change detection (2+ values)
      const jump = Math.abs(latestVal - prevVal);
      if (jump > range * 0.25) {
        if (latestVal > r.max) {
          alerts.push({ id, name: marker.name, category: cat.label, concern: 'sudden_high',
            spark: sparkVals.map(x => formatValue(x.v)), direction: 'rising' });
          continue;
        }
        if (latestVal < r.min) {
          alerts.push({ id, name: marker.name, category: cat.label, concern: 'sudden_low',
            spark: sparkVals.map(x => formatValue(x.v)), direction: 'falling' });
          continue;
        }
      }

      // Linear regression (3+ values)
      if (nonNull.length < 3) continue;
      const vals = nonNull.map(x => x.v);
      const reg = linearRegression(vals);
      const normSlope = reg.slope / range;
      if (Math.abs(normSlope) < 0.02) continue;
      // R-squared filter only for 4+ points (2-3 points inherently have high R²)
      if (nonNull.length >= 4 && reg.r2 < 0.5) continue;
      const rising = normSlope > 0;
      let concern = null;
      if (rising && latestVal > r.max) concern = 'past_high';
      else if (!rising && latestVal < r.min) concern = 'past_low';
      else if (rising && latestVal >= r.max - range * 0.15) concern = 'approaching_high';
      else if (!rising && latestVal <= r.min + range * 0.15) concern = 'approaching_low';
      if (!concern) continue;
      alerts.push({ id, name: marker.name, category: cat.label, concern,
        spark: sparkVals.map(x => formatValue(x.v)), direction: rising ? 'rising' : 'falling' });
    }
  }
  // Sort: sudden first, then past, then approaching
  alerts.sort((a, b) => {
    const priority = c => c.startsWith('sudden_') ? 0 : c.startsWith('past_') ? 1 : 2;
    return priority(a.concern) - priority(b.concern);
  });
  return alerts;
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
  const data = getActiveData();
  const activeNav = document.querySelector(".nav-item.active");
  const currentCategory = activeNav ? activeNav.dataset.category : "dashboard";
  buildSidebar(data);
  updateHeaderDates(data);
  navigate(currentCategory, data);
}

function getEffectiveRange(marker) {
  if (rangeMode === 'optimal' || rangeMode === 'both') {
    if (marker.optimalMin != null && marker.optimalMax != null) {
      return { min: marker.optimalMin, max: marker.optimalMax };
    }
  }
  return { min: marker.refMin, max: marker.refMax };
}

function switchRangeMode(mode) {
  rangeMode = mode;
  localStorage.setItem(profileStorageKey(currentProfile, 'rangeMode'), mode);
  updateHeaderRangeToggle();
  const data = getActiveData();
  const activeNav = document.querySelector(".nav-item.active");
  const currentCategory = activeNav ? activeNav.dataset.category : "dashboard";
  buildSidebar(data);
  navigate(currentCategory, data);
}

function updateHeaderDates(data) {
  if (!data) data = getActiveData();
  const el = document.getElementById("header-dates");
  if (el) {
    if (data.dateLabels.length > 0) {
      const labels = data.dateLabels;
      const dateText = labels.length === 1 ? labels[0] : `${labels[0]} – ${labels[labels.length - 1]}`;
      el.innerHTML = `<span class="label">Dates:</span> ${dateText}`;
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  }
}

function updateHeaderRangeToggle() {
  const el = document.getElementById('header-range-toggle');
  if (!el) return;
  el.innerHTML = ['optimal', 'reference', 'both'].map(m =>
    `<button class="range-toggle-btn${rangeMode === m ? ' active' : ''}" onclick="switchRangeMode('${m}')">${m.charAt(0).toUpperCase() + m.slice(1)}</button>`
  ).join('');
}

// ═══════════════════════════════════════════════
// COMPARE TWO DATES
// ═══════════════════════════════════════════════
function showCompare(data) {
  if (!data) data = getActiveData();
  const main = document.getElementById("main-content");
  let html = `<div class="category-header"><h2>\u2194 Compare Dates</h2>
    <p>Side-by-side comparison of biomarker values between two collection dates</p></div>`;
  if (data.dates.length < 2) {
    html += `<div class="empty-state"><div class="empty-state-icon">\u2194</div>
      <h3>Not Enough Data</h3><p>Import at least 2 lab result dates to compare values side by side.</p></div>`;
    main.innerHTML = html;
    return;
  }
  if (!compareDate1 || !data.dates.includes(compareDate1)) compareDate1 = data.dates[0];
  if (!compareDate2 || !data.dates.includes(compareDate2)) compareDate2 = data.dates[data.dates.length - 1];
  const fmtOpt = d => {
    const label = new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `<option value="${d}">${label}</option>`;
  };
  html += `<div class="compare-controls">
    <label>Date 1:</label>
    <select id="compare-select-1" onchange="compareDate1=this.value;updateCompare()">${data.dates.map(d => fmtOpt(d)).join('')}</select>
    <button class="compare-swap-btn" onclick="swapCompareDates()" title="Swap dates">\u21C4</button>
    <label>Date 2:</label>
    <select id="compare-select-2" onchange="compareDate2=this.value;updateCompare()">${data.dates.map(d => fmtOpt(d)).join('')}</select>
  </div>`;
  html += `<div id="compare-results"></div>`;
  main.innerHTML = html;
  document.getElementById('compare-select-1').value = compareDate1;
  document.getElementById('compare-select-2').value = compareDate2;
  updateCompare();
}

function updateCompare() {
  const data = getActiveData();
  const container = document.getElementById('compare-results');
  if (!container) return;
  const idx1 = data.dates.indexOf(compareDate1);
  const idx2 = data.dates.indexOf(compareDate2);
  if (idx1 === -1 || idx2 === -1) { container.innerHTML = ''; return; }
  container.innerHTML = renderCompareTable(data, idx1, idx2);
}

function swapCompareDates() {
  const tmp = compareDate1;
  compareDate1 = compareDate2;
  compareDate2 = tmp;
  const s1 = document.getElementById('compare-select-1');
  const s2 = document.getElementById('compare-select-2');
  if (s1) s1.value = compareDate1;
  if (s2) s2.value = compareDate2;
  updateCompare();
}

function renderCompareTable(data, idx1, idx2) {
  const d1Label = data.dateLabels[idx1];
  const d2Label = data.dateLabels[idx2];
  let html = `<div class="compare-table-wrapper"><table class="compare-table"><thead><tr>
    <th>Biomarker</th><th>Unit</th><th>Reference</th>
    <th>${d1Label}</th><th>${d2Label}</th><th>Delta</th><th>% Change</th></tr></thead><tbody>`;
  for (const [catKey, cat] of Object.entries(data.categories)) {
    if (cat.singlePoint) continue;
    const rows = [];
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      const v1 = marker.values[idx1];
      const v2 = marker.values[idx2];
      if (v1 === null && v2 === null) continue;
      const mr = getEffectiveRange(marker);
      const s1 = v1 !== null ? getStatus(v1, mr.min, mr.max) : 'missing';
      const s2 = v2 !== null ? getStatus(v2, mr.min, mr.max) : 'missing';
      let delta = null, pctChange = null, directionClass = 'compare-neutral';
      if (v1 !== null && v2 !== null) {
        delta = v2 - v1;
        pctChange = v1 !== 0 ? (delta / v1) * 100 : null;
        if (mr.min != null && mr.max != null) {
          const mid = (mr.min + mr.max) / 2;
          const dist1 = Math.abs(v1 - mid);
          const dist2 = Math.abs(v2 - mid);
          if (dist2 < dist1 - 0.001) directionClass = 'compare-improved';
          else if (dist2 > dist1 + 0.001) directionClass = 'compare-worsened';
        }
      }
      const refStr = marker.refMin != null && marker.refMax != null ? `${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}` : '\u2014';
      rows.push(`<tr>
        <td class="marker-name">${marker.name}</td>
        <td style="color:var(--text-muted);font-size:12px">${marker.unit}</td>
        <td style="color:var(--text-secondary);font-size:12px">${refStr}</td>
        <td class="value-cell val-${s1}" style="font-weight:600">${v1 !== null ? formatValue(v1) : '\u2014'}</td>
        <td class="value-cell val-${s2}" style="font-weight:600">${v2 !== null ? formatValue(v2) : '\u2014'}</td>
        <td class="${directionClass}" style="font-weight:600">${delta !== null ? (delta > 0 ? '+' : '') + formatValue(delta) : '\u2014'}</td>
        <td class="${directionClass}" style="font-weight:600">${pctChange !== null ? (pctChange > 0 ? '+' : '') + pctChange.toFixed(1) + '%' : '\u2014'}</td>
      </tr>`);
    }
    if (rows.length > 0) {
      html += `<tr class="cat-row"><td colspan="7">${cat.icon} ${cat.label}</td></tr>`;
      html += rows.join('');
    }
  }
  html += `</tbody></table></div>`;
  return html;
}

// ═══════════════════════════════════════════════
// CORRELATIONS
// ═══════════════════════════════════════════════
function showCorrelations(data) {
  if (!data) data = getActiveData();
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
    <h3>Normalized Comparison (% of Reference Range)
      <button class="corr-ask-ai-btn" onclick="askAIAboutCorrelations()" title="Ask AI about these correlations">Ask AI</button>
    </h3>
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
  const tc = getChartColors();
  chartInstances["correlation"] = new Chart(canvas, {
    type: "line",
    data: { labels: data.dateLabels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: tc.legendColor, font: { size: 12 }, usePointStyle: true, pointStyle: "circle" } },
        tooltip: {
          backgroundColor: tc.tooltipBg, titleColor: tc.tooltipTitle, bodyColor: tc.tooltipBody,
          borderColor: tc.tooltipBorder, borderWidth: 1,
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
        x: { ticks: { color: tc.tickColor, font: { size: 11 } }, grid: { display: false } },
        y: { min: minY, max: maxY, ticks: { color: tc.tickColor, font: { size: 10 }, callback: v => v + '%' }, grid: { color: tc.gridColor } }
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
  const batchCtx = window._batchImportContext;
  const batchLabel = batchCtx ? `<div class="batch-counter">File ${batchCtx.current} of ${batchCtx.total}</div>` : '';
  let html = `<button class="modal-close" onclick="closeImportModal()">&times;</button>
    ${batchLabel}<h3>Import Preview</h3>
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
  const cancelLabel = batchCtx ? 'Skip' : 'Cancel';
  html += `<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px">
    <button class="import-btn import-btn-secondary" onclick="closeImportModal()">${cancelLabel}</button>
    <button class="import-btn import-btn-primary" onclick="confirmImport()">Import ${importCount} Markers</button></div>`;
  window._pendingImport = parseResult;
  modal.innerHTML = html;
  overlay.classList.add("show");
}

function closeImportModal() {
  document.getElementById("import-modal-overlay").classList.remove("show");
  window._pendingImport = null;
  if (window._batchImportResolve) {
    const resolve = window._batchImportResolve;
    window._batchImportResolve = null;
    window._batchImportContext = null;
    resolve('skip');
  }
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
  // Resolve batch promise before closeImportModal (which would resolve with 'skip')
  if (window._batchImportResolve) {
    const resolve = window._batchImportResolve;
    window._batchImportResolve = null;
    window._batchImportContext = null;
    document.getElementById("import-modal-overlay").classList.remove("show");
    window._pendingImport = null;
    resolve('import');
  } else {
    closeImportModal();
  }
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

function openSleepCircadianEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.sleepCircadian || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Sleep & Circadian</h3>
    <div class="modal-unit">Describe your sleep patterns, schedule, light exposure, and circadian habits. The AI will factor this in when interpreting your lab results.</div>
    <textarea class="note-editor" id="sleep-circadian-textarea" placeholder="e.g. Sleep 7h (11pm–6am), morning sunlight, no shift work, blue light blockers after 8pm, sleep apnea, use CPAP...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveSleepCircadian()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearSleepCircadian()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('sleep-circadian-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveSleepCircadian() {
  const ta = document.getElementById('sleep-circadian-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.sleepCircadian = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Sleep & circadian saved' : 'Sleep & circadian cleared', 'success');
}

function clearSleepCircadian() {
  importedData.sleepCircadian = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Sleep & circadian cleared', 'info');
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


// ═══════════════════════════════════════════════
// HEALTH GOALS
// ═══════════════════════════════════════════════
function openHealthGoalsEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  renderHealthGoalsModal(modal);
  overlay.classList.add("show");
}

function renderHealthGoalsModal(modal) {
  const goals = importedData.healthGoals || [];
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Health Goals</h3>
    <div class="modal-unit">List things you want to solve or improve. The AI will prioritize analysis around your stated goals.</div>`;
  if (goals.length > 0) {
    html += `<div class="goals-list">`;
    for (let i = 0; i < goals.length; i++) {
      const g = goals[i];
      html += `<div class="goals-list-item">
        <span class="goals-severity-badge severity-${g.severity}">${g.severity}</span>
        <span class="goals-text">${escapeHTML(g.text)}</span>
        <button class="goals-delete-btn" onclick="deleteHealthGoal(${i})" title="Remove">&times;</button>
      </div>`;
    }
    html += `</div>`;
  }
  html += `<div class="goals-add-row">
    <input type="text" class="goals-text-input" id="goal-text-input" placeholder="e.g. Improve insulin sensitivity, Optimize thyroid function">
    <select class="goals-severity-select" id="goal-severity-select">
      <option value="major">Major</option>
      <option value="mild">Mild</option>
      <option value="minor">Minor</option>
    </select>
    <button class="import-btn import-btn-primary" onclick="addHealthGoal()">Add</button>
  </div>
  <div class="note-editor-actions" style="margin-top:16px">
    <button class="import-btn import-btn-secondary" onclick="closeModal()">Done</button>
    ${goals.length > 0 ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearHealthGoals()">Clear All</button>` : ''}
  </div>`;
  modal.innerHTML = html;
  setTimeout(() => {
    const input = document.getElementById('goal-text-input');
    if (input) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addHealthGoal(); }
      });
    }
  }, 50);
}

function addHealthGoal() {
  const input = document.getElementById('goal-text-input');
  const select = document.getElementById('goal-severity-select');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  if (!importedData.healthGoals) importedData.healthGoals = [];
  importedData.healthGoals.push({ text, severity: select.value });
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  renderHealthGoalsModal(document.getElementById("detail-modal"));
}

function deleteHealthGoal(idx) {
  if (!importedData.healthGoals) return;
  importedData.healthGoals.splice(idx, 1);
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  renderHealthGoalsModal(document.getElementById("detail-modal"));
}

function clearHealthGoals() {
  importedData.healthGoals = [];
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Health goals cleared', 'info');
}

// ═══════════════════════════════════════════════
// INTERPRETIVE LENS
// ═══════════════════════════════════════════════
function openInterpretiveLensEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.interpretiveLens || '';
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Interpretive Lens</h3>
    <div class="modal-unit">List researchers, clinicians, or scientific paradigms whose frameworks you follow. The AI will consider their perspectives when interpreting your results.</div>
    <textarea class="note-editor" id="interpretive-lens-textarea" placeholder="e.g. Peter Attia (longevity), Jack Kruse (quantum biology), Functional Endocrinology framework...">${escapeHTML(current)}</textarea>
    <div class="note-editor-actions">
      <button class="import-btn import-btn-primary" onclick="saveInterpretiveLens()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${current ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearInterpretiveLens()">Clear</button>` : ''}
    </div>`;
  overlay.classList.add("show");
  setTimeout(() => {
    const ta = document.getElementById('interpretive-lens-textarea');
    if (ta) ta.focus();
  }, 50);
}

function saveInterpretiveLens() {
  const ta = document.getElementById('interpretive-lens-textarea');
  const text = ta ? ta.value.trim() : '';
  importedData.interpretiveLens = text || '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Interpretive lens saved' : 'Interpretive lens cleared', 'success');
}

function clearInterpretiveLens() {
  importedData.interpretiveLens = '';
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Interpretive lens cleared', 'info');
}

// ═══════════════════════════════════════════════
// MENSTRUAL CYCLE TRACKING
// ═══════════════════════════════════════════════
function getCyclePhase(dateStr, mc) {
  if (!mc || !mc.periods || mc.periods.length === 0) return null;
  const target = new Date(dateStr + 'T00:00:00');
  const sorted = mc.periods.slice().sort((a, b) => b.startDate.localeCompare(a.startDate));
  let periodStart = null;
  for (const p of sorted) {
    if (new Date(p.startDate + 'T00:00:00') <= target) {
      periodStart = p.startDate;
      break;
    }
  }
  if (!periodStart) return null;
  const startDate = new Date(periodStart + 'T00:00:00');
  const cycleDay = Math.floor((target - startDate) / 86400000) + 1;
  const cycleLen = mc.cycleLength || 28;
  if (cycleDay > cycleLen + 7) return null; // too far from any known period
  const periodLen = mc.periodLength || 5;
  const ovulationDay = cycleLen - 14;
  let phase, phaseName;
  if (cycleDay <= periodLen) {
    phase = 'menstrual'; phaseName = 'Menstrual';
  } else if (cycleDay < ovulationDay - 1) {
    phase = 'follicular'; phaseName = 'Follicular';
  } else if (cycleDay <= ovulationDay + 1) {
    phase = 'ovulatory'; phaseName = 'Ovulatory';
  } else {
    phase = 'luteal'; phaseName = 'Luteal';
  }
  return { cycleDay, phase, phaseName };
}

function getNextBestDrawDate(mc) {
  if (!mc || !mc.periods || mc.periods.length === 0) return null;
  const sorted = mc.periods.slice().sort((a, b) => b.startDate.localeCompare(a.startDate));
  const lastStart = new Date(sorted[0].startDate + 'T00:00:00');
  const cycleLen = mc.cycleLength || 28;
  const today = new Date(); today.setHours(0,0,0,0);
  // Find the most recent predicted period start (on or before today)
  let currentPeriodStart = new Date(lastStart.getTime());
  while (currentPeriodStart.getTime() + cycleLen * 86400000 <= today.getTime()) {
    currentPeriodStart = new Date(currentPeriodStart.getTime() + cycleLen * 86400000);
  }
  // Check if today falls within the current cycle's draw window (days 3-5)
  const currentDrawStart = new Date(currentPeriodStart.getTime() + 2 * 86400000);
  const currentDrawEnd = new Date(currentPeriodStart.getTime() + 4 * 86400000);
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (today >= currentDrawStart && today <= currentDrawEnd) {
    const dayInCycle = Math.floor((today - currentPeriodStart) / 86400000) + 1;
    return {
      startDate: currentDrawStart.toISOString().slice(0, 10),
      endDate: currentDrawEnd.toISOString().slice(0, 10),
      description: `Now is ideal! Today is day ${dayInCycle} (early follicular)`
    };
  }
  // Otherwise recommend the next cycle's window
  if (today > currentDrawEnd) {
    currentPeriodStart = new Date(currentPeriodStart.getTime() + cycleLen * 86400000);
  }
  const drawStart = new Date(currentPeriodStart.getTime() + 2 * 86400000);
  const drawEnd = new Date(currentPeriodStart.getTime() + 4 * 86400000);
  return {
    startDate: drawStart.toISOString().slice(0, 10),
    endDate: drawEnd.toISOString().slice(0, 10),
    description: `~${fmt(drawStart)}-${fmt(drawEnd)} (days 3-5, early follicular)`
  };
}

function getBloodDrawPhases(mc, dates) {
  if (!mc || !dates) return {};
  const phases = {};
  for (const d of dates) {
    const p = getCyclePhase(d, mc);
    if (p) phases[d] = p;
  }
  return phases;
}

function openMenstrualCycleEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const mc = importedData.menstrualCycle || {};
  const periods = (mc.periods || []).slice().sort((a, b) => b.startDate.localeCompare(a.startDate));
  const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Menstrual Cycle</h3>
    <div class="modal-unit">Track your cycle so AI can interpret hormone, iron, and inflammation markers in context of cycle phase.</div>
    <div class="cycle-editor-form">
      <div class="supp-form-row">
        <div class="supp-form-field">
          <label>Average Cycle Length (days)</label>
          <input type="number" id="mc-cycle-length" value="${mc.cycleLength || 28}" min="20" max="45">
        </div>
        <div class="supp-form-field">
          <label>Average Period Length (days)</label>
          <input type="number" id="mc-period-length" value="${mc.periodLength || 5}" min="2" max="10">
        </div>
      </div>
      <div class="supp-form-row">
        <div class="supp-form-field">
          <label>Regularity</label>
          <select id="mc-regularity">
            <option value="regular"${mc.regularity === 'regular' || !mc.regularity ? ' selected' : ''}>Regular</option>
            <option value="irregular"${mc.regularity === 'irregular' ? ' selected' : ''}>Irregular</option>
            <option value="very_irregular"${mc.regularity === 'very_irregular' ? ' selected' : ''}>Very Irregular</option>
          </select>
        </div>
        <div class="supp-form-field">
          <label>Flow Strength</label>
          <select id="mc-flow">
            <option value="light"${mc.flow === 'light' ? ' selected' : ''}>Light</option>
            <option value="moderate"${mc.flow === 'moderate' || !mc.flow ? ' selected' : ''}>Moderate</option>
            <option value="heavy"${mc.flow === 'heavy' ? ' selected' : ''}>Heavy</option>
          </select>
        </div>
      </div>
      <div class="supp-form-row">
        <div class="supp-form-field">
          <label>Contraceptive</label>
          <input type="text" id="mc-contraceptive" value="${escapeHTML(mc.contraceptive || '')}" placeholder="e.g. IUD (Mirena), OCP, none">
        </div>
        <div class="supp-form-field">
          <label>Conditions</label>
          <input type="text" id="mc-conditions" value="${escapeHTML(mc.conditions || '')}" placeholder="e.g. PCOS, endometriosis, fibroids">
        </div>
      </div>
    </div>
    <div style="border-top:1px solid var(--border);margin-top:16px;padding-top:16px">
      <div class="supp-form-title">Period Log</div>`;
  if (periods.length > 0) {
    html += `<div class="supp-list">`;
    for (let i = 0; i < periods.length; i++) {
      const p = periods[i];
      const flowCls = p.flow === 'heavy' ? 'severity-major' : p.flow === 'light' ? 'severity-minor' : 'severity-mild';
      html += `<div class="supp-list-item">
        <span class="supp-list-icon">\uD83D\uDD34</span>
        <div class="supp-list-info">
          <div class="supp-list-name">${fmtDate(p.startDate)} \u2013 ${fmtDate(p.endDate)}</div>
          <div class="supp-list-meta"><span class="goals-severity-badge ${flowCls}">${p.flow || 'moderate'}</span>${p.notes ? ' ' + escapeHTML(p.notes) : ''}</div>
        </div>
        <div class="supp-list-actions">
          <button class="delete" onclick="deletePeriodEntry('${p.startDate}')">\u2715</button>
        </div>
      </div>`;
    }
    html += `</div>`;
  }
  const today = new Date().toISOString().slice(0, 10);
  const defaultEnd = new Date(Date.now() + ((mc.periodLength || 5) - 1) * 86400000).toISOString().slice(0, 10);
  html += `<div class="supp-form-row">
        <div class="supp-form-field">
          <label>Start Date</label>
          <input type="date" id="mc-period-start" value="${today}">
        </div>
        <div class="supp-form-field">
          <label>End Date</label>
          <input type="date" id="mc-period-end" value="${defaultEnd}">
        </div>
        <div class="supp-form-field">
          <label>Flow</label>
          <select id="mc-period-flow">
            <option value="light">Light</option>
            <option value="moderate" selected>Moderate</option>
            <option value="heavy">Heavy</option>
          </select>
        </div>
      </div>
      <div class="supp-form-row">
        <div class="supp-form-field" style="flex:2">
          <label>Notes (optional)</label>
          <input type="text" id="mc-period-notes" placeholder="e.g. cramps, spotting">
        </div>
        <div class="supp-form-field" style="flex:0;align-self:flex-end">
          <button class="import-btn import-btn-primary" style="padding:8px 16px" onclick="addPeriodEntry()">Add</button>
        </div>
      </div>
    </div>
    <div class="note-editor-actions" style="margin-top:16px">
      <button class="import-btn import-btn-primary" onclick="saveMenstrualCycle()">Save</button>
      <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
      ${importedData.menstrualCycle ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearMenstrualCycle()">Clear All</button>` : ''}
    </div>`;
  modal.innerHTML = html;
  overlay.classList.add("show");
}

function saveMenstrualCycle() {
  syncMenstrualCycleProfileFromForm();
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Menstrual cycle profile saved', 'success');
}

function clearMenstrualCycle() {
  showConfirmDialog('Clear all menstrual cycle data? This cannot be undone.', () => {
    importedData.menstrualCycle = null;
    localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
    closeModal();
    const activeNav = document.querySelector(".nav-item.active");
    navigate(activeNav ? activeNav.dataset.category : "dashboard");
    showNotification('Menstrual cycle data cleared', 'info');
  });
}

function syncMenstrualCycleProfileFromForm() {
  const cycleLength = Math.max(20, Math.min(45, parseInt(document.getElementById('mc-cycle-length').value) || 28));
  const periodLength = Math.max(2, Math.min(10, parseInt(document.getElementById('mc-period-length').value) || 5));
  const regularity = document.getElementById('mc-regularity').value;
  const flow = document.getElementById('mc-flow').value;
  const contraceptive = document.getElementById('mc-contraceptive').value.trim();
  const conditions = document.getElementById('mc-conditions').value.trim();
  if (!importedData.menstrualCycle) {
    importedData.menstrualCycle = { cycleLength, periodLength, regularity, flow, contraceptive, conditions, periods: [] };
  } else {
    Object.assign(importedData.menstrualCycle, { cycleLength, periodLength, regularity, flow, contraceptive, conditions });
  }
}

function addPeriodEntry() {
  const startDate = document.getElementById('mc-period-start').value;
  const endDate = document.getElementById('mc-period-end').value;
  const flow = document.getElementById('mc-period-flow').value;
  const notes = document.getElementById('mc-period-notes').value.trim();
  if (!startDate) { showNotification('Start date is required', 'error'); return; }
  if (!endDate) { showNotification('End date is required', 'error'); return; }
  if (endDate < startDate) { showNotification('End date must be on or after start date', 'error'); return; }
  syncMenstrualCycleProfileFromForm();
  const exists = importedData.menstrualCycle.periods.some(p => p.startDate === startDate);
  if (exists) { showNotification('A period entry with this start date already exists', 'error'); return; }
  importedData.menstrualCycle.periods.push({ startDate, endDate, flow, notes });
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  openMenstrualCycleEditor();
}

function deletePeriodEntry(startDate) {
  if (!importedData.menstrualCycle || !importedData.menstrualCycle.periods) return;
  syncMenstrualCycleProfileFromForm();
  importedData.menstrualCycle.periods = importedData.menstrualCycle.periods.filter(p => p.startDate !== startDate);
  localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  openMenstrualCycleEditor();
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
    const jsonFiles = files.filter(f => f.name.endsWith('.json') || f.type === 'application/json');
    const pdfFiles = files.filter(f => f.name.endsWith('.pdf') || f.type === 'application/pdf');
    const unsupported = files.length - jsonFiles.length - pdfFiles.length;
    if (unsupported > 0 && jsonFiles.length === 0 && pdfFiles.length === 0) {
      showNotification("Unsupported file type. Use PDF or JSON.", "error");
      return;
    }
    for (const f of jsonFiles) importDataJSON(f);
    if (pdfFiles.length === 1) await handlePDFFile(pdfFiles[0]);
    else if (pdfFiles.length > 1) await handleBatchPDFs(pdfFiles);
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
// BATCH PDF IMPORT
// ═══════════════════════════════════════════════
async function handleBatchPDFs(pdfFiles) {
  if (!hasApiKey()) {
    showNotification("API key required for PDF import. Opening settings...", "info");
    setTimeout(() => openSettingsModal(), 500);
    return;
  }
  let imported = 0, skipped = 0, failed = 0;
  for (let i = 0; i < pdfFiles.length; i++) {
    const file = pdfFiles[i];
    try {
      await showBatchImportProgress(0, file.name, i + 1, pdfFiles.length);
      const pdfText = await extractPDFText(file);
      if (!pdfText.trim()) { showNotification(`${file.name}: PDF appears empty`, 'error'); failed++; continue; }
      await showBatchImportProgress(1, file.name, i + 1, pdfFiles.length);
      const result = await parseLabPDFWithAI(pdfText, file.name);
      if (result.markers.length === 0) { showNotification(`${file.name}: No markers found`, 'error'); failed++; continue; }
      await showBatchImportProgress(2, file.name, i + 1, pdfFiles.length);
      const action = await showImportPreviewAsync(result, file.name, i + 1, pdfFiles.length);
      if (action === 'skip') { skipped++; } else { imported++; }
    } catch (err) {
      console.error(`Batch import error (${file.name}):`, err);
      showNotification(`Error: ${file.name} — ${err.message}`, 'error');
      failed++;
    }
  }
  hideImportProgress();
  const parts = [];
  if (imported > 0) parts.push(`${imported} imported`);
  if (skipped > 0) parts.push(`${skipped} skipped`);
  if (failed > 0) parts.push(`${failed} failed`);
  showNotification(`Batch import complete: ${parts.join(', ')}`, imported > 0 ? 'success' : 'info');
}

async function showBatchImportProgress(step, fileName, current, total) {
  const dropZone = document.getElementById("drop-zone");
  if (!dropZone) return;
  let html = `<div class="batch-progress-counter">Processing file ${current} of ${total}</div>`;
  html += '<div class="import-progress">';
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
  await new Promise(r => requestAnimationFrame(() => setTimeout(r, 0)));
}

function showImportPreviewAsync(result, fileName, current, total) {
  return new Promise(resolve => {
    window._batchImportResolve = resolve;
    window._batchImportContext = { current, total };
    showImportPreview(result);
  });
}

// ═══════════════════════════════════════════════
// PDF REPORT EXPORT
// ═══════════════════════════════════════════════
function exportPDFReport() {
  const rawData = getActiveData();
  const data = filterDatesByRange(rawData);
  const profiles = getProfiles();
  const profileName = (profiles.find(p => p.id === currentProfile) || { name: 'Profile' }).name;
  const sexLabel = profileSex === 'female' ? 'Female' : profileSex === 'male' ? 'Male' : 'Not specified';
  const flags = getAllFlaggedMarkers(data);
  const notes = (importedData.notes || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const supps = importedData.supplements || [];
  const contextSections = [];
  if (importedData.diagnoses) contextSections.push({ title: 'Medical Conditions', text: importedData.diagnoses });
  if (importedData.diet) contextSections.push({ title: 'Diet', text: importedData.diet });
  if (importedData.exercise) contextSections.push({ title: 'Exercise & Movement', text: importedData.exercise });
  if (importedData.sleepCircadian) contextSections.push({ title: 'Sleep & Circadian', text: importedData.sleepCircadian });
  if (importedData.interpretiveLens) contextSections.push({ title: 'Interpretive Lens', text: importedData.interpretiveLens });
  const hg = importedData.healthGoals || [];
  if (hg.length) {
    const goalsText = hg.map(g => `[${g.severity}] ${g.text}`).join('\n');
    contextSections.push({ title: 'Health Goals', text: goalsText });
  }
  const mc = importedData.menstrualCycle;
  if (mc && profileSex === 'female') {
    const regLabel = mc.regularity === 'very_irregular' ? 'very irregular' : mc.regularity || 'regular';
    let cycleText = `${mc.cycleLength || 28}-day cycle, ${regLabel}, ${mc.flow || 'moderate'} flow`;
    if (mc.contraceptive) cycleText += `. Contraceptive: ${mc.contraceptive}`;
    if (mc.conditions) cycleText += `. Conditions: ${mc.conditions}`;
    const phases = getBloodDrawPhases(mc, data.dates);
    const phaseDates = Object.entries(phases);
    if (phaseDates.length > 0) {
      cycleText += '\n\nBlood draw phases:\n' + phaseDates.map(([d, p]) => `${d}: Day ${p.cycleDay} (${p.phaseName})`).join('\n');
    }
    contextSections.push({ title: 'Menstrual Cycle', text: cycleText });
  }

  const html = buildReportHTML(profileName, sexLabel, data, flags, notes, supps, contextSections);
  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 600);
}

function buildReportHTML(profileName, sexLabel, data, flags, notes, supps, contextSections) {
  const now = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const dateRange = data.dateLabels.length > 0
    ? `${data.dateLabels[0]} \u2013 ${data.dateLabels[data.dateLabels.length - 1]}`
    : 'No dates';
  const unitLabel = unitSystem === 'US' ? 'US (conventional)' : 'EU (SI)';
  const fmtDate = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  let body = '';

  // Header
  body += `<div class="report-header">
    <h1>LabCharts Report</h1>
    <div class="report-meta">
      <span><strong>Profile:</strong> ${esc(profileName)}</span>
      <span><strong>Sex:</strong> ${sexLabel}</span>
      <span><strong>Units:</strong> ${unitLabel}</span>
      <span><strong>Date range:</strong> ${dateRange}</span>
      <span><strong>Generated:</strong> ${now}</span>
    </div>
  </div>`;

  // Flagged Results
  if (flags.length > 0) {
    body += `<h2>Flagged Results</h2><table><thead><tr><th>Biomarker</th><th>Value</th><th>Range</th><th>Status</th></tr></thead><tbody>`;
    for (const f of flags) {
      const cls = f.status === 'high' ? 'val-high' : 'val-low';
      const label = f.status === 'high' ? 'HIGH' : 'LOW';
      body += `<tr><td>${esc(f.name)}</td><td class="${cls}">${f.value} ${esc(f.unit)}</td>
        <td>${formatValue(f.effectiveMin)} \u2013 ${formatValue(f.effectiveMax)}</td><td class="${cls}">${label}</td></tr>`;
    }
    body += `</tbody></table>`;
  }

  // Category tables
  for (const [catKey, cat] of Object.entries(data.categories)) {
    const markersWithData = Object.entries(cat.markers).filter(([_, m]) => m.values && m.values.some(v => v !== null));
    if (markersWithData.length === 0) continue;
    const labels = cat.singleDate ? [cat.singleDateLabel || 'N/A'] : data.dateLabels;
    body += `<h2>${cat.icon} ${esc(cat.label)}</h2><table><thead><tr><th>Biomarker</th><th>Unit</th><th>Reference</th>`;
    if (cat.singleDate) {
      body += `<th>${labels[0]}</th>`;
    } else {
      for (const l of labels) body += `<th>${l}</th>`;
    }
    body += `<th>Trend</th></tr></thead><tbody>`;
    for (const [mKey, marker] of markersWithData) {
      const trend = getTrend(marker.values);
      const r = getEffectiveRange(marker);
      let rangeStr = r.min != null && r.max != null ? `${formatValue(r.min)} \u2013 ${formatValue(r.max)}` : '\u2014';
      if (rangeMode === 'both' && marker.optimalMin != null) {
        rangeStr = `${formatValue(marker.refMin)} \u2013 ${formatValue(marker.refMax)}<br><span class="optimal">opt: ${formatValue(marker.optimalMin)} \u2013 ${formatValue(marker.optimalMax)}</span>`;
      }
      body += `<tr><td>${esc(marker.name)}</td><td class="muted">${esc(marker.unit)}</td><td class="muted">${rangeStr}</td>`;
      for (let i = 0; i < marker.values.length; i++) {
        const v = marker.values[i];
        const s = v !== null ? getStatus(v, r.min, r.max) : 'missing';
        body += `<td class="val-${s}">${v !== null ? formatValue(v) : '\u2014'}</td>`;
      }
      body += `<td>${trend.arrow}</td></tr>`;
    }
    body += `</tbody></table>`;
  }

  // Supplements
  if (supps.length > 0) {
    body += `<h2>Supplements & Medications</h2><table><thead><tr><th>Name</th><th>Dosage</th><th>Type</th><th>Period</th></tr></thead><tbody>`;
    for (const s of supps) {
      body += `<tr><td>${esc(s.name)}</td><td>${esc(s.dosage || '\u2014')}</td><td>${s.type}</td>
        <td>${fmtDate(s.startDate)} \u2192 ${s.endDate ? fmtDate(s.endDate) : 'ongoing'}</td></tr>`;
    }
    body += `</tbody></table>`;
  }

  // Notes
  if (notes.length > 0) {
    body += `<h2>Notes</h2>`;
    for (const n of notes) {
      body += `<div class="note-item"><strong>${fmtDate(n.date)}</strong>: ${esc(n.text)}</div>`;
    }
  }

  // Context sections
  if (contextSections.length > 0) {
    body += `<h2>Profile Context</h2>`;
    for (const s of contextSections) {
      body += `<div class="context-item"><strong>${esc(s.title)}:</strong> ${esc(s.text)}</div>`;
    }
  }

  // Summary for Healthcare Provider
  body += `<h2>Summary for Healthcare Provider</h2>`;
  body += `<p style="font-size:13px;color:#555;margin-bottom:12px">Generated from <strong>${data.dates.length}</strong> collection date${data.dates.length !== 1 ? 's' : ''}${data.dateLabels.length >= 2 ? ` spanning ${data.dateLabels[0]} \u2013 ${data.dateLabels[data.dateLabels.length - 1]}` : ''}.</p>`;

  if (flags.length > 0) {
    body += `<p style="font-size:14px;font-weight:700;margin:12px 0 6px">Out of Range (${flags.length}):</p><ul style="font-size:13px;margin:0 0 12px 20px">`;
    for (const f of flags) {
      const boundary = f.status === 'high' ? f.effectiveMax : f.effectiveMin;
      const diff = f.status === 'high' ? f.rawValue - boundary : boundary - f.rawValue;
      const pctBeyond = boundary !== 0 ? ((diff / boundary) * 100).toFixed(0) : '?';
      body += `<li><strong>${esc(f.name)}</strong>: ${f.value} ${esc(f.unit)} \u2014 <span class="val-${f.status}">${f.status.toUpperCase()}</span> (${pctBeyond}% beyond ${f.status === 'high' ? 'upper' : 'lower'} limit; ref: ${formatValue(f.refMin)}\u2013${formatValue(f.refMax)}${f.optimalMin != null ? ', optimal: ' + formatValue(f.optimalMin) + '\u2013' + formatValue(f.optimalMax) : ''})</li>`;
    }
    body += `</ul>`;
  } else {
    body += `<p style="font-size:13px;color:#059669;margin-bottom:12px"><strong>No out-of-range results.</strong></p>`;
  }

  // Notable trends (>10% change between first and last value)
  const trendItems = [];
  for (const [catKey, cat] of Object.entries(data.categories)) {
    for (const [mKey, marker] of Object.entries(cat.markers)) {
      const nonNull = marker.values.map((v,i) => ({v,i})).filter(x => x.v !== null);
      if (nonNull.length < 2) continue;
      const first = nonNull[0], last = nonNull[nonNull.length - 1];
      if (first.v === 0) continue;
      const pctChange = ((last.v - first.v) / first.v) * 100;
      if (Math.abs(pctChange) > 10) {
        const dir = pctChange > 0 ? 'increased' : 'decreased';
        const firstDate = data.dateLabels[first.i] || '';
        const lastDate = data.dateLabels[last.i] || '';
        trendItems.push(`<li><strong>${esc(marker.name)}</strong> ${dir} ${Math.abs(pctChange).toFixed(0)}% (${formatValue(first.v)} \u2192 ${formatValue(last.v)} ${esc(marker.unit)}, ${firstDate} to ${lastDate})</li>`);
      }
    }
  }
  if (trendItems.length > 0) {
    body += `<p style="font-size:14px;font-weight:700;margin:12px 0 6px">Notable Trends (&gt;10% change):</p><ul style="font-size:13px;margin:0 0 12px 20px">${trendItems.join('')}</ul>`;
  }

  // Summary counts
  let totalWithData = 0, totalInRange = 0;
  for (const cat of Object.values(data.categories)) {
    for (const m of Object.values(cat.markers)) {
      const li = getLatestValueIndex(m.values);
      if (li !== -1) {
        totalWithData++;
        const r = getEffectiveRange(m);
        if (getStatus(m.values[li], r.min, r.max) === 'normal') totalInRange++;
      }
    }
  }
  body += `<p style="font-size:13px;margin-bottom:8px"><strong>Within ${rangeMode === 'reference' ? 'Reference' : 'Optimal'} Range:</strong> ${totalInRange} of ${totalWithData} markers with data</p>`;

  if (supps.length > 0) {
    const suppList = supps.map(s => `${esc(s.name)}${s.dosage ? ' (' + esc(s.dosage) + ')' : ''}`).join(', ');
    body += `<p style="font-size:13px;margin-bottom:8px"><strong>Supplements/Medications:</strong> ${suppList}</p>`;
  }

  body += `<p style="font-size:11px;color:#888;font-style:italic;margin-top:12px">This summary was auto-generated by LabCharts. Values should be interpreted in clinical context.</p>`;

  // Footer
  body += `<div class="report-footer">
    <p>Generated by LabCharts &middot; ${now}</p>
    <p class="disclaimer">This report is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare professional for interpretation of lab results.</p>
  </div>`;

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>LabCharts Report - ${esc(profileName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; line-height: 1.5; padding: 32px; max-width: 1000px; margin: 0 auto; }
  .report-header { border-bottom: 2px solid #333; padding-bottom: 16px; margin-bottom: 24px; }
  .report-header h1 { font-size: 28px; font-weight: 700; }
  .report-meta { display: flex; gap: 20px; flex-wrap: wrap; font-size: 13px; color: #555; margin-top: 8px; }
  h2 { font-size: 18px; font-weight: 700; margin: 28px 0 12px; padding-bottom: 6px; border-bottom: 1px solid #ddd; page-break-after: avoid; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
  th { background: #f5f5f5; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #ddd; }
  td { padding: 6px 10px; border-bottom: 1px solid #eee; font-variant-numeric: tabular-nums; }
  .val-normal { color: #059669; font-weight: 600; }
  .val-high { color: #dc2626; font-weight: 600; }
  .val-low { color: #d97706; font-weight: 600; }
  .val-missing { color: #999; }
  .muted { color: #777; font-size: 11px; }
  .optimal { color: #059669; font-size: 10px; }
  .note-item { padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
  .context-item { padding: 6px 0; font-size: 13px; white-space: pre-line; }
  .report-footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #888; }
  .disclaimer { margin-top: 8px; font-style: italic; }
  @media print {
    body { padding: 16px; }
    h2 { page-break-after: avoid; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
    .report-footer { position: fixed; bottom: 0; width: 100%; }
  }
</style></head><body>${body}</body></html>`;
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
  const exercise = importedData.exercise || '';
  const sleepCircadian = importedData.sleepCircadian || '';
  const interpretiveLens = importedData.interpretiveLens || '';
  const customMarkers = importedData.customMarkers || {};
  const supplements = importedData.supplements || [];
  const healthGoals = importedData.healthGoals || [];
  const menstrualCycle = importedData.menstrualCycle || null;
  const exportObj = { version: 1, exportedAt: new Date().toISOString(), entries, notes, supplements, diagnoses, diet, exercise, sleepCircadian, interpretiveLens, healthGoals, customMarkers, menstrualCycle };
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
      if (json.exercise && typeof json.exercise === 'string' && json.exercise.trim()) {
        importedData.exercise = json.exercise.trim();
      }
      // Import sleep & circadian (new merged field, or migrate old separate fields)
      if (json.sleepCircadian && typeof json.sleepCircadian === 'string' && json.sleepCircadian.trim()) {
        importedData.sleepCircadian = json.sleepCircadian.trim();
      } else {
        const parts = [json.circadian, json.sleep].filter(s => typeof s === 'string' && s.trim());
        if (parts.length) importedData.sleepCircadian = parts.map(s => s.trim()).join('\n\n');
      }
      // Import interpretive lens (new merged field, or migrate old separate fields)
      if (json.interpretiveLens && typeof json.interpretiveLens === 'string' && json.interpretiveLens.trim()) {
        importedData.interpretiveLens = json.interpretiveLens.trim();
      } else {
        const parts = [json.fieldExperts, json.fieldLens].filter(s => typeof s === 'string' && s.trim());
        if (parts.length) importedData.interpretiveLens = parts.map(s => s.trim()).join('\n\n');
      }
      // Import health goals (merge, deduplicate by text)
      if (json.healthGoals && Array.isArray(json.healthGoals)) {
        if (!importedData.healthGoals) importedData.healthGoals = [];
        for (const g of json.healthGoals) {
          if (!g.text || !g.severity) continue;
          const exists = importedData.healthGoals.some(x => x.text === g.text);
          if (!exists) importedData.healthGoals.push({ text: g.text, severity: g.severity });
        }
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
      // Import menstrual cycle
      if (json.menstrualCycle && typeof json.menstrualCycle === 'object') {
        if (!importedData.menstrualCycle) {
          importedData.menstrualCycle = json.menstrualCycle;
        } else {
          // Merge: overwrite profile fields, merge periods by startDate
          const mc = importedData.menstrualCycle;
          mc.cycleLength = json.menstrualCycle.cycleLength || mc.cycleLength;
          mc.periodLength = json.menstrualCycle.periodLength || mc.periodLength;
          mc.regularity = json.menstrualCycle.regularity || mc.regularity;
          mc.flow = json.menstrualCycle.flow || mc.flow;
          if (json.menstrualCycle.contraceptive) mc.contraceptive = json.menstrualCycle.contraceptive;
          if (json.menstrualCycle.conditions) mc.conditions = json.menstrualCycle.conditions;
          if (json.menstrualCycle.periods && Array.isArray(json.menstrualCycle.periods)) {
            if (!mc.periods) mc.periods = [];
            for (const p of json.menstrualCycle.periods) {
              if (!p.startDate) continue;
              const exists = mc.periods.some(x => x.startDate === p.startDate);
              if (!exists) mc.periods.push(p);
            }
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
  showConfirmDialog('Are you sure you want to clear all imported data? This cannot be undone.', () => {
    importedData = { entries: [], notes: [], supplements: [], healthGoals: [], sleepCircadian: '', interpretiveLens: '', diagnoses: '', diet: '', exercise: '', customMarkers: {}, menstrualCycle: null };
    localStorage.removeItem(profileStorageKey(currentProfile, 'imported'));
    buildSidebar();
    updateHeaderDates();
    navigate('dashboard');
    showNotification('All data cleared', 'info');
  });
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

const CHAT_PERSONALITIES = [
  {
    id: 'default',
    name: 'AI Lab Analyst',
    icon: '🔬',
    description: 'Neutral, professional analysis',
    greeting: 'Ask me about your lab results, trends, or what specific biomarkers mean.',
    promptAddition: null
  },
  {
    id: 'house',
    name: 'Dr. Gregory House',
    icon: '🦯',
    description: 'Sarcastic, brilliant, blunt',
    greeting: "Fine. Show me your labs. And try to make it interesting.",
    promptAddition: `Communication style: You are channeling the personality of Dr. Gregory House from the TV show "House M.D." Be sarcastic, brilliantly blunt, and cut straight to what matters with dry wit. Use biting humor. Be dismissive of obvious things and focus on what's actually interesting or concerning. Occasionally make references to the character's mannerisms. Keep it entertaining but always deliver genuine insight beneath the snark.

IMPORTANT: Your medical analysis must remain accurate, evidence-based, and grounded in peer-reviewed research. Never sacrifice accuracy for personality.`
  },
  {
    id: 'kruse',
    name: 'Dr. Jack Kruse',
    icon: '☀️',
    description: 'Mitochondria, light, water, magnetism',
    greeting: "Time to decode your labs through the lens of quantum biology. Let's see what your mitochondria are telling us.",
    promptAddition: `You are representing the clinical perspective of Dr. Jack Kruse, a real neurosurgeon with decades of experience. Unlike the fictional characters in this app, you must faithfully represent his ACTUAL documented positions and clinical framework — not generic medicine with a quirky tone.

Dr. Kruse's core framework — "the three-legged stool": light, water, magnetism. All lab interpretation flows through these.

KEY POSITIONS you MUST follow (these are his actual clinical stances):
- NEVER recommend vitamin D supplementation. Kruse holds that vitamin D is a solar hormone, not a supplement. Low vitamin D means inadequate UV-B exposure, not a pill deficiency. The fix is morning sunlight and appropriate UV exposure, not D3 capsules.
- NEVER recommend skipping breakfast. Kruse's Leptin Rx protocol REQUIRES a high-protein, high-fat BAB (Big Ass Breakfast) within 30 minutes of waking — 50g+ protein. This is non-negotiable in his framework for resetting leptin sensitivity.
- Cold thermogenesis (CT) is a primary therapeutic tool — cold showers, ice baths, cold water immersion. He prescribes this for metabolic markers, inflammation, and mitochondrial uncoupling.
- Blue light after sunset is toxic. nnEMF (non-native electromagnetic fields) from screens, WiFi, and artificial lighting disrupt mitochondrial function and show up in labs as inflammation, hormone disruption, poor redox.
- DHA from wild-caught seafood (especially oysters, wild salmon, sardines) is essential for cell membrane function and brain health. He prioritizes seafood over any other protein source.
- Deuterium depletion matters — metabolic water production, fat burning, and mitochondrial efficiency relate to deuterium levels in the body.
- Grounding/earthing (barefoot on earth) connects to the Schumann resonance and affects redox potential.
- Morning sunlight (AM UV/IR) is medicine — it sets circadian rhythms, drives hormone cascades (cortisol, melatonin, dopamine), and affects every marker on a blood panel.
- Elevated hs-CRP, poor thyroid markers, insulin resistance, low HDL — he traces these back to circadian mismatch, blue light toxicity, and nnEMF exposure before looking at dietary factors.
- He is skeptical of most supplementation — the body should get what it needs from light, water, seafood, and environment. Supplements are band-aids for a broken environment.
- Leptin and melanocortin pathways are central to his metabolic interpretation.
- He connects latitude, seasonal light cycles, and population genetics to optimal lab ranges.

TONE: Bold, direct, professorial, contrarian. He challenges mainstream medical dogma with confidence. He connects dots others don't see. He's a neurosurgeon who thinks in quantum biology — electron chain transport, redox potential, the photoelectric effect. Passionate, unapologetic, intellectually intense.

IMPORTANT: You are representing a real practitioner's documented framework. Stay faithful to his published positions, blog posts (jackkruse.com), and clinical teachings. When his views diverge from mainstream consensus, present them as his framework — do not water them down with mainstream hedging.`
  },
  {
    id: 'custom',
    name: 'Custom Personality',
    icon: '✏️',
    description: 'Define your own style',
    greeting: 'Ask me about your lab results, trends, or what specific biomarkers mean.',
    promptAddition: null
  }
];

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
- If the user has described their sleep and circadian habits, consider how sleep quality, duration, disorders, light exposure, and shift work affect lab results (e.g. poor sleep raises hs-CRP, cortisol, insulin resistance; sleep apnea affects RBC/hemoglobin; shift work disrupts hormone rhythms; melatonin timing affects thyroid markers).
- If the user has described their exercise habits, consider how training type and intensity may influence lab results (e.g. heavy lifting raises CK/AST/ALT, endurance training lowers resting HR and raises HDL, overtraining elevates hs-CRP/cortisol, high protein intake affects creatinine/urea/BUN).
- If the user has logged supplements or medications with date ranges, correlate their start/stop dates with biomarker changes. Note when a marker shift coincides with beginning or ending a supplement/medication, and explain known effects of that substance on relevant biomarkers.
- If the user has defined health goals, prioritize your analysis around those stated goals. Focus on major priorities first, then mild, then minor. Connect biomarker trends to the user's specific health objectives.
- If the user has specified an interpretive lens (experts and/or paradigms), consider those experts' published research and frame your analysis through the specified scientific paradigms. Use their terminology, frameworks, and perspectives when interpreting results.
- If the user has menstrual cycle data, consider the cycle phase when interpreting hormone levels (estrogen, progesterone, LH, FSH vary dramatically by phase), iron/ferritin (heavy periods deplete stores), inflammatory markers, and insulin sensitivity. Flag when blood was drawn at a suboptimal cycle phase for hormone interpretation. Recommend early follicular (days 3-5) for baseline hormone panels.
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
  const exercise = importedData.exercise || '';
  if (exercise.trim()) {
    ctx += `## Exercise & Movement\n${exercise.trim()}\n\n`;
  }
  const sleepCircadian = importedData.sleepCircadian || '';
  if (sleepCircadian.trim()) {
    ctx += `## Sleep & Circadian\n${sleepCircadian.trim()}\n\n`;
  }
  const healthGoals = importedData.healthGoals || [];
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
  const interpretiveLens = importedData.interpretiveLens || '';
  if (interpretiveLens.trim()) {
    ctx += `## Interpretive Lens\n${interpretiveLens.trim()}\n\n`;
  }
  const mc = importedData.menstrualCycle;
  if (mc && profileSex === 'female') {
    const regLabel = mc.regularity === 'very_irregular' ? 'very irregular' : mc.regularity || 'regular';
    ctx += `## Menstrual Cycle\n`;
    ctx += `Profile: ${mc.cycleLength || 28}-day cycle, ${regLabel}, ${mc.flow || 'moderate'} flow.`;
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
          ctx += `- ${date}: Day ${p.cycleDay} (${p.phaseName} phase)\n`;
        }
      }
    }
    const drawRec = getNextBestDrawDate(mc);
    if (drawRec) {
      ctx += `\nNext optimal blood draw window: ${drawRec.description}\n`;
    }
    ctx += '\n';
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

function getActivePersonality() {
  return CHAT_PERSONALITIES.find(p => p.id === currentChatPersonality) || CHAT_PERSONALITIES[0];
}

function getCustomPersonalityText() {
  return localStorage.getItem(`labcharts-${currentProfile}-chatPersonalityCustom`) || '';
}

function setChatPersonality(id) {
  const prev = currentChatPersonality;
  if (prev === id) {
    // Collapse bar if same personality clicked
    const bar = document.querySelector('.chat-personality-bar');
    if (bar) bar.classList.remove('open');
    return;
  }
  currentChatPersonality = id;
  localStorage.setItem(`labcharts-${currentProfile}-chatPersonality`, id);
  updateChatHeaderTitle();
  updatePersonalityBar();
  const personality = getActivePersonality();
  showNotification(`Switched to ${personality.name}`, 'info');
  renderChatMessages();
  const bar = document.querySelector('.chat-personality-bar');
  if (bar) bar.classList.remove('open');
}

function loadChatPersonality() {
  const saved = localStorage.getItem(`labcharts-${currentProfile}-chatPersonality`);
  currentChatPersonality = saved && CHAT_PERSONALITIES.some(p => p.id === saved) ? saved : 'default';
}

function updateChatHeaderTitle() {
  const el = document.querySelector('.chat-header-title');
  if (el) {
    const p = getActivePersonality();
    el.textContent = p.name;
  }
}

function updatePersonalityBar() {
  const currentEl = document.querySelector('.chat-personality-current');
  if (currentEl) {
    const p = getActivePersonality();
    currentEl.querySelector('.chat-personality-current-icon').textContent = p.icon;
    currentEl.querySelector('.chat-personality-current-name').textContent = p.name;
  }
  // Update active states
  document.querySelectorAll('.chat-personality-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.personality === currentChatPersonality);
  });
  // Show/hide custom area
  const customArea = document.querySelector('.chat-personality-custom-area');
  if (customArea) {
    customArea.style.display = currentChatPersonality === 'custom' ? 'block' : 'none';
    if (currentChatPersonality === 'custom') {
      const textarea = customArea.querySelector('textarea');
      if (textarea) textarea.value = getCustomPersonalityText();
    }
  }
}

function togglePersonalityBar() {
  const options = document.querySelector('.chat-personality-options');
  const bar = document.querySelector('.chat-personality-bar');
  if (options && bar) {
    bar.classList.toggle('open');
  }
}

function saveCustomPersonality() {
  const textarea = document.querySelector('.chat-personality-custom-textarea');
  if (textarea) {
    localStorage.setItem(`labcharts-${currentProfile}-chatPersonalityCustom`, textarea.value.trim());
    showNotification('Custom personality saved', 'success');
  }
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
  for (const msg of chatHistory) {
    const cls = msg.role === 'user' ? 'chat-user' : 'chat-ai';
    html += `<div class="chat-msg ${cls}">${renderMarkdown(msg.content)}</div>`;
  }
  container.innerHTML = html;
  container.scrollTop = container.scrollHeight;
}

function useChatPrompt(text) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = text; sendChatMessage(); }
}

function applyInlineMarkdown(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

function renderMarkdown(text) {
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
    const apiMessages = chatHistory.slice(-10).map(m => ({ role: m.role, content: m.content }));

    // Create AI message placeholder
    const aiMsgEl = document.createElement('div');
    aiMsgEl.className = 'chat-msg chat-ai';
    aiMsgEl.innerHTML = '';

    // Throttle rendering to avoid O(n²) DOM thrashing on long streams
    let _streamLatest = '';
    let _streamRafId = null;
    const flushStream = () => {
      _streamRafId = null;
      try {
        if (typingEl.parentNode) typingEl.remove();
        if (!aiMsgEl.parentNode) container.appendChild(aiMsgEl);
        aiMsgEl.innerHTML = renderMarkdown(_streamLatest);
        container.scrollTop = container.scrollHeight;
      } catch (e) { console.error('Stream render error:', e); }
    };

    const fullText = await callClaudeAPI({
      system: systemPrompt,
      messages: apiMessages,
      maxTokens: 4096,
      onStream: (text) => {
        _streamLatest = text;
        if (!_streamRafId) _streamRafId = requestAnimationFrame(flushStream);
      }
    });

    // Final render with complete text
    if (_streamRafId) { cancelAnimationFrame(_streamRafId); _streamRafId = null; }
    if (typingEl.parentNode) typingEl.remove();
    if (!aiMsgEl.parentNode) container.appendChild(aiMsgEl);
    aiMsgEl.innerHTML = renderMarkdown(fullText);
    container.scrollTop = container.scrollHeight;

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

// ═══════════════════════════════════════════════
// MARKER GLOSSARY
// ═══════════════════════════════════════════════
function openGlossary() {
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
      markerRegistry[id] = marker;
      const latestIdx = getLatestValueIndex(marker.values);
      const latestVal = latestIdx !== -1 ? marker.values[latestIdx] : null;
      const r = getEffectiveRange(marker);
      const status = latestVal !== null ? getStatus(latestVal, r.min, r.max) : 'missing';
      const desc = getMarkerDescription(id) || '';
      html += `<div class="glossary-marker" data-name="${marker.name.toLowerCase()}" onclick="closeGlossary();showDetailModal('${id}')">
        <div class="glossary-marker-top">
          <span class="glossary-marker-name">${marker.name}</span>
          <span class="glossary-marker-value val-${status}">${latestVal !== null ? formatValue(latestVal) : '\u2014'} <span class="glossary-marker-unit">${marker.unit}</span></span>
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

function closeGlossary() {
  document.getElementById('glossary-modal-overlay').classList.remove('show');
}

function filterGlossary() {
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


function askAIAboutMarker(markerId) {
  const marker = markerRegistry[markerId];
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
  closeModal();
  openChatPanel(prompt);
}

function askAIAboutCorrelations() {
  if (selectedCorrelationMarkers.length < 2) return;
  const data = getActiveData();
  const parts = selectedCorrelationMarkers.map(key => {
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
  const names = selectedCorrelationMarkers.map(key => {
    const [catKey, markerKey] = key.split('.');
    return data.categories[catKey]?.markers[markerKey]?.name || key;
  });
  const prompt = `Analyze the correlation between these biomarkers: ${names.join(', ')}.\n\nHere are my values:\n${parts.join('\n')}\n\nHow do these markers relate to each other? Are there any patterns, imbalances, or concerns based on their combined trends?`;
  openChatPanel(prompt);
}
