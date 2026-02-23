# AI Chat

The AI Chat panel lets you have a conversation about your lab results with an AI that already knows everything about your data — your biomarker history, lifestyle context, supplements, notes, and health goals.

## Opening the Chat

Click the **Ask AI** button in the top-right corner of the header to slide the chat panel open. Click it again or press **Escape** to close it.

## What the AI Knows

Every message you send includes a full snapshot of your data:

- All lab values across every draw date, with reference ranges and trend direction
- Your nine [Context Cards](/guide/context-cards) (diet, sleep, exercise, environment, etc.)
- Your [Interpretive Lens](/guide/interpretive-lens) and [Health Goals](/guide/health-goals)
- Your supplements and their date ranges
- Your notes
- For female profiles: menstrual cycle data and phase context

You do not need to paste your results into the chat. Just ask your question.

## Personalities

The AI adopts a personality that shapes its communication style. Choose from three:

### Default
A clear, evidence-informed tone. Explains markers plainly, notes trends, and flags concerns without drama.

### House
Takes on the style of a sharp, skeptical clinician who asks uncomfortable questions. Pushes back on assumptions and digs for root causes.

### Custom
Create your own persona. Type a name in the custom personality field and click **Generate** — the AI will create a full personality profile for that persona, including communication style, analytical approach, and philosophical lens. You can edit the generated text before saving.

The **Enforce evidence-based accuracy** option (off by default) adds a strict disclaimer to the AI's instructions, keeping responses grounded in published research rather than speculation.

::: tip
Custom personalities are saved per profile and persist across sessions. You can create a persona based on a specific medical philosophy, a fictional doctor character, or any style that makes conversations more useful for you.
:::

## Conversation Threads

The chat panel includes a **thread rail** on the left side — a list of your past conversations. Each thread is named automatically from your first message, and you can rename any thread by clicking its name.

- Start a new conversation at any time
- Switch between threads without losing history
- Up to 50 threads are stored per profile; the oldest are pruned automatically

On mobile, tap the hamburger icon in the chat header to open the thread list, and use the back button to return to the conversation.

## Per-Marker AI Explanations

From any marker's detail view (click a marker name in the sidebar or on the dashboard), you will find an **Ask AI** button. This opens a pre-populated chat asking the AI to explain that specific marker in the context of your results — without you having to type anything.

## Markdown Responses

The AI's responses are rendered with full markdown formatting:

- Headings, bold, and italic text
- Bullet and numbered lists
- Code blocks and inline code
- Clickable links

Responses stream in word by word as the AI generates them.

## Choosing a Provider

The AI chat works with any of the four supported providers: Anthropic, OpenRouter, Venice, or Ollama. See [AI Providers](/guide/ai-providers) to configure your key or local server. The chat is not available until a provider is set up.

::: warning
Conversations are stored locally in your browser and encrypted if you have set a passphrase. The last 10 messages from each conversation are sent to the AI provider with every request to maintain context. Your provider's privacy policy applies to that data.
:::
