import { Protections } from '../../../browser/utils/protections.mjs'
import { protectionsOff } from './toggle-protections.mjs'

/**
 * @typedef {import('../../../browser/utils/request-details.mjs').TabData} TabData
 * @typedef {import('../../../../../schema/__generated__/schema.types').DetectedRequest} DetectedRequest
 * @typedef {import('../../../../../schema/__generated__/schema.types').ParentEntity} ParentEntity
 */

/** @type {DetectedRequest} */
const allowedTracker = {
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
 * These can be used when previewing the dashboard by adding the 'state' parameter, such as
 * - http://localhost:8080/html/popup.html?state=01
 * - http://localhost:8080/html/popup.html?state=02
 * - http://localhost:8080/html/popup.html?state=google
 * - http://localhost:8080/html/popup.html?state=cnn
 */

export class MockData {
    /**
     * @param {object} params
     * @param {string} [params.state] - any string identifier for this mock state
     * @param {string} params.url
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
     */
    constructor(params) {
        this.url = params.url
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
        if (params.fireButtonOptions) {
            this.getBurnOptions = mockBurnOptions(params.fireButtonOptions)
        }

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
        if (this.protections.allowlisted || this.contentBlockingException) {
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
}

/**
 * @param {MockData} mock
 * @returns {{
 *  getPrivacyDashboardData: import('../../../../../schema/__generated__/schema.types').GetPrivacyDashboardData,
 *  getBurnOptions?: import('../../../../../schema/__generated__/schema.types.js').FireButtonData
 * }}
 */
export function mockToExtensionDashboardMessage(mock) {
    /** @type {import('../../../../../schema/__generated__/schema.types').GetPrivacyDashboardData} */
    const msg = {
        tab: {
            id: 123,
            url: mock.url,
            protections: mock.protections,
            upgradedHttps: mock.upgradedHttps,
            localeSettings: mock.localeSettings,
            parentEntity: mock.parentEntity,
        },
        requestData: { requests: mock.requests },
        emailProtectionUserData: undefined,
        fireButton: {
            enabled: mock.fireButtonEnabled,
        },
    }
    if (mock.specialDomainName) {
        msg.tab.specialDomainName = 'extensions'
    }
    if (mock.emailUser) {
        msg.emailProtectionUserData = {
            nextAlias: '123456_next',
        }
    }
    if (mock.localeSettings) {
        msg.tab.localeSettings = mock.localeSettings
    }
    return {
        getPrivacyDashboardData: msg,
        getBurnOptions: mock.getBurnOptions || undefined,
    }
}

/**
 * @param {import('../../../../../schema/__generated__/schema.types').RequestData} google
 * @param {import('../../../../../schema/__generated__/schema.types').RequestData} cnn
 */
export const createDataStates = (google, cnn) => {
    return {
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
        'ad-attribution': new MockData({
            url: 'https://example.com',
            requests: [blocked1, allowedAdClickAttribution],
            certificate: [],
        }),
        'without-certificate': new MockData({
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
        cnn: new MockData({
            url: 'https://edition.cnn.com',
            requests: cnn.requests,
            parentEntity: {
                displayName: 'WarnerMedia, LLC',
                prevalence: 0.401,
            },
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
            requests: [blocked1, allowedTracker],
        }),
        protectionsOn_blocked_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [blocked1, allowedThirdParty],
        }),
        protectionsOn_blocked_allowedTrackers_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [blocked1, allowedThirdParty, allowedTracker],
        }),
        protectionsOn_allowedTrackers: new MockData({
            url: 'https://example.com',
            requests: [
                allowedTracker,
                allowedTrackerRule,
                allowedAdClickAttribution,
                {
                    ...allowedTracker,
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
            requests: [allowedTracker, allowedThirdParty],
        }),
        protectionsOff: new MockData({
            url: 'https://example.com',
            requests: [],
            contentBlockingException: true,
        }),
        protectionsOff_allowedTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedTracker],
            contentBlockingException: true,
        }),
        protectionsOff_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty],
            contentBlockingException: true,
        }),
        protectionsOff_allowedTrackers_allowedNonTrackers: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedTracker],
            contentBlockingException: true,
        }),
        allowlisted: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedTracker],
            allowlisted: true,
        }),
        denylisted: new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedTracker],
            denylisted: true,
        }),
        'remote-disabled': new MockData({
            url: 'https://example.com',
            requests: [allowedThirdParty, allowedTracker],
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
    }
}

/**
 * @typedef {{ clearHistory: boolean, tabClearEnabled: boolean, pinnedTabs: number }} BurnConfig
 */
/**
 * @param {BurnConfig} options
 * @returns {import('../../../../../schema/__generated__/schema.types.js').FireButtonData}
 */
export function mockBurnOptions({ clearHistory, tabClearEnabled, pinnedTabs }) {
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
