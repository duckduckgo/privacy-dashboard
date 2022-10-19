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
    extensionGetPrivacyDashboardDataSchema, setListOptionsSchema
} from '../../../schema/__generated__/schema.parsers'
import parseUserAgentString from '../shared-utils/parse-user-agent-string.es6'
import { setupColorScheme } from './common.es6'
import { Protections, createTabData } from './utils/request-details'

const browserInfo = parseUserAgentString()

let channel
const isPendingUpdates = false

setupColorScheme()

export function fetch (message) {
    console.log('⏱ [extension.fetch]', JSON.stringify(message, null, 2))
    // ensure the HTML form is shown for the extension
    if (message.checkBrokenSiteReportHandled) {
        return false
    }
    if (message.submitBrokenSiteReport) {
        return submitBrokenSiteReport(message.submitBrokenSiteReport)
    }
    if (message.setList) {
        return setList(message.setList)
    }
    return new Promise((resolve, reject) => {
        if (message.postToggleAllowlist) {
            postToggleAllowlist(message.postToggleAllowlist.id)
            return
        }
        console.log('🚀 [OUTGOING]', JSON.stringify(message, null, 2))
        window.chrome.runtime.sendMessage(message, (result) => {
            console.log('🚀✅ [RESPONSE]', JSON.stringify(result, null, 2))
            resolve(result)
        })
    })
}

/**
 * {@inheritDoc common.submitBrokenSiteReport}
 * @type {import("./common.es6").submitBrokenSiteReport}
 * @category Extension Messages
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
export async function submitBrokenSiteReport (report) {
    const parsedInput = breakageReportRequestSchema.parse(report)
    await window.chrome.runtime.sendMessage({
        messageType: 'submitBrokenSiteReport',
        options: parsedInput
    })
}

/**
 * {@inheritDoc common.setList}
 * @type {import("./common.es6").setList}
 * @category Extension Messages
 *
 * @example
 *
 * ```javascript
 * window.chrome.runtime.sendMessage({
 *    messageType: 'setList',
 *    options: {
 *        list: 'allowlist',
 *        domain: 'https://example.com',
 *        value: true
 *    }
 * })
 * ```
 */
export async function setList (options) {
    const parsedInput = setListOptionsSchema.parse(options)
    await window.chrome.runtime.sendMessage({
        messageType: 'setList',
        options: parsedInput
    })
}

export function backgroundMessage (_channel) {
    channel = _channel
    // listen for messages from background and
    // notify subscribers
    window.chrome.runtime.onMessage.addListener((req, sender) => {
        if (sender.id !== window.chrome.runtime.id) return
        console.log('🌍 [INCOMING window.chrome.runtime.onMessage]', req)
        // todo(Shane): We are explicit about closing the PD now, so is this needed?
        if (req.allowlistChanged) {
            // force the toggles or any other UI to go into a 'pending state'
            // console.log('EXTENSION SAID SOMETHING CHANGED', req)
            // isPendingUpdates = true
            // channel.send('updateTabData')
        }
        if (req.updateTabData) channel.send('updateTabData')
        // todo(Shane): verify if these are both still needed?
        if (req.didResetTrackersData) channel.send('didResetTrackersData', req.didResetTrackersData)
        if (req.closePopup) window.close()
    })
}

/**
 * @returns {Promise<{tab: import('./utils/request-details').TabData} & Record<string, any>>}
 */
export async function getBackgroundTabData () {
    // @ts-ignore
    const tabId = chrome.devtools?.inspectedWindow?.tabId || parseInt(0 + new URL(document.location.href).searchParams.get('tabId'))
    const resp = await fetch({ messageType: 'getPrivacyDashboardData', options: { tabId: tabId } })
    const parsedMessageData = extensionGetPrivacyDashboardDataSchema.safeParse(resp)

    if (parsedMessageData.success === true) {
        const { tab, emailProtectionUserData, requestData } = parsedMessageData.data
        const { upgradedHttps, url, parentEntity, specialDomainName, id } = tab

        // const { allowlisted } = resp.tab.site;
        const protections = new Protections(tab.protections.unprotectedTemporary, tab.protections.enabledFeatures, tab.protections.allowlisted, tab.protections.denylisted)
        return {
            tab: {
                ...createTabData(url, upgradedHttps, protections, requestData),
                id,
                search: {},
                emailProtection: {},
                ctaScreens: {},
                isPendingUpdates,
                parentEntity,
                specialDomainName
            },
            emailProtectionUserData
        }
    }

    console.log('🙏 getBackgroundTabData ❌', parsedMessageData.error, resp)
    // todo(Shane): Have an error state here instead?
    const protections = {
        allowlisted: false,
        denylisted: false,
        enabledFeatures: ['contentBlocking'],
        unprotectedTemporary: false
    }
    return {
        tab: createTabData('https://example.com', false, protections, { requests: [] })
    }
}

const getExtensionURL = (path) => {
    return window.chrome.runtime.getURL(path)
}

const openExtensionPage = (path) => {
    window.chrome.tabs.create({ url: getExtensionURL(path) })
}

export const openOptionsPage = (browser) => {
    if (browser === 'moz') {
        openExtensionPage('/html/options.html')
        window.close()
    } else {
        window.chrome.runtime.openOptionsPage()
    }
}

export const search = (url) => {
    if (browserInfo?.os) {
        window.chrome.tabs.create({ url: `https://duckduckgo.com/?q=${url}&bext=${browserInfo.os}cr` })
    }
}

const reloadTab = (id) => {
    try {
        window.chrome.tabs.reload(id)
    } catch (e) {
        console.error(e)
    }
    // window.chrome.tabs.reload(id)
}

const closePopup = () => {
    try {
        const w = window.chrome.extension.getViews({ type: 'popup' })[0]
        w.close()
    } catch (e) {
        console.error(e)
    }
}

export const openNewTab = (url) => {
    try {
        window.chrome.tabs.create({ url })
    } catch (e) {
        console.error(e)
    }
}

const postToggleAllowlist = (tabId) => {
    setTimeout(() => {
        reloadTab(tabId)
        closePopup()
    }, 500)
}
