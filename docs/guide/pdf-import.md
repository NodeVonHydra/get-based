# PDF Import

getbased can read any lab report PDF — any format, any lab, any language, any country. Drop the file on the dashboard and the AI extracts all your results automatically.

## Before You Start

You need an AI provider configured in **Settings → AI Provider**. If you haven't done this yet, see [AI Providers](./ai-providers.md) first.

## How to Import

1. Open the getbased dashboard
2. Click the **import button** (document icon, bottom-right corner) or drag a PDF anywhere onto the page
3. Wait while the AI reads and analyzes the report (typically 5–20 seconds)
4. Review the **import preview** — exclude any rows you don't want by clicking the × button
5. Click **Confirm** to save the results

That's it. Your data appears in charts immediately after confirming.

## Pre-Flight Checks

Before the AI processes your PDF, getbased runs automatic checks:

- **Model mismatch** — if you've changed your AI model since the last import, a warning explains that different models may generate different marker keys. You can continue or switch back
- **PII scan** — a notification confirms that personal information will be stripped before sending to the AI

These checks help prevent data consistency issues and keep you informed about privacy.

## The Import Preview

Before anything is saved, getbased shows you exactly what it found:

- **Green — Matched**: Markers recognized and mapped to a known biomarker (e.g., glucose, TSH, ferritin)
- **Blue — New**: Markers not in the built-in list, auto-created as [custom markers](./custom-markers.md) with AI-suggested names and reference ranges
- **Yellow — Unmatched**: Results the AI found but could not confidently identify — these are skipped

The preview table shows each marker's value, the lab's reference range as printed on the PDF, and the internal mapping. Click the **×** button on any row to exclude it from import — the button toggles to **+** so you can re-include it. The confirm button updates its count as you exclude or re-include rows.

Review the preview carefully. You can dismiss the import if something looks wrong and try again.

### Reference Range Adoption

When the PDF's reference ranges differ from getbased's stored ranges, a toggle appears below the import preview table: **"Use this lab's reference ranges (updates N markers)"**. This is ON by default for your first import and OFF for subsequent imports. Accepting saves the lab's ranges as per-marker overrides (`refOverrides`) that apply going forward.

### Unit Normalization

Enzymes reported in IU/L (ALT, AST, ALP) are automatically mapped to the equivalent U/L markers — no manual correction needed.

::: tip Any language, any format
getbased handles reports from any country. The AI understands marker names in English, French, German, Spanish, Dutch, and many other languages, and maps them to the correct biomarkers regardless of the name used.
:::

## Specialty Labs

getbased automatically detects non-blood tests — OAT, DUTCH, HTMA, amino acids, and more. The AI identifies the test type and routes markers through the specialty pipeline with your lab's stated reference ranges. See [Specialty Labs](./specialty-labs.md) for full details.

## What Gets Extracted

getbased tracks 287+ biomarkers across 16 categories:

- Biochemistry (glucose, liver enzymes, kidney markers, electrolytes)
- Hormones (testosterone, estradiol, cortisol, DHEA, insulin, and more)
- Lipids (cholesterol, triglycerides, LDL, HDL, ratios)
- Hematology (CBC, red and white cell indices)
- Thyroid (TSH, T3, T4, antibodies)
- And 11 more categories

Markers not in the built-in schema are automatically created as custom markers and tracked alongside the built-in ones.

## Privacy During Import

Your PDF is processed locally first. Personal information (name, address, date of birth, ID numbers) is stripped out before anything is sent to your AI provider. See [PII Obfuscation](./pii-obfuscation.md) for full details on how this works.

## Common Questions

**Can I import the same PDF twice?**
If you import a report for a date that already has data, the new values are merged with existing ones for that date. Existing values are not overwritten.

**What if results are missing from the preview?**
Some PDFs use image-based scans rather than text. getbased automatically detects scanned PDFs and switches to **image mode**, rendering each page as a screenshot for the AI to read visually. You can also force image mode by clicking the **"Force image mode"** link in the drop zone. If results are still missing, try a PDF exported directly from your lab's portal.

**Can I undo an import?**
Not directly after confirming, but you can export your data as JSON before importing (as a backup), or use **Settings → Backup & Restore** to roll back to an automatic snapshot.
