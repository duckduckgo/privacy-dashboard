import { Protections, createTabData, states } from '../../../browser/utils/request-details'
import _google from '../../../../../schema/__fixtures__/request-data-google.json'
import _cnn from '../../../../../schema/__fixtures__/request-data-cnn.json'
import { detectedRequestSchema, requestDataSchema } from '../../../../../schema/__generated__/schema.parsers'

const google = requestDataSchema.parse(_google)
const cnn = requestDataSchema.parse(_cnn)

/**
 * @typedef {import('../../../browser/utils/request-details').TabData} TabData
 * @typedef {import('../../../../../schema/__generated__/schema.types').DetectedRequest} DetectedRequest
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
/** @type {DetectedRequest} */
const blocked2 = {
    entityName: 'Google',
    prevalence: 82.6,
    url: 'pagead2.googlesyndication.com',
    pageUrl: 'https://example.com',
    category: 'Advertising',
    state: { blocked: {} },
}

/** @type {DetectedRequest} */
const blocked3 = {
    entityName: 'Index Exchange',
    prevalence: 12.7,
    url: 'htlb.casalemedia.com',
    pageUrl: 'https://example.com',
    category: 'Advertising',
    state: { blocked: {} },
}

/** @type {DetectedRequest[]} */
export const defaultRequests = [allowedTracker, allowedThirdParty, blocked1, blocked2, blocked3]

// eslint-disable-next-line no-unused-vars
const defaultCertificates = [
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

const permissions = [
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
 *
 * - http://localhost:8080/html/popup.html?state=01
 * - http://localhost:8080/html/popup.html?state=02
 * - http://localhost:8080/html/popup.html?state=google
 * - http://localhost:8080/html/popup.html?state=cnn
 */
export const dataStates = {
    'ad-attribution': {
        state: states.protectionsOn_blocked_allowedTrackers,
        url: 'https://example.com',
        requests: [blocked1, allowedAdClickAttribution],
        certificates: [],
    },
    'without-certificate': {
        state: states.protectionsOn,
        url: 'https://example.com',
        requests: [],
        certificates: [],
    },
    insecure: {
        state: states.protectionsOn,
        url: 'http://example.com',
        requests: [],
    },
    upgraded: {
        state: states.protectionsOn,
        url: 'http://example.com',
        upgradedHttps: true,
        requests: [],
    },
    google: {
        state: states.protectionsOn_allowedTrackers,
        requests: google.requests,
        url: 'https://google.com',
        parentEntity: {
            displayName: 'Google',
            prevalence: 80.1,
        },
    },
    'google-off': {
        state: states.protectionsOff_allowedTrackers,
        requests: protectionsOff(google.requests),
        contentBlockingException: true,
        url: 'https://google.com',
        parentEntity: {
            displayName: 'Google',
            prevalence: 80.1,
        },
    },
    'google-with-blocked': {
        state: states.protectionsOn_blocked_allowedTrackers,
        requests: google.requests.concat(blocked1),
        url: 'https://google.com',
        parentEntity: {
            displayName: 'Google',
            prevalence: 80.1,
        },
    },
    cnn: {
        state: states.protectionsOn,
        url: 'https://edition.cnn.com',
        requests: cnn.requests,
        parentEntity: {
            displayName: 'WarnerMedia, LLC',
            prevalence: 0.401,
        },
    },
    '01': {
        state: states.protectionsOn,
        url: 'https://example.com',
        requests: [blocked1, allowedTracker],
    },
    '02': {
        state: states.protectionsOn_blocked,
        url: 'https://example.com',
        requests: [allowedTrackerRule],
    },
    '03': {
        state: states.protectionsOn_blocked_allowedTrackers,
        url: 'https://example.com',
        requests: [allowedThirdParty],
    },
    '04': {
        state: states.protectionsOn_blocked_allowedNonTrackers,
        url: 'https://example.com',
        requests: [],
    },
    '05': {
        state: states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers,
        url: 'https://example.com',
        requests: [blocked1],
    },
    '06': {
        state: states.protectionsOn_allowedTrackers,
        url: 'https://example.com',
        requests: [allowedTracker],
    },
    '07': {
        state: states.protectionsOn_allowedNonTrackers,
        url: 'https://example.com',
        requests: [allowedThirdParty],
    },
    '08': {
        state: states.protectionsOn_allowedTrackers_allowedNonTrackers,
        url: 'https://example.com',
        requests: [allowedThirdParty, allowedTracker],
    },
    '09': {
        state: states.protectionsOff,
        url: 'https://example.com',
        requests: [],
        contentBlockingException: true,
    },
    10: {
        state: states.protectionsOff_allowedTrackers,
        url: 'https://example.com',
        requests: [allowedTracker],
        contentBlockingException: true,
    },
    11: {
        state: states.protectionsOff_allowedNonTrackers,
        url: 'https://example.com',
        requests: [allowedThirdParty],
        contentBlockingException: true,
    },
    12: {
        state: states.protectionsOff_allowedTrackers_allowedNonTrackers,
        url: 'https://example.com',
        requests: [allowedThirdParty, allowedTracker],
        contentBlockingException: true,
    },
}

/**
 * @param {Partial<{
 *      isSecure?: boolean,
 *      requests?: DetectedRequest[],
 *      tab?: Partial<TabData>,
 *      parentEntity?: { displayName: string, prevalence: number},
 *      certificate?: any[],
 *      isPendingUpdates?: boolean | null | undefined
 *  }>} [overrides]
 * @returns {{tab: TabData} & Record<string, any>}
 */
export default function (overrides = {}) {
    const { isSecure = true, requests = defaultRequests, isPendingUpdates = false, certificate = defaultCertificates, tab = {} } = overrides

    const url = tab.url ? tab.url : `http${isSecure ? 's' : ''}://www.example.com/`
    const protections = new Protections(false, ['contentBlocking'], false, false)
    const tabData = createTabData(url, false, protections, { requests: requests })

    return {
        tab: {
            ...tabData,
            isPendingUpdates,
            permissions,
            certificate,
            ...tab,
        },
    }
}

/**
 * @param {DetectedRequest[]} requests
 * @returns {DetectedRequest[]}
 */
export function protectionsOff(requests) {
    return requests.map((r) => {
        if ('blocked' in r.state) {
            return detectedRequestSchema.parse({
                ...r,
                state: { allowed: { reason: 'protectionDisabled' } },
            })
        }
        if ('allowed' in r.state) {
            if (r.state.allowed.reason === 'otherThirdPartyRequest') {
                return r
            }
            return detectedRequestSchema.parse({
                ...r,
                state: { allowed: { reason: 'protectionDisabled' } },
            })
        }
        return r
    })
}
