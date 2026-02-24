# Context Assembly

How user-provided data becomes AI prompts. This is the core intelligence layer — every AI feature is only as good as the context it receives.

## The Big Picture

```
                           ┌─────────────────────────────────────────┐
                           │           7 AI FEATURES                 │
                           │                                         │
                           │  Chat  Focus  Health  PDF   Persona     │
                           │  Panel Card   Dots    Import Generator  │
                           │  Per-Marker AI   Correlation AI         │
                           └────────────┬────────────────────────────┘
                                        │
                                        ▼
                              ┌──────────────────┐
                              │  callClaudeAPI() │  ← single entry point
                              │     api.js       │
                              └────────┬─────────┘
                                       │
                    ┌──────────┬───────┴────────┬──────────┐
                    ▼          ▼                ▼          ▼
               Anthropic   OpenRouter       Venice     Ollama
               Messages    (OpenAI-compat)  (OpenAI)   /api/chat
               API + SSE   via shared       via shared  newline-
                           helper           helper      delimited
```

Every AI call passes the same shape: `{ system, messages, maxTokens, onStream? }`. The caller assembles the prompt; the router just delivers it.

## Data Sources

Everything the AI can know about the user comes from these sources:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER DATA SOURCES                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PROFILE                    CONTEXT CARDS (9)      LAB DATA         │
│  ├─ sex                     ├─ Health Goals         ├─ entries[]    │
│  ├─ DOB                     ├─ Medical Conditions   ├─ dates[]      │
│  └─ location/latitude       ├─ Diet                 ├─ marker values│
│                             ├─ Exercise             ├─ ref ranges   │
│  PERSONA                    ├─ Sleep & Rest         ├─ optimal ranges│
│  ├─ personality ID          ├─ Light & Circadian    ├─ phase ranges │
│  ├─ promptText              ├─ Stress               ├─ custom markers│
│  └─ evidenceBased flag      ├─ Love Life            └─ flagged results│
│                             └─ Environment                          │
│  CHAT                                                               │
│  ├─ user message            OTHER                                   │
│  └─ last 10 history msgs    ├─ Interpretive Lens                   │
│                             ├─ Context Notes                        │
│  MARKER SCHEMA              ├─ Menstrual Cycle                      │
│  ├─ MARKER_SCHEMA           ├─ Supplements                          │
│  └─ customMarkers           └─ User Notes                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## buildLabContext() — The Central Serializer

`buildLabContext()` in `chat.js` is the single function that converts all user data into a plain-text block. It is used by 3 of the 7 AI features (Chat, Focus Card, Health Dots). The others build specialized prompts.

### Output Structure

```
Lab data for current profile (sex: female, dates: Jan 15, Feb 20, Mar 10):

## Medical Conditions / Diagnoses       ←── from importedData.diagnoses
- Hashimoto's (major, since 2020)
Notes: On levothyroxine 50mcg

## Diet                                 ←── from importedData.diet
Type: Mediterranean. Pattern: 3 meals.
Breakfast (07:00): eggs, avocado
Lunch (12:30): salad with chicken
Dinner (19:00): salmon, vegetables

## Exercise & Movement                  ←── from importedData.exercise
Frequency: 4x/week. Types: weights, yoga. Intensity: moderate.

## Sleep & Rest                         ←── from importedData.sleepRest
Duration: 7-8h. Quality: good. Room temp: 65°F.
Environment: blackout curtains, grounding sheet.

## Light & Circadian                    ←── from importedData.lightCircadian
Morning light: 15min. UV exposure: moderate. Latitude: 40-50°N.

## Stress                               ←── from importedData.stress
Level: moderate. Sources: work, finances.

## Love Life & Sexual Health             ←── from importedData.loveLife
Status: partnered. Relationship quality: good. Libido: normal.

## Environment                          ←── from importedData.environment
Water: filtered. EMF: wifi router. Home lighting: mixed.

## Health Goals (Things to Solve)        ←── from importedData.healthGoals
### Major Priority
- Optimize thyroid function
### Mild Priority
- Improve sleep quality

## Interpretive Lens                     ←── from importedData.interpretiveLens
Jack Kruse, functional medicine paradigm

## Additional Context Notes              ←── from importedData.contextNotes
Started cold plunges in January

## Menstrual Cycle                       ←── from importedData.menstrualCycle
Profile: 28-day cycle (5-day period), regular, moderate flow.     (female only)
Recent periods: Jan 3-Jan 7 (moderate) [Cramps, Fatigue], ...
Blood draw cycle context:
- Jan 15: Day 13 (follicular phase)
- Feb 20: Day 18 (luteal phase)
Next optimal blood draw window: Mar 3-5

## Supplements & Medications             ←── from importedData.supplements
- Vitamin D3 (5000 IU) [supplement]: Jan 1 → ongoing
- Magnesium glycinate (400mg) [supplement]: Jan 15 → ongoing

Note: status labels below use reference ranges.

## Biochemistry                          ←── from getActiveData().categories
- Glucose: Jan 15: 5.2, Feb 20: 5.0, Mar 10: 4.9 mmol/L (ref: 3.9–5.6, status: normal)
- Creatinine: Jan 15: 72, Feb 20: 70 µmol/L (ref: 53–97, status: normal)

## Hormones
- Estradiol: Jan 15: 180 [follicular, ref 77–921], Feb 20: 95 [luteal, ref 65–380] pmol/L
  ↑ phase-aware: each value shows its cycle phase + phase-specific ref range

## Flagged Results (Latest)              ←── from getAllFlaggedMarkers()
- Ferritin: 12 µg/L (LOW, range: 15–200)

## User Notes                           ←── from importedData.notes
- Jan 10: Started new thyroid medication
- Feb 15: Feeling much better energy-wise
```

### Data Flow Diagram

```
importedData (localStorage)
         │
         ├─── .diagnoses ──────────────────────────────────┐
         ├─── .diet ───────────────────────────────────────┤
         ├─── .exercise ───────────────────────────────────┤
         ├─── .sleepRest ──────────────────────────────────┤
         ├─── .lightCircadian ─── + getLatitudeFromLocation()
         ├─── .stress ─────────────────────────────────────┤
         ├─── .loveLife ───────────────────────────────────┤
         ├─── .environment ────────────────────────────────┤
         ├─── .healthGoals ────────────────────────────────┤
         ├─── .interpretiveLens ───────────────────────────┤
         ├─── .contextNotes ───────────────────────────────┤
         ├─── .menstrualCycle ─── + helper functions ──────┤
         │     ├─ getCyclePhase()                          │
         │     ├─ getBloodDrawPhases()                     │
         │     ├─ getNextBestDrawDate()                    │
         │     ├─ detectPerimenopausePattern()             │
         │     └─ detectCycleIronAlerts()                  │
         ├─── .supplements ────────────────────────────────┤
         ├─── .notes ──────────────────────────────────────┤
         └─── .entries ──┐                                 │
                         ▼                                 │
                  getActiveData()                          │
                    │                                      │
                    ├─── categories[].markers[]             │
                    │     ├─ values[] (per date)            │
                    │     ├─ refMin/refMax                  │
                    │     ├─ phaseRefRanges[] (female)      │
                    │     └─ phaseLabels[] (female)         │
                    │                                      │
                    └─── getAllFlaggedMarkers() ────────────┤
                                                           │
                                                           ▼
                                                  buildLabContext()
                                                       │
                                                       ▼
                                                  plain text block
```

## Prompt Composition Per Feature

### 1. Chat Panel (`sendChatMessage`)

The most complex composition — layers 4 components:

```
┌──────────────────────────────────────────────────────┐
│                    SYSTEM PROMPT                      │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ CHAT_SYSTEM_PROMPT (constants.js)              │  │
│  │ 15 conditional guidelines:                     │  │
│  │  • notes → consider medication/supplement      │  │
│  │  • diagnoses → explain biomarker connections   │  │
│  │  • diet → consider nutritional influence       │  │
│  │  • sleep → consider recovery/inflammation      │  │
│  │  • light → consider circadian/vitamin D        │  │
│  │  • exercise → consider CK/AST/cortisol         │  │
│  │  • supplements → correlate start/stop dates    │  │
│  │  • health goals → prioritize by severity       │  │
│  │  • interpretive lens → frame through experts   │  │
│  │  • menstrual cycle → phase-aware hormones      │  │
│  │  • stress → cortisol/thyroid/inflammation      │  │
│  │  • love life → cortisol/oxytocin/immune        │  │
│  │  • environment → pollution/mold/metals         │  │
│  │  • context notes → supplementary info          │  │
│  │  • markdown formatting                         │  │
│  └────────────────────────────────────────────────┘  │
│                       +                              │
│  ┌────────────────────────────────────────────────┐  │
│  │ PERSONALITY LAYER                              │  │
│  │  • Default: (nothing added)                    │  │
│  │  • Dr. House: personality.promptAddition       │  │
│  │  • Custom: "Persona: {promptText}"             │  │
│  │    + evidence-based disclaimer if opted in     │  │
│  └────────────────────────────────────────────────┘  │
│                       +                              │
│  ┌────────────────────────────────────────────────┐  │
│  │ SEARCH INSTRUCTION (optional)                  │  │
│  │  "After your response, output SEARCH_TERMS:    │  │
│  │   followed by 2-3 medical search terms"        │  │
│  │  (only when OpenAlex sources enabled)          │  │
│  └────────────────────────────────────────────────┘  │
│                       +                              │
│  ┌────────────────────────────────────────────────┐  │
│  │ "Current lab data:\n"                          │  │
│  │ buildLabContext()  ← entire serialized context │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
├──────────────────────────────────────────────────────┤
│                    MESSAGES                           │
│                                                      │
│  Last 10 chat history entries (role + content)       │
│  + current user message                              │
│                                                      │
├──────────────────────────────────────────────────────┤
│  maxTokens: 4096  │  streaming: yes                  │
└──────────────────────────────────────────────────────┘
```

### 2. Focus Card (`loadFocusCard`)

Minimal prompt — just asks for one sentence:

```
┌──────────────────────────────────────────────────────┐
│  SYSTEM: "You are a blood work analyst. Respond      │
│  with exactly ONE sentence, max 40 words. Name the   │
│  single most important marker finding, its direction  │
│  (rising/falling/high/low), and briefly why it        │
│  matters clinically. No preamble, no disclaimer."     │
├──────────────────────────────────────────────────────┤
│  USER: buildLabContext()                              │
├──────────────────────────────────────────────────────┤
│  maxTokens: 100  │  streaming: no  │  timeout: 15s   │
├──────────────────────────────────────────────────────┤
│  CACHE: fingerprint = hash(entries + sex + DOB +      │
│         all 9 cards + lens + notes + cycle + supps)   │
└──────────────────────────────────────────────────────┘
```

### 3. Context Card Health Dots (`loadContextHealthDots`)

Requests structured JSON for only the stale (changed) cards:

```
┌──────────────────────────────────────────────────────┐
│  SYSTEM: "Based on this person's lab data and        │
│  profile context, assess each profile area.           │
│  Return ONLY valid JSON with these keys..."           │
│                                                      │
│  { "diet": {"dot":"...","tip":"..."},                │
│    "stress": {"dot":"...","tip":"..."} }    ← only   │
│                                               stale  │
│  Dot: green/yellow/red/gray                  cards   │
│  Tip: max 12 words, reference specific markers       │
├──────────────────────────────────────────────────────┤
│  USER: buildLabContext()                              │
├──────────────────────────────────────────────────────┤
│  maxTokens: 500  │  streaming: no  │  timeout: 20s   │
├──────────────────────────────────────────────────────┤
│  CACHE: per-card fingerprint via getCardFingerprint() │
│         only stale cards re-fetched                   │
└──────────────────────────────────────────────────────┘
```

### 4. PDF Import (`parseLabPDFWithAI`)

Completely different context — no user profile, just schema + raw PDF:

```
┌──────────────────────────────────────────────────────┐
│  SYSTEM: "You are a lab report data extraction       │
│  assistant..."                                        │
│                                                      │
│  + JSON.stringify(buildMarkerReference())             │
│    { "biochemistry.glucose": { name, unit, ref },    │
│      "hormones.testosterone": { ... },               │
│      ... all known + custom markers }                 │
│                                                      │
│  + extraction rules (date format, value parsing,     │
│    WBC differential, custom marker suggestions)       │
│                                                      │
│  + expected JSON output schema                        │
├──────────────────────────────────────────────────────┤
│  USER: "Extract all biomarker results from this      │
│  lab report:\n\n" + pdfText (PII-scrubbed)           │
├──────────────────────────────────────────────────────┤
│  maxTokens: 8192  │  streaming: no                   │
└──────────────────────────────────────────────────────┘
```

### 5. Persona Generator (`generateCustomPersonality`)

Standalone creative prompt — no lab data involved:

```
┌──────────────────────────────────────────────────────┐
│  SYSTEM: "You are a persona designer for Get Based.  │
│  Create a thorough persona covering:"                 │
│    1. Identity & Background                           │
│    2. Communication Style                             │
│    3. Medical & Health Philosophy                     │
│    4. Analytical Approach                             │
│    5. Lifestyle & Optimization Lens                   │
│    6. Character & Personality                         │
│    7. Signature Recommendations                       │
│  "400-500 words. No disclaimers."                     │
├──────────────────────────────────────────────────────┤
│  USER: "Create a comprehensive persona for: {name}"  │
├──────────────────────────────────────────────────────┤
│  maxTokens: 2048  │  streaming: yes (into textarea)  │
└──────────────────────────────────────────────────────┘
```

### 6. Per-Marker AI (`askAIAboutMarker`)

Not a separate API call — builds a user message and injects it into the chat panel, which then flows through the Chat Panel composition (feature 1):

```
askAIAboutMarker("hormones.estradiol")
         │
         ▼
  "Tell me about my Estradiol results.
   Values: Jan 15: 180 pmol/L (follicular phase, ref 77–921),
           Feb 20: 95 pmol/L (luteal phase, ref 65–380).
   Reference range: 77–921 pmol/L. Optimal range: 200–400.
   Current status: normal.
   Note: reference ranges shown are phase-specific.
   What does this mean and should I be concerned?"
         │
         ▼
  openChatPanel(prompt) → sendChatMessage() → full Chat composition
```

## Caching Strategy

Each AI feature has independent caching to avoid redundant API calls:

| Feature | Cache Key | Fingerprint Inputs | Invalidation |
|---|---|---|---|
| Focus Card | `labcharts-{profile}-focusCard` | entries + sex + DOB + 9 cards + lens + notes + cycle + supps | Any data change |
| Health Dots | `labcharts-{profile}-contextHealth` | Per-card: lab data + card data + sex + DOB | Only changed cards re-fetched |
| Chat | `labcharts-{profile}-chat-t_{id}` | N/A (conversation history) | Never invalidated, 50-thread cap |
| PDF Import | N/A | N/A | No caching |
| Persona | N/A | N/A | No caching (user saves manually) |

## Token Budget

| Feature | maxTokens | Typical System Prompt Size |
|---|---|---|
| Chat | 4096 | ~2,000–8,000 tokens (scales with data) |
| Focus Card | 100 | ~2,000–8,000 tokens (same context) |
| Health Dots | 500 | ~2,000–8,000 tokens (same context) |
| PDF Import | 8192 | ~1,000–3,000 tokens (marker schema) |
| Persona Generator | 2048 | ~400 tokens (fixed) |

The system prompt for Chat/Focus/Dots grows with the amount of user data. A profile with many markers across many dates + all 9 context cards filled + supplements + notes + cycle data can produce a large context block.

## Key Design Decisions

1. **Single serializer**: `buildLabContext()` is the only function that knows how to serialize user data. Three features share it. This means improvements to context quality benefit all three at once.

2. **System prompt, not user message**: Lab context is appended to the system prompt (not sent as a user message) for Chat. For Focus Card and Health Dots, it's sent as the user message with a minimal system prompt.

3. **Always-on guidelines**: `CHAT_SYSTEM_PROMPT` includes all 15 conditional guidelines even when the corresponding data is empty. The AI simply ignores irrelevant ones. This avoids dynamic prompt construction complexity.

4. **Personality is additive**: The persona layer is concatenated after the base system prompt. It can override tone and style but cannot remove the safety guidelines.

5. **Phase-aware values**: For female profiles with cycle data, estradiol and progesterone values include per-date phase labels and phase-specific reference ranges inline — the AI sees exactly which phase each blood draw fell in.

6. **Flagged results summary**: Redundant with the per-marker values above, but gives the AI a quick "what's wrong" summary without parsing all categories.

## Source Files

| File | Key Functions |
|---|---|
| `js/constants.js` | `CHAT_SYSTEM_PROMPT` — base system prompt with 15 guidelines |
| `js/chat.js` | `buildLabContext()` — central serializer |
| `js/chat.js` | `sendChatMessage()` — chat prompt composition |
| `js/chat.js` | `askAIAboutMarker()` — per-marker prompt builder |
| `js/chat.js` | `generateCustomPersonality()` — persona generator prompt |
| `js/views.js` | `loadFocusCard()` — focus card prompt |
| `js/context-cards.js` | `loadContextHealthDots()` — health dots prompt |
| `js/pdf-import.js` | `parseLabPDFWithAI()` — PDF import prompt |
| `js/pdf-import.js` | `buildMarkerReference()` — marker schema serializer |
| `js/api.js` | `callClaudeAPI()` — provider router |
| `js/data.js` | `getActiveData()` — data pipeline (feeds buildLabContext) |
