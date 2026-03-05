# Focus Card

The Focus Card is a single AI-generated sentence at the top of your dashboard that surfaces the most important insight from your current lab data. It gives you a quick orientation every time you open the app.

## When It Appears

The Focus Card is only shown when two conditions are met:

1. You have lab data loaded
2. You have an AI provider configured (Anthropic, OpenRouter, Venice, or Local AI)

If either condition is not met, the card does not appear. See [AI Providers](/guide/ai-providers) to set up a provider.

## What It Shows

The AI reads your full context — all lab entries, your nine [Context Cards](/guide/context-cards), your [Interpretive Lens](/guide/interpretive-lens), your sex, and your date of birth — and distills it into one sentence. This might be:

- The marker showing the most meaningful change since your last draw
- A pattern across multiple markers worth investigating
- A positive trend aligned with one of your [Health Goals](/guide/health-goals)
- A concern the AI thinks deserves attention first

::: tip
The Focus Card is deliberately brief. Its job is to point you toward something worth exploring — then you can dig deeper in the [AI Chat](/guide/ai-chat) or the detail view for that marker.
:::

## Caching

The Focus Card is cached so it does not make an API call every time you load the dashboard. It regenerates only when something meaningful changes: new lab entries, updated context cards, a different interpretive lens, or a change to your profile (sex or date of birth).

While the card is loading for the first time or after a change, you will see a shimmer animation in its place. Generation times out after 15 seconds.

## Privacy

The Focus Card request is sent to your configured AI provider. Your data is processed according to that provider's privacy policy. If you are using [Local AI](/guide/ai-providers#local-ai-fully-local), the request stays entirely on your device.
