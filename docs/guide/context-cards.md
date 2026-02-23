# Context Cards

Context cards are the nine lifestyle panels on your dashboard, grouped under the heading **"What your GP won't ask you."** They capture the health context that shapes your lab results — information a typical appointment rarely has time to explore.

## What They Are

Each card represents a different area of your life that influences your biomarkers. The dashboard shows a summary of every card at a glance, along with a count of how many you have filled in (e.g., **5/9 filled**).

The nine cards, in order:

1. **Health Goals** — what you are working toward
2. **Medical Conditions** — diagnoses and ongoing conditions
3. **Diet** — eating patterns, meal timing, and restrictions
4. **Exercise** — frequency, types, intensity, and daily movement
5. **Sleep & Rest** — duration, quality, sleep environment, and practices
6. **Light & Circadian** — morning light, UV exposure, evening screen habits, and grounding
7. **Stress** — stress level, sources, and management strategies
8. **Love Life & Relationships** — relationship quality and sexual health
9. **Environment** — water quality, EMF exposure, air quality, and toxin sources

## AI Health Dots and Tips

Each card displays a small colored dot in its corner:

- **Green** — this area looks supportive of your health
- **Yellow** — there may be something worth paying attention to here
- **Red** — this area may be contributing to out-of-range results
- **Gray** — not enough information to assess

Below the dot, you will see a brief AI-generated tip (up to 12 words) tailored to your data. These dots and tips are cached and only refreshed when your data or card content changes.

::: tip
Fill in as many cards as you can. The AI uses all of this context when interpreting your lab results in chat and in the Focus Card.
:::

## Opening a Card Editor

Click any card to open its editor modal. Each editor uses pill-button selectors and tag pills for multi-select options — no dropdowns to dig through. Changes save when you click **Save**.

## Kruse-Informed Options

Several cards include options inspired by circadian biology and mitochondrial health frameworks:

**Sleep & Rest** includes:
- Room temperature setting
- Sleep environment options: blackout curtains, low-EMF setup, grounding sheet, Magnetico sleep pad
- Sleep practices: mouth taping, cold shower before bed, magnesium

**Light & Circadian** includes:
- Morning sunlight exposure (AM light)
- UV exposure habits
- Evening discipline (no artificial light, blue-light glasses, etc.)
- Cold exposure and grounding/earthing
- Screen time and technology environment
- Meal timing relative to light cycles

Your location (set in Settings) is used to auto-detect your latitude band, which appears in the Light & Circadian card context sent to the AI.

**Environment** includes:
- Water quality: spring water, deuterium-depleted water (DDW), reverse osmosis
- EMF sources and mitigation strategies
- Home lighting type
- Air quality and toxin exposure
- Building materials

## Additional Notes

Below the card grid is a free-form **Additional Notes** textarea. Use this to add anything that does not fit neatly into a structured card — recent travel, a new medication, unusual stress, anything relevant. This text is auto-saved and included in every AI conversation.

## How Context Reaches the AI

When you chat with the AI or view the Focus Card, all nine cards plus the Additional Notes textarea are included in the context sent to the AI. The AI uses this to give you interpretations that go beyond the numbers — it can flag when your sleep schedule, diet, or environment might explain a result, or suggest that a pattern in your labs aligns with something you mentioned in a card.

::: warning
Context cards never leave your device except as part of AI API calls (to your chosen provider). See [AI Providers](/guide/ai-providers) and [Encryption](/guide/encryption) for details on how your data is handled.
:::
