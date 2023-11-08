/**
 * @module iOS integration
 *
 * @description
 * iOS shares the majority of functionality from {@link "macOS integration"}, with the exception
 * of the webkit handlers listed below.
 *
 * **Incoming data**
 *
 * Please see the links under the heading 'macOS -> JavaScript Interface' from {@link "macOS integration"}
 *
 * Examples from the macOS integration:
 * - {@link "macOS integration".onChangeProtectionStatus}
 * - {@link "macOS integration".onChangeRequestData}
 * - {@link "macOS integration".onChangeLocale}
 *
 * **Outgoing messages**
 *
 * Although iOS uses the outgoing messages from the {@link "macOS integration"} - there are some that are iOS-only,
 * those are listed below under `"Webkit Message Handlers"`
 *
 * @category integrations
 */
import invariant from 'tiny-invariant'
import { CheckBrokenSiteReportHandledMessage, CloseMessage, setupColorScheme } from './common.js'
import { backgroundMessage, getBackgroundTabData, fetch as macosFetch, setupShared } from './macos-communication.js'

/**
 * iOS specific setup
 */
export function setup() {
    const setColorScheme = setupColorScheme()
    window.onChangeTheme = function (themeName) {
        setColorScheme(themeName)
    }
    window.history.replaceState({}, '', window.location.href)
    setupShared()
}

/**
 * Close the Dashboard.
 * @category Webkit Message Handlers
 * @param {{}} args - An empty object to keep the `webkit` message handlers happy
 * @example
 * ```js
 * window.webkit.messageHandlers.privacyDashboardClose.postMessage(args)
 * ```
 */
export function privacyDashboardClose(args) {
    invariant(window.webkit?.messageHandlers, 'webkit.messageHandlers required')
    window.webkit.messageHandlers.privacyDashboardClose.postMessage(args)
}

/**
 * On iOS, the breakage report form is handled natively - so all the dashboard needs
 * to do in this situation is ping the correct message to the backend.
 *
 * @category Webkit Message Handlers
 * @param {{}} args - An empty object to keep the `webkit` message handlers happy
 * @example
 * ```js
 * window.webkit.messageHandlers.privacyDashboardShowReportBrokenSite.postMessage(args)
 * ```
 */
export function privacyDashboardShowReportBrokenSite(args) {
    invariant(window.webkit?.messageHandlers, 'webkit.messageHandlers required')
    window.webkit.messageHandlers.privacyDashboardShowReportBrokenSite.postMessage(args)
}

/**
 * @category Internal API
 * @type {import("./common.js").fetcher}
 */
async function fetch(message) {
    if (message instanceof CloseMessage) {
        privacyDashboardClose({})
        return
    }

    if (message instanceof CheckBrokenSiteReportHandledMessage) {
        return false
    }

    return macosFetch(message)
}

export { backgroundMessage, getBackgroundTabData, fetch }
