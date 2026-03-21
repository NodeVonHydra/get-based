# DNA Import

getbased can overlay genetic context on your blood work. Drop a raw DNA file from any major provider and getbased matches health-relevant SNPs to the biomarkers you're already tracking — so the AI can factor in your genetics when interpreting lab results.

## Before You Start

You need a **raw DNA data file** from one of these providers:

| Provider | File format | How to download |
|---|---|---|
| **AncestryDNA** | Tab-separated text | Settings → DNA → Download Raw DNA Data |
| **23andMe** | Tab-separated text | Settings → 23andMe Data → Download Raw Data |
| **MyHeritage** | CSV | DNA → Manage DNA kits → Download Raw Data |
| **FTDNA** (Family Tree DNA) | CSV | myFTDNA → Download Raw Data |
| **Living DNA** | Tab-separated text | Dashboard → Download Raw DNA |

No AI provider is needed for DNA import — the file is parsed locally.

## How to Import

1. Open the getbased dashboard
2. Drop your DNA file onto the page (or use the import button and select the file)
3. Review the **import preview** — SNPs are grouped by impact level
4. Click **Import** to save

The file is processed entirely in your browser using a Web Worker. Your DNA data is never transmitted anywhere.

## What Gets Extracted

getbased doesn't store your entire genome. It scans your file for **42 curated SNPs** across 10 categories and discards everything else.

| Category | SNPs | Example genes | Related markers |
|---|---|---|---|
| Methylation | 6 | MTHFR, MTR, MTRR, CBS | Homocysteine, folate, B12 |
| Iron | 5 | HFE, TMPRSS6, TF | Ferritin, transferrin, iron |
| Lipids | 5 | APOE, PCSK9, CETP | LDL, HDL, cholesterol, Lp(a) |
| Vitamin D | 4 | VDR, GC, CYP2R1 | Vitamin D |
| Vitamin B12 | 4 | FUT2, TCN2, CUBN | B12, homocysteine |
| Blood Sugar | 4 | TCF7L2, PPARG, ADIPOQ | Glucose, HbA1c, insulin |
| Sex Hormones | 5 | SHBG, CYP17A1, CYP19A1 | Testosterone, estradiol, SHBG |
| Thyroid | 3 | DIO1, DIO2, TSHR | TSH, fT3, fT4 |
| Bilirubin | 2 | UGT1A1 | Total bilirubin |
| Fatty Acids | 4 | FADS1, FADS2, ELOVL2 | Omega-3, EPA, DHA |

### APOE Haplotype

The two APOE SNPs (rs429358 + rs7412) are automatically resolved into the standard haplotype notation (ε2/ε3/ε4) rather than shown as raw genotypes.

## How SNPs Are Selected

The curated list follows strict criteria — this is not a 23andMe-style trait report:

1. **Must map to a tracked biomarker.** Every SNP links to at least one marker in the getbased schema. Pure ancestry or trait SNPs are excluded
2. **Known mechanism.** The variant directly affects an enzyme, receptor, or transport protein in a biochemically understood way — not just a statistical GWAS association with a tiny odds ratio
3. **Large effect size.** Included SNPs have meaningful clinical impact (e.g., MTHFR C677T reduces enzyme activity to ~30%; HFE C282Y causes 10–20× iron overload risk in homozygotes)
4. **Well-replicated.** Findings confirmed across multiple databases (SNPedia, ClinVar, GWAS Catalog, PharmGKB)
5. **Actionable.** The genotype leads to a concrete recommendation — supplement methylfolate, monitor ferritin more closely, consider higher vitamin D targets, etc.

The core principle: **only SNPs that help you interpret the blood work you're already tracking**.

## Effect Tiers

Each genotype is classified into one of three tiers:

| Tier | Meaning | Example |
|---|---|---|
| 🔴 **Significant** | Meaningful functional impact — worth factoring into your health decisions | MTHFR C677T AA (~30% enzyme activity) |
| 🟡 **Moderate** | Mild effect — relevant when combined with other factors | MTRR A66G AG (modestly reduced B12 recycling) |
| 🟢 **None** | Normal / wild-type — no impact | HFE C282Y GG (no hemochromatosis risk) |

The import preview groups findings by tier so you can see significant results first.

## Where Genetics Appears

### Dashboard

A **Genetics** section shows your APOE haplotype and top findings grouped by category (methylation, iron, vitamin D, etc.), sorted by severity. The section is collapsible — click the header to expand or collapse. Initially shows up to 8 findings with a "show all" button for the rest. Appears after Key Trends charts. Each finding links to its primary study (PubMed) and a "more studies" page (SNPedia).

### Detail Modal

When you open a biomarker's detail view, any relevant SNPs appear inline — showing the gene, your genotype, and what it means for that specific marker. SNPs are sorted by severity (significant first). Each includes links to the primary study and SNPedia.

### AI Chat

The AI automatically receives your genetic context when interpreting lab results. SNPs with "none" effect are filtered out to reduce noise. Only SNPs relevant to the markers being discussed are included, unless you explicitly ask about genetics — then the full profile is sent.

### Context Cards

SNPs route to relevant context cards (diet, supplements, sleep, etc.) so the AI can factor them into lifestyle recommendations.

## Privacy

- Your DNA file is parsed **entirely in your browser** using a Web Worker — it is never uploaded or transmitted
- Only the 42 matched SNP genotypes are stored (not your full genome)
- Stored data includes: rsid, genotype, gene name, variant name, and effect classification
- DNA data is included in JSON exports and covered by encryption if enabled
- You can delete your genetic data at any time from the Genetics dashboard section
- A **Genetics** entry appears in the sidebar when data is present, for quick navigation

## Re-importing

Importing a new DNA file replaces any existing genetic data for the current profile. You can re-import using the **Re-import** link at the bottom of the Genetics dashboard section, or by dropping a new file onto the page. This is useful if you switch DNA providers or want to update after downloading a newer raw data file.

## Common Questions

**What if my file isn't detected?**
getbased identifies files by their content headers, not just the filename. Make sure you're using the raw data export (a text or CSV file), not a PDF report or a health report download.

**Why only 42 SNPs?**
Quality over quantity. Each SNP was selected because it has a well-understood mechanism, a large effect size, and directly helps interpret a biomarker you're tracking. Adding hundreds of low-confidence GWAS hits would create noise, not signal. Each SNP links to its primary research paper so you can verify the evidence yourself.

**Can I add my own SNPs?**
Not directly. The SNP lookup table (`data/snp-health.json`) is curated and versioned — every entry must pass the [five criteria above](#how-snps-are-selected). Community contributions are welcome via pull request, but **you must do the research first**. Open an issue with:

1. **The rsID and gene/variant name**
2. **Which biomarker(s) it maps to** in the getbased schema (e.g., `vitamins.folate`, `coagulation.homocysteine`)
3. **Mechanism** — what enzyme/receptor/transporter does the variant affect, and how? (not just "associated with X in a GWAS")
4. **Effect size** — what is the functional impact? (e.g., "reduces enzyme activity to 30%" not "slightly associated with")
5. **Replication** — links to at least 2 independent studies or a meta-analysis confirming the effect on the specific biomarker
6. **Actionability** — what concrete recommendation follows from the genotype?

SNPs that fail any criterion will be declined. Common reasons for rejection:
- Synonymous variants with unconfirmed functional effects
- GWAS associations without a known biochemical mechanism
- Effects that only manifest on specialty panels (DUTCH, urinary metabolites) not standard blood work
- Weak or contradictory biomarker associations (e.g., studies finding opposite directions of effect)
- Variants whose pathway is already well-covered by existing SNPs (e.g., adding a third MTHFR variant when C677T and A1298C already capture the methylation story)
- Pharmacogenomic SNPs that only matter on a specific drug (e.g., methotrexate response)

**Is this a medical diagnosis?**
No. Genetic information provides context for interpreting your lab results — it does not diagnose conditions. Always discuss significant findings with your healthcare provider.
