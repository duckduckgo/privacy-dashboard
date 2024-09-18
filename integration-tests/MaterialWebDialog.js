import { expect } from '@playwright/test'

export class MaterialWebDialog {
    /**
     * @param {import('./DashboardPage').DashboardPage} dash
     */
    constructor(dash) {
        this.dash = dash
    }

    async usesMaterialWebDialog() {
        const { page } = this.dash
        await page.getByTestId('select-click-capture').click()

        // waiting for the modal to load + be open
        await page.locator('md-dialog[open]').waitFor({ timeout: 1000 })

        // de-select any items/focus-rungs
        await page.locator('[slot="headline"]').click()

        // Capture screenshot of the dialog
        await this.dash.screenshot('material-dialog.png')

        // Click the Cancel button to close the dialog
        await page.getByRole('button', { name: 'Cancel' }).click()

        // Re-open the dialog
        await page.getByTestId('select-click-capture').click()

        // Inside the modal, select an item
        await page.getByLabel('Something else').locator('#input').check()

        // Click the OK button in the modal
        await page.getByRole('button', { name: 'OK' }).click()

        // Verify the selected value in the page is "other"
        const value = await page.locator('select').inputValue()
        expect(value).toBe('other')

        // now submit the form
        await this.dash.submitBreakageForm()

        // and verify the expected value was sent to the native side
        await this.dash.mocks.calledForSubmitBreakageForm({ category: 'other', description: '' })
    }

    async usesTheDefaultSelect() {
        const { page } = this.dash
        expect(await page.getByTestId('select-click-capture').count()).toBe(0)
        expect(await page.locator('md-dialog').count()).toBe(0)
    }
}
