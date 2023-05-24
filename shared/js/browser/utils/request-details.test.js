import amazon from '../../../../schema/__fixtures__/request-data-amazon.json'
import google from '../../../../schema/__fixtures__/request-data-google.json'
import cnn from '../../../../schema/__fixtures__/request-data-cnn.json'
import { createRequestDetails, createTabData, fromJson, fromMultiJson, states } from './request-details'
import { Protections } from './protections.mjs'

describe('RequestDetails', () => {
    it('accepts zero requests', () => {
        const requestDetails = createRequestDetails([], [])
        expect(requestDetails.all.requestCount).toBe(0)
        expect(requestDetails.blocked.requestCount).toBe(0)
        expect(requestDetails.allowed.adClickAttribution.requestCount).toBe(0)
        expect(requestDetails.allowed.otherThirdPartyRequest.requestCount).toBe(0)
        expect(requestDetails.allowed.ruleException.requestCount).toBe(0)
        expect(requestDetails.allowed.ownedByFirstParty.requestCount).toBe(0)
        expect(requestDetails.allowed.protectionDisabled.requestCount).toBe(0)
    })
    it('sorts by prevalence', () => {
        const requestDetails = fromJson(amazon)
        expect(requestDetails.all.sortedByPrevalence()).toMatchSnapshot()
    })
    it('sorts by prevalence (google first)', () => {
        const requestDetails = fromMultiJson(amazon, google)
        expect(requestDetails.all.sortedByPrevalence()).toMatchSnapshot()
    })
    it('calulates states (empty)', () => {
        const requestDetails = createRequestDetails([], [])
        const state = requestDetails.state(true)
        expect(state).toBe(states.protectionsOn)
        const state2 = requestDetails.state(false)
        expect(state2).toBe(states.protectionsOff)
    })
    it('calculates states (amazon)', () => {
        const requestDetails = fromJson(amazon)
        const state = requestDetails.state(true)
        expect(state).toBe(states.protectionsOn_allowedTrackers)
        const state2 = requestDetails.state(false)
        expect(state2).toBe(states.protectionsOff_allowedTrackers)
    })
    it('calculates states (google)', () => {
        const requestDetails = fromJson(google)
        const state = requestDetails.state(true)
        expect(state).toBe(states.protectionsOn_allowedTrackers)
    })
    it('calculates states (cnn)', () => {
        const requestDetails = fromJson(cnn)
        const state = requestDetails.state(true)
        expect(state).toBe(states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers)
        const state2 = requestDetails.state(false)
        expect(state2).toBe(states.protectionsOff_allowedTrackers_allowedNonTrackers)
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
        expect(state).toBe(states.protectionsOn_blocked)
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
        expect(requestDetails.all).toMatchSnapshot()
    })
})

describe('createTabData', () => {
    it('creates a TabData object', () => {
        const url = 'https://www.example.com/'
        const tabData = createTabData(url, true, new Protections(false, [], false, false), { requests: [] })
        expect(tabData).toMatchSnapshot()
    })

    it('removes port from the site domain', () => {
        const url = 'https://www.example.com:8080/'
        const tabData = createTabData(url, true, new Protections(false, [], false, false), { requests: [] })
        expect(tabData).toMatchSnapshot()
    })
})
