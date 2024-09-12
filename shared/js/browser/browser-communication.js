/**
 * @module Browser/Extensions integration
 *
 * @description
 * This is the communications layer for our Browser extensions
 *
 * @category integrations
 */
import {
    breakageReportRequestSchema,
    getPrivacyDashboardDataSchema,
    incomingExtensionMessageSchema,
    outgoingExtensionMessageSchema,
    refreshAliasResponseSchema,
    setListOptionsSchema,
} from '../../../schema/__generated__/schema.parsers.mjs'
import {
    BurnMessage,
    CheckBrokenSiteReportHandledMessage,
    FetchBurnOptions,
    FetchToggleReportOptions,
    OpenOptionsMessage,
    RefreshEmailAliasMessage,
    RejectToggleBreakageReport,
    SearchMessage,
    SendToggleBreakageReport,
    SetBurnDefaultOption,
    SetListsMessage,
    setupColorScheme,
    SubmitBrokenSiteReportMessage,
} from './common.js'
import { createTabData } from './utils/request-details.mjs'
import { Protections } from './utils/protections.mjs'

let channel
let port

const devtoolsMessageResponseReceived = new EventTarget()

function openPort() {
    port = chrome.runtime.connect({ name: 'privacy-dashboard' })
    port.onDisconnect.addListener(openPort)
    port.onMessage.addListener((message) => {
        // console.log('did receive raw', message)
        const parsed = incomingExtensionMessageSchema.safeParse(message)
        // console.log('did parse into', parsed)

        if (!parsed.success) {
            return console.warn('the incoming message was not accepted', message)
        }

        switch (parsed.data.messageType) {
            case 'response': {
                const { id, options } = parsed.data
                // console.log('did send options from', parsed.data)
                devtoolsMessageResponseReceived.dispatchEvent(new CustomEvent(String(id), { detail: options }))
                break
            }
            case 'toggleReport': {
                window.location.search = '?screen=toggleReport&opener=dashboard'
                break
            }
            case 'closePopup': {
                channel.send('updateTabData')
                break
            }
            case 'updateTabData': {
                channel.send('updateTabData')
                break
            }
            default: {
                console.warn('unhandled message')
            }
        }
    })
}

function notify(messageType, options = {}) {
    port.postMessage({ messageType, options })
}

/**
 * @param {string} messageType
 * @param {Record<string, any>} [options] optional payload
 * @return {Promise<any>}
 */
function request(messageType, options = {}) {
    return new Promise((resolve, reject) => {
        const outgoing = {
            messageType,
            options,
            id: Math.random(),
        }
        const parsed = outgoingExtensionMessageSchema.safeParse(outgoing)
        if (!parsed.success) {
            return reject(new Error('invalid message ' + JSON.stringify(outgoing)))
        }
        // console.log('Will 👂 for', outgoing.id)
        devtoolsMessageResponseReceived.addEventListener(
            String(outgoing.id),
            (/** @type {any} */ evt) => {
                resolve(evt.detail)
            },
            { once: true }
        )
        port.postMessage(outgoing)
    })
}

export function setup() {
    setupColorScheme()
}

/**
 * @type {import("./common.js").fetcher}
 */
export async function fetch(message) {
    // console.log('⏱ [extension.fetch]', JSON.stringify(message, null, 2))
    // ensure the HTML form is shown for the extension
    if (message instanceof CheckBrokenSiteReportHandledMessage) {
        return false
    }
    if (message instanceof SubmitBrokenSiteReportMessage) {
        return submitBrokenSiteReport(message)
    }
    if (message instanceof SetListsMessage) {
        return setLists(message)
    }
    if (message instanceof SearchMessage) {
        return search(message)
    }
    if (message instanceof RefreshEmailAliasMessage) {
        return refreshAlias()
    }
    if (message instanceof OpenOptionsMessage) {
        return openOptions()
    }
    if (message instanceof BurnMessage) {
        return doBurn(message)
    }
    if (message instanceof FetchBurnOptions) {
        return getBurnOptions()
    }
    if (message instanceof SetBurnDefaultOption) {
        return setBurnDefaultOption(message)
    }
    if (message instanceof SendToggleBreakageReport) {
        return sendToggleReport()
    }
    if (message instanceof RejectToggleBreakageReport) {
        return rejectToggleReport()
    }
    if (message instanceof FetchToggleReportOptions) {
        return getToggleReportOptions()
    }
    return Promise.reject(new Error('unhandled message: ' + JSON.stringify(message)))
}

/**
 * {@inheritDoc common.submitBrokenSiteReport}
 * @type {import("./common.js").submitBrokenSiteReport}
 * @category Dashboard -> Extension Messages
 *
 * @example
 *
 * ```javascript
 * port.postMessage({
 *    messageType: 'submitBrokenSiteReport',
 *    options: { category: "videos", description: "something was broken :(" }
 * })
 * ```
 */
export async function submitBrokenSiteReport(report) {
    const parsedInput = breakageReportRequestSchema.parse(report)
    notify('submitBrokenSiteReport', parsedInput)
}

/**
 * {@inheritDoc common.setLists}
 * @type {import("./common.js").setLists}
 * @category Dashboard -> Extension Messages
 *
 * @example
 *
 * ```javascript
 * port.postMessage({
 *    messageType: 'setLists',
 *    options: {
 *      lists: [
 *        {
 *          list: 'allowlist',
 *          domain: 'https://example.com',
 *          value: true
 *        },
 *        {
 *          list: 'denylist',
 *          domain: 'https://example.com',
 *          value: false
 *        },
 *      ]
 *    }
 * })
 * ```
 */
export async function setLists(options) {
    const parsedInput = setListOptionsSchema.parse(options)
    return notify('setLists', parsedInput)
}

/**
 * {@inheritDoc common.refreshAlias}
 * @type {import("./common.js").refreshAlias}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * port.postMessage({
 *    messageType: 'refreshAlias',
 * })
 * ```
 */
export async function refreshAlias() {
    const result = await request('refreshAlias')
    return refreshAliasResponseSchema.parse(result)
}

/**
 * {@inheritDoc common.search}
 * @type {import("./common.js").search}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * port.postMessage({
 *    messageType: 'search',
 *    options: {
 *        term: 'nike'
 *    }
 * })
 * ```
 */
export async function search(options) {
    return notify('search', options)
}

/**
 * {@inheritDoc common.openOptions}
 * @type {import("./common.js").openOptions}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * port.postMessage({
 *    messageType: 'openOptions'
 * })
 * ```
 */
export async function openOptions() {
    return notify('openOptions')
}

/**
 * {@inheritDoc common.sendToggleReport}
 * @type {import("./common.js").sendToggleReport}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * window.chrome.runtime.sendMessage({
 *    messageType: 'sendToggleReport'
 * })
 * ```
 */
export async function sendToggleReport() {
    return notify('sendToggleReport')
}

/**
 * {@inheritDoc common.rejectToggleReport}
 * @type {import("./common.js").rejectToggleReport}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * window.chrome.runtime.sendMessage({
 *    messageType: 'rejectToggleReport'
 * })
 * ```
 */
export async function rejectToggleReport() {
    return notify('rejectToggleReport')
}

/**
 * @category Dashboard -> Extension Messages
 * @return {Promise<import('../../../schema/__generated__/schema.types').FireButtonData>}
 * @example
 * ```javascript
 * port.postMessage({
 *    messageType: 'getBurnOptions',
 *    options: {}
 * })
 * ```
 */
export function getBurnOptions() {
    return request('getBurnOptions')
}

/**
 * @category Dashboard -> Extension Messages
 * @return {Promise<import('../../../schema/__generated__/schema.types').ToggleReportScreen>}
 * @example
 * ```javascript
 * port.postMessage({
 *    messageType: 'getToggleReportOptions',
 *    options: {}
 * })
 * ```
 */
export function getToggleReportOptions() {
    return request('getToggleReportOptions')
}

/**
 * @category Dashboard -> Extension Messages
 * @param {SetBurnDefaultOption} message
 * @example
 * ```javascript
 * port.postMessage({
 *    messageType: 'setBurnDefaultOption',
 *    options: {
 *        defaultOption: "CurrentSite"
 *    }
 * })
 * ```
 */
export function setBurnDefaultOption(message) {
    return request('setBurnDefaultOption', message)
}

/**
 * @param {BurnMessage} message
 * @category Dashboard -> Extension Messages
 * @example
 * ```javascript
 * port.postMessage({
 *    messageType: 'doBurn'
 * })
 * ```
 */
export async function doBurn(message) {
    const browsingDataPermissions = {
        permissions: ['browsingData'],
    }
    const permissionRequestGranted = await new Promise((resolve) => chrome.permissions.request(browsingDataPermissions, resolve))
    if (!permissionRequestGranted) {
        throw new Error('Permission not granted')
    }
    return notify('doBurn', message)
}

/**
 * @param {number|null} tabId
 * @returns {Promise<import('../../../schema/__generated__/schema.types').GetPrivacyDashboardData>}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```js
 * port.postMessage({
 *    messageType: 'getPrivacyDashboardData',
 *    options: {
 *        tabId: 99234
 *    }
 * })
 * ```
 */
export async function getPrivacyDashboardData(tabId) {
    return request('getPrivacyDashboardData', { tabId })
}

export function backgroundMessage(_channel) {
    channel = _channel
    openPort()
}

/**
 * @returns {Promise<{
 *   tab: import('./utils/request-details.mjs').TabData,
 *   emailProtectionUserData?: import('../../../schema/__generated__/schema.types').EmailProtectionUserData,
 *   fireButton?: { enabled: boolean }
 * }>}
 */
export async function getBackgroundTabData() {
    // @ts-ignore
    const tabIdParam = new URL(document.location.href).searchParams.get('tabId')
    const isNumeric = tabIdParam && !Number.isNaN(Number(tabIdParam))
    const tabId = isNumeric ? Number(tabIdParam) : null
    const resp = await getPrivacyDashboardData(tabId)
    const parsedMessageData = getPrivacyDashboardDataSchema.safeParse(resp)

    if (parsedMessageData.success === true) {
        const { tab, emailProtectionUserData, requestData, fireButton } = parsedMessageData.data
        const { upgradedHttps, url, parentEntity, specialDomainName, id, localeSettings } = tab

        const protections = new Protections(
            tab.protections.unprotectedTemporary,
            tab.protections.enabledFeatures,
            tab.protections.allowlisted,
            tab.protections.denylisted
        )
        return {
            tab: {
                ...createTabData(url, upgradedHttps, protections, requestData),
                id,
                // if the extension sends this value, then use it as-is. Otherwise, the default of 'en' will take effect
                locale: localeSettings?.locale,
                search: {},
                emailProtection: {},
                ctaScreens: {},
                parentEntity,
                specialDomainName,
            },
            emailProtectionUserData,
            fireButton,
        }
    } else {
        console.log('getPrivacyDashboardDataSchema failed', parsedMessageData.error)
        console.log('getPrivacyDashboardDataSchema failed: ', JSON.stringify(resp))
    }

    if (!window.__playwright) {
        console.log('🙏 getBackgroundTabData ❌', parsedMessageData.error, resp)
    }

    // todo(Shane): Have an error state here instead?
    const protections = {
        allowlisted: false,
        denylisted: false,
        enabledFeatures: ['contentBlocking'],
        unprotectedTemporary: false,
    }
    return {
        tab: {
            ...createTabData('unknown', false, protections, { requests: [] }),
            error: parsedMessageData.error.message,
            search: {},
            ctaScreens: {},
        },
    }
}
