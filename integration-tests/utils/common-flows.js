import { test } from '@playwright/test'
import { testDataStates } from '../../shared/js/ui/views/tests/states-with-fixtures'

/**
 * @param {(page: import("@playwright/test").Page) => Promise<import("../DashboardPage").DashboardPage>} dashboardFactory
 */
export function settingPermissions(dashboardFactory) {
    test('permissions toggles', async ({ page }) => {
        const dash = await dashboardFactory(page)
        await dash.addState([testDataStates.permissions])
        await dash.screenshot('permissions.png')
        await dash.setsCameraPermissionTo('grant')
        await dash.mocks.calledForSettingPermissions({ permission: 'camera', value: 'grant' })
    })
}
