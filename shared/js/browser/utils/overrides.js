import { dataStates, protectionsOff } from '../../ui/views/tests/mock-data/generate-data'
import { Protections } from './request-details'

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
 * @property {Partial<import('../../ui/views/tests/mock-data/generate-data').TabData>} tab
 * @property {import('../../../../schema/__generated__/schema.types').DetectedRequest[]} requests
 * @property {string} state
 * @property {string} platform
 * @property {any | undefined} emailProtectionUserData
 * @property {("dark" | "light") | undefined} theme
 * @param {string} searchString
 * @returns {Overrides}
 */
export function getOverrides (searchString) {
    /** @type {Overrides} */
    const overrides = {
        tab: {
            consentManaged: undefined,
            parentEntity: undefined
        },
        requests: [],
        platform: 'n/a',
        state: 'unknown',
        emailProtectionUserData: undefined,
        theme: undefined
    }

    const params = new URLSearchParams(searchString)

    if (params.has('state')) {
        const match = dataStates[params.get('state')]
        if (match) {
            overrides.requests = match.requests
            overrides.state = match.state
            if ('parentEntity' in match) {
                overrides.tab.parentEntity = { ...match.parentEntity }
            }
            if ('url' in match) {
                overrides.tab.url = match.url
            }
            if ('contentBlockingException' in match) {
                overrides.requests = protectionsOff(overrides.requests)
                overrides.tab.protections = new Protections(
                    false,
                    [],
                    false,
                    false
                )
            }
            if ('upgradedHttps' in match) {
                overrides.tab.upgradedHttps = true
            }
            if ('certificates' in match) {
                overrides.tab.certificate = match.certificates
            }
        }
    }
    if (params.has('platform')) {
        overrides.platform = params.get('platform') || 'n/a'
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
        overrides.tab.protections = new Protections(
            false,
            [],
            false,
            false
        )
    }

    if (params.get('allowlisted')) {
        overrides.requests = protectionsOff(overrides.requests)
        overrides.tab.protections = new Protections(
            false,
            ['contentBlocking'],
            true,
            false
        )
    }

    if (params.get('specialDomainName')) {
        overrides.tab.specialDomainName = 'extensions'
    }

    if (params.get('locale')) {
        overrides.tab.locale = params.get('locale')
    }

    if (params.get('denylisted')) {
        overrides.requests = protectionsOff(overrides.requests)
        overrides.tab.protections = new Protections(
            false,
            [],
            false,
            true
        )
    }

    if (params.get('consentManaged')) {
        overrides.tab.consentManaged = {
            consentManaged: true,
            optoutFailed: false,
            selftestFailed: false
        }
    }

    // browser-specific overrides
    if (overrides.platform === 'browser') {
        // supports email
        overrides.tab.emailProtection = {}
        // supports search
        overrides.tab.search = {}
        // supports CTA screens
        overrides.tab.ctaScreens = { }
        // extensions can't handle 'permissions'
        overrides.tab.permissions = []

        // emulate a user being signed in to email protection
        if (params.get('emailUser') === 'true') {
            overrides.emailProtectionUserData = {
                cohort: 'private_beta_dax',
                nextAlias: '123456_next',
                token: '123456',
                userName: 'daxtheduck'
            }
        }
    }

    return overrides
}
