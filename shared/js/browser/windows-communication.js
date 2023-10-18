/**
 * @module Windows integration
 *
 * @description
 *
 * **Incoming Messages**
 *
 * The Dashboard receives data from Windows by registering a listener on `window.chrome.webview`
 *
 * ```js
 * window.chrome.webview.addEventListener('message', (event) => handleViewModelUpdate(event.data))
 * ```
 *
 * Tip: See {@link "Windows integration".handleIncomingMessage} for details of supported messages.
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
 * ... where `name` will be one of the known message names, such as `"AddToAllowListCommand"`. See "JavaScript -> Windows Messages
 * OpenInNewTab" below for documented messages.
 *
 * @category integrations
 */
import { z } from 'zod'
import { windowsIncomingViewModelSchema, windowsIncomingVisibilitySchema } from '../../../schema/__generated__/schema.parsers.mjs'
import { setupGlobalOpenerListener } from '../ui/views/utils/utils'
import {
    assert,
    getContentHeight,
    OpenSettingsMessages,
    SetListsMessage,
    setupColorScheme,
    setupMutationObserver,
    SubmitBrokenSiteReportMessage,
    UpdatePermissionMessage,
} from './common.js'
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
let protections
let isPendingUpdates
let parentEntity

const combineSources = () => ({
    tab: Object.assign(
        {},
        trackerBlockingData || {},
        {
            isPendingUpdates,
            parentEntity,
        },
        permissionsData ? { permissions: permissionsData } : {},
        certificateData ? { certificate: certificateData } : {}
    ),
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
 * @param {import('../../../schema/__generated__/schema.types').WindowsViewModel} viewModel
 */
function handleViewModelUpdate(viewModel) {
    upgradedHttps = viewModel.upgradedHttps
    parentEntity = viewModel.parentEntity || {}
    permissionsData = viewModel.permissions || []
    certificateData = viewModel.certificates || []
    protections = viewModel.protections

    trackerBlockingData = createTabData(viewModel.tabUrl, upgradedHttps, viewModel.protections, viewModel.rawRequestData)
    trackerBlockingData.cookiePromptManagementStatus = viewModel.cookiePromptManagementStatus

    if (trackerBlockingData) trackerBlockingData.upgradedHttps = upgradedHttps

    resolveInitialRender()
}

// -----------------------------------------------------------------------------

function windowsPostMessage(name, data) {
    assert(typeof window.chrome.webview?.postMessage === 'function')
    window.chrome.webview.postMessage({
        Feature: 'PrivacyDashboard',
        Name: name,
        Data: data,
    })
}

/**
 * @type {import("./common.js").fetcher}
 */
async function fetch(message) {
    if (message instanceof SubmitBrokenSiteReportMessage) {
        SubmitBrokenSiteReport({
            category: message.category,
            description: message.description,
        })
        return
    }

    if (message instanceof OpenSettingsMessages) {
        OpenSettings({
            target: message.target,
        })
        return
    }

    if (message instanceof SetListsMessage) {
        for (const listItem of message.lists) {
            const { list, value } = listItem
            if (list !== 'allowlisted') {
                console.warn('only `allowlisted` is currently supported on windows')
                continue
            }

            // `allowlisted: true` means the user disabled protections.
            // so `isProtected` is the opposite of `allowlisted`.
            const isProtected = value === false
            /** @type {import('../../../schema/__generated__/schema.types').EventOrigin} */
            const eventOrigin = message.eventOrigin

            if (isProtected) {
                windowsPostMessage('RemoveFromAllowListCommand', { eventOrigin })
            } else {
                windowsPostMessage('AddToAllowListCommand', { eventOrigin })
            }
        }
    }

    if (message instanceof UpdatePermissionMessage) {
        windowsPostMessage('SetPermissionCommand', {
            permission: message.id,
            value: message.value,
        })
    }
}

/**
 * {@inheritDoc common.submitBrokenSiteReport}
 * @type {import("./common.js").submitBrokenSiteReport}
 * @group JavaScript -> Windows Messages
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
export function SubmitBrokenSiteReport(report) {
    windowsPostMessage('SubmitBrokenSiteReport', {
        category: report.category,
        description: report.description,
    })
}

/**
 * {@inheritDoc common.openInNewTab}
 * @type {import("./common.js").openInNewTab}
 * @group JavaScript -> Windows Messages
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
export function OpenInNewTab(args) {
    windowsPostMessage('OpenInNewTab', {
        url: args.url,
    })
}

/**
 * {@inheritDoc common.setSize}
 * @type {import("./common.js").setSize}
 * @group JavaScript -> Windows Messages
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
export function SetSize(payload) {
    windowsPostMessage('SetSize', payload)
}

/**
 * {@inheritDoc common.openSettings}
 * @type {import("./common.js").openSettings}
 * @group JavaScript -> Windows Messages
 *
 * @example
 *
 * ```javascript
 * window.chrome.webview.postMessage({
 *     Feature: 'PrivacyDashboard',
 *     Name: 'OpenSettings',
 *     Data: { target: 'cpm' }
 * })
 * ```
 */
export function OpenSettings(args) {
    windowsPostMessage('OpenSettings', args)
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
 * A list of the known messages we can handle from the windows layer.
 * Uses the key 'Name' to quickly differentiate between the messages
 */
const eventShape = z.discriminatedUnion('Name', [windowsIncomingViewModelSchema, windowsIncomingVisibilitySchema])

/**
 * Handle all messages sent from Windows via `window.chrome.webview.addEventListener`
 *
 * Currently accepted messages:
 * - {@link "Generated Schema Definitions".WindowsIncomingViewModel}
 * - {@link "Generated Schema Definitions".WindowsIncomingVisibility}
 *
 * @group Windows -> JavaScript Messages
 * @param {import('../../../schema/__generated__/schema.types').WindowsIncomingMessage} message
 */
export function handleIncomingMessage(message) {
    const parsed = eventShape.safeParse(message)
    if (!parsed.success) {
        console.error('cannot handle incoming message from event data', message)
        console.error(parsed.error)
        return
    }
    switch (parsed.data.Name) {
        case 'VisibilityChanged': {
            if (parsed.data.Data.isVisible === false) {
                document.body.innerHTML = ''
            }
            break
        }
        case 'ViewModelUpdated': {
            handleViewModelUpdate(parsed.data.Data)
        }
    }
}

export function setup() {
    if (!window.chrome.webview) {
        console.error('window.chrome.webview not available')
        return
    }
    setupColorScheme()
    assert(typeof window.chrome.webview?.addEventListener === 'function', 'window.chrome.webview.addEventListener is required')
    window.chrome.webview.addEventListener('message', (event) => {
        handleIncomingMessage(event.data)
    })
    setupMutationObserver((height) => {
        SetSize({ height })
    })
    setupGlobalOpenerListener((href) => {
        OpenInNewTab({
            url: href,
        })
    })
}

/**
 * Called when the DOM has been rendered for the first time. This is
 * helpful on platforms that need to update their window size immediately
 *
 * @type {NonNullable<import('./communication.js').Communication['firstRenderComplete']>}
 * @category Internal API
 */
function firstRenderComplete() {
    const height = getContentHeight()
    if (typeof height === 'number') {
        SetSize({ height })
    }
}

export { fetch, backgroundMessage, getBackgroundTabData, firstRenderComplete }
