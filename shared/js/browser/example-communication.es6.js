import generateData, { protectionsOff } from '../ui/views/tests/generate-data'
import { setupColorScheme, setupMutationObserver } from './common.es6'
import { getOverrides } from './utils/overrides'

// This is am example interface purely for previewing the panel
import { Protections } from './utils/request-details'

// Overrides based on URL params
const overrides = getOverrides(window.location.search)

let channel = null
const isSecure = true
let isPendingUpdates = false

// Modify state after render
// eslint-disable-next-line no-unused-vars
// const tweakSecureStatus = () => {
//     isSecure = false
//     channel?.send('updateTabData')
// }
// setTimeout(() => tweakSecureStatus(), 10000)

export function fetch(...args) {
    if (args[0].setList) {
        console.log('fetch - Updating in memory overrides for setList', args)
        const { list, value } = args[0].setList
        isPendingUpdates = true
        channel?.send('updateTabData')
        setTimeout(() => {
            isPendingUpdates = false
            if (list === 'allowlisted') {
                overrides.tab.protections = new Protections(false, ['contentBlocking'], value, false)
                overrides.requests = protectionsOff(overrides.requests)
            }
            // if (list === 'denylisted') {
            //     overrides.tab.site.denylisted = value
            // }
            channel?.send('updateTabData')
        }, 2000)
        return
    }

    if (args[0]?.messageType === 'refreshAlias') {
        if (overrides.platform === 'browser') {
            return Promise.resolve({
                privateAddress: 'dax123456',
            })
        }
    }

    if (args[0]?.messageType === 'getBrowser') {
        if (overrides.platform === 'browser') {
            return Promise.resolve('chrome')
        }
    }

    if (args[0]?.checkBrokenSiteReportHandled) {
        if (overrides.platform === 'ios' || overrides.platform === 'android') {
            return true
        }
    }

    console.log('fetch - Not implemented', args)
}

export function backgroundMessage(backgroundModel) {
    console.log('backgroundMessage - setting local channel')
    channel = backgroundModel
}

export async function getBackgroundTabData() {
    const output = generateData({
        isSecure,
        isPendingUpdates,
        ...overrides,
    })

    // @ts-ignore
    output.emailProtectionUserData = overrides.emailProtectionUserData

    console.log('✅', output)
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
