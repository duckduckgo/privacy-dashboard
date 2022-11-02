/**
 * @param {import("./environment-check").Platform} platform
 * @return {PlatformFeatures}
 */
export function createPlatformFeatures(platform) {
    return new PlatformFeatures({
        spinnerFollowingProtectionsToggle: platform.name !== 'android',
    })
}

/**
 * Use an instance of this class to determine what features are supported on a
 * given platform
 */
class PlatformFeatures {
    /**
     * @param {object} params
     * @param {boolean} params.spinnerFollowingProtectionsToggle
     */
    constructor(params) {
        /**
         * Should the toggle convert to a spinner when toggled
         * @type {boolean}
         */
        this.spinnerFollowingProtectionsToggle = params.spinnerFollowingProtectionsToggle
    }
}
