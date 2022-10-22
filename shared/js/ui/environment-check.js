/**
 * @param {"ios" | "android" | "macos" | "browser" | "windows" | "example"} environment
 * @returns {boolean}
 */
export function isEnvironment(environment) {
    if (environment === window.environmentOverride) {
        return true
    }
    return document.body.classList.contains(`environment--${environment}`)
}
export const isIOS = () => isEnvironment('ios')
export const isAndroid = () => isEnvironment('android')
export const isBrowser = () => isEnvironment('browser')
export const isWindows = () => isEnvironment('windows')
export const isMacos = () => isEnvironment('macos')
