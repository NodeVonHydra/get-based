# Getting Started

getbased is a blood work dashboard that turns your lab reports into interactive charts, trend analysis, and AI-powered interpretation. The app starts empty — your data is loaded by you, stored locally in your browser, and never uploaded anywhere by default.

## Open the App

The easiest way to get started is the hosted version at **[getbased.health](https://getbased.health)**. No installation required.

### Self-host

If you prefer to run it yourself, clone the repository and start a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser. A local server is required because the app loads ES module scripts — opening `index.html` directly as a file will not work.

## Install as a PWA

getbased is installable as a Progressive Web App on desktop and mobile. Look for the install prompt in your browser's address bar, or use your browser menu:

- **Chrome / Edge**: address bar → install icon, or menu → "Install getbased"
- **Safari (iOS)**: Share → Add to Home Screen
- **Firefox**: menu → Install

Once installed, the full app shell works offline. AI features (PDF import, chat) still need a network connection to reach your AI provider.

## Guided Tour

When you open the app for the first time, a 7-step spotlight tour walks you through the key areas of the interface — the import drop zone, category navigation, lifestyle context cards, settings, and the AI chat panel. Use the **Next** button to advance, or press **Escape** to dismiss.

You can replay the tour at any time from **Settings → Display → Take a Tour**.

## First Steps

### 1. Configure an AI Provider

PDF import, the AI chat panel, and several dashboard features require an AI provider. Open **Settings** (gear icon in the header) and go to the **AI Provider** tab.

See the [AI Providers](./ai-providers.md) page for a full comparison and setup instructions for each option.

::: tip No provider needed for most features
Charts, manual entry, JSON import/export, data tables, trend alerts, and correlations all work without any AI provider configured.
:::

### 2. Set Your Profile

In **Settings → Profile**, enter your biological sex and date of birth. These affect:

- Reference ranges for sex-specific markers (hormones, hematology)
- PhenoAge (biological age) calculation, which requires your DOB
- Menstrual cycle tracking (available for female profiles)

### 3. Import Your First Lab Report

Drag and drop any lab PDF onto the drop zone at the top of the dashboard. The AI reads the report, maps results to known biomarkers, and shows you a preview before saving anything.

If you don't have a PDF handy, use **Manual Entry** to type in values directly.

::: warning AI provider required for PDF import
You must have an AI provider configured before dropping a PDF. If the drop zone shows a prompt to set up a provider, visit Settings first.
:::

Once data is imported, charts and analysis appear automatically across all 16 biomarker categories.
