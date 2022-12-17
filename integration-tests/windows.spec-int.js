import { test } from '@playwright/test'
import { dataStates } from '../shared/js/ui/views/tests/generate-data'
import { DashboardPage } from './DashboardPage'

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.windows(page)
        await dash.addStates([dataStates['04']])
        await dash.showsPrimaryScreen()
    })
})

test.describe('breakage form', () => {
    test('should submit with no values', async ({ page }) => {
        const dash = await DashboardPage.windows(page)
        await dash.addStates([dataStates['04']])
        await dash.clickReportBreakage()
        await dash.screenshot('breakage-form.png')
        await dash.submitBreakageForm()
        await dash.mocks.calledForSubmitBreakageForm()
        await dash.screenshot('breakage-form-message.png')
    })
})

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page }) => {
        const dash = await DashboardPage.windows(page)
        await dash.addStates([dataStates['04']])
        await dash.mocks.calledForInitialHeight()
    })
})

test.describe('Protections toggle', () => {
    test('pressing toggle should disable protections', async ({ page }) => {
        const dash = await DashboardPage.windows(page)
        await dash.addStates([dataStates['04']])
        await dash.toggleProtectionsOff()
        await page.waitForTimeout(500) // todo(Shane): remove this
        await dash.mocks.calledForToggleAllowList()
    })
})

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.windows(page)
            await dash.addStates([dataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
        })
    })
    test.describe('configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.windows(page)
            await dash.addStates([dataStates['consent-managed-configurable']])
            await dash.indicatesCookiesWereManaged()
        })
        test('secondary screen', async ({ page }) => {
            const dash = await DashboardPage.windows(page)
            await dash.addStates([dataStates['consent-managed-configurable']])
            await dash.viewCookiePromptManagement()
            await dash.disableCookiesInSettings()
            await dash.mocks.calledForOpenSettings()
        })
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
                const dash = await DashboardPage.windows(page)
                await dash.screenshotEachScreenForState(name, state)
            })
        }
    })
}
