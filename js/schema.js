// schema.js — Marker definitions, unit conversions, pricing, optimal ranges

// ═══════════════════════════════════════════════
// MARKER SCHEMA (no personal data — just biomarker definitions)
// ═══════════════════════════════════════════════
export const MARKER_SCHEMA = {
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
      mentalResilience: { name: "Mental Resilience Idx", unit: "", refMin: 0.5, refMax: 1.0, desc: "Composite index derived from omega-3 levels reflecting neuronal membrane health and cognitive stress resilience." },
      nervonicC24_1: { name: "Nervonic Acid C24:1", unit: "%", refMin: 1.1, refMax: 1.8, desc: "Long-chain monounsaturated fatty acid essential for brain myelin synthesis; low levels associated with demyelinating conditions." },
      arachidicC20_0: { name: "Arachidic Acid C20:0", unit: "%", refMin: 0.24, refMax: 0.40, desc: "Very-long-chain saturated fatty acid from peanut oil; reflects peroxisomal fatty acid metabolism." },
      behenicC22_0: { name: "Behenic Acid C22:0", unit: "%", refMin: 0.88, refMax: 1.61, desc: "Very-long-chain saturated fatty acid found in seeds and legumes; marker of peroxisomal beta-oxidation capacity." },
      tricosanoicC23_0: { name: "Tricosanoic Acid C23:0", unit: "%", refMin: 0.19, refMax: 0.26, desc: "Odd-chain very-long-chain saturated fatty acid; reflects peroxisomal fatty acid elongation and metabolism." },
      lignocericC24_0: { name: "Lignoceric Acid C24:0", unit: "%", refMin: 1.1, refMax: 1.9, desc: "Very-long-chain saturated fatty acid in brain sphingolipids; elevated in adrenoleukodystrophy and peroxisomal disorders." },
      pentadecanoicC15_0: { name: "Pentadecanoic Acid C15:0", unit: "%", refMin: 0.14, refMax: 0.30, desc: "Odd-chain saturated fatty acid primarily from dairy fat; a biomarker of dairy intake with emerging metabolic health benefits." },
      margaricC17_0: { name: "Margaric Acid C17:0", unit: "%", refMin: 0.24, refMax: 0.45, desc: "Odd-chain saturated fatty acid from ruminant fat; biomarker of dairy and ruminant meat consumption." },
      palmitoleicC16_1n7: { name: "Palmitoleic Acid C16:1n7", unit: "%", refMin: null, refMax: 2.58, desc: "Omega-7 monounsaturated fatty acid produced by de novo lipogenesis; elevated levels indicate increased hepatic fat synthesis." },
      vaccenicC18_1n7: { name: "Vaccenic Acid C18:1n7", unit: "%", refMin: null, refMax: 1.65, desc: "Natural trans fatty acid from ruminant fat; converts to conjugated linoleic acid (CLA) with anti-inflammatory properties." },
      elaidicC18_1n9t: { name: "Elaidic Acid C18:1n9t", unit: "%", refMin: null, refMax: 0.59, desc: "Industrial trans fatty acid from partially hydrogenated oils; strongly associated with cardiovascular disease and inflammation." },
      docosatetraenoicC22_4n6: { name: "Docosatetraenoic Acid C22:4n6", unit: "%", refMin: 0.45, refMax: 1.25, desc: "Omega-6 long-chain fatty acid derived from arachidonic acid; reflects elongase activity and omega-6 metabolism." },
      eicosadienoicC20_2n6: { name: "Eicosadienoic Acid C20:2n6", unit: "%", refMin: null, refMax: 0.26, desc: "Minor omega-6 fatty acid from linoleic acid elongation; elevated levels may indicate impaired delta-5 desaturase activity." },
      aaEpaRatio: { name: "AA/EPA Ratio", unit: "", refMin: 10, refMax: 86, desc: "Arachidonic acid to EPA ratio; reflects the balance between pro-inflammatory omega-6 and anti-inflammatory omega-3 pathways." },
      linoleicDglaRatio: { name: "Linoleic/DGLA Ratio", unit: "", refMin: 12.6, refMax: 31.5, desc: "Ratio of linoleic acid to DGLA; reflects delta-6 desaturase enzyme activity converting omega-6 to anti-inflammatory DGLA." }
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
export const UNIT_CONVERSIONS = {
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

// ═══════════════════════════════════════════════
// CORRELATION PRESETS
// ═══════════════════════════════════════════════
export const CORRELATION_PRESETS = [
  { label: "Testosterone vs SHBG", markers: ["hormones.testosterone", "hormones.shbg"] },
  { label: "LDL vs hs-CRP", markers: ["lipids.ldl", "proteins.hsCRP"] },
  { label: "HbA1c vs Insulin vs HOMA-IR", markers: ["diabetes.hba1c", "diabetes.insulin_d", "diabetes.homaIR"] },
  { label: "Liver Enzymes", markers: ["biochemistry.ast", "biochemistry.alt", "biochemistry.alp", "biochemistry.ggt"] },
  { label: "Iron Panel", markers: ["iron.iron", "iron.ferritin", "iron.transferrin"] },
  { label: "Lipid Panel", markers: ["lipids.cholesterol", "lipids.hdl", "lipids.ldl", "lipids.triglycerides"] },
  { label: "Vitamin D vs Calcium", markers: ["vitamins.vitaminD", "electrolytes.calciumTotal"] },
  { label: "TSH vs T3 vs T4", markers: ["thyroid.tsh", "thyroid.ft3", "thyroid.ft4"] }
];
export const CHIP_COLORS = ['#4f8cff','#34d399','#f87171','#fbbf24','#a78bfa','#f472b6','#38bdf8','#fb923c'];

// ═══════════════════════════════════════════════
// SPECIALTY MARKER DEFINITIONS (migration data only)
// Frozen snapshot of removed specialty categories — used by migrateProfileData()
// to convert existing hardcoded marker entries into customMarkers definitions.
// ═══════════════════════════════════════════════
export const SPECIALTY_MARKER_DEFS = {
  "oatMicrobial.citramalic": { name: "Citramalic Acid", unit: "mmol/mol creatinine", refMin: 0.11, refMax: 2, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hydroxymethylfuroic": { name: "5-Hydroxymethyl-2-furoic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 18, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.oxoglutaric3": { name: "3-Oxoglutaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.11, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.furandicarboxylic": { name: "Furan-2,5-dicarboxylic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 13, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.furancarbonylglycine": { name: "Furancarbonylglycine", unit: "mmol/mol creatinine", refMin: null, refMax: 2.3, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.tartaric": { name: "Tartaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 5.3, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.arabinose": { name: "Arabinose", unit: "mmol/mol creatinine", refMin: null, refMax: 20, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.carboxycitric": { name: "Carboxycitric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 20, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.tricarballylic": { name: "Tricarballylic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.58, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hippuric": { name: "Hippuric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 241, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hydroxyphenylacetic2": { name: "2-Hydroxyphenylacetic Acid", unit: "mmol/mol creatinine", refMin: 0.03, refMax: 0.47, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hydroxybenzoic4": { name: "4-Hydroxybenzoic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.73, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hydroxyhippuric4": { name: "4-Hydroxyhippuric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 14, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.dhppa": { name: "DHPPA (Beneficial Bacteria)", unit: "mmol/mol creatinine", refMin: null, refMax: 0.23, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hydroxyphenylacetic4": { name: "4-Hydroxyphenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 18, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hphpa": { name: "HPHPA", unit: "mmol/mol creatinine", refMin: null, refMax: 102, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.cresol4": { name: "4-Cresol", unit: "mmol/mol creatinine", refMin: null, refMax: 39, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.indoleacetic3": { name: "3-Indoleacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 6.8, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.urineCreatinine": { name: "Creatinine (Urine)", unit: "mg/dL", refMin: 20, refMax: 300, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.phenylacetic": { name: "Phenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.12, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.hydroxyphenylacetic3": { name: "3-Hydroxyphenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 8.1, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.benzoic": { name: "Benzoic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.05, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMicrobial.dArabinitol": { name: "D-Arabinitol", unit: "mmol/mol creatinine", refMin: null, refMax: 36, categoryLabel: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0", group: "OAT" },
  "oatMetabolic.glyceric": { name: "Glyceric Acid", unit: "mmol/mol creatinine", refMin: 0.21, refMax: 4.9, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.glycolic": { name: "Glycolic Acid", unit: "mmol/mol creatinine", refMin: 18, refMax: 81, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.oxalic": { name: "Oxalic Acid", unit: "mmol/mol creatinine", refMin: 8.9, refMax: 67, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.lactic": { name: "Lactic Acid", unit: "mmol/mol creatinine", refMin: 0.74, refMax: 19, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.pyruvic": { name: "Pyruvic Acid", unit: "mmol/mol creatinine", refMin: 0.28, refMax: 6.7, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.succinic": { name: "Succinic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 5.3, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.fumaric": { name: "Fumaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.49, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.malic": { name: "Malic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.1, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.oxoglutaric2": { name: "2-Oxoglutaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 18, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.aconitic": { name: "Aconitic Acid", unit: "mmol/mol creatinine", refMin: 4.1, refMax: 23, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.citric": { name: "Citric Acid", unit: "mmol/mol creatinine", refMin: 2.2, refMax: 260, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.methylglutaric3": { name: "3-Methylglutaric Acid", unit: "mmol/mol creatinine", refMin: 0.02, refMax: 0.38, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.hydroxyglutaric3": { name: "3-Hydroxyglutaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 4.6, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.methylglutaconic3": { name: "3-Methylglutaconic Acid", unit: "mmol/mol creatinine", refMin: 0.38, refMax: 2, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatMetabolic.isocitric": { name: "Isocitric Acid", unit: "mmol/mol creatinine", refMin: 22, refMax: 65, categoryLabel: "OAT: Metabolic", icon: "\u2697\uFE0F", group: "OAT" },
  "oatNeuro.hva": { name: "HVA (Homovanillic Acid)", unit: "mmol/mol creatinine", refMin: 0.39, refMax: 2.2, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.vma": { name: "VMA (Vanillylmandelic Acid)", unit: "mmol/mol creatinine", refMin: 0.53, refMax: 2.2, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.hvaVmaRatio": { name: "HVA/VMA Ratio", unit: "", refMin: 0.32, refMax: 1.4, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.dopac": { name: "DOPAC (Dihydroxyphenylacetic)", unit: "mmol/mol creatinine", refMin: 0.27, refMax: 1.9, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.hvaDopacRatio": { name: "HVA/DOPAC Ratio", unit: "", refMin: 0.17, refMax: 1.6, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.hiaa5": { name: "5-HIAA (5-Hydroxyindoleacetic)", unit: "mmol/mol creatinine", refMin: null, refMax: 2.9, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.quinolinic": { name: "Quinolinic Acid", unit: "mmol/mol creatinine", refMin: 0.52, refMax: 2.4, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.kynurenic": { name: "Kynurenic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.8, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.uracil": { name: "Uracil", unit: "mmol/mol creatinine", refMin: null, refMax: 6.9, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.thymine": { name: "Thymine", unit: "mmol/mol creatinine", refMin: null, refMax: 0.36, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.xanthurenic": { name: "Xanthurenic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.96, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.mhpg": { name: "MHPG (3-Methyl-4-OH-Phenylglycol)", unit: "mmol/mol creatinine", refMin: 0.02, refMax: 0.22, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNeuro.kynurenicQuinolinicRatio": { name: "Kynurenic/Quinolinic Ratio", unit: "", refMin: 0.44, refMax: null, categoryLabel: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0", group: "OAT" },
  "oatNutritional.methylmalonic": { name: "Methylmalonic Acid (B12)", unit: "mmol/mol creatinine", refMin: null, refMax: 2.3, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.pyridoxic": { name: "Pyridoxic Acid (B6)", unit: "mmol/mol creatinine", refMin: null, refMax: 26, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.pantothenic": { name: "Pantothenic Acid (B5)", unit: "mmol/mol creatinine", refMin: null, refMax: 5.4, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.glutaric": { name: "Glutaric Acid (B2)", unit: "mmol/mol creatinine", refMin: null, refMax: 0.43, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.ascorbic": { name: "Ascorbic Acid (Vitamin C)", unit: "mmol/mol creatinine", refMin: 10, refMax: 200, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.hmg": { name: "3-Hydroxy-3-methylglutaric (CoQ10)", unit: "mmol/mol creatinine", refMin: null, refMax: 26, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.nac": { name: "N-Acetylcysteine (NAC)", unit: "mmol/mol creatinine", refMin: null, refMax: 0.13, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.methylcitric": { name: "Methylcitric Acid (Biotin)", unit: "mmol/mol creatinine", refMin: 0.15, refMax: 1.7, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.pyroglutamic": { name: "Pyroglutamic Acid", unit: "mmol/mol creatinine", refMin: 5.7, refMax: 25, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.hydroxybutyric2": { name: "2-Hydroxybutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.2, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.orotic": { name: "Orotic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.46, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.hydroxyhippuric2": { name: "2-Hydroxyhippuric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.86, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.figlu": { name: "FIGLU (Formiminoglutamic Acid)", unit: "mmol/mol creatinine", refMin: null, refMax: 1.5, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.hydroxypropionic3": { name: "3-Hydroxypropionic Acid", unit: "mmol/mol creatinine", refMin: 5, refMax: 22, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.hydroxyisovaleric3": { name: "3-Hydroxyisovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 29, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.ketophenylacetic": { name: "\u03b1-Ketophenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.46, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatNutritional.hydroxyisobutyric": { name: "\u03b1-Hydroxyisobutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 6.7, categoryLabel: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F", group: "OAT" },
  "oatAminoFatty.hydroxybutyric3": { name: "3-Hydroxybutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.9, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.acetoacetic": { name: "Acetoacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 10, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.ethylmalonic": { name: "Ethylmalonic Acid", unit: "mmol/mol creatinine", refMin: 0.13, refMax: 2.7, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.methylsuccinic": { name: "Methylsuccinic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.3, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.adipic": { name: "Adipic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.9, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.suberic": { name: "Suberic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.9, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.sebacic": { name: "Sebacic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.14, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.hydroxyisovaleric2": { name: "2-Hydroxyisovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.oxoisovaleric2": { name: "2-Oxoisovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.methyl2oxovaleric3": { name: "3-Methyl-2-oxovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.hydroxyisocaproic2": { name: "2-Hydroxyisocaproic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.oxoisocaproic2": { name: "2-Oxoisocaproic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.oxo4methiolbutyric2": { name: "2-Oxo-4-methiolbutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.mandelic": { name: "Mandelic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.phenyllactic": { name: "Phenyllactic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.phenylpyruvic": { name: "Phenylpyruvic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.homogentisic": { name: "Homogentisic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.hydroxyphenyllactic4": { name: "4-Hydroxyphenyllactic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.nAcetylaspartic": { name: "N-Acetylaspartic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 38, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.malonic": { name: "Malonic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 9.9, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.hydroxybutyric4": { name: "4-Hydroxybutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 4.3, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.phosphoric": { name: "Phosphoric Acid", unit: "mmol/mol creatinine", refMin: 1000, refMax: 4900, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.isovalerylglycine": { name: "Isovalerylglycine", unit: "mmol/mol creatinine", refMin: null, refMax: 3.7, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oatAminoFatty.ketoadipic": { name: "\u03b1-Ketoadipic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.7, categoryLabel: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C", group: "OAT" },
  "oxidativeStress.lipidPeroxides": { name: "Lipid Peroxides (Urine)", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 10, categoryLabel: "Oxidative Stress", icon: "\uD83D\uDD25", group: "OAT" },
  "oxidativeStress.ohdg8": { name: "8-OHdG (Urine)", unit: "mcg/g creatinine", refMin: null, refMax: 15, categoryLabel: "Oxidative Stress", icon: "\uD83D\uDD25", group: "OAT" },
  "urineAmino.arginine": { name: "Arginine", unit: "\u00b5mol/g creatinine", refMin: 3, refMax: 33, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.histidine": { name: "Histidine", unit: "\u00b5mol/g creatinine", refMin: 127, refMax: 800, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.isoleucine": { name: "Isoleucine", unit: "\u00b5mol/g creatinine", refMin: 3, refMax: 28, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.leucine": { name: "Leucine", unit: "\u00b5mol/g creatinine", refMin: 4, refMax: 46, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.lysine": { name: "Lysine", unit: "\u00b5mol/g creatinine", refMin: 11, refMax: 175, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.methionine": { name: "Methionine", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 18, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.phenylalanine": { name: "Phenylalanine", unit: "\u00b5mol/g creatinine", refMin: 8, refMax: 71, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.taurine": { name: "Taurine", unit: "\u00b5mol/g creatinine", refMin: 21, refMax: 424, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.threonine": { name: "Threonine", unit: "\u00b5mol/g creatinine", refMin: 12, refMax: 123, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.tryptophan": { name: "Tryptophan", unit: "\u00b5mol/g creatinine", refMin: 5, refMax: 53, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.valine": { name: "Valine", unit: "\u00b5mol/g creatinine", refMin: 7, refMax: 49, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.alanine": { name: "Alanine", unit: "\u00b5mol/g creatinine", refMin: 63, refMax: 295, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.asparagine": { name: "Asparagine", unit: "\u00b5mol/g creatinine", refMin: 25, refMax: 119, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.asparticAcid": { name: "Aspartic Acid", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 14, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.cysteine": { name: "Cysteine", unit: "\u00b5mol/g creatinine", refMin: 8, refMax: 74, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.cystine": { name: "Cystine", unit: "\u00b5mol/g creatinine", refMin: 10, refMax: 104, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.gaba": { name: "GABA", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 5, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.glutamicAcid": { name: "Glutamic Acid", unit: "\u00b5mol/g creatinine", refMin: 4, refMax: 27, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.glutamine": { name: "Glutamine", unit: "\u00b5mol/g creatinine", refMin: 110, refMax: 528, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.proline": { name: "Proline", unit: "\u00b5mol/g creatinine", refMin: 1, refMax: 13, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAmino.tyrosine": { name: "Tyrosine", unit: "\u00b5mol/g creatinine", refMin: 11, refMax: 135, categoryLabel: "Urine Amino Acids", icon: "\uD83E\uDDEC", group: "OAT" },
  "urineAminoMetab.aminoadipic": { name: "\u03b1-Aminoadipic Acid", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 47, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.aminoNbutyric": { name: "\u03b1-Amino-N-butyric Acid", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 25, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.aminoisobutyric": { name: "\u03b2-Aminoisobutyric Acid", unit: "\u00b5mol/g creatinine", refMin: 11, refMax: 160, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.cystathionine": { name: "Cystathionine", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 68, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.citrulline": { name: "Citrulline", unit: "\u00b5mol/g creatinine", refMin: 0.6, refMax: 3.9, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.ornithine": { name: "Ornithine", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 21, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.urea": { name: "Urea", unit: "mg/g creatinine", refMin: 168, refMax: 465, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.glycine": { name: "Glycine", unit: "\u00b5mol/g creatinine", refMin: 95, refMax: 683, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.serine": { name: "Serine", unit: "\u00b5mol/g creatinine", refMin: 40, refMax: 163, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.ethanolamine": { name: "Ethanolamine", unit: "\u00b5mol/g creatinine", refMin: 50, refMax: 235, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.phosphoethanolamine": { name: "Phosphoethanolamine", unit: "\u00b5mol/g creatinine", refMin: 1, refMax: 13, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.phosphoserine": { name: "Phosphoserine", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 13, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.sarcosine": { name: "Sarcosine", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 1.2, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.anserine": { name: "Anserine", unit: "\u00b5mol/g creatinine", refMin: 0.4, refMax: 105.1, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.carnosine": { name: "Carnosine", unit: "\u00b5mol/g creatinine", refMin: 1, refMax: 28, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.methylhistidine1": { name: "1-Methylhistidine", unit: "\u00b5mol/g creatinine", refMin: 38, refMax: 988, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.methylhistidine3": { name: "3-Methylhistidine", unit: "\u00b5mol/g creatinine", refMin: 44, refMax: 281, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "urineAminoMetab.betaAlanine": { name: "\u03b2-Alanine", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 22, categoryLabel: "Urine Amino Metabolites", icon: "\uD83D\uDD04", group: "OAT" },
  "toxicElements.lead": { name: "Lead", unit: "\u00b5g/g creatinine", refMin: null, refMax: 1.4, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.mercury": { name: "Mercury", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2.19, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.aluminum": { name: "Aluminum", unit: "\u00b5g/g creatinine", refMin: null, refMax: 22.3, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.antimony": { name: "Antimony", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.149, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.arsenic": { name: "Arsenic", unit: "\u00b5g/g creatinine", refMin: null, refMax: 50, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.barium": { name: "Barium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 6.7, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.bismuth": { name: "Bismuth", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2.28, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.cadmium": { name: "Cadmium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.64, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.cesium": { name: "Cesium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 10.5, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.gadolinium": { name: "Gadolinium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.019, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.gallium": { name: "Gallium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.028, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.nickel": { name: "Nickel", unit: "\u00b5g/g creatinine", refMin: null, refMax: 3.88, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.platinum": { name: "Platinum", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.033, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.rubidium": { name: "Rubidium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2263, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.thallium": { name: "Thallium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.298, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.tin": { name: "Tin", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2.04, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.tungsten": { name: "Tungsten", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.211, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "toxicElements.uranium": { name: "Uranium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.026, categoryLabel: "Toxic Elements", icon: "\u2620\uFE0F", group: "OAT" },
  "nutrientElements.chromium": { name: "Chromium", unit: "\u00b5g/g creatinine", refMin: 0.6, refMax: 9.4, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.cobalt": { name: "Cobalt", unit: "\u00b5g/g creatinine", refMin: 0.01, refMax: 2.60, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.copper": { name: "Copper (Urine)", unit: "\u00b5g/g creatinine", refMin: 4.0, refMax: 11.4, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.iron": { name: "Iron (Urine)", unit: "\u00b5g/g creatinine", refMin: 5, refMax: 64, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.lithium": { name: "Lithium", unit: "\u00b5g/g creatinine", refMin: 9, refMax: 129, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.manganese": { name: "Manganese", unit: "\u00b5g/g creatinine", refMin: 0.03, refMax: 1.16, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.molybdenum": { name: "Molybdenum", unit: "\u00b5g/g creatinine", refMin: 15, refMax: 175, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.selenium": { name: "Selenium", unit: "\u00b5g/g creatinine", refMin: 32, refMax: 333, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.strontium": { name: "Strontium", unit: "\u00b5g/g creatinine", refMin: 47, refMax: 346, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.vanadium": { name: "Vanadium", unit: "\u00b5g/g creatinine", refMin: 0.1, refMax: 3.2, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.zinc": { name: "Zinc (Urine)", unit: "\u00b5g/g creatinine", refMin: 63, refMax: 688, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.calcium": { name: "Calcium (Urine)", unit: "mg/g creatinine", refMin: 37, refMax: 313, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.magnesiumUrine": { name: "Magnesium (Urine)", unit: "mg/g creatinine", refMin: 41, refMax: 267, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" },
  "nutrientElements.sulfur": { name: "Sulfur", unit: "mg/g creatinine", refMin: 367, refMax: 1328, categoryLabel: "Nutrient Elements", icon: "\u2699\uFE0F", group: "OAT" }
};

// ── Model pricing ($/M tokens) ──
export const MODEL_PRICING = {
  anthropic: {
    'claude-opus-4-6':   { input: 5.00,  output: 25.00 },
    'claude-opus-4-5':   { input: 5.00,  output: 25.00 },
    'claude-sonnet-4-6': { input: 3.00,  output: 15.00 },
    'claude-sonnet-4-5': { input: 3.00,  output: 15.00 },
    'claude-haiku-4-5':  { input: 1.00,  output: 5.00  },
    'claude-haiku-3-5':  { input: 0.80,  output: 4.00  },
    '_default':          { input: 3.00,  output: 15.00, approx: true },
  },
  venice: {
    'claude-opus-4-6':      { input: 6.00,  output: 30.00 },
    'claude-opus-4-5':      { input: 6.00,  output: 30.00 },
    'claude-sonnet-4-6':    { input: 3.75,  output: 18.75 },
    'claude-sonnet-4-5':    { input: 3.75,  output: 18.75 },
    'claude-sonnet':        { input: 3.75,  output: 18.75 },
    'gpt-5':                { input: 2.19,  output: 17.50 },
    'gemini-3-pro':         { input: 2.50,  output: 15.00 },
    'hermes-3-llama-3.1-405b': { input: 1.10, output: 3.00 },
    'qwen-3-coder':         { input: 0.75,  output: 3.00  },
    'kimi-k2':              { input: 0.75,  output: 3.20  },
    'llama-3.3-70b':        { input: 0.70,  output: 2.80  },
    'gemini-3-flash':       { input: 0.70,  output: 3.75  },
    'glm-4':                { input: 0.55,  output: 2.65  },
    'venice-medium':        { input: 0.50,  output: 2.00  },
    'grok-4':               { input: 0.50,  output: 1.25  },
    'qwen-3-235b':          { input: 0.15,  output: 0.75  },
    'qwen3':                { input: 0.15,  output: 0.75  },
    'deepseek-v3':          { input: 0.40,  output: 1.00  },
    'minimax':              { input: 0.40,  output: 1.60  },
    'grok-code':            { input: 0.25,  output: 1.87  },
    'qwen-3-vl':            { input: 0.25,  output: 1.50  },
    'venice-uncensored':    { input: 0.20,  output: 0.90  },
    'llama-3.2':            { input: 0.15,  output: 0.60  },
    'google-gemma':         { input: 0.12,  output: 0.20  },
    'venice-small':         { input: 0.05,  output: 0.15  },
    'openai-gpt-oss':       { input: 0.07,  output: 0.30  },
    '_default':             { input: 0.50,  output: 2.00, approx: true },
  },
  openrouter: {
    '_default':  { input: 1.00,  output: 3.00, approx: true },
  },
  // ROUTSTR DISABLED: routstr: { '_default': { input: 1.00, output: 3.00, approx: true } }
};
export function getModelPricing(provider, modelId) {
  // OpenRouter: check dynamic API-sourced pricing first
  if (provider === 'openrouter' && modelId) {
    const cached = JSON.parse(localStorage.getItem('labcharts-openrouter-pricing') || '{}');
    if (cached[modelId]) return cached[modelId];
  }
  /* ROUTSTR DISABLED
  if (provider === 'routstr' && modelId) {
    const cached = JSON.parse(localStorage.getItem('labcharts-routstr-pricing') || '{}');
    if (cached[modelId]) return cached[modelId];
  }
  */
  if (!MODEL_PRICING[provider]) return { input: 0, output: 0 };
  const table = MODEL_PRICING[provider];
  const stripped = (modelId || '').replace(/-\d{8}$/, '');
  if (table[stripped]) return table[stripped];
  const prefix = Object.keys(table).filter(k => k !== '_default' && stripped.startsWith(k)).sort((a, b) => b.length - a.length)[0];
  if (prefix) return table[prefix];
  const fallback = table['_default'] || { input: 0, output: 0 };
  return { ...fallback, approx: true };
}
export function calculateCost(provider, modelId, inputTokens, outputTokens) {
  const p = getModelPricing(provider, modelId);
  return (p.input * (inputTokens || 0) + p.output * (outputTokens || 0)) / 1_000_000;
}
export function formatCost(usd) {
  if (usd === 0) return 'Free';
  if (usd < 0.0001) return '<$0.0001';
  if (usd < 0.01) return '$' + usd.toFixed(4);
  return '$' + usd.toFixed(3);
}

// Optimal ranges — evidence-based "ideal" bands from mortality meta-analyses,
// longevity research (Attia, Patrick, Levine), and functional medicine (Weatherby/OptimalDX).
// Sources: CKD Prognosis Consortium, ASH/Blood 2015, Harris & von Schacky 2004,
// Lancet non-HDL pooled analysis, PMC8844108 (IGF-1), PMC10324141 (sodium),
// PMC10866328 (thyroid/CVD), PMC11078084 (albumin), Gilbert syndrome studies.
export const OPTIMAL_RANGES = {
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
  'lipids.apoAI': { optimalMin: 1.40, optimalMax: 1.70 },
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

// Phase-specific reference ranges for cycle-dependent hormones (premenopausal female, SI units)
// Sources: ACOG, Endocrine Society, Quest/LabCorp clinical reference tables
export const PHASE_RANGES = {
  'hormones.estradiol': {
    menstrual:  { min: 45,   max: 130  },
    follicular: { min: 45,   max: 400  },
    ovulatory:  { min: 400,  max: 1470 },
    luteal:     { min: 180,  max: 780  }
  },
  'hormones.progesterone': {
    menstrual:  { min: 0.18, max: 2.5  },
    follicular: { min: 0.18, max: 2.5  },
    ovulatory:  { min: 0.18, max: 9.5  },
    luteal:     { min: 5.7,  max: 75.9 }
  }
};
