export class Nav {
    /**
     * @param {import('./DashboardPage').DashboardPage} dash
     */
    constructor(dash) {
        this.dash = dash;
    }

    async goesBackToPrimaryScreen() {
        const { page } = this.dash;
        await page.getByLabel('Site layout broken').click();
        await page.getByLabel('Back').nth(1).click();
        await page.getByRole('button', { name: 'Done' }).click();
        await page.getByRole('link', { name: 'Report a problem with this site' }).waitFor({ timeout: 1000 });
    }
}
