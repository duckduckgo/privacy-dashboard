import { test as baseTest, expect } from '@playwright/test'
import { forwardConsole, withWindowsRequests } from './helpers'

const HTML = '/build/app/html/windows.html'

const test = baseTest.extend({
    windowsMocks: [
        async ({ page }, use) => {
            forwardConsole(page)
            const requests = await withWindowsRequests(page, {
                requests: [],
            })
            await page.goto(HTML)
            await requests.deliverInitial()
            await use(requests)
        },
        // @ts-ignore
        { auto: true },
    ],
})

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page, windowsMocks }) => {
        // @ts-ignore
        await windowsMocks.outgoing({ names: [] })
        await page.locator('"No Tracking Requests Found"').waitFor({ timeout: 500 })
    })
})

test.describe('breakage form', () => {
    test('should submit with no values', async ({ page, windowsMocks }) => {
        await page.locator('"Website not working as expected?"').click()
        await page.locator('"Send Report"').click()
        // @ts-ignore
        const out = await windowsMocks.outgoing({
            names: ['SubmitBrokenSiteReport'],
        })
        expect(out).toMatchObject([
            {
                Feature: 'PrivacyDashboard',
                Name: 'SubmitBrokenSiteReport',
                Data: {
                    category: '',
                    description: '',
                },
            },
        ])
    })
})

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page, windowsMocks }) => {
        await page.locator('"No Tracking Requests Found"').click()
        // @ts-ignore
        const calls = await windowsMocks.outgoing({ names: ['SetSize'] })
        expect(calls.length).toBe(2)
    })
})
