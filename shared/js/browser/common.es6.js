/**
 * @module common
 */

export const getContentHeight = () => {
    const $openSubview = window.document.querySelector('#popup-container.sliding-subview--open > section:last-child > div')
    const $rootSubview = window.document.querySelector('#popup-container.sliding-subview--root > section:first-child > div')
    return ($openSubview || $rootSubview)?.scrollHeight
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
 * Calling this method should close the dashboard and open the given URL in a **new tab**.
 * @param {{url: string}} payload
 */
export function openInNewTab(payload) {}

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
 * @param {import('../../../schema/__generated__/schema.types').Search} options
 */
export function search(options) {}

class Msg {
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
     */
    constructor(params) {
        super()
        /**
         * @type {Array<{list: "allowlisted" | "denylisted", domain: string, value: boolean}>}
         */
        this.lists = params.lists
    }
}

export class SubmitBrokenSiteReportMessage extends Msg {
    /**
     * @param {object} params
     * @param {string} params.category
     * @param {string} params.description
     */
    constructor(params) {
        super()
        this.category = params.category
        this.description = params.description
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

export class CloseMessage extends Msg {}

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

/**
 * @template {SetListsMessage|SubmitBrokenSiteReportMessage|UpdatePermissionMessage|CheckBrokenSiteReportHandledMessage|CloseMessage|RefreshEmailAliasMessage|OpenOptionsMessage} T
 * @template {unknown} [Response=unknown]
 * @param {T} message
 * @returns {Promise<any>}
 */
export async function fetcher(message) {
    throw new Error('must implement')
}
