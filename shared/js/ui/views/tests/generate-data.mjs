import { Protections } from '../../../browser/utils/protections.mjs'
import { protectionsOff } from './toggle-protections.mjs'

/**
 * @typedef {import('../../../browser/utils/request-details.mjs').TabData} TabData
 * @typedef {import('../../../../../schema/__generated__/schema.types').DetectedRequest} DetectedRequest
 * @typedef {import('../../../../../schema/__generated__/schema.types').ParentEntity} ParentEntity
 * @typedef {import('../../../../../schema/__generated__/schema.types').RemoteFeatureSettings} RemoteFeatureSettings
 */

/** @type {DetectedRequest} */
const allowedFirstPartyTracker = {
    entityName: 'example.com',
    prevalence: 82.6,
    url: 'https://example.com/a.js',
    pageUrl: 'https://example.com',
    state: { allowed: { reason: 'ownedByFirstParty' } },
}

/** @type {DetectedRequest} */
const allowedTrackerRule = {
    entityName: 'example.com',
    prevalence: 82.6,
    url: 'https://example.com/a.js',
    pageUrl: 'https://example.com',
    state: { allowed: { reason: 'ruleException' } },
}

/** @type {DetectedRequest} */
const allowedThirdParty = {
    entityName: 'Index Exchange',
    prevalence: 12.7,
    url: 'indexww.com',
    pageUrl: 'https://example.com',
    category: 'Advertising',
    state: { allowed: { reason: 'otherThirdPartyRequest' } },
}

/** @type {DetectedRequest} */
const allowedAdClickAttribution = {
    entityName: 'Index Exchange',
    prevalence: 12.7,
    url: 'https://bat.bing.com/1.js',
    pageUrl: 'https://example.com',
    category: 'Advertising',
    state: { allowed: { reason: 'adClickAttribution' } },
}

/** @type {DetectedRequest} */
const blocked1 = {
    entityName: 'Google',
    prevalence: 82.6,
    url: 'securepubads.g.doubleclick.net',
    pageUrl: 'https://example.com',
    category: 'Advertising',
    state: { blocked: {} },
}

/** @type {DetectedRequest} */
const allowedProtectionsDisabled = {
    entityName: 'Google',
    prevalence: 82.6,
    url: 'securepubads.g.doubleclick.net',
    pageUrl: 'https://example.com',
    category: 'Advertising',
    state: { allowed: { reason: 'protectionDisabled' } },
}

export const requests = {
    allowedTrackerFirstParty: allowedFirstPartyTracker,
    allowedTrackerRuleException: allowedTrackerRule,
    allowedThirdParty,
    allowedAdClickAttribution,
    allowedProtectionsDisabled,
    blocked: blocked1,
}

// eslint-disable-next-line no-unused-vars
export const defaultCertificates = [
    {
        commonName: 'sni.cloudflaressl.com',
        publicKey: {
            blockSize: 72,
            canEncrypt: true,
            bitSize: 256,
            canSign: false,
            canDerive: true,
            canUnwrap: false,
            canWrap: false,
            canDecrypt: false,
            effectiveSize: 256,
            isPermanent: false,
            type: 'Elliptic Curve',
            externalRepresentation: 'BEO3YVjG8jpNVRlh9G10paEfrx9XnVG9GvNtOAYkZvuytfhKTZ9sW+MhQaFDAgKveZUDIMg7WvG8QXZGPNTWCKg=',
            canVerify: true,
            keyId: 'Xbo6o2j/lA8zNZ/axcChz8ID2MM=',
        },
        emails: [],
        summary: 'sni.cloudflaressl.com',
    },
    {
        commonName: 'Cloudflare Inc ECC CA-3',
        publicKey: {
            blockSize: 72,
            canEncrypt: true,
            bitSize: 256,
            canSign: false,
            canDerive: true,
            canUnwrap: false,
            canWrap: false,
            canDecrypt: false,
            effectiveSize: 256,
            isPermanent: false,
            type: 'Elliptic Curve',
            externalRepresentation: 'BLmtTWaZFAtG7B+B0SpQHp0DFS80En0tlriIOJuFX4+/u03vYUbEyXPUJE/g7hzObLNRcS9q7kwFCXfTcmKkm9c=',
            canVerify: true,
            keyId: 'pc436uuwdQ6UZ4i0RfrZJBCHlh8=',
        },
        emails: [],
        summary: 'Cloudflare Inc ECC CA-3',
    },
    {
        commonName: 'Baltimore CyberTrust Root',
        publicKey: {
            blockSize: 256,
            canEncrypt: false,
            bitSize: 2048,
            canSign: false,
            canDerive: false,
            canUnwrap: false,
            canWrap: false,
            canDecrypt: false,
            effectiveSize: 2048,
            isPermanent: false,
            type: 'RSA',
            externalRepresentation:
                'MIIBCgKCAQEAowS7IquYPVfoJnKatXnUKeLh6JWAsbDjW44rKZpk36Fd7bAJBW3bKC7OYqJi/rSI2hLrOOshncBBKwFSe4h30xyPx7q5iLVqCedz6BFAp9HMymKNLeWPC6ZQ0qhQwyjq9aslh4qalhypZ7g/DNX3+VITL8Ib1XBw8I/AEsoGy5rh2cozenfW+Oy58WhEQkgT0sDCpK5eYP62pgX8tN0HWQLUWRiYY/WlY+CQDH1dsgZ684Xq69QDrl6EPl//Fe1pvPk5NnJ1z3dSTfPJkCy5PeXJI1M/HySYIVwHmSm9xjrs526GOmuXdGMzvWgYMfB4jXa//J6OXSqGp02Q3CcaOQIDAQAB',
            canVerify: true,
            keyId: '5Z1ZMIJHWMys+ghUNoZ7OrUETfA=',
        },
        emails: [],
        summary: 'Baltimore CyberTrust Root',
    },
]

export const permissions = [
    {
        key: 'camera',
        paused: false,
        permission: 'deny',
        title: 'Camera',
        used: true,
        options: [
            {
                id: 'ask',
                title: 'Ask every time',
            },
            {
                id: 'grant',
                title: 'Always allow',
            },
            {
                id: 'deny',
                title: 'Always deny',
            },
        ],
    },
    {
        key: 'microphone',
        paused: false,
        permission: 'ask',
        title: 'Microphone',
        used: true,
        options: [
            {
                id: 'ask',
                title: 'Ask every time',
            },
            {
                id: 'grant',
                title: 'Always allow',
            },
            {
                id: 'deny',
                title: 'Always deny',
            },
        ],
    },
    {
        key: 'geolocation',
        paused: false,
        permission: 'ask',
        title: 'Geolocation',
        used: true,
        options: [
            {
                id: 'ask',
                title: 'Ask every time',
            },
            {
                id: 'deny',
                title: 'Always deny',
            },
        ],
    },
    {
        key: 'popups',
        paused: false,
        permission: 'notify',
        title: 'Pop-ups',
        used: true,
        options: [
            {
                id: 'notify',
                title: 'Notify',
            },
            {
                id: 'grant',
                title: 'Always allow',
            },
            {
                id: 'deny',
                title: 'Always deny',
            },
        ],
    },
]

/**
 * @typedef {{ clearHistory: boolean, tabClearEnabled: boolean, pinnedTabs: number }} BurnConfig
 */

/**
 * These can be used when previewing the dashboard by adding the 'state' parameter, such as
 * - http://localhost:8080/html/ios.html?state=01
 * - http://localhost:8080/html/ios.html?state=02
 * - http://localhost:8080/html/ios.html?state=google
 * - http://localhost:8080/html/ios.html?state=cnn
 */
export class MockData {
    /**
     * @param {object} params
     * @param {string} [params.state] - any string identifier for this mock state
     * @param {string} [params.url]
     * @param {{locale: string}} [params.localeSettings]
     * @param {DetectedRequest[]} [params.requests]
     * @param {any[]} [params.certificate]
     * @param {ParentEntity} [params.parentEntity]
     * @param {boolean} [params.upgradedHttps]
     * @param {boolean} [params.contentBlockingException]
     * @param {boolean} [params.allowlisted]
     * @param {boolean} [params.denylisted]
     * @param {any[]} [params.permissions]
     * @param {boolean} [params.specialDomainName]
     * @param {boolean} [params.emailUser]
     * @param {boolean} [params.fireButtonEnabled]
     * @param {BurnConfig} [params.fireButtonOptions]
     * @param {import('../../../../../schema/__generated__/schema.types').CookiePromptManagementStatus} [params.cookiePromptManagementStatus]
     * @param {import('../../../../../schema/__generated__/schema.types').RemoteFeatureSettings} [params.remoteFeatureSettings]
     * @param {import('../../../../../schema/__generated__/schema.types').EmailProtectionUserData} [params.emailProtectionUserData]
     * @param {{screen?: import('../../../../../schema/__generated__/schema.types').ScreenKind}} [params.urlParams]
     */
    constructor(params) {
        this.urlParams = params.urlParams || {}
        this.url = params.url || 'https://example.com'
        this.requests = params.requests || []
        this.state = params.state
        this.localeSettings = params.localeSettings || { locale: 'en' }
        this.certificate = params.certificate || defaultCertificates
        this.upgradedHttps = params.upgradedHttps ?? false
        this.contentBlockingException = params.contentBlockingException
        this.parentEntity = params.parentEntity
        this.permissions = params.permissions
        this.allowlisted = params.allowlisted
        this.denylisted = params.denylisted
        this.specialDomainName = params.specialDomainName
        this.emailUser = params.emailUser
        this.cookiePromptManagementStatus = params.cookiePromptManagementStatus
        this.fireButtonEnabled = params.fireButtonEnabled || false
        this.remoteFeatureSettings = params.remoteFeatureSettings
        this.emailProtectionUserData = params.emailProtectionUserData
        this.fireButtonOptions = params.fireButtonOptions

        /** @type {Protections} */
        this.protections = Protections.default()

        if (this.allowlisted) {
            this.protections.allowlisted = true
        }
        if (this.denylisted) {
            this.protections.denylisted = true
            this.contentBlockingException = true
        }
        if (this.contentBlockingException) {
            this.protections.enabledFeatures = []
        }
        if (this.requests && (this.protections.allowlisted || this.contentBlockingException)) {
            this.requests = protectionsOff(this.requests)
        }
    }

    /**
     * @param {Partial<MockData> & {url: string}} mock
     * @returns {MockData}
     */
    static default(mock) {
        return new MockData({
            ...mock,
        })
    }

    /**
     * @return {import('../../../../../schema/__generated__/schema.types').WindowsIncomingViewModel}
     */
    toWindowsViewModel() {
        return {
            Feature: 'PrivacyDashboard',
            Name: 'ViewModelUpdated',
            Data: {
                rawRequestData: {
                    requests: this.requests || [],
                },
                protections: this.protections,
                tabUrl: this.url,
                upgradedHttps: this.upgradedHttps,
                parentEntity: this.parentEntity,
                permissions: this.permissions,
                certificates: this.certificate,
                cookiePromptManagementStatus: this.cookiePromptManagementStatus,
            },
        }
    }

    /**
     * @return {import('../../../../../schema/__generated__/schema.types').GetPrivacyDashboardData}
     */
    toExtensionDashboardData() {
        /** @type {import('../../../../../schema/__generated__/schema.types').GetPrivacyDashboardData} */
        const output = {
            tab: {
                id: 1533,
                url: this.url || 'https://example.com',
                upgradedHttps: this.upgradedHttps,
                protections: this.protections,
                parentEntity: this.parentEntity,
            },
            fireButton: { enabled: this.fireButtonEnabled },
            requestData: {
                requests: this.requests || [],
            },
            emailProtectionUserData: this.emailProtectionUserData,
        }

        if (this.specialDomainName) {
            output.tab.specialDomainName = 'extensions'
        }
        if (this.emailUser) {
            output.emailProtectionUserData = {
                nextAlias: '123456_next',
            }
        }
        if (this.localeSettings) {
            output.tab.localeSettings = this.localeSettings
        }

        return output
    }

    /**
     * @return {import('../../../../../schema/__generated__/schema.types.js').FireButtonData}
     */
    toBurnOptions() {
        const burnConfig = this.fireButtonOptions || { clearHistory: true, tabClearEnabled: true, pinnedTabs: 2 }
        const { clearHistory, pinnedTabs, tabClearEnabled } = burnConfig
        return {
            options: [
                {
                    name: 'CurrentSite',
                    options: {
                        origins: ['https://example.com/'],
                    },
                    descriptionStats: {
                        clearHistory,
                        site: 'example.com',
                        duration: 'all',
                        openTabs: tabClearEnabled ? 1 : 0,
                        cookies: 1,
                        pinnedTabs,
                    },
                },
                {
                    name: 'LastHour',
                    options: {
                        since: Date.now(),
                    },
                    descriptionStats: {
                        clearHistory,
                        duration: 'hour',
                        openTabs: tabClearEnabled ? 5 : 0,
                        cookies: 23,
                        pinnedTabs,
                    },
                },
                {
                    name: 'AllTime',
                    options: {},
                    descriptionStats: {
                        clearHistory,
                        duration: 'all',
                        openTabs: tabClearEnabled ? 5 : 0,
                        cookies: 1000,
                        pinnedTabs,
                    },
                },
            ],
        }
    }
}

/**
 * @param {import('../../../../../schema/__generated__/schema.types').RequestData} google
 * @param {import('../../../../../schema/__generated__/schema.types').RequestData} cnn
 */
export const createDataStates = (google, cnn) => {
    return {
        'with-overrides': new MockData({
            url: 'https://example.com',
            requests: requestsFromOverride(),
        }),
        'with-overrides-protections-off': new MockData({
            url: 'https://example.com',
            requests: requestsFromOverride(),
            contentBlockingException: true,
        }),
        'rule-exception-only': new MockData({
            url: 'https://example.com',
            requests: [allowedTrackerRule, allowedThirdParty],
        }),
        'alternative-layout-exp-1': new MockData({
            url: 'https://example.com',
            requests: cnn.requests,
            remoteFeatureSettings: {
                primaryScreen: {
                    layout: 'highlighted-protections-toggle',
                },
            },
        }),
        'alternative-layout-exp-1-protections-off': new MockData({
            url: 'https://example.com',
            requests: cnn.requests,
            remoteFeatureSettings: {
                primaryScreen: {
                    layout: 'highlighted-protections-toggle',
                },
            },
            allowlisted: true,
        }),
        'alternative-layout-exp-1-disabled': new MockData({
            url: 'https://example.com',
            requests: cnn.requests,
            remoteFeatureSettings: {
                primaryScreen: {
                    layout: 'highlighted-protections-toggle',
                },
            },
            contentBlockingException: true,
        }),
        'consent-managed': new MockData({
            url: 'https://example.com',
            requests: [],
            cookiePromptManagementStatus: {
                consentManaged: true,
            },
        }),
        'consent-managed-configurable': new MockData({
            url: 'https://example.com',
            requests: [],
            cookiePromptManagementStatus: {
                consentManaged: true,
                configurable: true,
            },
        }),
        'consent-managed-configurable-cosmetic': new MockData({
            url: 'https://example.com',
            requests: [],
            cookiePromptManagementStatus: {
                consentManaged: true,
                configurable: true,
                cosmetic: true,
            },
        }),
        'locale-pl': new MockData({
            localeSettings: {
                locale: 'pl',
            },
            url: 'https://example.com',
            requests: [],
        }),
        'locale-fr': new MockData({
            localeSettings: {
                locale: 'fr',
            },
            url: 'https://example.com',
            requests: [],
        }),
        'email-user': new MockData({
            emailProtectionUserData: {
                nextAlias: 'abc',
            },
        }),
        'ad-attribution': new MockData({
            url: 'https://example.com',
            requests: [blocked1, allowedAdClickAttribution],
        }),
        'https-without-certificate': new MockData({
            url: 'https://example.com',
            requests: [],
            certificate: [],
            localeSettings: undefined,
            parentEntity: undefined,
            upgradedHttps: false,
        }),
        insecure: new MockData({
            url: 'http://example.com',
            requests: [],
            certificate: [],
            localeSettings: undefined,
            parentEntity: undefined,
        }),
        upgraded: new MockData({
            url: 'https://example.com',
            upgradedHttps: true,
            requests: [],
            localeSettings: undefined,
            parentEntity: undefined,
        }),
        google: new MockData({
            requests: google.requests,
            url: 'https://google.com',
            parentEntity: {
                displayName: 'Google',
                prevalence: 80.1,
            },
        }),
        'google-off': new MockData({
            requests: protectionsOff(google.requests),
            contentBlockingException: true,
            url: 'https://google.com',
            parentEntity: {
                displayName: 'Google',
                prevalence: 80.1,
            },
        }),
        'google-with-blocked': new MockData({
            requests: google.requests.concat(blocked1),
            url: 'https://google.com',
            parentEntity: {
                displayName: 'Google',
                prevalence: 80.1,
            },
        }),
        'upgraded+secure': new MockData({
            requests: [],
            url: 'https://example.com',
            upgradedHttps: true,
            certificate: defaultCertificates,
        }),
        'upgraded+secure+without-certs': new MockData({
            requests: [],
            url: 'https://example.com',
            upgradedHttps: true,
            certificate: [],
        }),
        cnn: new MockData({
            url: 'https://edition.cnn.com',
            requests: cnn.requests,
            parentEntity: {
                displayName: 'WarnerMedia, LLC',
                prevalence: 0.401,
            },
        }),
        permissions: new MockData({
            url: 'https://example.com',
            requests: [],
            permissions,
        }),
        protectionsOn: new MockData({
            url: 'https://example.com',
            requests: [],
        }),
        protectionsOn_blocked: new MockData({
            url: 'https://example.com',
            requests: [blocked1],
        }),
        protectionsOn_blocked_allowedTrackers: new MockData({
            url: 'https://example.com',
            requests: [blocked1, allowedFirstPartyTracker],
        }),
        protectionsOn_blocked_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [blocked1, allowedThirdParty],
        }),
        protectionsOn_blocked_allowedTrackers_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [blocked1, allowedThirdParty, allowedFirstPartyTracker],
        }),
        protectionsOn_allowedTrackers: new MockData({
            url: 'https://example.com',
            requests: [
                allowedFirstPartyTracker,
                allowedTrackerRule,
                allowedAdClickAttribution,
                {
                    ...allowedFirstPartyTracker,
                    state: { allowed: { reason: 'protectionDisabled' } },
                },
            ],
        }),
        protectionsOn_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty],
        }),
        protectionsOn_allowedTrackers_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedFirstPartyTracker, allowedTrackerRule, allowedThirdParty],
        }),
        protectionsOn_allowedFirstParty: new MockData({
            url: 'https://example.com',
            requests: [allowedFirstPartyTracker],
        }),
        protectionsOn_allowedFirstParty_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedFirstPartyTracker, allowedThirdParty],
        }),
        protectionsOff: new MockData({
            url: 'https://example.com',
            requests: [],
            contentBlockingException: true,
        }),
        protectionsOff_allowedTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedFirstPartyTracker, allowedTrackerRule],
            contentBlockingException: true,
        }),
        protectionsOff_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty],
            contentBlockingException: true,
        }),
        protectionsOff_allowedTrackers_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedFirstPartyTracker],
            contentBlockingException: true,
        }),
        allowlisted: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedFirstPartyTracker],
            allowlisted: true,
        }),
        denylisted: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedFirstPartyTracker],
            denylisted: true,
        }),
        'remote-disabled': new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedFirstPartyTracker],
            contentBlockingException: true,
        }),
        'new-entities': new MockData({
            url: 'https://m.youtube.com',
            requests: [
                {
                    eTLDplus1: 'ytimg.com',
                    entityName: 'Youtube (Google)',
                    ownerName: 'Youtube',
                    pageUrl: 'https://m.youtube.com/',
                    prevalence: 0.5,
                    state: { blocked: {} },
                    url: 'https://i.ytimg.com/vi/AD6OPCFxmJM/hq720_2.jpg?sqp=-oaymwEdCJUDENAFSEbyq4qpAw8IARUAAIhCcAHAAQbQAQE=&rs=AOn4CLBsqqvey-tZ8K3peu7cavrfnR0zDA',
                },
                {
                    category: 'Advertising',
                    eTLDplus1: 'doubleclick.net',
                    entityName: 'Google Ads (Google)',
                    ownerName: 'Google Ads',
                    pageUrl: 'https://m.youtube.com/',
                    prevalence: 0.5,
                    state: { blocked: {} },
                    url: 'https://googleads.g.doubleclick.net/pagead/id',
                },
                {
                    category: 'Advertising',
                    eTLDplus1: 'doubleclick.net',
                    entityName: 'Google Analytics (Google)',
                    ownerName: 'Google Ads',
                    pageUrl: 'https://m.youtube.com/',
                    prevalence: 0.5,
                    state: { blocked: {} },
                    url: 'https://static.doubleclick.net/instream/ad_status.js',
                },
                {
                    category: 'Advertising',
                    eTLDplus1: 'google.com',
                    entityName: 'Instagram (Facebook)',
                    ownerName: 'Google LLC',
                    pageUrl: 'https://m.youtube.com/',
                    prevalence: 80.5,
                    state: { blocked: {} },
                    url: 'https://www.google.com/js/th/EWuoZ_9LU3hL76PT3YFLg_EjKJdTpZ6rgtgTJA98OBY.js',
                },
            ],
        }),
        'fire-button': new MockData({
            requests: google.requests,
            url: 'https://google.com',
            parentEntity: {
                displayName: 'Google',
                prevalence: 80.1,
            },
            fireButtonEnabled: true,
            fireButtonOptions: { clearHistory: true, tabClearEnabled: true, pinnedTabs: 2 },
        }),
        'fire-button-enabled': new MockData({
            url: 'https://example.com',
            fireButtonEnabled: true,
        }),
        'fire-button-disabled': new MockData({
            url: 'https://example.com',
            fireButtonEnabled: false,
        }),
        'fire-button-no-pinned': new MockData({
            url: 'https://example.com',
            fireButtonEnabled: true,
            fireButtonOptions: { clearHistory: true, tabClearEnabled: true, pinnedTabs: 0 },
        }),
        'fire-button-tab-clear-disabled': new MockData({
            url: 'https://example.com',
            fireButtonEnabled: true,
            fireButtonOptions: { clearHistory: true, tabClearEnabled: false, pinnedTabs: 0 },
        }),
        'special-page': new MockData({
            url: 'https://example.com',
            specialDomainName: true,
            emailUser: true,
        }),
        'invalid-data': new MockData({
            url: 'https://example.com',
            // @ts-expect-error - this SHOULD error, that's the test
            requests: [{ foo: 'bar' }],
        }),
        'screen-breakageForm': new MockData({
            url: 'https://example.com',
            requests: [],
            urlParams: {
                screen: 'breakageForm',
            },
        }),
        'screen-toggleReport': new MockData({
            url: 'https://example.com',
            requests: [],
            urlParams: {
                screen: 'toggleReport',
            },
        }),
        'screen-promptBreakageForm': new MockData({
            url: 'https://example.com',
            requests: [],
            urlParams: {
                screen: 'promptBreakageForm',
            },
        }),
    }
}

function requestsFromOverride() {
    if (typeof window === 'undefined') return []
    const keys = new URLSearchParams(window.location.search).getAll('requests')
    const known = Object.keys(requests)
    return keys.filter((key) => known.includes(key)).map((key) => requests[key])
}
