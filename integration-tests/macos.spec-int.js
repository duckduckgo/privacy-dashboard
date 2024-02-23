import { test } from '@playwright/test'
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures'
import { DashboardPage } from './DashboardPage'
import { desktopBreakageForm, settingPermissions, toggleFlows } from './utils/common-flows'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' })
        await dash.addState([testDataStates.protectionsOn])
        await dash.showsPrimaryScreen()
    })
})

test.describe('breakage form', () => {
    desktopBreakageForm((page) => DashboardPage.webkit(page, { platform: 'macos' }))
})

test.describe('Protections toggle', () => {
    toggleFlows((page) => DashboardPage.webkit(page, { platform: 'macos' }))
})

test.describe('permissions', () => {
    settingPermissions((page) => DashboardPage.webkit(page, { platform: 'macos' }))
})

test.describe('opening breakage form', () => {
    test('shows breakage form only', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'macos' })
        await dash.addState([testDataStates.google])
        await dash.breakageFormIsVisible()
        await dash.showsOnlyCloseButton()
        await dash.selectClose()
        await dash.mocks.calledForClose()
    })
    test('shows simple breakage report when opened from menu', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'simpleBreakageReport', platform: 'macos', opener: 'menu' })
        await dash.addState([testDataStates.google])
        await dash.simpleBreakageReportIsVisible()
        await dash.showsOnlyCloseButton()
        await dash.selectClose()
        await dash.mocks.calledForClose()
    })
    test('shows simple breakage report when opened from dashboard', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'simpleBreakageReport', platform: 'macos', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.simpleBreakageReportIsVisible()
        await dash.closeButtonIsHidden()
    })
    test('sends simple breakage form', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'simpleBreakageReport', platform: 'macos', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.simpleBreakageReportIsVisible()
        await dash.sendSimpleBreakageReport()
    })
    test('rejects simple breakage form', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'simpleBreakageReport', platform: 'macos', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.simpleBreakageReportIsVisible()
        await dash.rejectSimpleBreakageReport()
    })
})

test.describe('open external links', () => {
    test('should call webkit interface for external links', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' })
        await dash.addState([testDataStates.protectionsOn])
        await dash.viewTrackerCompanies()
        await dash.clickAboutLink()
        await dash.mocks.calledForAboutLink()
    })
})

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' })
        await dash.addState([testDataStates.protectionsOn])
        await dash.mocks.calledForInitialHeight()
    })
})

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' })
            await dash.addState([testDataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
        })
    })
    test.describe('configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' })
            await dash.addState([testDataStates['consent-managed-configurable']])
            await dash.indicatesCookiesWereManaged()
        })
        test('secondary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' })
            await dash.addState([testDataStates['consent-managed-configurable']])
            await dash.viewCookiePromptManagement()
            await dash.disableCookiesInSettings()
            await dash.mocks.calledForOpenSettings()
        })
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
                const dash = await DashboardPage.webkit(page, { platform: 'macos' })
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
    test.describe('screenshots for cookies (none-configurable)', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' })
            await dash.addState([testDataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
            await dash.screenshot('consent-managed.png')
        })
    })
    test.describe('screenshots for cookies (configurable)', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' })
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.indicatesCookiesWereManaged()
                await dash.screenshot('consent-managed-configurable.png')
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' })
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.viewCookiePromptManagement()
                await dash.screenshot('consent-managed-configurable-secondary.png')
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' })
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.indicatesCookiesWereHidden()
                await dash.screenshot('consent-managed-configurable-primary-cosmetic.png')
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' })
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.viewCookiePromptManagement()
                await dash.screenshot('consent-managed-configurable-secondary-cosmetic.png')
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
    })
}
