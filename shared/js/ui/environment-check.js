/**
 * @typedef Platform
 * @property {"ios" | "android" | "macos" | "browser" | "windows" | "example"} name
 */
/**
 * @param {string} platform
 * @returns {boolean}
 */
export function isEnvironment(platform) {
    if (platform === window.environmentOverride) {
        return true
    }
    return document.body.classList.contains(`environment--${platform}`)
}
export const isIOS = () => isEnvironment('ios')
export const isAndroid = () => isEnvironment('android')
export const isBrowser = () => isEnvironment('browser')
export const isWindows = () => isEnvironment('windows')
export const isMacos = () => isEnvironment('macos')

/**
 * @param {Platform["name"] | string | null | undefined} name
 * @returns {name is Platform["name"]}
 */
export function isValidPlatform(name) {
    if (!name) throw new Error('not a valid platform name')
    /** @type {Platform["name"][]} */
    let names = ['ios', 'android', 'macos', 'browser', 'windows', 'example']
    // @ts-ignore
    if (names.includes(name)) {
        return true
    }
    throw new Error('nope!')
}
