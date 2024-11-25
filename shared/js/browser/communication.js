import { isAndroid, isBrowser, isIOS, isMacos, isWindows } from '../ui/environment-check';
import * as browserComms from './browser-communication.js';
import * as iosComms from './ios-communication.js';
import * as androidComms from './android-communication.js';
import * as windowsComms from './windows-communication.js';
import * as macosComms from './macos-communication.js';
import { installDebuggerMocks } from './utils/communication-mocks.mjs';

let defaultComms;

/** @type {import('../ui/platform-features.mjs').Platform} */
const platform = {
    name: 'browser',
};

if (isIOS()) {
    defaultComms = iosComms;
    platform.name = 'ios';
} else if (isBrowser()) {
    defaultComms = browserComms;
    platform.name = 'browser';
} else if (isAndroid()) {
    defaultComms = androidComms;
    platform.name = 'android';
} else if (isWindows()) {
    defaultComms = windowsComms;
    platform.name = 'windows';
} else if (isMacos()) {
    defaultComms = macosComms;
    platform.name = 'macos';
}

if (!defaultComms) throw new Error('unsupported environment');

let debug = false;

// in test environments, install mocks and deliver initial data
// eslint-disable-next-line no-unused-labels, no-labels
$TEST: (() => {
    if (typeof window.__ddg_integration_test === 'undefined') {
        installDebuggerMocks(platform).catch(console.error);
        debug = true;
    }
})();

defaultComms.setup(debug);

export { platform };

export default defaultComms;

/**
 * @typedef Communication
 * @property {any} fetch
 * @property {() => Promise<{tab: import('./utils/request-details.mjs').TabData} & Record<string, any>>} getBackgroundTabData
 * @property {() => void} [firstRenderComplete]
 */
