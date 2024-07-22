import { test } from '@playwright/test'
import { testDataStates } from '../../shared/js/ui/views/tests/states-with-fixtures'

/**
 * @param {(page: import("@playwright/test").Page) => Promise<import("../DashboardPage").DashboardPage>} dashboardFactory
 */
export function toggleFlows(dashboardFactory) {
    test('pressing toggle should disable protections', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates.protectionsOn])
        await dash.showsAlternativeLayout()
        await dash.toggleProtectionsOff()
        await dash.mocks.calledForToggleAllowList()
    })
    test('with alternative primary screen - toggling protections', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates['alternative-layout-exp-1']])
        await dash.showsAlternativeLayout()
        await dash.toggleProtectionsOff()
        await dash.mocks.calledForToggleAllowList()
    })
    test('with alternative primary screen - alternative-layout-exp-1', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates['alternative-layout-exp-1']])
        await dash.showsAlternativeLayout()
        await dash.clicksWebsiteNotWorking()
        await dash.mocks.calledForShowBreakageForm()
    })
    test('with alternative primary screen - alternative-layout-exp-1 protections off (allowlisted)', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates['alternative-layout-exp-1-protections-off']])
        await dash.showsAlternativeLayout()
    })
    test('with alternative primary screen - alternative-layout-exp-1 remote disabled', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates['alternative-layout-exp-1-disabled']])
        await dash.showsAlternativeLayout()
        await dash.showRemoteDisabled()
        await dash.clicksWebsiteNotWorking()
        await dash.mocks.calledForShowBreakageForm()
    })
}

/**
 * @param {(page: import("@playwright/test").Page) => Promise<import("../DashboardPage").DashboardPage>} dashboardFactory
 */
export function toggleFlowsDenyList(dashboardFactory) {
    test('then pressing the toggle re-enables protections (overriding our decision)', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates.protectionsOff])
        await dash.toggleProtectionsOn()
        await dash.mocks.calledForToggleAllowList('protections-on-override')
    })
}

/**
 * @param {(page: import("@playwright/test").Page) => Promise<import("../DashboardPage").DashboardPage>} dashboardFactory
 */
export function desktopBreakageForm(dashboardFactory) {
    test('should show HTML breakage form and submit fields', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates.protectionsOn])
        await dash.showsAlternativeLayout()
        await dash.clicksWebsiteNotWorking()
        await dash.screenshot('breakage-form.png', { maxDiffPixels: 100 })
        await dash.enterBreakageSubscription('TEST')
        await dash.selectBreakageCategory(`Video didn’t play or load`)
        await dash.submitBreakageForm()
        await dash.screenshot('breakage-form-message.png', { maxDiffPixels: 100 })
        await dash.mocks.calledForSubmitBreakageForm({ category: 'videos', description: 'TEST' })
    })
    test('toggling protections off from breakage form', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates.protectionsOn])
        await dash.clicksWebsiteNotWorking()

        /** @type {import('../../schema/__generated__/schema.types').EventOrigin} */
        const eventOrigin = { screen: 'breakageForm' }
        await dash.toggleProtectionsOff(eventOrigin)
        await dash.mocks.calledForToggleAllowList('protections-off', eventOrigin)
    })
    test('toggling protections back on, from breakage form', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates.allowlisted])
        await dash.clicksWebsiteNotWorking()
        /** @type {import('../../schema/__generated__/schema.types').EventOrigin} */
        const eventOrigin = { screen: 'breakageForm' }
        await dash.screenshot('breakage-form-allowlisted.png', { maxDiffPixels: 100 })
        await dash.toggleProtectionsOn(eventOrigin)
    })
    test('broken (remote disabled) breakage form', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates.protectionsOff])
        await dash.clicksWebsiteNotWorking()
        await dash.screenshot('breakage-form-broken.png', { maxDiffPixels: 100 })
    })
}

/**
 * @param {(page: import("@playwright/test").Page) => Promise<import("../DashboardPage").DashboardPage>} dashboardFactory
 */
export function settingPermissions(dashboardFactory) {
    test('permissions toggles', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.addState([testDataStates.permissions])
        await dash.screenshot('permissions.png', { maxDiffPixels: 100 })
        await dash.setsCameraPermissionTo('grant')
        await dash.mocks.calledForSettingPermissions({ permission: 'camera', value: 'grant' })
    })
}
