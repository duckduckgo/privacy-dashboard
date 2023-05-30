/**
 * @module Android integration
 *
 * @description
 * On Android, all data for the dashboard is delivered via methods that have been
 * attached to the global `window` object.
 *
 * Please see the aboutLink below under the heading 'Integration API'
 *
 * @category integrations
 */
import {
    cookiePromptManagementStatusSchema,
    localeSettingsSchema,
    protectionsStatusSchema,
    requestDataSchema,
} from '../../../schema/__generated__/schema.parsers.mjs'
import { setupBlurOnLongPress, setupGlobalOpenerListener } from '../ui/views/utils/utils'
import { CheckBrokenSiteReportHandledMessage, CloseMessage, OpenSettingsMessages, SetListsMessage, setupColorScheme } from './common.es6'
import { createTabData } from './utils/request-details.mjs'

let channel = null
const backgroundMessage = (backgroundModel) => {
    channel = backgroundModel
}

const getBackgroundTabDataPromises = []
let trackerBlockingData
let permissionsData
let certificateData
let upgradedHttps
/** @type {import("./utils/protections.mjs").Protections | undefined} */
let protections
let isPendingUpdates
let parentEntity
const cookiePromptManagementStatus = {}

/** @type {string | undefined} */
let locale

const combineSources = () => ({
    tab: Object.assign(
        {},
        trackerBlockingData || {},
        {
            isPendingUpdates,
            parentEntity,
            cookiePromptManagementStatus,
            locale,
        },
        permissionsData ? { permissions: permissionsData } : {},
        certificateData ? { certificate: certificateData } : {}
    ),
})

const resolveInitialRender = function () {
    const isUpgradedHttpsSet = typeof upgradedHttps === 'boolean'
    const isIsProtectedSet = typeof protections !== 'undefined'
    const isTrackerBlockingDataSet = typeof trackerBlockingData === 'object'
    const isLocaleSet = typeof locale === 'string'
    if (!isLocaleSet || !isUpgradedHttpsSet || !isIsProtectedSet || !isTrackerBlockingDataSet) {
        return
    }

    getBackgroundTabDataPromises.forEach((resolve) => resolve(combineSources()))
    channel?.send('updateTabData', { via: 'resolveInitialRender' })
}

// Integration APIs
// -----------------------------------------------------------------------------

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
export function onChangeRequestData(tabUrl, rawRequestData) {
    // note: this will fail currently, but is added here to enable the wiring of the documentation/schema
    // eslint-disable-next-line no-unused-vars
    const requestData = requestDataSchema.safeParse(rawRequestData)
    if (!protections) {
        console.error('protections status not set')
        return
    }
    if (!requestData.success) {
        console.error('could not parse incoming request data from `onChangeRequestData`')
        console.log(requestData.error)
        return
    }
    trackerBlockingData = createTabData(tabUrl, upgradedHttps, protections, requestData.data)
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
 * window.onChangeProtectionStatus(protectionStatus)
 * ```
 *
 * @param {import('../../../schema/__generated__/schema.types').ProtectionsStatus} protectionsStatus
 */
export function onChangeProtectionStatus(protectionsStatus) {
    const parsed = protectionsStatusSchema.safeParse(protectionsStatus)
    if (!parsed.success) {
        console.error('could not parse incoming protection status from onChangeProtectionStatus')
        console.error(parsed.error)
        return
    }
    protections = parsed.data

    resolveInitialRender()
}

/**
 * {@inheritDoc common.onChangeLocale}
 * @type {import("./common.es6").onChangeLocale}
 * @group Android -> JavaScript Interface
 *
 * @example
 *
 * ```kotlin
 * // kotlin
 * webView.evaluateJavascript("javascript:onChangeLocale(${localSettingsAsJsonString});", null)
 * ```
 */
export function onChangeLocale(payload) {
    const parsed = localeSettingsSchema.safeParse(payload)
    if (!parsed.success) {
        console.error('could not parse incoming protection status from onChangeLocale')
        console.error(parsed.error)
        return
    }
    locale = parsed.data.locale
    channel?.send('updateTabData', { via: 'onChangeLocale' })
}

/**
 * {@inheritDoc common.onChangeConsentManaged}
 * @type {import("./common.es6").onChangeConsentManaged}
 * @group Android -> JavaScript Interface
 * @example On Android, it might look something like this:
 *
 * ```kotlin
 * // kotlin
 * webView.evaluateJavascript("javascript:onChangeConsentManaged(${cookiePromptManagementStatusAsJsonString});", null)
 * ```
 */
export function onChangeConsentManaged(payload) {
    const parsed = cookiePromptManagementStatusSchema.safeParse(payload)
    if (!parsed.success) {
        console.error('could not parse incoming data from onChangeConsentManaged')
        console.error(parsed.error)
        return
    }
    Object.assign(cookiePromptManagementStatus, parsed.data)
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
    toggleAllowlist(isProtected) {
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
    showBreakageForm() {
        window.PrivacyDashboard.showBreakageForm()
    }

    /**
     * @example
     * ```
     * window.PrivacyDashboard.close()
     * ```
     */
    close() {
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
    openInNewTab(payload) {
        window.PrivacyDashboard.openInNewTab(JSON.stringify(payload))
    }

    /**
     * {@inheritDoc common.openSettings}
     * @type {import("./common.es6").openSettings}
     * @example
     * ```js
     * const payload = JSON.stringify({
     *     "target": "cpm"
     * });
     * window.PrivacyDashboard.openSettings(payload)
     * ```
     */
    openSettings(payload) {
        window.PrivacyDashboard.openSettings(JSON.stringify(payload))
    }
}

/**
 * @type {PrivacyDashboardJavascriptInterface}
 */
let privacyDashboardApi

// -----------------------------------------------------------------------------

/**
 * @type {import("./common.es6").fetcher}
 */
async function fetchAndroid(message) {
    if (message instanceof SetListsMessage) {
        for (const listItem of message.lists) {
            const { list, value } = listItem
            if (list !== 'allowlisted') {
                console.warn('only `allowlisted` is currently supported on android')
                continue
            }

            // `allowlisted: true` means the user disabled protections.
            // so `isProtected` is the opposite of `allowlisted`.
            const isProtected = value === false
            privacyDashboardApi.toggleAllowlist(isProtected)
        }
    }

    if (message instanceof CloseMessage) {
        privacyDashboardApi.close()
    }

    if (message instanceof CheckBrokenSiteReportHandledMessage) {
        privacyDashboardApi.showBreakageForm()
        return true // Return true to prevent HTML form from showing
    }

    if (message instanceof OpenSettingsMessages) {
        privacyDashboardApi.openSettings({
            target: message.target,
        })
    }
}

const getBackgroundTabDataAndroid = () => {
    return new Promise((resolve) => {
        if (trackerBlockingData) {
            resolve(combineSources())
            return
        }

        getBackgroundTabDataPromises.push(resolve)
    })
}

export function setup() {
    const setColorScheme = setupColorScheme()
    window.onChangeTheme = function (themeName) {
        setColorScheme(themeName)
    }
    window.onChangeProtectionStatus = onChangeProtectionStatus
    window.onChangeLocale = onChangeLocale
    window.onChangeRequestData = onChangeRequestData
    window.onChangeConsentManaged = onChangeConsentManaged

    window.onChangeAllowedPermissions = function (data) {
        permissionsData = data
        channel?.send('updateTabData', { via: 'onChangeAllowedPermissions' })
    }
    window.onChangeUpgradedHttps = function (data) {
        upgradedHttps = data
        if (trackerBlockingData) trackerBlockingData.upgradedHttps = upgradedHttps
        resolveInitialRender()
    }
    window.onChangeCertificateData = function (data) {
        certificateData = data.secCertificateViewModels
        channel?.send('updateTabData', { via: 'onChangeCertificateData' })
    }
    window.onIsPendingUpdates = function (data) {
        isPendingUpdates = data
        channel?.send('updateTabData', { via: 'onIsPendingUpdates' })
    }
    window.onChangeParentEntity = function (data) {
        parentEntity = data
        channel?.send('updateTabData', { via: 'onChangeParentEntity' })
    }

    /**
     * This matches what Android injects into the webview
     * @type {PrivacyDashboardJavascriptInterface}
     */
    privacyDashboardApi = new PrivacyDashboardJavascriptInterface()

    // Blur elements on Android when a long-press is detected
    setupBlurOnLongPress()
    setupGlobalOpenerListener((href) => {
        privacyDashboardApi.openInNewTab({
            url: href,
        })
    })
}
export const getBackgroundTabData = new Proxy(getBackgroundTabDataAndroid, {
    apply(target, thisArg, argArray) {
        // console.log('🚀 getBackgroundTabData...', JSON.stringify(argArray))
        return Reflect.apply(target, thisArg, argArray)
    },
})
export const fetch = new Proxy(fetchAndroid, {
    apply(target, thisArg, argArray) {
        // console.log('🚀 fetch...', JSON.stringify(argArray))
        return Reflect.apply(target, thisArg, argArray)
    },
})

export { backgroundMessage }
