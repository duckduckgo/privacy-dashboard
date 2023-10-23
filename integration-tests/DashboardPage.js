import { expect } from '@playwright/test'
import { forwardConsole, playTimeline } from './helpers'
import { Mocks } from './Mocks'

export class DashboardPage {
    connectInfoLink = () => this.page.locator('[aria-label="View Connection Information"]')
    trackerCompaniesLink = () => this.page.locator('[aria-label="View Tracker Companies"]')
    thirdPartiesLink = () => this.page.locator('[aria-label="View Non-Tracker Companies"]')
    aboutLink = () => this.page.locator('"About our Web Tracking Protections"')
    backButton = () => this.page.locator('[aria-label="Back"]')
    fireButton = () => this.page.locator('.fire-button')
    get htmlPage() {
        switch (this.platform.name) {
            case 'android':
                return '/html/android.html'
            case 'ios':
                return '/html/ios.html'
            case 'macos':
                return '/html/macos.html'
            case 'windows':
                return '/html/windows.html'
            case 'browser':
                return '/html/browser.html'
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
     * @param {import("../shared/js/ui/platform-features.mjs").Platform} platform
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

    async showsAlternativeLayout() {
        await this.page.getByTestId('protectionHeader').waitFor({ timeout: 1000 })
    }

    async showsTogglePrompt() {
        await this.page.getByRole('link', { name: 'Website not working?' }).waitFor({ timeout: 1000 })
    }

    async showsToggleFeedbackPrompt() {
        await this.page.getByRole('link', { name: 'Report broken site' }).waitFor({ timeout: 1000 })
    }

    async screenshot(name) {
        if (!process.env.CI) {
            // console.log('🚧 skipping screenshot 🚧', name)
            await expect(this.page).toHaveScreenshot(name, { maxDiffPixelRatio: 0.025 })
        }
    }

    async reducedMotion() {
        await this.page.emulateMedia({ reducedMotion: 'reduce' })
    }

    async screenshotPrimary(name, state) {
        await this.reducedMotion()
        await this.addState([state])
        await this.showsPrimaryScreen()
        return this.page.screenshot({ path: `screenshots/primary-${name}.png` })
    }

    /**
     * @param {string} name
     * @param {import("../shared/js/ui/views/tests/generate-data.mjs").MockData} state
     */
    async screenshotEachScreenForState(name, state) {
        await this.reducedMotion()
        await this.addState([state])
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
        if (state.fireButtonEnabled) {
            await this.goBack()
            await this.clickFireButton()
            await this.screenshot(name + '-state-fire-dialog.png')
        }
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
        await this.page.locator('[data-page="connection"]').waitFor({ timeout: 2000 })
    }

    async showsTrackersScreen() {
        await this.page.locator('[data-page="trackers"]').waitFor({ timeout: 2000 })
    }

    async showsNonTrackersScreen() {
        await this.page.locator('[data-page="non-trackers"]').waitFor({ timeout: 2000 })
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
        await dash.withMarker()
        await dash.loadPage()
        await dash.withMocks()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    static async windows(page) {
        const dash = new DashboardPage(page, { name: 'windows' })
        await dash.withMarker()
        await dash.withMocks()
        await dash.loadPage()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    static async macos(page) {
        const dash = new DashboardPage(page, { name: 'macos' })
        await dash.withMarker()
        await dash.loadPage()
        await dash.withMocks()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    /**
     * @param {import("@playwright/test").Page} page
     * @returns {Promise<DashboardPage>}
     */
    static async browser(page) {
        const dash = new DashboardPage(page, { name: 'browser' })
        await dash.withMarker()
        await dash.withMocks()
        await dash.loadPage()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    static async ios(page) {
        const dash = new DashboardPage(page, { name: 'ios' })
        await dash.withMarker()
        await dash.loadPage()
        await dash.withMocks()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    async withMarker() {
        await this.page.addInitScript(() => {
            return (window.__ddg_integration_test = true)
        })
    }

    /**
     * @returns {Promise<DashboardPage>}
     */
    async withMocks() {
        await this.mocks.install()
        return this
    }

    /**
     * @param {import("../shared/js/ui/views/tests/generate-data.mjs").MockData[]} states
     * @returns {Promise<Record<string, any>[]>}
     */
    async addState(states) {
        /** @type {Record<string, any>[]} */
        const results = []
        for (const state of states) {
            results.push(await playTimeline(this.page, state, this.platform))
        }
        return results
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

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin} [eventOrigin] - where did this originate from
     * @return {Promise<void>}
     */
    async toggleProtectionsOn(eventOrigin = { screen: 'primaryScreen' }) {
        const locator =
            eventOrigin.screen === 'breakageForm'
                ? this.page.getByTestId('breakage-form-protection-header').getByLabel('Enable Protections')
                : this.page.getByLabel('Enable Protections')

        await locator.click()

        if (this.platform.name === 'browser' || this.platform.name === 'ios' || this.platform.name === 'macos') {
            await this.page.getByRole('img', { name: 'Updating protection list' }).waitFor()
        }
    }

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin} [eventOrigin] - where did this originate from
     * @return {Promise<void>}
     */
    async toggleProtectionsOff(eventOrigin = { screen: 'primaryScreen' }) {
        const locator =
            eventOrigin.screen === 'breakageForm'
                ? this.page.getByTestId('breakage-form-protection-header').getByLabel('Disable Protections')
                : this.page.getByLabel('Disable Protections')

        await locator.click()

        if (this.platform.name === 'browser' || this.platform.name === 'ios' || this.platform.name === 'macos') {
            await this.page.getByRole('img', { name: 'Updating protection list' }).waitFor()
        }
    }

    async indicatesCookiesWereManaged() {
        await this.page.getByText('Cookies Managed').waitFor({ timeout: 1000 })
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

    async submitSearch() {
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

    async fireButtonDoesntShow() {
        const buttons = await this.fireButton().all()
        expect(buttons).toHaveLength(0)
    }

    async fireButtonShows() {
        await this.fireButton().waitFor()
        expect(await this.fireButton().isVisible()).toBeTruthy()
    }

    async clickFireButton() {
        await this.fireButton().click()
        await this.page.locator('#fire-button-content').waitFor()
    }

    async fireButtonCancelClosesDialog() {
        await this.page.locator('#fire-button-cancel').click()
        expect(await this.page.$$('#fire-button-content')).toHaveLength(0)
    }

    async fireDialogIsPopulatedFromOptions(getBurnOptions) {
        await expect(this.page.locator('#fire-button-burn')).toHaveText('Clear')
        // check that dropdown options are populated
        await expect(this.page.locator('#fire-button-opts > option')).toHaveCount(getBurnOptions.options.length)
        // there should be two text sections: summary and a notice
        await expect(this.page.locator('#fire-button-summary > p')).toHaveCount(2)

        await this.page.locator('#fire-button-opts').selectOption({ index: 2 })
        await expect(this.page.locator('#fire-button-summary > p')).toHaveCount(1)
    }

    async fireDialogHistoryDisabled() {
        await expect(this.page.locator('#fire-button-burn')).toHaveText('Clear')
    }

    async clickFireButtonBurn() {
        await this.page.locator('#fire-button-burn').click()
    }

    async sendsOptionsWithBurnMessage(options) {
        const calls = await this.mocks.outgoing({ names: ['doBurn'] })
        expect(calls).toStrictEqual([
            [
                'doBurn',
                {
                    messageType: 'doBurn',
                    options,
                },
            ],
        ])
    }

    async chooseBurnOption(index) {
        await this.page.locator('#fire-button-opts').selectOption({ index })
    }

    async clicksWebsiteNotWorking() {
        await this.page.getByRole('link', { name: 'Website not working?' }).click({ timeout: 1000 })
    }

    async helpIsShown() {
        await this.page.getByText('Turning protections OFF might help.').waitFor({ timeout: 1000 })
    }

    async clicksReportBroken() {
        await this.page.getByRole('link', { name: 'Report broken site' }).click({ timeout: 1000 })
    }

    async showRemoteDisabled() {
        await this.page
            .getByText('We temporarily turned Privacy Protections off as they appear to be breaking this')
            .waitFor({ timeout: 1000 })
    }
}
