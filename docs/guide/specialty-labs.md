# Specialty Labs

Beyond standard blood work, getbased supports specialty lab tests. Three test types have dedicated support with built-in marker definitions; any other lab report goes through the generic custom marker pipeline where the AI extracts everything from your PDF.

## Supported Test Types

### Dedicated support

| Test Type | Examples | Built-in Markers |
|---|---|---|
| **DEXA Scan** | Hologic, GE Lunar Prodigy | 17 markers across 2 categories |
| **Metabolomix+** | Genova Metabolomix+ combo profiles | 165 markers across 10 categories |
| **Fatty Acids** | Spadia, ZinZino BalanceTest, OmegaQuant | 29 reference markers |

### Generic support (custom marker pipeline)

Any other specialty lab report can be imported — the AI extracts marker names, units, and reference ranges directly from your PDF. No built-in definitions needed.

Examples: DUTCH hormone panels, Hair Tissue Mineral Analysis (HTMA), GI-MAP, standalone OAT, and any other lab report.

## DEXA Scans

DEXA (dual-energy X-ray absorptiometry) results are organized under a collapsible **DEXA** sidebar group with two categories:

**Body Composition** (8 markers)

| Marker | Unit | Notes |
|---|---|---|
| Body Fat | % | Sex-specific reference and optimal ranges |
| Lean Mass | kg | Trend-only (no universal reference) |
| Fat Mass | kg | Trend-only |
| BMI (DEXA) | kg/m² | WHO classification (18.5–24.9) |
| Android Fat | % | Abdominal region |
| Gynoid Fat | % | Hip/thigh region |
| A/G Fat Ratio | ratio | Above 1.0 = higher cardiometabolic risk |
| Visceral Fat Area | cm² | Below 100 cm² = normal |

**Bone Density** (9 markers)

| Marker | Unit | Notes |
|---|---|---|
| BMD Spine L1–L4 | g/cm² | Trend-only |
| BMD Femur Total | g/cm² | Trend-only |
| BMD Femur Neck | g/cm² | WHO diagnostic site |
| T-score Spine | score | WHO: above −1 normal, −1 to −2.5 osteopenia, below −2.5 osteoporosis |
| T-score Femur Total | score | Same WHO criteria |
| T-score Femur Neck | score | WHO-preferred hip site |
| Z-score Spine | score | Age-matched; below −2.0 = low for age |
| Z-score Femur Total | score | Same criteria |
| Z-score Femur Neck | score | Same criteria |

::: tip Tracking over time
DEXA scans are typically repeated annually. Each import adds a new data point, giving you trend charts for body composition and bone density changes over time — the same way blood work trends are tracked.
:::

## Fatty Acid Labs

Fatty acid tests are grouped by the product or lab that produced them. Each lab appears as its own subcategory under a **Fatty Acids** sidebar group, so results from different labs are never mixed together.

**Auto-detected labs:**

| Lab / Product | Detection |
|---|---|
| **Spadia** | PDF content or filename |
| **ZinZino** (BalanceTest) | PDF content or filename |
| **OmegaQuant** (Basic/Plus/Complete, Ayumetrix) | PDF content or filename |

Other fatty acid labs are also supported — the AI identifies the lab name from the report and creates a product-specific category automatically.

::: tip Comparing across labs
Even though results from different fatty acid labs appear in separate subcategories, the AI chat can compare and interpret results across all your fatty acid tests in a single conversation.
:::

## Metabolomix+

Genova Metabolomix+ imports create multiple subcategories under an **OAT** sidebar group:

| Category | Markers | Examples |
|---|---|---|
| Microbial Overgrowth | 14 | Citramalic acid, HPHPA, arabinose |
| Metabolic | 22 | Lactic, pyruvic, succinic, citric acid |
| Neurotransmitters | 14 | HVA, VMA, quinolinic acid |
| Nutritional & Detox | 24 | Methylmalonic, glutathione markers |
| Amino Acids & Lipids | 18 | Urine amino acids, fatty acid metabolites |
| Urine Amino Acids | 21 | Arginine, taurine, glycine |
| Urine Amino Metabolites | 18 | Methylhistidine, sarcosine |
| Toxic Elements | 18 | Lead, mercury, arsenic, cadmium |
| Nutrient Elements | 14 | Selenium, zinc, calcium, magnesium |
| Oxidative Stress | 2 | Lipid peroxides, 8-OHdG |

## How It Works

1. **Drop your PDF** on the dashboard — same as any other import
2. **AI detects the test type** — the AI reads the report and identifies whether it's blood work, OAT, DUTCH, or another type
3. **Markers are mapped** with test-type-prefixed categories (e.g., `oatNutritional`, `dutchHormones`) to keep specialty results separate from standard blood markers
4. **Reference ranges come from your PDF** — the AI extracts the lab's stated ranges rather than using built-in defaults
5. **Review and confirm** in the import preview, then your results appear in charts

::: tip Your lab's reference ranges
Unlike standard blood markers that use built-in reference ranges, specialty markers use the ranges printed on your specific lab report. This means your charts reflect the ranges your lab considers normal.
:::

## Custom Marker Pipeline

Specialty markers flow through the [custom marker](./custom-markers.md) pipeline. For each marker the AI extracts:

- A **key** with a test-type-prefixed category (e.g., `oatMicrobial.someMarker`)
- A **name** in plain English
- The **unit** of measurement
- **Reference ranges** from the lab report
- A **group** tag (e.g., "OAT", "DUTCH") for sidebar organization

These are created automatically during import — no manual setup required.

## Sidebar Grouping

Specialty categories appear under collapsible group headers in the sidebar. For example, an OAT import creates categories like "Microbial Overgrowth", "Nutritional Markers", and "Oxalate Markers" — all grouped under an **OAT** header you can expand or collapse.

Click the group header to toggle visibility. Collapse state is remembered across sessions.

## Importing Multiple Specialty Tests

If you import multiple reports of the same test type over time, the markers are matched to existing custom marker definitions. This gives you trend tracking across specialty labs just like standard blood work.

For fatty acid tests, each lab stays in its own subcategory — importing a ZinZino report won't merge with your Spadia results. Re-importing a PDF updates the category labels if they were incorrect from a previous import.

::: warning Model consistency
Use the same AI model for all imports of a given test type. Different models may generate different marker keys for the same test, which prevents proper trend tracking. See [AI Providers](./ai-providers.md#model-consistency) for details.
:::
