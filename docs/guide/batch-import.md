# Batch Import

If you have multiple lab reports to import at once — for example, several years of annual blood work — you can drop them all at the same time instead of importing one by one.

## How Batch Import Works

1. Select multiple PDF files (hold Shift or Ctrl/Cmd while clicking to select several)
2. Drag them all onto the drop zone at the same time
3. Lab Charts processes them **one file at a time**, in order

For each file, you go through the normal import preview — review matched markers, then confirm or skip. The app shows you which file you're on (e.g., "File 2 of 5") so you always know your progress.

## Confirm or Skip Per File

You have full control over each import:

- **Confirm** — save the results from this file and move to the next
- **Skip** — discard this file's results and move to the next without saving

This is useful if one report in the batch has formatting issues or belongs to someone else.

## Summary at the End

After all files are processed, a summary notification tells you:

- How many files were **imported** successfully
- How many were **skipped** (you chose to skip)
- How many **failed** (the AI couldn't extract usable data)

::: tip Recommended order
If your PDFs cover different dates, Lab Charts sorts data chronologically regardless of the import order. But importing oldest-to-newest can make it easier to review previews, since you'll see your history build up in order.
:::

::: warning Requires an AI provider
Each file in the batch goes through the same AI analysis as a single import. Make sure your AI provider is configured before starting a batch. See [AI Providers](./ai-providers.md).
:::

## Tips for Large Batches

- Start with a small batch (2–3 files) to make sure everything imports as expected before processing a decade of reports
- Use JSON export to back up your data before a large batch import — see [JSON Export & Import](./json-export-import.md)
- If a file fails, you can always import it individually afterward
