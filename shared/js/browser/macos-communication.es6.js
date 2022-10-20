/**
 * @module macOS integration
 *
 * @description
 *
 * **Incoming data**
 *
 * On macOS, all data for the dashboard is delivered via methods that have been
 * attached to the global `window` object. Please see the links below under the heading 'macOS -> JavaScript Interface' for examples.
 *
 * **Outgoing messages**
 *
 * The dashboard communicates with the macOS application by calling message handlers that
 * are added to `window.webkit.messageHandlers.*`. Please see the items below under the heading `"Webkit Message Handlers"`

 * @category integrations
 */
import {
    localeSettingsSchema,
    protectionsStatusSchema,
    requestDataSchema
} from '../../../schema/__generated__/schema.parsers'
import { getContentHeight, setupColorScheme, setupMutationObserver } from './common.es6'
import { createTabData } from './utils/request-details'

let channel = null

/**
 * @category Internal API
 * @param backgroundModel
 */
const backgroundMessage = (backgroundModel) => {
    channel = backgroundModel
}

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

/** @type {string | undefined} */
let locale

const combineSources = () => ({
    tab: Object.assign({},
        trackerBlockingData || {},
        {
            isPendingUpdates,
            parentEntity,
            consentManaged,
            platformLimitations: true,
            locale
        },
        permissionsData ? { permissions: permissionsData } : {},
        certificateData ? { certificate: certificateData } : {}
    )
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
    channel?.send('updateTabData')
}

// Integration APIs
// -----------------------------------------------------------------------------
/**
 * Call this method when there is updated request information.
 *
 * Note: this expects each call to provide the full data set each time, **not** any kind of delta
 *
 * @group macOS -> JavaScript Interface
 * @example
 *
 * ```javascript
 * window.onChangeTrackerBlockingData("https://example.com", rawRequestData)
 * ```
 *
 * @param {string} tabUrl
 * @param {import('../../../schema/__generated__/schema.types').RequestData} rawRequestData
 *
 * Please see [cnn.json](media://request-data-cnn.json) or [google.json](media://request-data-google.json) for examples of this type
 */
export function onChangeRequestData (tabUrl, rawRequestData) {
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

/**
 * {@inheritDoc common.onChangeProtectionStatus}
 * @type {import("./common.es6").onChangeProtectionStatus}
 * @group macOS -> JavaScript Interface
 *
 * @example On the swift side, evaluate JavaScript calling the correct method on `window`, something like this...
 * ```swift
 * // swift
 * evaluate(js: "window.onChangeTrackerBlockingData(\(safeTabUrl), \(trackerBlockingDataJson))", in: webView)
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

/**
 * {@inheritDoc common.onChangeLocale}
 * @type {import("./common.es6").onChangeLocale}
 * @group macOS -> JavaScript Interface
 * @example
 *
 * ```swift
 * // swift
 * evaluate(js: "window.onChangeLocale(\(localSettingsJsonString))", in: webView)
 * ```
 */
export function onChangeLocale (payload) {
    const parsed = localeSettingsSchema.safeParse(payload)
    if (!parsed.success) {
        console.error('could not parse incoming data from onChangeLocale')
        console.error(parsed.error)
        return
    }
    locale = parsed.data.locale
    channel?.send('updateTabData')
}

// -----------------------------------------------------------------------------

/**
 * @category Internal API
 * @param message
 * @returns {any}
 */
const fetch = (message) => {
    if (!window.webkit) {
        console.error('window.webkit not available')
        return
    }

    if (message.submitBrokenSiteReport) {
        privacyDashboardSubmitBrokenSiteReport({
            category: message.submitBrokenSiteReport.category,
            description: message.submitBrokenSiteReport.description
        })
        return
    }

    if (message.setList) {
        const { list, value } = message.setList
        if (list !== 'allowlisted') {
            console.warn('only `allowlisted` is currently supported on macos')
            return
        }

        // `allowlisted: true` means the user disabled protections.
        // so `isProtected` is the opposite of `allowlisted`.
        const isProtected = value === false
        window.webkit.messageHandlers.privacyDashboardSetProtection.postMessage(isProtected)

        // Call as if this was an outside change. This will trigger events to
        // have all models re-request data from background state.
        window.onChangeProtectionStatus(isProtected)
    }

    if (message.updatePermission) {
        window.webkit.messageHandlers.privacyDashboardSetPermission.postMessage({
            permission: message.updatePermission.id,
            value: message.updatePermission.value
        })
    }
}

/**
 * @category Internal API
 * @returns {Promise<unknown>}
 */
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
 * {@inheritDoc common.openInNewTab}
 * @type {import("./common.es6").openInNewTab}
 * @category Webkit Message Handlers
 */
export function privacyDashboardOpenUrlInNewTab (args) {
    window.webkit.messageHandlers.privacyDashboardOpenUrlInNewTab.postMessage({
        url: args.url
    })
}

/**
 * {@inheritDoc common.submitBrokenSiteReport}
 * @type {import("./common.es6").submitBrokenSiteReport}
 * @category Webkit Message Handlers
 */
export function privacyDashboardSubmitBrokenSiteReport (report) {
    window.webkit.messageHandlers.privacyDashboardSubmitBrokenSiteReport.postMessage({
        category: report.category,
        description: report.description
    })
}

/**
 * {@inheritDoc common.setSize}
 * @type {import("./common.es6").setSize}
 * @category Webkit Message Handlers
 */
export function privacyDashboardSetSize (payload) {
    window.webkit.messageHandlers.privacyDashboardSetSize.postMessage(payload)
}

export function setupShared () {
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
    window.onChangeProtectionStatus = onChangeProtectionStatus
    window.onChangeLocale = onChangeLocale
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
}

export function setup () {
    setupColorScheme()
    setupShared()
    setupMutationObserver((height) => {
        privacyDashboardSetSize({ height })
    })
    setupClickEventHandlers()
}

/**
 * Called when the DOM has been rendered for the first time. This is
 * helpful on platforms that need to update their window size immediately
 *
 * @type {NonNullable<import('./communication.es6').Communication['firstRenderComplete']>}
 * @category Internal API
 */
function firstRenderComplete () {
    const height = getContentHeight()
    if (typeof height === 'number') {
        privacyDashboardSetSize({ height })
    }
}

export function setupClickEventHandlers () {
    /**
     * on macOS + iOS, respond to all clicks on links with target="_blank"
     * by forwarding to the native side.
     */
    document.addEventListener('click', (e) => {
        const targetElem = e.target
        if (targetElem instanceof HTMLAnchorElement) {
            if (targetElem.target === '_blank' && targetElem.origin) {
                e.preventDefault()
                privacyDashboardOpenUrlInNewTab({
                    url: targetElem.href
                })
            }
        }
    })
}

export {
    fetch,
    backgroundMessage,
    getBackgroundTabData,
    firstRenderComplete
}
