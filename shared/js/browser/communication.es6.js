import { isAndroid, isBrowser, isIOS, isMacos, isWindows } from '../ui/environment-check'
import * as browserComms from './browser-communication.es6.js'
import * as iosComms from './ios-communication.es6.js'
import * as androidComms from './android-communication.es6.js'
import * as windowsComms from './windows-communication.es6.js'
import * as macosComms from './macos-communication.es6.js'
import * as exampleComms from './example-communication.es6.js'
import { getOverrides } from './utils/overrides'

let defaultComms

const overrides = getOverrides(window.location.search)
if (overrides.platform && overrides.platform !== 'n/a') {
    window.environmentOverride = overrides.platform
    defaultComms = exampleComms
} else if (isIOS()) {
    defaultComms = iosComms
} else if (isBrowser()) {
    defaultComms = browserComms
} else if (isAndroid()) {
    defaultComms = androidComms
} else if (isWindows()) {
    defaultComms = windowsComms
} else if (isMacos()) {
    defaultComms = macosComms
} else {
    defaultComms = exampleComms
}

if (!defaultComms) throw new Error('unsupported environment')

// @ts-ignore
defaultComms.setup()

export default defaultComms

/**
 * @typedef Communication
 * @property {any} fetch
 * @property {() => Promise<{tab: import('./utils/request-details').TabData} & Record<string, any>>} getBackgroundTabData
 * @property {() => void} [firstRenderComplete]
 */
