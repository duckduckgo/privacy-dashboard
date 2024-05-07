/**
 * @module PlatformFeatures
 */

/**
 * @typedef Platform
 * @property {"ios" | "android" | "macos" | "browser" | "windows"} name
 */

/**
 * @typedef {import("../../../schema/__generated__/schema.types").EventOrigin['screen']} InitialScreen
 */

/**
 * @param {Platform} platform
 * @return {PlatformFeatures}
 */
export function createPlatformFeatures(platform) {
    /** @type {Platform["name"][]} */
    const desktop = ['windows', 'macos', 'browser']

    let includeToggleOnBreakageForm = true

    /** @type {InitialScreen} */
    let screen = 'primaryScreen'
    const url = new URL(window.location.href)
    if (url.searchParams.get('screen') === 'breakageForm') {
        screen = 'breakageForm'
    }
    if (url.searchParams.get('screen') === 'toggleReport') {
        screen = 'toggleReport'
    }
    if (url.searchParams.get('screen') === 'promptBreakageForm') {
        screen = 'promptBreakageForm'
        includeToggleOnBreakageForm = false
    }

    return new PlatformFeatures({
        spinnerFollowingProtectionsToggle: platform.name !== 'android' && platform.name !== 'windows',
        supportsHover: desktop.includes(platform.name),
        initialScreen: screen,
        supportsInvalidCerts: platform.name !== 'browser' && platform.name !== 'windows',
        includeToggleOnBreakageForm,
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
     * @param {boolean} params.supportsHover
     * @param {InitialScreen} params.initialScreen
     * @param {boolean} params.supportsInvalidCerts
     * @param {boolean} params.includeToggleOnBreakageForm
     */
    constructor(params) {
        /**
         * Should the toggle convert to a spinner when toggled
         * @type {boolean}
         */
        this.spinnerFollowingProtectionsToggle = params.spinnerFollowingProtectionsToggle
        /**
         * Does the current platform support hover interactions?
         * @type {boolean}
         */
        this.supportsHover = params.supportsHover
        /**
         * Does the current platform support hover interactions?
         * @type {boolean}
         */
        this.supportsInvalidCerts = params.supportsInvalidCerts
        /**
         * Does the current platform support hover interactions?
         * @type {InitialScreen}
         */
        this.initialScreen = params.initialScreen
        /**
         * Should the toggle functionality be included on the breakage form?
         * @type {boolean}
         */
        this.includeToggleOnBreakageForm = params.includeToggleOnBreakageForm
    }
}

/**
 * Feature Settings are settings that might be delivered remotely, like UI experiments
 */
export class FeatureSettings {
    /**
     * @param {object} params
     * @param {import("../../../schema/__generated__/schema.types").PrimaryScreen} [params.primaryScreen]
     */
    constructor(params) {
        /** @type {import("../../../schema/__generated__/schema.types").PrimaryScreen} */
        this.primaryScreen = params.primaryScreen || { layout: 'default' }
    }
    /**
     *
     */
    static default() {
        return new FeatureSettings({})
    }
}
