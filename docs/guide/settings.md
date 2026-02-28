# Settings

Open Settings by clicking the gear icon in the header. Settings are organized into four sections: Profile, Display, AI Provider, and PDF Import Privacy.

## Profile

### Biological Sex

Select male or female. This affects:

- Reference ranges for sex-specific markers (testosterone, estradiol, hematology values)
- PhenoAge calculation (biological age)
- Menstrual cycle tracking, which is only available for female profiles

### Date of Birth

Required for PhenoAge (biological age calculation). PhenoAge uses a validated formula from Levine et al. 2018 that computes biological age from 9 biomarkers compared against your chronological age. Without a date of birth, PhenoAge cannot be calculated.

### Location (Country and Postal Code)

Your location is used to auto-detect a latitude band for the **Light & Circadian** context card. Latitude influences UV exposure availability, seasonal light patterns, and how the AI interprets your circadian context. getbased maps your country and postal code to one of five latitude bands — no precise location is stored or transmitted.

## Display

### Units (EU / US)

Toggle between EU (SI) units and US units:

- **EU mode**: mmol/L for glucose and cholesterol, µmol/L for creatinine, etc.
- **US mode**: mg/dL for glucose, mg/dL for cholesterol, mg/dL for creatinine, etc.

The toggle converts all displayed values and reference ranges simultaneously. Your stored data always uses SI units internally.

### Date Range Filter

Control how much history is shown in charts and trend analysis:

- **All time** — show every data point ever imported
- **Last year**, **Last 6 months**, **Last 3 months** — zoom into recent history

The selected range applies to charts, trend alerts, and the flagged markers section.

### Theme

Switch between **dark** (default) and **light** mode. The preference is stored locally and applied on every visit.

### Time Format

Choose between **24-hour** and **12-hour** (AM/PM) time display. This affects how meal times appear in the Diet context card.

### Guided Tour

Click **Take a Tour** to replay the 7-step spotlight walkthrough. The tour highlights the drop zone, sidebar navigation, lifestyle context cards, settings, feedback button, and AI chat panel. It's the same tour that appears automatically on your first visit.

## AI Provider

Choose and configure one of four AI backends:

| Provider | Best for |
|---|---|
| **Anthropic** | Best accuracy, direct Claude access |
| **OpenRouter** | 200+ models, pay with card or crypto |
| **Venice** | Privacy-first, nothing logged on their end |
| **Ollama** | Fully local, completely offline, free |

Each provider has its own panel:

- **Anthropic, OpenRouter, Venice**: Paste your API key, select a model from the dropdown. The app fetches available models from the provider automatically when you open Settings.
- **Ollama**: Enter your server URL (default `http://localhost:11434`) and choose from your locally available models.

See [AI Providers](./ai-providers.md) for full setup instructions.

## PDF Import Privacy

Shows the current status of PII obfuscation — whether Ollama is running and being used, or whether the regex fallback is active.

Expand the **Configure** panel to:

- Set the Ollama server URL for PII stripping (can be different from the main AI server)
- Select a dedicated Ollama model for PII stripping
- Enable debug mode to view a before/after diff of what was replaced in your PDF text

See [PII Obfuscation](./pii-obfuscation.md) for a full explanation of how this works.

::: tip Settings are stored locally
All settings — API keys, unit preferences, theme, provider choice — are stored in your browser's localStorage. They never leave your device.
:::
