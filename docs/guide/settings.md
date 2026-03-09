# Settings

Open Settings by clicking the gear icon in the header. Settings are organized into six sections: Profile, Display, AI Provider, PDF Import Privacy, Security, and Data.

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

Click **Take a Tour** to replay the 7-step spotlight walkthrough. The tour highlights the drop zone, sidebar navigation, lifestyle context cards, settings, feedback button, and AI chat panel. The tour auto-triggers after your first data import.

## AI Provider

Choose and configure one of four AI backends:

| Provider | Best for |
|---|---|
| **Anthropic** | Best accuracy, direct Claude access |
| **OpenRouter** | 200+ models, pay with card or crypto |
| **Venice** | Privacy-first, nothing logged on their end |
| **Local** | Fully local, completely offline, free — Ollama, LM Studio, Jan, etc. |

Each provider has its own panel:

- **Anthropic, OpenRouter, Venice**: Paste your API key, select a model from the dropdown. OpenRouter also has a custom model input for any model ID not in the curated list — a health check indicator (✓/✗) confirms connectivity. The app fetches available models from the provider automatically when you open Settings.
- **Local**: Enter your server URL (default `http://localhost:11434`), optionally add an API key, and choose from your locally available models. Works with any OpenAI-compatible server.

See [AI Providers](./ai-providers.md) for full setup instructions.

## PDF Import Privacy

Shows the current status of PII obfuscation — whether a local AI server is connected and being used, or whether the regex fallback is active.

Expand the **Configure Local AI** panel to:

- Set the server URL for PII stripping (can be different from the main AI server)
- Select a dedicated model for PII stripping
- Enable debug mode to view a before/after diff of what was replaced in your PDF text

See [PII Obfuscation](./pii-obfuscation.md) for a full explanation of how this works.

## Security

### Encryption

Enable AES-256-GCM encryption at rest with a passphrase. When enabled, all health data is encrypted before being written to localStorage. See [Encryption](./encryption.md) for details.

Passphrases must meet strength requirements: at least 8 characters, with mixed case and a special character. A live strength meter shows progress as you type.

### Change / Disable

You can change your passphrase or disable encryption from this section. Disabling encryption decrypts all data back to plaintext.

## Data

### Backup & Restore

View and restore IndexedDB auto-backup snapshots (up to 5 rolling copies). See [Encryption](./encryption.md#automatic-backups) for how auto-backup works.

### Folder Backup

Pick a local folder (Proton Drive, Dropbox, NAS) to auto-save backups using the File System Access API. See [Folder Backup](./folder-backup.md) for details.

### Export & Import

Quick access to JSON export (current profile) and data clearing. For full export options including per-client and database bundles, see [JSON Export & Import](./json-export-import.md).

### Recommendations

Toggle supplement and lifestyle recommendations on or off. When enabled, flagged markers show contextual suggestions in the detail modal, chat, and context card health dots.

::: tip Settings are stored locally
All settings — API keys, unit preferences, theme, provider choice — are stored in your browser's localStorage. They never leave your device.
:::
