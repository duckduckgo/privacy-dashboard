import { test as baseTest, expect } from '@playwright/test'
import { forwardConsole, playTimeline, withWebkitMocks } from './helpers'

const HTML = '/build/app/html/macos.html'

const test = baseTest.extend({})

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        await withWebkitMocks(page)
        await playTimeline(page, ['state:04'])
        await page.locator('"No Tracking Requests Found"').waitFor({ timeout: 500 })
    })
})

test.describe('breakage form', () => {
    test('should show HTML breakage form and submit fields', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        const requests = await withWebkitMocks(page)
        await playTimeline(page, ['state:04'])
        await page.locator('"Website not working as expected?"').click()
        await page.locator('"Send Report"').click()
        // @ts-ignore
        const out = await requests.outgoing({
            names: ['privacyDashboardSubmitBrokenSiteReport'],
        })
        expect(out).toMatchObject([['privacyDashboardSubmitBrokenSiteReport', { category: '', description: '' }]])
    })
})

test.describe('open external links', () => {
    test('should call webkit interface for external links', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        const requests = await withWebkitMocks(page)
        await playTimeline(page, ['state:04'])
        await page.locator('"No Tracking Requests Found"').click()
        await page.locator('"About our Web Tracking Protections"').click()
        // @ts-ignore
        const calls = await requests.outgoing({
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

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        const requests = await withWebkitMocks(page)
        await playTimeline(page, ['state:04'])
        await page.locator('"No Tracking Requests Found"').click()
        // @ts-ignore
        const calls = await requests.outgoing({
            names: ['privacyDashboardSetSize'],
        })
        expect(calls.length).toBeGreaterThanOrEqual(1)
    })
})
