export class AltBreakageFlows {
    /**
     * @param {import('./DashboardPage').DashboardPage} dash
     */
    constructor(dash) {
        this.dash = dash
    }

    /**
     * @param {string} text
     * @param {string} category
     */
    async selectsCategory(text, category) {
        const { page } = this.dash
        await page.getByLabel(text).click()

        await this.dash.mocks.didSendTelemetry({
            screen: 'categorySelection',
            attributes: {
                name: 'categorySelected',
                value: /** @type {any} */ (category),
            },
        })
    }

    /**
     * @param {string} category
     */
    async submitsFormWithCategory(category) {
        const { page } = this.dash
        await page.getByRole('button', { name: 'Send Report' }).click()
        await this.dash.mocks.calledForSubmitBreakageForm({ category: category })
    }

    async submitsForm() {
        const { page } = this.dash
        await page.getByRole('button', { name: 'Send Report' }).click()
    }

    async showsReportFromPrimaryScreen() {
        const { page } = this.dash
        await page.getByRole('link', { name: 'Website not working?' }).click()
        await page.getByText("What's not working on this").waitFor({ timeout: 1000 })
    }

    async reportsWhenStartingFromCategoryTypeSelection() {
        const { page } = this.dash
        await page.getByLabel('The site is not working as').click()
        await page.getByLabel('Site layout broken').click()
        await this.dash.screenshot('category-inline-toggle.png')
        await page.getByRole('link', { name: 'Skip this step' }).click()
        await page.getByRole('button', { name: 'Send Report' }).click()
        await this.dash.mocks.calledForSubmitBreakageForm({ category: 'layout' })
    }

    async skipsToBreakageFormWhenDisliked() {
        const { page } = this.dash
        await page.getByLabel('I dislike the content on this').click()
        await page.getByRole('button', { name: 'Send Report' }).click()
        await this.dash.mocks.calledForSubmitBreakageForm({ category: 'dislike' })
    }

    async showsNativeFeedback() {
        const { page } = this.dash
        await page.getByLabel('General DuckDuckGo browser feedback').click()
        await this.dash.mocks.calledForNativeFeedback()
    }

    async submitsVideoFeedbackFormWhenOpenedDirectly() {
        const { page } = this.dash
        await page.getByText('Video didn’t play or load').waitFor({ timeout: 1000 })
        await page.getByPlaceholder('Please describe the issue you').fill("didn't play")
        await page.getByRole('button', { name: 'Send Report' }).click()
        await this.dash.mocks.calledForSubmitBreakageForm({ category: 'videos', description: "didn't play" })
    }

    async submitsOtherFeedbackFormWhenOpenedDirectly() {
        const { page } = this.dash
        await page.getByText('Something else').waitFor({ timeout: 1000 })
        await page.getByRole('button', { name: 'Send Report' }).click()
        await this.dash.mocks.calledForAlert('missingDescription')
        await page.getByPlaceholder('Please describe the issue you').fill('it was broken')
        await page.getByRole('button', { name: 'Send Report' }).click()
        await this.dash.mocks.calledForSubmitBreakageForm({ category: 'other', description: 'it was broken' })
    }
}
