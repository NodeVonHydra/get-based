# getbased — Open-Source Blood Work Dashboard with AI

**getbased** is a free, open-source blood work dashboard that turns lab PDFs into interactive charts and AI-powered health insights. Track 287+ biomarkers over time, detect trends, and get personalized interpretations — all stored locally in your browser with no account required.

**[Live app](https://app.getbased.health)** · **[Documentation](https://getbased.health/docs)** · **[Discord](https://discord.gg/zJdVB9zgQB)**

![getbased Dashboard](screenshot.png)

---

## What it does

- **AI-powered PDF import** — drop any lab report (any format, language, or country) and AI extracts and maps results to 287+ known biomarkers automatically
- **Biomarker trend charts** — interactive line charts with reference bands, optimal ranges, and trend detection across 16 categories (biochemistry, hormones, lipids, hematology, thyroid, and more)
- **AI chat** — ask questions about your results with full health context, not just reference ranges
- **Specialty lab support** — OAT has first-class support (165 markers); DUTCH, HTMA, GI maps, and other non-blood tests flow through the custom marker pipeline
- **Calculated markers** — PhenoAge (biological age), HOMA-IR, free water deficit, lipid ratios
- **Trend alerts** — sudden changes and linear regression flagged on the dashboard
- **Correlation viewer** — compare any two markers, heatmap view
- **Compare dates** — side-by-side comparison of any two lab dates
- **Manual entry** — add results without a PDF
- **Marker glossary** — searchable reference for all markers with values and ranges
- **Interpretive lens** — frame AI analysis through specific scientific paradigms or experts
- **9 lifestyle context cards** — diet & digestion, sleep, exercise, stress, light & circadian, environment, and more — each gets an AI health rating and enriches all interpretations
- **Menstrual cycle tracking** — phase-aware reference ranges for estradiol and progesterone, cycle phase bands on charts
- **Supplement & medication timeline** — overlaid on charts to correlate with biomarker changes
- **PDF reports** — export a full health report as PDF
- **Batch import** — process multiple lab PDFs in one go

## Privacy and data ownership

- All data stored locally in your browser (localStorage + IndexedDB) — nothing on a server
- Personal info stripped from PDFs before AI processing (regex + optional local Ollama)
- AES-256-GCM encryption at rest
- Automatic backups (5 snapshots, one-click restore)
- Run Ollama locally and nothing leaves your machine at all
- No account, no sign-up, no tracking

## AI providers

| Provider | Description |
|---|---|
| **OpenRouter** | Model marketplace — one key, 200+ models (Claude, GPT, Gemini, Grok, DeepSeek). Recommended for most users. |
| **Anthropic** | Direct Claude API. Best accuracy on medical data. |
| **Venice AI** | Privacy cloud — access GPT, Grok, DeepSeek with nothing logged. |
| **Ollama** | Fully local inference. Completely offline. Free forever. |

Switch providers anytime. All non-AI features work without a provider configured.

## How it compares

| | getbased | Typical blood test apps |
|---|---|---|
| Open source | GPL-3.0 | Closed source |
| Cost | Free | Free tier + paid upsell |
| Data storage | Local browser, encrypted | Cloud (their servers) |
| AI providers | 4 choices (including fully local) | Locked to one |
| Lab import | Any PDF, any format, any language | Specific labs/formats only |
| Biomarkers | 287+ standard + unlimited custom | Limited set |
| Lifestyle context | 9 cards inform all AI analysis | None or basic |
| Account required | No | Yes |

---

## Quick start

```bash
git clone https://github.com/elkimek/get-based
cd get-based
node dev-server.js
```

Open `http://localhost:8000`. You need an AI provider API key or local Ollama for PDF import and chat. All other features work without one.

## Tech stack

No build tools, no bundler, no package manager. Pure ES modules — 26 files under `js/`.

- Chart.js for interactive charts
- pdf.js for PDF text extraction
- All dependencies loaded from CDN with SRI integrity hashes
- Installable as a PWA (works offline for non-AI features)

## Testing

16 browser-based test files run headlessly:

```bash
./run-tests.sh
```

Starts a local server, runs all tests via Puppeteer, exits 0/1.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Project board: [planned features](https://github.com/users/elkimek/projects/2).

## License

GPL-3.0. See [LICENSE](LICENSE).
