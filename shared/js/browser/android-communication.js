/**
 * On Android, all data for the dashboard is delivered via methods that have been
 * attached to the global `window` object.
 *
 * Please see the aboutLink below under the heading 'Integration API'
 *
 * @module Android integration
 * @category integrations
 */
import {
    cookiePromptManagementStatusSchema,
    localeSettingsSchema,
    maliciousSiteStatusSchema,
    protectionsStatusSchema,
    remoteFeatureSettingsSchema,
    requestDataSchema,
} from '../../../schema/__generated__/schema.parsers.mjs';
import { setupBlurOnLongPress, setupGlobalOpenerListener } from '../ui/views/utils/utils';
import {
    CheckBrokenSiteReportHandledMessage,
    CloseMessage,
    FetchToggleReportOptions,
    FetchBreakageFormOptions,
    OpenSettingsMessages,
    RejectToggleBreakageReport,
    SeeWhatIsSent,
    SendToggleBreakageReport,
    SetListsMessage,
    setupColorScheme,
    SubmitBrokenSiteReportMessage,
    ShowNativeFeedback,
    ReportBrokenSiteShown,
} from './common.js';
import { createTabData } from './utils/request-details.mjs';
import invariant from 'tiny-invariant';

let channel = null;
const backgroundMessage = (backgroundModel) => {
    channel = backgroundModel;
};
const getBackgroundTabDataPromises = [];
let trackerBlockingData;
let permissionsData;
let certificateData;
let upgradedHttps;
/** @type {import("./utils/protections.mjs").Protections | undefined} */
let protections;
let isPendingUpdates;
let parentEntity;
const cookiePromptManagementStatus = {};

/** @type {import('../../../schema/__generated__/schema.types').MaliciousSiteStatus} */
let maliciousSiteStatus;

/** @type {string | undefined} */
let locale;

/** @type {import('../../../schema/__generated__/schema.types').RemoteFeatureSettings | undefined} */
let featureSettings;

const combineSources = () => ({
    tab: Object.assign(
        {},
        trackerBlockingData || {},
        { maliciousSiteStatus: maliciousSiteStatus ?? null },
        {
            isPendingUpdates,
            parentEntity,
            cookiePromptManagementStatus,
            locale,
        },
        permissionsData ? { permissions: permissionsData } : {},
        certificateData ? { certificate: certificateData } : {}
    ),
    featureSettings,
});

const resolveInitialRender = function () {
    const isUpgradedHttpsSet = typeof upgradedHttps === 'boolean';
    const isIsProtectedSet = typeof protections !== 'undefined';
    const isTrackerBlockingDataSet = typeof trackerBlockingData === 'object';
    const isLocaleSet = typeof locale === 'string';
    const isMaliciousSiteSet = maliciousSiteStatus && maliciousSiteStatus.kind !== undefined;
    if (!isLocaleSet || !isUpgradedHttpsSet || !isIsProtectedSet || !isTrackerBlockingDataSet || !isMaliciousSiteSet) {
        return;
    }

    getBackgroundTabDataPromises.forEach((resolve) => resolve(combineSources()));
    channel?.send('updateTabData', { via: 'resolveInitialRender' });
};

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

    const requestData = requestDataSchema.safeParse(rawRequestData);
    if (!protections) {
        console.error('protections status not set');
        return;
    }
    if (!requestData.success) {
        console.error('could not parse incoming request data from `onChangeRequestData`');
        console.log(requestData.error);
        return;
    }
    trackerBlockingData = createTabData(tabUrl, upgradedHttps, protections, requestData.data);
    resolveInitialRender();
}

/**
 * {@inheritDoc common.onChangeProtectionStatus}
 * @type {import("./common.js").onChangeProtectionStatus}
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
    const parsed = protectionsStatusSchema.safeParse(protectionsStatus);
    if (!parsed.success) {
        console.error('could not parse incoming protection status from onChangeProtectionStatus');
        console.error(parsed.error);
        return;
    }
    protections = parsed.data;

    resolveInitialRender();
}

/**
 * {@inheritDoc common.onChangeLocale}
 * @type {import("./common.js").onChangeLocale}
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
    const parsed = localeSettingsSchema.safeParse(payload);
    if (!parsed.success) {
        console.error('could not parse incoming protection status from onChangeLocale');
        console.error(parsed.error);
        return;
    }
    locale = parsed.data.locale;
    channel?.send('updateTabData', { via: 'onChangeLocale' });
}

/**
 * {@inheritDoc common.onChangeMaliciousSiteStatus}
 * @type {import("./common.js").onChangeMaliciousSiteStatus}
 * @group macOS -> JavaScript Interface
 * @example
 *
 * ```kotlin
 * // kotlin
 * webView.evaluateJavascript("javascript:onChangeMaliciousSiteStatus(${maliciousSiteStatusJsonString});", null)
 * ```
 */
export function onChangeMaliciousSiteStatus(payload) {
    const parsed = maliciousSiteStatusSchema.safeParse(payload);
    if (!parsed.success) {
        console.error('could not parse incoming data from onChangeMaliciousSiteStatus');
        console.error(parsed.error);
        return;
    }
    maliciousSiteStatus = parsed.data;
    resolveInitialRender();
}

/**
 * {@inheritDoc common.onChangeFeatureSettings}
 * @type {import("./common.js").onChangeFeatureSettings}
 * @group Android -> JavaScript Interface
 *
 * @example
 *
 * ```kotlin
 * // kotlin
 * webView.evaluateJavascript("javascript:onChangeFeatureSettings(${featureSettingsAsJsonString});", null)
 * ```
 */
export function onChangeFeatureSettings(payload) {
    const parsed = remoteFeatureSettingsSchema.safeParse(payload);
    if (!parsed.success) {
        console.error('could not parse incoming protection status from onChangeFeatureSettings');
        console.error(parsed.error);
        return;
    }
    featureSettings = parsed.data;
    channel?.send('updateTabData', { via: 'onChangeFeatureSettings' });
}

/**
 * {@inheritDoc common.onChangeConsentManaged}
 * @type {import("./common.js").onChangeConsentManaged}
 * @group Android -> JavaScript Interface
 * @example On Android, it might look something like this:
 *
 * ```kotlin
 * // kotlin
 * webView.evaluateJavascript("javascript:onChangeConsentManaged(${cookiePromptManagementStatusAsJsonString});", null)
 * ```
 */
export function onChangeConsentManaged(payload) {
    const parsed = cookiePromptManagementStatusSchema.safeParse(payload);
    if (!parsed.success) {
        console.error('could not parse incoming data from onChangeConsentManaged');
        console.error(parsed.error);
        return;
    }
    Object.assign(cookiePromptManagementStatus, parsed.data);
    channel?.send('updateTabData');
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
 * @hideconstructor
 */
export class PrivacyDashboardJavascriptInterface {
    /**
     * @param {import('../../../schema/__generated__/schema.types').SetProtectionParams} params
     *
     * Add the current domain to the 'allowlist'
     *
     * ```js
     * window.PrivacyDashboard.toggleAllowlist(JSON.stringify({
     *   "isProtected": true,
     *   "eventOrigin": { "screen": "primaryScreen" }
     * }))
     * ```
     *
     * Remove the current domain from the 'allowlist'
     *
     * ```js
     * window.PrivacyDashboard.toggleAllowlist(JSON.stringify({
     *   "isProtected": false,
     *   "eventOrigin": { "screen": "primaryScreen" }
     * }))
     * ```
     */
    toggleAllowlist(params) {
        window.PrivacyDashboard.toggleAllowlist(JSON.stringify(params));
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
        window.PrivacyDashboard.showBreakageForm();
    }

    /**
     * @example
     * ```
     * window.PrivacyDashboard.close()
     * ```
     */
    close() {
        window.PrivacyDashboard.close();
    }

    /**
     * {@inheritDoc common.openInNewTab}
     * @type {import("./common.js").openInNewTab}
     * ```js
     * const payload = JSON.stringify({
     *     "url": "https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/"
     * });
     * window.PrivacyDashboard.openInNewTab(payload)
     * ```
     */
    openInNewTab(payload) {
        window.PrivacyDashboard.openInNewTab(JSON.stringify(payload));
    }

    /**
     * {@inheritDoc common.openSettings}
     * @type {import("./common.js").openSettings}
     * @example
     * ```js
     * const payload = JSON.stringify({
     *     "target": "cpm"
     * });
     * window.PrivacyDashboard.openSettings(payload)
     * ```
     */
    openSettings(payload) {
        window.PrivacyDashboard.openSettings(JSON.stringify(payload));
    }

    /**
     * {@inheritDoc common.submitBrokenSiteReport}
     * @type {import("./common.js").submitBrokenSiteReport}
     */
    submitBrokenSiteReport(payload) {
        invariant(typeof window.PrivacyDashboard?.submitBrokenSiteReport, 'window.PrivacyDashboard.submitBrokenSiteReport required');
        window.PrivacyDashboard.submitBrokenSiteReport(JSON.stringify(payload));
    }

    /**
     * {@inheritDoc common.getToggleReportOptions}
     * @type {import("./common.js").getToggleReportOptions}
     * @returns {Promise<import('../../../schema/__generated__/schema.types').ToggleReportScreen>}
     */
    getToggleReportOptions() {
        invariant(typeof window.PrivacyDashboard?.getToggleReportOptions, 'window.PrivacyDashboard.getToggleReportOptions required');
        window.PrivacyDashboard.getToggleReportOptions();
        return new Promise((resolve) => {
            window.onGetToggleReportOptionsResponse = (data) => {
                resolve(data);
                Reflect.deleteProperty(window, 'onGetToggleReportOptionsResponse');
            };
        });
    }

    /**
     * {@inheritDoc common.sendToggleReport}
     * @type {import("./common.js").sendToggleReport}
     * @example
     * ```js
     * window.PrivacyDashboard.sendToggleReport()
     * ```
     */
    sendToggleReport() {
        invariant(window.PrivacyDashboard?.sendToggleReport, 'sendToggleReport missing');
        window.PrivacyDashboard.sendToggleReport();
    }

    /**
     * {@inheritDoc common.rejectToggleReport}
     * @type {import("./common.js").rejectToggleReport}
     */
    rejectToggleReport() {
        invariant(window.PrivacyDashboard?.rejectToggleReport, 'rejectToggleReport missing');
        window.PrivacyDashboard.rejectToggleReport();
    }

    /**
     * {@inheritDoc common.seeWhatIsSent}
     * @type {import("./common.js").seeWhatIsSent}
     */
    seeWhatIsSent() {
        invariant(window.PrivacyDashboard?.seeWhatIsSent, 'seeWhatIsSent missing');
        window.PrivacyDashboard.seeWhatIsSent();
    }

    /**
     * {@inheritDoc common.showNativeFeedback}
     * @type {import("./common.js").showNativeFeedback}
     */
    showNativeFeedback() {
        invariant(window.PrivacyDashboard?.showNativeFeedback, 'showNativeFeedback missing');
        window.PrivacyDashboard.showNativeFeedback();
    }

    /**
     * {@inheritDoc common.reportBrokenSiteShown}
     * @type {import("./common.js").reportBrokenSiteShown}
     */
    reportBrokenSiteShown() {
        invariant(window.PrivacyDashboard?.reportBrokenSiteShown, 'reportBrokenSiteShown missing');
        window.PrivacyDashboard.reportBrokenSiteShown();
    }
}

/**
 * @type {PrivacyDashboardJavascriptInterface}
 */
let privacyDashboardApi;

// -----------------------------------------------------------------------------

/**
 * @type {import("./common.js").fetcher}
 */
async function fetchAndroid(message) {
    if (message instanceof SetListsMessage) {
        for (const listItem of message.lists) {
            const { list, value } = listItem;
            if (list !== 'allowlisted') {
                if (!window.__playwright) console.warn('only `allowlisted` is currently supported on android');
                continue;
            }

            // `allowlisted: true` means the user disabled protections.
            // so `isProtected` is the opposite of `allowlisted`.
            const isProtected = value === false;
            privacyDashboardApi.toggleAllowlist({ eventOrigin: message.eventOrigin, isProtected });
        }
        return;
    }

    if (message instanceof CloseMessage) {
        privacyDashboardApi.close();
        return;
    }

    if (message instanceof CheckBrokenSiteReportHandledMessage) {
        // This method is kept here for now so that Android can toggle the native breakage form if needed.
        // On the Android side, this is behind a feature flag and will noop when the web-based form is enabled
        privacyDashboardApi.showBreakageForm();
        return true; // Return true to prevent HTML form from showing
    }

    if (message instanceof SubmitBrokenSiteReportMessage) {
        privacyDashboardApi.submitBrokenSiteReport({
            category: message.category,
            description: message.description,
        });
        return true; // Return true to prevent HTML form from showing
    }

    if (message instanceof OpenSettingsMessages) {
        return privacyDashboardApi.openSettings({
            target: message.target,
        });
    }

    if (message instanceof FetchToggleReportOptions || message instanceof FetchBreakageFormOptions) {
        return privacyDashboardApi.getToggleReportOptions();
    }

    if (message instanceof SendToggleBreakageReport) {
        return privacyDashboardApi.sendToggleReport();
    }

    if (message instanceof RejectToggleBreakageReport) {
        return privacyDashboardApi.rejectToggleReport();
    }

    if (message instanceof SeeWhatIsSent) {
        return privacyDashboardApi.seeWhatIsSent();
    }

    if (message instanceof ShowNativeFeedback) {
        return privacyDashboardApi.showNativeFeedback();
    }

    if (message instanceof ReportBrokenSiteShown) {
        return privacyDashboardApi.reportBrokenSiteShown();
    }

    console.warn('unhandled message', message);
}

const getBackgroundTabDataAndroid = () => {
    return new Promise((resolve) => {
        if (trackerBlockingData) {
            resolve(combineSources());
            return;
        }

        getBackgroundTabDataPromises.push(resolve);
    });
};

export function setup(debug) {
    const setColorScheme = setupColorScheme();
    window.onChangeTheme = function (themeName) {
        setColorScheme(themeName);
    };
    window.onChangeProtectionStatus = onChangeProtectionStatus;
    window.onChangeLocale = onChangeLocale;
    window.onChangeMaliciousSiteStatus = onChangeMaliciousSiteStatus;
    window.onChangeRequestData = onChangeRequestData;
    window.onChangeConsentManaged = onChangeConsentManaged;
    window.onChangeFeatureSettings = onChangeFeatureSettings;

    window.onChangeAllowedPermissions = function (data) {
        permissionsData = data;
        channel?.send('updateTabData', { via: 'onChangeAllowedPermissions' });
    };
    window.onChangeUpgradedHttps = function (data) {
        upgradedHttps = data;
        if (trackerBlockingData) trackerBlockingData.upgradedHttps = upgradedHttps;
        resolveInitialRender();
    };
    window.onChangeCertificateData = function (data) {
        certificateData = data.secCertificateViewModels;
        channel?.send('updateTabData', { via: 'onChangeCertificateData' });
    };
    window.onIsPendingUpdates = function (data) {
        isPendingUpdates = data;
        channel?.send('updateTabData', { via: 'onIsPendingUpdates' });
    };
    window.onChangeParentEntity = function (data) {
        parentEntity = data;
        channel?.send('updateTabData', { via: 'onChangeParentEntity' });
    };

    /**
     * This matches what Android injects into the webview
     * @type {PrivacyDashboardJavascriptInterface}
     */
    privacyDashboardApi = new PrivacyDashboardJavascriptInterface();

    // Blur elements on Android when a long-press is detected
    setupBlurOnLongPress();
    setupGlobalOpenerListener((href) => {
        privacyDashboardApi.openInNewTab({
            url: href,
        });
    });

    if (debug) installAndroidCommunicationsProxy();
}
export const getBackgroundTabData = new Proxy(getBackgroundTabDataAndroid, {
    apply(target, thisArg, argArray) {
        // console.log('🚀 getBackgroundTabData...', JSON.stringify(argArray))
        return Reflect.apply(target, thisArg, argArray);
    },
});
export const fetch = new Proxy(fetchAndroid, {
    apply(target, thisArg, argArray) {
        // console.log('🚀 fetch...', JSON.stringify(argArray))
        return Reflect.apply(target, thisArg, argArray);
    },
});

function installAndroidCommunicationsProxy() {
    const handler = {
        get(target, propKey, receiver) {
            const origMethod = target[propKey];
            if (typeof origMethod === 'function') {
                return function (...args) {
                    if (args.length === 0) {
                        console.log(`🤖 called window.PrivacyDashboard.${propKey} without args`);
                    } else {
                        console.log(`🤖 called window.PrivacyDashboard.${propKey} with`, ...args);
                    }
                    return Reflect.apply(origMethod, receiver, args);
                };
            } else {
                // If the property is not a function, return it as is
                return origMethod;
            }
        },
    };
    window.PrivacyDashboard = new Proxy(window.PrivacyDashboard, handler);
}

export { backgroundMessage };
