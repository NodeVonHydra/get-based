# PhenoAge (Biological Age)

PhenoAge is a calculated estimate of your biological age — how old your body appears to be based on blood markers — as opposed to your chronological age. getbased computes it automatically using the formula published by Morgan Levine et al. in 2018.

## What It Measures

PhenoAge does not replace any single biomarker. Instead, it combines nine routine blood markers into a single number that correlates with disease risk, functional decline, and mortality better than chronological age alone. In practical terms: a PhenoAge lower than your actual age suggests your biology is aging more slowly than average; a higher PhenoAge suggests the opposite.

## The Nine Biomarkers

PhenoAge is calculated from:

| Marker | Category |
|--------|----------|
| Albumin | Liver / Protein |
| Creatinine | Kidney |
| Glucose (fasting) | Metabolic |
| hsCRP (C-reactive protein) | Inflammation |
| Lymphocytes % | Immune |
| MCV (mean corpuscular volume) | Hematology |
| RDW-CV (red cell distribution width) | Hematology |
| ALP (alkaline phosphatase) | Liver |
| WBC (white blood cells) | Immune |

::: warning
PhenoAge requires **all nine markers** to be present for a given date. If any one of them is missing, no value is calculated for that draw. It also requires your **date of birth** to be set in Settings → Profile.
:::

## Where to Find It

PhenoAge appears as a marker in the **Aging** or **Calculated** category in the sidebar. Click it to open the detail view, which shows:

- Your PhenoAge at each draw date
- A **gray dashed line** representing your chronological age at the time of each draw
- The gap between the two lines — the key number to watch

## Interpreting Your Score

There is no fixed reference range for PhenoAge the way there is for, say, LDL cholesterol. What matters is the relationship between your PhenoAge and your actual age:

- **PhenoAge < chronological age** — biological age is tracking younger than calendar age
- **PhenoAge = chronological age** — biological age is roughly average
- **PhenoAge > chronological age** — biological age is tracking older than calendar age

The trend over time matters more than any single reading. Consistent improvements across multiple draws — even small ones — are meaningful.

::: tip
The markers that most strongly influence PhenoAge are CRP (inflammation) and albumin (nutrition/liver health). If your PhenoAge is higher than expected, those are often the first places to investigate.
:::

## In AI Chat

When you discuss PhenoAge in the AI chat, the AI receives your chronological age alongside the PhenoAge values and can interpret the gap, note the trend direction, and suggest which contributing markers to focus on.
