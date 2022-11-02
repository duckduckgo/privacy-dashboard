import { test as baseTest, expect } from '@playwright/test'
import { forwardConsole, playTimeline, withAndroidRequests } from './helpers'

const HTML = '/build/app/html/android.html'

const test = baseTest.extend({
    androidMocks: [
        async ({ page }, use) => {
            forwardConsole(page)
            await page.goto(HTML)
            const requests = await withAndroidRequests(page, {
                requests: [],
            })
            await use(requests)
        },
        // @ts-ignore
        { auto: false },
    ],
})

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page, androidMocks }) => {
        // @ts-ignore
        await androidMocks.outgoing({ names: [] })
        await page.locator('"No Tracking Requests Found"').waitFor()
    })
})

test.describe('page data (with trackers)', () => {
    test('should display correct primary screen', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        await withAndroidRequests(page, { requests: [] })
        await playTimeline(page, ['state:cnn'])
        // allow the page to re-render
        await page.locator('.icon-list').waitFor({ timeout: 500 })
        await expect(page).toHaveScreenshot('primary-screen.png')
    })
    test('should display correct tracker screen + ripple effect on about link', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        await withAndroidRequests(page, { requests: [] })
        await page.locator('[aria-label="View Tracker Companies"]').click()
        await playTimeline(page, ['state:cnn'])
        await expect(page.locator('"About our Web Tracking Protections"')).toHaveClass(/mdc-ripple-upgraded/)
    })
})

test.describe('breakage form', () => {
    test('should call android interface', async ({ page, androidMocks }) => {
        await page.locator('"Website not working as expected?"').click()
        // @ts-ignore
        const calls = await androidMocks.outgoing()
        expect(calls).toMatchObject([['showBreakageForm', undefined]])
    })
})

test.describe('open external links', () => {
    test('should call android interface for links', async ({ page, androidMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        await page.locator('"About our Web Tracking Protections"').click()
        // @ts-ignore
        const calls = await androidMocks.outgoing()
        expect(calls).toMatchObject([
            [
                'openInNewTab',
                JSON.stringify({
                    url: 'https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/',
                }),
            ],
        ])
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        forwardConsole(page)
        await page.goto(HTML)
        await withAndroidRequests(
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
        await withAndroidRequests(
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
