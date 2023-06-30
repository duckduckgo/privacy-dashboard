import { isValidPlatform } from '../../ui/environment-check'
import { testDataStates } from '../../ui/views/tests/states-with-fixtures'
import { protectionsOff } from '../../ui/views/tests/toggle-protections.mjs'
import { createRequestDetails, createTabData } from './request-details.mjs'
import { Protections } from './protections.mjs'

/**
 * The purpose of this function is to allow URL parameters to override
 * test data when viewing the 'example' build.
 *
 * Eg: after running 'npm run preview.example', you could then set the theme
 * by providing '?theme=dark' as a url parameter
 *
 * See the 'Emulating different platforms/scenarios' section in the README.md file
 */
/**
 * @typedef Overrides
 * @property {import('../../ui/views/tests/generate-data.mjs').TabData} tab
 * @property {import('../../../../schema/__generated__/schema.types').DetectedRequest[]} requests
 * @property {import('../../ui/platform-features').Platform["name"]} platform
 * @property {import('../../../../schema/__generated__/schema.types').EmailProtectionUserData | undefined} emailProtectionUserData
 * @property {("dark" | "light") | undefined} theme
 * @property {boolean} fireButtonEnabled
 * @param {string} searchString
 * @returns {Overrides}
 */
export function getOverrides(searchString) {
    /** @type {Overrides} */
    const overrides = {
        requests: [],
        tab: createTabData('https://example.com', false, Protections.default(), { requests: [] }),
        platform: 'example',
        emailProtectionUserData: undefined,
        theme: undefined,
        fireButtonEnabled: false,
    }

    const params = new URLSearchParams(searchString)

    const stateKey = params.get('state')
    if (stateKey) {
        const match = testDataStates[stateKey]
        if (match) {
            overrides.requests = match.requests
            overrides.tab.requestDetails = createRequestDetails(match.requests, [])
            overrides.tab.parentEntity = match.parentEntity
            overrides.tab.url = match.url
            overrides.tab.upgradedHttps = match.upgradedHttps
            overrides.tab.certificate = match.certificate
            overrides.tab.cookiePromptManagementStatus = match.cookiePromptManagementStatus
            overrides.tab.locale = match.localeSettings.locale
            if (match.allowlisted) {
                overrides.requests = protectionsOff(overrides.requests)
                overrides.tab.requestDetails = createRequestDetails(overrides.requests, [])
                overrides.tab.protections = new Protections(false, ['contentBlocking'], true, false)
            }
            if (match.contentBlockingException) {
                overrides.requests = protectionsOff(overrides.requests)
                overrides.tab.requestDetails = createRequestDetails(overrides.requests, [])
                overrides.tab.protections = new Protections(false, [], false, false)
            }
            if (match.denylisted) {
                overrides.requests = protectionsOff(overrides.requests)
                overrides.tab.requestDetails = createRequestDetails(overrides.requests, [])
                overrides.tab.protections = new Protections(false, [], false, true)
            }
        }
    }
    const platformParam = params.get('platform')
    if (platformParam && isValidPlatform(platformParam)) {
        overrides.platform = platformParam
        document.body.classList.remove('environment--example')
        document.body.classList.add(`environment--${overrides.platform}`)
        window.environmentOverride = overrides.platform
    }

    if (params.has('theme')) {
        if (params.get('theme') === 'light') {
            overrides.theme = 'light'
        } else if (params.get('theme') === 'dark') {
            overrides.theme = 'dark'
        }
        if (overrides.theme?.toLowerCase() === 'dark') {
            document.body.classList.add('body--theme-dark')
        } else {
            document.body.classList.remove('body--theme-dark')
        }
    }

    if (params.get('specialDomainName') || params.get('specialDomain')) {
        overrides.tab.specialDomainName = 'extensions'
    }

    if (params.get('locale')) {
        overrides.tab.locale = params.get('locale')
    }

    if (params.get('consentManaged')) {
        overrides.tab.cookiePromptManagementStatus = {
            consentManaged: true,
            cosmetic: false,
            optoutFailed: false,
            configurable: false,
        }
        if (params.get('consentConfigurable')) {
            overrides.tab.cookiePromptManagementStatus.configurable = true
        }
        if (params.get('consentCosmetic')) {
            overrides.tab.cookiePromptManagementStatus.cosmetic = true
        }
    }

    // browser-specific overrides
    if (overrides.platform === 'browser') {
        // supports email
        overrides.tab.emailProtection = {}
        // supports search
        overrides.tab.search = {}
        // supports CTA screens
        overrides.tab.ctaScreens = {}
        // extensions can't handle 'permissions'
        overrides.tab.permissions = []

        // emulate a user being signed in to email protection
        if (params.get('emailUser') === 'true') {
            overrides.emailProtectionUserData = {
                nextAlias: '123456_next',
            }
        }
        if (params.get('fireButton') === 'true') {
            overrides.fireButtonEnabled = true
        }
    }

    if (overrides.platform === 'ios' || overrides.platform === 'macos') {
        overrides.tab.platformLimitations = true
    }

    if (overrides.platform === 'ios' || overrides.platform === 'android') {
        overrides.tab.permissions = []
    }

    return overrides
}
