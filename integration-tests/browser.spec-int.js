import { test } from '@playwright/test'
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures'
import { DashboardPage } from './DashboardPage'
import { desktopBreakageForm, toggleFlows, toggleFlowsDenyList } from './utils/common-flows'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.showsPrimaryScreen()
        await dash.mocks.calledForInitialExtensionMessage()
    })
})

test.describe('breakage form', () => {
    desktopBreakageForm((page) => DashboardPage.browser(page))
})

test.describe('Protections toggle', () => {
    toggleFlows((page) => DashboardPage.browser(page))
})

test.describe('Protections toggle (extension specific)', () => {
    toggleFlowsDenyList((page) => DashboardPage.browser(page))
})

test.describe('special page (cta)', () => {
    test('should render correctly', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates['special-page']])
        await dash.showingCTA()
    })
})

test.describe('search', () => {
    test('should not lose text when re-render occurs', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates.protectionsOn])
        const term = 'nike'
        await dash.enterSearchText(term)
        await dash.addState([testDataStates.protectionsOn_blocked])
        await dash.searchContainsText(term)
        await dash.submitSearch()
        await dash.mocks.calledForSearch(term)
    })
})

test.describe('options', () => {
    test('should open options page', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.selectOptionsCog()
        await dash.mocks.calledForOptions()
    })
})

test.describe('tab data error', () => {
    test('should show an error screen', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates['invalid-data']])
        await dash.displayingError()
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates['locale-pl']])
        await dash.hasPolishLinkTextForConnectionInfo()
    })
})

test.describe('fire button', () => {
    test('by default no fire button is displayed', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates['fire-button-disabled']])
        await dash.showsPrimaryScreen()
        await dash.fireButtonDoesntShow()
    })

    test('adding firebutton option to dashboard message shows fire button', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates['fire-button-enabled']])
        await dash.fireButtonShows()
    })

    test('fire button menu: open and close', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates['fire-button-no-pinned']])
        await dash.clickFireButton()
        await dash.fireButtonCancelClosesDialog()
    })
    test('fire button menu: history and tab clearing enabled', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        const mock = testDataStates['fire-button-no-pinned']
        await dash.addState([mock])
        await dash.clickFireButton()
        await dash.fireDialogIsPopulatedFromOptions(mock.toBurnOptions())
    })
    test('fire button menu: history clearing enabled', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        await dash.addState([testDataStates['fire-button-tab-clear-disabled']])
        await dash.clickFireButton()
        await dash.fireDialogHistoryDisabled()
    })
    test('fire button menu: sends option parameters with burn message', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        const mock = testDataStates['fire-button-no-pinned']
        await dash.addState([mock])
        await dash.clickFireButton()
        await dash.clickFireButtonBurn()
        await dash.sendsOptionsWithBurnMessage(mock.toBurnOptions()?.options[0].options)
    })
    test('fire button menu: sends option parameters of selected burn option', async ({ page }) => {
        const dash = await DashboardPage.browser(page)
        const mock = testDataStates['fire-button-no-pinned']
        const [messages] = await dash.addState([mock])
        await dash.clickFireButton()
        await dash.chooseBurnOption(1)
        await dash.clickFireButtonBurn()
        await dash.sendsOptionsWithBurnMessage(messages.getBurnOptions.options[1].options)
    })
})

test.describe.skip('screenshots', { tag: '@screenshots' }, () => {
    const states = [
        { name: 'ad-attribution', state: testDataStates['ad-attribution'] },
        { name: 'new-entities', state: testDataStates['new-entities'] },
        { name: 'upgraded+secure', state: testDataStates['upgraded+secure'] },
        { name: 'google-off', state: testDataStates['google-off'] },
        { name: 'cnn', state: testDataStates.cnn },
        {
            name: 'fire-button',
            state: testDataStates['fire-button'],
        },
    ]
    for (const { name, state } of states) {
        test(name, async ({ page }) => {
            const dash = await DashboardPage.browser(page)
            await dash.addState([state])
            await dash.screenshotEachScreenForState(name, state, { maxDiffPixels: 100 })
        })
    }
})
