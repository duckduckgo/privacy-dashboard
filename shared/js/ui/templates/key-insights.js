import html from 'nanohtml';
import raw from 'nanohtml/raw';
import { i18n } from '../base/localize.js';
import { normalizeCompanyName } from '../models/mixins/normalize-company-name.mjs';
import { getColorId } from './shared/utils.js';
import { duckDuckGoURLs } from '../../../data/constants.js';

const keyInsightsState = /** @type {const} */ ({
    /* 01 */ insecure: 'insecure',
    /* 02 */ broken: 'broken',
    /* 03 */ userAllowListed: 'userAllowListed',
    /* 04 */ majorTrackingNetwork: 'majorTrackingNetwork',
    /* 05 */ noneBlocked_someSpecialAllowed: 'noneBlocked_someSpecialAllowed',
    /* 06 */ noneBlocked: 'noneBlocked',
    /* 07 */ emptyCompaniesList: 'emptyCompaniesList',
    /* 08 */ blocked: 'blocked',
    /* 09 */ invalid: 'invalid',
    /* 10 */ noneBlocked_firstPartyAllowed: 'noneBlocked_firstPartyAllowed',
    /* 11 */ phishing: 'phishing',
    /* 12 */ malware: 'malware',
    /* 13 */ scam: 'scam',
});

/**
 * @param {import("../models/site.js").PublicSiteModel} modelOverride
 */
export function renderKeyInsight(modelOverride) {
    const model = modelOverride;
    const title = (text) => html`<h1 class="token-title-3-em">${text}</h1>`;
    const description = (text) => html`<div class="token-title-3"><span role="text">${text}</span></div>`;

    /** @type {keyInsightsState[keyof keyInsightsState]} */
    const state = (() => {
        if (model.httpsState === 'phishing') return keyInsightsState.phishing;
        if (model.httpsState === 'malware') return keyInsightsState.malware;
        if (model.httpsState === 'scam') return keyInsightsState.scam;
        if (model.httpsState === 'none') return keyInsightsState.insecure;
        if (model.httpsState === 'invalid') return keyInsightsState.invalid;
        if (model.isBroken) return keyInsightsState.broken;
        if (!model.protectionsEnabled) return keyInsightsState.userAllowListed;
        if (model.isaMajorTrackingNetwork && model.tab.parentEntity) return keyInsightsState.majorTrackingNetwork;
        // TODO: Can we refactor this?
        if (model.tab.requestDetails.blocked.requestCount === 0) {
            if (model.tab.requestDetails.allowedFirstPartyOnly()) {
                return keyInsightsState.noneBlocked_firstPartyAllowed;
            }
            if (model.tab.requestDetails.allowedSpecialCount() > 0) {
                return keyInsightsState.noneBlocked_someSpecialAllowed;
            }
            return keyInsightsState.noneBlocked;
        }
        const companyNames = model.tab.requestDetails.blockedCompanyNames();
        if (companyNames.length === 0) return keyInsightsState.emptyCompaniesList;
        return keyInsightsState.blocked;
    })();

    /** @type {Record<keyof keyInsightsState, any>} */
    return {
        insecure: () => {
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--insecure-connection"></div>
                    ${title(model.tab.domain)} ${description(raw(i18n.t('site:connectionDescriptionUnencrypted.title')))}
                </div>
            `;
        },
        invalid: () => {
            const text = i18n.t('site:connectionDescriptionInvalidCertificate.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--insecure-connection"></div>
                    ${title(model.tab.domain)} ${description(raw(text))}
                </div>
            `;
        },
        broken: () => {
            // prettier-ignore
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--protections-off"></div>
                    ${title(model.tab.domain)}
                </div>
            `
        },
        userAllowListed: () => {
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--protections-off"></div>
                    ${title(model.tab.domain)} ${description(raw(i18n.t('site:protectionsDisabled.title')))}
                </div>
            `;
        },
        majorTrackingNetwork: () => {
            const company = model.tab.parentEntity;

            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--tracker-network"></div>
                    ${title(model.tab.domain)}
                    ${description(
                        raw(
                            i18n.t('site:majorTrackingNetworkDesc.title', {
                                companyDisplayName: company?.displayName,
                                companyPrevalence: Math.round(company?.prevalence ?? 0),
                                blocked: model.tab.requestDetails.blocked.entitiesCount > 0,
                            })
                        )
                    )}
                </div>
            `;
        },
        noneBlocked_someSpecialAllowed: () => {
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--info"></div>
                    ${title(model.tab.domain)} ${description(i18n.t('site:trackerNetworksSummaryAllowedOnly.title'))}
                </div>
            `;
        },
        noneBlocked_firstPartyAllowed: () => {
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--no-activity"></div>
                    ${title(model.tab.domain)}
                    ${description(raw(i18n.t('site:trackerNetworksSummaryFirstPartyAllowedOnly.title', { domain: model.tab.domain })))}
                </div>
            `;
        },
        noneBlocked: () => {
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--no-activity"></div>
                    ${title(model.tab.domain)} ${description(raw(i18n.t('site:trackerNetworksSummaryNone.title')))}
                </div>
            `;
        },
        emptyCompaniesList: () => {
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--trackers-blocked"></div>
                    ${title(model.tab.domain)}
                    ${description(raw(i18n.t('site:trackersBlockedDesc.title', generateCompanyNamesList(model))))}
                </div>
            `;
        },
        blocked: () => {
            return html`
                <div class="key-insight key-insight--main">
                    ${renderCompanyIconsList(model)} ${title(model.tab.domain)}
                    ${description(raw(i18n.t('site:trackersBlockedDesc.title', generateCompanyNamesList(model))))}
                </div>
            `;
        },
        phishing: () => {
            const text = i18n.t('site:phishingWebsiteDesc.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--phishing"></div>
                    ${title(model.tab.domain)} ${description(raw(text))}
                    <div class="key-insight__link">
                        <a class="link-action link-action--text" href="${duckDuckGoURLs.phishingAndMalwareHelpPage}" target="_blank">
                            ${i18n.t('site:aboutPhishingLink.title')}
                        </a>
                    </div>
                </div>
            `;
        },
        malware: () => {
            const text = i18n.t('site:malwareWebsiteDesc.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--phishing"></div>
                    ${title(model.tab.domain)} ${description(raw(text))}
                    <div class="key-insight__link">
                        <a class="link-action link-action--text" href="${duckDuckGoURLs.phishingAndMalwareHelpPage}" target="_blank">
                            ${i18n.t('site:aboutMalwareLink.title')}
                        </a>
                    </div>
                </div>
            `;
        },
        scam: () => {
            const text = i18n.t('site:scamWebsiteDesc.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    <div class="key-insight__icon hero-icon--scam"></div>
                    ${title(model.tab.domain)} ${description(raw(text))}
                    <div class="key-insight__link">
                        <a class="link-action link-action--text" href="${duckDuckGoURLs.phishingAndMalwareHelpPage}" target="_blank">
                            ${i18n.t('site:aboutScamLink.title')}
                        </a>
                    </div>
                </div>
            `;
        },
    }[state]();
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function generateCompanyNamesList(model) {
    // const companyNames = model.tab.requestDetails.companyNames();
    const blockedCompanyNames = model.tab.requestDetails.blockedCompanyNames();
    return {
        companyCount: blockedCompanyNames.length,
        othersCount: blockedCompanyNames.length - 4,
        firstCompany: blockedCompanyNames[0],
        secondCompany: blockedCompanyNames[1],
        thirdCompany: blockedCompanyNames[2],
        fourthCompany: blockedCompanyNames[3],
    };
}
/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderCompanyIconsList(model) {
    const companyNames = model.tab.requestDetails.blockedCompanyNames();

    if (companyNames.length === 0) return '';

    const topCompanies = companyNames.slice(0, 4);
    const remainingCount = companyNames.length - topCompanies.length;

    const items = ['large', 'medium', 'medium', 'small', 'small'];
    const positions = {
        1: [1],
        2: [2, 1],
        3: [2, 1, 3],
        4: [3, 2, 4, 1],
        5: [3, 2, 4, 1, 5],
    };

    /**
     * @type {Array<{
     *   kind: "icon",
     *   slug: string,
     *   colorId: number,
     *   letter: string,
     *   size: string,
     * } | { kind: 'more', count: number, size: string }>}
     */
    const processed = topCompanies.map((name, index) => {
        const slug = normalizeCompanyName(name);
        return {
            kind: 'icon',
            slug,
            colorId: getColorId(slug),
            letter: slug[0].toUpperCase(),
            size: items[index],
        };
    });

    if (remainingCount > 0) {
        processed.push({
            kind: 'more',
            count: remainingCount,
            size: items[4],
        });
    }

    const positionMap = positions[processed.length];

    const list = processed.map((item, index) => {
        if (item.kind === 'icon') {
            return html`
                <span class="icon-list__item" style="order: ${positionMap[index]}" data-company-icon-position=${positionMap[index]}>
                    <span class="icon-list__wrapper" data-company-icon-size=${item.size}>
                        <span class="icon-list__icon ${item.letter} color-${item.colorId} ${item.slug}"></span>
                        <span class="icon-list__blocked-icon"> ${blockSvg()} </span>
                    </span>
                </span>
            `;
        }
        return html`
            <span class='icon-list__item' style='order: ${positionMap[index]}' data-company-icon-position='${positionMap[index]}'>
                <span class='icon-list__wrapper icon-list__wrapper--count'
                    data-company-icon-size='${item.size}'>
                    <span class='icon-list__count'>+${item.count}</span>
                </span>
            </div>`;
    });

    return html`
        <div class="key-insight__icon icon-list" data-company-count="${processed.length}" aria-label="List of Blocked Company Icons">
            ${list}
        </div>
    `;
}

function blockSvg() {
    return html`
        <svg viewBox="0 0 32 32" fill="none">
            <circle fill="white" cx="16" cy="16" r="15" />
            <path
                fill="#EE1025"
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM24 16C24 20.4183 20.4183 24 16 24C14.5164 24 13.1271 23.5961 11.9361 22.8924L22.8924 11.9361C23.5961 13.1271 24 14.5164 24 16ZM9.10763 20.0639L20.0639 9.10763C18.8729 8.40386 17.4836 8 16 8C11.5817 8 8 11.5817 8 16C8 17.4836 8.40386 18.8729 9.10763 20.0639Z"
            />
        </svg>
    `;
}
