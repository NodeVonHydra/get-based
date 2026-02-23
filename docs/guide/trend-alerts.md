# Trend Alerts

The Trends & Alerts section on the dashboard automatically scans your lab history and surfaces patterns worth paying attention to. You do not need to configure anything — it runs every time you load or update your data.

## Two Detection Methods

Lab Charts uses two independent methods to detect problems:

### 1. Sudden Change

Compares your most recent result to the one before it. If the jump is larger than 25% of the reference range width **and** the latest value is outside the normal range, it raises a sudden change alert.

This catches acute shifts — a result that moved significantly from the previous draw.

### 2. Linear Regression (Trend)

Looks at three or more results over time and fits a trend line. If the slope is steep enough and the fit is statistically consistent, it raises a trend alert. This catches slow drifts that would be easy to miss when looking at individual results.

A trend alert also fires when a marker is approaching the boundary of its reference range — within 15% of the limit — even if it is still technically normal.

::: tip
Trend detection requires at least three data points for a marker. Import multiple lab results across different dates to get the most value from this feature.
:::

## Alert Types and Colors

| Color | Type | Meaning |
|-------|------|---------|
| Orange | Sudden high / Sudden low | A large jump in the most recent result |
| Red | Past high / Past low | A consistent trend already outside range |
| Yellow | Approaching high / Approaching low | A trend heading toward the boundary |

Sudden change alerts take priority over regression alerts for the same marker.

## Critical Flags

Below the trend alerts, Lab Charts lists **critical flags** — markers where the latest value has crossed more than 50% of the reference range width past the boundary. These are not trend detections; they flag markers that are significantly out of range right now.

::: warning
Trend alerts and critical flags are informational tools to help you spot patterns. They are not medical diagnoses. Always discuss significant changes with a qualified healthcare provider.
:::

## Date Range Filter

All trend detection respects the date range filter set in the header. If you narrow the range to the last six months, only results within that window are analyzed. This is useful for evaluating a specific intervention or health period.

Markers that appear in trend alerts are excluded from the critical flags section to avoid showing the same marker twice.
