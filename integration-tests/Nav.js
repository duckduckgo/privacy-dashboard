export class Nav {
    /**
     * @param {import('./DashboardPage').DashboardPage} dash
     */
    constructor(dash) {
        this.dash = dash
    }

    async goesBackToPrimaryScreen() {
        const { page } = this.dash
        await page.getByLabel('Site layout broken').click()
        await page.getByLabel('Back').nth(1).click()
        await page.getByLabel('Back').nth(0).click()
        await page.getByRole('link', { name: 'Website not working?' }).waitFor({ timeout: 1000 })
        await page.pause()
    }
}
