# Menstrual Cycle Tracking

Lab Charts includes a full menstrual cycle tracking module for female profiles. Because hormones, iron, and inflammatory markers all shift across the cycle, knowing which phase you were in when blood was drawn makes your results far more meaningful.

::: warning
Cycle tracking is only available when your profile sex is set to **Female**. You can set this in Settings → Profile.
:::

## Setting Up Cycle Tracking

Scroll to the **Menstrual Cycle** section on the dashboard (below the context cards) and click to open the editor. You can record:

- **Cycle length** and **period length** — auto-calculated from your period log once you have enough entries, or set manually
- **Regularity** — auto-calculated from period history
- **Typical flow** — light, normal, heavy, or very heavy
- **Contraceptive use** — if applicable
- **Conditions** — e.g., PCOS, endometriosis, perimenopause

## Logging Periods

In the editor, use the period log to record individual periods. For each period you can add:

- Start and end date
- Flow level for that period
- **Symptoms** — multi-select from 10 options including Cramps, Mood swings, Fatigue, Bloating, Headache, Acne, Breast tenderness, Back pain, Insomnia, and Spotting
- Free-text notes

The more periods you log, the more accurate your auto-calculated stats become.

## Auto-Calculated Stats

Once you have logged enough periods, Lab Charts calculates cycle statistics automatically:

| Stat | Requires |
|------|----------|
| Cycle length | 2+ periods |
| Period length | 1+ periods |
| Regularity | 3+ periods |

Regularity is classified as **regular** (low variation), **irregular** (moderate), or **very irregular** (high). These values update automatically as you add more period entries and are shown as read-only in the editor.

## Phase-Aware Reference Ranges

For **estradiol** and **progesterone**, Lab Charts applies reference ranges specific to each cycle phase rather than a single flat range. The phases are:

- **Menstrual** (days 1–5 approximately)
- **Follicular** (after menstrual, up to ovulation)
- **Ovulatory** (around day 14 ±1)
- **Luteal** (from ovulation to next period)

Each blood draw date is mapped to a phase based on your period log. The status color of that data point (normal/high/low) reflects the phase-appropriate range. This applies throughout the app: charts, the detail modal, the data table, trend alerts, and the AI chat.

## Cycle Phase Bands on Charts

Open the **Layers** dropdown in the chart area and enable **Cycle Phases** to overlay color-coded phase bands on your charts:

- Menstrual — red shading
- Follicular — blue shading
- Ovulatory — purple shading
- Luteal — yellow shading

Each band shows a single-letter label at the top. This makes it easy to visually correlate hormone and iron readings with cycle phase.

## Next Best Blood Draw Date

The dashboard shows a recommendation for your next optimal blood draw window — the early follicular phase (days 3–5), when hormone baselines are most consistent and comparable between cycles. This takes the guesswork out of scheduling lab appointments.

## Alerts

### Perimenopause Detection

If you are 35 or older and have logged 4 or more periods, Lab Charts watches for patterns that may suggest perimenopause:

- Cycles gradually lengthening over time
- Increasing cycle-to-cycle variability
- Cycles frequently exceeding 38 days
- Predominantly heavy flow

Two or more of these indicators triggers a perimenopause pattern alert on the dashboard. This is informational — not a diagnosis.

### Heavy Flow and Iron Alerts

If you have logged recent heavy flow, Lab Charts cross-references your ferritin, hemoglobin, and iron levels and alerts you if:

- Values are below the reference range (critical alert)
- Values are in the bottom 25% of the reference range (warning)
- You have heavy flow but no iron panel has been run (informational)

## AI Context

The AI chat and per-marker explanations always consider your cycle phase. When you ask about a hormone result, the AI knows which phase that draw was in, applies the appropriate reference range, and flags if the draw timing was suboptimal for interpretation. Perimenopause and iron/flow alerts are also included in the AI's context.

## Guided Tour

After you save your cycle profile for the first time, a guided tour automatically walks you through all the cycle features on the dashboard. You can replay the tour at any time using the **?** button in the Menstrual Cycle section header.
