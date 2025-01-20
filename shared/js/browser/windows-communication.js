/**
 *
 * **Incoming Messages**
 *
 * The Dashboard receives data from Windows by registering a listener on `window.chrome.webview`
 *
 * ```js
 * globalThis.windowsInteropAddEventListener('message', (event) => handleViewModelUpdate(event.data))
 * ```
 *
 * Tip: See {@link "Windows integration".handleIncomingMessage} for details of supported messages.
 *
 * **Outgoing messages**
 *
 * When the dashboard needs to communicate back to the Windows application, it will do so in the following way...
 *
 * ```js
 * globalThis.windowsInteropPostMessage({
 *     Feature: 'PrivacyDashboard',
 *     Name: name,
 *     Data: data
 * })
 * ```
 *
 * ... where `name` will be one of the known message names, such as `"AddToAllowListCommand"`. See "JavaScript -> Windows Messages
 * OpenInNewTab" below for documented messages.
 *
 * @module Windows integration
 * @category integrations
 */
import { z } from 'zod';
import {
    windowsIncomingViewModelSchema,
    windowsIncomingVisibilitySchema,
    windowsIncomingToggleReportOptionsSchema,
} from '../../../schema/__generated__/schema.parsers.mjs';
import { setupGlobalOpenerListener } from '../ui/views/utils/utils';
import {
    assert,
    CloseMessage,
    getContentHeight,
    OpenSettingsMessages,
    SetListsMessage,
    setupColorScheme,
    setupMutationObserver,
    SubmitBrokenSiteReportMessage,
    UpdatePermissionMessage,
    FetchToggleReportOptions,
    FetchBreakageFormOptions,
    RejectToggleBreakageReport,
    SeeWhatIsSent,
    SendToggleBreakageReport,
    ShowNativeFeedback,
    ReportBrokenSiteShown,
} from './common.js';
import { createTabData } from './utils/request-details.mjs';

let channel = null;
const backgroundMessage = (backgroundModel) => {
    channel = backgroundModel;
};

const getBackgroundTabDataPromises = [];
let trackerBlockingData;
let permissionsData;
let certificateData;
let upgradedHttps;
let protections;
let isPendingUpdates;
let parentEntity;

/** @type {string | undefined} */
let locale;

const combineSources = () => ({
    tab: Object.assign(
        {},
        trackerBlockingData || {},
        {
            isPendingUpdates,
            parentEntity,
            locale,
        },
        permissionsData ? { permissions: permissionsData } : {},
        certificateData ? { certificate: certificateData } : {}
    ),
});

const resolveInitialRender = function () {
    const isUpgradedHttpsSet = typeof upgradedHttps === 'boolean';
    const isIsProtectedSet = typeof protections !== 'undefined';
    const isTrackerBlockingDataSet = typeof trackerBlockingData === 'object';
    if (!isUpgradedHttpsSet || !isIsProtectedSet || !isTrackerBlockingDataSet) {
        return;
    }

    getBackgroundTabDataPromises.forEach((resolve) => resolve(combineSources()));
    channel?.send('updateTabData');
};

// Change handlers
// -----------------------------------------------------------------------------

/**
 * The Dashboard will listen for incoming messages
 *
 * @example
 *
 * ```js
 * globalThis.windowsInteropAddEventListener('message', event => handleViewModelUpdate(event.data))
 * ```
 *
 * @param {import('../../../schema/__generated__/schema.types').WindowsViewModel} viewModel
 */
function handleViewModelUpdate(viewModel) {
    upgradedHttps = viewModel.upgradedHttps;
    parentEntity = viewModel.parentEntity || {};
    permissionsData = viewModel.permissions || [];
    certificateData = viewModel.certificates || [];
    protections = viewModel.protections;
    locale = viewModel.localeSettings?.locale;

    trackerBlockingData = createTabData(viewModel.tabUrl, upgradedHttps, viewModel.protections, viewModel.rawRequestData);
    trackerBlockingData.cookiePromptManagementStatus = viewModel.cookiePromptManagementStatus;
    trackerBlockingData.isInvalidCert = viewModel.isInvalidCert;

    if (trackerBlockingData) trackerBlockingData.upgradedHttps = upgradedHttps;

    resolveInitialRender();
}

// -----------------------------------------------------------------------------

/**
 * Posts a message to the Windows Browser
 *
 * @param {string} name - Message name
 * @param {object} data - Message data
 * @param {{ Id?: string, SubFeatureName?: string }} [options] - Optional message data
 */
function windowsPostMessage(name, data, options = {}) {
    assert(typeof globalThis.windowsInteropPostMessage === 'function');

    const outgoing = {
        Feature: 'PrivacyDashboard',
        Name: name,
        Data: data,
        ...options,
    };

    globalThis.windowsInteropPostMessage(outgoing);
}

/**
 * @type {import("./common.js").fetcher}
 */
async function fetch(message) {
    if (message instanceof FetchToggleReportOptions || message instanceof FetchBreakageFormOptions) {
        return getToggleReportOptions();
    }

    if (message instanceof RejectToggleBreakageReport) {
        rejectToggleBreakageReport();
        return;
    }

    if (message instanceof SeeWhatIsSent) {
        seeWhatIsSent();
        return;
    }

    if (message instanceof ShowNativeFeedback) {
        showNativeFeedback();
        return;
    }

    if (message instanceof ReportBrokenSiteShown) {
        reportBrokenSiteShown();
        return;
    }

    if (message instanceof SendToggleBreakageReport) {
        sendToggleBreakageReport();
        return;
    }

    if (message instanceof SubmitBrokenSiteReportMessage) {
        SubmitBrokenSiteReport({
            category: message.category,
            description: message.description,
        });
        return;
    }

    if (message instanceof OpenSettingsMessages) {
        OpenSettings({
            target: message.target,
        });
        return;
    }

    if (message instanceof SetListsMessage) {
        for (const listItem of message.lists) {
            const { list, value } = listItem;
            if (list !== 'allowlisted') {
                if (!window.__playwright) console.warn('only `allowlisted` is currently supported on windows');
                continue;
            }

            // `allowlisted: true` means the user disabled protections.
            // so `isProtected` is the opposite of `allowlisted`.
            const isProtected = value === false;
            /** @type {import('../../../schema/__generated__/schema.types').EventOrigin} */
            const eventOrigin = message.eventOrigin;

            if (isProtected) {
                RemoveFromAllowListCommand(eventOrigin);
            } else {
                AddToAllowListCommand(eventOrigin);
            }
        }
    }

    if (message instanceof UpdatePermissionMessage) {
        SetPermissionCommand({
            permission: message.id,
            value: message.value,
        });
    }

    if (message instanceof CloseMessage) {
        CloseCommand(message.eventOrigin);
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
 * globalThis.windowsInteropPostMessage({
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
    });
}

/**
 * {@inheritDoc common.openInNewTab}
 * @type {import("./common.js").openInNewTab}
 * @group JavaScript -> Windows Messages
 *
 * @example
 *
 * ```javascript
 * globalThis.windowsInteropPostMessage({
 *    Feature: 'PrivacyDashboard',
 *    Name: 'OpenInNewTab',
 *    Data: { url: "https://example.com" }
 * })
 * ```
 */
export function OpenInNewTab(args) {
    windowsPostMessage('OpenInNewTab', {
        url: args.url,
    });
}

/**
 * {@inheritDoc common.setSize}
 * @type {import("./common.js").setSize}
 * @group JavaScript -> Windows Messages
 *
 * @example
 *
 * ```javascript
 * globalThis.windowsInteropPostMessage({
 *    Feature: 'PrivacyDashboard',
 *    Name: 'SetSize',
 *    Data: { height: 445 }
 * })
 * ```
 */
export function SetSize(payload) {
    windowsPostMessage('SetSize', payload);
}

/**
 * {@inheritDoc common.openSettings}
 * @type {import("./common.js").openSettings}
 * @group JavaScript -> Windows Messages
 *
 * @example
 *
 * ```javascript
 * globalThis.windowsInteropPostMessage({
 *     Feature: 'PrivacyDashboard',
 *     Name: 'OpenSettings',
 *     Data: { target: 'cpm' }
 * })
 * ```
 */
export function OpenSettings(args) {
    windowsPostMessage('OpenSettings', args);
}

/**
 * {@inheritDoc common.setPermission}
 * @type {import("./common.js").setPermission}
 * @group JavaScript -> Windows Messages
 *
 * @example
 *
 * ```javascript
 * globalThis.windowsInteropPostMessage({
 *     Feature: 'PrivacyDashboard',
 *     Name: 'SetPermissionCommand',
 *     Data: { permission: 'camera', value: "grant" }
 * })
 * ```
 */
export function SetPermissionCommand(args) {
    windowsPostMessage('SetPermissionCommand', args);
}

/**
 * Remove the current site from the User's allowlist
 * @param {import("../../../schema/__generated__/schema.types").EventOrigin} eventOrigin
 * @group JavaScript -> Windows Messages
 */
export function RemoveFromAllowListCommand(eventOrigin) {
    windowsPostMessage('RemoveFromAllowListCommand', { eventOrigin });
}

/**
 * Add the current site to the User's allowlist
 * @param {import("../../../schema/__generated__/schema.types").EventOrigin} eventOrigin
 * @group JavaScript -> Windows Messages
 */
export function AddToAllowListCommand(eventOrigin) {
    windowsPostMessage('AddToAllowListCommand', { eventOrigin });
}

/**
 * Close the dashboard
 * @param {import("../../../schema/__generated__/schema.types").EventOrigin} eventOrigin
 * @group JavaScript -> Windows Messages
 */
export function CloseCommand(eventOrigin) {
    windowsPostMessage('CloseCommand', { eventOrigin });
}

const getBackgroundTabData = () => {
    return new Promise((resolve) => {
        if (trackerBlockingData) {
            resolve(combineSources());
            return;
        }

        getBackgroundTabDataPromises.push(resolve);
    });
};

/**
 * A list of the known messages we can handle from the windows layer.
 * Uses the key 'Name' to quickly differentiate between the messages
 */
const eventShape = z.discriminatedUnion('Name', [windowsIncomingViewModelSchema, windowsIncomingVisibilitySchema]);

/**
 * Handle all messages sent from Windows via `globalThis.windowsInteropAddEventListener`
 *
 * Currently accepted messages:
 * - {@link "Generated Schema Definitions".WindowsIncomingViewModel}
 * - {@link "Generated Schema Definitions".WindowsIncomingVisibility}
 *
 * @group Windows -> JavaScript Messages
 * @param {import('../../../schema/__generated__/schema.types').WindowsIncomingMessage} message
 */
export function handleIncomingMessage(message) {
    const parsed = eventShape.safeParse(message);
    if (!parsed.success) {
        console.error('cannot handle incoming message from event data', message);
        console.error(parsed.error);
        return;
    }
    switch (parsed.data.Name) {
        case 'VisibilityChanged': {
            if (parsed.data.Data.isVisible === false) {
                document.body.innerHTML = '';
            }
            break;
        }
        case 'ViewModelUpdated': {
            handleViewModelUpdate(parsed.data.Data);
            break;
        }
    }
}

export function setup() {
    if (!globalThis.windowsInteropPostMessage) {
        console.error('globalThis.windowsInteropPostMessage');
        return;
    }
    setupColorScheme();
    assert(typeof globalThis.windowsInteropAddEventListener === 'function', 'globalThis.windowsInteropAddEventListener required');
    globalThis.windowsInteropAddEventListener('message', (event) => {
        if (event.data.Name) handleIncomingMessage(event.data);
    });
    windowsPostMessage('Ping', {});
    setupMutationObserver((height) => {
        SetSize({ height });
    });
    setupGlobalOpenerListener((href) => {
        OpenInNewTab({
            url: href,
        });
    });
}

/**
 * Called when the DOM has been rendered for the first time. This is
 * helpful on platforms that need to update their window size immediately
 *
 * @type {NonNullable<import('./communication.js').Communication['firstRenderComplete']>}
 * @category Internal API
 */
function firstRenderComplete() {
    const height = getContentHeight();
    if (typeof height === 'number') {
        SetSize({ height });
    }
}

/**
 * @return {Promise<import('../../../schema/__generated__/schema.types').ToggleReportScreen>}
 */
function getToggleReportOptions() {
    return new Promise((resolve) => {
        const requestId = String(Math.random());
        windowsPostMessage('GetToggleReportOptions', {}, { Id: requestId, SubFeatureName: 'GetToggleReportOptions' });

        /**
         * @param event
         */
        function handler(event) {
            const response = event.data;

            // TODO: How to better filter out non-toggle report data
            if (response.featureName !== 'GetToggleReportOptions') return;

            const parsed = windowsIncomingToggleReportOptionsSchema.safeParse(response);
            if (!parsed.success) {
                console.error('cannot handle incoming message from event data', response);
                console.error(parsed.error);
                return;
            }

            if (parsed.data.id === requestId) {
                window.chrome.webview?.removeEventListener?.('message', handler);
                resolve(parsed.data.result);
            } else {
                console.warn('no match', parsed, requestId);
            }
        }
        globalThis.windowsInteropAddEventListener('message', handler);
    });
}

function sendToggleBreakageReport() {
    windowsPostMessage('SendToggleBreakageReport', {});
}

function rejectToggleBreakageReport() {
    windowsPostMessage('RejectToggleBreakageReport', {});
}

function seeWhatIsSent() {
    windowsPostMessage('SeeWhatIsSent', {});
}

function showNativeFeedback() {
    windowsPostMessage('ShowNativeFeedback', {});
}

function reportBrokenSiteShown() {
    windowsPostMessage('ReportBrokenSiteShown', {});
}

export { fetch, backgroundMessage, getBackgroundTabData, firstRenderComplete };
