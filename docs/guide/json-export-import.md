# JSON Export & Import

getbased can export your data to JSON files and import them back. This is useful for backups, transferring data between devices or browsers, and sharing data between profiles.

## Single-Profile Export

1. Scroll to the **Data & Notes** section at the bottom of the dashboard
2. Click **Export JSON**
3. A `.json` file is downloaded to your device

The exported file includes everything for the current profile:

- All lab entries (every date, every marker, every value)
- Notes
- All 9 lifestyle context cards (diet, sleep, exercise, environment, etc.)
- Health goals
- Interpretive lens
- Supplements
- Menstrual cycle data (if entered)
- Genetics data (SNP results from DNA raw data import, if imported)
- Custom marker definitions
- Chat history and conversation threads

::: tip Export before major changes
Before doing a large batch import or clearing data, export a JSON backup first. It's your safety net.
:::

## Per-Client Export

From the **Client List** modal, click the three-dot menu (⋮) next to any profile and select **Export**. This exports that specific client's data as a standalone JSON file — useful when you manage multiple profiles and need to share or back up one at a time.

## Database Bundles

For a full backup of everything across all profiles:

- **Client List** → **Export All** button in the header
- **Settings → Data** → **Export All Clients**

This creates a database bundle containing every profile's data, chat history, threads, custom personalities, and settings. Use this for complete backups or migrating your entire getbased setup to a new browser or device.

### Importing a Database Bundle

Drop a database bundle onto the import drop zone. getbased detects it automatically and handles multi-profile merging:

- New profiles are created
- Existing profiles are merged (lab entries by date, notes deduplicated)
- Chat threads and custom personalities are carried over

## Importing a JSON File

You import a JSON file the same way you import a PDF — by dropping it on the **drop zone** at the top of the dashboard.

getbased detects JSON files automatically and handles them differently from PDFs:

- Lab entries are **merged by date**: if the JSON has data for a date that already exists, the values are combined rather than overwritten
- Notes are **deduplicated**: the same note won't appear twice
- Context card fields (diet, sleep, environment, etc.) are **overwritten** by the imported values
- Health goals are **merged** and deduplicated by text content

No AI provider is needed to import a JSON file.

::: warning Importing replaces context cards
If you import a JSON file that was exported from a different profile or device, the lifestyle context cards in your current profile will be overwritten by the imported values. Your lab entry data is safe — it merges rather than overwrites.
:::

## Transferring Between Devices

To move getbased data to a new computer or browser:

1. Export JSON on the old device (or use a database bundle for all profiles)
2. Open getbased on the new device
3. Drop the JSON file onto the drop zone

All your historical lab data, charts, and context will appear immediately.

## Automatic Backups

getbased also creates automatic snapshots in the background as you add data. Up to 5 snapshots are kept, and you can restore any of them from **Settings → Data → Backup & Restore**. These backups are stored in your browser's IndexedDB and do not leave your device.

For file-based automatic backups, see [Folder Backup](./folder-backup.md).
