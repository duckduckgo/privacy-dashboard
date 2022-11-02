import { test as baseTest, expect } from '@playwright/test'
import { forwardConsole, playTimeline, withWebkitRequests } from './helpers'

const HTML = '/build/app/html/ios.html'

const test = baseTest.extend({
    iosMocks: [
        async ({ page }, use) => {
            forwardConsole(page)
            await page.goto(HTML)
            const requests = await withWebkitRequests(page, {
                requests: [],
            })
            await use(requests)
        },
        // @ts-ignore
        { auto: true },
    ],
})

test.describe('page data (no trackers)', () => {
    test('should fetch initial data', async ({ page, iosMocks }) => {
        // @ts-ignore
        await iosMocks.outgoing({ names: [] })
        await page.locator('"No Tracking Requests Found"').waitFor({ timeout: 500 })
    })
    test('should accept updates when on trackers list screen', async ({ page, iosMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        await expect(page).toHaveScreenshot('tracker-list-before.png')
        // @ts-ignore
        await playTimeline(page, ['new-requests'])
        await expect(page).toHaveScreenshot('tracker-list-after.png')
    })
    test('should accept updates when on non-trackers list screen', async ({ page, iosMocks }) => {
        await page.locator('"No Third-Party Requests Found"').click()
        await expect(page).toHaveScreenshot('non-tracker-list-before.png')
        // @ts-ignore
        await playTimeline(page, ['new-requests'])
        await expect(page).toHaveScreenshot('non-tracker-list-after.png')
    })
    test('does not alter the appearance of connection panel', async ({ page, iosMocks }) => {
        await page.locator('"Connection Is Encrypted"').click()
        await expect(page).toHaveScreenshot('connection-before.png')
        // @ts-ignore
        await playTimeline(page, ['new-requests'])
        await expect(page).toHaveScreenshot('connection-before.png') // <- should be identical
    })
})

test.describe('page data (with trackers)', () => {
    test('should display correct primary screen', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        await withWebkitRequests(page, { requests: [] })
        await playTimeline(page, ['state:cnn'])
        // allow the page to re-render
        await page.locator('.icon-list').waitFor({ timeout: 500 })
        await expect(page).toHaveScreenshot('primary-screen.png')
    })
})

test.describe('breakage form', () => {
    test('should call webkit interface and not use HTML form', async ({ page, iosMocks }) => {
        await page.locator('"Website not working as expected?"').click()
        // @ts-ignore
        const calls = await iosMocks.outgoing({
            names: ['privacyDashboardShowReportBrokenSite'],
        })
        expect(calls).toMatchObject([['privacyDashboardShowReportBrokenSite', {}]])
    })
})

test.describe('open external links', () => {
    test('should call android interface for links', async ({ page, iosMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        await page.locator('"About our Web Tracking Protections"').click()
        // @ts-ignore
        const calls = await iosMocks.outgoing({
            names: ['privacyDashboardOpenUrlInNewTab'],
        })
        expect(calls).toMatchObject([
            [
                'privacyDashboardOpenUrlInNewTab',
                {
                    url: 'https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/',
                },
            ],
        ])
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        await withWebkitRequests(
            page,
            {
                requests: [],
            },
            {
                localeSettings: {
                    locale: 'pl',
                },
            }
        )
        await page.locator('"Połączenie jest szyfrowane"').click()
    })
    test('should load with `fr` locale', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        await withWebkitRequests(
            page,
            {
                requests: [],
            },
            {
                localeSettings: {
                    locale: 'fr',
                },
            }
        )
        await page.locator('"La connexion est chiffrée"').click()
    })
})

test.describe('states', () => {
    test('01', async ({ page }) => {
        const state = new StateTest(page, 'ios', '01')
        await state.screenshots()
    })
    test('02', async ({ page }) => {
        const p = new StateTest(page, 'ios', '02')
        await p.screenshots()
    })
    test('03', async ({ page }) => {
        const p = new StateTest(page, 'ios', '03')
        await p.screenshots()
    })
    test('04', async ({ page }) => {
        const p = new StateTest(page, 'ios', '04')
        await p.screenshots()
    })
    test('05', async ({ page }) => {
        const p = new StateTest(page, 'ios', '05')
        await p.screenshots()
    })
    test('cnn', async ({ page }) => {
        const p = new StateTest(page, 'ios', 'cnn')
        await p.screenshots()
    })
    test('ad-attribution', async ({ page }) => {
        const p = new StateTest(page, 'ios', 'ad-attribution')
        await p.screenshots()
    })
    test('google-off', async ({ page }) => {
        const p = new StateTest(page, 'ios', 'google-off')
        await p.screenshots()
    })
})

class StateTest {
    page
    platform
    state
    /**
     * @param {import("@playwright/test").Page} page
     * @param {"ios"} platform
     * @param {"01" | "02" | "03" | "04" | "05" | "cnn" | "ad-attribution" | "google-off"} state
     */
    constructor(page, platform, state) {
        this.platform = platform
        this.state = state
        this.page = page
    }

    async init() {
        forwardConsole(this.page)
        await this.page.goto(HTML)
        await withWebkitRequests(this.page, {
            requests: [],
        })
    }

    async screenshotPrimary() {
        await playTimeline(this.page, [`state:${this.state}`])
        await expect(this.page).toHaveScreenshot(`${this.state}-state-primary.png`)
    }

    async screenshotTrackers() {
        const page = this.page
        await page.locator('[aria-label="View Tracker Companies"]').click()
        await expect(this.page).toHaveScreenshot(`${this.state}-state-trackers.png`)
    }

    async screenshotNonTrackers() {
        const page = this.page
        await page.locator('[aria-label="Back"]').click()
        await page.locator('[aria-label="View Non-Tracker Companies"]').click()
        await expect(this.page).toHaveScreenshot(`${this.state}-state-non-trackers.png`)
    }

    async screenshots() {
        await this.init()
        await this.screenshotPrimary()
        await this.screenshotTrackers()
        await this.screenshotNonTrackers()
    }
}
