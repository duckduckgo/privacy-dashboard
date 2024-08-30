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

    const acceptedScreenParam = [
        'breakageForm',
        'toggleReport',
        'choiceBreakageForm',
        'categoryTypeSelection',
        'categorySelection',
        'promptBreakageForm',
    ]
    if (url.searchParams.has('screen')) {
        const param = url.searchParams.get('screen')
        if (typeof param === 'string' && acceptedScreenParam.includes(/** @type {string} */ (param))) {
            screen = /** @type {any} */ (param)
        }
    }

    if (screen === 'promptBreakageForm') {
        includeToggleOnBreakageForm = false
    }

    /** @type {'dashboard' | 'menu'} */
    let opener = 'menu'
    if (url.searchParams.get('opener') === 'dashboard') {
        opener = 'dashboard'
    }

    /** @type {InitialScreen} */
    let breakageScreen = 'breakageForm'
    if (url.searchParams.get('breakageScreen') === 'categorySelection') {
        breakageScreen = 'categorySelection'
    }
    if (url.searchParams.get('breakageScreen') === 'categoryTypeSelection') {
        breakageScreen = 'categoryTypeSelection'
    }

    // allow randomization to be disabled in a URL param
    let randomisedCategories = true
    if (url.searchParams.get('randomisedCategories') === 'false') randomisedCategories = false

    return new PlatformFeatures({
        spinnerFollowingProtectionsToggle: platform.name !== 'android' && platform.name !== 'windows',
        supportsHover: desktop.includes(platform.name),
        initialScreen: screen,
        opener,
        supportsInvalidCerts: platform.name !== 'browser',
        includeToggleOnBreakageForm,
        breakageScreen,
        randomisedCategories,
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
     * @param {'dashboard' | 'menu'} params.opener
     * @param {boolean} params.supportsInvalidCerts
     * @param {boolean} params.includeToggleOnBreakageForm
     * @param {InitialScreen} params.breakageScreen
     * @param {boolean} params.randomisedCategories
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
         * Does the current platform support hover interactions?
         * @type {'dashboard' | 'menu'}
         */
        this.opener = params.opener
        /**
         * Should the toggle functionality be included on the breakage form?
         * @type {boolean}
         */
        this.includeToggleOnBreakageForm = params.includeToggleOnBreakageForm
        /**
         * @type {import("../../../schema/__generated__/schema.types").EventOrigin['screen']}
         */
        this.breakageScreen = params.breakageScreen
        /**
         * Whether or to randomize the categories in the breakage form
         * @type {boolean}
         */
        this.randomisedCategories = params.randomisedCategories
    }
}

/**
 * Feature Settings are settings that might be delivered remotely, like UI experiments
 */
export class FeatureSettings {
    /**
     * @param {object} params
     * @param {import("../../../schema/__generated__/schema.types").PrimaryScreen} [params.primaryScreen]
     * @param {import("../../../schema/__generated__/schema.types").WebBreakageForm} [params.webBreakageForm]
     */
    constructor(params) {
        /** @type {import("../../../schema/__generated__/schema.types").PrimaryScreen} */
        this.primaryScreen = params.primaryScreen || { layout: 'default' }
        /** @type {import("../../../schema/__generated__/schema.types").WebBreakageForm} */
        this.webBreakageForm = params.webBreakageForm || { state: 'enabled' }
    }

    /**
     * @param {import("../../../schema/__generated__/schema.types").RemoteFeatureSettings|undefined} settings
     * @param {Platform} platform
     */
    static create(settings, platform) {
        switch (platform.name) {
            case 'android': {
                return new FeatureSettings({
                    webBreakageForm: { state: 'disabled' },
                    ...settings,
                })
            }
            default: {
                return new FeatureSettings(settings || {})
            }
        }
    }
}
