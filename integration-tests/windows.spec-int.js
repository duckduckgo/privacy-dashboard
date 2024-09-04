import { test } from '@playwright/test'
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures'
import { DashboardPage } from './DashboardPage'
import { desktopBreakageForm, settingPermissions, toggleFlows } from './utils/common-flows'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.windows(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.showsPrimaryScreen()
    })
})

test.describe('breakage form', () => {
    desktopBreakageForm((page) => DashboardPage.windows(page))
})

test.describe('opening breakage form', () => {
    test('shows breakage form only', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'breakageForm' })
        await dash.addState([testDataStates.google])
        await dash.breakageFormIsVisible()
        await dash.screenshot('screen-breakage-form.png', { skipInCI: true })
        await dash.showsOnlyCloseButton()
    })
})

test.describe('Protections toggle', () => {
    toggleFlows((page) => DashboardPage.windows(page))
})

test.describe('permissions', () => {
    settingPermissions((page) => DashboardPage.windows(page))
})

test('invalid certificate shows as insecure', { tag: '@screenshots' }, async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.windows(page)
    await dash.addState([testDataStates['https-with-invalid-certificate']])
    await dash.screenshot('invalid-cert.png')
    await dash.hasInvalidCertText()
    await dash.viewConnection()
    await dash.screenshot('invalid-detail.png')
    await dash.showsInvalidCertDetail()
})

test('upgraded requests without certs always show as secure', { tag: '@screenshots' }, async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.windows(page)
    await dash.addState([testDataStates['upgraded+secure+without-certs']])
    await dash.screenshot('upgraded-missing-certs.png')
})

test('upgraded requests with invalid certs always show as insecure', { tag: '@screenshots' }, async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.windows(page)
    await dash.addState([testDataStates['upgraded-with-invalid-cert']])
    await dash.screenshot('upgraded-invalid-cert.png')
    await dash.hasInvalidCertText()
    await dash.viewConnection()
    await dash.screenshot('upgraded-invalid-detail.png')
    await dash.showsInvalidCertDetail()
})

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page }) => {
        const dash = await DashboardPage.windows(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.mocks.calledForInitialHeight()
    })
})

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.windows(page)
            await dash.addState([testDataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
        })
    })
    test.describe('configurable', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.indicatesCookiesWereManaged()
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.viewCookiePromptManagement()
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.indicatesCookiesWereHidden()
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.viewCookiePromptManagement()
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
    })
})

test.describe('windows screenshots', { tag: '@screenshots' }, () => {
    const states = [
        { name: 'ad-attribution', state: testDataStates['ad-attribution'] },
        { name: 'new-entities', state: testDataStates['new-entities'] },
        { name: 'upgraded+secure', state: testDataStates['upgraded+secure'] },
        { name: 'google-off', state: testDataStates['google-off'] },
        { name: 'cnn', state: testDataStates.cnn },
    ]
    test.describe('states', () => {
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                await page.emulateMedia({ reducedMotion: 'reduce' })
                const dash = await DashboardPage.windows(page)
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
})
