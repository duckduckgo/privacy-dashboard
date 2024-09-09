import { expect } from '@playwright/test'
import { forwardConsole, playTimeline } from './helpers'
import { Mocks } from './Mocks'
import { AltBreakageFlows } from './AltBreakageFlows'
import { Nav } from './Nav'

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
    breakage = new AltBreakageFlows(this)
    nav = new Nav(this)
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
        await this.connectInfoLink().waitFor({ timeout: 5000 })
    }

    async showsAlternativeLayout() {
        await this.page.getByTestId('protectionHeader').waitFor({ timeout: 1000 })
    }

    /**
     * @param {string} name
     * @param {{ skipInCI?: boolean }} [opts]
     */
    async screenshot(name, { skipInCI = false } = {}) {
        if (skipInCI) return console.log(`skipped ${name} in CI`)
        await expect(this.page).toHaveScreenshot(name, { maxDiffPixels: 50 })
    }

    async reducedMotion() {
        await this.page.emulateMedia({ reducedMotion: 'reduce' })
    }

    /**
     * @param {string} name
     * @param {import("../shared/js/ui/views/tests/generate-data.mjs").MockData} state
     * @param {{ skipInCI?: boolean }} [opts]
     */
    async screenshotEachScreenForState(name, state, opts = {}) {
        await this.addState([state])
        await this.showsPrimaryScreen()
        await this.screenshot(name + '-state-primary.png', opts)
        await this.viewConnection()
        await this.showsConnectionScreen()
        await this.screenshot(name + '-state-connection.png', opts)
        await this.goBack()
        if (await this.shouldScreenshotTrackersScreen()) {
            await this.viewTrackerCompanies()
            await this.showsTrackersScreen()
            await this.screenshot(name + '-state-trackers.png', opts)
            await this.goBack()
        }
        await this.viewThirdParties()
        await this.showsNonTrackersScreen()
        await this.screenshot(name + '-state-non-trackers.png', opts)
        if (state.fireButtonEnabled) {
            await this.goBack()
            await this.clickFireButton()
            await this.screenshot(name + '-state-fire-dialog.png', opts)
        }
    }

    /**
     * Whether to screenshot the company trackers screen, as some states omit that screen
     */
    async shouldScreenshotTrackersScreen() {
        let count = await this.trackerCompaniesLink().count()
        return count === 1
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

    async hasInsecureTextDetail() {
        const { page } = this
        await expect(page.locator('#popup-container')).toContainText(
            'This page is using an unencrypted connection. Third parties may be able to view your activity or intercept sensitive information you send on this page.'
        )
    }

    async hasInsecureText() {
        const { page } = this
        await expect(page.locator('#key-insight')).toContainText(
            'This site is not secure and may compromise any information you send on this page.'
        )
    }

    async hasInvalidCertText() {
        const { page } = this
        await expect(page.locator('#popup-container')).toContainText(
            'The certificate for this site is invalid. You might be connecting to a server that is pretending to be example.com which could put your confidential information at risk.'
        )
    }

    async hasAllowedFirstPartyText() {
        const { page } = this
        await expect(page.locator('#key-insight')).toContainText(
            'We only found non-tracking requests or requests associated with example.com loading on this page.'
        )
    }

    async hidesTrackerCompaniesLink() {
        await expect(this.trackerCompaniesLink()).not.toBeVisible()
    }

    async showsInvalidCertDetail() {
        const { page } = this
        const text =
            'The certificate for this site is invalid. You might be connecting to a server that is pretending to be example.com which could put your confidential information at risk.'
        await page.locator('[data-page="connection"]').getByText(text).waitFor()
    }

    async hasPhishingIcon() {
        const { page } = this
        await expect(page.locator('#key-insight div').nth(1)).toHaveClass(/hero-icon--phishing/)
    }

    async hasPhishingHeadingText() {
        const { page } = this
        await expect(page.getByRole('heading', { name: 'privacy-test-pages.site' })).toBeVisible()
    }

    async hasPhishingWarningText() {
        const { page } = this
        await expect(page.locator('#popup-container')).toContainText(
            'This website may be impersonating a legitimate site in order to trick you into providing personal information, such as passwords or credit card numbers.'
        )
    }

    async hasPhishingStatusText() {
        const { page } = this
        await expect(page.locator('#main-nav div')).toContainText('Site May Be Deceptive')
    }

    async connectionLinkDoesntShow() {
        await expect(this.connectInfoLink()).not.toBeVisible()
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
    async loadPage(params = {}) {
        const path = this.htmlPage
        const search = new URLSearchParams(params).toString()
        await this.page.goto(path + '?' + search)
    }

    static async android(page) {
        const dash = new DashboardPage(page, { name: 'android' })
        await dash.withMarker()
        await dash.loadPage()
        await dash.withMocks()
        await page.waitForFunction(() => typeof window.__playwright !== 'undefined')
        return dash
    }

    /**
     * @param {import("@playwright/test").Page} page
     * @param {object} [opts]
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} [opts.screen]
     * @return {Promise<DashboardPage>}
     */
    static async windows(page, opts = {}) {
        /** @type {import('../schema/__generated__/schema.types').EventOrigin['screen']} */
        const screen = opts?.screen || 'primaryScreen'
        const dash = new DashboardPage(page, { name: 'windows' })
        await dash.withMarker()
        await dash.withMocks()
        await dash.loadPage({ screen })
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

    /**
     * @param {import("@playwright/test").Page} page
     * @param {object} [opts]
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} [opts.screen]
     * @param {'ios' | 'macos'} opts.platform
     * @param {'breakageForm' | 'categorySelection' | 'categoryTypeSelection'} [opts.breakageScreen]
     * @param {string} [opts.randomisedCategories]
     * @param {string} [opts.category]
     * @param {'menu' | 'dashboard'} [opts.opener]
     */
    static async webkit(page, opts) {
        /** @type {import('../schema/__generated__/schema.types').EventOrigin['screen']} */
        const screen = opts?.screen || 'primaryScreen'
        const opener = opts?.opener || 'dashboard'
        const breakageScreen = opts?.breakageScreen
        const category = opts?.category
        const randomisedCategories = opts?.randomisedCategories
        const dash = new DashboardPage(page, { name: opts?.platform ?? 'ios' })
        await dash.withMarker()
        await dash.loadPage({ screen, opener, breakageScreen, category, randomisedCategories })
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

    async submitBreakageForm() {
        await this.page.getByRole('button', { name: 'Send Report' }).click()
    }

    async hasPolishLinkTextForConnectionInfo() {
        await this.page.locator('"Połączenie jest szyfrowane"').waitFor({ timeout: 3000 })
    }

    async hasFrenchLinkTextForConnectionInfo() {
        await this.page.locator('"La connexion est chiffrée"').waitFor({ timeout: 3000 })
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
        await this.page.getByText('Pop-up Hidden').waitFor({ timeout: 3000 })
    }

    async viewCookiePromptManagement() {
        await this.page.getByRole('button', { name: /Cookies Managed|Pop-up Hidden/ }).click({ timeout: 3000 })
    }

    async disableCookiesInSettings() {
        await this.page.getByRole('link', { name: 'Disable in Settings' }).click()
    }

    async breakageFormIsVisible() {
        await this.page.getByRole('button', { name: 'Send Report' }).waitFor()
    }

    async toggleReportIsVisible() {
        await this.page.getByRole('button', { name: 'Send Report' }).waitFor()
        await this.page.getByRole('heading', { name: 'Site not working? Let us know.' }).waitFor()
    }

    async promptBreakageFormIsVisible() {
        await this.page.getByText('Select the option that best describes the problem you experienced.').waitFor()
    }

    async toggleIsAbsent() {
        expect(await this.page.getByTestId('breakage-form-protection-header').count()).toBe(0)
    }

    async showsInformation() {
        const { page } = this
        await page.getByRole('link', { name: 'See what’s sent' }).click()
        await expect(page.getByTestId('toggle-report').getByRole('list')).toContainText(
            'Page URL (without identifiable info)[https://example.com/a/b/c/with-a-very-long-path-segment]'
        )
    }

    async cannotHideInformation() {
        const { page } = this
        expect(await page.getByRole('link', { name: 'See what’s sent' }).count()).toBe(0)
        expect(await page.getByRole('link', { name: 'Hide' }).count()).toBe(0)
    }

    async hidesInformation() {
        const { page } = this
        await page.getByRole('link', { name: 'Hide' }).click()
        await expect(page.getByTestId('toggle-report').getByRole('list')).toBeHidden()
    }

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} screen
     * @return {Promise<void>}
     */
    async showsOnlyDoneButton(screen = 'breakageForm') {
        const selector = this.parent(screen)
        await this.page.locator(selector).locator('a:has-text("Done")').waitFor()
        await expect(this.page.locator(selector).locator('.top-nav a')).toHaveCount(1)
    }

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} screen
     * @return {Promise<void>}
     */
    async showsOnlyCloseButton(screen = 'breakageForm') {
        let selector = this.parent(screen)
        await this.page.locator(selector).locator('a:has-text("Close")').waitFor()
        await expect(this.page.locator(selector).locator('.top-nav a')).toHaveCount(1)
    }

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} screen
     * @return {Promise<void>}
     */
    async closeButtonIsHidden(screen) {
        let selector = this.parent(screen)
        expect(await this.page.locator(selector).locator('.top-nav').isHidden()).toBe(true)
    }

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} screen
     * @return {Promise<void>}
     */
    async selectClose(screen) {
        let selector = this.parent(screen)
        await this.page.locator(selector).locator('.top-nav a').filter({ hasText: 'Close' }).click()
    }

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} screen
     * @return {string}
     */
    parent(screen) {
        let parent
        if (screen === 'breakageForm') {
            parent = '.breakage-form'
        } else if (screen === 'toggleReport') {
            parent = '[data-toggle-report="parent"]'
        } else {
            parent = 'n/a'
        }
        return parent
    }

    /**
     * @param {"grant"} permission
     * @return {Promise<void>}
     */
    async setsCameraPermissionTo(permission) {
        const { page } = this
        await page.getByLabel('Camera').selectOption(permission)
    }

    async clickClose() {
        if (this.platform.name === 'android') {
            return this.backButton().click()
        }
        if (this.platform.name === 'ios' || this.platform.name === 'macos') {
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
        await this.page.locator('"Love using DuckDuckGo?"').waitFor({ timeout: 1000 })
    }

    async waitForCompanyName(name) {
        await this.page.locator(`[title="${name}"]`).waitFor({ timeout: 1000 })
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
            .waitFor({ timeout: 1000 })
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
        expect(await this.page.locator('#fire-button-summary > p').count()).toBe(2)

        await this.page.locator('#fire-button-opts').selectOption({ index: 2 })
        expect(await this.page.locator('#fire-button-summary > p').count()).toBe(2)
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
    async showsBreakageForm() {
        await this.page.getByText('Submitting an anonymous').waitFor({ timeout: 5000 })
    }

    async showRemoteDisabled() {
        await this.page
            .getByText('We temporarily turned Privacy Protections off as they appear to be breaking this')
            .waitFor({ timeout: 1000 })
    }

    async sendToggleReport() {
        const { page } = this
        await page.getByRole('button', { name: 'Send Report' }).click()
        await this.mocks.calledForSendToggleReport()
    }

    async showsSuccessScreen() {
        await this.page.getByRole('heading', { name: 'Thank you!' }).waitFor()
        await this.page
            .getByRole('heading', {
                name: 'Your report will help improve our products and make the experience better for everyone.',
            })
            .waitFor()
    }

    async clickingSuccessScreenClosesDashboard() {
        await this.page
            .getByRole('heading', {
                name: 'Your report will help improve our products and make the experience better for everyone.',
            })
            .click()
        await this.mocks.calledForClose({ screen: 'toggleReport' })
    }

    async rejectToggleReport() {
        const { page } = this
        await page.getByRole('button', { name: `Don't send` }).click()
        await this.mocks.calledForRejectToggleReport()
    }
}
