---
title: Toggle Report
---

# Toggle Report

Live example: https://duckduckgo.github.io/privacy-dashboard/app-debug/html/iframe.html?screen=toggleReport

## Step 1: Open the dashboard with params

-   `screen=toggleReport`
-   `opener=menu`
    -   or `opener=dashboard`

## Step 2: Ensure base data is present

When opening the dashboard, there are requirements like `locale` and others that should be met.
Note: you may to stub some data with empty arrays - please see the previous breakage form work as reference.

## Step 3: Implement the **new** data handler

This is called immediately to retrieve the data needed to render the list.

[Sample JSON 📝](../schema/__fixtures__/toggle-report-screen.json)

-   WebKit: {@link "macOS integration".privacyDashboardGetToggleReportOptions}
-   Other platforms will be added

See also: [Data disclosure item ids and their meanings](#appendix-data-disclosure-item-ids-and-their-meanings)

## Step 4: Implement new handlers

The following are all sent in response to user interactions

### 👆Sending/rejecting the report

-   WebKit: {@link "macOS integration".privacyDashboardSendToggleReport}
-   WebKit: {@link "macOS integration".privacyDashboardRejectToggleReport}

### 👆Tapping the 'see what's sent' list

-   Webkit: {@link "macOS integration".privacyDashboardSeeWhatIsSent}

### 👆Tapping anywhere on the success screen (macos only)

-   Webkit: {@link "macOS integration".privacyDashboardClose}

## Appendix: Data disclosure item ids and their meanings

| ID                  | Description                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| appVersion          | App version number                                                                                                 |
| atb                 | Anonymous experiment group for feature testing                                                                     |
| description         | Your selected category and optional comments                                                                       |
| device              | Device make, model, and manufacturer                                                                               |
| didOpenReportInfo   | Whether or not you opted to show this report info                                                                  |
| errorDescriptions   | Browser-reported errors                                                                                            |
| extensionVersion    | Extension version number                                                                                           |
| features            | List of which browser features were active                                                                         |
| httpErrorCodes      | Website response status (HTTP) codes                                                                               |
| jsPerformance       | How quickly parts of the page loaded                                                                               |
| lastSentDay         | Date of last report sent for this site                                                                             |
| listVersions        | Information about which versions of our protections were active                                                    |
| locale              | Primary language and country of your device                                                                        |
| openerContext       | How you got to this page, either: "SERP" (DuckDuckGo search), "Navigation" (link/URL), or "External" (other means) |
| os                  | Operating system version number                                                                                    |
| reportFlow          | Which reporting form you used ("menu", "dashboard", etc.)                                                          |
| requests            | Hostnames of trackers blocked, surrogate requests, ignored requests, and requests not in tracker blocking list     |
| siteUrl             | Page URL (without identifiable info)                                                                               |
| toggleReportCounter | Number of times protections were toggled off                                                                       |
| userRefreshCount    | Number of refreshes since page load                                                                                |
| wvVersion           | Web browser engine version number                                                                                  |
| isPirEnabled        | If you're a user of PIR                                                                                            |
