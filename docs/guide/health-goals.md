# Health Goals

The Health Goals card lets you tell the AI what you are actually trying to achieve. Instead of generic interpretations, the AI prioritizes its analysis around the outcomes that matter most to you.

## Setting Your Goals

Click the **Health Goals** card on the dashboard to open the editor. In the editor you can:

- Add a new goal by typing it in the text field and clicking **Add**
- Assign each goal a severity level: **Major**, **Mild**, or **Minor**
- Delete goals you no longer need

There is no limit to the number of goals you can add.

## Severity Levels

Severity tells the AI how much weight to give each goal:

| Level | Meaning |
|-------|---------|
| **Major** | Top priority — the AI addresses these first in every analysis |
| **Mild** | Important, but secondary to major goals |
| **Minor** | Background context the AI keeps in mind |

::: tip
Be specific. "Reduce LDL below 3.0 mmol/L" gives the AI more to work with than "improve cholesterol." Specific goals lead to more targeted insights.
:::

## Dashboard Display

The Health Goals card on the dashboard shows your first three goals at a glance, with a severity badge next to each one. If you have more than three goals, open the editor to see them all.

If you have not set any goals yet, the card shows a placeholder prompt to get you started.

## How Goals Shape AI Responses

When you send a message in the AI chat, your goals are included in the context — grouped by severity, major first. The AI will naturally weave your goals into its analysis: flagging markers that are moving in the right direction, noting where you are off track, and suggesting what to watch next.

Goals are also included in the AI's reasoning for the [Focus Card](/guide/focus-card) and for per-marker explanations in the detail view.

## Export and Import

Health Goals are included in your JSON export. When you import a file, goals are merged by content — duplicates are automatically removed.
