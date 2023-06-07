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
    refreshAliasResponseSchema,
    setListOptionsSchema,
} from '../../../schema/__generated__/schema.parsers.mjs'
import {
    CheckBrokenSiteReportHandledMessage,
    OpenOptionsMessage,
    RefreshEmailAliasMessage,
    SearchMessage,
    SetListsMessage,
    setupColorScheme,
    SubmitBrokenSiteReportMessage,
} from './common.js'
import { createTabData } from './utils/request-details.mjs'
import { Protections } from './utils/protections.mjs'

let channel

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
    return new Promise((resolve) => {
        // console.log('🚀 [OUTGOING]', JSON.stringify(message, null, 2))
        window.chrome.runtime.sendMessage(message, (result) => {
            // console.log('🚀✅ [RESPONSE]', JSON.stringify(result, null, 2))
            resolve(result)
        })
    })
}

/**
 * @param {string} name
 * @param [data]
 * @returns {Promise<any>}
 */
function toExtensionMessage(name, data) {
    const outgoing = {
        messageType: name,
        options: data,
    }
    return new Promise((resolve) => {
        window.chrome.runtime.sendMessage(outgoing, (result) => {
            if (window.chrome.runtime.lastError) {
                console.error('window.chrome.runtime.lastError', window.chrome.runtime.lastError)
            }
            resolve(result)
        })
    })
}

/**
 * {@inheritDoc common.submitBrokenSiteReport}
 * @type {import("./common.js").submitBrokenSiteReport}
 * @category Dashboard -> Extension Messages
 *
 * @example
 *
 * ```javascript
 * window.chrome.runtime.sendMessage({
 *    messageType: 'submitBrokenSiteReport',
 *    options: { category: "videos", description: "something was broken :(" }
 * })
 * ```
 */
export async function submitBrokenSiteReport(report) {
    const parsedInput = breakageReportRequestSchema.parse(report)
    toExtensionMessage('submitBrokenSiteReport', parsedInput)
}

/**
 * {@inheritDoc common.setLists}
 * @type {import("./common.js").setLists}
 * @category Dashboard -> Extension Messages
 *
 * @example
 *
 * ```javascript
 * window.chrome.runtime.sendMessage({
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
    return toExtensionMessage('setLists', parsedInput)
}

/**
 * {@inheritDoc common.refreshAlias}
 * @type {import("./common.js").refreshAlias}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * window.chrome.runtime.sendMessage({
 *    messageType: 'refreshAlias',
 * })
 * ```
 */
export async function refreshAlias() {
    const result = await toExtensionMessage('refreshAlias')
    return refreshAliasResponseSchema.parse(result)
}

/**
 * {@inheritDoc common.search}
 * @type {import("./common.js").search}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * window.chrome.runtime.sendMessage({
 *    messageType: 'search',
 *    options: {
 *        term: 'nike'
 *    }
 * })
 * ```
 */
export async function search(options) {
    return toExtensionMessage('search', options)
}

/**
 * {@inheritDoc common.openOptions}
 * @type {import("./common.js").openOptions}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```javascript
 * window.chrome.runtime.sendMessage({
 *    messageType: 'openOptions'
 * })
 * ```
 */
export async function openOptions() {
    return toExtensionMessage('openOptions')
}

/**
 * @param {number|null} tabId
 * @returns {Promise<import('../../../schema/__generated__/schema.types').GetPrivacyDashboardData>}
 * @category Dashboard -> Extension Messages
 *
 * @example
 * ```js
 * window.chrome.runtime.sendMessage({
 *    messageType: 'getPrivacyDashboardData',
 *    options: {
 *        tabId: 99234
 *    }
 * })
 * ```
 */
export async function getPrivacyDashboardData(tabId) {
    return toExtensionMessage('getPrivacyDashboardData', { tabId })
}

export function backgroundMessage(_channel) {
    channel = _channel
    // listen for messages from background and
    // notify subscribers
    window.chrome.runtime.onMessage.addListener((req, sender) => {
        if (sender.id !== window.chrome.runtime.id) {
            return
        }
        // console.log('🌍 [INCOMING window.chrome.runtime.onMessage]', req)
        // todo(Shane): document these extension -> dashboard messages
        if (req.updateTabData) channel.send('updateTabData')
        if (req.didResetTrackersData) channel.send('updateTabData')
        if (req.closePopup) window.close()
    })
}

/**
 * @returns {Promise<{
 *   tab: import('./utils/request-details.mjs').TabData,
 *   emailProtectionUserData?: import('../../../schema/__generated__/schema.types').EmailProtectionUserData,
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
        const { tab, emailProtectionUserData, requestData } = parsedMessageData.data
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
        }
    }

    console.log('🙏 getBackgroundTabData ❌', parsedMessageData.error, resp)
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
