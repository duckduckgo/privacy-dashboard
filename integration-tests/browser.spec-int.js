import { expect, test } from '@playwright/test'
import { MockData, mockBurnOptions, mockToExtensionDashboardMessage } from '../shared/js/ui/views/tests/generate-data.mjs'
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures'
import { DashboardPage } from './DashboardPage'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.showsPrimaryScreen()
        await dash.mocks.calledForInitialExtensionMessage()
    })
})

test.describe('breakage form', () => {
    test('should submit with no values', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.addStates([testDataStates.protectionsOn])
        await dash.clickReportBreakage()
        await dash.screenshot('breakage-form.png')
        await dash.submitBreakageForm()
        await dash.mocks.calledForSubmitBreakageForm()
        await dash.screenshot('breakage-form-message.png')
    })
    test('should submit with description', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.addStates([testDataStates.protectionsOn])
        await dash.clickReportBreakage()
        await dash.enterBreakageSubscription('Video not playing')
        await dash.submitBreakageForm()
        await dash.mocks.calledForSubmitBreakageForm({
            category: '',
            description: 'Video not playing',
        })
    })
    test('should submit with category', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.addStates([testDataStates.protectionsOn])
        const optionToSelect = "Video didn't play"
        await dash.clickReportBreakage()
        await dash.selectBreakageCategory(optionToSelect)
        await dash.submitBreakageForm()
        await dash.mocks.calledForSubmitBreakageForm({
            category: 'videos',
            description: '',
        })
    })
})

test.describe('Protections toggle', () => {
    test.describe('when a site is NOT allowlisted', () => {
        test('then pressing toggle should disable protections', async ({ page }) => {
            const mock = new MockData({ url: 'https://example.com' })
            const messages = mockToExtensionDashboardMessage(mock)
            const dash = await DashboardPage.browser(page, messages)
            await dash.addStates([testDataStates.protectionsOn])
            await dash.toggleProtectionsOff()
            await page.waitForTimeout(500) // todo(Shane): remove this
            await dash.mocks.calledForToggleAllowList('protections-off')
        })
    })
    test.describe('When the site is already allowlisted', () => {
        test('then pressing the toggle re-enables protections', async ({ page }) => {
            const mock = new MockData({ url: 'https://example.com', allowlisted: true })
            const messages = mockToExtensionDashboardMessage(mock)
            const dash = await DashboardPage.browser(page, messages)
            await dash.addStates([testDataStates.protectionsOn])
            await dash.toggleProtectionsOn()
            await page.waitForTimeout(500) // todo(Shane): remove this
            await dash.mocks.calledForToggleAllowList('protections-on')
        })
    })
    test.describe('When the site has content blocking disabled', () => {
        test('then pressing the toggle re-enables protections (overriding our decision)', async ({ page }) => {
            const mock = new MockData({ url: 'https://example.com', contentBlockingException: true })
            const messages = mockToExtensionDashboardMessage(mock)
            const dash = await DashboardPage.browser(page, messages)
            await dash.addStates([testDataStates.protectionsOn])
            await dash.toggleProtectionsOn()
            await page.waitForTimeout(500) // todo(Shane): remove this
            await dash.mocks.calledForToggleAllowList('protections-on-override')
        })
    })
})

test.describe('special page (cta)', () => {
    test('should render correctly', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com', specialDomainName: true, emailUser: true })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.showingCTA()
    })
})

test.describe('search', () => {
    test('should not lose text when re-render occurs', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        const term = 'nike'
        await dash.enterSearchText(term)
        await dash.addStates([testDataStates.protectionsOn])
        await dash.searchContainsText(term)
        await dash.submitSearch()
        await dash.mocks.calledForSearch(term)
    })
})

test.describe('options', () => {
    test('should open options page', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.selectOptionsCog()
        await dash.mocks.calledForOptions()
    })
})

test.describe('tab data error', () => {
    test('should show an error screen', async ({ page }) => {
        // @ts-expect-error - this SHOULD error, that's the test
        const mock = new MockData({ url: 'https://example.com', requests: [{ foo: 'bar' }] })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.displayingError()
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com', localeSettings: { locale: 'pl' } })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.hasPolishLinkTextForConnectionInfo()
    })
})

test.describe('fire button', () => {
    test('by default no fire button is displayed', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock)
        const dash = await DashboardPage.browser(page, messages)
        await dash.showsPrimaryScreen()
        const buttons = await dash.fireButton().all()
        expect(buttons).toHaveLength(0)
    })

    test('adding firebutton option to dashboard message shows fire button', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock, true)
        const dash = await DashboardPage.browser(page, messages)
        await dash.fireButton().waitFor()
        expect(await dash.fireButton().isVisible()).toBeTruthy()
    })

    test('fire button menu: open and close', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock, true)
        const getBurnOptions = mockBurnOptions({ clearHistory: true, tabClearEnabled: true, pinnedTabs: 0 })
        const dash = await DashboardPage.browser(page, {
            ...messages,
            getBurnOptions,
        })
        await dash.fireButton().click()
        await page.locator('#fire-button-content').waitFor()
        // test cancel button
        await page.locator('#fire-button-cancel').click()
        expect(await page.$$('#fire-button-content')).toHaveLength(0)
    })

    test('fire button menu: history and tab clearing enabled', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock, true)
        const getBurnOptions = mockBurnOptions({ clearHistory: true, tabClearEnabled: true, pinnedTabs: 0 })
        const dash = await DashboardPage.browser(page, {
            ...messages,
            getBurnOptions,
        })
        await dash.fireButton().click()
        await page.locator('#fire-button-content').waitFor()
        await expect(page.locator('#fire-button-burn')).toHaveText('Close tabs and clear data')

        // check that dropdown options are populated
        await expect(page.locator('#fire-button-opts > option')).toHaveCount(getBurnOptions.options.length)
        // there should be two text sections: summary and a notice
        await expect(page.locator('#fire-button-summary > p')).toHaveCount(2)

        await page.locator('#fire-button-opts').selectOption({ index: 2 })
        await expect(page.locator('#fire-button-summary > p')).toHaveCount(1)
    })

    test('fire button menu: history clearing enabled', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock, true)
        const getBurnOptions = mockBurnOptions({ clearHistory: true, tabClearEnabled: false, pinnedTabs: 0 })
        const dash = await DashboardPage.browser(page, {
            ...messages,
            getBurnOptions,
        })
        await dash.fireButton().click()
        await page.locator('#fire-button-content').waitFor()
        await expect(page.locator('#fire-button-burn')).toHaveText('Clear data')
    })

    test('fire button menu: sends option parameters with burn message', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock, true)
        const getBurnOptions = mockBurnOptions({ clearHistory: true, tabClearEnabled: true, pinnedTabs: 0 })
        const dash = await DashboardPage.browser(page, {
            ...messages,
            getBurnOptions,
        })
        await dash.fireButton().click()
        await page.locator('#fire-button-content').waitFor()
        await page.locator('#fire-button-burn').click()
        const calls = await dash.mocks.outgoing({ names: ['doBurn'] })
        expect(calls).toStrictEqual([
            [
                'doBurn',
                {
                    messageType: 'doBurn',
                    options: getBurnOptions.options[0].options,
                },
            ],
        ])
    })

    test('fire button menu: sends option parameters of selected burn option', async ({ page }) => {
        const mock = new MockData({ url: 'https://example.com' })
        const messages = mockToExtensionDashboardMessage(mock, true)
        const getBurnOptions = mockBurnOptions({ clearHistory: true, tabClearEnabled: true, pinnedTabs: 0 })
        const dash = await DashboardPage.browser(page, {
            ...messages,
            getBurnOptions,
        })
        await dash.fireButton().click()
        await page.locator('#fire-button-content').waitFor()
        await page.locator('#fire-button-opts').selectOption({ index: 1 })
        await page.locator('#fire-button-burn').click()
        const calls = await dash.mocks.outgoing({ names: ['doBurn'] })
        expect(calls).toStrictEqual([
            [
                'doBurn',
                {
                    messageType: 'doBurn',
                    options: getBurnOptions.options[1].options,
                },
            ],
        ])
    })
})

if (!process.env.CI) {
    const states = [
        { name: 'ad-attribution', state: testDataStates['ad-attribution'] },
        { name: 'new-entities', state: testDataStates['new-entities'] },
        { name: 'upgraded+secure', state: testDataStates['upgraded+secure'] },
        { name: 'google-off', state: testDataStates['google-off'] },
        { name: 'cnn', state: testDataStates.cnn },
    ]
    test.describe('screenshots', () => {
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                const messages = mockToExtensionDashboardMessage(state)
                const dash = await DashboardPage.browser(page, messages)
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
}
