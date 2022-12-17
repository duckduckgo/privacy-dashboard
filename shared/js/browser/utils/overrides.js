import { dataStates, protectionsOff } from '../../ui/views/tests/generate-data'
import { isValidPlatform } from '../../ui/environment-check'
import { createRequestDetails, createTabData, Protections } from './request-details'

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
 * @property {import('../../ui/views/tests/generate-data').TabData} tab
 * @property {import('../../../../schema/__generated__/schema.types').DetectedRequest[]} requests
 * @property {import('../../ui/platform-features').Platform["name"]} platform
 * @property {import('../../../../schema/__generated__/schema.types').EmailProtectionUserData | undefined} emailProtectionUserData
 * @property {("dark" | "light") | undefined} theme
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
    }

    const params = new URLSearchParams(searchString)

    const stateKey = params.get('state')
    if (stateKey) {
        const match = dataStates[stateKey]
        if (match) {
            overrides.requests = match.requests
            overrides.tab.requestDetails = createRequestDetails(match.requests, [])
            overrides.tab.parentEntity = match.parentEntity
            overrides.tab.url = match.url
            overrides.tab.upgradedHttps = match.upgradedHttps
            overrides.tab.certificate = match.certificate
            overrides.tab.cookiePromptManagementStatus = match.cookiePromptManagementStatus
        }
    }
    const platformParam = params.get('platform')
    if (platformParam && isValidPlatform(platformParam)) {
        overrides.platform = platformParam
        document.body.classList.remove('environment--example')
        document.body.classList.add(`environment--${overrides.platform}`)
        window.environmentOverride = overrides.platform
    }

    // emulate a different theme
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

    // emulate a 'contentBlockingException'
    if (params.get('contentBlockingException') === 'true') {
        overrides.requests = protectionsOff(overrides.requests)
        overrides.tab.requestDetails = createRequestDetails(overrides.requests, [])
        overrides.tab.protections = new Protections(false, [], false, false)
    }

    if (params.get('allowlisted')) {
        overrides.requests = protectionsOff(overrides.requests)
        overrides.tab.requestDetails = createRequestDetails(overrides.requests, [])
        overrides.tab.protections = new Protections(false, ['contentBlocking'], true, false)
    }

    if (params.get('specialDomainName') || params.get('specialDomain')) {
        overrides.tab.specialDomainName = 'extensions'
    }

    if (params.get('locale')) {
        overrides.tab.locale = params.get('locale')
    }

    if (params.get('denylisted')) {
        overrides.requests = protectionsOff(overrides.requests)
        overrides.tab.requestDetails = createRequestDetails(overrides.requests, [])
        overrides.tab.protections = new Protections(false, [], false, true)
    }

    if (params.get('consentManaged')) {
        overrides.tab.cookiePromptManagementStatus = {
            consentManaged: true,
            optoutFailed: false,
            selftestFailed: false,
            configurable: false,
        }
        if (params.get('consentConfigurable')) {
            overrides.tab.cookiePromptManagementStatus.configurable = true
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
    }

    if (overrides.platform === 'ios' || overrides.platform === 'macos') {
        overrides.tab.platformLimitations = true
    }

    if (overrides.platform === 'ios' || overrides.platform === 'android') {
        overrides.tab.permissions = []
    }

    return overrides
}
