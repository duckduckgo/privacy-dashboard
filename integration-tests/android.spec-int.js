import { test } from '@playwright/test'
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures'
import { DashboardPage } from './DashboardPage'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.showsPrimaryScreen()
    })
})

test.describe('page data (with trackers)', () => {
    test('should display correct primary screen', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates.cnn])
        await dash.showsPrimaryScreen()
        await dash.screenshot('primary-cnn.png')
    })
    test('should display correct tracker screen + ripple effect on about link', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates.cnn])
        await dash.viewTrackerCompanies()
        await dash.aboutLinkHasRipple()
    })
})

test.describe('breakage form', () => {
    test('should call android interface', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates.cnn])
        await dash.clickReportBreakage()
        await dash.mocks.calledForShowBreakageForm()
    })
})

test.describe('open external links', () => {
    test('should call android interface for links', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.viewTrackerCompanies()
        await dash.clickAboutLink()
        await dash.mocks.calledForAboutLink()
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates['locale-pl']])
        await dash.hasPolishLinkTextForConnectionInfo()
    })
    test('should load with `fr` locale', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates['locale-fr']])
        await dash.hasFrenchLinkTextForConnectionInfo()
    })
})

test.describe('Protections toggle', () => {
    test('pressing toggle should disable protections', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.toggleProtectionsOff()
        await page.waitForTimeout(500) // todo(Shane): remove this
        await dash.mocks.calledForToggleAllowList()
    })
})

test.describe('Close', () => {
    test('pressing close should call native API', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.clickClose()
        await dash.mocks.calledForClose()
    })
})

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.android(page)
            await dash.addState([testDataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
        })
    })
    test.describe('configurable', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.indicatesCookiesWereManaged()
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.viewCookiePromptManagement()
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.indicatesCookiesWereHidden()
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.viewCookiePromptManagement()
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
    })
})

if (!process.env.CI) {
    test.describe('screenshots', () => {
        const states = [
            { name: 'ad-attribution', state: testDataStates['ad-attribution'] },
            { name: 'new-entities', state: testDataStates['new-entities'] },
            { name: 'upgraded+secure', state: testDataStates['upgraded+secure'] },
            { name: 'google-off', state: testDataStates['google-off'] },
            { name: 'cnn', state: testDataStates.cnn },
        ]
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                const dash = await DashboardPage.android(page)
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
    test.describe('screenshots for cookies (non-configurable)', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.android(page)
            await dash.addState([testDataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
            await dash.screenshot('consent-managed.png')
        })
    })
    test.describe('screenshots for cookies (configurable)', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.macos(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.indicatesCookiesWereManaged()
                await dash.screenshot('consent-managed-configurable.png')
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.macos(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.viewCookiePromptManagement()
                await dash.screenshot('consent-managed-configurable-secondary.png')
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.macos(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.indicatesCookiesWereHidden()
                await dash.screenshot('consent-managed-configurable-primary-cosmetic.png')
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.macos(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.viewCookiePromptManagement()
                await dash.screenshot('consent-managed-configurable-secondary-cosmetic.png')
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
            })
        })
    })
}
