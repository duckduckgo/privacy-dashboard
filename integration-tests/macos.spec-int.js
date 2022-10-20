import { test as baseTest, expect } from '@playwright/test'
import { forwardConsole, withWebkitRequests } from './helpers'

const HTML = '/swift-package/Resources/ios/assets/html/macos.html'

const test = baseTest.extend({
    macOSMocks: [async ({ page }, use) => {
        forwardConsole(page)
        await page.goto(HTML)
        const requests = await withWebkitRequests(page, {
            requests: []
        })
        await use(requests)
        // @ts-ignore
    }, { auto: true }]
})

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page, macOSMocks }) => {
        // @ts-ignore
        await macOSMocks.outgoing({ names: [] })
        await page.locator('"No Tracking Requests Found"').waitFor({ timeout: 500 })
    })
})

test.describe('breakage form', () => {
    test('should show HTML breakage form and submit fields', async ({ page, macOSMocks }) => {
        await page.locator('"Website not working as expected?"').click()
        await page.locator('"Send Report"').click()
        // @ts-ignore
        const out = await macOSMocks.outgoing({ names: ['privacyDashboardSubmitBrokenSiteReport'] })
        expect(out).toMatchObject([
            ['privacyDashboardSubmitBrokenSiteReport', { category: '', description: '' }]
        ])
    })
})

test.describe('open external links', () => {
    test('should call webkit interface for external links', async ({ page, macOSMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        await page.locator('"About our Web Tracking Protections"').click()
        // @ts-ignore
        const calls = await macOSMocks.outgoing({ names: ['privacyDashboardOpenUrlInNewTab'] })
        expect(calls).toMatchObject([
            ['privacyDashboardOpenUrlInNewTab', { url: 'https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/' }]
        ])
    })
})

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page, macOSMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        // @ts-ignore
        const calls = await macOSMocks.outgoing({ names: ['privacyDashboardSetSize'] })
        expect(calls.length).toBeGreaterThanOrEqual(2)
    })
})
