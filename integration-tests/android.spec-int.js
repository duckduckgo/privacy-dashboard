import { test as baseTest, expect } from '@playwright/test'
import { forwardConsole, withAndroidRequests } from './helpers'

const test = baseTest.extend({
    androidMocks: [async ({ page }, use) => {
        forwardConsole(page)
        await page.goto('/build/android/html/popup.html')
        const requests = await withAndroidRequests(page, {
            requests: []
        })
        await use(requests)
        // @ts-ignore
    }, { auto: true }]
})

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page, androidMocks }) => {
        // @ts-ignore
        await androidMocks.outgoing({ names: [] })
        await page.locator('"No Tracking Requests Found"').waitFor()
    })
})

test.describe('breakage form', () => {
    test('should call android interface', async ({ page, androidMocks }) => {
        await page.locator('"Website not working as expected?"').click()
        // @ts-ignore
        const calls = await androidMocks.outgoing()
        expect(calls).toMatchObject([
            ['showBreakageForm', undefined]
        ])
    })
})

test.describe('open external links', () => {
    test('should call android interface for links', async ({ page, androidMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        await page.locator('"About our Web Tracking Protections"').click()
        // @ts-ignore
        const calls = await androidMocks.outgoing()
        expect(calls).toMatchObject([
            ['openInNewTab', JSON.stringify({ url: 'https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/' })]
        ])
    })
})
