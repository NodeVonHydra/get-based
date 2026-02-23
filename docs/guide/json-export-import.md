# JSON Export & Import

Get Based can export all your data to a JSON file and import it back. This is useful for backups, transferring data between devices or browsers, and sharing data with another Get Based instance.

## Exporting Your Data

1. Scroll to the **Data & Notes** section at the bottom of the dashboard
2. Click **Export JSON**
3. A `.json` file is downloaded to your device

The exported file includes everything:

- All lab entries (every date, every marker, every value)
- Notes
- All 9 lifestyle context cards (diet, sleep, exercise, environment, etc.)
- Health goals
- Interpretive lens
- Supplements
- Menstrual cycle data (if entered)
- Custom marker definitions
- Additional notes

::: tip Export before major changes
Before doing a large batch import or clearing data, export a JSON backup first. It's your safety net.
:::

## Importing a JSON File

You import a JSON file the same way you import a PDF — by dropping it on the **drop zone** at the top of the dashboard.

Get Based detects JSON files automatically and handles them differently from PDFs:

- Lab entries are **merged by date**: if the JSON has data for a date that already exists, the values are combined rather than overwritten
- Notes are **deduplicated**: the same note won't appear twice
- Context card fields (diet, sleep, environment, etc.) are **overwritten** by the imported values
- Health goals are **merged** and deduplicated by text content

No AI provider is needed to import a JSON file.

::: warning Importing replaces context cards
If you import a JSON file that was exported from a different profile or device, the lifestyle context cards in your current profile will be overwritten by the imported values. Your lab entry data is safe — it merges rather than overwrites.
:::

## Transferring Between Devices

To move Get Based data to a new computer or browser:

1. Export JSON on the old device
2. Open Get Based on the new device
3. Drop the JSON file onto the drop zone

All your historical lab data, charts, and context will appear immediately.

## Automatic Backups

Get Based also creates automatic snapshots in the background as you add data. Up to 5 snapshots are kept, and you can restore any of them from **Settings → Backup & Restore**. These backups are stored in your browser's IndexedDB and do not leave your device.

JSON export gives you a portable file you can store anywhere (external drive, cloud storage, etc.), while automatic backups are browser-local snapshots for quick recovery.
