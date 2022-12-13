import { test } from '@playwright/test'
import { dataStates } from '../shared/js/ui/views/tests/generate-data'
import { DashboardPage } from './DashboardPage'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.macos(page)
        await dash.addStates([dataStates['04']])
        await dash.showsPrimaryScreen()
    })
})

test.describe('breakage form', () => {
    test('should show HTML breakage form and submit fields', async ({ page }) => {
        const dash = await DashboardPage.macos(page)
        await dash.addStates([dataStates['04']])
        await dash.clickReportBreakage()
        await dash.screenshot('breakage-form.png')
        await dash.submitBreakageForm()
        await dash.mocks.calledForSubmitBreakageForm()
        await dash.screenshot('breakage-form-message.png')
    })
})

test.describe('open external links', () => {
    test('should call webkit interface for external links', async ({ page }) => {
        const dash = await DashboardPage.macos(page)
        await dash.addStates([dataStates['04']])
        await dash.viewTrackerCompanies()
        await dash.clickAboutLink()
        await dash.mocks.calledForAboutLink()
    })
})

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page }) => {
        const dash = await DashboardPage.macos(page)
        await dash.addStates([dataStates['04']])
        await dash.mocks.calledForInitialHeight()
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
                const dash = await DashboardPage.macos(page)
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
    test.describe('screenshots for cookies', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.macos(page)
            await dash.addStates([dataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
            await dash.screenshot('consent-managed.png')
        })
    })
}
