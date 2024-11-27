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
    const desktop = ['windows', 'macos', 'browser'];

    const includeToggleOnBreakageForm = true;

    /** @type {InitialScreen} */
    let screen = 'primaryScreen';
    const url = new URL(window.location.href);

    // prettier-ignore
    const acceptedScreenParam = [
        'breakageForm',
        'breakageFormCategorySelection',
        'breakageFormFinalStep',
        'toggleReport'
    ];

    if (url.searchParams.has('screen')) {
        const param = url.searchParams.get('screen');
        if (typeof param === 'string' && acceptedScreenParam.includes(/** @type {string} */ (param))) {
            screen = /** @type {any} */ (param);
        }
    }

    /** @type {'dashboard' | 'menu'} */
    let opener = 'dashboard';
    if (url.searchParams.get('opener') === 'menu') {
        opener = 'menu';
    }

    // allow randomization to be disabled in a URL param
    let randomisedCategories = true;
    if (url.searchParams.get('randomisedCategories') === 'false') randomisedCategories = false;

    return new PlatformFeatures({
        spinnerFollowingProtectionsToggle: platform.name !== 'android' && platform.name !== 'windows',
        supportsHover: desktop.includes(platform.name),
        initialScreen: screen,
        opener,
        supportsInvalidCertsImplicitly: platform.name !== 'browser' && platform.name !== 'windows',
        supportsMaliciousSiteWarning: platform.name === 'macos' || platform.name === 'ios' || platform.name === 'android' || platform.name === 'windows',
        includeToggleOnBreakageForm,
        randomisedCategories,
    });
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
     * @param {boolean} params.supportsInvalidCertsImplicitly
     * @param {boolean} params.includeToggleOnBreakageForm
     * @param {boolean} params.supportsMaliciousSiteWarning
     * @param {boolean} params.randomisedCategories
     */
    constructor(params) {
        /**
         * Should the toggle convert to a spinner when toggled
         * @type {boolean}
         */
        this.spinnerFollowingProtectionsToggle = params.spinnerFollowingProtectionsToggle;
        /**
         * Does the current platform support hover interactions?
         * @type {boolean}
         */
        this.supportsHover = params.supportsHover;
        /**
         * Does the current platform support hover interactions?
         * @type {boolean}
         */
        this.supportsInvalidCertsImplicitly = params.supportsInvalidCertsImplicitly;
        /**
         * Does the current platform support hover interactions?
         * @type {InitialScreen}
         */
        this.initialScreen = params.initialScreen;
        /**
         * Does the current platform support hover interactions?
         * @type {'dashboard' | 'menu'}
         */
        this.opener = params.opener;
        /**
         * Should the toggle functionality be included on the breakage form?
         * @type {boolean}
         */
        this.includeToggleOnBreakageForm = params.includeToggleOnBreakageForm;
        /**
         * Does the current platform support phishing and malware warnings?
         * @type {boolean}
         */
        this.supportsMaliciousSiteWarning = params.supportsMaliciousSiteWarning;
        /**
         * Whether or to randomize the categories in the breakage form
         * @type {boolean}
         */
        this.randomisedCategories = params.randomisedCategories;
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
        this.primaryScreen = params.primaryScreen || { layout: 'default' };
        /** @type {import("../../../schema/__generated__/schema.types").WebBreakageForm} */
        this.webBreakageForm = params.webBreakageForm || { state: 'enabled' };
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
                });
            }
            default: {
                return new FeatureSettings(settings || {});
            }
        }
    }
}
