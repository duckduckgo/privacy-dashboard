/**
 * @typedef {{
 *   tab: import('./utils/request-details.mjs').TabData,
 *   emailProtectionUserData?: import('../../../schema/__generated__/schema.types').EmailProtectionUserData,
 *   fireButton?: { enabled: boolean },
 *   featureSettings?: import('../../../schema/__generated__/schema.types').RemoteFeatureSettings | undefined
 * }} BackgroundTabData
 */
/**
 * @module common
 */
export const getContentHeight = () => {
    const $openSubviewV2 = window.document.querySelector(
        '#popup-container.sliding-subview-v2--root [data-current]:last-of-type > *:first-child'
    )
    const $rootSubviewV2 = window.document.querySelector('#popup-container.sliding-subview-v2--root .page-inner')

    return ($openSubviewV2 || $rootSubviewV2)?.scrollHeight
}

export const getContentHeightForScreenShot = () => {
    const $rootSubview = window.document.querySelector('.site-info.site-info--main')
    return $rootSubview?.scrollHeight
}

/**
 * @param {(height: number) => void} callback
 */
export function setupMutationObserver(callback) {
    const bufferHeight = 200
    let lastHeight
    const mutationObserver = new MutationObserver(() => {
        const contentHeight = getContentHeight()
        if (!contentHeight) return

        const height = Math.min(window.screen.height - bufferHeight, contentHeight)

        // Only update if the height has changed since last run
        if (lastHeight === height) return
        lastHeight = height

        callback(height)
    })
    const config = { childList: true, attributes: true, subtree: true }
    mutationObserver.observe(window.document, config)
    return () => mutationObserver.disconnect()
}

/**
 * Sets up a MutationObserver to monitor changes in the DOM and execute a callback function.
 *
 * @param {function} callback - The callback function to be executed when a mutation is observed.
 * @return {function} - A function that can be called to disconnect the MutationObserver.
 */
export function setupMutationObserverForExtensions(callback) {
    let lastHeight
    const mutationObserver = new MutationObserver(() => {
        const contentHeight = getContentHeight()
        if (!contentHeight) return

        // Only update if the height has changed since last run
        if (lastHeight === contentHeight) return
        lastHeight = contentHeight

        callback(contentHeight)
    })
    const config = { childList: true, attributes: true, subtree: true }
    mutationObserver.observe(window.document, config)
    return () => mutationObserver.disconnect()
}

const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'
let explicitlySetTheme = ''
let detectedTheme = LIGHT_THEME
const oppositeTheme = {
    [LIGHT_THEME]: DARK_THEME,
    [DARK_THEME]: LIGHT_THEME,
}

function swapThemeTo(theme) {
    document.body.classList.remove(`body--theme-${oppositeTheme[theme]}`)
    document.body.classList.add(`body--theme-${theme}`)
}

function updateTheme() {
    if (explicitlySetTheme) {
        swapThemeTo(explicitlySetTheme)
    } else {
        swapThemeTo(detectedTheme)
    }
}

export function setupColorScheme() {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    if (query?.matches) {
        detectedTheme = DARK_THEME
    }

    if (query.addEventListener) {
        query?.addEventListener('change', (event) => {
            detectedTheme = event.matches ? DARK_THEME : LIGHT_THEME
            updateTheme()
        })
    } else if ('addListener' in query) {
        query.addListener((event) => {
            detectedTheme = event.matches ? DARK_THEME : LIGHT_THEME
            updateTheme()
        })
    }

    updateTheme()

    return (theme = '') => {
        theme = theme.trim().toLowerCase()

        if (theme === LIGHT_THEME || theme === DARK_THEME) {
            explicitlySetTheme = theme
        } else {
            explicitlySetTheme = ''
        }

        updateTheme()
    }
}

/**
 * @param condition
 * @param message
 * @returns {asserts condition}
 */
export function assert(condition, message = '') {
    if (!condition) {
        if (!message) {
            throw new Error('invariant')
        }
        throw new Error(message)
    }
}

/**
 * Sets the locale once initially. This is a required call.
 *
 * It's not expected that this method will be called more than once during the lifespan of
 * the open Privacy Dashboard - although technically it does support it
 *
 * Must be 2 letters, lower-case to match a name in the `shared/locales` folder. If you're
 * not sure what to send for any reason, send `{ locale: "en" }` as a default.
 *
 * Valid values would be along the lines of:
 *
 * ```
 * "fr"
 * "en"
 * "pl"
 * ```
 *
 * @param {import('../../../schema/__generated__/schema.types').LocaleSettings} payload
 */
export function onChangeLocale(payload) {}

/**
 * Sets the phishing status for a page. This is a required call.
 *
 * Example Payload: see {@link "Generated Schema Definitions".PhishingStatus}
 *
 * ```json
 * {
 *    "phishingStatus": true
 * }
 * ```
 *
 * @param {import('../../../schema/__generated__/schema.types').PhishingStatus} payload
 */
export function onChangePhishingStatus(payload) {}

/**
 * Sets the Feature Settings
 *
 * Example Payload: see {@link "Generated Schema Definitions".RemoteFeatureSettings}
 *
 * ```json
 * {
 *    "primaryScreen": { "layout": "highlighted-protections-toggle" }
 * }
 * ```
 *
 * @param {import('../../../schema/__generated__/schema.types').RemoteFeatureSettings} payload
 */
export function onChangeFeatureSettings(payload) {}

/**
 * Sets the current status of the Cookie Prompt Management.
 *
 * Platforms can provide this data to indicate that a Cookie Prompt was managed successfully.
 *
 * Note: if {@link "Generated Schema Definitions".CookiePromptManagementStatus.configurable} is `true`
 * in the payload, the dashboard will use the secondary screen. If it is absent, or `false`, it will
 * only show the row in the main nav, but it will not be clickable
 *
 * ### Example Payloads:
 *
 * Please see the schema definition for {@link "Generated Schema Definitions".CookiePromptManagementStatus}
 *
 * **None-Configurable**
 *
 * This would show the 4th row in the dashboard, but it would not be clickable
 *
 * [Sample JSON 📝](../../../schema/__fixtures__/cpm.json)
 *
 * **Configurable**
 *
 * This would allow the link to be clicked, and it would show the secondary screen
 *
 * [Sample JSON 📝](../../../schema/__fixtures__/cpm-secondary.json)
 *
 * @param {import('../../../schema/__generated__/schema.types').CookiePromptManagementStatus} payload
 */
export function onChangeConsentManaged(payload) {}

/**
 * Calling this method should close the dashboard and open the given URL in a **new tab**.
 * @param {{url: string}} payload
 */
export function openInNewTab(payload) {}

/**
 * Calling this method should open the settings at the 'target' provided
 *
 * Supported targets:
 *
 * - `cpm` - used from the Cookie Prompt Management screen when user taps 'disable in settings'
 *
 * @param {{target: 'cpm'}} payload
 */
export function openSettings(payload) {}

/**
 * Communicate the size of the dashboard so that native sides can
 * alter the height of their webview
 *
 * @param {{height: number}} payload
 */
export function setSize(payload) {}

/**
 * Call this method with Protection status updates.
 *
 * See {@link "Generated Schema Definitions".ProtectionsStatus} for details on the required properties
 *
 * @param {import('../../../schema/__generated__/schema.types').ProtectionsStatus} protectionsStatus
 */
export function onChangeProtectionStatus(protectionsStatus) {}

/**
 * This is used when the user has reported a broken site from
 * within the dashboard.
 *
 * Note: We only send the properties seen here: {@link "Generated Schema Definitions".BreakageReportRequest} (like `category`, `description`)
 * native sides should combine these with any additional data they require.
 *
 * @param {import('../../../schema/__generated__/schema.types').BreakageReportRequest} report
 */
export function submitBrokenSiteReport(report) {}

/**
 * @param {import('../../../schema/__generated__/schema.types').SetListOptions} options
 */
export function setLists(options) {}

/**
 * Refresh the email alias
 * @returns {Promise<import('../../../schema/__generated__/schema.types').RefreshAliasResponse>}
 */
export async function refreshAlias() {
    throw new Error('base impl')
}

/**
 * Fetch the data needed to display the toggle report screen
 */
export async function getToggleReportOptions() {
    throw new Error('base impl')
}

/**
 * Send the toggle report
 * @returns {Promise<void>}
 */
export async function sendToggleReport() {
    throw new Error('base impl')
}

/**
 * Reject sending the toggle report
 * @returns {Promise<void>}
 */
export async function rejectToggleReport() {
    throw new Error('base impl')
}

/**
 * Sent when the user expands the disclosure
 */
export function seeWhatIsSent() {
    throw new Error('base impl')
}

/**
 * @param {import('../../../schema/__generated__/schema.types').Search} options
 */
export function search(options) {}

/**
 * This message will be sent when the permissions dropdown is used
 *
 * @param {{permission: string; value: string}} params
 */
export function setPermission(params) {}

export class Msg {
    toJSON() {
        return {
            ...this,
            kind: this.constructor.name,
        }
    }
}

/**
 * Indicate to open the options page.
 */
export function openOptions() {}

export class SetListsMessage extends Msg {
    /**
     * @param {object} params
     * @param {Array<{ list: "allowlisted" | "denylisted", domain: string, value: boolean}>} params.lists
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     */
    constructor(params) {
        super()
        /**
         * @type {Array<{list: "allowlisted" | "denylisted", domain: string, value: boolean}>}
         */
        this.lists = params.lists
        /**
         * @type {import('../../../schema/__generated__/schema.types').EventOrigin}
         */
        this.eventOrigin = params.eventOrigin
    }
}

export class SubmitBrokenSiteReportMessage extends Msg {
    /**
     * @param {object} params
     * @param {string} params.category
     * @param {string} params.description
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     */
    constructor(params) {
        super()
        this.category = params.category
        this.description = params.description
        this.eventOrigin = params.eventOrigin
    }
}

export class UpdatePermissionMessage extends Msg {
    /**
     * @param {object} params
     * @param {string} params.id
     * @param {string} params.value
     */
    constructor(params) {
        super()
        this.id = params.id
        this.value = params.value
    }
}

export class CloseMessage extends Msg {
    /**
     * @param {object} params
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     */
    constructor(params) {
        super()
        /**
         * @type {import('../../../schema/__generated__/schema.types').EventOrigin}
         */
        this.eventOrigin = params.eventOrigin
    }
}

export class CheckBrokenSiteReportHandledMessage extends Msg {}

/**
 * Use this Message to request a fresh email alias for a logged-in user.
 */
export class RefreshEmailAliasMessage extends Msg {}

/**
 * Use this message to indicate that a native platform should open
 * the 'options' page.
 */
export class OpenOptionsMessage extends Msg {}

/**
 * Use this message to indicate that a native platform should open
 * an alert because the form description was required, but missing
 */
export class ShowAlertForMissingDescription extends Msg {}
/**
 * Use this message to indicate that a native platform should open
 * an alert because the form description was required, but missing
 */
export class ShowNativeFeedback extends Msg {}

/**
 * Use this message to indicate that an internal navigation occurred
 */
export class TelemetrySpanMsg extends Msg {
    /**
     * @param {object} params
     * @param {import('../../../schema/__generated__/schema.types').EventOrigin} params.eventOrigin
     * @param {import('../../../schema/__generated__/schema.types').TelemetrySpan['attributes']} params.attributes
     */
    constructor(params) {
        super()
        this.eventOrigin = params.eventOrigin
        this.attributes = params.attributes
    }
}

/**
 * Use this message to indicate that a native platform should open a search window with
 * the given term.
 */
export class SearchMessage extends Msg {
    /**
     * @param {object} params
     * @param {string} params.term
     */
    constructor(params) {
        super()
        this.term = params.term
    }
}

export class OpenSettingsMessages extends Msg {
    /**
     * @param {object} params
     * @param {'cpm'} params.target
     */
    constructor(params) {
        super()
        /**
         * A string representing different settings screens that can be opened
         * @type {'cpm'}
         */
        this.target = params.target
    }
}

export class BurnMessage extends Msg {
    /**
     * @param {import('../../../schema/__generated__/schema.types').FireOption} opts
     */
    constructor(opts) {
        super()
        Object.assign(this, opts)
    }
}

export class FetchBurnOptions extends Msg {}
export class FetchToggleReportOptions extends Msg {}
export class SendToggleBreakageReport extends Msg {}
export class RejectToggleBreakageReport extends Msg {}
export class SeeWhatIsSent extends Msg {}

export class SetBurnDefaultOption extends Msg {
    /**
     * @param {import('../../../schema/__generated__/schema.types').FireOption['name']} name
     */
    constructor(name) {
        super()
        this.defaultOption = name
    }
}

/**
 * @template {SetListsMessage|SubmitBrokenSiteReportMessage|UpdatePermissionMessage|CheckBrokenSiteReportHandledMessage|CloseMessage|RefreshEmailAliasMessage|OpenOptionsMessage} T
 * @template {unknown} [Response=unknown]
 * @param {T} message
 * @returns {Promise<any>}
 */
export async function fetcher(message) {
    throw new Error('must implement')
}
