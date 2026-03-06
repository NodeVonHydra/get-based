# EMF Assessment Sub-Module — Implementation Plan

## Overview

Baubiologie / Building Biology EMF assessment sub-module under the Environment context card. Users can upload consultant reports (PDF → AI extraction) or manually enter room-by-room measurements. Auto-severity ratings based on SBM-2015 standard. Rich EMF context feeds into AI chat for health correlation.

Consultants get a downloadable template (printable + fillable) — they don't need to use getbased.

## Data Schema

```js
// importedData.emfAssessment
{
  assessments: [
    {
      id: 'emf_1709740800000',        // 'emf_' + Date.now()
      date: '2026-03-06',
      label: 'Pre-mitigation',         // optional
      consultant: '',                   // optional
      rooms: [
        {
          name: 'Bedroom',
          location: 'bed pillow area',  // optional
          measurements: {
            acElectric:       { value: 28,   unit: 'V/m',   meter: 'NFA1000' },
            acMagnetic:       { value: 45,   unit: 'nT',    meter: null },
            rfMicrowave:      { value: 3.2,  unit: 'µW/m²', meter: 'HF59B' },
            dirtyElectricity: { value: 85,   unit: 'GS',    meter: null },
            dcMagnetic:       { value: 3,    unit: 'µT',    meter: null }
          },
          sources: ['WiFi router', 'smart meter on wall'],
          mitigations: ['kill switch installed'],
          note: ''
        }
      ],
      note: ''
    }
  ]
}
```

## SBM-2015 Thresholds (Sleeping Areas)

| Type | Unit | No Concern | Slight | Severe | Extreme |
|---|---|---|---|---|---|
| AC Electric Fields (body voltage) | V/m | < 1 | 1–5 | 5–50 | > 50 |
| AC Magnetic Fields | nT | < 20 | 20–100 | 100–500 | > 500 |
| RF/Microwave | µW/m² | < 0.1 | 0.1–10 | 10–1,000 | > 1,000 |
| Dirty Electricity | GS | < 25 | 25–50 | 50–200 | > 200 |
| DC Magnetic Deviation | µT | < 1 | 1–5 | 5–20 | > 20 |

Stored as `SBM_2015_THRESHOLDS` in `schema.js` with `getEMFSeverity(type, value)` helper.

## UI/UX

### Entry point
Sub-section under Environment card editor → "Baubiologie EMF Assessment" with summary + button to open full editor.

### EMF Assessment Editor (modal)
- Import PDF button + mini drop zone
- Add Assessment button
- Assessment timeline (most recent first), each showing date, label, consultant, worst severity badge
- Expanded assessment: room cards with measurement inputs, severity dots, source/mitigation tag pills
- Room presets: Bedroom, Children's Room, Living Room, Kitchen, Office, Nursery, Bathroom, Basement, Outdoor

### Dashboard summary
Environment card shows: "EMF: 2 assessments (latest: Mar 2026, Slight concern)"

## PDF Import Flow

Separate from lab PDF pipeline — dedicated button in EMF editor:

1. User clicks "Import PDF" in EMF editor
2. `extractPDFText(file)` (reused from pdf-import.js)
3. PII obfuscation (consultant reports contain client name/address)
4. `parseEMFReportWithAI(pdfText)` — EMF-specific prompt with measurement schema
5. Import preview with room-by-room severity dots
6. Confirm → saved to `importedData.emfAssessment.assessments[]`

AI handles unit conversions: 1 mG = 100 nT, 1 mW/m² = 1000 µW/m², V/m → µW/m² via P = E²/377.

## Template

`data/emf-assessment-template.html` — static fillable/printable HTML:

- Client info, date, consultant, purpose
- Per-room table: 5 measurement rows with value/unit/meter/SBM rating checkboxes
- Sources checklist + blanks
- Mitigations checklist + blanks
- SBM-2015 reference table in footer
- `@media print` CSS for clean printing

## AI Context Serialization

In `buildLabContext()`, inside the Environment section:

```
### EMF Assessment (Baubiologie SBM-2015)
Assessment: Mar 6, 2026 (Pre-mitigation) by [consultant]
  Bedroom (bed pillow area):
    AC Electric Fields: 28 V/m — Severe concern
    AC Magnetic Fields: 45 nT — Slight concern
    RF/Microwave: 3.2 µW/m² — Slight concern
    Sources: WiFi router, smart meter
    Mitigations: kill switch installed
```

Latest assessment shown in full; older ones summarized as one line.

## Files to Modify

| File | Changes |
|---|---|
| `js/schema.js` | `SBM_2015_THRESHOLDS`, `getEMFSeverity()` |
| `js/constants.js` | `EMF_ROOM_PRESETS`, `EMF_SOURCES`, `EMF_MITIGATIONS` |
| `js/state.js` | `emfAssessment: null` in importedData |
| `js/emf.js` (NEW) | Editor, PDF import, severity rendering, save/load |
| `js/context-cards.js` | EMF sub-section in Environment editor, summary update |
| `js/chat.js` | `buildLabContext()` EMF serialization |
| `js/export.js` | Export/import/clear paths |
| `js/profile.js` | Migration guard |
| `js/main.js` | Import emf.js |
| `index.html` | Script tag |
| `styles.css` | `.emf-*` styles |
| `data/emf-assessment-template.html` (NEW) | Consultant template |
| `tests/test-emf.js` (NEW) | Threshold logic, data shape, context serialization |
| `CLAUDE.md` | Architecture docs |

## Implementation Order

1. **Foundation**: schema thresholds, constants, state defaults, migration guard, tests
2. **Core module**: `emf.js` — editor UI, room CRUD, measurement inputs, severity dots
3. **Integration**: Environment card sub-section, `buildLabContext()`, export/import
4. **PDF import**: AI parser, preview, drop zone in editor
5. **Template**: Printable/fillable HTML for consultants
6. **Polish**: main.js import, index.html, CLAUDE.md, version bump, changelog
