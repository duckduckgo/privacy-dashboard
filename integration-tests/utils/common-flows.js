import { test } from '@playwright/test';
import { testDataStates } from '../../shared/js/ui/views/tests/states-with-fixtures';

/**
 * @typedef {import("../../shared/js/ui/views/tests/generate-data.mjs").MockData} MockData
 * @typedef {(page: import("@playwright/test").Page, firstState: MockData) => Promise<import("../DashboardPage").DashboardPage>} DashboardFactory
 */

/**
 * @param {DashboardFactory} dashboardFactory
 */
export function toggleFlows(dashboardFactory) {
    test('pressing toggle should disable protections', async ({ page }) => {
        const dash = await dashboardFactory(page, testDataStates.protectionsOn);
        await dash.reducedMotion();
        await dash.addState([testDataStates.protectionsOn]);
        await dash.showsAlternativeLayout();
        await dash.toggleProtectionsOff();
        await dash.mocks.calledForToggleAllowList();
    });
    test('with alternative primary screen - toggling protections', async ({ page }) => {
        const dash = await dashboardFactory(page, testDataStates['alternative-layout-exp-1']);
        await dash.reducedMotion();
        await dash.addState([testDataStates['alternative-layout-exp-1']]);
        await dash.showsAlternativeLayout();
        await dash.toggleProtectionsOff();
        await dash.mocks.calledForToggleAllowList();
    });
    test('with alternative primary screen - alternative-layout-exp-1', async ({ page }) => {
        const dash = await dashboardFactory(page, testDataStates['alternative-layout-exp-1']);
        await dash.reducedMotion();
        await dash.addState([testDataStates['alternative-layout-exp-1']]);
        await dash.showsAlternativeLayout();
        await dash.clicksWebsiteNotWorking();
        await dash.mocks.calledForShowBreakageForm();
    });
    test('with alternative primary screen - alternative-layout-exp-1 protections off (allowlisted)', async ({ page }) => {
        const dash = await dashboardFactory(page, testDataStates['alternative-layout-exp-1']);
        await dash.reducedMotion();
        await dash.addState([testDataStates['alternative-layout-exp-1-protections-off']]);
        await dash.showsAlternativeLayout();
    });
    test('with alternative primary screen - alternative-layout-exp-1 remote disabled', async ({ page }) => {
        const dash = await dashboardFactory(page, testDataStates['alternative-layout-exp-1-disabled']);
        await dash.reducedMotion();
        await dash.addState([testDataStates['alternative-layout-exp-1-disabled']]);
        await dash.showsAlternativeLayout();
        await dash.showRemoteDisabled();
        await dash.clicksWebsiteNotWorking();
        await dash.mocks.calledForShowBreakageForm();
    });
}

/**
 * @param {DashboardFactory} dashboardFactory
 */
export function toggleFlowsDenyList(dashboardFactory) {
    test('then pressing the toggle re-enables protections (overriding our decision)', async ({ page }) => {
        const dash = await dashboardFactory(page, testDataStates.protectionsOff);
        await dash.reducedMotion();
        await dash.addState([testDataStates.protectionsOff]);
        await dash.toggleProtectionsOn();
        await dash.mocks.calledForToggleAllowList('protections-on-override');
    });
}

/**
 * @param {DashboardFactory} dashboardFactory
 */
export function settingPermissions(dashboardFactory) {
    test('permissions toggles', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await dashboardFactory(page, testDataStates.permissions);
        await dash.addState([testDataStates.permissions]);
        await dash.screenshot('permissions.png', { skipInCI: true });
        await dash.setsCameraPermissionTo('grant');
        await dash.mocks.calledForSettingPermissions({ permission: 'camera', value: 'grant' });
    });
}
