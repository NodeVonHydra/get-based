# DNA Adapter — Design Plan

## Problem

Users have genetic data (Ancestry, 23andMe, MyHeritage) sitting unused. Meanwhile, the AI chat interprets their labs without knowing *why* values might be abnormal despite good lifestyle — or why interventions aren't working. Genetics is the missing context layer between what users do and what their labs show.

## Approach

Client-side parser + curated SNP lookup table. No AI needed for parsing — the 18MB raw file is processed locally, only matched SNPs (~200-500) are stored.

### What we do

- Parse raw DNA files from any major DTC provider
- Extract clinically relevant SNPs from a curated lookup table
- Store matched genotypes in `importedData.genetics`
- Feed relevant genotypes into `buildLabContext()` for AI interpretation
- Explain gaps between lifestyle/interventions and lab results

### What we don't do

- Disease risk predictions or polygenic scores
- "You have X% chance of Y" statements
- Store or transmit the full raw file

## The Three-Leg Triangle

```
   What you DO (context cards)
        ↗              ↖
What your GENES       What your LABS
  do with it            show
```

Every SNP in the lookup table must tie to at least one of:
1. **A biomarker** — directly affects a lab value level
2. **An intervention response** — explains resistance/sensitivity to diet, supplements, lifestyle
3. **Both** — explains the gap between what users do and what their labs show

### Examples

| User says | SNP | Explains |
|-----------|-----|----------|
| "Sunbathed all summer, vit D still low" | GC rs2282679, CYP2R1 | Poor vitamin D binding/hydroxylation |
| "I eat red meat daily but ferritin is low" | TMPRSS6 rs855791 | Iron-refractory absorption |
| "I supplement B12 but levels barely move" | FUT2 rs601338, TCN2 rs1801198 | Non-secretor status, poor cellular delivery |
| "Clean diet and exercise, cholesterol still high" | APOE ε4 (rs429358+rs7412) | Genetic hyperlipidemia |
| "I take methylfolate but homocysteine won't budge" | CBS rs234706, BHMT rs3733890 | Alternate pathway bottleneck |
| "Sleep 8 hours but always exhausted" | DIO2 rs225014 | Poor T4→T3 conversion despite normal TSH |
| "Iron supplements give me overload symptoms" | HFE rs1800562 (C282Y) | Hemochromatosis carrier |
| "Omega-3 supplements don't improve my index" | FADS1 rs174546 | Poor ALA→EPA/DHA conversion |

## SNP Categories

### Tier 1 — Direct biomarker impact (start here)
- **Methylation** (MTHFR, MTR, MTRR, CBS, BHMT) → homocysteine, folate, B12
- **Iron** (HFE, TMPRSS6, TF) → ferritin, transferrin sat, serum iron
- **Lipids** (APOE, PCSK9, CETP, LIPC) → LDL, HDL, total cholesterol, triglycerides
- **Vitamin D** (GC, CYP2R1, VDR, CYP27B1) → 25(OH)D
- **Vitamin B12** (FUT2, TCN1, TCN2, CUBN) → serum B12
- **Bilirubin** (UGT1A1) → total/indirect bilirubin (Gilbert syndrome)
- **Thyroid** (DIO1, DIO2, TSHR) → T3, T4, TSH
- **Fatty acids** (FADS1, FADS2, ELOVL2) → omega-3 index, AA/EPA ratio
- **Blood sugar** (TCF7L2, PPARG, ADIPOQ) → glucose, insulin, HbA1c

### Tier 2 — Intervention response / metabolism
- **Detox enzymes** (CYP1A2, CYP2D6, CYP2C19, NAT2, GST, SOD2) → drug/supplement metabolism, caffeine sensitivity
- **Inflammation** (IL-6, TNF-α, CRP-related) → hs-CRP, inflammatory markers
- **Sex hormones** (SHBG, CYP19A1, CYP17A1) → testosterone, estradiol, SHBG
- **Cardiovascular** (Factor V Leiden, LPA) → coagulation markers

## Data Model

### SNP Lookup Table (`data/snp-health.json`)

```json
{
  "rs1801133": {
    "gene": "MTHFR",
    "variant": "C677T",
    "category": "methylation",
    "markers": ["coagulation.homocysteine"],
    "contextCards": ["diet"],
    "genotypes": {
      "CC": { "effect": "none", "note": "Normal enzyme activity" },
      "CT": { "effect": "moderate", "note": "~35% reduced activity; may elevate homocysteine" },
      "TT": { "effect": "significant", "note": "~70% reduced activity; likely elevated homocysteine; consider methylfolate over folic acid" }
    },
    "citations": ["PMID:9545397"]
  }
}
```

### Storage (`importedData.genetics`)

```json
{
  "source": "ancestry",
  "importDate": "2026-03-13",
  "snps": {
    "rs1801133": { "genotype": "CT", "gene": "MTHFR", "variant": "C677T" },
    "rs1800562": { "genotype": "CC", "gene": "HFE", "variant": "C282Y" }
  }
}
```

### AI Context

`buildLabContext()` adds a genetics section when `importedData.genetics` exists:

```
GENETICS (from Ancestry DNA):
- MTHFR C677T: CT (heterozygous) — ~35% reduced enzyme activity, may elevate homocysteine
- HFE C282Y: CC (normal) — no hemochromatosis risk
- APOE: ε3/ε4 — higher LDL cholesterol tendency
- FUT2: AG (secretor) — normal B12 absorption
```

Only include SNPs with non-"none" effects to keep context lean.

## Two Import Paths

DNA data can come in two forms — users may have one or both:

### 1. Raw data dump (client-side parser, no AI)
The TSV/CSV file with 600-700k SNPs from DTC providers. Parsed locally, matched against curated lookup table, only hits stored. Fast, private, no API cost.

### 2. PDF report (existing AI pipeline)
The lab's interpreted report — e.g., a clinical pharmacogenomics panel, a health risk report, or a specialty genetics report. Goes through the standard `parseLabPDFWithAI()` pipeline. AI extracts SNPs, risk assessments, and interpretations the lab included. May surface SNPs not in our curated list, or lab-specific calculated scores.

When both are available, they complement each other — raw data gives exact genotypes for our curated list, the PDF report adds the lab's own interpretation and any SNPs/scores we don't cover.

DNA companies sponsoring an adapter would get optimized handling for both their raw export format and their PDF report layout — same pitch as lab adapters.

## Raw Data Parser

**Web Worker** — parsing runs off the main thread to avoid UI freezing. The `File` object is passed to the Worker (free clone, just metadata), read inside the Worker via `file.text()`, and parsed there. Only the ~200 matches are posted back.

```
Main thread                              Worker
─────────                                ──────
postMessage({file, rsIds}) ──────────→  file.text()        (~100ms)
  (File clone = free)                   split lines        (~50ms)
                                        Set lookup 677k    (~100ms)
UI stays responsive          ←────────  {matches, source, coverage}
show preview                            (~few KB result)
```

Realistic total: ~300ms desktop, ~1s mobile. No streaming or chunking needed.

Key details:
- Do NOT pass the 18MB string via `postMessage` — structured clone costs ~200ms for nothing
- Use `split(/\r?\n/)` to handle both Unix and Windows line endings
- Worker is inline (Blob URL) to avoid extra file — same pattern as no-build-system codebase

Pure JS, ~100 lines. Handles:

| Provider | Delimiter | Genotype | Chromosome |
|----------|-----------|----------|------------|
| Ancestry | Tab | 2 columns (allele1, allele2) | Numeric (23=X, 24=Y, 26=MT) |
| 23andMe | Tab | 1 column (e.g., "AG") | Letter (X, Y, MT) |
| MyHeritage | CSV | 1 column | Standard |
| FTDNA | CSV | 2 columns | Standard |
| Living DNA | Tab | 1 column | Standard |

**Algorithm:**
1. Detect format from header line
2. Stream-read lines, skip `#` comments
3. For each line, check rsID against lookup table keys (Set lookup — O(1))
4. If match, store genotype
5. Report: N matched, N total, provider detected

18MB file with 677k lines → ~200-500 matches. Takes <2 seconds in browser.

No AI API call. No data leaves the device. The raw file is never stored.

## UI

- Import via existing drop zone (detect `.txt`/`.csv` DNA file by header pattern)
- Or dedicated "Import DNA" button in Settings → Profile (next to sex/DOB)
- Results shown in a "Genetics" section on dashboard or as a context card
- Detail modal for each marker shows relevant SNPs inline
- Settings shows: provider, import date, N SNPs matched, "Delete genetic data" button

## User Scenarios

### Case 1: Has raw DNA data, never analyzed it
Most DTC DNA customers download their raw file and never look at it again. The health reports from Ancestry/23andMe are surface-level and don't connect to actual lab results. User drops the file into getbased, and for the first time their genetics are interpreted alongside their real blood work and lifestyle context.

### Case 2: Got a DNA report but it was useless
User paid for a genetic health report (Promethease, Ancestry Health, etc.) but got hundreds of entries with no actionable context. Same raw data, but now interpreted through the lens of *their* labs and *their* lifestyle — which is what makes it actionable. "Your MTHFR heterozygous status" means nothing in isolation. "Your MTHFR + elevated homocysteine + your note that methylfolate isn't helping → check CBS pathway" is actionable.

### Case 3: No DNA test yet
AI chat sees a pattern in labs + context that suggests a genetic component (e.g., persistently low ferritin despite iron-rich diet, or high LDL despite clean lifestyle). The SNP lookup table doubles as a "what to test" knowledge base — AI can recommend specific SNPs to investigate and explain why. This is what happened with the user's own experience: the chat asked "have you ever taken a DNA test?", identified 4 relevant SNPs, and that conversation led to actionable insights about the underlying diagnosis.

### The current flow (broken)
AI asks about specific SNPs → user opens 700k-line file → ctrl-F for rsID → copies genotype → pastes into chat → repeat for each SNP. Painful, error-prone, and most users won't bother.

### The target flow
User drops their raw DNA file once → app extracts ~200-500 relevant SNPs in seconds → AI always has genetic context available → no manual lookup ever needed. The chat goes from "can you check rs1801133 in your file?" to "your heterozygous MTHFR C677T combined with your elevated homocysteine suggests..."

## APOE Haplotype — Special Handling

APOE is the only common health SNP that requires combining two rsIDs into a haplotype:

| rs429358 | rs7412 | Allele |
|----------|--------|--------|
| T | C | ε2 |
| T | T | ε3 |
| C | T | ε4 |

**Storage:** Raw rsIDs stored in `importedData.genetics.snps` like any other SNP. Haplotype resolved at context assembly time.

**Profile-level field:** APOE haplotype (e.g., ε3/ε4) belongs in the user profile alongside sex, DOB, and location — not buried in genetics. It fundamentally changes interpretation of lipids, inflammation, dietary fat response, and more. Stored in profile metadata, shown in profile card.

**Manual entry:** Users who know their APOE status from a doctor or separate test can set it in Settings → Profile without importing DNA data.

## Haplogroup — Ancestral Origin

Haplogroup (mitochondrial and/or Y-DNA) indicates ancestral population origin and is clinically relevant for lab interpretation:

- **Reference ranges** — some biomarkers have population-specific norms (eGFR, PSA, vitamin D baseline)
- **Disease predispositions** — thalassemia (Mediterranean), sickle cell (West African), Tay-Sachs (Ashkenazi), hemochromatosis (Northern European)
- **Nutrient metabolism** — lactase persistence (Northern European vs. global), alcohol metabolism (ALDH2 in East Asian)
- **Drug metabolism** — CYP enzyme variant frequencies cluster by population

**Profile-level field:** Haplogroup belongs in the profile alongside sex, DOB, location, and APOE. Manual entry for now — 23andMe provides haplogroups directly, Ancestry does not. Could be derived from ancestry-informative markers in the raw dump in the future, but manual is simpler to start.

**Context assembly:** `buildLabContext()` includes both at the profile level:
```
Profile: Male, 35y, Prague, Haplogroup R1b (Northern European), APOE ε3/ε4
```

This gives the AI ancestral context — e.g., "low MCV in someone of Mediterranean descent → consider thalassemia trait, not just iron deficiency" or "elevated ferritin in Northern European male → HFE hemochromatosis more likely given population prevalence."

Auto-populated from DNA import when possible, or manually set in Settings → Profile.

## End-to-End Flow

### 1. Detection
User drops a file on the dashboard. App checks:
- PDF → existing lab import pipeline
- `.txt`/`.csv` with DNA header pattern (`#AncestryDNA`, `# rsid`, `# This data file generated by 23andMe`) → DNA parser
- JSON → existing JSON import

Detection must be reliable — a misidentified CSV lab report going through the DNA parser (or vice versa) would be confusing.

### 2. Parsing + Preview
Parser runs client-side, matches rsIDs against curated lookup. Show a preview modal:

```
DNA Import — AncestryDNA (677,454 SNPs scanned)
Found 183 of 312 health-relevant SNPs

Highlights:
🔴 MTHFR C677T: C/T (heterozygous) — folate activation ~40% reduced
🔴 FUT2: G/G — non-secretor, B12 absorption reduced
🟢 HFE C282Y: C/C — no hemochromatosis risk
🟡 APOE: ε3/ε4 — higher LDL cholesterol tendency
...

129 SNPs not covered by your chip (normal — no chip tests everything)

[Cancel]  [Import 183 SNPs]
```

Preview matters even though parsing is deterministic — user should see what's being stored and have a chance to cancel. Also surfaces high-impact findings immediately.

### 3. Storage
On confirm:
- `importedData.genetics.snps` — matched rsIDs with genotypes
- `importedData.genetics.source` — provider name
- `importedData.genetics.importDate` — when imported
- `importedData.genetics.coverage` — how many curated SNPs were found vs. total curated (183/312)
- Profile fields auto-set: APOE haplotype (resolved from rs429358 + rs7412), haplogroup (if derivable)

### 4. Context Assembly — Token Budget
180 SNPs × ~20 tokens each = ~3,600 tokens. Too much to include all in every message. Strategy:

**Always include (profile-level, ~50 tokens):**
- APOE haplotype
- Haplogroup

**Include when relevant (~200-400 tokens):**
- SNPs mapped to markers the user currently has data for (via `markers` field in lookup table)
- SNPs mapped to context cards with content (via `contextCards` field)
- SNPs with "significant" or "moderate" effects only — skip "none" effects

**Include on demand:**
- Full genetics dump when user explicitly asks about genetics
- All SNPs in a category when viewing that category

This keeps the genetics context to ~200-500 tokens in normal chat, scaling up when the conversation warrants it.

### 5. Detail Modal Integration
When viewing a biomarker (e.g., homocysteine), the detail modal shows relevant SNPs below the trend section:

```
Genetic Factors:
  MTHFR C677T: C/T — ~40% reduced folate activation
  MTR A2756G: A/G — homocysteine conversion less efficient
  MTRR A66G: G/G — B12 recycling impaired
```

Only shown when genetics data exists and SNPs map to this marker.

### 6. Dashboard Genetics Section
A genetics summary card on the dashboard — similar to context cards but read-only (imported data, not user-editable). Shows:
- Source + import date
- Coverage (183/312 SNPs)
- High-impact findings grouped by category
- Link to re-import or delete

### 7. Edge Cases

**Missing SNPs:** Not all chips cover all curated SNPs. The `coverage` field tracks this. AI context should distinguish "tested negative" from "not tested" — e.g., HFE C282Y CC (clear) vs. HFE not on chip (unknown).

**Conflicting data:** User imports raw data showing MTHFR C/T, then imports a PDF report saying MTHFR C/C. Which wins? Raw data is more reliable (direct genotyping), but the conflict should be flagged.

**Multiple providers:** User has both Ancestry and 23andMe. Second import replaces first (genotypes don't change, only coverage differs). Could merge for better coverage in the future, but replace is simpler.

**Complement/strand issues:** Some providers report on opposite strands. For rsID-based lookup this shouldn't matter if the curated table specifies the expected alleles per provider, but worth testing.

**Indels and CNVs:** Raw dumps include some insertions/deletions and copy number variants. Our curated list is SNPs only — parser should silently skip non-SNP entries.

### 8. Privacy
- Raw file is never stored — only matched SNPs
- Genetic data never leaves the device (no AI call for parsing)
- Encryption covers `importedData.genetics` same as all other profile data
- "Delete genetic data" button in Settings
- Disclaimer on import: "Your DNA file is processed locally and never transmitted. Only matched health-relevant SNPs are stored."

### 9. Disclaimer
Shown on import preview and in the genetics dashboard section:

"Genetic information is provided for educational context alongside your lab results. It is not a medical diagnosis. Discuss significant findings with a healthcare provider or genetic counselor."

Similar to the existing persona disclaimer pattern — shown once, acknowledged, not nagging.

## Open Questions

- Should the lookup table be community-editable / user-extensible?
- VCF support for whole genome sequencing users?
- Merge vs. replace on second import from different provider?
- How to handle pharmacogenomics (CYP enzymes) — useful for supplement recommendations but veers into drug interaction territory

## Data Sources for Curation

1. **SNPedia** — narrative annotations, magnitude scores (CC BY-NC-SA 3.0). Zenodo snapshots available
2. **GWAS Catalog** (EBI/NHGRI) — quantitative effect sizes on biomarker traits. TSV download
3. **ClinVar** (NCBI) — pathogenicity classification. `variant_summary.txt.gz`
4. **PharmGKB** — pharmacogenomic annotations. Free after registration
5. **Genetic Genie** — reference for methylation/detox panel SNP lists

## Implementation Order

1. SNP lookup table JSON (Tier 1 categories, ~100 SNPs to start)
2. Parser (Ancestry format first — we have a test file)
3. Storage + migration
4. `buildLabContext()` integration
5. UI (import flow, dashboard section, detail modal inline)
6. Expand lookup table (Tier 2, community contributions)
