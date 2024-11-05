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
        await page.getByRole('link', { name: 'Website not working?' }).waitFor({ timeout: 1000 });
    }

    async goesBackToPrimaryScreenFromBreakageScreen() {
        const { page } = this.dash;
        await this.dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await this.dash.selectsCategory('Site layout broken', 'layout');
        await page.getByTestId('subview-breakageFormFinalStep').getByLabel('Back').click();
        await page.getByTestId('subview-breakageFormCategorySelection').getByLabel('Back').click();
        await page.getByTestId('subview-breakageForm').getByLabel('Back').click();
        await page.getByRole('link', { name: 'Website not working?' }).waitFor({ timeout: 1000 });
    }
}
