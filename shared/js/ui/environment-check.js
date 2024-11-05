/**
 * @param {string} platform
 * @returns {boolean}
 */
export function isEnvironment(platform) {
    return document.body.classList.contains(`environment--${platform}`);
}
export const isIOS = () => isEnvironment('ios');
export const isAndroid = () => isEnvironment('android');
export const isBrowser = () => isEnvironment('browser');
export const isWindows = () => isEnvironment('windows');
export const isMacos = () => isEnvironment('macos');

/**
 * @returns {import("./platform-features.mjs").Platform["name"] | null}
 */
function currentPlatform() {
    const matchingClass = [...document.body.classList].find((x) => x.startsWith('environment--'));
    if (matchingClass) {
        const platform = matchingClass.slice(13);
        if (isValidPlatform(platform)) {
            return platform;
        }
    }
    return null;
}
/**
 * @param {import("./platform-features.mjs").Platform["name"] | string | null | undefined} name
 * @returns {name is import("./platform-features.mjs").Platform["name"]}
 */
export function isValidPlatform(name) {
    if (!name) throw new Error(`not a valid platform name ${name}`);
    /** @type {import("./platform-features.mjs").Platform["name"][]} */
    const names = ['ios', 'android', 'macos', 'browser', 'windows'];
    // @ts-ignore
    if (names.includes(name)) {
        return true;
    }
    throw new Error('nope!');
}

/** @type {import("./platform-features.mjs").Platform["name"] | undefined | null} */
let lastKnownPlatformName;

/**
 * @template T - return value
 * @param {Record<string, () => T>} mapping
 * @returns {T}
 */
export function platformSwitch(mapping) {
    if (!lastKnownPlatformName) lastKnownPlatformName = currentPlatform(); // for caching
    if (!lastKnownPlatformName) throw new Error('could not determine the current platform.');
    if (lastKnownPlatformName in mapping) {
        return mapping[lastKnownPlatformName]();
    }
    if ('default' in mapping) {
        return mapping.default();
    }
    throw new Error('did not expect to get here - use a default!');
}
