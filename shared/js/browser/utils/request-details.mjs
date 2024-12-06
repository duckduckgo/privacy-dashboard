import { normalizeCompanyName, removeTLD } from '../../ui/models/mixins/normalize-company-name.mjs';
import { requestDataSchema } from '../../../../schema/__generated__/schema.parsers.mjs';

/**
 * @typedef {import('../../../../schema/__generated__/schema.types.js').CookiePromptManagementStatus} CookiePromptManagementStatus
 * @typedef {import('./protections.mjs').Protections} Protections
 */

/**
 * This represents the 'internal' data, eg: a normalized format without
 * cross-platform differences
 */
export class TabData {
    /** @type {string | null | undefined} */
    locale;
    /** @type {boolean | null | undefined} */
    isPendingUpdates;
    /** @type {any[] | null | undefined} */
    certificate;
    /** @type {boolean | null | undefined} */
    platformLimitations;
    /**
     * @param {number | null | undefined} id
     * @param {string} url
     * @param {string} domain
     * @param {string | null | undefined} specialDomainName
     * @param {string} status
     * @param {boolean} upgradedHttps
     * @param {Protections} protections
     * @param {any[] | null | undefined} permissions
     * @param {RequestDetails} requestDetails
     * @param {CookiePromptManagementStatus | undefined | null} cookiePromptManagementStatus
     * @param {Record<string, any> | null | undefined} ctaScreens
     * @param {Record<string, any> | null | undefined} search
     * @param {Record<string, any> | null | undefined} emailProtection
     * @param {import("../../../../schema/__generated__/schema.types").MaliciousSiteStatus | undefined} maliciousSiteStatus
     * @param {{prevalence: number, displayName: string} | null | undefined} parentEntity
     * @param {string | null | undefined} error
     * @param {boolean | null | undefined} isInvalidCert
     */

    constructor(
        id,
        url,
        domain,
        specialDomainName,
        status,
        upgradedHttps,
        protections,
        permissions,
        requestDetails,
        cookiePromptManagementStatus,
        ctaScreens,
        search,
        emailProtection,
        maliciousSiteStatus,
        parentEntity,
        error,
        isInvalidCert
    ) {
        this.url = url;
        this.id = id;
        this.domain = domain;
        this.specialDomainName = specialDomainName;
        this.status = status;
        this.upgradedHttps = upgradedHttps;
        this.protections = protections;
        this.permissions = permissions;
        this.requestDetails = requestDetails;
        this.cookiePromptManagementStatus = cookiePromptManagementStatus;
        this.ctaScreens = ctaScreens;
        this.search = search;
        this.emailProtection = emailProtection;
        this.maliciousSiteStatus = maliciousSiteStatus;
        this.parentEntity = parentEntity;
        this.error = error;
        this.isInvalidCert = isInvalidCert;
    }
}

/**
 * @param {string} tabUrl
 * @param {boolean} upgradedHttps
 * @param {Protections} protections
 * @param {import('../../../../schema/__generated__/schema.types.js').RequestData} rawRequestData
 * @returns {TabData}
 */
export const createTabData = (tabUrl, upgradedHttps, protections, rawRequestData) => {
    let domain;
    try {
        domain = new URL(tabUrl).hostname.replace(/^www\./, '');
    } catch (e) {
        domain = 'unknown';
    }
    return {
        id: undefined,
        url: tabUrl,
        status: 'complete',
        upgradedHttps,
        specialDomainName: undefined,
        domain,
        protections,
        locale: null,
        requestDetails: createRequestDetails(rawRequestData.requests, rawRequestData.installedSurrogates || []),
        parentEntity: undefined,
        permissions: undefined,
        cookiePromptManagementStatus: undefined,
        ctaScreens: undefined,
        search: undefined,
        emailProtection: undefined,
        maliciousSiteStatus: undefined,
        isPendingUpdates: undefined,
        certificate: undefined,
        platformLimitations: undefined,
        error: undefined,
        isInvalidCert: undefined,
    };
};

/**
 * From a list of requests, form the grouped RequestData object
 * @param {import('../../../../schema/__generated__/schema.types.js').DetectedRequest[]} requests
 * @param {string[]} installedSurrogates
 * @returns {RequestDetails}
 */
export function createRequestDetails(requests, installedSurrogates) {
    const output = new RequestDetails(installedSurrogates);
    for (const request of requests) {
        // an overall list
        output.all.addRequest(request);

        // the blocked list
        if ('blocked' in request.state) {
            output.blocked.addRequest(request);
        }

        // all other requests
        if ('allowed' in request.state) {
            const reason = request.state.allowed.reason;
            if (reason in output.allowed) {
                output.allowed[request.state.allowed.reason].addRequest(request);
            }
        }
    }
    return output;
}

/**
 * @param {any} json
 * @returns {RequestDetails}
 * @throws {ZodError}
 */
export function fromJson(json) {
    const requestData = requestDataSchema.parse(json);
    return createRequestDetails(requestData.requests, requestData.installedSurrogates || []);
}

/**
 * @param {any} inputs
 * @throws {ZodError}
 */
export function fromMultiJson(...inputs) {
    const requests = [];
    const installedSurrogates = [];
    for (const input of inputs) {
        const requestData = requestDataSchema.parse(input);
        requests.push(...requestData.requests);
        installedSurrogates.push(...(requestData.installedSurrogates || []));
    }
    return createRequestDetails(requests, installedSurrogates);
}

export class AggregatedCompanyResponseData {
    /** @type {number} */
    entitiesCount = 0;
    /** @type {number} */
    requestCount = 0;
    /** @type {Record<string, AggregateCompanyData>} */
    entities = {};

    /**
     * @param {import('../../../../schema/__generated__/schema.types.js').DetectedRequest} request
     */
    addRequest(request) {
        let hostname;
        try {
            hostname = new URL(request.url).hostname;
        } catch (e) {
            hostname = request.url;
        }

        let displayName;
        const urlHostname = hostname.replace(/^www\./, '');

        if (request.entityName) {
            // if 'entityName' + 'eTLDplus1' match, just use 'request.eTLDplus1' un-modified
            if (request.entityName === request.eTLDplus1) {
                displayName = request.eTLDplus1;
            } else {
                displayName = removeTLD(request.entityName);
            }
        } else {
            displayName = request.eTLDplus1 || request.url;
        }

        if (!this.entities[displayName]) {
            this.entities[displayName] = new AggregateCompanyData(request.ownerName, displayName, request.prevalence ?? 0);
        }

        this.entities[displayName].addUrl(urlHostname, request.category);

        this.entitiesCount = Object.keys(this.entities).length;
        this.requestCount += 1;
    }

    /**
     * Returns a list of AggregateCompanyData sorted by the entity prevalence
     * @returns {AggregateCompanyData[]}
     */
    sortedByPrevalence() {
        return [...Object.values(this.entities)].sort((a, b) => b.prevalence - a.prevalence);
    }
}

/**
 * This list represents every possible state that the 'request data' can be in.
 * Use this list to determine which text/icons to display in certain situations.
 */
export const states = /** @type {const} */ ({
    /* 01 */ protectionsOn: 'protectionsOn',
    /* 02 */ protectionsOn_blocked: 'protectionsOn_blocked',
    /* 03 */ protectionsOn_blocked_allowedTrackers: 'protectionsOn_blocked_allowedTrackers',
    /* 04 */ protectionsOn_blocked_allowedNonTrackers: 'protectionsOn_blocked_allowedNonTrackers',
    /* 05 */ protectionsOn_blocked_allowedTrackers_allowedNonTrackers: 'protectionsOn_blocked_allowedTrackers_allowedNonTrackers',
    /* 06 */ protectionsOn_allowedTrackers: 'protectionsOn_allowedTrackers',
    /* 07 */ protectionsOn_allowedNonTrackers: 'protectionsOn_allowedNonTrackers',
    /* 08 */ protectionsOn_allowedTrackers_allowedNonTrackers: 'protectionsOn_allowedTrackers_allowedNonTrackers',
    /* 09 */ protectionsOn_allowedFirstParty: 'protectionsOn_allowedFirstParty',
    /* 010 */ protectionsOn_allowedFirstParty_allowedNonTrackers: 'protectionsOn_allowedFirstParty_allowedNonTrackers',
    /* 011 */ protectionsOff: 'protectionsOff',
    /* 012 */ protectionsOff_allowedTrackers: 'protectionsOff_allowedTrackers',
    /* 013 */ protectionsOff_allowedNonTrackers: 'protectionsOff_allowedNonTrackers',
    /* 014 */ protectionsOff_allowedTrackers_allowedNonTrackers: 'protectionsOff_allowedTrackers_allowedNonTrackers',
});

/**
 * This is the data format that the UI can use to render sections
 */
export class RequestDetails {
    surrogates;
    all = new AggregatedCompanyResponseData();
    blocked = new AggregatedCompanyResponseData();
    allowed = {
        adClickAttribution: new AggregatedCompanyResponseData(),
        ownedByFirstParty: new AggregatedCompanyResponseData(),
        ruleException: new AggregatedCompanyResponseData(),
        protectionDisabled: new AggregatedCompanyResponseData(),
        otherThirdPartyRequest: new AggregatedCompanyResponseData(),
    };

    /**
     * @param {string[]} surrogates - any installed surrogates, just the domains
     */
    constructor(surrogates) {
        this.surrogates = surrogates;
    }

    /**
     * Loop over every seen entity
     * @param {(entity: AggregateCompanyData) => void} fn
     */
    forEachEntity(fn) {
        for (const entity of Object.values(this.all.entities)) {
            fn(entity);
        }
    }

    /**
     * @returns {number}
     */
    blockedCount() {
        return this.blocked.entitiesCount;
    }

    /**
     * The number of entities observed that had 'special' requests.
     *
     * 'special' means that a request was classified as a tracker, but we didn't block it
     * for any given reason. Note: This list excludes 'non-special' requests such as 3rd party
     * requests not classified as trackers
     *
     * @returns {number}
     */
    allowedSpecialCount() {
        return (
            this.allowed.adClickAttribution.entitiesCount +
            this.allowed.ownedByFirstParty.entitiesCount +
            this.allowed.ruleException.entitiesCount +
            this.allowed.protectionDisabled.entitiesCount
        );
    }

    /**
     * The number of entities observed that had 'non-special' requests.
     *
     * 'non-special' means a request that was observed, but it was *not* classified as a tracker
     *
     * @returns {number}
     */
    allowedNonSpecialCount() {
        return this.allowed.otherThirdPartyRequest.entitiesCount;
    }

    /**
     * The number of entities observed that were owned by the first party website
     */
    allowedFirstPartyCount() {
        return this.allowed.ownedByFirstParty.entitiesCount;
    }

    /**
     * When all the 'special' entities observed belong to the first party
     */
    allowedFirstPartyOnly() {
        return this.allowedFirstPartyCount() > 0 && this.allowedFirstPartyCount() === this.allowedSpecialCount();
    }

    /**
     * Create a list of company names, excluding any 'unknown' ones.
     * @returns {string[]}
     */
    blockedCompanyNames() {
        /** @type {AggregateCompanyData[]} */
        const output = [];

        for (const entity of Object.values(this.blocked.entities)) {
            if (entity.name === 'unknown') continue;
            output.push(entity);
        }

        return output.sort((a, b) => b.prevalence - a.prevalence).map((entity) => entity.displayName);
    }

    /**
     * @param {boolean} protectionsEnabled
     * @param {(keyof states & string)[]} states
     */
    matches(protectionsEnabled, states) {
        const curr = this.state(protectionsEnabled);
        return states.includes(curr);
    }

    /**
     * From the available request data, determine the global 'state' of the Request Data
     * @param {boolean} protectionsEnabled
     * @return {keyof states & string}
     */
    state(protectionsEnabled) {
        if (!protectionsEnabled) {
            if (this.allowedSpecialCount() > 0 && this.allowedNonSpecialCount() > 0) {
                return states.protectionsOff_allowedTrackers_allowedNonTrackers;
            }
            if (this.allowedNonSpecialCount() > 0) {
                return states.protectionsOff_allowedNonTrackers;
            }
            if (this.allowedSpecialCount() > 0) {
                return states.protectionsOff_allowedTrackers;
            }
            return states.protectionsOff;
        } else {
            if (this.blockedCount() > 0) {
                // with blocked trackers
                if (this.allowedSpecialCount() > 0 && this.allowedNonSpecialCount() > 0) {
                    return states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers;
                }
                if (this.allowedSpecialCount() > 0) {
                    return states.protectionsOn_blocked_allowedTrackers;
                }
                if (this.allowedNonSpecialCount() > 0) {
                    return states.protectionsOn_blocked_allowedNonTrackers;
                }
                return states.protectionsOn_blocked;
            } else {
                // first party trackers only
                if (this.allowedFirstPartyOnly()) {
                    if (this.allowedNonSpecialCount() > 0) {
                        return states.protectionsOn_allowedFirstParty_allowedNonTrackers;
                    }
                    return states.protectionsOn_allowedFirstParty;
                }
                // no trackers
                if (this.allowedSpecialCount() > 0 && this.allowedNonSpecialCount() > 0) {
                    return states.protectionsOn_allowedTrackers_allowedNonTrackers;
                }
                if (this.allowedSpecialCount() > 0) {
                    return states.protectionsOn_allowedTrackers;
                }
                if (this.allowedNonSpecialCount() > 0) {
                    return states.protectionsOn_allowedNonTrackers;
                }
            }
            return states.protectionsOn;
        }
    }
}

export class AggregateCompanyData {
    /**
     * @param {string|undefined} name
     * @param {string} displayName
     * @param {number} prevalence
     */
    constructor(name, displayName, prevalence) {
        this.name = name;
        this.displayName = displayName;
        this.prevalence = prevalence;
        this.normalizedName = normalizeCompanyName(displayName);

        /** @type {Record<string, TrackerUrl>} */
        this.urls = {};
    }

    /**
     * @param {string} url
     * @param {string} [category]
     */
    addUrl(url, category) {
        this.urls[url] = new TrackerUrl(url, category);
    }
}

export class TrackerUrl {
    /**
     * @param {string} url
     * @param {string} [category]
     */
    constructor(url, category) {
        this.url = url;
        this.category = category;
    }
}
