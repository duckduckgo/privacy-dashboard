import { test } from '@playwright/test'
import { dataStates } from '../shared/js/ui/views/tests/generate-data'
import { DashboardPage } from './DashboardPage'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates['04']])
        await dash.showsPrimaryScreen()
    })
})

test.describe('page data (with trackers)', () => {
    test('should display correct primary screen', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates.cnn])
        await dash.showsPrimaryScreen()
        await dash.screenshot('primary-cnn.png')
    })
    test('should display correct tracker screen + ripple effect on about link', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates.cnn])
        await dash.viewTrackerCompanies()
        await dash.aboutLinkHasRipple()
    })
})

test.describe('breakage form', () => {
    test('should call android interface', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates.cnn])
        await dash.clickReportBreakage()
        await dash.mocks.calledForShowBreakageForm()
    })
})

test.describe('open external links', () => {
    test('should call android interface for links', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates['04']])
        await dash.viewTrackerCompanies()
        await dash.clickAboutLink()
        await dash.mocks.calledForAboutLink()
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates['locale-pl']])
        await dash.hasPolishLinkTextForConnectionInfo()
    })
    test('should load with `fr` locale', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates['locale-fr']])
        await dash.hasFrenchLinkTextForConnectionInfo()
    })
})

test.describe('Protections toggle', () => {
    test('pressing toggle should disable protections', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates['04']])
        await dash.toggleProtectionsOff()
        await page.waitForTimeout(500) // todo(Shane): remove this
        await dash.mocks.calledForToggleAllowList()
    })
})

test.describe('Close', () => {
    test('pressing close should call native API', async ({ page }) => {
        const dash = await DashboardPage.android(page)
        await dash.addStates([dataStates['04']])
        await dash.clickClose()
        await dash.mocks.calledForClose()
    })
})

if (!process.env.CI) {
    const states = [
        { name: 'ad-attribution', state: dataStates['ad-attribution'] },
        { name: 'new-entities', state: dataStates['new-entities'] },
        { name: 'upgraded+secure', state: dataStates['upgraded+secure'] },
        { name: 'google-off', state: dataStates['google-off'] },
        { name: 'cnn', state: dataStates.cnn },
    ]
    test.describe('screenshots', () => {
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                const dash = await DashboardPage.android(page)
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
    test.describe('screenshots for cookies', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.android(page)
            await dash.addStates([dataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
            await dash.screenshot('consent-managed.png')
        })
    })
}
