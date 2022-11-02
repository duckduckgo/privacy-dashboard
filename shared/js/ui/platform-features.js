/**
 * @module PlatformFeatures
 */

/**
 * @param {import("./environment-check").Platform} platform
 * @return {PlatformFeatures}
 */
export function createPlatformFeatures(platform) {
    return new PlatformFeatures({
        spinnerFollowingProtectionsToggle: platform.name !== 'android',
        freezeUIFollowingProtectionsToggle: platform.name !== 'ios',
    })
}

/**
 * Use an instance of this class to determine what features are supported on a
 * given platform
 */
export class PlatformFeatures {
    /**
     * @param {object} params
     * @param {boolean} params.spinnerFollowingProtectionsToggle
     * @param {boolean} params.freezeUIFollowingProtectionsToggle
     */
    constructor(params) {
        /**
         * Should the toggle convert to a spinner when toggled
         * @type {boolean}
         */
        this.spinnerFollowingProtectionsToggle = params.spinnerFollowingProtectionsToggle
        /**
         * Should the UI be 'frozen' when the Toggle is changed.
         * Note: currently this is only needed because iOS doesn't implement auto-close
         * @type {boolean}
         */
        this.freezeUIFollowingProtectionsToggle = params.freezeUIFollowingProtectionsToggle
    }
}
