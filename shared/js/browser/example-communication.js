import {
    CheckBrokenSiteReportHandledMessage,
    FetchBurnOptions,
    OpenSettingsMessages,
    RefreshEmailAliasMessage,
    SetListsMessage,
    setupColorScheme,
    setupMutationObserver,
} from './common.js'
import { getOverrides } from './utils/overrides'

// Overrides based on URL params
const overrides = getOverrides(window.location.search)

let channel = null

/**
 * @type {import("./common.js").fetcher}
 */
export async function fetch(message) {
    if (message instanceof SetListsMessage) {
        console.warn('doing nothing by default with `setList`')
    }

    if (message instanceof RefreshEmailAliasMessage) {
        if (overrides.platform === 'browser') {
            return Promise.resolve({
                privateAddress: 'dax123456',
            })
        }
    }

    if (message instanceof CheckBrokenSiteReportHandledMessage) {
        if (overrides.platform === 'ios' || overrides.platform === 'android') {
            return true
        } else {
            return false
        }
    }

    if (message instanceof OpenSettingsMessages) {
        if (overrides.platform === 'ios' || overrides.platform === 'android') {
            return true
        } else {
            return false
        }
    }

    if (message instanceof FetchBurnOptions) {
        return Promise.resolve({
            options: [
                {
                    name: 'Current site only',
                    options: {
                        origins: ['https://example.com/']
                    },
                    descriptionStats: {
                        history: 'current site',
                        openTabs: 1,
                        cookies: 1
                    }
                },
                {
                    name: 'Last hour',
                    options: {
                        since: Date.now(),
                    },
                    descriptionStats: {
                        history: 'last hour',
                        openTabs: 5,
                        cookies: 23,
                    },
                },
            ],
        })
    }

    console.log('fetch - Not implemented', message)
}

export function backgroundMessage(backgroundModel) {
    console.log('backgroundMessage - setting local channel')
    channel = backgroundModel
}

/**
 * @returns {Promise<{
 *    tab: import('./utils/request-details.mjs').TabData,
 *    emailProtectionUserData: import('../../../schema/__generated__/schema.types').EmailProtectionUserData | undefined,
 *    fireButton: import('../../../schema/__generated__/schema.types').FireButtonData
 * }>}
 */
export async function getBackgroundTabData() {
    return {
        tab: overrides.tab,
        emailProtectionUserData: overrides.emailProtectionUserData,
        fireButton: {
            enabled: true,
        },
    }
}

export function setup() {
    // set initial colour scheme
    const setColorScheme = setupColorScheme()
    setColorScheme(overrides.theme)

    setupMutationObserver((height) => {
        console.log('Window height change:', height)
    })
}

export function openOptionsPage() {
    console.warn('should open options page here')
}

export function search(query) {
    console.warn('should open search for ', JSON.stringify(query))
}

if (new URLSearchParams(window.location.search).has('continuous')) {
    setInterval(() => {
        channel?.send('updateTabData')
    }, 200)
}
