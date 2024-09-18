export class Extension {
    /**
     * @param {import('./DashboardPage').DashboardPage} dash
     */
    constructor(dash) {
        this.dash = dash
    }

    async triggersToggleReport() {
        const { page } = this.dash
        await page.evaluate(() => {
            /** @type {import('../schema/__generated__/schema.types').IncomingToggleReport} */
            const msg = {
                messageType: 'toggleReport',
            }
            window.__playwright.handler?.(msg)
        })
        await page.waitForURL((url) => {
            return url.searchParams.get('screen') === 'toggleReport'
        })
    }
}
