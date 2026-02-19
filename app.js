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
  oatMicrobial: {
    label: "OAT: Microbial Overgrowth", icon: "\uD83E\uDDA0",
    markers: {
      citramalic: { name: "Citramalic Acid", unit: "mmol/mol creatinine", refMin: 0.11, refMax: 2.0, desc: "Elevated by yeast (Aspergillus, Candida) and certain bacteria; a key indicator of gastrointestinal fungal overgrowth." },
      hydroxymethylfuroic: { name: "5-Hydroxymethyl-2-furoic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 18, desc: "Marker of yeast metabolism and sugar degradation; elevated levels suggest intestinal fungal overgrowth." },
      oxoglutaric3: { name: "3-Oxoglutaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.11, desc: "Produced by Aspergillus and other molds; elevation may indicate fungal colonization in the GI tract." },
      furandicarboxylic: { name: "Furan-2,5-dicarboxylic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 13, desc: "A furan derivative linked to yeast metabolism; elevated in candidiasis and fungal overgrowth." },
      furancarbonylglycine: { name: "Furancarbonylglycine", unit: "mmol/mol creatinine", refMin: null, refMax: 2.3, desc: "Glycine conjugate of a furan compound; reflects fungal metabolic activity in the gut." },
      tartaric: { name: "Tartaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 5.3, desc: "Produced primarily by yeast; one of the most specific urinary markers for Candida overgrowth." },
      arabinose: { name: "Arabinose", unit: "mmol/mol creatinine", refMin: null, refMax: 20, desc: "A five-carbon sugar produced by intestinal yeast; elevated levels suggest significant Candida colonization." },
      carboxycitric: { name: "Carboxycitric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 20, desc: "Produced by Aspergillus species; elevation indicates possible mold colonization in the GI tract." },
      tricarballylic: { name: "Tricarballylic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.58, desc: "Found in corn and produced by gut bacteria; may chelate magnesium and other minerals when elevated." },
      hippuric: { name: "Hippuric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 241, desc: "Produced from benzoic acid by gut bacteria and diet; very high levels suggest bacterial overgrowth or high benzoate intake." },
      hydroxyphenylacetic2: { name: "2-Hydroxyphenylacetic Acid", unit: "mmol/mol creatinine", refMin: 0.03, refMax: 0.47, desc: "Marker of abnormal phenylalanine metabolism by GI bacteria; elevation suggests small intestinal bacterial overgrowth." },
      hydroxybenzoic4: { name: "4-Hydroxybenzoic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.73, desc: "Produced by intestinal bacteria from polyphenols; elevation may indicate bacterial overgrowth or impaired hepatic conjugation." },
      hydroxyhippuric4: { name: "4-Hydroxyhippuric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 14, desc: "Derived from bacterial metabolism of dietary polyphenols; elevated levels suggest increased bacterial activity in the gut." },
      dhppa: { name: "DHPPA (Beneficial Bacteria)", unit: "mmol/mol creatinine", refMin: null, refMax: 0.23, desc: "Produced by beneficial Clostridia species from chlorogenic acid; reflects healthy bacterial diversity in the colon." },
      hydroxyphenylacetic4: { name: "4-Hydroxyphenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 18, desc: "Product of tyrosine metabolism by gut bacteria; elevation may indicate bacterial overgrowth or impaired liver detox." },
      hphpa: { name: "HPHPA", unit: "mmol/mol creatinine", refMin: null, refMax: 102, desc: "Produced by pathogenic Clostridia species; strongly associated with behavioral and neurological symptoms when elevated." },
      cresol4: { name: "4-Cresol", unit: "mmol/mol creatinine", refMin: null, refMax: 39, desc: "Toxic metabolite produced by C. difficile and other Clostridia; inhibits dopamine metabolism and is neurotoxic." },
      indoleacetic3: { name: "3-Indoleacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 6.8, desc: "Tryptophan metabolite produced by gut bacteria; elevation suggests bacterial overgrowth affecting serotonin precursors." },
      urineCreatinine: { name: "Creatinine (Urine)", unit: "mg/dL", refMin: 20, refMax: 300, desc: "Used to normalize other urine analytes; reflects muscle mass and hydration status of the urine sample." },
      phenylacetic: { name: "Phenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.12, desc: "Produced by anaerobic bacteria from phenylalanine; elevated levels indicate gastrointestinal bacterial overgrowth." },
      hydroxyphenylacetic3: { name: "3-Hydroxyphenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 8.1, desc: "Bacterial metabolite of phenylalanine via hydroxylation; elevation suggests intestinal bacterial overgrowth or impaired liver conjugation." },
      benzoic: { name: "Benzoic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.05, desc: "Precursor to hippuric acid from gut bacteria and diet; high levels indicate bacterial overgrowth or impaired glycine conjugation." },
      dArabinitol: { name: "D-Arabinitol", unit: "mmol/mol creatinine", refMin: null, refMax: 36, desc: "Sugar alcohol produced by Candida species; elevated D-arabinitol is a specific marker for invasive candidiasis." }
    }
  },
  oatMetabolic: {
    label: "OAT: Metabolic", icon: "\u2697\uFE0F",
    markers: {
      glyceric: { name: "Glyceric Acid", unit: "mmol/mol creatinine", refMin: 0.21, refMax: 4.9, desc: "Intermediate in serine and fructose metabolism; elevation may indicate glyceric aciduria or fructose intolerance." },
      glycolic: { name: "Glycolic Acid", unit: "mmol/mol creatinine", refMin: 18, refMax: 81, desc: "Produced from glyoxylate metabolism; very high levels can indicate primary hyperoxaluria or vitamin B6 deficiency." },
      oxalic: { name: "Oxalic Acid", unit: "mmol/mol creatinine", refMin: 8.9, refMax: 67, desc: "Forms calcium oxalate kidney stones; elevated by high-oxalate diet, yeast overgrowth, or genetic hyperoxaluria." },
      lactic: { name: "Lactic Acid", unit: "mmol/mol creatinine", refMin: 0.74, refMax: 19, desc: "End product of anaerobic glycolysis; elevation indicates mitochondrial dysfunction, poor tissue oxygenation, or intense exercise." },
      pyruvic: { name: "Pyruvic Acid", unit: "mmol/mol creatinine", refMin: 0.28, refMax: 6.7, desc: "Gateway metabolite between glycolysis and the Krebs cycle; elevated when thiamine (B1) or lipoic acid is insufficient." },
      succinic: { name: "Succinic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 5.3, desc: "Krebs cycle intermediate at complex II; elevation suggests CoQ10 deficiency or mitochondrial electron transport dysfunction." },
      fumaric: { name: "Fumaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.49, desc: "Krebs cycle intermediate; elevation may indicate fumarase deficiency or mitochondrial energy production impairment." },
      malic: { name: "Malic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.1, desc: "Krebs cycle intermediate; elevated levels suggest a block in the malate-to-oxaloacetate conversion step of the cycle." },
      oxoglutaric2: { name: "2-Oxoglutaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 18, desc: "Key Krebs cycle intermediate linking energy metabolism to amino acid synthesis; elevated in B-vitamin deficiencies." },
      aconitic: { name: "Aconitic Acid", unit: "mmol/mol creatinine", refMin: 4.1, refMax: 23, desc: "Krebs cycle intermediate between citrate and isocitrate; elevation may reflect glutathione depletion or toxic metal burden." },
      citric: { name: "Citric Acid", unit: "mmol/mol creatinine", refMin: 2.2, refMax: 260, desc: "First metabolite of the Krebs cycle; low levels suggest overall mitochondrial dysfunction or ammonia toxicity." },
      methylglutaric3: { name: "3-Methylglutaric Acid", unit: "mmol/mol creatinine", refMin: 0.02, refMax: 0.38, desc: "Marker of leucine metabolism and HMG-CoA lyase activity; elevation can indicate CoQ10 synthesis impairment." },
      hydroxyglutaric3: { name: "3-Hydroxyglutaric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 4.6, desc: "Linked to lysine metabolism; elevated in glutaric aciduria type I and may indicate riboflavin (B2) deficiency." },
      methylglutaconic3: { name: "3-Methylglutaconic Acid", unit: "mmol/mol creatinine", refMin: 0.38, refMax: 2.0, desc: "Produced in leucine catabolism; elevation suggests mitochondrial membrane dysfunction or CoQ10 depletion." },
      isocitric: { name: "Isocitric Acid", unit: "mmol/mol creatinine", refMin: 22, refMax: 65, desc: "Krebs cycle intermediate between citrate and alpha-ketoglutarate; abnormal levels reflect aconitase activity and mitochondrial function." }
    }
  },
  oatNeuro: {
    label: "OAT: Neurotransmitters", icon: "\uD83E\uDDE0",
    markers: {
      hva: { name: "HVA (Homovanillic Acid)", unit: "mmol/mol creatinine", refMin: 0.39, refMax: 2.2, desc: "Primary dopamine metabolite; reflects central and peripheral dopamine turnover and catecholamine pathway activity." },
      vma: { name: "VMA (Vanillylmandelic Acid)", unit: "mmol/mol creatinine", refMin: 0.53, refMax: 2.2, desc: "End metabolite of norepinephrine and epinephrine; marker of adrenal catecholamine production and sympathetic tone." },
      hvaVmaRatio: { name: "HVA/VMA Ratio", unit: "", refMin: 0.32, refMax: 1.4, desc: "Ratio of dopamine to norepinephrine metabolites; abnormal values indicate neurotransmitter pathway imbalances." },
      dopac: { name: "DOPAC (Dihydroxyphenylacetic)", unit: "mmol/mol creatinine", refMin: 0.27, refMax: 1.9, desc: "Direct dopamine metabolite via MAO; low levels suggest reduced dopamine synthesis or increased COMT activity." },
      hvaDopacRatio: { name: "HVA/DOPAC Ratio", unit: "", refMin: 0.17, refMax: 1.6, desc: "Reflects the balance between COMT and MAO dopamine metabolism pathways; indicates enzymatic processing preference." },
      hiaa5: { name: "5-HIAA (5-Hydroxyindoleacetic)", unit: "mmol/mol creatinine", refMin: null, refMax: 2.9, desc: "Primary serotonin metabolite; reflects serotonin synthesis and turnover in the gut and central nervous system." },
      quinolinic: { name: "Quinolinic Acid", unit: "mmol/mol creatinine", refMin: 0.52, refMax: 2.4, desc: "Neurotoxic tryptophan metabolite and NMDA receptor agonist; elevated in neuroinflammation and immune activation." },
      kynurenic: { name: "Kynurenic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.8, desc: "Neuroprotective tryptophan metabolite and NMDA receptor antagonist; counterbalances quinolinic acid neurotoxicity." },
      uracil: { name: "Uracil", unit: "mmol/mol creatinine", refMin: null, refMax: 6.9, desc: "Pyrimidine base involved in RNA metabolism; elevated levels may indicate folate deficiency or dihydropyrimidine dehydrogenase issues." },
      thymine: { name: "Thymine", unit: "mmol/mol creatinine", refMin: null, refMax: 0.36, desc: "Pyrimidine base from DNA turnover; elevation suggests folate cycle disruption or increased cellular turnover." },
      xanthurenic: { name: "Xanthurenic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.96, desc: "Tryptophan metabolite via kynurenine pathway; elevated in vitamin B6 deficiency as B6 is required for its further metabolism." },
      mhpg: { name: "MHPG (3-Methyl-4-OH-Phenylglycol)", unit: "mmol/mol creatinine", refMin: 0.02, refMax: 0.22, desc: "Primary norepinephrine metabolite in the CNS; reflects central noradrenergic activity and sympathetic nervous system tone." },
      kynurenicQuinolinicRatio: { name: "Kynurenic/Quinolinic Ratio", unit: "", refMin: 0.44, refMax: null, desc: "Balance between neuroprotective kynurenic acid and neurotoxic quinolinic acid; low ratio indicates neuroinflammation risk." }
    }
  },
  oatNutritional: {
    label: "OAT: Nutritional & Detox", icon: "\uD83C\uDF3F",
    markers: {
      methylmalonic: { name: "Methylmalonic Acid (B12)", unit: "mmol/mol creatinine", refMin: null, refMax: 2.3, desc: "The most sensitive functional marker for vitamin B12 deficiency; elevated before serum B12 drops below range." },
      pyridoxic: { name: "Pyridoxic Acid (B6)", unit: "mmol/mol creatinine", refMin: null, refMax: 26, desc: "Primary vitamin B6 metabolite; elevated levels suggest adequate B6 intake or rapid B6 catabolism." },
      pantothenic: { name: "Pantothenic Acid (B5)", unit: "mmol/mol creatinine", refMin: null, refMax: 5.4, desc: "Essential component of coenzyme A; low levels impair fatty acid oxidation and adrenal hormone synthesis." },
      glutaric: { name: "Glutaric Acid (B2)", unit: "mmol/mol creatinine", refMin: null, refMax: 0.43, desc: "Accumulates in riboflavin (B2) deficiency due to impaired electron transfer flavoprotein activity." },
      ascorbic: { name: "Ascorbic Acid (Vitamin C)", unit: "mmol/mol creatinine", refMin: 10, refMax: 200, desc: "Reflects vitamin C status; essential antioxidant for collagen synthesis, iron absorption, and immune function." },
      hmg: { name: "3-Hydroxy-3-methylglutaric (CoQ10)", unit: "mmol/mol creatinine", refMin: null, refMax: 26, desc: "Precursor in CoQ10 and cholesterol synthesis; elevation may indicate impaired CoQ10 production or need for supplementation." },
      nac: { name: "N-Acetylcysteine (NAC)", unit: "mmol/mol creatinine", refMin: null, refMax: 0.13, desc: "Glutathione precursor reflecting cysteine availability; low levels suggest oxidative stress and depleted antioxidant reserves." },
      methylcitric: { name: "Methylcitric Acid (Biotin)", unit: "mmol/mol creatinine", refMin: 0.15, refMax: 1.7, desc: "Marker of biotin-dependent carboxylase activity; elevated in biotin deficiency or propionic acid metabolism disorders." },
      pyroglutamic: { name: "Pyroglutamic Acid", unit: "mmol/mol creatinine", refMin: 5.7, refMax: 25, desc: "Reflects glutathione turnover; elevation indicates glutathione depletion, often from acetaminophen use or oxidative stress." },
      hydroxybutyric2: { name: "2-Hydroxybutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.2, desc: "Early marker of insulin resistance and oxidative stress; reflects cysteine catabolism under glutathione demand." },
      orotic: { name: "Orotic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.46, desc: "Pyrimidine synthesis intermediate; elevated in urea cycle disorders, ammonia excess, or arginine deficiency." },
      hydroxyhippuric2: { name: "2-Hydroxyhippuric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.86, desc: "Aspirin and salicylate metabolite; elevation indicates salicylate intake or impaired phase II detoxification." },
      figlu: { name: "FIGLU (Formiminoglutamic Acid)", unit: "mmol/mol creatinine", refMin: null, refMax: 1.5, desc: "Histidine metabolite requiring folate for further processing; elevated in folate deficiency or impaired one-carbon metabolism." },
      hydroxypropionic3: { name: "3-Hydroxypropionic Acid", unit: "mmol/mol creatinine", refMin: 5, refMax: 22, desc: "Propionic acid metabolite; elevated in biotin deficiency, bacterial overgrowth, or propionic acidemia." },
      hydroxyisovaleric3: { name: "3-Hydroxyisovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 29, desc: "Leucine metabolite and functional marker of biotin status; elevated when biotin-dependent carboxylases are impaired." },
      ketophenylacetic: { name: "\u03b1-Ketophenylacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.46, desc: "Phenylalanine transamination product; elevated in PKU, bacterial overgrowth, or impaired phenylalanine hydroxylase activity." },
      hydroxyisobutyric: { name: "\u03b1-Hydroxyisobutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 6.7, desc: "Valine metabolite reflecting BCAA catabolism; elevated in methylmalonic aciduria, lead exposure, or ketoacidosis." }
    }
  },
  oatAminoFatty: {
    label: "OAT: Amino Acids & Lipids", icon: "\uD83D\uDD2C",
    markers: {
      hydroxybutyric3: { name: "3-Hydroxybutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.9, desc: "Primary ketone body indicating fatty acid oxidation; elevated in fasting, ketogenic diets, or diabetic ketoacidosis." },
      acetoacetic: { name: "Acetoacetic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 10, desc: "Ketone body produced during fat metabolism; elevated with fasting, low-carb diets, or impaired glucose utilization." },
      ethylmalonic: { name: "Ethylmalonic Acid", unit: "mmol/mol creatinine", refMin: 0.13, refMax: 2.7, desc: "Marker of short-chain fatty acid oxidation; elevation suggests carnitine deficiency or mitochondrial fatty acid handling issues." },
      methylsuccinic: { name: "Methylsuccinic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.3, desc: "Produced from isoleucine and odd-chain fatty acids; elevation indicates impaired mitochondrial beta-oxidation." },
      adipic: { name: "Adipic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.9, desc: "Medium-chain dicarboxylic acid; elevated in carnitine deficiency or medium-chain acyl-CoA dehydrogenase deficiency." },
      suberic: { name: "Suberic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.9, desc: "Dicarboxylic acid from omega-oxidation of fatty acids; elevation suggests impaired mitochondrial beta-oxidation." },
      sebacic: { name: "Sebacic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 0.14, desc: "Long-chain dicarboxylic acid; elevated when mitochondrial fatty acid oxidation is significantly impaired." },
      hydroxyisovaleric2: { name: "2-Hydroxyisovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Branched-chain amino acid metabolite from valine; elevation suggests impaired BCKDH complex or biotin deficiency." },
      oxoisovaleric2: { name: "2-Oxoisovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Valine catabolism intermediate; accumulates in maple syrup urine disease or thiamine/lipoic acid insufficiency." },
      methyl2oxovaleric3: { name: "3-Methyl-2-oxovaleric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Isoleucine catabolism intermediate; elevated in BCKDH deficiency or maple syrup urine disease variants." },
      hydroxyisocaproic2: { name: "2-Hydroxyisocaproic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Leucine metabolite; elevation indicates impaired branched-chain amino acid catabolism or lactic acidosis." },
      oxoisocaproic2: { name: "2-Oxoisocaproic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Leucine catabolism intermediate; elevated in BCKDH deficiency, suggesting impaired branched-chain amino acid processing." },
      oxo4methiolbutyric2: { name: "2-Oxo-4-methiolbutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Methionine transamination product; elevated levels may indicate impaired methionine recycling or B6 deficiency." },
      mandelic: { name: "Mandelic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Phenylalanine metabolite from gut bacteria and environmental exposure; reflects bacterial aromatic amino acid metabolism." },
      phenyllactic: { name: "Phenyllactic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Phenylalanine metabolite elevated in phenylketonuria and bacterial overgrowth; indicates impaired phenylalanine handling." },
      phenylpyruvic: { name: "Phenylpyruvic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Phenylalanine transamination product; strongly elevated in phenylketonuria (PKU) and BH4 cofactor deficiency." },
      homogentisic: { name: "Homogentisic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Tyrosine catabolism intermediate; markedly elevated in alkaptonuria due to homogentisate 1,2-dioxygenase deficiency." },
      hydroxyphenyllactic4: { name: "4-Hydroxyphenyllactic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 2.0, desc: "Tyrosine metabolite; elevated in liver disease, vitamin C deficiency, or tyrosinemia affecting tyrosine catabolism." },
      nAcetylaspartic: { name: "N-Acetylaspartic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 38, desc: "Concentrated in brain neurons; elevated urinary levels may indicate Canavan disease or increased neuronal turnover." },
      malonic: { name: "Malonic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 9.9, desc: "Inhibitor of succinate dehydrogenase (complex II); elevation impairs mitochondrial energy production." },
      hydroxybutyric4: { name: "4-Hydroxybutyric Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 4.3, desc: "GABA metabolite (GHB); elevated in succinic semialdehyde dehydrogenase deficiency affecting GABA catabolism." },
      phosphoric: { name: "Phosphoric Acid", unit: "mmol/mol creatinine", refMin: 1000, refMax: 4900, desc: "Reflects phosphate metabolism and renal handling; abnormal values may indicate dietary excess or tubular dysfunction." },
      isovalerylglycine: { name: "Isovalerylglycine", unit: "mmol/mol creatinine", refMin: null, refMax: 3.7, desc: "Leucine metabolite conjugated with glycine; elevated in isovaleric acidemia or impaired leucine catabolism." },
      ketoadipic: { name: "\u03b1-Ketoadipic Acid", unit: "mmol/mol creatinine", refMin: null, refMax: 1.7, desc: "Lysine and tryptophan catabolism intermediate; elevated in alpha-ketoadipic aciduria or B-vitamin cofactor deficiencies." }
    }
  },
  oxidativeStress: {
    label: "Oxidative Stress", icon: "\uD83D\uDD25",
    markers: {
      lipidPeroxides: { name: "Lipid Peroxides (Urine)", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 10.0, desc: "Marker of lipid oxidation damage to cell membranes; elevated levels indicate systemic oxidative stress and free radical activity." },
      ohdg8: { name: "8-OHdG (Urine)", unit: "mcg/g creatinine", refMin: null, refMax: 15, desc: "Oxidized DNA base excreted in urine; a direct marker of oxidative DNA damage and genomic instability." }
    }
  },
  urineAmino: {
    label: "Urine Amino Acids", icon: "\uD83E\uDDEC",
    markers: {
      arginine: { name: "Arginine", unit: "\u00b5mol/g creatinine", refMin: 3, refMax: 33, desc: "Semi-essential amino acid and nitric oxide precursor; low levels impair vasodilation, immune function, and wound healing." },
      histidine: { name: "Histidine", unit: "\u00b5mol/g creatinine", refMin: 127, refMax: 800, desc: "Essential amino acid and histamine precursor; low levels associated with rheumatoid arthritis and impaired antioxidant capacity." },
      isoleucine: { name: "Isoleucine", unit: "\u00b5mol/g creatinine", refMin: 3, refMax: 28, desc: "Branched-chain amino acid essential for muscle protein synthesis, energy production, and immune function." },
      leucine: { name: "Leucine", unit: "\u00b5mol/g creatinine", refMin: 4, refMax: 46, desc: "Key BCAA that activates mTOR signaling for muscle protein synthesis; the most potent anabolic amino acid." },
      lysine: { name: "Lysine", unit: "\u00b5mol/g creatinine", refMin: 11, refMax: 175, desc: "Essential amino acid required for collagen synthesis, carnitine production, and calcium absorption." },
      methionine: { name: "Methionine", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 18, desc: "Essential sulfur amino acid and SAMe precursor; critical for methylation, detoxification, and glutathione synthesis." },
      phenylalanine: { name: "Phenylalanine", unit: "\u00b5mol/g creatinine", refMin: 8, refMax: 71, desc: "Essential amino acid converted to tyrosine; precursor for dopamine, norepinephrine, and thyroid hormones." },
      taurine: { name: "Taurine", unit: "\u00b5mol/g creatinine", refMin: 21, refMax: 424, desc: "Conditionally essential amino acid concentrated in heart, brain, and retina; supports bile acid conjugation and antioxidant defense." },
      threonine: { name: "Threonine", unit: "\u00b5mol/g creatinine", refMin: 12, refMax: 123, desc: "Essential amino acid important for mucin production, gut barrier integrity, and glycine/serine metabolism." },
      tryptophan: { name: "Tryptophan", unit: "\u00b5mol/g creatinine", refMin: 5, refMax: 53, desc: "Essential amino acid and serotonin/melatonin precursor; diverted to kynurenine pathway during inflammation." },
      valine: { name: "Valine", unit: "\u00b5mol/g creatinine", refMin: 7, refMax: 49, desc: "Branched-chain amino acid involved in muscle metabolism and gluconeogenesis; competes with tryptophan for brain uptake." },
      alanine: { name: "Alanine", unit: "\u00b5mol/g creatinine", refMin: 63, refMax: 295, desc: "Nonessential amino acid central to glucose-alanine cycle; carries nitrogen from muscle to liver for gluconeogenesis." },
      asparagine: { name: "Asparagine", unit: "\u00b5mol/g creatinine", refMin: 25, refMax: 119, desc: "Nonessential amino acid involved in nitrogen transport and nervous system function; supports ammonia detoxification." },
      asparticAcid: { name: "Aspartic Acid", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 14, desc: "Nonessential amino acid involved in the urea cycle and Krebs cycle; participates in neurotransmission as excitatory amino acid." },
      cysteine: { name: "Cysteine", unit: "\u00b5mol/g creatinine", refMin: 8, refMax: 74, desc: "Semi-essential sulfur amino acid and glutathione precursor; rate-limiting for the body's master antioxidant synthesis." },
      cystine: { name: "Cystine", unit: "\u00b5mol/g creatinine", refMin: 10, refMax: 104, desc: "Oxidized dimer of cysteine; elevated urinary cystine may indicate cystinuria or impaired renal tubular reabsorption." },
      gaba: { name: "GABA", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 5, desc: "Primary inhibitory neurotransmitter; urinary levels reflect peripheral GABA metabolism and GABAergic system activity." },
      glutamicAcid: { name: "Glutamic Acid", unit: "\u00b5mol/g creatinine", refMin: 4, refMax: 27, desc: "Excitatory neurotransmitter and metabolic hub amino acid; elevated levels may indicate blood-brain barrier permeability." },
      glutamine: { name: "Glutamine", unit: "\u00b5mol/g creatinine", refMin: 110, refMax: 528, desc: "Most abundant amino acid in the body; critical fuel for enterocytes and immune cells, depleted during stress and illness." },
      proline: { name: "Proline", unit: "\u00b5mol/g creatinine", refMin: 1, refMax: 13, desc: "Nonessential amino acid concentrated in collagen; important for joint, tendon, and skin structural integrity." },
      tyrosine: { name: "Tyrosine", unit: "\u00b5mol/g creatinine", refMin: 11, refMax: 135, desc: "Nonessential amino acid (from phenylalanine) and precursor to dopamine, norepinephrine, epinephrine, and thyroid hormones." }
    }
  },
  urineAminoMetab: {
    label: "Urine Amino Metabolites", icon: "\uD83D\uDD04",
    markers: {
      aminoadipic: { name: "\u03b1-Aminoadipic Acid", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 47, desc: "Lysine catabolism intermediate and early biomarker of diabetes risk; elevated levels predict insulin resistance development." },
      aminoNbutyric: { name: "\u03b1-Amino-N-butyric Acid", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 25, desc: "Threonine and methionine catabolism marker; reflects methylation pathway activity and one-carbon metabolism status." },
      aminoisobutyric: { name: "\u03b2-Aminoisobutyric Acid", unit: "\u00b5mol/g creatinine", refMin: 11, refMax: 160, desc: "Thymine catabolism product and myokine; promotes fatty acid oxidation and browning of white adipose tissue." },
      cystathionine: { name: "Cystathionine", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 68, desc: "Transsulfuration pathway intermediate; elevated in vitamin B6 deficiency or CBS enzyme dysfunction." },
      citrulline: { name: "Citrulline", unit: "\u00b5mol/g creatinine", refMin: 0.6, refMax: 3.9, desc: "Urea cycle intermediate and marker of intestinal enterocyte mass; low levels indicate small bowel damage or loss." },
      ornithine: { name: "Ornithine", unit: "\u00b5mol/g creatinine", refMin: 2, refMax: 21, desc: "Urea cycle amino acid; elevated in urea cycle enzyme deficiencies, low in arginine deficiency or excessive ammonia clearance." },
      urea: { name: "Urea", unit: "mg/g creatinine", refMin: 168, refMax: 465, desc: "End product of protein catabolism via urea cycle; reflects protein intake, liver synthetic function, and renal excretion capacity." },
      glycine: { name: "Glycine", unit: "\u00b5mol/g creatinine", refMin: 95, refMax: 683, desc: "Simplest amino acid with major roles in collagen, glutathione, creatine, and heme synthesis; also an inhibitory neurotransmitter." },
      serine: { name: "Serine", unit: "\u00b5mol/g creatinine", refMin: 40, refMax: 163, desc: "Nonessential amino acid central to one-carbon metabolism, phospholipid synthesis, and glycine/cysteine production." },
      ethanolamine: { name: "Ethanolamine", unit: "\u00b5mol/g creatinine", refMin: 50, refMax: 235, desc: "Component of phosphatidylethanolamine in cell membranes; reflects phospholipid turnover and membrane integrity." },
      phosphoethanolamine: { name: "Phosphoethanolamine", unit: "\u00b5mol/g creatinine", refMin: 1, refMax: 13, desc: "Phospholipid precursor involved in cell membrane synthesis; elevated in hypophosphatasia or bone metabolism disorders." },
      phosphoserine: { name: "Phosphoserine", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 13, desc: "Phosphorylated serine involved in cell signaling and one-carbon metabolism; elevated in certain metabolic disorders." },
      sarcosine: { name: "Sarcosine", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 1.2, desc: "N-methylglycine involved in methionine metabolism; elevated in folate deficiency or sarcosine dehydrogenase deficiency." },
      anserine: { name: "Anserine", unit: "\u00b5mol/g creatinine", refMin: 0.4, refMax: 105.1, desc: "Methylated carnosine dipeptide from dietary meat and fish; reflects animal protein intake and histidine metabolism." },
      carnosine: { name: "Carnosine", unit: "\u00b5mol/g creatinine", refMin: 1, refMax: 28, desc: "Dipeptide concentrated in muscle and brain; acts as intracellular buffer, antioxidant, and anti-glycation agent." },
      methylhistidine1: { name: "1-Methylhistidine", unit: "\u00b5mol/g creatinine", refMin: 38, refMax: 988, desc: "Dietary meat marker from anserine metabolism; reflects recent animal protein consumption rather than endogenous muscle breakdown." },
      methylhistidine3: { name: "3-Methylhistidine", unit: "\u00b5mol/g creatinine", refMin: 44, refMax: 281, desc: "Marker of myofibrillar protein breakdown from actin and myosin; reflects skeletal muscle turnover rate." },
      betaAlanine: { name: "\u03b2-Alanine", unit: "\u00b5mol/g creatinine", refMin: null, refMax: 22, desc: "Rate-limiting precursor for carnosine synthesis; supplementation increases muscle carnosine and high-intensity exercise capacity." }
    }
  },
  toxicElements: {
    label: "Toxic Elements", icon: "\u2620\uFE0F",
    markers: {
      lead: { name: "Lead", unit: "\u00b5g/g creatinine", refMin: null, refMax: 1.4, desc: "Neurotoxic heavy metal from paint, water pipes, and industrial exposure; impairs cognitive function and causes anemia." },
      mercury: { name: "Mercury", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2.19, desc: "Toxic metal from fish, dental amalgams, and industrial sources; damages nervous system, kidneys, and immune function." },
      aluminum: { name: "Aluminum", unit: "\u00b5g/g creatinine", refMin: null, refMax: 22.3, desc: "Neurotoxic metal from cookware, antacids, and water treatment; accumulates in brain tissue and disrupts phosphate metabolism." },
      antimony: { name: "Antimony", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.149, desc: "Toxic metalloid from flame retardants and industrial exposure; causes cardiac, hepatic, and respiratory toxicity." },
      arsenic: { name: "Arsenic", unit: "\u00b5g/g creatinine", refMin: null, refMax: 50, desc: "Carcinogenic metalloid from contaminated water and rice; causes skin lesions, neuropathy, and increased cancer risk." },
      barium: { name: "Barium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 6.7, desc: "Alkaline earth metal from drinking water and industrial exposure; can cause hypokalemia, muscle weakness, and cardiac arrhythmias." },
      bismuth: { name: "Bismuth", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2.28, desc: "Metal from medications (Pepto-Bismol) and cosmetics; generally low toxicity but high levels may cause encephalopathy." },
      cadmium: { name: "Cadmium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.64, desc: "Highly toxic metal from cigarette smoke and industrial exposure; accumulates in kidneys and causes renal tubular dysfunction." },
      cesium: { name: "Cesium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 10.5, desc: "Alkali metal absorbed from diet and environment; high levels may compete with potassium at cellular channels." },
      gadolinium: { name: "Gadolinium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.019, desc: "Rare earth metal from MRI contrast agents; retained in brain and bones, may cause nephrogenic systemic fibrosis." },
      gallium: { name: "Gallium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.028, desc: "Metal from semiconductor industry and medical imaging; elevated levels reflect occupational or environmental exposure." },
      nickel: { name: "Nickel", unit: "\u00b5g/g creatinine", refMin: null, refMax: 3.88, desc: "Metal allergen from jewelry, dental work, and food; excess causes dermatitis, respiratory issues, and potential carcinogenesis." },
      platinum: { name: "Platinum", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.033, desc: "Noble metal from catalytic converters and chemotherapy drugs; occupational or medical exposure can cause nephrotoxicity." },
      rubidium: { name: "Rubidium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2263, desc: "Alkali metal that substitutes for potassium; reflects dietary intake and potassium channel function." },
      thallium: { name: "Thallium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.298, desc: "Highly toxic heavy metal from industrial sources; causes painful neuropathy, hair loss, and multi-organ failure." },
      tin: { name: "Tin", unit: "\u00b5g/g creatinine", refMin: null, refMax: 2.04, desc: "Metal from canned foods and dental alloys; elevated levels may impair zinc and copper metabolism." },
      tungsten: { name: "Tungsten", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.211, desc: "Refractory metal from mining and manufacturing; emerging concern for disruption of purine metabolism and molybdenum pathways." },
      uranium: { name: "Uranium", unit: "\u00b5g/g creatinine", refMin: null, refMax: 0.026, desc: "Radioactive and chemically toxic metal from contaminated water; primarily damages renal proximal tubules." }
    }
  },
  nutrientElements: {
    label: "Nutrient Elements", icon: "\u2699\uFE0F",
    markers: {
      chromium: { name: "Chromium", unit: "\u00b5g/g creatinine", refMin: 0.6, refMax: 9.4, desc: "Essential trace element that enhances insulin signaling; deficiency impairs glucose tolerance and lipid metabolism." },
      cobalt: { name: "Cobalt", unit: "\u00b5g/g creatinine", refMin: 0.01, refMax: 2.60, desc: "Core component of vitamin B12; excess from metal implants or supplements causes cardiomyopathy and thyroid dysfunction." },
      copper: { name: "Copper (Urine)", unit: "\u00b5g/g creatinine", refMin: 4.0, refMax: 11.4, desc: "Essential trace element for ceruloplasmin and cytochrome c oxidase; urinary copper elevated in Wilson's disease." },
      iron: { name: "Iron (Urine)", unit: "\u00b5g/g creatinine", refMin: 5, refMax: 64, desc: "Essential element for oxygen transport; urinary iron reflects renal handling and is elevated in hemolysis or iron overload." },
      lithium: { name: "Lithium", unit: "\u00b5g/g creatinine", refMin: 9, refMax: 129, desc: "Trace element with neuroprotective properties at low doses; supports mood stability and gray matter volume preservation." },
      manganese: { name: "Manganese", unit: "\u00b5g/g creatinine", refMin: 0.03, refMax: 1.16, desc: "Essential cofactor for MnSOD antioxidant enzyme and bone formation; excess causes manganism (Parkinson-like symptoms)." },
      molybdenum: { name: "Molybdenum", unit: "\u00b5g/g creatinine", refMin: 15, refMax: 175, desc: "Essential trace element cofactor for xanthine oxidase and sulfite oxidase; deficiency impairs sulfur amino acid metabolism." },
      selenium: { name: "Selenium", unit: "\u00b5g/g creatinine", refMin: 32, refMax: 333, desc: "Essential for glutathione peroxidase and thyroid hormone conversion; urinary levels reflect selenium intake and status." },
      strontium: { name: "Strontium", unit: "\u00b5g/g creatinine", refMin: 47, refMax: 346, desc: "Bone-seeking element that stimulates osteoblasts; used therapeutically for osteoporosis, reflects calcium metabolism." },
      vanadium: { name: "Vanadium", unit: "\u00b5g/g creatinine", refMin: 0.1, refMax: 3.2, desc: "Trace element with insulin-mimetic properties; excess from industrial or supplement sources may cause GI and renal toxicity." },
      zinc: { name: "Zinc (Urine)", unit: "\u00b5g/g creatinine", refMin: 63, refMax: 688, desc: "Essential element for 300+ enzymes including immune function and wound healing; urinary zinc reflects zinc status and renal handling." },
      calcium: { name: "Calcium (Urine)", unit: "mg/g creatinine", refMin: 37, refMax: 313, desc: "Urinary calcium reflects intestinal absorption, bone turnover, and renal handling; elevated in hypercalciuria and bone loss." },
      magnesiumUrine: { name: "Magnesium (Urine)", unit: "mg/g creatinine", refMin: 41, refMax: 267, desc: "Urinary magnesium reflects dietary intake and renal conservation; low levels may indicate whole-body magnesium depletion." },
      sulfur: { name: "Sulfur", unit: "mg/g creatinine", refMin: 367, refMax: 1328, desc: "Reflects sulfur amino acid metabolism and detoxification capacity; low levels suggest impaired methylation or transsulfuration." }
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
  { label: "TSH vs T3 vs T4", markers: ["thyroid.tsh", "thyroid.ft3", "thyroid.ft4"] },
  { label: "OAT: Krebs Cycle", markers: ["oatMetabolic.succinic", "oatMetabolic.fumaric", "oatMetabolic.malic", "oatMetabolic.citric"] },
  { label: "OAT: Neurotransmitters", markers: ["oatNeuro.hva", "oatNeuro.vma", "oatNeuro.hiaa5"] },
  { label: "OAT: Yeast Markers", markers: ["oatMicrobial.arabinose", "oatMicrobial.citramalic", "oatMicrobial.tartaric"] },
  { label: "OAT: Oxidative Stress", markers: ["oxidativeStress.lipidPeroxides", "oxidativeStress.ohdg8"] },
  { label: "Amino: Branched-Chain", markers: ["urineAmino.isoleucine", "urineAmino.leucine", "urineAmino.valine"] },
  { label: "Elements: Heavy Metals", markers: ["toxicElements.lead", "toxicElements.mercury", "toxicElements.cadmium", "toxicElements.arsenic"] }
];
const CHIP_COLORS = ['#4f8cff','#34d399','#f87171','#fbbf24','#a78bfa','#f472b6','#38bdf8','#fb923c'];

// ── Model pricing ($/M tokens) ──
const MODEL_PRICING = {
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
  }
};
function getModelPricing(provider, modelId) {
  if (!MODEL_PRICING[provider]) return { input: 0, output: 0 };
  const table = MODEL_PRICING[provider];
  const stripped = (modelId || '').replace(/-\d{8}$/, '');
  if (table[stripped]) return table[stripped];
  const prefix = Object.keys(table).filter(k => k !== '_default' && stripped.startsWith(k)).sort((a, b) => b.length - a.length)[0];
  if (prefix) return table[prefix];
  const fallback = table['_default'] || { input: 0, output: 0 };
  return { ...fallback, approx: true };
}
function calculateCost(provider, modelId, inputTokens, outputTokens) {
  const p = getModelPricing(provider, modelId);
  return (p.input * (inputTokens || 0) + p.output * (outputTokens || 0)) / 1_000_000;
}
function formatCost(usd) {
  if (usd === 0) return 'Free';
  if (usd < 0.0001) return '<$0.0001';
  if (usd < 0.01) return '$' + usd.toFixed(4);
  return '$' + usd.toFixed(3);
}

// ── Profile context card option arrays ──
const COMMON_CONDITIONS = [
  'Type 2 Diabetes', 'Type 1 Diabetes', 'Pre-diabetes', 'Insulin Resistance',
  'Hypothyroidism', 'Hashimoto\'s', 'Hyperthyroidism', 'Graves\' Disease',
  'PCOS', 'Endometriosis', 'Iron Deficiency Anemia', 'B12 Deficiency',
  'Celiac Disease', 'Crohn\'s Disease', 'Ulcerative Colitis', 'IBS',
  'Fatty Liver (NAFLD)', 'Hypertension', 'High Cholesterol', 'Metabolic Syndrome',
  'Chronic Kidney Disease', 'Gout', 'Rheumatoid Arthritis', 'Lupus (SLE)',
  'Asthma', 'Sleep Apnea', 'Depression/Anxiety'
];
const DIET_TYPES = ['omnivore', 'pescatarian', 'vegetarian', 'vegan', 'keto', 'low-carb', 'paleo', 'carnivore', 'mediterranean', 'other'];
const DIET_RESTRICTIONS = ['gluten-free', 'dairy-free', 'nut-free', 'soy-free', 'egg-free', 'sugar-free', 'seed oil-free', 'low-sodium', 'low-FODMAP'];
const DIET_PATTERNS = ['3 meals/day', '2 meals/day', 'IF 16:8', 'IF 18:6', 'IF 20:4', 'OMAD', 'no pattern'];
const EXERCISE_FREQ = ['sedentary', '1-2x/week', '3-4x/week', '5-6x/week', 'daily'];
const EXERCISE_TYPES = ['strength', 'cardio/running', 'cycling', 'swimming', 'yoga/mobility', 'walking', 'HIIT', 'sports', 'martial arts'];
const EXERCISE_INTENSITY = ['light', 'moderate', 'intense', 'mixed'];
const DAILY_MOVEMENT = ['sedentary desk job', 'some walking', 'active job', 'very active'];
const SLEEP_DURATIONS = ['<5h', '5-6h', '6-7h', '7-8h', '8-9h', '9+h'];
const SLEEP_QUALITY = ['poor', 'fair', 'good', 'excellent'];
const SLEEP_SCHEDULE = ['consistent', 'somewhat variable', 'very irregular', 'shift work'];
const SLEEP_ROOM_TEMP = ['cold (<18°C / 65°F)', 'cool (18-20°C / 65-68°F)', 'neutral (20-22°C / 68-72°F)', 'warm (>22°C / 72°F)'];
const SLEEP_ISSUES = ['trouble falling asleep', 'waking at night', 'early waking', 'sleep apnea', 'snoring', 'restless legs', 'teeth grinding'];
const SLEEP_ENVIRONMENT = ['blackout curtains', 'eye mask', 'no EMF (WiFi off)', 'grounding sheet', 'magnetico pad', 'white noise', 'earplugs', 'cool mattress'];
const SLEEP_PRACTICES = ['mouth taping', 'CPAP', 'weighted blanket', 'evening magnesium', 'no food 3h before bed', 'cold shower before bed', 'evening walk'];
// Light & Circadian
const LIGHT_AM = ['sunrise outdoor (10+ min)', 'sunrise outdoor (<10 min)', 'morning outdoor (after sunrise)', 'light therapy lamp', 'no AM light habit'];
const LIGHT_DAYTIME = ['mostly outdoors', '2-4h outdoor', '1-2h outdoor', '<1h outdoor', 'mostly indoor'];
const LIGHT_UV = ['regular sun exposure (skin)', 'midday sun when possible', 'UVB lamp', 'avoid sun / always sunscreen', 'no UV awareness'];
const LIGHT_EVENING = ['blue blockers after sunset', 'dim lights after sunset', 'no screens 1-2h before bed', 'f.lux / night shift on devices', 'bright lights until bed', 'screen in bed'];
const LIGHT_COLD = ['cold plunge / ice bath', 'cold shower', 'cold face immersion', 'cold ocean / lake', 'winter cold exposure', 'no cold practice'];
const LIGHT_GROUNDING = ['barefoot on earth daily', 'grounding mat / sheet', 'barefoot occasionally', 'ocean swimming', 'no grounding practice'];
const LIGHT_SCREEN_TIME = ['<2h', '2-4h', '4-8h', '8-12h', '12+h'];
const LIGHT_TECH_ENV = ['multiple monitors at work', 'phone in bedroom', 'smart watch 24/7', 'work from home (all day screens)', 'TV before bed', 'gaming (evening)', 'e-reader before bed'];
const LIGHT_MEAL_TIMING = ['eat within daylight only', 'early dinner (before 6pm)', 'late dinner (after 8pm)', 'skip breakfast', 'time-restricted eating'];
const STRESS_LEVELS = ['low', 'moderate', 'high', 'chronic'];
const STRESS_SOURCES = ['work', 'financial', 'relationships', 'health', 'family', 'caregiving', 'loneliness', 'major life change'];
const STRESS_MGMT = ['meditation', 'therapy', 'exercise', 'nature', 'breathing exercises', 'journaling', 'social support', 'none'];
const LOVE_STATUS = ['single', 'dating', 'in relationship', 'married', 'divorced/separated', 'widowed', 'it\'s complicated'];
const LOVE_SATISFACTION = ['very satisfied', 'satisfied', 'neutral', 'unsatisfied', 'not applicable'];
const LOVE_LIBIDO = ['high', 'normal', 'low', 'very low', 'variable'];
const LOVE_FREQUENCY = ['daily', 'few times/week', 'weekly', 'few times/month', 'monthly', 'rarely', 'none'];
const LOVE_ORGASM = ['consistently', 'usually', 'sometimes', 'rarely', 'never', 'not applicable'];
const LOVE_RELATIONSHIP = ['supportive & secure', 'mostly good', 'strained', 'conflicted', 'emotionally distant', 'codependent', 'new & exciting'];
const LOVE_CONCERNS = ['low desire', 'erectile issues', 'pain during sex', 'performance anxiety', 'mismatched libido', 'hormonal changes', 'medication side effects', 'body image', 'trust issues', 'communication problems'];
const ENV_SETTING = ['urban city center', 'urban residential', 'suburban', 'rural', 'near ocean/lake', 'mountain/altitude', 'island'];
const ENV_CLIMATE = ['tropical', 'dry/arid', 'temperate', 'cold/northern', 'Mediterranean', 'monsoon/humid'];
const ENV_WATER = ['spring water', 'well water', 'reverse osmosis', 'filtered (carbon)', 'tap water (unfiltered)', 'deuterium-depleted', 'distilled', 'bottled'];
const ENV_WATER_CONCERNS = ['fluoridated', 'chlorinated', 'hard water', 'unknown source quality'];
const ENV_EMF = ['WiFi router in bedroom', 'WiFi router nearby', 'smart meter on home', 'cell tower <500m', 'cell tower <2km', 'Bluetooth always on', '5G dense area', 'high-voltage power lines nearby', 'dirty electricity (old wiring)', 'smart home devices'];
const ENV_EMF_MITIGATION = ['WiFi off at night', 'airplane mode sleep', 'wired ethernet', 'EMF meters used', 'faraday canopy', 'no smart meter', 'minimal Bluetooth'];
const ENV_HOME_LIGHT = ['mostly LED lighting', 'incandescent bulbs', 'full-spectrum bulbs', 'fluorescent/CFL', 'natural daylight (large windows)', 'mixed lighting'];
const ENV_AIR = ['HEPA air purifier', 'open windows daily', 'houseplants', 'air quality monitor', 'near highway/traffic', 'industrial area nearby', 'wildfire smoke region', 'high pollen area'];
const ENV_TOXINS = ['mold exposure', 'heavy metals (lead/mercury)', 'pesticide exposure', 'plastic containers for food', 'non-stick cookware (PFAS)', 'conventional cleaning products', 'new car/furniture off-gassing', 'amalgam dental fillings', 'BPA/phthalate exposure', 'organic food mostly'];
const ENV_BUILDING = ['new construction (<5yr)', 'old building (pre-1970)', 'concrete/steel', 'wood frame', 'natural materials', 'carpet (VOCs)', 'hardwood/tile floors'];

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

function saveImportedData() {
  try {
    localStorage.setItem(profileStorageKey(currentProfile, 'imported'), JSON.stringify(importedData));
  } catch (e) {
    showNotification('Storage limit reached — clear old data or profiles to free space.', 'error');
  }
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
    JSON.stringify(importedData.diagnoses || null),
    (importedData.healthGoals || []).map(g => g.text).join(','),
    JSON.stringify(importedData.diet || null),
    JSON.stringify(importedData.exercise || null),
    JSON.stringify(importedData.sleepRest || null),
    JSON.stringify(importedData.lightCircadian || null),
    JSON.stringify(importedData.stress || null),
    JSON.stringify(importedData.loveLife || null),
    JSON.stringify(importedData.environment || null),
    importedData.interpretiveLens || '',
    importedData.contextNotes || '',
    JSON.stringify(importedData.menstrualCycle || null),
    JSON.stringify((importedData.supplements || []).map(s => s.name + ':' + s.startDate))
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
let markerRegistry = {};
let importedData = { entries: [], notes: [], supplements: [], healthGoals: [], diagnoses: null, diet: null, exercise: null, sleepRest: null, lightCircadian: null, stress: null, loveLife: null, environment: null, interpretiveLens: '', contextNotes: '', menstrualCycle: null, customMarkers: {} };
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
// AI PROVIDER MANAGEMENT
// ═══════════════════════════════════════════════
function getApiKey() { return localStorage.getItem('labcharts-api-key') || ''; }
function saveApiKey(key) { localStorage.setItem('labcharts-api-key', key); }
function hasApiKey() { return !!getApiKey(); }
function getAnthropicModel() { return localStorage.getItem('labcharts-anthropic-model') || 'claude-sonnet-4-6'; }
function setAnthropicModel(id) { localStorage.setItem('labcharts-anthropic-model', id); }
function getAnthropicModelDisplay() {
  const id = getAnthropicModel();
  const cached = JSON.parse(localStorage.getItem('labcharts-anthropic-models') || '[]');
  const m = cached.find(function(x) { return x.id === id; });
  return m ? m.display_name || m.id : id;
}
function deduplicateModels(models, familyFn) {
  const seen = {};
  return models.filter(function(m) {
    const fam = familyFn(m.id);
    if (seen[fam]) return false;
    seen[fam] = true;
    return true;
  });
}
async function fetchAnthropicModels(key) {
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

function getAIProvider() { return localStorage.getItem('labcharts-ai-provider') || 'anthropic'; }
function setAIProvider(provider) { localStorage.setItem('labcharts-ai-provider', provider); }
function hasAIProvider() {
  const provider = getAIProvider();
  if (provider === 'anthropic') return hasApiKey();
  if (provider === 'venice') return hasVeniceKey();
  return true; // Ollama — optimistic, errors caught at call time
}

function getOllamaMainModel() { return localStorage.getItem('labcharts-ollama-model') || getOllamaConfig().model || 'llama3.2'; }
function setOllamaMainModel(model) { localStorage.setItem('labcharts-ollama-model', model); }
function getOllamaPIIUrl() { return localStorage.getItem('labcharts-ollama-pii-url') || getOllamaConfig().url; }
function setOllamaPIIUrl(url) { localStorage.setItem('labcharts-ollama-pii-url', url); }
function getOllamaPIIModel() { return localStorage.getItem('labcharts-ollama-pii-model') || getOllamaMainModel(); }
function setOllamaPIIModel(model) { localStorage.setItem('labcharts-ollama-pii-model', model); }

function getVeniceKey() { return localStorage.getItem('labcharts-venice-key') || ''; }
function saveVeniceKey(key) { localStorage.setItem('labcharts-venice-key', key); }
function hasVeniceKey() { return !!getVeniceKey(); }
function getVeniceModel() { return localStorage.getItem('labcharts-venice-model') || 'llama-3.3-70b'; }
function setVeniceModel(model) { localStorage.setItem('labcharts-venice-model', model); }
function getVeniceModelDisplay() {
  const id = getVeniceModel();
  const cached = JSON.parse(localStorage.getItem('labcharts-venice-models') || '[]');
  const m = cached.find(function(x) { return x.id === id; });
  return m ? (m.name || m.id) : id;
}
function renderModelPricingHint(provider, modelId) {
  if (provider === 'ollama') return '<span style="font-size:11px;color:var(--green)">Free (local)</span>';
  const p = getModelPricing(provider, modelId);
  if (p.input === 0 && p.output === 0) return '';
  const pre = p.approx ? '~' : '';
  return `<span style="font-size:11px;color:var(--text-muted)">${pre}$${p.input.toFixed(2)}/M in \u00b7 ${pre}$${p.output.toFixed(2)}/M out</span>`;
}
async function fetchVeniceModels(key) {
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

async function validateApiKey(key) {
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

async function callAnthropicAPI({ system, messages, maxTokens, onStream }) {
  const key = getApiKey();
  if (!key) throw new Error('No API key configured. Add your Claude API key in Settings.');
  const body = {
    model: getAnthropicModel(),
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
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(300000)
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

async function callOllamaChat({ system, messages, maxTokens, onStream }) {
  const config = getOllamaConfig();
  const model = getOllamaMainModel();
  const ollamaMessages = [];
  if (system) ollamaMessages.push({ role: 'system', content: system });
  for (const msg of messages) ollamaMessages.push({ role: msg.role, content: msg.content });

  const body = { model, messages: ollamaMessages, stream: !!onStream };
  if (maxTokens) body.options = { num_predict: maxTokens };

  let res;
  try {
    res = await fetch(`${config.url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300000)
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

async function callVeniceAPI({ system, messages, maxTokens, onStream }) {
  const key = getVeniceKey();
  if (!key) throw new Error('No Venice API key configured. Add your key in Settings.');
  const model = getVeniceModel();
  const apiMessages = [];
  if (system) apiMessages.push({ role: 'system', content: system });
  for (const msg of messages) apiMessages.push({ role: msg.role, content: msg.content });

  const body = { model, messages: apiMessages, max_tokens: maxTokens || 4096 };
  if (onStream) { body.stream = true; body.stream_options = { include_usage: true }; }

  let res;
  try {
    res = await fetch('https://api.venice.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(300000)
    });
  } catch (e) {
    if (e.name === 'TimeoutError' || e.message.includes('timed out')) throw new Error('Venice API timed out after 5 min.');
    throw new Error(`Cannot reach Venice API: ${e.message}`);
  }

  if (!res.ok) {
    if (res.status === 401) throw new Error('Invalid Venice API key. Check your settings.');
    if (res.status === 429) throw new Error('Rate limited. Please wait a moment and try again.');
    let errMsg = `Venice API error (${res.status})`;
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

async function validateVeniceKey(key) {
  try {
    const res = await fetch('https://api.venice.ai/api/v1/models', {
      headers: { 'Authorization': 'Bearer ' + key }
    });
    if (res.ok) return { valid: true };
    if (res.status === 401) return { valid: false, error: 'Invalid API key' };
    if (res.status === 429) return { valid: true }; // Rate limited but key works
    const errBody = await res.json().catch(() => null);
    const errMsg = errBody?.error?.message || `status ${res.status}`;
    return { valid: false, error: `API error: ${errMsg}` };
  } catch (e) {
    return { valid: false, error: 'Cannot reach Venice API: ' + e.message };
  }
}

async function callClaudeAPI(opts) {
  const provider = getAIProvider();
  if (provider === 'ollama') return callOllamaChat(opts);
  if (provider === 'venice') return callVeniceAPI(opts);
  return callAnthropicAPI(opts);
}

// ═══════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════
function openSettingsModal() {
  const overlay = document.getElementById('settings-modal-overlay');
  const modal = document.getElementById('settings-modal');
  const currentTheme = getTheme();
  const provider = getAIProvider();
  modal.innerHTML = `
    <button class="modal-close" onclick="closeSettingsModal()">&times;</button>
    <h3>Settings</h3>

    <div class="settings-group-title">Profile</div>

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
      <label class="settings-label">Location <span style="font-weight:400;color:var(--text-muted);font-size:11px">(for latitude / circadian context)</span></label>
      <div class="loc-inputs">
        <input class="ctx-note-input" id="loc-country" placeholder="Country" value="${escapeHTML(getProfileLocation().country)}" oninput="updateLocationLat()">
        <input class="ctx-note-input loc-zip-input" id="loc-zip" placeholder="ZIP / postal code (refines latitude)" value="${escapeHTML(getProfileLocation().zip)}" oninput="updateLocationLat()">
      </div>
      <div id="loc-lat-display" style="font-size:11px;margin-top:4px"></div>
    </div>

    <div class="settings-group-title">Display</div>

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
      <label class="settings-label">Time Format</label>
      <div class="unit-toggle">
        <button class="time-toggle-btn${getTimeFormat() === '24h' ? ' active' : ''}" data-timefmt="24h" onclick="setTimeFormat('24h');updateSettingsUI()">24h</button>
        <button class="time-toggle-btn${getTimeFormat() === '12h' ? ' active' : ''}" data-timefmt="12h" onclick="setTimeFormat('12h');updateSettingsUI()">12h (AM/PM)</button>
      </div>
    </div>

    <div class="settings-group-title">AI Provider</div>

    <div class="settings-section">
      <div class="ai-provider-desc" style="margin-bottom:10px">For medical data like blood work, state-of-the-art models give the most accurate analysis. Claude is recommended — fastest and best results.</div>
      <div class="ai-provider-toggle">
        <button class="ai-provider-btn${provider === 'anthropic' ? ' active' : ''}" data-provider="anthropic" onclick="switchAIProvider('anthropic')"><svg class="ai-provider-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg> Claude</button>
        <button class="ai-provider-btn${provider === 'venice' ? ' active' : ''}" data-provider="venice" onclick="switchAIProvider('venice')"><svg class="ai-provider-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M2 4l10 18L22 4h-4.5L12 14.5 6.5 4z"/></svg> Venice</button>
        <button class="ai-provider-btn${provider === 'ollama' ? ' active' : ''}" data-provider="ollama" onclick="switchAIProvider('ollama')"><svg class="ai-provider-logo" viewBox="0 0 24 24" fill="currentColor"><path d="M16.361 10.26a.894.894 0 0 0-.558.47l-.072.148.001.207c0 .193.004.217.059.353.076.193.152.312.291.448.24.238.51.3.872.205a.86.86 0 0 0 .517-.436.752.752 0 0 0 .08-.498c-.064-.453-.33-.782-.724-.897a1.06 1.06 0 0 0-.466 0zm-9.203.005c-.305.096-.533.32-.65.639a1.187 1.187 0 0 0-.06.52c.057.309.31.59.598.667.362.095.632.033.872-.205.14-.136.215-.255.291-.448.055-.136.059-.16.059-.353l.001-.207-.072-.148a.894.894 0 0 0-.565-.472 1.02 1.02 0 0 0-.474.007Zm4.184 2c-.131.071-.223.25-.195.383.031.143.157.288.353.407.105.063.112.072.117.136.004.038-.01.146-.029.243-.02.094-.036.194-.036.222.002.074.07.195.143.253.064.052.076.054.255.059.164.005.198.001.264-.03.169-.082.212-.234.15-.525-.052-.243-.042-.28.087-.355.137-.08.281-.219.324-.314a.365.365 0 0 0-.175-.48.394.394 0 0 0-.181-.033c-.126 0-.207.03-.355.124l-.085.053-.053-.032c-.219-.13-.259-.145-.391-.143a.396.396 0 0 0-.193.032zm.39-2.195c-.373.036-.475.05-.654.086-.291.06-.68.195-.951.328-.94.46-1.589 1.226-1.787 2.114-.04.176-.045.234-.045.53 0 .294.005.357.043.524.264 1.16 1.332 2.017 2.714 2.173.3.033 1.596.033 1.896 0 1.11-.125 2.064-.727 2.493-1.571.114-.226.169-.372.22-.602.039-.167.044-.23.044-.523 0-.297-.005-.355-.045-.531-.288-1.29-1.539-2.304-3.072-2.497a6.873 6.873 0 0 0-.855-.031zm.645.937a3.283 3.283 0 0 1 1.44.514c.223.148.537.458.671.662.166.251.26.508.303.82.02.143.01.251-.043.482-.08.345-.332.705-.672.957a3.115 3.115 0 0 1-.689.348c-.382.122-.632.144-1.525.138-.582-.006-.686-.01-.853-.042-.57-.107-1.022-.334-1.35-.68-.264-.28-.385-.535-.45-.946-.03-.192.025-.509.137-.776.136-.326.488-.73.836-.963.403-.269.934-.46 1.422-.512.187-.02.586-.02.773-.002zm-5.503-11a1.653 1.653 0 0 0-.683.298C5.617.74 5.173 1.666 4.985 2.819c-.07.436-.119 1.04-.119 1.503 0 .544.064 1.24.155 1.721.02.107.031.202.023.208a8.12 8.12 0 0 1-.187.152 5.324 5.324 0 0 0-.949 1.02 5.49 5.49 0 0 0-.94 2.339 6.625 6.625 0 0 0-.023 1.357c.091.78.325 1.438.727 2.04l.13.195-.037.064c-.269.452-.498 1.105-.605 1.732-.084.496-.095.629-.095 1.294 0 .67.009.803.088 1.266.095.555.288 1.143.503 1.534.071.128.243.393.264.407.007.003-.014.067-.046.141a7.405 7.405 0 0 0-.548 1.873c-.062.417-.071.552-.071.991 0 .56.031.832.148 1.279L3.42 24h1.478l-.05-.091c-.297-.552-.325-1.575-.068-2.597.117-.472.25-.819.498-1.296l.148-.29v-.177c0-.165-.003-.184-.057-.293a.915.915 0 0 0-.194-.25 1.74 1.74 0 0 1-.385-.543c-.424-.92-.506-2.286-.208-3.451.124-.486.329-.918.544-1.154a.787.787 0 0 0 .223-.531c0-.195-.07-.355-.224-.522a3.136 3.136 0 0 1-.817-1.729c-.14-.96.114-2.005.69-2.834.563-.814 1.353-1.336 2.237-1.475.199-.033.57-.028.776.01.226.04.367.028.512-.041.179-.085.268-.19.374-.431.093-.215.165-.333.36-.576.234-.29.46-.489.822-.729.413-.27.884-.467 1.352-.561.17-.035.25-.04.569-.04.319 0 .398.005.569.04a4.07 4.07 0 0 1 1.914.997c.117.109.398.457.488.602.034.057.095.177.132.267.105.241.195.346.374.43.14.068.286.082.503.045.343-.058.607-.053.943.016 1.144.23 2.14 1.173 2.581 2.437.385 1.108.276 2.267-.296 3.153-.097.15-.193.27-.333.419-.301.322-.301.722-.001 1.053.493.539.801 1.866.708 3.036-.062.772-.26 1.463-.533 1.854a2.096 2.096 0 0 1-.224.258.916.916 0 0 0-.194.25c-.054.109-.057.128-.057.293v.178l.148.29c.248.476.38.823.498 1.295.253 1.008.231 2.01-.059 2.581a.845.845 0 0 0-.044.098c0 .006.329.009.732.009h.73l.02-.074.036-.134c.019-.076.057-.3.088-.516.029-.217.029-1.016 0-1.258-.11-.875-.295-1.57-.597-2.226-.032-.074-.053-.138-.046-.141.008-.005.057-.074.108-.152.376-.569.607-1.284.724-2.228.031-.26.031-1.378 0-1.628-.083-.645-.182-1.082-.348-1.525a6.083 6.083 0 0 0-.329-.7l-.038-.064.131-.194c.402-.604.636-1.262.727-2.04a6.625 6.625 0 0 0-.024-1.358 5.512 5.512 0 0 0-.939-2.339 5.325 5.325 0 0 0-.95-1.02 8.097 8.097 0 0 1-.186-.152.692.692 0 0 1 .023-.208c.208-1.087.201-2.443-.017-3.503-.19-.924-.535-1.658-.98-2.082-.354-.338-.716-.482-1.15-.455-.996.059-1.8 1.205-2.116 3.01a6.805 6.805 0 0 0-.097.726c0 .036-.007.066-.015.066a.96.96 0 0 1-.149-.078A4.857 4.857 0 0 0 12 3.03c-.832 0-1.687.243-2.456.698a.958.958 0 0 1-.148.078c-.008 0-.015-.03-.015-.066a6.71 6.71 0 0 0-.097-.725C8.997 1.392 8.337.319 7.46.048a2.096 2.096 0 0 0-.585-.041Zm.293 1.402c.248.197.523.759.682 1.388.03.113.06.244.069.292.007.047.026.152.041.233.067.365.098.76.102 1.24l.002.475-.12.175-.118.178h-.278c-.324 0-.646.041-.954.124l-.238.06c-.033.007-.038-.003-.057-.144a8.438 8.438 0 0 1 .016-2.323c.124-.788.413-1.501.696-1.711.067-.05.079-.049.157.013zm9.825-.012c.17.126.358.46.498.888.28.854.36 2.028.212 3.145-.019.14-.024.151-.057.144l-.238-.06a3.693 3.693 0 0 0-.954-.124h-.278l-.119-.178-.119-.175.002-.474c.004-.669.066-1.19.214-1.772.157-.623.434-1.185.68-1.382.078-.062.09-.063.159-.012z"/></svg> Ollama</button>
      </div>
      <div id="ai-provider-panel">${renderAIProviderPanel(provider)}</div>
    </div>

    <div class="settings-group-title">PDF Import Privacy</div>

    <div class="settings-section" id="privacy-section">
      ${renderPrivacySection()}
    </div>`;
  overlay.classList.add('show');
  updateLocationLat();
  initSettingsOllamaCheck();
  initSettingsAnthropicModels();
}

function renderAIProviderPanel(provider) {
  if (provider === 'anthropic') {
    const currentKey = getApiKey();
    const cachedModels = JSON.parse(localStorage.getItem('labcharts-anthropic-models') || '[]');
    const currentModel = getAnthropicModel();
    let modelHtml;
    if (cachedModels.length > 0) {
      const opts = cachedModels.map(function(m) {
        const label = m.display_name || m.id;
        return '<option value="' + m.id + '"' + (currentModel === m.id ? ' selected' : '') + '>' + label + '</option>';
      }).join('');
      modelHtml = `<div style="margin-top:12px" id="anthropic-model-area">
        <label style="font-size:12px;color:var(--text-muted)">Model</label>
        <select class="api-key-input" id="anthropic-model-select" style="margin-top:4px" onchange="setAnthropicModel(this.value);updateAnthropicModelPricing(this.value)">${opts}</select>
        <div id="anthropic-model-pricing" style="margin-top:4px">${renderModelPricingHint('anthropic', currentModel)}</div>
      </div>`;
    } else {
      modelHtml = `<div style="margin-top:12px;font-size:12px;color:var(--text-muted)" id="anthropic-model-area">Model: <span style="color:var(--text-primary)">${escapeHTML(getAnthropicModelDisplay())}</span>${currentKey ? ' <span style="font-size:11px">(save key to load models)</span>' : ''}</div>`;
    }
    return `<div class="ai-provider-panel">
      <div class="ai-provider-desc">Anthropic's AI models, run in the cloud. Requires an API key (pay-per-use).</div>
      <div class="api-key-status" id="api-key-status">
        ${currentKey ? '<span style="color:var(--green)">&#10003; Connected</span>' : '<span style="color:var(--text-muted)">No key set</span>'}
      </div>
      <input type="password" class="api-key-input" id="api-key-input" placeholder="sk-ant-api03-..." value="${currentKey}">
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="import-btn import-btn-primary" id="save-api-key-btn" onclick="handleSaveApiKey()">Save & Validate</button>
        ${currentKey ? '<button class="import-btn import-btn-secondary" onclick="handleRemoveApiKey()">Remove Key</button>' : ''}
      </div>
      ${modelHtml}
      <div class="api-key-notice">Your API key is stored locally in your browser and sent directly to Anthropic's API. It never passes through any third-party server.</div>
    </div>`;
  }
  if (provider === 'venice') {
    const currentKey = getVeniceKey();
    const veniceModel = getVeniceModel();
    const cachedVeniceModels = JSON.parse(localStorage.getItem('labcharts-venice-models') || '[]');
    let veniceModelHtml;
    if (cachedVeniceModels.length > 0) {
      const opts = cachedVeniceModels.map(function(m) {
        const label = m.name || m.id;
        return '<option value="' + m.id + '"' + (veniceModel === m.id ? ' selected' : '') + '>' + escapeHTML(label) + '</option>';
      }).join('');
      veniceModelHtml = `<div style="margin-top:12px" id="venice-model-area">
        <label style="font-size:12px;color:var(--text-muted)">Model</label>
        <select class="api-key-input" id="venice-model-select" style="margin-top:4px" onchange="setVeniceModel(this.value);updateVeniceModelPricing(this.value)">${opts}</select>
        <div id="venice-model-pricing" style="margin-top:4px">${renderModelPricingHint('venice', veniceModel)}</div>
      </div>`;
    } else {
      veniceModelHtml = `<div style="margin-top:12px;font-size:12px;color:var(--text-muted)" id="venice-model-area">Model: <span style="color:var(--text-primary)">${escapeHTML(getVeniceModelDisplay())}</span>${currentKey ? ' <span style="font-size:11px">(save key to load models)</span>' : ''}</div>`;
    }
    return `<div class="ai-provider-panel">
      <div class="ai-provider-desc">Privacy-focused cloud AI. Uncensored models, no data stored. Requires API key.</div>
      <div class="api-key-status" id="venice-key-status">
        ${currentKey ? '<span style="color:var(--green)">&#10003; Connected</span>' : '<span style="color:var(--text-muted)">No key set</span>'}
      </div>
      <input type="password" class="api-key-input" id="venice-key-input" placeholder="venice-..." value="${currentKey}">
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="import-btn import-btn-primary" id="save-venice-key-btn" onclick="handleSaveVeniceKey()">Save & Validate</button>
        ${currentKey ? '<button class="import-btn import-btn-secondary" onclick="handleRemoveVeniceKey()">Remove Key</button>' : ''}
      </div>
      ${veniceModelHtml}
      <div class="api-key-notice">Your key is stored locally and sent directly to Venice AI. No data is stored on their servers. <a href="https://venice.ai/settings/api" target="_blank" rel="noopener" style="color:var(--accent)">Get an API key</a></div>
    </div>`;
  }
  // Local AI (Ollama) panel
  const config = getOllamaConfig();
  return `<div class="ai-provider-panel">
    <div class="ai-provider-desc">Runs AI on your computer. Free, private, no data leaves your machine.</div>
    <div class="ollama-status" id="ollama-status">
      <span class="ollama-status-dot" id="ollama-dot"></span>
      <span id="ollama-status-text">Checking connection...</span>
    </div>
    <div style="margin-top:8px">
      <label style="font-size:12px;color:var(--text-muted)">Server address</label>
      <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
        <input type="text" class="api-key-input" id="ollama-url-input" value="${config.url}" placeholder="http://localhost:11434" style="flex:1">
        <button class="import-btn import-btn-secondary" onclick="testOllamaConnection()" style="white-space:nowrap">Test</button>
      </div>
    </div>
    <div id="ollama-model-section" style="margin-top:8px;display:none">
      <label style="font-size:12px;color:var(--text-muted)">AI Model</label>
      <select class="api-key-input" id="ollama-model-select" style="margin-top:4px" onchange="setOllamaMainModel(this.value)"></select>
      <div style="margin-top:4px">${renderModelPricingHint('ollama', '')}</div>
    </div>
    <div class="api-key-notice" style="margin-top:12px">
      Requires <a href="https://ollama.com" target="_blank" rel="noopener" style="color:var(--accent)">Ollama</a> installed on your computer. After installing, run <code style="font-size:11px;padding:2px 4px;background:var(--bg-primary);border-radius:3px">ollama pull llama3.2</code> to get a model.
    </div>
  </div>`;
}

function renderPrivacySection() {
  const piiUrl = getOllamaPIIUrl();
  return `<div class="ollama-settings">
    <div class="ai-provider-desc" style="margin-bottom:10px">Before your lab PDF is sent to AI for analysis, personal information (name, date of birth, ID numbers, address) is detected and replaced with fake data. Only lab results and marker values reach the AI provider.</div>
    <div class="privacy-status-card" id="privacy-status-card">
      <div class="privacy-status-icon" id="privacy-status-icon">&#128274;</div>
      <div class="privacy-status-body">
        <div class="privacy-status-title" id="privacy-status-title">Checking...</div>
        <div class="privacy-status-detail" id="privacy-status-detail"></div>
      </div>
    </div>
    <div class="privacy-configure-toggle" onclick="togglePrivacyConfigure()">
      <span class="privacy-configure-arrow" id="privacy-configure-arrow">&#9654;</span>
      Configure Local AI
    </div>
    <div class="privacy-configure-body" id="privacy-configure-body" style="display:none">
      <div id="pii-model-section">
        <div class="ollama-status" id="pii-ollama-status">
          <span class="ollama-status-dot" id="pii-ollama-dot"></span>
          <span id="pii-ollama-status-text">Click Test to check</span>
        </div>
        <div style="margin-top:8px">
          <label style="font-size:12px;color:var(--text-muted)">Server address</label>
          <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
            <input type="text" class="api-key-input" id="pii-ollama-url-input" value="${piiUrl}" placeholder="http://localhost:11434" style="flex:1">
            <button class="import-btn import-btn-secondary" onclick="testPIIOllamaConnection()" style="white-space:nowrap">Test</button>
          </div>
        </div>
        <div id="pii-model-dropdown" style="margin-top:8px;display:none">
          <label style="font-size:12px;color:var(--text-muted)">Privacy model <span style="font-size:11px">(can be a smaller, faster model)</span></label>
          <select class="api-key-input" id="pii-model-select" style="margin-top:4px" onchange="setOllamaPIIModel(this.value)"></select>
        </div>
      </div>
      <div style="margin-top:8px">
        <label style="font-size:13px;cursor:pointer;display:flex;align-items:start;gap:6px">
          <input type="checkbox" id="pii-review-toggle" style="margin-top:2px" ${isPIIReviewEnabled() ? 'checked' : ''} onchange="setPIIReviewEnabled(this.checked)">
          <span>Review obfuscated text before sending to AI<br><span style="font-size:11px;color:var(--text-muted)">Pause after privacy protection to inspect what AI will receive</span></span>
        </label>
      </div>
      <div style="margin-top:8px">
        <label style="font-size:13px;cursor:pointer;display:flex;align-items:center;gap:6px">
          <input type="checkbox" id="debug-mode-toggle" ${isDebugMode() ? 'checked' : ''} onchange="setDebugMode(this.checked)">
          Show privacy details in import preview
        </label>
      </div>
    </div>
  </div>`;
}

function togglePrivacyConfigure() {
  const body = document.getElementById('privacy-configure-body');
  const arrow = document.getElementById('privacy-configure-arrow');
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.innerHTML = open ? '&#9654;' : '&#9660;';
}

async function updatePrivacyStatusCard(enhanced) {
  const icon = document.getElementById('privacy-status-icon');
  const title = document.getElementById('privacy-status-title');
  const detail = document.getElementById('privacy-status-detail');
  const card = document.getElementById('privacy-status-card');
  if (!title || !detail || !card) return;
  // If not passed explicitly, check PII Ollama
  if (enhanced === undefined) {
    try {
      const piiUrl = getOllamaPIIUrl();
      const resp = await fetch(`${piiUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
      if (resp.ok) {
        const data = await resp.json();
        const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
        enhanced = models.length > 0;
      } else {
        enhanced = false;
      }
    } catch { enhanced = false; }
  }
  if (enhanced) {
    const model = getOllamaPIIModel();
    card.className = 'privacy-status-card privacy-status-enhanced';
    if (icon) icon.innerHTML = '&#128274;';
    title.textContent = 'Enhanced protection';
    detail.textContent = `Local AI (${model}) understands context and language, so it reliably finds and replaces all personal info — including uncommon formats and non-English text.`;
  } else {
    card.className = 'privacy-status-card privacy-status-basic';
    if (icon) icon.innerHTML = '&#128274;';
    title.textContent = 'Basic protection';
    detail.innerHTML = 'Regex pattern matching catches common formats (names on labeled lines, IDs, emails, phone numbers). May miss unusual layouts or non-English personal data.<br><span style="margin-top:4px;display:inline-block">Install <a href="https://ollama.com" target="_blank" rel="noopener" style="color:var(--accent)">Ollama</a> for enhanced protection — a free local AI that reliably catches all personal info.</span>';
  }
}

function switchAIProvider(provider) {
  setAIProvider(provider);
  const panel = document.getElementById('ai-provider-panel');
  if (panel) panel.innerHTML = renderAIProviderPanel(provider);
  const modal = document.getElementById('settings-modal');
  if (modal) {
    modal.querySelectorAll('.ai-provider-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.provider === provider));
  }
  initSettingsOllamaCheck();
  initSettingsAnthropicModels();
}

function initSettingsAnthropicModels() {
  const key = getApiKey();
  if (key && document.getElementById('anthropic-model-area')) {
    fetchAnthropicModels(key).then(function(models) { if (models.length) renderAnthropicModelDropdown(models); });
  }
  const veniceKey = getVeniceKey();
  if (veniceKey && document.getElementById('venice-model-area')) {
    fetchVeniceModels(veniceKey).then(function(models) { if (models.length) renderVeniceModelDropdown(models); });
  }
}

function initSettingsOllamaCheck() {
  const mainUrl = getOllamaConfig().url;
  const piiUrl = getOllamaPIIUrl();
  const sameUrl = mainUrl === piiUrl;

  // Check main Ollama if the panel is visible (Ollama provider selected)
  if (document.getElementById('ollama-dot')) {
    checkOllama().then(result => {
      const dot = document.getElementById('ollama-dot');
      const text = document.getElementById('ollama-status-text');
      const modelSection = document.getElementById('ollama-model-section');
      const modelSelect = document.getElementById('ollama-model-select');
      if (!dot || !text) return;
      if (result.available && result.models.length > 0) {
        dot.classList.add('connected');
        let currentModel = getOllamaMainModel();
        if (!result.models.includes(currentModel)) {
          currentModel = result.models[0];
          setOllamaMainModel(currentModel);
        }
        text.textContent = `Connected (${currentModel})`;
        if (modelSection && modelSelect) {
          modelSection.style.display = 'block';
          modelSelect.innerHTML = result.models.map(m => `<option value="${escapeHTML(m)}" ${m === currentModel ? 'selected' : ''}>${escapeHTML(m)}</option>`).join('');
        }
      } else if (result.available) {
        dot.classList.add('disconnected');
        text.textContent = 'Connected but no models found. Run: ollama pull llama3.2';
      } else {
        dot.classList.add('disconnected');
        text.textContent = 'Not connected — start Ollama to use';
      }
      // Reuse result for privacy card if same URL
      if (sameUrl) {
        updatePrivacyStatusCard(result.available && result.models.length > 0);
      } else {
        updatePrivacyStatusCard();
      }
    });
  } else {
    // Main panel not visible — just update privacy card
    updatePrivacyStatusCard();
  }
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
  const timeFmt = getTimeFormat();
  modal.querySelectorAll('.time-toggle-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.timefmt === timeFmt));
}

function closeSettingsModal() {
  document.getElementById('settings-modal-overlay').classList.remove('show');
}

async function testOllamaConnection() {
  const urlInput = document.getElementById('ollama-url-input');
  const dot = document.getElementById('ollama-dot');
  const text = document.getElementById('ollama-status-text');
  const modelSection = document.getElementById('ollama-model-section');
  const modelSelect = document.getElementById('ollama-model-select');
  if (!urlInput || !text) return;
  const url = urlInput.value.trim().replace(/\/+$/, '');
  text.textContent = 'Testing...';
  dot.className = 'ollama-status-dot';
  try {
    const resp = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
    if (models.length === 0) {
      dot.classList.add('disconnected');
      text.textContent = 'Connected but no models found. Run: ollama pull llama3.2';
    } else {
      dot.classList.add('connected');
      saveOllamaConfig({ url, model: models[0] });
      if (!localStorage.getItem('labcharts-ollama-model')) setOllamaMainModel(models[0]);
      text.textContent = `Connected (${getOllamaMainModel()})`;
      if (modelSection && modelSelect) {
        const currentModel = getOllamaMainModel();
        modelSection.style.display = 'block';
        modelSelect.innerHTML = models.map(m => `<option value="${escapeHTML(m)}" ${m === currentModel ? 'selected' : ''}>${escapeHTML(m)}</option>`).join('');
      }
    }
    // Also refresh privacy section status
    initSettingsOllamaCheck();
    updatePrivacyStatusCard();
  } catch {
    dot.classList.add('disconnected');
    text.textContent = 'Not connected — check URL and ensure Ollama is running';
  }
}

async function testPIIOllamaConnection() {
  const urlInput = document.getElementById('pii-ollama-url-input');
  const dot = document.getElementById('pii-ollama-dot');
  const text = document.getElementById('pii-ollama-status-text');
  const piiDropdown = document.getElementById('pii-model-dropdown');
  const piiSelect = document.getElementById('pii-model-select');
  if (!urlInput || !text) return;
  const url = urlInput.value.trim().replace(/\/+$/, '');
  text.textContent = 'Testing...';
  dot.className = 'ollama-status-dot';
  try {
    const resp = await fetch(`${url}/api/tags`, { signal: AbortSignal.timeout(5000) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
    if (models.length === 0) {
      dot.classList.add('disconnected');
      text.textContent = 'Connected but no models found';
    } else {
      dot.classList.add('connected');
      setOllamaPIIUrl(url);
      let currentPII = getOllamaPIIModel();
      if (!models.includes(currentPII)) { currentPII = models[0]; setOllamaPIIModel(currentPII); }
      text.textContent = `Connected — using ${currentPII}`;
      if (piiDropdown && piiSelect) {
        piiDropdown.style.display = 'block';
        piiSelect.innerHTML = models.map(m => `<option value="${escapeHTML(m)}" ${m === currentPII ? 'selected' : ''}>${escapeHTML(m)}</option>`).join('');
      }
    }
    updatePrivacyStatusCard();
  } catch {
    dot.classList.add('disconnected');
    text.textContent = 'Not connected — check URL and ensure Ollama is running';
    updatePrivacyStatusCard();
  }
}

function updateAnthropicModelPricing(modelId) {
  const el = document.getElementById('anthropic-model-pricing');
  if (el) el.innerHTML = renderModelPricingHint('anthropic', modelId || getAnthropicModel());
}
function updateVeniceModelPricing(modelId) {
  const el = document.getElementById('venice-model-pricing');
  if (el) el.innerHTML = renderModelPricingHint('venice', modelId || getVeniceModel());
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
    status.innerHTML = '<span style="color:var(--green)">Connected — loading models…</span>';
    const models = await fetchAnthropicModels(key);
    if (models.length) {
      renderAnthropicModelDropdown(models);
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    } else {
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    }
    showNotification('API key saved', 'success');
  } else {
    status.innerHTML = `<span style="color:var(--red)">${result.error}</span>`;
  }
  btn.disabled = false; btn.textContent = 'Save & Validate';
}

function handleRemoveApiKey() {
  localStorage.removeItem('labcharts-api-key');
  localStorage.removeItem('labcharts-anthropic-models');
  localStorage.removeItem('labcharts-anthropic-model');
  showNotification('API key removed', 'info');
  openSettingsModal();
}

function renderAnthropicModelDropdown(models) {
  const area = document.getElementById('anthropic-model-area');
  if (!area || !models.length) return;
  const currentModel = getAnthropicModel();
  const opts = models.map(function(m) {
    const label = m.display_name || m.id;
    return '<option value="' + m.id + '"' + (currentModel === m.id ? ' selected' : '') + '>' + label + '</option>';
  }).join('');
  area.innerHTML = '<label style="font-size:12px;color:var(--text-muted)">Model</label>' +
    '<select class="api-key-input" id="anthropic-model-select" style="margin-top:4px" onchange="setAnthropicModel(this.value);updateAnthropicModelPricing(this.value)">' + opts + '</select>' +
    '<div id="anthropic-model-pricing" style="margin-top:4px">' + renderModelPricingHint('anthropic', currentModel) + '</div>';
}

async function handleSaveVeniceKey() {
  const input = document.getElementById('venice-key-input');
  const btn = document.getElementById('save-venice-key-btn');
  const status = document.getElementById('venice-key-status');
  const key = input.value.trim();
  if (!key) { status.innerHTML = '<span style="color:var(--red)">Please enter an API key</span>'; return; }
  btn.disabled = true; btn.textContent = 'Validating...';
  const result = await validateVeniceKey(key);
  if (result.valid) {
    saveVeniceKey(key);
    status.innerHTML = '<span style="color:var(--green)">Connected — loading models…</span>';
    const models = await fetchVeniceModels(key);
    if (models.length) {
      renderVeniceModelDropdown(models);
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    } else {
      status.innerHTML = '<span style="color:var(--green)">&#10003; Connected</span>';
    }
    showNotification('Venice API key saved', 'success');
  } else {
    status.innerHTML = `<span style="color:var(--red)">${result.error}</span>`;
  }
  btn.disabled = false; btn.textContent = 'Save & Validate';
}

function handleRemoveVeniceKey() {
  localStorage.removeItem('labcharts-venice-key');
  localStorage.removeItem('labcharts-venice-models');
  localStorage.removeItem('labcharts-venice-model');
  showNotification('Venice API key removed', 'info');
  openSettingsModal();
}

function renderVeniceModelDropdown(models) {
  const area = document.getElementById('venice-model-area');
  if (!area || !models.length) return;
  const currentModel = getVeniceModel();
  const opts = models.map(function(m) {
    const label = m.name || m.id;
    return '<option value="' + m.id + '"' + (currentModel === m.id ? ' selected' : '') + '>' + escapeHTML(label) + '</option>';
  }).join('');
  area.innerHTML = '<label style="font-size:12px;color:var(--text-muted)">Model</label>' +
    '<select class="api-key-input" id="venice-model-select" style="margin-top:4px" onchange="setVeniceModel(this.value);updateVeniceModelPricing(this.value)">' + opts + '</select>' +
    '<div id="venice-model-pricing" style="margin-top:4px">' + renderModelPricingHint('venice', currentModel) + '</div>';
}

// ═══════════════════════════════════════════════
// PROFILE MANAGEMENT
// ═══════════════════════════════════════════════
function getProfiles() {
  try { return JSON.parse(localStorage.getItem('labcharts-profiles')) || []; }
  catch(e) { return []; }
}

function saveProfiles(profiles) {
  try {
    localStorage.setItem('labcharts-profiles', JSON.stringify(profiles));
  } catch (e) {
    showNotification('Storage limit reached — could not save profile changes.', 'error');
  }
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
  // Migrate sleepCircadian → sleepRest (sleep fields go to sleepRest, circadian items to lightCircadian)
  if (data.sleepCircadian && !data.sleepRest) {
    const sc = data.sleepCircadian;
    if (typeof sc === 'string') {
      data.sleepRest = sc.trim() ? { duration: null, quality: null, schedule: null, issues: [], note: sc.trim() } : null;
    } else if (typeof sc === 'object') {
      const sleepIssues = (sc.issues || []).filter(i => !['blue light blockers', 'morning sunlight'].includes(i));
      const circadianPractices = (sc.issues || []).filter(i => ['blue light blockers', 'morning sunlight'].includes(i));
      data.sleepRest = { duration: sc.duration || null, quality: sc.quality || null, schedule: sc.schedule || null, issues: sleepIssues, note: sc.note || '' };
      if (circadianPractices.length && !data.lightCircadian) {
        data.lightCircadian = { practices: circadianPractices, timing: null, mealTiming: [], note: '' };
      }
    }
  }
  delete data.sleepCircadian;
  // Merge old circadian + sleep strings → sleepRest (very old legacy)
  if (!data.sleepRest) {
    const parts = [data.circadian, data.sleep].filter(s => s && s.trim());
    if (parts.length) data.sleepRest = { duration: null, quality: null, schedule: null, issues: [], note: parts.join('\n\n') };
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
  // Migrate string fields → structured objects
  if (typeof data.diagnoses === 'string') {
    data.diagnoses = data.diagnoses.trim() ? { conditions: [], note: data.diagnoses.trim() } : null;
  }
  if (typeof data.diet === 'string') {
    data.diet = data.diet.trim() ? { type: null, restrictions: [], pattern: null, note: data.diet.trim() } : null;
  }
  if (typeof data.exercise === 'string') {
    data.exercise = data.exercise.trim() ? { frequency: null, types: [], intensity: null, dailyMovement: null, note: data.exercise.trim() } : null;
  }
  if (typeof data.sleepRest === 'string') {
    data.sleepRest = data.sleepRest.trim() ? { duration: null, quality: null, schedule: null, issues: [], note: data.sleepRest.trim() } : null;
  }
  // Migrate old lightCircadian format (had practices/timing) → new format (amLight/daytime/uvExposure/evening/cold/grounding/latitude)
  if (data.lightCircadian && data.lightCircadian.timing && !data.lightCircadian.amLight) {
    const old = data.lightCircadian;
    const newLc = { amLight: null, daytime: null, uvExposure: null, evening: [], cold: null, grounding: null, latitude: null, mealTiming: old.mealTiming || [], note: old.note || '' };
    if (old.practices && old.practices.length) {
      for (const p of old.practices) {
        if (p === 'morning sunlight') newLc.amLight = 'morning outdoor (after sunrise)';
        else if (p === 'blue light blockers') newLc.evening.push('blue blockers after sunset');
        else if (p === 'no screens before bed') newLc.evening.push('no screens 1-2h before bed');
        else if (p === 'red light therapy') { if (!newLc.note) newLc.note = p; else newLc.note += ', ' + p; }
        else if (p === 'UVB exposure') newLc.uvExposure = 'UVB lamp';
        else if (p === 'light therapy lamp') { if (!newLc.amLight) newLc.amLight = 'light therapy lamp'; }
        else if (p === 'blackout curtains') { /* moved to sleep environment */ }
      }
    }
    data.lightCircadian = newLc;
  }
  // Initialize new fields if missing
  if (data.healthGoals === undefined) data.healthGoals = [];
  if (data.sleepRest === undefined) data.sleepRest = null;
  if (data.lightCircadian === undefined) data.lightCircadian = null;
  if (data.stress === undefined) data.stress = null;
  if (data.loveLife === undefined) data.loveLife = null;
  if (data.environment === undefined) data.environment = null;
  if (data.interpretiveLens === undefined) data.interpretiveLens = '';
  if (data.contextNotes === undefined) data.contextNotes = '';
  if (data.customMarkers === undefined) data.customMarkers = {};
  if (data.menstrualCycle === undefined) data.menstrualCycle = null;
  return data;
}

function loadProfile(profileId) {
  currentProfile = profileId;
  setActiveProfileId(profileId);
  const savedImported = localStorage.getItem(profileStorageKey(profileId, 'imported'));
  const defaultData = { entries: [], notes: [], supplements: [], healthGoals: [], diagnoses: null, diet: null, exercise: null, sleepRest: null, lightCircadian: null, stress: null, loveLife: null, environment: null, interpretiveLens: '', contextNotes: '', menstrualCycle: null, customMarkers: {} };
  importedData = savedImported ? (function() { try { const d = JSON.parse(savedImported); if (!d.notes) d.notes = []; if (!d.supplements) d.supplements = []; return migrateProfileData(d); } catch(e) { return defaultData; } })() : defaultData;
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
  markerRegistry = {};
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
    localStorage.removeItem(profileStorageKey(profileId, 'rangeMode'));
    localStorage.removeItem(`labcharts-${profileId}-chat`);
    localStorage.removeItem(`labcharts-${profileId}-chatPersonality`);
    localStorage.removeItem(`labcharts-${profileId}-chatPersonalityCustom`);
    localStorage.removeItem(`labcharts-${profileId}-focusCard`);
    localStorage.removeItem(`labcharts-${profileId}-contextHealth`);
    localStorage.removeItem(`labcharts-${profileId}-onboarded`);
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

function getProfileLocation(profileId) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === (profileId || currentProfile));
  return (p && p.location) || { country: '', zip: '' };
}

function setProfileLocation(profileId, country, zip) {
  const profiles = getProfiles();
  const p = profiles.find(p => p.id === (profileId || currentProfile));
  if (p) { p.location = { country: (country || '').trim(), zip: (zip || '').trim() }; saveProfiles(profiles); }
}

const COUNTRY_LATITUDES = {
  // Tropical (<25°)
  'singapore':0,'malaysia':0,'indonesia':0,'thailand':0,'philippines':0,'colombia':0,'ecuador':0,'peru':0,'venezuela':0,'kenya':0,'nigeria':0,'ghana':0,'cameroon':0,'tanzania':0,'uganda':0,'costa rica':0,'panama':0,'cuba':0,'dominican republic':0,'jamaica':0,'puerto rico':0,'hawaii':0,'india':0,'vietnam':0,'myanmar':0,'cambodia':0,'sri lanka':0,'bangladesh':0,'brazil':0,
  // Subtropical (25-40°)
  'mexico':1,'egypt':1,'morocco':1,'tunisia':1,'israel':1,'jordan':1,'saudi arabia':1,'uae':1,'iran':1,'pakistan':1,'nepal':1,'japan':1,'south korea':1,'taiwan':1,'china':1,'australia':1,'new zealand':1,'south africa':1,'argentina':1,'chile':1,'greece':1,'turkey':1,'spain':1,'españa':1,'espana':1,'portugal':1,'cyprus':1,'malta':1,
  // Temperate (40-50°)
  'france':2,'austria':2,'switzerland':2,'hungary':2,'slovenia':2,'slovakia':2,'slovensko':2,'usa':2,'us':2,'united states':2,'america':2,'canada':2,'ca':2,'italy':2,'italia':2,'croatia':2,'serbia':2,'bulgaria':2,'romania':2,'bosnia':2,'bosnia and herzegovina':2,'montenegro':2,'north macedonia':2,'albania':2,'moldova':2,'georgia':2,
  // Northern (50-60°)
  'uk':3,'united kingdom':3,'ireland':3,'germany':3,'deutschland':3,'netherlands':3,'belgium':3,'luxembourg':3,'poland':3,'czech republic':3,'czechia':3,'česko':3,'denmark':3,'lithuania':3,'latvia':3,'estonia':3,'belarus':3,'ukraine':3,'russia':3,'россия':3,'rossiya':3,
  // Subarctic (>60°)
  'sweden':4,'sverige':4,'norway':4,'norge':4,'finland':4,'suomi':4,'iceland':4,'alaska':4,'greenland':4
};
const LATITUDE_BANDS = ['<25° latitude (tropical)', '25-40° (subtropical)', '40-50° (temperate)', '50-60° (northern)', '>60° (subarctic)'];

// AI-powered latitude detection with hardcoded fallback
function getLocationCache() { try { return JSON.parse(localStorage.getItem('labcharts-location-cache') || '{}'); } catch(e) { return {}; } }
function setLocationCache(key, lat) { var c = getLocationCache(); c[key] = lat; try { localStorage.setItem('labcharts-location-cache', JSON.stringify(c)); } catch(e) {} }
function latitudeToBand(lat) { var a = Math.abs(lat); if (a < 25) return 0; if (a < 40) return 1; if (a < 50) return 2; if (a < 60) return 3; return 4; }

var _locationDebounceTimer = null;
function updateLocationLat() {
  const country = (document.getElementById('loc-country') || {}).value || '';
  const zip = (document.getElementById('loc-zip') || {}).value || '';
  setProfileLocation(currentProfile, country, zip);
  const el = document.getElementById('loc-lat-display');
  if (!el) return;
  const ct = country.trim(), zt = zip.trim();
  if (!ct) { el.textContent = ''; return; }

  // Check AI cache first (most accurate)
  var cacheKey = (ct + '|' + zt).toLowerCase();
  var cached = getLocationCache()[cacheKey];
  if (cached !== undefined) {
    var band = latitudeToBand(cached);
    el.style.color = 'var(--green)';
    el.textContent = '\u2713 ' + Math.abs(Math.round(cached)) + '\u00b0' + (cached >= 0 ? 'N' : 'S') + ' \u2014 ' + LATITUDE_BANDS[band];
    return;
  }

  // Hardcoded fallback (instant)
  var lat = getLatitudeFromLocation();
  if (lat) {
    el.style.color = 'var(--green)';
    el.textContent = '\u2713 ' + lat;
  } else if (hasAIProvider()) {
    el.style.color = 'var(--text-muted)';
    el.textContent = 'Detecting\u2026';
  } else {
    el.style.color = 'var(--text-muted)';
    el.textContent = 'Country not recognized \u2014 try the full name';
  }

  // Debounced AI refinement
  if (_locationDebounceTimer) clearTimeout(_locationDebounceTimer);
  if (hasAIProvider()) {
    _locationDebounceTimer = setTimeout(function() { detectLatitudeWithAI(ct, zt); }, 1500);
  }
}

async function detectLatitudeWithAI(country, zip) {
  var cacheKey = (country + '|' + zip).toLowerCase();
  if (getLocationCache()[cacheKey] !== undefined) return;
  try {
    var locationStr = zip ? country + ' ' + zip : country;
    var { text: response } = await callClaudeAPI({
      system: 'You are a geography assistant. Reply with ONLY a number \u2014 the approximate latitude in decimal degrees (positive for North, negative for South). No text, no degree symbol, just the number.',
      messages: [{ role: 'user', content: 'Latitude of: ' + locationStr }],
      maxTokens: 10
    });
    var lat = parseFloat((response || '').trim());
    if (!isNaN(lat) && lat >= -90 && lat <= 90) {
      setLocationCache(cacheKey, lat);
      var el = document.getElementById('loc-lat-display');
      if (el) {
        var band = latitudeToBand(lat);
        el.style.color = 'var(--green)';
        el.textContent = '\u2713 ' + Math.abs(Math.round(lat)) + '\u00b0' + (lat >= 0 ? 'N' : 'S') + ' \u2014 ' + LATITUDE_BANDS[band];
      }
    }
  } catch(e) {
    if (isDebugMode()) console.warn('[Location] AI detection failed:', e);
  }
}

function getLatitudeFromLocation() {
  const loc = getProfileLocation();
  if (!loc.country) return null;
  const c = loc.country.toLowerCase().trim();
  const zip = (loc.zip || '').trim();

  // AI cache (most accurate — covers any country/ZIP worldwide)
  var cacheKey = (c + '|' + zip).toLowerCase();
  var aiCached = getLocationCache()[cacheKey];
  if (aiCached !== undefined) return LATITUDE_BANDS[latitudeToBand(aiCached)];

  var zn = zip.replace(/\s/g, '');
  // ZIP refinement for USA (first digit = region, special prefixes for HI/AK/PR)
  if (zn && (c === 'usa' || c === 'us' || c === 'united states' || c === 'america')) {
    var p3 = zn.substring(0, 3);
    if (p3 >= '006' && p3 <= '009') return LATITUDE_BANDS[0]; // PR/VI → tropical
    if (p3 >= '967' && p3 <= '968') return LATITUDE_BANDS[0]; // Hawaii → tropical
    if (p3 >= '995') return LATITUDE_BANDS[4]; // Alaska → subarctic
    var d = zn.charAt(0);
    var usb = { '0':2, '1':2, '2':2, '3':1, '4':2, '5':2, '6':2, '7':1, '8':2, '9':2 };
    if (usb[d] !== undefined) return LATITUDE_BANDS[usb[d]];
  }

  // ZIP refinement for Canada (first letter = province/territory)
  if (zn && (c === 'canada' || c === 'ca')) {
    var letter = zn.charAt(0).toUpperCase();
    var cab = { 'A':3,'B':2,'C':2,'E':2, 'G':2,'H':2,'J':2,'K':2,'L':2,'M':2,'N':2, 'P':3,'R':3,'S':3,'T':3, 'V':2, 'X':4,'Y':4 };
    if (cab[letter] !== undefined) return LATITUDE_BANDS[cab[letter]];
  }

  // ZIP refinement for European countries
  var zd = zn.charAt(0);
  // Norway (4-digit): 0-5 southern ~58-60°N → northern, 6-9 central/north ~62-71°N → subarctic
  if (zn && (c === 'norway' || c === 'norge')) {
    if (zd >= '0' && zd <= '5') return LATITUDE_BANDS[3];
    return LATITUDE_BANDS[4];
  }
  // Sweden (5-digit): 1-6 southern/central ~55-60°N → northern, 7-9 north ~62-69°N → subarctic
  if (zn && (c === 'sweden' || c === 'sverige')) {
    if (zd >= '1' && zd <= '6') return LATITUDE_BANDS[3];
    if (zd >= '7') return LATITUDE_BANDS[4];
  }
  // Finland (5-digit): 00-39 southern ~60°N → northern, 40-99 central/north ~62-70°N → subarctic
  if (zn && (c === 'finland' || c === 'suomi')) {
    var f2 = parseInt(zn.substring(0, 2));
    if (!isNaN(f2)) return LATITUDE_BANDS[f2 < 40 ? 3 : 4];
  }
  // Germany (5-digit): 0-6 northern/central ~50-54°N → northern, 7-9 southern ~48-50°N → temperate
  if (zn && (c === 'germany' || c === 'deutschland')) {
    if (zd >= '7') return LATITUDE_BANDS[2];
    return LATITUDE_BANDS[3];
  }
  // Italy (5-digit): 00-79 central/north ~41-47°N → temperate, 80-98 south/islands ~36-41°N → subtropical
  if (zn && (c === 'italy' || c === 'italia')) {
    var i2 = parseInt(zn.substring(0, 2));
    if (!isNaN(i2)) return LATITUDE_BANDS[i2 >= 80 ? 1 : 2];
  }
  // Spain (5-digit): northern provinces ~43°N → temperate, rest → subtropical
  if (zn && (c === 'spain' || c === 'españa' || c === 'espana')) {
    var s2 = parseInt(zn.substring(0, 2));
    if (!isNaN(s2) && (s2 >= 15 && s2 <= 16 || s2 >= 20 && s2 <= 24 || s2 >= 26 && s2 <= 28 || s2 >= 31 && s2 <= 34 || s2 >= 39 && s2 <= 50)) return LATITUDE_BANDS[2];
    return LATITUDE_BANDS[1];
  }
  // France (5-digit): mostly temperate, northern departments ~50°N → borderline northern
  if (zn && (c === 'france')) {
    var fr2 = parseInt(zn.substring(0, 2));
    if (!isNaN(fr2) && (fr2 >= 59 && fr2 <= 62 || fr2 === 80 || fr2 === 2)) return LATITUDE_BANDS[3];
    return LATITUDE_BANDS[2];
  }
  // Russia (6-digit): default northern, 350-385 south → temperate, 163/183-184 Murmansk → subarctic
  if (zn && (c === 'russia' || c === 'россия' || c === 'rossiya')) {
    var r3 = parseInt(zn.substring(0, 3));
    if (!isNaN(r3)) {
      if (r3 >= 350 && r3 <= 385) return LATITUDE_BANDS[2];
      if (r3 >= 163 && r3 <= 164 || r3 >= 183 && r3 <= 184) return LATITUDE_BANDS[4];
    }
    return LATITUDE_BANDS[3];
  }

  // Country-level lookup
  const band = COUNTRY_LATITUDES[c];
  if (band !== undefined) return LATITUDE_BANDS[band];
  for (const [key, val] of Object.entries(COUNTRY_LATITUDES)) {
    if (c.includes(key) || key.includes(c)) return LATITUDE_BANDS[val];
  }
  return null;
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
      // Find the latest entry that has any marker in this category
      let singleDate = null;
      for (let ei = entries.length - 1; ei >= 0; ei--) {
        for (const key of Object.keys(entries[ei].markers)) {
          if (key.startsWith(catKey + '.')) { singleDate = entries[ei].date; break; }
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
    const withData = markers.filter(m => m.values && m.values.some(v => v !== null)).length;
    if (withData === 0) continue;
    const flagged = countFlagged(markers);
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

  // ── 3. Interpretive Lens ──
  html += renderInterpretiveLensSection();

  // ── 3b. Focus Card ──
  if (hasAIProvider()) html += renderFocusCard();

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
    <p>Auto-selected from your data</p></div>
    ${renderDateRangeFilter()}
    ${renderChartLayersDropdown()}
  </div>`;

  const keyMarkers = getKeyTrendMarkers(filteredData);
  if (keyMarkers.length > 0) {
    html += `<div class="charts-grid charts-grid-4col">`;
    for (const km of keyMarkers) {
      const marker = filteredData.categories[km.cat].markers[km.key];
      html += renderChartCard(km.cat + "_" + km.key, marker, filteredData.dateLabels);
    }
    html += `</div>`;
  }

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

  // Non-blocking: load focus card and health dots after DOM is ready
  if (hasData && hasAIProvider()) loadFocusCard();
  loadContextHealthDots();
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
    const apiCall = callClaudeAPI({
      system: 'You are a blood work analyst. Respond with exactly ONE sentence, max 40 words. Name the single most important marker finding, its direction (rising/falling/high/low), and briefly why it matters clinically. No preamble, no disclaimer.',
      messages: [{ role: 'user', content: ctx }],
      maxTokens: 100
    });
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000));
    const result = await Promise.race([apiCall, timeout]);
    const text = (result && typeof result === 'object') ? result.text : (result || '');
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

// ── Context card summary generators ──
function getConditionsSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.conditions && d.conditions.length) parts.push(d.conditions.map(c => {
    let s = c.name;
    if (c.severity && c.severity !== 'mild') s += ` (${c.severity})`;
    if (c.since) s += ` since ${c.since}`;
    return s;
  }).join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(' — ');
}
function getDietSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.type) parts.push(d.type);
  if (d.pattern) parts.push(d.pattern);
  if (d.restrictions && d.restrictions.length) parts.push(d.restrictions.join(', '));
  if (d.breakfast) parts.push('B: ' + d.breakfast);
  if (d.lunch) parts.push('L: ' + d.lunch);
  if (d.dinner) parts.push('D: ' + d.dinner);
  if (d.snacks) parts.push('S: ' + d.snacks);
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}
function getExerciseSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.frequency) parts.push(d.frequency);
  if (d.types && d.types.length) parts.push(d.types.join(', '));
  if (d.intensity) parts.push(d.intensity);
  if (d.dailyMovement) parts.push(d.dailyMovement);
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}
function getSleepSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.duration) parts.push(d.duration);
  if (d.quality) parts.push(d.quality + ' quality');
  if (d.schedule) parts.push(d.schedule);
  if (d.roomTemp) parts.push(d.roomTemp);
  if (d.issues && d.issues.length) parts.push(d.issues.join(', '));
  if (d.environment && d.environment.length) parts.push(d.environment.join(', '));
  if (d.practices && d.practices.length) parts.push(d.practices.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}
function getLightCircadianSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.amLight) parts.push(d.amLight);
  if (d.daytime) parts.push(d.daytime);
  if (d.uvExposure) parts.push(d.uvExposure);
  if (d.evening && d.evening.length) parts.push(d.evening.join(', '));
  if (d.screenTime) parts.push(d.screenTime + ' screens');
  if (d.techEnv && d.techEnv.length) parts.push(d.techEnv.join(', '));
  if (d.cold) parts.push(d.cold);
  if (d.grounding) parts.push(d.grounding);
  if (d.mealTiming && d.mealTiming.length) parts.push(d.mealTiming.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}
function getStressSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.level) parts.push(d.level + ' stress');
  if (d.sources && d.sources.length) parts.push(d.sources.join(', '));
  if (d.management && d.management.length) parts.push('manages: ' + d.management.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(' — ');
}
function getLoveLifeSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.status) parts.push(d.status);
  if (d.relationship) parts.push(d.relationship);
  if (d.satisfaction) parts.push(d.satisfaction);
  if (d.libido) parts.push(d.libido + ' libido');
  if (d.frequency) parts.push(d.frequency);
  if (d.orgasm) parts.push('orgasm: ' + d.orgasm);
  if (d.concerns && d.concerns.length) parts.push(d.concerns.join(', '));
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}
function getEnvironmentSummary(d) {
  if (!d) return '';
  const parts = [];
  if (d.setting) parts.push(d.setting);
  if (d.climate) parts.push(d.climate);
  if (d.water) parts.push(d.water);
  if (d.waterConcerns && d.waterConcerns.length) parts.push(d.waterConcerns.join(', '));
  if (d.emf && d.emf.length) parts.push(d.emf.length + ' EMF source' + (d.emf.length > 1 ? 's' : ''));
  if (d.emfMitigation && d.emfMitigation.length) parts.push(d.emfMitigation.length + ' EMF mitigation');
  if (d.homeLight) parts.push(d.homeLight);
  if (d.air && d.air.length) parts.push(d.air.join(', '));
  if (d.toxins && d.toxins.length) parts.push(d.toxins.length + ' toxin exposure' + (d.toxins.length > 1 ? 's' : ''));
  if (d.building) parts.push(d.building);
  if (d.note) parts.push(d.note);
  return parts.join(', ');
}
function getGoalsSummary() {
  const healthGoals = importedData.healthGoals || [];
  if (healthGoals.length === 0) return '';
  const texts = healthGoals.slice(0, 3).map(g => g.text);
  const summary = texts.join(', ');
  if (healthGoals.length > 3) return summary + ` +${healthGoals.length - 3} more`;
  return summary;
}
function isContextFilled(key) {
  if (key === 'healthGoals') return (importedData.healthGoals || []).length > 0;
  return importedData[key] != null;
}

function renderProfileContextCards() {
  const cardDefs = [
    { key: 'healthGoals', emoji: '\uD83C\uDFAF', label: 'Health Goals', editor: 'openHealthGoalsEditor', tooltip: 'Define what you\'re trying to solve or improve. AI prioritizes analysis around your stated goals.', placeholder: 'Add health goals', summaryFn: getGoalsSummary },
    { key: 'diagnoses', emoji: '\uD83C\uDFE5', label: 'Medical Conditions', editor: 'openDiagnosesEditor', tooltip: 'Diagnoses directly affect how lab markers should be interpreted — what\'s abnormal for most may be expected for you.', placeholder: 'Add medical conditions', summaryFn: () => getConditionsSummary(importedData.diagnoses) },
    { key: 'diet', emoji: '\uD83E\uDD57', label: 'Diet', editor: 'openDietEditor', tooltip: 'Nutrition has a major impact on blood markers — keto raises LDL, vegetarian diets affect B12 and iron.', placeholder: 'Describe your diet', summaryFn: () => getDietSummary(importedData.diet) },
    { key: 'exercise', emoji: '\uD83C\uDFCB\uFE0F', label: 'Exercise', editor: 'openExerciseEditor', tooltip: 'Training type and intensity affect CK, liver enzymes, cholesterol, and inflammatory markers.', placeholder: 'Describe your routine', summaryFn: () => getExerciseSummary(importedData.exercise) },
    { key: 'sleepRest', emoji: '\uD83D\uDE34', label: 'Sleep & Rest', editor: 'openSleepRestEditor', tooltip: 'Sleep duration and quality directly affect inflammation, insulin sensitivity, cortisol, and immune function.', placeholder: 'Describe your sleep', summaryFn: () => getSleepSummary(importedData.sleepRest) },
    { key: 'lightCircadian', emoji: '\u2600\uFE0F', label: 'Light & Circadian', editor: 'openLightCircadianEditor', tooltip: 'Light, cold, grounding, screen time, and meal timing drive circadian rhythm, hormones, melatonin, cortisol, and metabolic health.', placeholder: 'Describe your light habits', summaryFn: () => getLightCircadianSummary(importedData.lightCircadian) },
    { key: 'stress', emoji: '\uD83E\uDDE0', label: 'Stress', editor: 'openStressEditor', tooltip: 'Chronic stress elevates cortisol, disrupts thyroid function, raises inflammation, and impairs immune response.', placeholder: 'Rate your stress level', summaryFn: () => getStressSummary(importedData.stress) },
    { key: 'loveLife', emoji: '\u2764\uFE0F', label: 'Love Life & Relationships', editor: 'openLoveLifeEditor', tooltip: 'Sexual health and relationships directly affect hormones (testosterone, estrogen, oxytocin, cortisol), immune function, and cardiovascular markers.', placeholder: 'Share your status', summaryFn: () => getLoveLifeSummary(importedData.loveLife) },
    { key: 'environment', emoji: '\uD83C\uDF0D', label: 'Environment', editor: 'openEnvironmentEditor', tooltip: 'Water quality, EMF exposure, air quality, toxins, and building materials shape mitochondrial function, inflammation, hormones, and oxidative stress.', placeholder: 'Describe your environment', summaryFn: () => getEnvironmentSummary(importedData.environment) },
  ];
  const filledCount = cardDefs.filter(c => isContextFilled(c.key)).length;
  let html = `<div style="margin-top:16px"><span class="context-section-title">What your GP won't ask you (${filledCount}/${cardDefs.length} filled)</span></div>`;
  html += `<div class="profile-context-cards">`;
  for (const c of cardDefs) {
    const filled = isContextFilled(c.key);
    const summary = c.summaryFn();
    html += `<div class="context-card" onclick="${c.editor}()">
      <div class="context-card-header">
        <span class="ctx-health-dot ctx-health-dot-gray" id="ctx-dot-${c.key}"></span>
        <span class="context-card-label">${c.emoji} ${c.label}</span>
        <span class="context-info-icon">i<span class="context-tooltip">${c.tooltip}</span></span>
        <button class="diagnoses-edit-btn" onclick="event.stopPropagation();${c.editor}()">${filled ? 'Edit' : '+ Add'}</button>
      </div>
      ${summary
        ? `<div class="context-card-body">${escapeHTML(summary)}</div>`
        : `<div class="context-card-placeholder">${c.placeholder}</div>`}
      <div class="ctx-ai-summary" id="ctx-ai-${c.key}"></div>
    </div>`;
  }
  html += `</div>`;
  // Additional Notes textarea
  const notes = importedData.contextNotes || '';
  html += `<div class="ctx-notes-section">
    <textarea class="ctx-notes-textarea" id="ctx-notes-textarea" placeholder="Additional notes for AI context (anything else that might affect your labs...)" oninput="debounceContextNotes()">${escapeHTML(notes)}</textarea>
  </div>`;
  return html;
}

let _ctxNotesTimer = null;
function debounceContextNotes() {
  clearTimeout(_ctxNotesTimer);
  _ctxNotesTimer = setTimeout(() => {
    const ta = document.getElementById('ctx-notes-textarea');
    if (ta) {
      importedData.contextNotes = ta.value;
      saveImportedData();
    }
  }, 500);
}

// ── AI Health Status Dots ──
function applyDotColor(key, color) {
  const dot = document.getElementById('ctx-dot-' + key);
  if (!dot) return;
  dot.className = 'ctx-health-dot ctx-health-dot-' + color;
}

function applyAISummary(key, text, color) {
  const el = document.getElementById('ctx-ai-' + key);
  if (!el) return;
  el.classList.remove('ctx-ai-summary-green', 'ctx-ai-summary-yellow', 'ctx-ai-summary-red');
  if (text) {
    el.textContent = text;
    el.classList.add('ctx-ai-summary-visible');
    if (color && color !== 'gray') el.classList.add('ctx-ai-summary-' + color);
  } else {
    el.textContent = '';
    el.classList.remove('ctx-ai-summary-visible');
  }
}

function getCardFingerprint(key) {
  const labPart = JSON.stringify((importedData.entries || []).map(e => e.date + ':' + Object.keys(e.markers).length));
  const val = key === 'healthGoals' ? JSON.stringify(importedData.healthGoals || []) : JSON.stringify(importedData[key]);
  return hashString(labPart + '|' + val + '|' + (profileSex || '') + '|' + (profileDob || ''));
}

async function loadContextHealthDots() {
  if (!hasAIProvider()) return;
  const keys = ['healthGoals', 'diagnoses', 'diet', 'exercise', 'sleepRest', 'lightCircadian', 'stress', 'loveLife', 'environment'];
  const cacheKey = profileStorageKey(currentProfile, 'contextHealth');
  let cached;
  try { cached = JSON.parse(localStorage.getItem(cacheKey) || 'null'); } catch(e) { cached = null; }
  if (!cached || !cached.dots) cached = { dots: {}, fingerprints: {} };

  if (!cached.summaries) cached.summaries = {};

  // Determine which cards need re-fetching
  const staleKeys = [];
  for (const k of keys) {
    const fp = getCardFingerprint(k);
    if (cached.fingerprints && cached.fingerprints[k] === fp && cached.dots[k] && cached.summaries[k] !== undefined) {
      applyDotColor(k, cached.dots[k]);
      if (cached.summaries[k]) applyAISummary(k, cached.summaries[k], cached.dots[k]);
    } else {
      staleKeys.push(k);
    }
  }
  if (staleKeys.length === 0) return;

  // Show shimmer only on stale cards
  for (const k of staleKeys) {
    const dot = document.getElementById('ctx-dot-' + k);
    if (dot) dot.classList.add('ctx-health-dot-shimmer');
    const aiEl = document.getElementById('ctx-ai-' + k);
    if (aiEl) { aiEl.textContent = ''; aiEl.classList.remove('ctx-ai-summary-visible'); }
  }
  const ctx = buildLabContext();
  if (ctx === 'No lab data is currently loaded for this profile.') {
    for (const k of staleKeys) applyDotColor(k, 'gray');
    return;
  }
  const exampleObj = {};
  for (const k of staleKeys) exampleObj[k] = {"dot":"...","tip":"..."};
  const exampleJSON = JSON.stringify(exampleObj);
  const prompt = `Based on this person's lab data and profile context, assess each profile area. Return ONLY valid JSON with these keys, each having "dot" (green/yellow/red/gray) and "tip" (max 12 words — a brief, specific insight connecting this area to their actual lab markers):
${exampleJSON}

Dot colors: green = supports health, yellow = needs attention, red = concerning, gray = not enough info.
Tips should reference specific markers or trends when possible (e.g. "Low vitamin D may link to limited sun exposure" not "Consider improving this area"). If no data, use gray dot and empty tip.`;
  try {
    const result = await Promise.race([
      callClaudeAPI({ system: prompt, messages: [{ role: 'user', content: ctx }], maxTokens: 500 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 20000))
    ]);
    const text = (result && typeof result === 'object') ? (result.text || '') : (typeof result === 'string' ? result : '');
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (!cached.fingerprints) cached.fingerprints = {};
      for (const k of staleKeys) {
        const entry = parsed[k] || {};
        const color = (typeof entry === 'string')
          ? (['green', 'yellow', 'red', 'gray'].includes(entry) ? entry : 'gray')
          : (['green', 'yellow', 'red', 'gray'].includes(entry.dot) ? entry.dot : 'gray');
        const tip = (typeof entry === 'object' && entry.tip) ? entry.tip : '';
        applyDotColor(k, color);
        applyAISummary(k, tip, color);
        cached.dots[k] = color;
        cached.summaries[k] = tip;
        cached.fingerprints[k] = getCardFingerprint(k);
      }
      try { localStorage.setItem(cacheKey, JSON.stringify(cached)); } catch(e) {}
    }
  } catch(e) {
    for (const k of staleKeys) applyDotColor(k, 'gray');
  }
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
      <div class="chart-card-title">${escapeHTML(marker.name)}</div>
      <div class="chart-card-unit">${escapeHTML(marker.unit)}</div></div>
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
  html += `</div>${r.min != null && r.max != null ? `<div class="chart-ref-range">${rangeLabel}: ${formatValue(r.min)} \u2013 ${formatValue(r.max)} ${escapeHTML(marker.unit)}</div>` : ''}</div>`;
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
    html += `<tr><td class="marker-name">${escapeHTML(marker.name)}</td>
      <td class="unit-col">${escapeHTML(marker.unit)}</td>
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
    html += `<tr><td>${escapeHTML(marker.name)}</td>`;
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
    html += `<div class="fa-card"><div class="fa-card-name">${escapeHTML(marker.name)}</div>
      <div class="fa-card-value val-${s}">${formatValue(v)}${marker.unit ? " " + escapeHTML(marker.unit) : ""}</div>
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
  if (!hasAIProvider()) return null;
  try {
    const { text: resp } = await callClaudeAPI({
      system: 'You are a concise medical reference. Reply with exactly one sentence (max 30 words) explaining what this blood biomarker measures and why it matters clinically. No preamble.',
      messages: [{ role: 'user', content: `${markerName} (${unit})` }],
      maxTokens: 100
    });
    const text = (resp || '').trim();
    if (text) {
      cache[markerId] = text;
      localStorage.setItem(cacheKey, JSON.stringify(cache));
    }
    return text || null;
  } catch { return null; }
}

function showDetailModal(id) {
  let marker = markerRegistry[id];
  if (!marker) {
    const data = getActiveData();
    const [catKey, mKey] = id.split('_');
    marker = data.categories[catKey]?.markers[mKey];
    if (marker) markerRegistry[id] = marker;
  }
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
    <h3>${escapeHTML(marker.name)}</h3>
    <div class="modal-unit">${escapeHTML(marker.unit)}${rangeInfo}</div>
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
    } else if (!marker.desc && hasAIProvider()) {
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
  saveImportedData();
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
  saveImportedData();
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
  document.removeEventListener('click', closeSuggestionsOnClickOutside);
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
// TIME FORMAT
// ═══════════════════════════════════════════════
function getTimeFormat() { return localStorage.getItem('labcharts-time-format') || '24h'; }
function setTimeFormat(fmt) { localStorage.setItem('labcharts-time-format', fmt); }

function formatTime(time24) {
  if (!time24) return '';
  if (getTimeFormat() === '24h') return time24;
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

function parseTimeInput(val) {
  if (!val) return '';
  const v = val.trim().toUpperCase();
  // 24h format: "14:30" or "8:00"
  const m24 = v.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) {
    const h = parseInt(m24[1]), m = parseInt(m24[2]);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  // 12h format: "2:30 PM", "2:30PM", "2PM"
  const m12 = v.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (m12) {
    let h = parseInt(m12[1]);
    const m = parseInt(m12[2] || '0');
    const p = m12[3];
    if (p === 'AM' && h === 12) h = 0;
    else if (p === 'PM' && h !== 12) h += 12;
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  return '';
}

function getTimePlaceholder() {
  return getTimeFormat() === '24h' ? 'HH:MM' : 'H:MM AM';
}

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

function getKeyTrendMarkers(filteredData) {
  const selected = [];
  const seen = new Set();
  const MAX = 8;

  function hasData(cat, key) {
    const c = filteredData.categories[cat];
    if (!c || c.singlePoint) return false;
    const m = c.markers[key];
    return m && m.values && m.values.some(v => v !== null);
  }

  function add(cat, key) {
    if (selected.length >= MAX) return;
    const id = cat + '_' + key;
    if (seen.has(id)) return;
    if (!hasData(cat, key)) return;
    seen.add(id);
    selected.push({ cat, key });
  }

  // Tier 1: Trend alerts (sudden > past > approaching — already sorted)
  const alerts = detectTrendAlerts(filteredData);
  for (const a of alerts) {
    const dot = a.id.indexOf('_');
    add(a.id.substring(0, dot), a.id.substring(dot + 1));
  }

  // Tier 2: Flagged (out-of-range) markers
  const flags = getAllFlaggedMarkers(filteredData);
  for (const f of flags) {
    add(f.categoryKey, f.markerKey);
  }

  // Tier 3: Sex-aware defaults
  const defaults = profileSex === 'female'
    ? [['diabetes','hba1c'],['diabetes','homaIR'],['lipids','ldl'],['vitamins','vitaminD'],
       ['thyroid','tsh'],['hematology','ferritin'],['hormones','estradiol'],['proteins','hsCRP']]
    : profileSex === 'male'
    ? [['diabetes','hba1c'],['diabetes','homaIR'],['lipids','ldl'],['vitamins','vitaminD'],
       ['thyroid','tsh'],['hormones','testosterone'],['proteins','hsCRP'],['biochemistry','ggt']]
    : [['diabetes','hba1c'],['diabetes','homaIR'],['lipids','ldl'],['vitamins','vitaminD'],
       ['thyroid','tsh'],['proteins','hsCRP'],['biochemistry','ggt'],['hematology','hemoglobin']];
  for (const [cat, key] of defaults) add(cat, key);

  return selected;
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
// PII OBFUSCATION — Fake data generators & sanitization
// ═══════════════════════════════════════════════
function detectSexFromPDF(text) {
  // Check for sex/gender labels in Czech and English lab reports
  // Note: \b doesn't work with accented chars (í,ž), so use [\s:] boundary instead
  if (/(?:pohlav[ií]|sex|gender)[\s:]+(?:ž|žena|female|f)(?:\s|$)/im.test(text)) return 'female';
  if (/(?:pohlav[ií]|sex|gender)[\s:]+(?:m|muž|male)(?:\s|$)/im.test(text)) return 'male';
  // Czech birth numbers: month 51-62 = female (month + 50)
  const bn = text.match(/\b\d{2}(5[1-9]|6[0-2])\d{2}\/\d{3,4}\b/);
  if (bn) return 'female';
  return null;
}
function fakeName(sex) { return sex === 'female' ? 'Jana Nováková' : 'Jan Novák'; }
const FAKE_STREETS = [
  'Sokolská 17', 'Národní 8', 'Lidická 32', 'Husova 5', 'Květná 12',
  'Nádražní 44', 'Masarykova 19', 'Palackého 7', 'Riegrova 23', 'Zahradní 3'
];
const FAKE_CITIES = ['Brno', 'Olomouc', 'Plzeň', 'Ostrava', 'Liberec', 'České Budějovice', 'Hradec Králové', 'Pardubice'];
const FAKE_DOCTORS = [
  'MUDr. Dvořák', 'MUDr. Procházka', 'MUDr. Horáková', 'MUDr. Novák',
  'MUDr. Šimková', 'MUDr. Veselý', 'MUDr. Kopecký', 'MUDr. Marková'
];

function randomPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomDigits(n) { let s = ''; for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10); return s; }
function fakeBirthNumber() {
  const y = 50 + Math.floor(Math.random() * 50);
  const m = 1 + Math.floor(Math.random() * 12);
  const d = 1 + Math.floor(Math.random() * 28);
  return `${String(y).padStart(2,'0')}${String(m).padStart(2,'0')}${String(d).padStart(2,'0')}/${randomDigits(4)}`;
}
function fakePhone() { return `+420 7${randomDigits(2)} ${randomDigits(3)} ${randomDigits(3)}`; }
function fakeEmail() { return `user${randomDigits(4)}@mail.com`; }
function fakeDate() {
  const y = 1960 + Math.floor(Math.random() * 40);
  const m = 1 + Math.floor(Math.random() * 12);
  const d = 1 + Math.floor(Math.random() * 28);
  return `${String(d).padStart(2,'0')}.${String(m).padStart(2,'0')}.${y}`;
}
function fakePatientId() { return randomDigits(10); }

// ═══════════════════════════════════════════════
// OLLAMA INTEGRATION
// ═══════════════════════════════════════════════
function getOllamaConfig() {
  try { return JSON.parse(localStorage.getItem('labcharts-ollama')) || { url: 'http://localhost:11434', model: 'llama3.2' }; }
  catch { return { url: 'http://localhost:11434', model: 'llama3.2' }; }
}
function saveOllamaConfig(config) { localStorage.setItem('labcharts-ollama', JSON.stringify(config)); }

async function checkOllama(url) {
  const baseUrl = url || getOllamaConfig().url;
  try {
    const resp = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
    if (!resp.ok) return { available: false, models: [] };
    const data = await resp.json();
    const models = (data.models || []).map(m => m.name || m.model).filter(Boolean);
    return { available: true, models };
  } catch {
    return { available: false, models: [] };
  }
}

async function checkOllamaPII() {
  return checkOllama(getOllamaPIIUrl());
}

function unloadOllamaPIIModel() {
  const piiUrl = getOllamaPIIUrl();
  const piiModel = getOllamaPIIModel();
  fetch(`${piiUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: piiModel, prompt: '', stream: false, keep_alive: 0 }),
    signal: AbortSignal.timeout(5000)
  }).catch(() => {});
}

async function sanitizeWithOllama(pdfText) {
  const piiUrl = getOllamaPIIUrl();
  const piiModel = getOllamaPIIModel();
  const prompt = `TASK: Replace ONLY personal identifiers in this lab report. Output the FULL text with minimal changes.

REPLACE these with fake data:
- Patient names → fictional names
- Birth numbers (e.g. 850115/1234) → random numbers in same format
- Addresses → fictional addresses
- Phone numbers → random phone numbers
- Emails → fictional emails
- Doctor names → fictional doctor names
- Patient IDs → random numbers

DO NOT CHANGE (copy exactly as-is):
- ALL dates (collection dates, sample dates, report dates) — these are critical
- ALL "=== Page N ===" headers
- ALL lab test names, numeric values, units, reference ranges
- ALL line structure and formatting

Output ONLY the modified text. No explanations, no markdown, no commentary.

TEXT TO PROCESS:
${pdfText}`;
  try {
    const resp = await fetch(`${piiUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: piiModel, prompt, stream: false, keep_alive: 0 }),
      signal: AbortSignal.timeout(90000)
    });
    if (!resp.ok) throw new Error(`Ollama error: ${resp.status}`);
    const data = await resp.json();
    const result = (data.response || '').trim();

    // Validate output — if Ollama mangled the text, reject it
    if (!result) throw new Error('Ollama returned empty response');
    // Output should be at least 25% of input length (LLM shouldn't be summarizing)
    if (result.length < pdfText.length * 0.25) throw new Error(`Ollama output too short (${result.length} vs ${pdfText.length} chars)`);
    // Check that date-like patterns survived (YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY)
    const inputDates = pdfText.match(/\b\d{4}[-/.]\d{2}[-/.]\d{2}\b|\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/g) || [];
    const outputDates = result.match(/\b\d{4}[-/.]\d{2}[-/.]\d{2}\b|\b\d{1,2}[./]\d{1,2}[./]\d{4}\b/g) || [];
    if (inputDates.length > 0 && outputDates.length === 0) throw new Error('Ollama lost all dates from the text');

    unloadOllamaPIIModel();
    return result;
  } catch (e) {
    unloadOllamaPIIModel();
    if (e.name === 'TimeoutError' || e.message.includes('timed out')) {
      showNotification(`PII model "${piiModel}" timed out. Falling back to regex. Try a smaller model in Settings → Privacy.`, 'info', 6000);
    }
    throw e;
  }
}

// ═══════════════════════════════════════════════
// REGEX PII OBFUSCATION (fallback when no Ollama)
// ═══════════════════════════════════════════════
function obfuscatePDFText(pdfText) {
  let text = pdfText;
  let replacements = 0;
  const original = pdfText;
  const pdfSex = detectSexFromPDF(pdfText) || profileSex;

  // Unit keywords that indicate a result line — never strip digits from these
  const unitKeywords = /\b(mmol|µmol|µkat|umol|ukat|g\/l|mg\/l|ng\/l|µg|ug|mU\/l|pmol|nmol|ml\/s|fL|pg|×10|10\^|u\/l|iu\/l|%|sec|s\/1)\b/i;
  // Collection date line — protect entirely
  const collectionDateLine = /^.*\b(odb[eě]r|collect|datum|sample|vzork|nasb[ií]r|drawn)\b.*$/gim;
  const protectedLines = new Set();
  let m;
  while ((m = collectionDateLine.exec(pdfText)) !== null) {
    protectedLines.add(m.index);
  }

  function isProtectedLine(matchIndex) {
    // Check if this match falls on a collection date line
    const lineStart = text.lastIndexOf('\n', matchIndex) + 1;
    return protectedLines.has(lineStart) || protectedLines.has(matchIndex);
  }

  // Phase 1 — Label-based: lines with PII-identifying labels
  const labelReplacements = [
    { pattern: /^(.*?\b(?:jm[eé]no|name|pacient|patient|p[rř][ií]jmen[ií]|surname)\b[:\s]+)(.+)$/gim, gen: () => fakeName(pdfSex) },
    { pattern: /^(.*?\b(?:adresa|address|bydli[sš]t[eě]|residence)\b[:\s]+)(.+)$/gim, gen: () => `${randomPick(FAKE_STREETS)}, ${randomPick(FAKE_CITIES)}` },
    { pattern: /^(.*?\b(?:datum\s*narozen|date\s*of\s*birth|nar(?:ozen[ií])?\.?)\b[:\s]+)(.+)$/gim, gen: () => fakeDate() },
    { pattern: /^(.*?\b(?:l[eé]ka[rř]|doctor|phy?sician|o[sš]et[rř]uj[ií]c[ií])\b\.?[:\s]+)(.+)$/gim, gen: () => randomPick(FAKE_DOCTORS) },
    { pattern: /^(.*?\b(?:rodn[eé]\s*[cč][ií]slo|birth\s*number|r[\.\s]?[cč][\.\s]?)\b[:\s]+)(.+)$/gim, gen: () => fakeBirthNumber() },
    { pattern: /^(.*?\b(?:[cč][ií]slo\s*(?:poji[sš]t[eě]n|insurance)|insurance\s*(?:no|number|id)|poji[sš][tť]ovna)\b[:\s]+)(.+)$/gim, gen: () => randomDigits(3) },
    { pattern: /^(.*?\b(?:id\s*pacienta|patient\s*id|[cč][ií]slo\s*pacienta)\b[:\s]+)(.+)$/gim, gen: () => fakePatientId() },
  ];

  for (const { pattern, gen } of labelReplacements) {
    text = text.replace(pattern, (match, label, value, offset) => {
      if (isProtectedLine(offset)) return match;
      replacements++;
      return label + gen();
    });
  }

  // Phase 2 — Pattern-based: anywhere in text
  // Czech/Slovak birth number (YYMMDD/XXXX)
  text = text.replace(/\b(\d{2})(0[1-9]|1[0-2]|5[1-9]|6[0-2])(0[1-9]|[12]\d|3[01])\/(\d{3,4})\b/g, (match, _y, _m, _d, _s, offset) => {
    if (isProtectedLine(offset)) return match;
    replacements++;
    return fakeBirthNumber();
  });

  // SSN (XXX-XX-XXXX)
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    replacements++;
    return `${randomDigits(3)}-${randomDigits(2)}-${randomDigits(4)}`;
  });

  // Email
  text = text.replace(/\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    replacements++;
    return fakeEmail();
  });

  // Phone numbers (international and local)
  text = text.replace(/(?:\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{3,4}\b/g, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    const lineStart = text.lastIndexOf('\n', offset) + 1;
    const lineEnd = text.indexOf('\n', offset);
    const line = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
    // Skip result lines and lines already handled by label-based phase (IDs, birth numbers)
    if (unitKeywords.test(line)) return match;
    if (/\b(id\s*pacienta|patient\s*id|rodn[eé]\s*[cč][ií]slo|birth\s*number|[cč][ií]slo\s*pacienta|i[cč]p)\b/i.test(line)) return match;
    replacements++;
    return fakePhone();
  });

  // Long digit sequences (8+ digits) on non-result lines — likely patient/sample IDs
  text = text.replace(/\b\d{8,}\b/g, (match, offset) => {
    if (isProtectedLine(offset)) return match;
    const lineStart = text.lastIndexOf('\n', offset) + 1;
    const lineEnd = text.indexOf('\n', offset);
    const line = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
    if (unitKeywords.test(line)) return match;
    // Skip page headers
    if (/===\s*Page/i.test(line)) return match;
    replacements++;
    return randomDigits(match.length);
  });

  return { obfuscated: text, original, replacements };
}

// ═══════════════════════════════════════════════
// PII WARNING DIALOG & OLLAMA SETUP GUIDE
// ═══════════════════════════════════════════════

// ═══════════════════════════════════════════════
// PII DIFF VIEWER (debug mode)
// ═══════════════════════════════════════════════
function isDebugMode() { return localStorage.getItem('labcharts-debug') === 'true'; }
function setDebugMode(on) { localStorage.setItem('labcharts-debug', on ? 'true' : 'false'); }
function isPIIReviewEnabled() { return localStorage.getItem('labcharts-pii-review') !== 'false'; }
function setPIIReviewEnabled(on) { localStorage.setItem('labcharts-pii-review', on ? 'true' : 'false'); }

function buildPIIDiffHTML(originalText, obfuscatedText) {
  const origLines = originalText.split('\n');
  const obfLines = obfuscatedText.split('\n');
  const maxLines = Math.max(origLines.length, obfLines.length);
  let leftHtml = '', rightHtml = '';
  for (let i = 0; i < maxLines; i++) {
    const origLine = origLines[i] || '';
    const obfLine = obfLines[i] || '';
    const changed = origLine !== obfLine;
    leftHtml += `<div class="${changed ? 'pii-diff-highlight-removed' : ''}">${escapeHTML(origLine) || '&nbsp;'}</div>`;
    rightHtml += `<div class="${changed ? 'pii-diff-highlight-added' : ''}">${escapeHTML(obfLine) || '&nbsp;'}</div>`;
  }
  return { leftHtml, rightHtml };
}

function showPIIDiffViewer(originalText, obfuscatedText) {
  const overlay = document.createElement('div');
  overlay.className = 'pii-warning-overlay';
  const { leftHtml, rightHtml } = buildPIIDiffHTML(originalText, obfuscatedText);
  overlay.innerHTML = `
    <div class="pii-diff-modal">
      <button class="modal-close" onclick="this.closest('.pii-warning-overlay').remove()">&times;</button>
      <h3>&#128269; Privacy Diff — Before / After</h3>
      <div class="pii-diff-viewer">
        <div class="pii-diff-left"><div class="pii-diff-header">Original</div>${leftHtml}</div>
        <div class="pii-diff-right"><div class="pii-diff-header">Obfuscated</div>${rightHtml}</div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px">
        <button class="import-btn import-btn-secondary" onclick="this.closest('.pii-warning-overlay').remove()">Close</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));
}

function reviewPIIBeforeSend(originalText, obfuscatedText) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'pii-warning-overlay';
    const { leftHtml, rightHtml } = buildPIIDiffHTML(originalText, obfuscatedText);
    overlay.innerHTML = `
      <div class="pii-diff-modal">
        <h3>&#128274; Review — This is what AI will receive</h3>
        <p style="font-size:13px;color:var(--text-muted);margin:0 0 12px">Personal information on the left has been replaced with fake data on the right. Verify no sensitive data remains before sending.</p>
        <div class="pii-diff-viewer">
          <div class="pii-diff-left"><div class="pii-diff-header">Original (stays local)</div>${leftHtml}</div>
          <div class="pii-diff-right"><div class="pii-diff-header">Sent to AI</div>${rightHtml}</div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:12px">
          <button class="import-btn import-btn-secondary" id="pii-review-cancel">Cancel Import</button>
          <button class="import-btn" id="pii-review-send">Send to AI</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));
    overlay.querySelector('#pii-review-send').addEventListener('click', () => { overlay.remove(); resolve('send'); });
    overlay.querySelector('#pii-review-cancel').addEventListener('click', () => { overlay.remove(); resolve('cancel'); });
  });
}

// ═══════════════════════════════════════════════
// AI-POWERED PDF IMPORT
// ═══════════════════════════════════════════════
function buildMarkerReference() {
  const ref = {};
  const isFemale = profileSex === 'female';
  for (const [catKey, cat] of Object.entries(MARKER_SCHEMA)) {
    if (cat.calculated) continue;
    for (const [markerKey, marker] of Object.entries(cat.markers)) {
      const rMin = isFemale && marker.refMin_f != null ? marker.refMin_f : marker.refMin;
      const rMax = isFemale && marker.refMax_f != null ? marker.refMax_f : marker.refMax;
      ref[`${catKey}.${markerKey}`] = { name: marker.name, unit: marker.unit, refMin: rMin, refMax: rMax };
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

function tryParseJSON(str) {
  try { return JSON.parse(str); } catch {}
  // Try trimming to last complete object (handles truncated output)
  const lastBrace = str.lastIndexOf('}');
  if (lastBrace > 0 && lastBrace < str.length - 1) {
    try { return JSON.parse(str.slice(0, lastBrace + 1)); } catch {}
  }
  // Attempt to repair truncated JSON from local models
  let s = str;
  // Close any unterminated string
  const quotes = (s.match(/"/g) || []).length;
  if (quotes % 2 !== 0) s += '"';
  // Try closing open arrays and objects
  const opens = { '{': 0, '[': 0 };
  let inString = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '"' && (i === 0 || s[i - 1] !== '\\')) { inString = !inString; continue; }
    if (inString) continue;
    if (s[i] === '{') opens['{']++;
    if (s[i] === '}') opens['{']--;
    if (s[i] === '[') opens['[']++;
    if (s[i] === ']') opens['[']--;
  }
  // Remove trailing comma before closing
  s = s.replace(/,\s*$/, '');
  // Close unclosed brackets/braces
  for (let i = 0; i < opens['[']; i++) s += ']';
  for (let i = 0; i < opens['{']; i++) s += '}';
  try {
    const result = JSON.parse(s);
    if (isDebugMode()) console.log('[PDF Parse] Repaired truncated JSON from model');
    return result;
  } catch (e2) {
    throw new Error(`Model returned invalid JSON that could not be repaired. Try a more capable model.`);
  }
}

async function parseLabPDFWithAI(pdfText, fileName) {
  const markerRef = buildMarkerReference();
  const system = `You are a lab report data extraction assistant. You extract biomarker results from lab report text and map them to a known set of marker keys.

Here is the complete list of known markers with their keys, expected units, and reference ranges:
${JSON.stringify(markerRef)}

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

  const provider = getAIProvider();
  const { text: response, usage } = await callClaudeAPI({
    system,
    messages: [{ role: 'user', content: `Extract all biomarker results from this lab report:\n\n${pdfText}` }],
    maxTokens: 8192
  });

  // Parse JSON from response (handle markdown code blocks, truncated output)
  let jsonStr = (response || '').trim();
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) jsonStr = codeBlockMatch[1].trim();
  // Strip any leading text before the JSON object
  const jsonStart = jsonStr.indexOf('{');
  if (jsonStart > 0) jsonStr = jsonStr.slice(jsonStart);
  const parsed = tryParseJSON(jsonStr);

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
    fileName,
    usage,
    provider
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
    html += `<div style="background:var(--yellow-bg);border:1px solid var(--yellow);border-radius:var(--radius-sm);padding:12px;margin-bottom:16px;color:var(--yellow)">
      Could not extract collection date from PDF. Please enter it manually:
      <input type="date" id="import-manual-date" style="margin-left:8px;padding:4px 8px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-family:var(--font-mono)" onchange="applyManualImportDate(this.value)"></div>`;
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

  // Specialty test warning
  const SPECIALTY_PREFIXES = ['oat', 'urineAmino', 'urineAminoMetab', 'toxicElements', 'nutrientElements', 'oxidativeStress'];
  const importHasSpecialty = markers.some(m => {
    const key = (m.mappedKey || m.suggestedKey || '').split('.')[0];
    return SPECIALTY_PREFIXES.some(p => key === p || key.startsWith(p));
  });
  if (importHasSpecialty) {
    const existingHasSpecialty = (importedData.entries || []).some(entry =>
      Object.keys(entry.markers || {}).some(k => {
        const cat = k.split('.')[0];
        return SPECIALTY_PREFIXES.some(p => cat === p || cat.startsWith(p));
      })
    );
    if (existingHasSpecialty) {
      html += `<div style="background:var(--yellow-bg);border:1px solid var(--yellow);border-radius:var(--radius-sm);padding:12px;margin-top:12px;color:var(--yellow);font-size:13px;line-height:1.5">\u26A0 You already have specialty test data. Different labs use different reference ranges for the same markers \u2014 status colors may not match your new lab's stated ranges.</div>`;
    } else {
      html += `<div style="background:rgba(79,140,255,0.10);border:1px solid var(--accent);border-radius:var(--radius-sm);padding:12px;margin-top:12px;color:var(--accent);font-size:13px;line-height:1.5">\u2139 Reference ranges for specialty tests vary between laboratories \u2014 the ranges in this app may differ from your lab's stated ranges.</div>`;
    }
  }

  // Privacy notice
  if (parseResult.privacyMethod === 'ollama') {
    html += `<div class="privacy-notice privacy-notice-success">&#128274; Personal information scrubbed by local AI</div>`;
  } else if (parseResult.privacyMethod === 'regex') {
    html += `<div class="privacy-notice privacy-notice-warning">&#128274; ${parseResult.privacyReplacements} personal detail${parseResult.privacyReplacements !== 1 ? 's' : ''} replaced with fake data`;
    html += `<span style="font-size:12px;display:block;margin-top:4px;opacity:0.8">Set up Local AI in Settings for comprehensive language-aware protection</span></div>`;
  }
  // Cost info (always visible)
  if (parseResult.costInfo) {
    const ci = parseResult.costInfo;
    const totalTokens = (ci.inputTokens || 0) + (ci.outputTokens || 0);
    const modelLabel = ci.provider === 'ollama' ? getOllamaMainModel() : ci.provider === 'venice' ? getVeniceModelDisplay() : getAnthropicModelDisplay();
    html += `<div style="font-size:12px;color:var(--text-muted);margin-top:8px">\ud83d\udcca ${escapeHTML(modelLabel)} \u00b7 ${totalTokens.toLocaleString()} tokens \u00b7 ${formatCost(ci.cost)}</div>`;
  }
  // Debug: timings and diff button
  if (isDebugMode()) {
    const t = parseResult.timings;
    if (t) {
      const piiLabel = parseResult.privacyMethod === 'ollama' ? `PII: ${t.pii}s (${getOllamaPIIModel()})` : `PII: regex`;
      const provider = getAIProvider();
      const modelLabel = provider === 'ollama' ? getOllamaMainModel() : provider === 'venice' ? getVeniceModelDisplay() : getAnthropicModelDisplay();
      html += `<div style="font-size:12px;color:var(--text-muted);margin-top:8px;font-family:monospace">&#9202; ${piiLabel} &nbsp;|&nbsp; Analysis: ${t.analysis}s (${modelLabel})</div>`;
    }
    if (parseResult.privacyOriginal && parseResult.privacyObfuscated) {
      html += `<button class="import-btn import-btn-secondary" style="margin-top:8px;font-size:12px" onclick="showPIIDiffViewer(window._pendingImport.privacyOriginal, window._pendingImport.privacyObfuscated)">&#128269; View privacy details</button>`;
    }
  }

  const cancelLabel = batchCtx ? 'Skip' : 'Cancel';
  const importDisabled = !date ? ' disabled style="opacity:0.5;cursor:not-allowed"' : '';
  html += `<div style="display:flex;gap:12px;justify-content:flex-end;margin-top:20px">
    <button class="import-btn import-btn-secondary" onclick="closeImportModal()">${cancelLabel}</button>
    <button class="import-btn import-btn-primary" id="import-confirm-btn" onclick="confirmImport()"${importDisabled}>Import ${importCount} Markers</button></div>`;
  parseResult._importProfileId = currentProfile;
  window._pendingImport = parseResult;
  modal.innerHTML = html;
  overlay.classList.add("show");
}

function applyManualImportDate(dateStr) {
  if (!window._pendingImport || !dateStr) return;
  window._pendingImport.date = dateStr;
  const btn = document.getElementById('import-confirm-btn');
  if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; }
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
  // Guard: if profile changed during async import, abort to prevent saving to wrong profile
  if (result._importProfileId && result._importProfileId !== currentProfile) {
    showNotification('Profile changed during import — import cancelled for safety.', 'error');
    closeImportModal();
    return;
  }
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
  saveImportedData();
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
  saveImportedData();
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
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Note saved', 'success');
}

function deleteNote(idx) {
  if (!importedData.notes) return;
  importedData.notes.splice(idx, 1);
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Note deleted', 'info');
}

// ═══════════════════════════════════════════════
// CONTEXT CARD EDITOR HELPERS
// ═══════════════════════════════════════════════
function renderSelectField(label, id, options, current) {
  return `<div class="ctx-field-group"><label class="ctx-field-label">${label}</label>
    <div class="ctx-btn-group" id="${id}">
      ${options.map(o => `<button type="button" class="ctx-btn-option${current === o ? ' active' : ''}" onclick="selectCtxOption(this,'${id}')">${escapeHTML(o)}</button>`).join('')}
    </div></div>`;
}
function selectCtxOption(btn, groupId) {
  const group = document.getElementById(groupId);
  if (!group) return;
  const wasActive = btn.classList.contains('active');
  group.querySelectorAll('.ctx-btn-option').forEach(b => b.classList.remove('active'));
  if (!wasActive) btn.classList.add('active');
}
function getSelectedOption(groupId) {
  const group = document.getElementById(groupId);
  if (!group) return null;
  const active = group.querySelector('.ctx-btn-option.active');
  return active ? active.textContent : null;
}
function renderTagsField(label, id, options, selected) {
  const sel = selected || [];
  return `<div class="ctx-field-group"><label class="ctx-field-label">${label}</label>
    <div class="ctx-tags" id="${id}">
      ${options.map(o => `<button type="button" class="ctx-tag${sel.includes(o) ? ' active' : ''}" onclick="toggleCtxTag(this)">${escapeHTML(o)}</button>`).join('')}
    </div></div>`;
}
function toggleCtxTag(btn) { btn.classList.toggle('active'); }
function getSelectedTags(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return [];
  return Array.from(el.querySelectorAll('.ctx-tag.active')).map(b => b.textContent);
}
function renderNoteField(value) {
  return `<div class="ctx-field-group"><label class="ctx-field-label">Notes</label>
    <input type="text" class="ctx-note-input" id="ctx-note-input" placeholder="Anything else..." value="${escapeHTML(value || '')}"></div>`;
}
function contextEditorActions(hasCurrent, saveFn, clearFn) {
  return `<div class="ctx-editor-actions">
    <button class="import-btn import-btn-primary" onclick="${saveFn}()">Save</button>
    <button class="import-btn import-btn-secondary" onclick="closeModal()">Cancel</button>
    ${hasCurrent ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="${clearFn}()">Clear</button>` : ''}
  </div>`;
}
function saveAndRefresh(msg) {
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(msg, 'success');
}

// ═══════════════════════════════════════════════
// DIAGNOSES / MEDICAL CONDITIONS
// ═══════════════════════════════════════════════
function openDiagnosesEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.diagnoses || { conditions: [], note: '' };
  renderDiagnosesModal(modal, current);
  overlay.classList.add("show");
}

function renderDiagnosesModal(modal, current) {
  const conditions = current.conditions || [];
  let html = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Medical Conditions</h3>
    <div class="modal-unit">Add diagnosed conditions. The AI will consider these when interpreting your labs.</div>`;
  if (conditions.length > 0) {
    html += `<div class="ctx-conditions-list" id="ctx-conditions-list">`;
    for (let i = 0; i < conditions.length; i++) {
      const c = conditions[i];
      html += `<div class="ctx-condition-item">
        <span class="ctx-condition-name">${escapeHTML(c.name)}</span>
        ${c.severity ? `<span class="goals-severity-badge severity-${c.severity}">${c.severity}</span>` : ''}
        ${c.since ? `<span class="ctx-condition-since">since ${escapeHTML(c.since)}</span>` : ''}
        <button class="goals-delete-btn" onclick="deleteCondition(${i})">&times;</button>
      </div>`;
    }
    html += `</div>`;
  }
  html += `<div class="ctx-field-group"><label class="ctx-field-label">Add condition</label>
    <div class="ctx-add-condition">
      <div class="ctx-autocomplete-wrapper">
        <input type="text" class="ctx-note-input" id="condition-input" placeholder="Type condition name..." oninput="filterConditionSuggestions()" onfocus="filterConditionSuggestions()">
        <div class="ctx-suggestions" id="condition-suggestions"></div>
      </div>
      <input type="text" class="ctx-note-input" id="condition-since" placeholder="Since (e.g. 2020)" style="width:100px">
      <button class="import-btn import-btn-primary" onclick="addCondition()">Add</button>
    </div>
    <div class="ctx-btn-group" id="condition-severity" style="margin-top:8px">
      <button type="button" class="ctx-btn-option active" onclick="selectCtxOption(this,'condition-severity')">major</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'condition-severity')">mild</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'condition-severity')">minor</button>
    </div>
  </div>`;
  html += renderNoteField(current.note);
  html += contextEditorActions(conditions.length > 0 || current.note, 'saveDiagnoses', 'clearDiagnoses');
  modal.innerHTML = html;
  setTimeout(() => {
    const input = document.getElementById('condition-input');
    if (input) {
      input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addCondition(); } };
    }
    document.addEventListener('click', closeSuggestionsOnClickOutside);
  }, 50);
}

function filterConditionSuggestions() {
  const input = document.getElementById('condition-input');
  const container = document.getElementById('condition-suggestions');
  if (!input || !container) return;
  const val = input.value.toLowerCase().trim();
  const existing = (importedData.diagnoses && importedData.diagnoses.conditions || []).map(c => c.name.toLowerCase());
  const matches = val ? COMMON_CONDITIONS.filter(c => c.toLowerCase().includes(val) && !existing.includes(c.toLowerCase())) : COMMON_CONDITIONS.filter(c => !existing.includes(c.toLowerCase()));
  if (matches.length === 0 || !val) { container.innerHTML = ''; return; }
  container.innerHTML = matches.slice(0, 8).map(m => `<div class="ctx-suggestion-item" onmousedown="selectConditionSuggestion('${escapeHTML(m)}')">${escapeHTML(m)}</div>`).join('');
}

function selectConditionSuggestion(name) {
  const input = document.getElementById('condition-input');
  if (input) input.value = name;
  const container = document.getElementById('condition-suggestions');
  if (container) container.innerHTML = '';
}

function closeSuggestionsOnClickOutside(e) {
  const container = document.getElementById('condition-suggestions');
  const input = document.getElementById('condition-input');
  if (container && input && !input.contains(e.target) && !container.contains(e.target)) {
    container.innerHTML = '';
  }
}

function syncDiagnosesNote() {
  const noteEl = document.getElementById('ctx-note-input');
  if (noteEl && importedData.diagnoses) importedData.diagnoses.note = noteEl.value.trim();
}

function addCondition() {
  const input = document.getElementById('condition-input');
  const severity = getSelectedOption('condition-severity') || 'mild';
  const since = document.getElementById('condition-since');
  const name = input ? input.value.trim() : '';
  if (!name) return;
  syncDiagnosesNote();
  if (!importedData.diagnoses) importedData.diagnoses = { conditions: [], note: '' };
  const cond = { name, severity };
  if (since && since.value.trim()) cond.since = since.value.trim();
  importedData.diagnoses.conditions.push(cond);
  saveImportedData();
  renderDiagnosesModal(document.getElementById("detail-modal"), importedData.diagnoses);
}

function deleteCondition(idx) {
  if (!importedData.diagnoses || !importedData.diagnoses.conditions) return;
  syncDiagnosesNote();
  importedData.diagnoses.conditions.splice(idx, 1);
  saveImportedData();
  renderDiagnosesModal(document.getElementById("detail-modal"), importedData.diagnoses);
}

function saveDiagnoses() {
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!importedData.diagnoses) importedData.diagnoses = { conditions: [], note: '' };
  importedData.diagnoses.note = note.trim();
  if (importedData.diagnoses.conditions.length === 0 && !importedData.diagnoses.note) {
    importedData.diagnoses = null;
  }
  saveAndRefresh('Medical conditions saved');
}

function clearDiagnoses() {
  importedData.diagnoses = null;
  saveAndRefresh('Medical conditions cleared');
}

// ═══════════════════════════════════════════════
// DIET
// ═══════════════════════════════════════════════
function openDietEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.diet || { type: null, restrictions: [], pattern: null, breakfast: '', lunch: '', dinner: '', snacks: '', note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Diet</h3>
    <div class="modal-unit">Describe your typical diet. The AI will factor this in when interpreting your labs.</div>
    ${renderSelectField('Diet type', 'diet-type', DIET_TYPES, current.type)}
    ${renderSelectField('Eating pattern', 'diet-pattern', DIET_PATTERNS, current.pattern)}
    ${renderTagsField('Restrictions', 'diet-restrictions', DIET_RESTRICTIONS, current.restrictions)}
    <div class="ctx-editor-divider"></div>
    <div class="ctx-field-group"><label class="ctx-field-label">Typical meals</label>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-breakfast-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.breakfastTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-breakfast" placeholder="Breakfast — e.g. eggs, avocado, coffee" value="${escapeHTML(current.breakfast || '')}"></div>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-lunch-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.lunchTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-lunch" placeholder="Lunch — e.g. salad with grilled chicken" value="${escapeHTML(current.lunch || '')}"></div>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-dinner-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.dinnerTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-dinner" placeholder="Dinner — e.g. salmon, rice, vegetables" value="${escapeHTML(current.dinner || '')}"></div>
      <div class="ctx-meal-row"><input type="text" class="ctx-meal-time" id="diet-snacks-time" placeholder="${getTimePlaceholder()}" value="${escapeHTML(formatTime(current.snacksTime || ''))}"><input class="ctx-note-input ctx-meal-input" id="diet-snacks" placeholder="Snacks — e.g. nuts, fruit, dark chocolate" value="${escapeHTML(current.snacks || '')}"></div>
    </div>
    ${renderNoteField(current.note)}
    ${contextEditorActions(importedData.diet != null, 'saveDiet', 'clearDiet')}`;
  overlay.classList.add("show");
}

function saveDiet() {
  const type = getSelectedOption('diet-type');
  const pattern = getSelectedOption('diet-pattern');
  const restrictions = getSelectedTags('diet-restrictions');
  const breakfast = (document.getElementById('diet-breakfast') || {}).value || '';
  const breakfastTime = parseTimeInput((document.getElementById('diet-breakfast-time') || {}).value || '');
  const lunch = (document.getElementById('diet-lunch') || {}).value || '';
  const lunchTime = parseTimeInput((document.getElementById('diet-lunch-time') || {}).value || '');
  const dinner = (document.getElementById('diet-dinner') || {}).value || '';
  const dinnerTime = parseTimeInput((document.getElementById('diet-dinner-time') || {}).value || '');
  const snacks = (document.getElementById('diet-snacks') || {}).value || '';
  const snacksTime = parseTimeInput((document.getElementById('diet-snacks-time') || {}).value || '');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!type && !pattern && restrictions.length === 0 && !breakfast.trim() && !lunch.trim() && !dinner.trim() && !snacks.trim() && !note.trim()) {
    importedData.diet = null;
  } else {
    importedData.diet = { type, restrictions, pattern, breakfast: breakfast.trim(), breakfastTime, lunch: lunch.trim(), lunchTime, dinner: dinner.trim(), dinnerTime, snacks: snacks.trim(), snacksTime, note: note.trim() };
  }
  saveAndRefresh('Diet saved');
}

function clearDiet() {
  importedData.diet = null;
  saveAndRefresh('Diet cleared');
}

// ═══════════════════════════════════════════════
// SLEEP & REST
// ═══════════════════════════════════════════════
function openSleepRestEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.sleepRest || { duration: null, quality: null, schedule: null, roomTemp: null, issues: [], environment: [], practices: [], note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Sleep & Rest</h3>
    <div class="modal-unit">Sleep is when the body repairs. Duration, temperature, darkness, and EMF exposure all affect hormones, inflammation, and recovery.</div>
    ${renderSelectField('Duration', 'sleep-duration', SLEEP_DURATIONS, current.duration)}
    ${renderSelectField('Quality', 'sleep-quality', SLEEP_QUALITY, current.quality)}
    ${renderSelectField('Schedule', 'sleep-schedule', SLEEP_SCHEDULE, current.schedule)}
    ${renderSelectField('Room temperature', 'sleep-temp', SLEEP_ROOM_TEMP, current.roomTemp)}
    ${renderTagsField('Sleep issues', 'sleep-issues', SLEEP_ISSUES, current.issues)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('Sleep environment', 'sleep-env', SLEEP_ENVIRONMENT, current.environment)}
    ${renderTagsField('Sleep practices', 'sleep-practices', SLEEP_PRACTICES, current.practices)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(importedData.sleepRest != null, 'saveSleepRest', 'clearSleepRest')}`;
  overlay.classList.add("show");
}

function saveSleepRest() {
  const duration = getSelectedOption('sleep-duration');
  const quality = getSelectedOption('sleep-quality');
  const schedule = getSelectedOption('sleep-schedule');
  const roomTemp = getSelectedOption('sleep-temp');
  const issues = getSelectedTags('sleep-issues');
  const environment = getSelectedTags('sleep-env');
  const practices = getSelectedTags('sleep-practices');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!duration && !quality && !schedule && !roomTemp && issues.length === 0 && environment.length === 0 && practices.length === 0 && !note.trim()) {
    importedData.sleepRest = null;
  } else {
    importedData.sleepRest = { duration, quality, schedule, roomTemp, issues, environment, practices, note: note.trim() };
  }
  saveAndRefresh('Sleep saved');
}

function clearSleepRest() {
  importedData.sleepRest = null;
  saveAndRefresh('Sleep cleared');
}

// ═══════════════════════════════════════════════
// LIGHT & CIRCADIAN
// ═══════════════════════════════════════════════
function openLightCircadianEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.lightCircadian || { amLight: null, daytime: null, uvExposure: null, evening: [], screenTime: null, techEnv: [], cold: null, grounding: null, mealTiming: [], note: '' };
  const lat = getLatitudeFromLocation();
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Light & Circadian</h3>
    <div class="modal-unit">Light is the #1 circadian signal. Morning light sets cortisol, UV drives vitamin D and hormones, cold and grounding affect mitochondrial function.</div>
    ${renderSelectField('Morning light', 'light-am', LIGHT_AM, current.amLight)}
    ${renderSelectField('Daytime outdoor exposure', 'light-daytime', LIGHT_DAYTIME, current.daytime)}
    ${renderSelectField('UV / sun exposure', 'light-uv', LIGHT_UV, current.uvExposure)}
    ${renderTagsField('Evening light discipline', 'light-evening', LIGHT_EVENING, current.evening)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Daily screen time', 'light-screen', LIGHT_SCREEN_TIME, current.screenTime)}
    ${renderTagsField('Technology environment', 'light-tech', LIGHT_TECH_ENV, current.techEnv)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Cold exposure', 'light-cold', LIGHT_COLD, current.cold)}
    ${renderSelectField('Grounding / earthing', 'light-grounding', LIGHT_GROUNDING, current.grounding)}
    ${renderTagsField('Meal timing signals', 'light-meal', LIGHT_MEAL_TIMING, current.mealTiming)}
    ${lat ? `<div style="font-size:12px;color:var(--text-muted);margin-top:8px">📍 Latitude: <strong style="color:var(--text-primary)">${escapeHTML(lat)}</strong> <span style="font-size:11px">(from Settings → Location)</span></div>` : `<div style="font-size:12px;color:var(--text-muted);margin-top:8px">💡 Set your country in Settings → Profile for automatic latitude detection</div>`}
    ${renderNoteField(current.note)}
    ${contextEditorActions(importedData.lightCircadian != null, 'saveLightCircadian', 'clearLightCircadian')}`;
  overlay.classList.add("show");
}

function saveLightCircadian() {
  const amLight = getSelectedOption('light-am');
  const daytime = getSelectedOption('light-daytime');
  const uvExposure = getSelectedOption('light-uv');
  const evening = getSelectedTags('light-evening');
  const screenTime = getSelectedOption('light-screen');
  const techEnv = getSelectedTags('light-tech');
  const cold = getSelectedOption('light-cold');
  const grounding = getSelectedOption('light-grounding');
  const mealTiming = getSelectedTags('light-meal');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!amLight && !daytime && !uvExposure && evening.length === 0 && !screenTime && techEnv.length === 0 && !cold && !grounding && mealTiming.length === 0 && !note.trim()) {
    importedData.lightCircadian = null;
  } else {
    importedData.lightCircadian = { amLight, daytime, uvExposure, evening, screenTime, techEnv, cold, grounding, mealTiming, note: note.trim() };
  }
  saveAndRefresh('Light & circadian saved');
}

function clearLightCircadian() {
  importedData.lightCircadian = null;
  saveAndRefresh('Light & circadian cleared');
}

// ═══════════════════════════════════════════════
// EXERCISE
// ═══════════════════════════════════════════════
function openExerciseEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.exercise || { frequency: null, types: [], intensity: null, dailyMovement: null, note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Exercise & Movement</h3>
    <div class="modal-unit">Describe your exercise routine. The AI considers this when interpreting your labs.</div>
    ${renderSelectField('Frequency', 'exercise-freq', EXERCISE_FREQ, current.frequency)}
    ${renderTagsField('Types', 'exercise-types', EXERCISE_TYPES, current.types)}
    ${renderSelectField('Intensity', 'exercise-intensity', EXERCISE_INTENSITY, current.intensity)}
    ${renderSelectField('Daily movement', 'exercise-movement', DAILY_MOVEMENT, current.dailyMovement)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(importedData.exercise != null, 'saveExercise', 'clearExercise')}`;
  overlay.classList.add("show");
}

function saveExercise() {
  const frequency = getSelectedOption('exercise-freq');
  const types = getSelectedTags('exercise-types');
  const intensity = getSelectedOption('exercise-intensity');
  const dailyMovement = getSelectedOption('exercise-movement');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!frequency && types.length === 0 && !intensity && !dailyMovement && !note.trim()) {
    importedData.exercise = null;
  } else {
    importedData.exercise = { frequency, types, intensity, dailyMovement, note: note.trim() };
  }
  saveAndRefresh('Exercise saved');
}

function clearExercise() {
  importedData.exercise = null;
  saveAndRefresh('Exercise cleared');
}

// ═══════════════════════════════════════════════
// STRESS
// ═══════════════════════════════════════════════
function openStressEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.stress || { level: null, sources: [], management: [], note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Stress</h3>
    <div class="modal-unit">Chronic stress elevates cortisol, disrupts thyroid, raises inflammation, and impairs immunity.</div>
    ${renderSelectField('Stress level', 'stress-level', STRESS_LEVELS, current.level)}
    ${renderTagsField('Sources', 'stress-sources', STRESS_SOURCES, current.sources)}
    ${renderTagsField('Management', 'stress-mgmt', STRESS_MGMT, current.management)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(importedData.stress != null, 'saveStress', 'clearStress')}`;
  overlay.classList.add("show");
}

function saveStress() {
  const level = getSelectedOption('stress-level');
  const sources = getSelectedTags('stress-sources');
  const management = getSelectedTags('stress-mgmt');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!level && sources.length === 0 && management.length === 0 && !note.trim()) {
    importedData.stress = null;
  } else {
    importedData.stress = { level, sources, management, note: note.trim() };
  }
  saveAndRefresh('Stress profile saved');
}

function clearStress() {
  importedData.stress = null;
  saveAndRefresh('Stress profile cleared');
}

// ═══════════════════════════════════════════════
// LOVE LIFE
// ═══════════════════════════════════════════════
function openLoveLifeEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.loveLife || { status: null, satisfaction: null, relationship: null, libido: null, frequency: null, orgasm: null, concerns: [], note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Love Life</h3>
    <div class="modal-unit">Sexual health and relationships directly affect hormones (testosterone, estrogen, oxytocin, cortisol), immune function, and cardiovascular markers.</div>
    ${renderSelectField('Relationship status', 'love-status', LOVE_STATUS, current.status)}
    ${renderSelectField('Relationship quality', 'love-relationship', LOVE_RELATIONSHIP, current.relationship)}
    ${renderSelectField('Overall satisfaction', 'love-satisfaction', LOVE_SATISFACTION, current.satisfaction)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Libido', 'love-libido', LOVE_LIBIDO, current.libido)}
    ${renderSelectField('Sexual frequency', 'love-frequency', LOVE_FREQUENCY, current.frequency)}
    ${renderSelectField('Orgasm', 'love-orgasm', LOVE_ORGASM, current.orgasm)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('Concerns', 'love-concerns', LOVE_CONCERNS, current.concerns)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(importedData.loveLife != null, 'saveLoveLife', 'clearLoveLife')}`;
  overlay.classList.add("show");
}

function saveLoveLife() {
  const status = getSelectedOption('love-status');
  const relationship = getSelectedOption('love-relationship');
  const satisfaction = getSelectedOption('love-satisfaction');
  const libido = getSelectedOption('love-libido');
  const frequency = getSelectedOption('love-frequency');
  const orgasm = getSelectedOption('love-orgasm');
  const concerns = getSelectedTags('love-concerns');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!status && !relationship && !satisfaction && !libido && !frequency && !orgasm && concerns.length === 0 && !note.trim()) {
    importedData.loveLife = null;
  } else {
    importedData.loveLife = { status, relationship, satisfaction, libido, frequency, orgasm, concerns, note: note.trim() };
  }
  saveAndRefresh('Love life saved');
}

function clearLoveLife() {
  importedData.loveLife = null;
  saveAndRefresh('Love life cleared');
}

// ═══════════════════════════════════════════════
// ENVIRONMENT
// ═══════════════════════════════════════════════
function openEnvironmentEditor() {
  const modal = document.getElementById("detail-modal");
  const overlay = document.getElementById("modal-overlay");
  const current = importedData.environment || { setting: null, climate: null, water: null, waterConcerns: [], emf: [], emfMitigation: [], homeLight: null, air: [], toxins: [], building: null, note: '' };
  modal.innerHTML = `<button class="modal-close" onclick="closeModal()">&times;</button>
    <h3>Environment</h3>
    <div class="modal-unit">Your environment shapes your biology — water quality, EMF, light, air, and toxin exposure directly impact mitochondria, inflammation, and hormone function.</div>
    ${renderSelectField('Living setting', 'env-setting', ENV_SETTING, current.setting)}
    ${renderSelectField('Climate', 'env-climate', ENV_CLIMATE, current.climate)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Primary water source', 'env-water', ENV_WATER, current.water)}
    ${renderTagsField('Water concerns', 'env-water-concerns', ENV_WATER_CONCERNS, current.waterConcerns)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('EMF exposure', 'env-emf', ENV_EMF, current.emf)}
    ${renderTagsField('EMF mitigation', 'env-emf-mit', ENV_EMF_MITIGATION, current.emfMitigation)}
    <div class="ctx-editor-divider"></div>
    ${renderSelectField('Home/work lighting', 'env-light', ENV_HOME_LIGHT, current.homeLight)}
    ${renderTagsField('Air quality', 'env-air', ENV_AIR, current.air)}
    <div class="ctx-editor-divider"></div>
    ${renderTagsField('Toxin exposure', 'env-toxins', ENV_TOXINS, current.toxins)}
    ${renderSelectField('Building', 'env-building', ENV_BUILDING, current.building)}
    ${renderNoteField(current.note)}
    ${contextEditorActions(importedData.environment != null, 'saveEnvironment', 'clearEnvironment')}`;
  overlay.classList.add("show");
}

function saveEnvironment() {
  const setting = getSelectedOption('env-setting');
  const climate = getSelectedOption('env-climate');
  const water = getSelectedOption('env-water');
  const waterConcerns = getSelectedTags('env-water-concerns');
  const emf = getSelectedTags('env-emf');
  const emfMitigation = getSelectedTags('env-emf-mit');
  const homeLight = getSelectedOption('env-light');
  const air = getSelectedTags('env-air');
  const toxins = getSelectedTags('env-toxins');
  const building = getSelectedOption('env-building');
  const note = (document.getElementById('ctx-note-input') || {}).value || '';
  if (!setting && !climate && !water && waterConcerns.length === 0 && emf.length === 0 && emfMitigation.length === 0 && !homeLight && air.length === 0 && toxins.length === 0 && !building && !note.trim()) {
    importedData.environment = null;
  } else {
    importedData.environment = { setting, climate, water, waterConcerns, emf, emfMitigation, homeLight, air, toxins, building, note: note.trim() };
  }
  saveAndRefresh('Environment saved');
}

function clearEnvironment() {
  importedData.environment = null;
  saveAndRefresh('Environment cleared');
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
  html += `<div class="ctx-field-group"><label class="ctx-field-label">Add goal</label>
    <div class="goals-add-row">
      <input type="text" class="ctx-note-input" id="goal-text-input" placeholder="e.g. Improve insulin sensitivity, Optimize thyroid function" style="flex:1">
      <button class="import-btn import-btn-primary" onclick="addHealthGoal()">Add</button>
    </div>
    <div class="ctx-btn-group" id="goal-severity-select" style="margin-top:8px">
      <button type="button" class="ctx-btn-option active" onclick="selectCtxOption(this,'goal-severity-select')">major</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'goal-severity-select')">mild</button>
      <button type="button" class="ctx-btn-option" onclick="selectCtxOption(this,'goal-severity-select')">minor</button>
    </div>
  </div>
  <div class="ctx-editor-actions">
    <button class="import-btn import-btn-secondary" onclick="closeModal()">Done</button>
    ${goals.length > 0 ? `<button class="import-btn import-btn-secondary" style="color:var(--red);border-color:var(--red);margin-left:auto" onclick="clearHealthGoals()">Clear All</button>` : ''}
  </div>`;
  modal.innerHTML = html;
  setTimeout(() => {
    const input = document.getElementById('goal-text-input');
    if (input) {
      input.focus();
      input.onkeydown = (e) => { if (e.key === 'Enter') { e.preventDefault(); addHealthGoal(); } };
    }
  }, 50);
}

function addHealthGoal() {
  const input = document.getElementById('goal-text-input');
  const severity = getSelectedOption('goal-severity-select') || 'major';
  const text = input ? input.value.trim() : '';
  if (!text) return;
  if (!importedData.healthGoals) importedData.healthGoals = [];
  importedData.healthGoals.push({ text, severity });
  saveImportedData();
  renderHealthGoalsModal(document.getElementById("detail-modal"));
}

function deleteHealthGoal(idx) {
  if (!importedData.healthGoals) return;
  importedData.healthGoals.splice(idx, 1);
  saveImportedData();
  renderHealthGoalsModal(document.getElementById("detail-modal"));
}

function clearHealthGoals() {
  importedData.healthGoals = [];
  saveImportedData();
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
    <div class="ctx-editor-actions">
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
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(text ? 'Interpretive lens saved' : 'Interpretive lens cleared', 'success');
}

function clearInterpretiveLens() {
  importedData.interpretiveLens = '';
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Interpretive lens cleared', 'info');
}

function renderInterpretiveLensSection() {
  const lens = (importedData.interpretiveLens || '').trim();
  if (!lens) return `<div class="lens-section lens-section-empty" onclick="openInterpretiveLensEditor()" title="Set your interpretive lens"><span class="lens-section-icon">&#129694;</span><span class="lens-section-text">Set your interpretive lens — name researchers, paradigms, or frameworks the AI should use…</span></div>`;
  return `<div class="lens-section" onclick="openInterpretiveLensEditor()" title="Interpretive Lens — click to edit"><span class="lens-section-icon">&#129694;</span><span class="lens-section-body"><span class="lens-section-label">Interpretive Lens</span><span class="lens-section-text">${escapeHTML(lens)}</span></span><span class="lens-section-edit">&#9998;</span></div>`;
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
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification('Menstrual cycle profile saved', 'success');
}

function clearMenstrualCycle() {
  showConfirmDialog('Clear all menstrual cycle data? This cannot be undone.', () => {
    importedData.menstrualCycle = null;
    saveImportedData();
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
  saveImportedData();
  openMenstrualCycleEditor();
}

function deletePeriodEntry(startDate) {
  if (!importedData.menstrualCycle || !importedData.menstrualCycle.periods) return;
  syncMenstrualCycleProfileFromForm();
  importedData.menstrualCycle.periods = importedData.menstrualCycle.periods.filter(p => p.startDate !== startDate);
  saveImportedData();
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
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(idx >= 0 ? 'Supplement updated' : 'Supplement added', 'success');
}

function deleteSupplement(idx) {
  if (!importedData.supplements || !importedData.supplements[idx]) return;
  const name = importedData.supplements[idx].name;
  importedData.supplements.splice(idx, 1);
  saveImportedData();
  closeModal();
  const activeNav = document.querySelector(".nav-item.active");
  navigate(activeNav ? activeNav.dataset.category : "dashboard");
  showNotification(`"${name}" removed`, 'info');
}

// ═══════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════
function showNotification(message, type, duration) {
  type = type || "info";
  const container = document.getElementById("notification-container");
  const toast = document.createElement("div");
  toast.className = `notification-toast ${type}`;
  const icons = { success: "\u2713", error: "\u2717", info: "\u2139" };
  const iconSpan = document.createElement('span');
  iconSpan.textContent = icons[type] || "\u2139";
  toast.appendChild(iconSpan);
  toast.appendChild(document.createTextNode(' ' + message));
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0"; toast.style.transform = "translateX(100%)"; toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, duration || 3000);
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
  "Protecting personal information",
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
  if (!hasAIProvider()) {
    showNotification("AI provider not configured. Opening settings...", "info");
    setTimeout(() => openSettingsModal(), 500);
    return;
  }
  try {
    await showImportProgress(0, file.name);
    const pdfText = await extractPDFText(file);
    if (!pdfText.trim()) { hideImportProgress(); showNotification("PDF appears empty — no text extracted", "error"); return; }

    // PII obfuscation step
    await showImportProgress(1, file.name);
    let textForAI = pdfText;
    let privacyMethod = null;
    let privacyReplacements = 0;
    let privacyOriginal = null;
    let piiTime = 0;
    const ollama = await checkOllamaPII();
    if (ollama.available) {
      try {
        const piiStart = performance.now();
        textForAI = await sanitizeWithOllama(pdfText);
        piiTime = Math.round((performance.now() - piiStart) / 1000);
        privacyMethod = 'ollama';
        privacyOriginal = pdfText;
        if (isDebugMode()) console.log(`[PII] Obfuscated via Ollama (${piiTime}s)`);
      } catch (e) {
        if (isDebugMode()) console.warn('[PII] Ollama failed, falling back to regex:', e.message);
        try {
          const result = obfuscatePDFText(pdfText);
          textForAI = result.obfuscated;
          privacyReplacements = result.replacements;
          privacyOriginal = result.original;
          privacyMethod = 'regex';
        } catch (e2) {
          hideImportProgress();
          showNotification('Privacy protection failed — PDF not sent to AI. Try again or check Settings.', 'error');
          return;
        }
      }
    } else {
      try {
        const result = obfuscatePDFText(pdfText);
        textForAI = result.obfuscated;
        privacyReplacements = result.replacements;
        privacyOriginal = result.original;
        privacyMethod = 'regex';
      } catch (e) {
        hideImportProgress();
        showNotification('Privacy protection failed — PDF not sent to AI. Try again or check Settings.', 'error');
        return;
      }
    }
    if (isDebugMode()) { console.log('[PII] Original:', pdfText); console.log('[PII] Obfuscated:', textForAI); }

    if (isPIIReviewEnabled()) {
      const decision = await reviewPIIBeforeSend(privacyOriginal || pdfText, textForAI);
      if (decision === 'cancel') { hideImportProgress(); showNotification('Import cancelled.', 'info'); return; }
    }

    await showImportProgress(2, file.name);
    const analysisStart = performance.now();
    const result = await parseLabPDFWithAI(textForAI, file.name);
    const analysisTime = Math.round((performance.now() - analysisStart) / 1000);
    if (isDebugMode()) console.log(`[Analysis] Parsed in ${analysisTime}s`);
    result.privacyMethod = privacyMethod;
    result.privacyReplacements = privacyReplacements;
    result.timings = { pii: piiTime, analysis: analysisTime };
    const prov = result.provider || getAIProvider();
    const mid = prov === 'anthropic' ? getAnthropicModel() : prov === 'venice' ? getVeniceModel() : getOllamaMainModel();
    result.costInfo = {
      provider: prov, modelId: mid,
      inputTokens: result.usage?.inputTokens || 0,
      outputTokens: result.usage?.outputTokens || 0,
      cost: calculateCost(prov, mid, result.usage?.inputTokens || 0, result.usage?.outputTokens || 0)
    };
    if (isDebugMode()) { result.privacyOriginal = privacyOriginal; result.privacyObfuscated = textForAI; }
    if (!result.date) { showNotification("Could not find collection date in PDF", "error"); }
    if (result.markers.length === 0) { hideImportProgress(); showNotification("No biomarkers found in PDF", "error"); return; }
    await showImportProgress(3, file.name);
    showImportPreview(result);
    hideImportProgress();
  } catch (err) {
    hideImportProgress();
    if (isDebugMode()) console.error("PDF parse error:", err);
    showNotification("Error parsing PDF: " + err.message, "error");
  }
}

// ═══════════════════════════════════════════════
// BATCH PDF IMPORT
// ═══════════════════════════════════════════════
async function handleBatchPDFs(pdfFiles) {
  if (!hasAIProvider()) {
    showNotification("AI provider not configured. Opening settings...", "info");
    setTimeout(() => openSettingsModal(), 500);
    return;
  }
  const ollama = await checkOllamaPII();
  let imported = 0, skipped = 0, failed = 0;
  for (let i = 0; i < pdfFiles.length; i++) {
    const file = pdfFiles[i];
    try {
      await showBatchImportProgress(0, file.name, i + 1, pdfFiles.length);
      const pdfText = await extractPDFText(file);
      if (!pdfText.trim()) { showNotification(`${file.name}: PDF appears empty`, 'error'); failed++; continue; }

      // PII obfuscation
      await showBatchImportProgress(1, file.name, i + 1, pdfFiles.length);
      let textForAI = pdfText;
      let privacyMethod = null;
      let privacyReplacements = 0;
      let privacyOriginal = null;
      let piiTime = 0;
      if (ollama.available) {
        try {
          const piiStart = performance.now();
          textForAI = await sanitizeWithOllama(pdfText);
          piiTime = Math.round((performance.now() - piiStart) / 1000);
          privacyMethod = 'ollama';
          privacyOriginal = pdfText;
        } catch (e) {
          if (isDebugMode()) console.warn(`[PII] Ollama failed for ${file.name}, regex fallback:`, e.message);
          try {
            const r = obfuscatePDFText(pdfText);
            textForAI = r.obfuscated; privacyReplacements = r.replacements; privacyOriginal = r.original;
            privacyMethod = 'regex';
          } catch (e2) {
            showNotification(`${file.name}: Privacy protection failed — skipped`, 'error');
            failed++; continue;
          }
        }
      } else {
        try {
          const r = obfuscatePDFText(pdfText);
          textForAI = r.obfuscated; privacyReplacements = r.replacements; privacyOriginal = r.original;
          privacyMethod = 'regex';
        } catch (e) {
          showNotification(`${file.name}: Privacy protection failed — skipped`, 'error');
          failed++; continue;
        }
      }
      if (isDebugMode()) console.log(`[PII] ${file.name} — method: ${privacyMethod}, ${piiTime}s`);

      if (isPIIReviewEnabled()) {
        const decision = await reviewPIIBeforeSend(privacyOriginal || pdfText, textForAI);
        if (decision === 'cancel') { skipped++; continue; }
      }

      await showBatchImportProgress(2, file.name, i + 1, pdfFiles.length);
      const analysisStart = performance.now();
      const result = await parseLabPDFWithAI(textForAI, file.name);
      const analysisTime = Math.round((performance.now() - analysisStart) / 1000);
      if (isDebugMode()) console.log(`[Analysis] ${file.name} parsed in ${analysisTime}s`);
      result.privacyMethod = privacyMethod;
      result.privacyReplacements = privacyReplacements;
      result.timings = { pii: piiTime, analysis: analysisTime };
      const prov = result.provider || getAIProvider();
      const mid = prov === 'anthropic' ? getAnthropicModel() : prov === 'venice' ? getVeniceModel() : getOllamaMainModel();
      result.costInfo = {
        provider: prov, modelId: mid,
        inputTokens: result.usage?.inputTokens || 0,
        outputTokens: result.usage?.outputTokens || 0,
        cost: calculateCost(prov, mid, result.usage?.inputTokens || 0, result.usage?.outputTokens || 0)
      };
      if (isDebugMode()) { result.privacyOriginal = privacyOriginal; result.privacyObfuscated = textForAI; }
      if (result.markers.length === 0) { showNotification(`${file.name}: No markers found`, 'error'); failed++; continue; }
      await showBatchImportProgress(3, file.name, i + 1, pdfFiles.length);
      const action = await showImportPreviewAsync(result, file.name, i + 1, pdfFiles.length);
      if (action === 'skip') { skipped++; } else { imported++; }
    } catch (err) {
      if (isDebugMode()) console.error(`Batch import error (${file.name}):`, err);
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
  if (importedData.sleepRest) contextSections.push({ title: 'Sleep & Rest', text: importedData.sleepRest });
  if (importedData.lightCircadian) contextSections.push({ title: 'Light & Circadian', text: importedData.lightCircadian });
  if (importedData.stress) contextSections.push({ title: 'Stress', text: importedData.stress });
  if (importedData.loveLife) contextSections.push({ title: 'Love Life & Relationships', text: importedData.loveLife });
  if (importedData.environment) contextSections.push({ title: 'Environment', text: importedData.environment });
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
  const diagnoses = importedData.diagnoses || null;
  const diet = importedData.diet || null;
  const exercise = importedData.exercise || null;
  const sleepRest = importedData.sleepRest || null;
  const lightCircadian = importedData.lightCircadian || null;
  const stress = importedData.stress || null;
  const loveLife = importedData.loveLife || null;
  const environment = importedData.environment || null;
  const interpretiveLens = importedData.interpretiveLens || '';
  const contextNotes = importedData.contextNotes || '';
  const customMarkers = importedData.customMarkers || {};
  const supplements = importedData.supplements || [];
  const healthGoals = importedData.healthGoals || [];
  const menstrualCycle = importedData.menstrualCycle || null;
  const exportObj = { version: 2, exportedAt: new Date().toISOString(), entries, notes, supplements, diagnoses, diet, exercise, sleepRest, lightCircadian, stress, loveLife, environment, interpretiveLens, contextNotes, healthGoals, customMarkers, menstrualCycle };
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
      // Import context fields — handle both old string format (v1) and new object format (v2)
      function importContextField(field) {
        const val = json[field];
        if (!val) return;
        if (typeof val === 'object' && val !== null) {
          // v2 structured format — use directly
          importedData[field] = val;
        } else if (typeof val === 'string' && val.trim()) {
          // v1 legacy string — migrate to structured with note
          const migrations = {
            diagnoses: { conditions: [], note: val.trim() },
            diet: { type: null, restrictions: [], pattern: null, note: val.trim() },
            exercise: { frequency: null, types: [], intensity: null, dailyMovement: null, note: val.trim() },
            sleepRest: { duration: null, quality: null, schedule: null, issues: [], note: val.trim() }
          };
          if (migrations[field]) importedData[field] = migrations[field];
        }
      }
      importContextField('diagnoses');
      importContextField('diet');
      importContextField('exercise');
      // Import sleep & light/circadian (handle old sleepCircadian, old separate fields, or new split fields)
      if (json.sleepRest) {
        importContextField('sleepRest');
      } else if (json.sleepCircadian) {
        // Migrate old sleepCircadian → sleepRest
        const sc = json.sleepCircadian;
        if (typeof sc === 'object' && sc !== null) {
          const sleepIssues = (sc.issues || []).filter(i => !['blue light blockers', 'morning sunlight'].includes(i));
          const circPractices = (sc.issues || []).filter(i => ['blue light blockers', 'morning sunlight'].includes(i));
          importedData.sleepRest = { duration: sc.duration || null, quality: sc.quality || null, schedule: sc.schedule || null, issues: sleepIssues, note: sc.note || '' };
          if (circPractices.length && !importedData.lightCircadian) {
            importedData.lightCircadian = { practices: circPractices, timing: null, mealTiming: [], note: '' };
          }
        } else if (typeof sc === 'string' && sc.trim()) {
          importedData.sleepRest = { duration: null, quality: null, schedule: null, issues: [], note: sc.trim() };
        }
      } else {
        const parts = [json.circadian, json.sleep].filter(s => typeof s === 'string' && s.trim());
        if (parts.length) importedData.sleepRest = { duration: null, quality: null, schedule: null, issues: [], note: parts.map(s => s.trim()).join('\n\n') };
      }
      if (json.lightCircadian && typeof json.lightCircadian === 'object') importedData.lightCircadian = json.lightCircadian;
      // Import new context fields (v2 only)
      if (json.stress && typeof json.stress === 'object') importedData.stress = json.stress;
      if (json.loveLife && typeof json.loveLife === 'object') importedData.loveLife = json.loveLife;
      if (json.environment && typeof json.environment === 'object') importedData.environment = json.environment;
      if (json.contextNotes && typeof json.contextNotes === 'string') importedData.contextNotes = json.contextNotes;
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
      saveImportedData();
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
    importedData = { entries: [], notes: [], supplements: [], healthGoals: [], diagnoses: null, diet: null, exercise: null, sleepRest: null, lightCircadian: null, stress: null, loveLife: null, environment: null, interpretiveLens: '', contextNotes: '', customMarkers: {}, menstrualCycle: null };
    localStorage.removeItem(profileStorageKey(currentProfile, 'contextHealth'));
    localStorage.removeItem(`labcharts-${currentProfile}-focusCard`);
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
      <span class="profile-label">${escapeHTML(active.name)}</span>
      <span class="profile-arrow">\u25BC</span>
    </button>
    <div class="profile-menu" id="profile-menu">`;

  for (const p of profiles) {
    const isActive = p.id === currentProfile;
    html += `<div class="profile-menu-item${isActive ? ' active' : ''}" onclick="switchProfile('${p.id}')">
      <span class="profile-name">${escapeHTML(p.name)}</span>
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
- If the user has described their sleep habits, consider how sleep quality, duration, and disorders affect lab results (e.g. poor sleep raises hs-CRP, cortisol, insulin resistance; sleep apnea affects RBC/hemoglobin; room temperature and sleep environment affect sleep quality and recovery).
- If the user has described their light and circadian habits, consider how light exposure timing, UV exposure, cold exposure, grounding, screen time, and meal timing affect lab results (e.g. morning sunlight regulates cortisol awakening response; UV drives vitamin D synthesis; blue light at night suppresses melatonin and disrupts hormone rhythms; cold exposure affects thyroid, brown fat activation, and inflammatory markers; grounding affects cortisol and inflammation; latitude affects seasonal hormone patterns).
- If the user has described their exercise habits, consider how training type and intensity may influence lab results (e.g. heavy lifting raises CK/AST/ALT, endurance training lowers resting HR and raises HDL, overtraining elevates hs-CRP/cortisol, high protein intake affects creatinine/urea/BUN).
- If the user has logged supplements or medications with date ranges, correlate their start/stop dates with biomarker changes. Note when a marker shift coincides with beginning or ending a supplement/medication, and explain known effects of that substance on relevant biomarkers.
- If the user has defined health goals, prioritize your analysis around those stated goals. Focus on major priorities first, then mild, then minor. Connect biomarker trends to the user's specific health objectives.
- If the user has specified an interpretive lens (experts and/or paradigms), consider those experts' published research and frame your analysis through the specified scientific paradigms. Use their terminology, frameworks, and perspectives when interpreting results.
- If the user has menstrual cycle data, consider the cycle phase when interpreting hormone levels (estrogen, progesterone, LH, FSH vary dramatically by phase), iron/ferritin (heavy periods deplete stores), inflammatory markers, and insulin sensitivity. Flag when blood was drawn at a suboptimal cycle phase for hormone interpretation. Recommend early follicular (days 3-5) for baseline hormone panels.
- If the user has shared their stress profile, consider how chronic stress elevates cortisol, disrupts thyroid function (TSH, T3/T4), raises inflammatory markers (hs-CRP, WBC), impairs insulin sensitivity, and suppresses immune function. Correlate stress sources and management strategies with lab trends.
- If the user has shared their love life/relationship context, consider how relationship status and satisfaction affect cortisol regulation, oxytocin levels, immune function (WBC, lymphocytes), cardiovascular markers, and chronic inflammation.
- If the user has shared their environment context, consider how environmental exposures affect lab results (e.g. air pollution raises hs-CRP and oxidative stress markers, mold exposure affects liver enzymes, heavy metals impact kidney function, climate affects vitamin D).
- If the user has provided additional context notes, consider them as supplementary information when interpreting results.
- Format responses with markdown where helpful (bold for emphasis, bullet points for lists).`;

function buildLabContext() {
  const data = getActiveData();
  if (!data.dates.length && !Object.values(data.categories).some(c => c.singleDate)) {
    return 'No lab data is currently loaded for this profile.';
  }
  const sexLabel = profileSex === 'female' ? 'female' : profileSex === 'male' ? 'male' : 'not specified';
  let ctx = `Lab data for current profile (sex: ${sexLabel}, dates: ${data.dateLabels.join(', ')}):\n\n`;
  // Medical Conditions (structured)
  const diag = importedData.diagnoses;
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
  const diet = importedData.diet;
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
  const ex = importedData.exercise;
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
  const sl = importedData.sleepRest;
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
  const lc = importedData.lightCircadian;
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
  const st = importedData.stress;
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
  const ll = importedData.loveLife;
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
  const env = importedData.environment;
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
  // Interpretive Lens (unchanged)
  const interpretiveLens = importedData.interpretiveLens || '';
  if (interpretiveLens.trim()) {
    ctx += `## Interpretive Lens\n${interpretiveLens.trim()}\n\n`;
  }
  // Additional context notes
  const ctxNotes = importedData.contextNotes || '';
  if (ctxNotes.trim()) {
    ctx += `## Additional Context Notes\n${ctxNotes.trim()}\n\n`;
  }
  const mc = importedData.menstrualCycle;
  if (mc && profileSex === 'female') {
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
  const rangeLabel = rangeMode === 'optimal' ? 'optimal' : 'reference';
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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      const safe = /^(https?:|mailto:)/.test(url) ? url : '#';
      return `<a href="${safe}" target="_blank" rel="noopener">${label}</a>`;
    });
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
  if (!hasAIProvider()) {
    showNotification("AI provider not configured. Opening settings...", "info");
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
      } catch (e) {
          if (isDebugMode()) console.error('Stream render error:', e);
          showNotification('Display error — try resending your message.', 'error');
        }
    };

    const { text: fullText, usage } = await callClaudeAPI({
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

    chatHistory.push({ role: 'assistant', content: fullText });
    saveChatHistory();
  } catch (err) {
    if (_streamRafId) { cancelAnimationFrame(_streamRafId); _streamRafId = null; }
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
