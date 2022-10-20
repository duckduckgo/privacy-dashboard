/**
 * @module Windows integration
 *
 * @description
 *
 * **Incoming data**
 *
 * The Dashboard receives data from Windows by registering a listener on `window.chrome.webview`
 *
 * ```js
 * window.chrome.webview.addEventListener('message', (event) => handleViewModelUpdate(event.data))
 * ```
 *
 * Tip: See {@link handleViewModelUpdate} for details of what that message should contain
 *
 * **Outgoing messages**
 *
 * When the dashboard needs to communicate back to the Windows application, it will do so in the following way...
 *
 * ```js
 * window.chrome.webview.postMessage({
 *     Feature: 'PrivacyDashboard',
 *     Name: name,
 *     Data: data
 * })
 * ```
 *
 * ... where `name` will be one of the known message names, such as `"AddToAllowListCommand"`. See "Windows Webview Messages"
 * below for documented messages.
 *
 * @category integrations
 */
import {
    windowsViewModelSchema
} from '../../../schema/__generated__/schema.parsers'
import { assert, setupColorScheme, setupMutationObserver } from './common.es6'
import { createTabData } from './utils/request-details'

let channel = null
const backgroundMessage = (backgroundModel) => {
    channel = backgroundModel
}

const getBackgroundTabDataPromises = []
let trackerBlockingData
let permissionsData
let certificateData
let upgradedHttps
let protections
let isPendingUpdates
let parentEntity

const combineSources = () => ({
    tab: Object.assign({},
        trackerBlockingData || {},
        {
            isPendingUpdates,
            parentEntity
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

// Change handlers
// -----------------------------------------------------------------------------

/**
 * The Dashboard will listen for incoming messages
 *
 * @example
 *
 * ```js
 * window.chrome.webview.addEventListener('message', event => handleViewModelUpdate(event.data))
 * ```
 *
 * @group Windows -> JavaScript Interface
 * @param {import('../../../schema/__generated__/schema.types').WindowsViewModel} rawViewModel
 */
export function handleViewModelUpdate (rawViewModel) {
    const parsed = windowsViewModelSchema.safeParse(rawViewModel)
    if (!parsed.success) {
        console.error('rawViewModel parsing failed')
        console.error(parsed.error)
        return
    }
    const viewModel = parsed.data
    upgradedHttps = viewModel.upgradedHttps
    parentEntity = viewModel.parentEntity || {}
    permissionsData = viewModel.permissions || []
    certificateData = viewModel.certificates || []
    protections = viewModel.protections

    trackerBlockingData = createTabData(rawViewModel.tabUrl, upgradedHttps, viewModel.protections, viewModel.rawRequestData)

    if (trackerBlockingData) trackerBlockingData.upgradedHttps = upgradedHttps

    resolveInitialRender()
}

// -----------------------------------------------------------------------------

function windowsPostMessage (name, data) {
    assert(typeof window.chrome.webview?.postMessage === 'function')
    window.chrome.webview.postMessage({
        Feature: 'PrivacyDashboard',
        Name: name,
        Data: data
    })
}

const fetch = (message) => {
    if (!window.chrome.webview) {
        console.error('window.chrome.webview not available')
        return
    }

    if (message.submitBrokenSiteReport) {
        SubmitBrokenSiteReport({
            category: message.submitBrokenSiteReport.category,
            description: message.submitBrokenSiteReport.description
        })
        return
    }

    if (message.setList) {
        const { list, value } = message.setList
        if (list !== 'allowlisted') {
            console.warn('only `allowlisted` is currently supported on windows')
            return
        }

        // `allowlisted: true` means the user disabled protections.
        // so `isProtected` is the opposite of `allowlisted`.
        const isProtected = value === false

        if (isProtected) {
            windowsPostMessage('RemoveFromAllowListCommand')
        } else {
            windowsPostMessage('AddToAllowListCommand')
        }

        // Call as if this was an outside change. This will trigger events to
        // have all models re-request data from background state.
        window.onChangeProtectionStatus(isProtected)
    }

    if (message.updatePermission) {
        windowsPostMessage('SetPermissionCommand', {
            permission: message.updatePermission.id,
            value: message.updatePermission.value
        })
    }
}

/**
 * {@inheritDoc common.submitBrokenSiteReport}
 * @type {import("./common.es6").submitBrokenSiteReport}
 * @category Windows Webview Messages
 *
 * @example
 *
 * ```javascript
 * window.chrome.webview.postMessage({
 *    Feature: 'PrivacyDashboard',
 *    Name: 'SubmitBrokenSiteReport',
 *    Data: { category: "videos", description: "something was broken :(" }
 * })
 * ```
 */
export function SubmitBrokenSiteReport (report) {
    windowsPostMessage('SubmitBrokenSiteReport', {
        category: report.category,
        description: report.description
    })
}

/**
 * {@inheritDoc common.openInNewTab}
 * @type {import("./common.es6").openInNewTab}
 * @category Windows Webview Messages
 *
 * @example
 *
 * ```javascript
 * window.chrome.webview.postMessage({
 *    Feature: 'PrivacyDashboard',
 *    Name: 'OpenInNewTab',
 *    Data: { url: "https://example.com" }
 * })
 * ```
 */
export function OpenInNewTab (args) {
    windowsPostMessage('OpenInNewTab', {
        url: args.url
    })
}

/**
 * {@inheritDoc common.setSize}
 * @type {import("./common.es6").setSize}
 * @category Windows Webview Messages
 *
 * @example
 *
 * ```javascript
 * window.chrome.webview.postMessage({
 *    Feature: 'PrivacyDashboard',
 *    Name: 'SetSize',
 *    Data: { height: 445 }
 * })
 * ```
 */
export function SetSize (payload) {
    windowsPostMessage('SetSize', payload)
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

export function setup () {
    setupColorScheme()
    assert(typeof window.chrome.webview?.addEventListener === 'function', 'window.chrome.webview.addEventListener is required')
    window.chrome.webview.addEventListener('message', event => handleViewModelUpdate(event.data))
    // todo(Shane): does this fire early enough on Windows
    setupMutationObserver((height) => {
        SetSize({ height })
    })
    /**
     * on macOS, respond to all clicks on links with target="_blank"
     * by forwarding to the native side.
     */
    document.addEventListener('click', (e) => {
        const targetElem = e.target
        if (targetElem instanceof HTMLAnchorElement) {
            if (targetElem.target === '_blank' && targetElem.origin) {
                e.preventDefault()
                OpenInNewTab({
                    url: targetElem.href
                })
            }
        }
    })
}

export {
    fetch,
    backgroundMessage,
    getBackgroundTabData
}
