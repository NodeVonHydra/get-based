# Lab Charts

Blood work dashboard for tracking biomarker trends over time.

Drop any lab PDF, get interactive charts, trend detection, and AI that understands your full health context — not just reference ranges.

![Lab Charts Dashboard](screenshot.png)

---

## What it does

Lab Charts is a local-first web app that turns your blood work history into something actually useful. Import any lab report (any format, any language, any country), track 287+ biomarkers across 15 categories, and ask AI questions grounded in your actual data and lifestyle.

The app starts empty and is fully data-driven. No demo data is forced on you. Your data stays in your browser.

---

## Features

### Data Import
- Drop any lab PDF — AI maps results to 287+ known markers automatically
- Handles any lab format, any language, any country
- Markers not in the schema are auto-created as custom markers and tracked too
- Batch import multiple PDFs in one go
- JSON export/import for backup and transfer between devices
- Manual entry if you don't have a PDF

### Analysis
- Interactive line charts with reference bands, optimal ranges, and trend detection
- 15 biomarker categories: biochemistry, hormones, lipids, hematology, thyroid, and more
- Calculated markers: PhenoAge (biological age), HOMA-IR, free water deficit, lipid ratios
- Trend alerts: sudden changes and linear regression, both flagged on the dashboard
- Correlation viewer across any two markers
- Compare any two dates side by side
- Menstrual cycle tracking with phase-aware reference ranges for estradiol and progesterone
- Supplement and medication timeline overlaid on charts
- 9 lifestyle context cards (diet, sleep, light, stress, environment, and more) — each gets an AI health rating

### Privacy
- All data stored locally in your browser (localStorage + IndexedDB)
- Personal info stripped from PDFs before anything is sent to AI (regex fallback or local Ollama)
- AES-256-GCM encryption at rest with passphrase-based key derivation
- Automatic backups via IndexedDB, 5 snapshots, one-click restore
- Run Ollama locally and nothing leaves your machine at all

### AI Providers
- **Anthropic Claude** — best results for medical data, pay per use
- **OpenRouter** — one key, 200+ models (Claude, GPT, Gemini, DeepSeek, Grok, and more)
- **Venice AI** — privacy-first, nothing stored or logged on their end
- **Ollama** — fully local, completely offline, free forever

Switch providers anytime in Settings. The app falls back gracefully if no provider is configured — all non-AI features work without one.

---

## Quick start

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

You need an AI provider API key (Anthropic, OpenRouter, or Venice) or a local Ollama instance for PDF import and chat features. All other features work without one.

---

## AI Providers

| Provider | Description |
|---|---|
| Anthropic | Direct Claude API. Recommended for best accuracy on medical data. |
| OpenRouter | Model marketplace. One key, many models. Pay with card or crypto. |
| Venice AI | Privacy cloud. Access GPT, Grok, DeepSeek — nothing is logged. |
| Ollama | Local inference. Fully offline. Nothing leaves your machine. |

Configure your provider in Settings after opening the app.

---

## Tech stack

- No build tools, no bundler, no package manager
- Pure ES modules via `<script type="module">` — 24 modules under `js/`
- Chart.js 4.4.7 for charts
- pdf.js 3.11.174 for PDF text extraction
- All dependencies loaded from CDN with SRI integrity hashes
- Google Fonts: Inter, Outfit, JetBrains Mono

---

## PWA

Lab Charts is installable as a Progressive Web App. The service worker caches the full app shell so it works offline. AI features (PDF import, chat) require a network connection to your provider — everything else works without one.

---

## Testing

12 browser-based test files cover source inspection, DOM behavior, CSS, and live feature logic. Run all of them headlessly:

```bash
./run-tests.sh
```

This starts a local server if one isn't running, runs all tests via headless Chrome (Puppeteer), and exits with code 0 or 1. Requires Puppeteer — install with `npm i -g puppeteer` or `npx puppeteer`.

---

## Roadmap

See the [project board](https://github.com/users/elkimek/projects/2) for planned features and ideas. Contributions welcome.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

AGPL-3.0. See [LICENSE](LICENSE).
