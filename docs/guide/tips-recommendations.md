# Tips & Recommendations

Tips & Recommendations provides actionable guidance on your biomarkers — what lifestyle changes, foods, and supplements may help, backed by linked PubMed studies.

## Philosophy

Recommendations follow a strict priority order:

1. **Nature** (best option) — sunlight, cold exposure, grounding, sleep, circadian alignment
2. **Whole Food** — dietary sources that address the marker naturally
3. **Tools** — products that support natural interventions (light panels, cold plunge, grounding mat)
4. **Supplements** (last resort) — specific forms when lifestyle and food aren't enough

The guiding principle: if the body makes it, support production rather than supplementing directly.

## Where Tips Appear

Tips show up in three places:

- **Detail modal** — open any marker and scroll to "What can help" below the chart
- **AI Chat** — when the AI recommends supplementation, a collapsible "What can help" section appears below the response
- **Context cards** — lifestyle cards (Sleep, Light, Environment, etc.) show a "Tips" badge linking to relevant guidance

## Study References

Every supplement form links to a primary study (typically a systematic review or meta-analysis) on PubMed. Click **(study)** next to any form to read the evidence.

If you find a better study or spot an error, click **Suggest a better study** at the bottom of any recommendation section. This opens a pre-filled GitHub issue.

## First-Time Disclosure

The first time you view recommendations, a disclosure banner appears explaining that suggestions are informational, not medical advice. Recommendations are hidden until you acknowledge this by clicking **Got it**. This only happens once.

## Enabling / Disabling

Tips & Recommendations can be toggled on or off in **Settings > Display**. When disabled, no tips, badges, or recommendation sections appear anywhere in the app.

## DNA-Aware Recommendations

If you have [DNA data](/guide/dna-import) loaded, recommendations become genetics-aware. A **YOUR GENETICS** section appears above the tiers showing relevant SNP results and how they affect supplement choices — for example, MTHFR variants that suggest methylfolate over folic acid.

## What's Not Included

- No dosing recommendations — consult your healthcare provider
- No product images or marketing language
- No tracking of which links you click
- Iron supplements are always marked "only if deficient"
- Compounds the body produces naturally (DHEA, glutathione, melatonin) are flagged or replaced with precursor support

## Data Source

The recommendation catalog is a curated JSON file (`data/recommendations-czsk.json`) with 80 slots covering biomarkers and lifestyle areas. Each slot includes free actions, food sources, supplement forms, and PubMed references. The catalog is open source and community contributions are welcome.
