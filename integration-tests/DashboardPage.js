import { expect } from '@playwright/test'
import { forwardConsole, playTimeline } from './helpers'
import { Mocks } from './Mocks'

export class DashboardPage {
    connectInfoLink = () => this.page.locator('[aria-label="View Connection Information"]')
    trackerCompaniesLink = () => this.page.locator('[aria-label="View Tracker Companies"]')
    thirdPartiesLink = () => this.page.locator('[aria-label="View Non-Tracker Companies"]')
    aboutLink = () => this.page.locator('"About our Web Tracking Protections"')
    backButton = () => this.page.locator('[aria-label="Back"]')
    get htmlPage() {
        switch (this.platform.name) {
            case 'android':
                return '/build/app/html/android.html'
            case 'ios':
                return '/build/app/html/ios.html'
            case 'macos':
                return '/build/app/html/macos.html'
            case 'windows':
                return '/build/app/html/windows.html'
            case 'example':
                return '/build/app/html/example.html'
            case 'browser':
                return '/build/app/html/browser.html'
            default: {
                /** @type {never} */
                const n = this.platform.name
                throw new Error('unreachable ' + n)
            }
        }
    }

    platform
    page
    mocks
    /**
     * @param {import("@playwright/test").Page} page
     * @param {import("../shared/js/ui/platform-features.js").Platform} platform
     */
    constructor(page, platform) {
        this.platform = platform
        this.page = page
        this.mocks = new Mocks(page, platform)
        forwardConsole(page)
    }

    async showsPrimaryScreen() {
        await this.page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        await this.connectInfoLink().waitFor()
    }

    async screenshot(name) {
        if (!process.env.CI) {
            // console.log('🚧 skipping screenshot 🚧', name)
            await expect(this.page).toHaveScreenshot(name)
        }
    }

    /**
     * @param {string} name
     * @param {import("../shared/js/ui/views/tests/generate-data").MockData} state
     */
    async screenshotEachScreenForState(name, state) {
        await this.page.emulateMedia({ reducedMotion: 'reduce' })
        await this.addStates([state])
        await this.showsPrimaryScreen()
        await this.screenshot(name + '-state-primary.png')
        await this.viewConnection()
        await this.showsConnectionScreen()
        await this.screenshot(name + '-state-connection.png')
        await this.goBack()
        await this.viewTrackerCompanies()
        await this.showsTrackersScreen()
        await this.screenshot(name + '-state-trackers.png')
        await this.goBack()
        await this.viewThirdParties()
        await this.showsNonTrackersScreen()
        await this.screenshot(name + '-state-non-trackers.png')
    }

    async viewTrackerCompanies() {
        await this.trackerCompaniesLink().click()
    }

    async viewThirdParties() {
        await this.thirdPartiesLink().click()
    }

    async viewConnection() {
        await this.connectInfoLink().click()
    }

    async showsConnectionScreen() {
        await this.page.locator('[data-page="connection"]').waitFor({ timeout: 500 })
    }

    async showsTrackersScreen() {
        await this.page.locator('[data-page="trackers"]').waitFor({ timeout: 500 })
    }

    async showsNonTrackersScreen() {
        await this.page.locator('[data-page="non-trackers"]').waitFor({ timeout: 500 })
    }

    async aboutLinkHasRipple() {
        await expect(this.aboutLink()).toHaveClass(/mdc-ripple-upgraded/)
    }

    async clickAboutLink() {
        await this.aboutLink().click()
    }

    /**
     * @returns {Promise<void>}
     */
    async loadPage() {
        await this.page.goto(this.htmlPage)
    }

    static async android(page) {
        const dash = new DashboardPage(page, { name: 'android' })
        await dash.loadPage()
        await dash.withMocks()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    static async windows(page) {
        const dash = new DashboardPage(page, { name: 'windows' })
        await dash.withMocks()
        await dash.loadPage()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    static async macos(page) {
        const dash = new DashboardPage(page, { name: 'macos' })
        await dash.loadPage()
        await dash.withMocks()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    /**
     * @param {import("@playwright/test").Page} page
     * @param {{
     *     getPrivacyDashboardData?: import('../schema/__generated__/schema.types').GetPrivacyDashboardData,
     * }} messages
     * @returns {Promise<DashboardPage>}
     */
    static async browser(page, messages) {
        const dash = new DashboardPage(page, { name: 'browser' })
        await dash.withMocks()
        await page.addInitScript((messages) => {
            window.__playwright.messages = Object.assign(window.__playwright.messages, messages)
        }, messages)
        await dash.loadPage()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    static async ios(page) {
        const dash = new DashboardPage(page, { name: 'ios' })
        await dash.loadPage()
        await dash.withMocks()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    /**
     * @returns {Promise<DashboardPage>}
     */
    async withMocks() {
        await this.mocks.install()
        return this
    }

    /**
     * @param {import("../shared/js/ui/views/tests/generate-data").MockData[]} states
     */
    async addStates(states) {
        await playTimeline(this.page, states, this.platform)
    }

    async clickReportBreakage() {
        await this.page.getByRole('link', { name: 'Website not working as expected?' }).click()
    }

    async submitBreakageForm() {
        await this.page.getByRole('button', { name: 'Send Report' }).click()
    }

    async hasPolishLinkTextForConnectionInfo() {
        await this.page.locator('"Połączenie jest szyfrowane"').waitFor({ timeout: 500 })
    }

    async hasFrenchLinkTextForConnectionInfo() {
        await this.page.locator('"La connexion est chiffrée"').waitFor({ timeout: 500 })
    }

    async toggleProtectionsOff() {
        await this.page.getByRole('switch', { name: 'Disable Protections' }).click()
    }

    async indicatesCookiesWereManaged() {
        await this.page.getByText('Cookies Managed').waitFor({ timeout: 500 })
    }

    async indicatesCookiesWereHidden() {
        await this.page.getByText('Pop-up Hidden').waitFor({ timeout: 500 })
    }

    async viewCookiePromptManagement() {
        await this.page.getByRole('button', { name: /Cookies Managed|Pop-up Hidden/ }).click({ timeout: 500 })
    }

    async disableCookiesInSettings() {
        await this.page.getByRole('link', { name: 'Disable in Settings' }).click()
    }

    async toggleProtectionsOn() {
        await this.page.locator('[aria-checked="false"]').click()
    }

    async clickClose() {
        if (this.platform.name === 'android') {
            return this.backButton().click()
        }
        if (this.platform.name === 'ios') {
            return await this.page.getByRole('button', { name: 'Done' }).click()
        }
        throw new Error('unreachable. clickClose must be handled')
    }

    /**
     * This is not ideal, but I've added it because our implementation leaves elements around
     * on the first screen when we navigate to the second.
     *
     * This means on iOS, when the secondary screen is present the selector `getByRole('button', { name: 'Done' })`
     * would yield 2 elements. That's why we have this `.nth(1)` modifier to ensure we're only
     * selecting the second of the 'Done' buttons
     *
     * @returns {Promise<*>}
     */
    async clickCloseFromSecondaryScreen() {
        if (this.platform.name === 'ios') {
            return await this.page.getByRole('button', { name: 'Done' }).nth(1).click()
        }
        throw new Error(`unreachable. clickCloseFromSecondaryScreen must be handled on ${this.platform.name}`)
    }

    async goBack() {
        if (this.platform.name === 'android') {
            await this.page.getByRole('button', { name: 'Back' }).nth(1).click()
        } else {
            await this.page.getByRole('button', { name: 'Back' }).click()
        }
    }

    async showingCTA() {
        await this.page.locator('"Love using DuckDuckGo?"').waitFor({ timeout: 500 })
    }

    async waitForCompanyName(name) {
        await this.page.locator(`[title="${name}"]`).waitFor({ timeout: 600 })
    }

    /**
     * @param {string} text
     */
    async enterBreakageSubscription(text) {
        await this.page.locator('textarea').type(text)
    }

    /**
     * @param {string} categoryText
     */
    async selectBreakageCategory(categoryText) {
        await this.page.locator('select').selectOption({ label: categoryText })
    }

    async enterSearchText(text) {
        await this.page.locator('[placeholder="Search DuckDuckGo"]').type(text)
    }

    async searchContainsText(text) {
        await expect(this.page.locator('[placeholder="Search DuckDuckGo"]')).toHaveValue(text)
    }

    async submitSearch(text) {
        await this.page.locator('[type="submit"]').click()
    }

    async selectOptionsCog() {
        await this.page.locator('[aria-label="More options"]').click()
    }

    async displayingError() {
        await this.page
            .locator('"Something went wrong, and we couldn\'t load this content. Try reloading the page."')
            .waitFor({ timeout: 500 })
    }
}
