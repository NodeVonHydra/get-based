// constants.js — Option arrays, chat personalities, system prompt, country data

// ── Profile context card option arrays ──
export const COMMON_CONDITIONS = [
  'Type 2 Diabetes', 'Type 1 Diabetes', 'Pre-diabetes', 'Insulin Resistance',
  'Hypothyroidism', 'Hashimoto\'s', 'Hyperthyroidism', 'Graves\' Disease',
  'PCOS', 'Endometriosis', 'Iron Deficiency Anemia', 'B12 Deficiency',
  'Celiac Disease', 'Crohn\'s Disease', 'Ulcerative Colitis', 'IBS',
  'Fatty Liver (NAFLD)', 'Hypertension', 'High Cholesterol', 'Metabolic Syndrome',
  'Chronic Kidney Disease', 'Gout', 'Rheumatoid Arthritis', 'Lupus (SLE)',
  'Asthma', 'Sleep Apnea', 'Depression/Anxiety'
];
export const DIET_TYPES = ['omnivore', 'pescatarian', 'vegetarian', 'vegan', 'keto', 'low-carb', 'paleo', 'carnivore', 'mediterranean', 'other'];
export const DIET_RESTRICTIONS = ['gluten-free', 'dairy-free', 'nut-free', 'soy-free', 'egg-free', 'sugar-free', 'seed oil-free', 'low-sodium', 'low-FODMAP'];
export const DIET_PATTERNS = ['3 meals/day', '2 meals/day', 'IF 16:8', 'IF 18:6', 'IF 20:4', 'OMAD', 'no pattern'];
export const EXERCISE_FREQ = ['sedentary', '1-2x/week', '3-4x/week', '5-6x/week', 'daily'];
export const EXERCISE_TYPES = ['strength', 'cardio/running', 'cycling', 'swimming', 'yoga/mobility', 'walking', 'HIIT', 'sports', 'martial arts'];
export const EXERCISE_INTENSITY = ['light', 'moderate', 'intense', 'mixed'];
export const DAILY_MOVEMENT = ['sedentary desk job', 'some walking', 'active job', 'very active'];
export const SLEEP_DURATIONS = ['<5h', '5-6h', '6-7h', '7-8h', '8-9h', '9+h'];
export const SLEEP_QUALITY = ['poor', 'fair', 'good', 'excellent'];
export const SLEEP_SCHEDULE = ['consistent', 'somewhat variable', 'very irregular', 'shift work'];
export const SLEEP_ROOM_TEMP = ['cold (<18°C / 65°F)', 'cool (18-20°C / 65-68°F)', 'neutral (20-22°C / 68-72°F)', 'warm (>22°C / 72°F)'];
export const SLEEP_ISSUES = ['trouble falling asleep', 'waking at night', 'early waking', 'sleep apnea', 'snoring', 'restless legs', 'teeth grinding'];
export const SLEEP_ENVIRONMENT = ['blackout curtains', 'eye mask', 'no EMF (WiFi off)', 'grounding sheet', 'magnetico pad', 'white noise', 'earplugs', 'cool mattress'];
export const SLEEP_PRACTICES = ['mouth taping', 'CPAP', 'weighted blanket', 'evening magnesium', 'no food 3h before bed', 'cold shower before bed', 'evening walk'];
// Light & Circadian
export const LIGHT_AM = ['sunrise outdoor (10+ min)', 'sunrise outdoor (<10 min)', 'morning outdoor (after sunrise)', 'light therapy lamp', 'no AM light habit'];
export const LIGHT_DAYTIME = ['mostly outdoors', '2-4h outdoor', '1-2h outdoor', '<1h outdoor', 'mostly indoor'];
export const LIGHT_UV = ['regular sun exposure (skin)', 'midday sun when possible', 'UVB lamp', 'avoid sun / always sunscreen', 'no UV awareness'];
export const LIGHT_EVENING = ['blue blockers after sunset', 'dim lights after sunset', 'no screens 1-2h before bed', 'f.lux / night shift on devices', 'bright lights until bed', 'screen in bed'];
export const LIGHT_COLD = ['cold plunge / ice bath', 'cold shower', 'cold face immersion', 'cold ocean / lake', 'winter cold exposure', 'no cold practice'];
export const LIGHT_GROUNDING = ['barefoot on earth daily', 'grounding mat / sheet', 'barefoot occasionally', 'ocean swimming', 'no grounding practice'];
export const LIGHT_SCREEN_TIME = ['<2h', '2-4h', '4-8h', '8-12h', '12+h'];
export const LIGHT_TECH_ENV = ['multiple monitors at work', 'phone in bedroom', 'smart watch 24/7', 'work from home (all day screens)', 'TV before bed', 'gaming (evening)', 'e-reader before bed'];
export const LIGHT_MEAL_TIMING = ['eat within daylight only', 'early dinner (before 6pm)', 'late dinner (after 8pm)', 'skip breakfast', 'time-restricted eating'];
export const STRESS_LEVELS = ['low', 'moderate', 'high', 'chronic'];
export const STRESS_SOURCES = ['work', 'financial', 'relationships', 'health', 'family', 'caregiving', 'loneliness', 'major life change'];
export const STRESS_MGMT = ['meditation', 'therapy', 'exercise', 'nature', 'breathing exercises', 'journaling', 'social support', 'none'];
export const LOVE_STATUS = ['single', 'dating', 'in relationship', 'married', 'divorced/separated', 'widowed', 'it\'s complicated'];
export const LOVE_SATISFACTION = ['very satisfied', 'satisfied', 'neutral', 'unsatisfied', 'not applicable'];
export const LOVE_LIBIDO = ['high', 'normal', 'low', 'very low', 'variable'];
export const LOVE_FREQUENCY = ['daily', 'few times/week', 'weekly', 'few times/month', 'monthly', 'rarely', 'none'];
export const LOVE_ORGASM = ['consistently', 'usually', 'sometimes', 'rarely', 'never', 'not applicable'];
export const LOVE_RELATIONSHIP = ['supportive & secure', 'mostly good', 'strained', 'conflicted', 'emotionally distant', 'codependent', 'new & exciting'];
export const LOVE_CONCERNS = ['low desire', 'erectile issues', 'pain during sex', 'performance anxiety', 'mismatched libido', 'hormonal changes', 'medication side effects', 'body image', 'trust issues', 'communication problems'];
export const ENV_SETTING = ['urban city center', 'urban residential', 'suburban', 'rural', 'near ocean/lake', 'mountain/altitude', 'island'];
export const ENV_CLIMATE = ['tropical', 'dry/arid', 'temperate', 'cold/northern', 'Mediterranean', 'monsoon/humid'];
export const ENV_WATER = ['spring water', 'well water', 'reverse osmosis', 'filtered (carbon)', 'tap water (unfiltered)', 'deuterium-depleted', 'distilled', 'bottled'];
export const ENV_WATER_CONCERNS = ['fluoridated', 'chlorinated', 'hard water', 'unknown source quality'];
export const ENV_EMF = ['WiFi router in bedroom', 'WiFi router nearby', 'smart meter on home', 'cell tower <500m', 'cell tower <2km', 'Bluetooth always on', '5G dense area', 'high-voltage power lines nearby', 'dirty electricity (old wiring)', 'smart home devices'];
export const ENV_EMF_MITIGATION = ['WiFi off at night', 'airplane mode sleep', 'wired ethernet', 'EMF meters used', 'faraday canopy', 'no smart meter', 'minimal Bluetooth'];
export const ENV_HOME_LIGHT = ['mostly LED lighting', 'incandescent bulbs', 'full-spectrum bulbs', 'fluorescent/CFL', 'natural daylight (large windows)', 'mixed lighting'];
export const ENV_AIR = ['HEPA air purifier', 'open windows daily', 'houseplants', 'air quality monitor', 'near highway/traffic', 'industrial area nearby', 'wildfire smoke region', 'high pollen area'];
export const ENV_TOXINS = ['mold exposure', 'heavy metals (lead/mercury)', 'pesticide exposure', 'plastic containers for food', 'non-stick cookware (PFAS)', 'conventional cleaning products', 'new car/furniture off-gassing', 'amalgam dental fillings', 'BPA/phthalate exposure', 'organic food mostly'];
export const ENV_BUILDING = ['new construction (<5yr)', 'old building (pre-1970)', 'concrete/steel', 'wood frame', 'natural materials', 'carpet (VOCs)', 'hardwood/tile floors'];

// ── Menstrual cycle symptoms ──
export const PERIOD_SYMPTOMS = [
  'Cramps', 'Mood swings', 'Fatigue', 'Bloating', 'Headache',
  'Acne', 'Breast tenderness', 'Insomnia', 'Back pain', 'Nausea'
];

// ── Country/Latitude data ──
export const COUNTRY_LATITUDES = {
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
export const LATITUDE_BANDS = ['<25° latitude (tropical)', '25-40° (subtropical)', '40-50° (temperate)', '50-60° (northern)', '>60° (subarctic)'];

// ── Import steps ──
export const IMPORT_STEPS = [
  "Extracting text from PDF",
  "Protecting personal information",
  "AI analyzing lab report",
  "Preparing preview"
];

// ── Chat personalities & system prompt ──
export const CHAT_PERSONALITIES = [
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

export const CHAT_SYSTEM_PROMPT = `You are an AI lab analyst assistant integrated into a blood work dashboard application called LabCharts. You help users understand their lab results.

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
