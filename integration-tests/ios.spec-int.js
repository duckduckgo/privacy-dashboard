import { test } from '@playwright/test'
import { dataStates } from '../shared/js/ui/views/tests/generate-data'
import { DashboardPage } from './DashboardPage'

test.describe('page data (no trackers)', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['04']])
        await dash.showsPrimaryScreen()
    })
    test('should accept updates when on trackers list screen', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['04']])
        await dash.viewTrackerCompanies()
        await dash.screenshot('tracker-list-before.png')
        await dash.addStates([dataStates.cnn])
        await dash.waitForCompanyName('Google LLC')
        await dash.screenshot('tracker-list-after.png')
    })
    test('should accept updates when on non-trackers list screen', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['04']])
        await dash.viewThirdParties()
        await dash.screenshot('non-tracker-list-before.png')
        await dash.addStates([dataStates.cnn])
        await dash.waitForCompanyName('Google LLC')
        await dash.screenshot('non-tracker-list-after.png')
    })
    test('does not alter the appearance of connection panel', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['04']])
        await dash.viewConnection()
        await dash.screenshot('connection-before.png')
        await dash.addStates([dataStates.cnn])
        await dash.screenshot('connection-before.png')
    })
})

test.describe('page data (with trackers)', () => {
    test('should display correct primary screen', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates.cnn])
        await dash.showsPrimaryScreen()
        await dash.screenshot('primary-screen.png')
    })
})

test.describe('breakage form', () => {
    test('should call webkit interface and not use HTML form', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates.cnn])
        await dash.clickReportBreakage()
        await dash.mocks.calledForShowBreakageForm()
    })
})

test.describe('open external links', () => {
    test('should call ios interface for links', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['04']])
        await dash.viewTrackerCompanies()
        await dash.clickAboutLink()
        await dash.mocks.calledForAboutLink()
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['locale-pl']])
        await dash.hasPolishLinkTextForConnectionInfo()
    })
    test('should load with `fr` locale', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['locale-fr']])
        await dash.hasFrenchLinkTextForConnectionInfo()
    })
})

test.describe('Close', () => {
    test('pressing close should call native API on iOS', async ({ page }) => {
        const dash = await DashboardPage.ios(page)
        await dash.addStates([dataStates['04']])
        await dash.clickClose()
        await dash.mocks.calledForClose()
    })
})

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.ios(page)
            await dash.addStates([dataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
        })
    })
    test.describe('configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.ios(page)
            await dash.addStates([dataStates['consent-managed-configurable']])
            await dash.indicatesCookiesWereManaged()
        })
        test('secondary screen', async ({ page }) => {
            const dash = await DashboardPage.ios(page)
            await dash.addStates([dataStates['consent-managed-configurable']])
            await dash.viewCookiePromptManagement()
            await dash.disableCookiesInSettings()
            await dash.mocks.calledForOpenSettings()
        })
    })
})

if (!process.env.CI) {
    const states = [
        { name: '01', state: dataStates['01'] },
        { name: '02', state: dataStates['02'] },
        { name: '03', state: dataStates['03'] },
        { name: '04', state: dataStates['04'] },
        { name: '05', state: dataStates['05'] },
        { name: 'ad-attribution', state: dataStates['ad-attribution'] },
        { name: 'new-entities', state: dataStates['new-entities'] },
        { name: 'upgraded+secure', state: dataStates['upgraded+secure'] },
        { name: 'google-off', state: dataStates['google-off'] },
        { name: 'cnn', state: dataStates.cnn },
    ]
    test.describe('screenshots', () => {
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                const dash = await DashboardPage.ios(page)
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
}
