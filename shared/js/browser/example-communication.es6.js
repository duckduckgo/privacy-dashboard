import generateData, { defaultRequests } from '../ui/views/tests/generate-data'
import {
    CheckBrokenSiteReportHandledMessage,
    RefreshEmailAliasMessage,
    SetListsMessage,
    setupColorScheme,
    setupMutationObserver,
} from './common.es6'
import { getOverrides } from './utils/overrides'

// This is am example interface purely for previewing the panel
// import { Protections } from './utils/request-details'

// Overrides based on URL params
const overrides = getOverrides(window.location.search)

let channel = null
const isSecure = true
const isPendingUpdates = false

// Modify state after render
// eslint-disable-next-line no-unused-vars
// const tweakSecureStatus = () => {
//     isSecure = false
//     channel?.send('updateTabData')
// }
// setTimeout(() => tweakSecureStatus(), 10000)

/**
 * @type {import("./common.es6").fetcher}
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

    console.log('fetch - Not implemented', message)
}

export function backgroundMessage(backgroundModel) {
    console.log('backgroundMessage - setting local channel')
    channel = backgroundModel
}
let count = 0
export async function getBackgroundTabData() {
    let requests = overrides.requests
    if (new URLSearchParams(window.location.search).has('continuous')) {
        requests = defaultRequests.slice(0, count)
    }
    const output = generateData({
        isSecure,
        isPendingUpdates,
        ...overrides,
        requests,
    })

    if (count === 5) {
        count = 0
    } else {
        count += 1
    }

    // @ts-ignore
    output.emailProtectionUserData = overrides.emailProtectionUserData

    // console.log('✅', output)
    return output
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
