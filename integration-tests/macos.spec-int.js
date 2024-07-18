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

test('invalid/missing certificate', async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.webkit(page, { platform: 'macos' })
    await dash.addState([testDataStates['https-without-certificate']])
    await dash.screenshot('invalid-cert.png')
    await dash.hasInvalidCertText()
    await dash.viewConnection()
    await dash.screenshot('invalid-detail.png')
    await dash.showsInvalidCertDetail()
})

test('insecure certificate', async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.webkit(page, { platform: 'macos' })
    await dash.addState([testDataStates['insecure']])
    await dash.hasInsecureText()
    await dash.viewConnection()
    await dash.hasInsecureTextDetail()
})

test.describe('opening breakage form', () => {
    test('shows breakage form only', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'macos' })
        await dash.addState([testDataStates.google])
        await dash.breakageFormIsVisible()
        await dash.showsOnlyCloseButton('breakageForm')
        await dash.selectClose('breakageForm')
        await dash.screenshot('screen-breakage-form.png')
        await dash.mocks.calledForClose({ screen: 'breakageForm' })
    })
    test('shows toggle report when opened from menu', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'menu' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.showsOnlyCloseButton('toggleReport')
        await dash.selectClose('toggleReport')
        await dash.screenshot('screen-toggle-report-menu.png')
        await dash.mocks.calledForClose({ screen: 'toggleReport' })
    })
    test('shows toggle report when opened from dashboard', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.screenshot('screen-toggle-report-dashboard.png')
        await dash.closeButtonIsHidden('toggleReport')
    })
    test('sends toggle report', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.sendToggleReport()

        // this is macOS specific:
        await dash.showsSuccessScreen()
        await dash.screenshot('screen-toggle-report-sent.png')
        await dash.clickingSuccessScreenClosesDashboard()
    })
    test('rejects toggle report', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.rejectToggleReport()
    })
    test('shows information', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.showsInformation()
        await dash.mocks.calledForSeeWhatsSent()
        await dash.screenshot('screen-toggle-report-show.png')
        await dash.hidesInformation()
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
