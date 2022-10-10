import { test as baseTest, expect } from '@playwright/test'
import { forwardConsole, withWebkitRequests } from './helpers'

const test = baseTest.extend({
    iosMocks: [async ({ page }, use) => {
        forwardConsole(page)
        await page.goto('/swift-package/Resources/ios/assets/html/popup.html')
        const requests = await withWebkitRequests(page, {
            requests: []
        })
        await use(requests)
        // @ts-ignore
    }, { auto: true }]
})

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page, iosMocks }) => {
        // @ts-ignore
        await iosMocks.outgoing({ names: [] })
        await page.locator('"No Tracking Requests Found"').waitFor({ timeout: 500 })
    })
})

test.describe('breakage form', () => {
    test('should call webkit interface and not use HTML form', async ({ page, iosMocks }) => {
        await page.locator('"Website not working as expected?"').click()
        // @ts-ignore
        const calls = await iosMocks.outgoing({ names: ['privacyDashboardShowReportBrokenSite'] })
        expect(calls).toMatchObject([
            ['privacyDashboardShowReportBrokenSite', {}]
        ])
    })
})

test.describe('open external links', () => {
    test('should call android interface for links', async ({ page, iosMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        await page.locator('"About our Web Tracking Protections"').click()
        // @ts-ignore
        const calls = await iosMocks.outgoing({ names: ['privacyDashboardOpenUrlInNewTab'] })
        expect(calls).toMatchObject([
            ['privacyDashboardOpenUrlInNewTab', { url: 'https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/' }]
        ])
    })
})
