import { describe, it } from 'node:test'
import { equal, deepEqual } from 'node:assert'
import { readFileSync } from 'node:fs'
import { createRequestDetails, createTabData, fromJson, fromMultiJson, states } from './request-details.mjs'
import { Protections } from './protections.mjs'
import { cwd } from '../../../../scripts/utils.mjs'
import { join } from 'node:path'

const CWD = cwd(import.meta.url)
const BASE = join(CWD, '../../../../schema/__fixtures__')

const amazon = JSON.parse(readFileSync(join(BASE, 'request-data-amazon.json'), 'utf-8'))
const google = JSON.parse(readFileSync(join(BASE, 'request-data-google.json'), 'utf-8'))
const cnn = JSON.parse(readFileSync(join(BASE, 'request-data-cnn.json'), 'utf-8'))

describe('RequestDetails', () => {
    it('accepts zero requests', () => {
        const requestDetails = createRequestDetails([], [])
        equal(requestDetails.all.requestCount, 0)
        equal(requestDetails.blocked.requestCount, 0)
        equal(requestDetails.allowed.adClickAttribution.requestCount, 0)
        equal(requestDetails.allowed.otherThirdPartyRequest.requestCount, 0)
        equal(requestDetails.allowed.ruleException.requestCount, 0)
        equal(requestDetails.allowed.ownedByFirstParty.requestCount, 0)
        equal(requestDetails.allowed.protectionDisabled.requestCount, 0)
    })
    it('sorts by prevalence', () => {
        const requestDetails = fromJson(amazon)
        const actual = requestDetails.all.sortedByPrevalence()
        const expected = [
            {
                displayName: 'Amazon',
                name: 'Amazon Technologies, Inc.',
                normalizedName: 'amazon',
                prevalence: 21.5,
                urls: {
                    'completion.amazon.com': {
                        category: 'Analytics',
                        url: 'completion.amazon.com',
                    },
                    'images-eu.ssl-images-amazon.com': {
                        category: 'Content Delivery',
                        url: 'images-eu.ssl-images-amazon.com',
                    },
                },
            },
        ]
        deepEqual(actual, expected)
    })
    it('sorts by prevalence (google first)', () => {
        const requestDetails = fromMultiJson(amazon, google)
        const actual = requestDetails.all.sortedByPrevalence()
        const expected = [
            {
                displayName: 'Google',
                name: 'Google LLC',
                normalizedName: 'google',
                prevalence: 80.1,
                urls: {
                    'apis.google.com': {
                        category: 'Advertising',
                        url: 'apis.google.com',
                    },
                    'fonts.gstatic.com': {
                        category: 'Content Delivery',
                        url: 'fonts.gstatic.com',
                    },
                    'google.com': {
                        category: 'Advertising',
                        url: 'google.com',
                    },
                    'gstatic.com': {
                        category: 'Content Delivery',
                        url: 'gstatic.com',
                    },
                },
            },
            {
                displayName: 'Amazon',
                name: 'Amazon Technologies, Inc.',
                normalizedName: 'amazon',
                prevalence: 21.5,
                urls: {
                    'completion.amazon.com': {
                        category: 'Analytics',
                        url: 'completion.amazon.com',
                    },
                    'images-eu.ssl-images-amazon.com': {
                        category: 'Content Delivery',
                        url: 'images-eu.ssl-images-amazon.com',
                    },
                },
            },
        ]
        deepEqual(actual, expected)
    })
    it('calulates states (empty)', () => {
        const requestDetails = createRequestDetails([], [])
        const state = requestDetails.state(true)
        equal(state, states.protectionsOn)
        const state2 = requestDetails.state(false)
        equal(state2, states.protectionsOff)
    })
    it('calculates states (amazon)', () => {
        const requestDetails = fromJson(amazon)
        const state = requestDetails.state(true)
        equal(state, states.protectionsOn_allowedTrackers)
        const state2 = requestDetails.state(false)
        equal(state2, states.protectionsOff_allowedTrackers)
    })
    it('calculates states (google)', () => {
        const requestDetails = fromJson(google)
        const state = requestDetails.state(true)
        equal(state, states.protectionsOn_allowedTrackers)
    })
    it('calculates states (cnn)', () => {
        const requestDetails = fromJson(cnn)
        const state = requestDetails.state(true)
        equal(state, states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers)
        const state2 = requestDetails.state(false)
        equal(state2, states.protectionsOff_allowedTrackers_allowedNonTrackers)
    })
    it('calculates states (on + blocked)', () => {
        const requestDetails = fromJson({
            requests: [
                {
                    pageUrl: 'https://example.com',
                    url: 'https://google.com/a.js',
                    entityName: 'Google',
                    category: 'Advertising',
                    state: {
                        blocked: {},
                    },
                },
            ],
        })
        const state = requestDetails.state(true)
        equal(state, states.protectionsOn_blocked)
    })
    /**
     * In this case, 'entityName' and 'eTLDplus1' match - our logic
     * was always running `removeTLD` when the entity name was present.
     * This behaviour was intended to prevent Entity names like "Amazon.com" from displaying,
     * but it accidentally also stripped `.uk` from the example below.
     *
     * This test ensures that the following is true:
     *    "displayName": "bbci.co.uk"
     */
    it('uses correct display name with EntityName matches ETLD+1', () => {
        const requestDetails = fromJson({
            requests: [
                {
                    pageUrl: 'https://www.bbc.co.uk/',
                    state: {
                        allowed: {
                            reason: 'otherThirdPartyRequest',
                        },
                    },
                    url: 'https://static.files.bbci.co.uk/core/bundle-defaultVendors.99d08071a5c40316d056.js',
                    eTLDplus1: 'bbci.co.uk',
                    entityName: 'bbci.co.uk',
                },
            ],
        })
        const expected = {
            entities: {
                'bbci.co.uk': {
                    displayName: 'bbci.co.uk',
                    name: undefined,
                    normalizedName: 'bbcico',
                    prevalence: 0,
                    urls: {
                        'static.files.bbci.co.uk': {
                            category: undefined,
                            url: 'static.files.bbci.co.uk',
                        },
                    },
                },
            },
            entitiesCount: 1,
            requestCount: 1,
        }
        deepEqual(requestDetails.all, expected)
    })
})

describe('createTabData', () => {
    it('creates a TabData object', () => {
        const url = 'https://www.example.com/'
        const tabData = createTabData(url, true, new Protections(false, [], false, false), { requests: [] })
        const expected = {
            certificate: undefined,
            cookiePromptManagementStatus: undefined,
            ctaScreens: undefined,
            domain: 'example.com',
            emailProtection: undefined,
            error: undefined,
            id: undefined,
            isPendingUpdates: undefined,
            locale: null,
            parentEntity: undefined,
            permissions: undefined,
            platformLimitations: undefined,
            protections: {
                allowlisted: false,
                denylisted: false,
                enabledFeatures: [],
                unprotectedTemporary: false,
            },
            requestDetails: {
                all: {
                    entities: {},
                    entitiesCount: 0,
                    requestCount: 0,
                },
                allowed: {
                    adClickAttribution: {
                        entities: {},
                        entitiesCount: 0,
                        requestCount: 0,
                    },
                    otherThirdPartyRequest: {
                        entities: {},
                        entitiesCount: 0,
                        requestCount: 0,
                    },
                    ownedByFirstParty: {
                        entities: {},
                        entitiesCount: 0,
                        requestCount: 0,
                    },
                    protectionDisabled: {
                        entities: {},
                        entitiesCount: 0,
                        requestCount: 0,
                    },
                    ruleException: {
                        entities: {},
                        entitiesCount: 0,
                        requestCount: 0,
                    },
                },
                blocked: {
                    entities: {},
                    entitiesCount: 0,
                    requestCount: 0,
                },
                surrogates: [],
            },
            search: undefined,
            specialDomainName: undefined,
            status: 'complete',
            upgradedHttps: true,
            url: 'https://www.example.com/',
        }
        deepEqual(tabData, expected)
    })

    it('removes port from the site domain', () => {
        const url = 'https://www.example.com:8080/'
        const tabData = createTabData(url, true, new Protections(false, [], false, false), { requests: [] })
        equal(tabData.domain, 'example.com')
    })
})
