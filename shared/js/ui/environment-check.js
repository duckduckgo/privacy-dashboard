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
 * @returns {Platform["name"] | null}
 */
export function currentPlatform() {
    const windowVar = window.environmentOverride
    if (isValidPlatform(windowVar)) return windowVar
    const matchingClass = [...document.body.classList].find((x) => x.startsWith('environment--'))
    if (matchingClass) {
        let platform = matchingClass.slice(13)
        if (isValidPlatform(platform)) {
            return platform
        }
    }
    return null
}
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

/** @type {Platform["name"] | undefined | null} */
let _curr

/**
 * @template T - return value
 * @param {Record<string, () => T>} mapping
 * @returns {T}
 */
export function platformSwitch(mapping) {
    if (!_curr) _curr = currentPlatform() // caching
    if (!_curr) throw new Error('could not determine the current platform.')
    if (mapping.hasOwnProperty(_curr)) {
        return mapping[_curr]()
    }
    if (mapping.hasOwnProperty('default')) {
        return mapping['default']()
    }
    throw new Error('did not expect to get here - use a default!')
}
