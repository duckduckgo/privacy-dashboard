/**
 * @module Android integration
 *
 * @description
 * On Android, all data for the dashboard is delivered via methods that have been
 * attached to the global `window` object.
 *
 * Please see the links below under the heading 'Integration API'
 *
 * @category integrations
 */
import { setupColorScheme } from './common.es6'
import { protectionsStatusSchema, requestDataSchema } from '../../../schema/__generated__/schema.parsers'
import { createTabData } from './utils/request-details'

let channel = null
const backgroundMessage = (backgroundModel) => {
    channel = backgroundModel
}

const setColorScheme = setupColorScheme()

const getBackgroundTabDataPromises = []
let trackerBlockingData
let permissionsData
let certificateData
let upgradedHttps
/** @type {import("./utils/request-details").Protections | undefined} */
let protections
let isPendingUpdates
let parentEntity
let consentManaged

const combineSources = () => ({
    tab: Object.assign({},
        trackerBlockingData || {},
        {
            isPendingUpdates,
            parentEntity,
            consentManaged
        },
        permissionsData ? { permissions: permissionsData } : {},
        certificateData ? { certificate: certificateData } : {}
    )
})

const resolveInitialRender = function () {
    const isUpgradedHttpsSet = typeof upgradedHttps === 'boolean'
    const isIsProtectedSet = typeof protections !== 'undefined'
    const isTrackerBlockingDataSet = typeof trackerBlockingData === 'object'
    if (!isUpgradedHttpsSet || !isIsProtectedSet || !isTrackerBlockingDataSet) {
        return
    }

    getBackgroundTabDataPromises.forEach((resolve) => resolve(combineSources()))
    channel?.send('updateTabData')
}

// Integration APIs
// -----------------------------------------------------------------------------

window.onChangeTheme = function (themeName) {
    setColorScheme(themeName)
}

/**
 * Call this method when there is updated request information.
 *
 * Note: this expects each call to provide the full data set each time, **not** any kind of delta.
 *
 * @group Android -> JavaScript Interface
 * @example
 * In Kotlin, it might look something like this...
 * ```kotlin
 * // kotlin
 * webView.evaluateJavascript("javascript:onChangeRequestData(\"${url}\", $requestDataAsJsonString);", null)
 * ```
 *
 * ... which is the equivalent of calling the following inside the Privacy Dashboard
 * ```javascript
 * // JavaScript
 * window.onChangeTrackerBlockingData("https://example.com", rawRequestData)
 * ```
 *
 * Please see [cnn.json](media://request-data-cnn.json) or [google.json](media://request-data-google.json) for examples of the RequestData type
 * @param {string} tabUrl
 * @param {import('../../../schema/__generated__/schema.types').RequestData} rawRequestData
 */
export function onChangeRequestData (tabUrl, rawRequestData) {
    // note: this will fail currently, but is added here to enable the wiring of the documentation/schema
    // eslint-disable-next-line no-unused-vars
    const requestData = requestDataSchema.safeParse(rawRequestData)
    if (!protections) throw new Error('protections status not set')
    if (!requestData.success) {
        console.error('could not parse incoming request data from `onChangeRequestData`')
        console.log(requestData.error)
        return
    }
    trackerBlockingData = createTabData(tabUrl, upgradedHttps, protections, requestData.data)
    resolveInitialRender()
}
window.onChangeRequestData = onChangeRequestData

window.onChangeAllowedPermissions = function (data) {
    permissionsData = data
    channel?.send('updateTabData')
}

window.onChangeUpgradedHttps = function (data) {
    upgradedHttps = data

    if (trackerBlockingData) trackerBlockingData.upgradedHttps = upgradedHttps
    resolveInitialRender()
}

/**
 * {@inheritDoc common.onChangeProtectionStatus}
 * @type {import("./common.es6").onChangeProtectionStatus}
 * @group Android -> JavaScript Interface
 *
 * @example
 * ```kotlin
 * // kotlin
 * webView.evaluateJavascript("javascript:onChangeProtectionStatus(${protectionStatusAsJsonString});", null)
 * ```
 * ... which is the equivalent of calling the following inside the Privacy Dashboard
 * ```javascript
 * // JavaScript
 * window.evaluateJavascript(protectionStatus)
 * ```
 *
 * @param {import('../../../schema/__generated__/schema.types').ProtectionsStatus} protectionsStatus
 */
export function onChangeProtectionStatus (protectionsStatus) {
    const parsed = protectionsStatusSchema.safeParse(protectionsStatus)
    if (!parsed.success) {
        console.error('could not parse incoming protection status from onChangeProtectionStatus')
        console.error(parsed.error)
        return
    }
    protections = parsed.data

    resolveInitialRender()
}
window.onChangeProtectionStatus = onChangeProtectionStatus

window.onChangeCertificateData = function (data) {
    certificateData = data.secCertificateViewModels
    channel?.send('updateTabData')
}

window.onIsPendingUpdates = function (data) {
    isPendingUpdates = data
    channel?.send('updateTabData')
}

window.onChangeParentEntity = function (data) {
    parentEntity = data
    channel?.send('updateTabData')
}

window.onChangeConsentManaged = function (data) {
    consentManaged = data
    channel?.send('updateTabData')
}

/**
 * This describes the JavaScript Interface, `PrivacyDashboard`, that gets added to the `window` object by Android.
 *
 * The Privacy Dashboard communicates with Android by calling methods on that global object.
 *
 * ---
 *
 * For example, to show the breakage form, we'd call:
 *
 * ```
 * window.PrivacyDashboard.showBreakageForm()
 * ```
 *
 * Each `method` documented below is intended
 *
 *
 * @group Javascript -> Android Interface
 */
export class PrivacyDashboardJavascriptInterface {
    /**
     * @param {boolean} isProtected - note: this will be sent as valid JSON, eg: `"true"` or `"false"`
     *
     * Add the current domain to the 'allowlist'
     *
     * ```js
     * window.PrivacyDashboard.toggleAllowlist("true")
     * ```
     *
     * Remove the current domain from the 'allowlist'
     *
     * ```js
     * window.PrivacyDashboard.toggleAllowlist("false")
     * ```
     */
    toggleAllowlist (isProtected) {
        window.PrivacyDashboard.toggleAllowlist(isProtected)
    }

    /**
     * Shows the native breakage form, instead of using the one
     * embedded in the Privacy Dashboard
     * @example
     * ```
     * window.PrivacyDashboard.showBreakageForm()
     * ```
     */
    showBreakageForm () {
        window.PrivacyDashboard.showBreakageForm()
    }

    /**
     * @example
     * ```
     * window.PrivacyDashboard.close()
     * ```
     */
    close () {
        window.PrivacyDashboard.close()
    }

    /**
     * {@inheritDoc common.openInNewTab}
     * @type {import("./common.es6").openInNewTab}
     *
     * ```js
     * const payload = JSON.stringify({
     *     "url": "https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/"
     * });
     * window.PrivacyDashboard.openInNewTab(payload)
     * ```
     */
    openInNewTab (payload) {
        window.PrivacyDashboard.openInNewTab(JSON.stringify(payload))
    }
}

const privacyDashboardApi = new PrivacyDashboardJavascriptInterface()

// -----------------------------------------------------------------------------

const fetch = (message) => {
    if (!window.PrivacyDashboard) {
        console.error('window.PrivacyDashboard not available')
        return
    }

    if (message.setList) {
        const { list, value } = message.setList
        if (list !== 'allowlisted') {
            console.warn('only `allowlisted` is currently supported on android')
            return
        }

        // `allowlisted: true` means the user disabled protections.
        // so `isProtected` is the opposite of `allowlisted`.
        const isProtected = value === false

        privacyDashboardApi.toggleAllowlist(isProtected)
    }

    if (message.closePrivacyDashboard) {
        privacyDashboardApi.close()
    }

    if (message.checkBrokenSiteReportHandled) {
        privacyDashboardApi.showBreakageForm()
        return true // Return true to prevent HTML form from showing
    }
}

const getBackgroundTabData = () => {
    return new Promise((resolve) => {
        if (trackerBlockingData) {
            resolve(combineSources())
            return
        }

        getBackgroundTabDataPromises.push(resolve)
    })
}

/**
 * on macOS, respond to all clicks on links with target="_blank"
 * by forwarding to the native side.
 */
document.addEventListener('click', (e) => {
    const targetElem = e.target
    if (targetElem instanceof HTMLAnchorElement) {
        if (targetElem.target === '_blank' && targetElem.origin) {
            e.preventDefault()
            privacyDashboardApi.openInNewTab({
                url: targetElem.href
            })
        }
    }
})

module.exports = {
    fetch: fetch,
    backgroundMessage: backgroundMessage,
    getBackgroundTabData: getBackgroundTabData
}
