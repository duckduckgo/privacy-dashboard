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
    const title = (text) => html`<h1 class="key-insight__domain">${text}</h1>`;
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
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--insecure-connection"></div>
                    ${description(raw(i18n.t('site:connectionDescriptionUnencrypted.title')))}
                </div>
            `;
        },
        invalid: () => {
            const text = i18n.t('site:connectionDescriptionInvalidCertificate.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--insecure-connection"></div>
                    ${description(raw(text))}
                </div>
            `;
        },
        broken: () => {
            // prettier-ignore
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--protections-off"></div>
                </div>
            `
        },
        userAllowListed: () => {
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--protections-off"></div>
                    ${description(raw(i18n.t('site:protectionsDisabled.title')))}
                </div>
            `;
        },
        majorTrackingNetwork: () => {
            const company = model.tab.parentEntity;

            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--tracker-network"></div>
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
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--info"></div>
                    ${description(i18n.t('site:trackerNetworksSummaryAllowedOnly.title'))}
                </div>
            `;
        },
        noneBlocked_firstPartyAllowed: () => {
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--no-activity"></div>
                    ${description(raw(i18n.t('site:trackerNetworksSummaryFirstPartyAllowedOnly.title', { domain: model.tab.domain })))}
                </div>
            `;
        },
        noneBlocked: () => {
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--no-activity"></div>
                    ${description(raw(i18n.t('site:trackerNetworksSummaryNone.title')))}
                </div>
            `;
        },
        emptyCompaniesList: () => {
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--trackers-blocked"></div>
                    ${description(raw(i18n.t('site:trackersBlockedDesc.title', generateCompanyNamesList(model))))}
                </div>
            `;
        },
        blocked: () => {
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)} ${renderCompanyIconsList(model)}
                    ${description(raw(i18n.t('site:trackersBlockedDesc.title', generateCompanyNamesList(model))))}
                </div>
            `;
        },
        phishing: () => {
            const text = i18n.t('site:phishingWebsiteDesc.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--malicious"></div>
                    ${description(raw(text))}
                    <div class="key-insight__link">
                        <a class="link-action link-action--text" href="${duckDuckGoURLs.phishingAndMalwareHelpPage}" target="_blank">
                            ${i18n.t('site:aboutScamBlockerLink.title')}
                        </a>
                    </div>
                </div>
            `;
        },
        malware: () => {
            const text = i18n.t('site:malwareWebsiteDesc.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--malicious"></div>
                    ${description(raw(text))}
                    <div class="key-insight__link">
                        <a class="link-action link-action--text" href="${duckDuckGoURLs.phishingAndMalwareHelpPage}" target="_blank">
                            ${i18n.t('site:aboutScamBlockerLink.title')}
                        </a>
                    </div>
                </div>
            `;
        },
        scam: () => {
            const text = i18n.t('site:scamWebsiteDesc.title', { domain: model.tab.domain });
            return html`
                <div class="key-insight key-insight--main">
                    ${title(model.tab.domain)}
                    <div class="key-insight__icon hero-icon--malicious"></div>
                    ${description(raw(text))}
                    <div class="key-insight__link">
                        <a class="link-action link-action--text" href="${duckDuckGoURLs.phishingAndMalwareHelpPage}" target="_blank">
                            ${i18n.t('site:aboutScamBlockerLink.title')}
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
 * Logo slots on the static hero illustration (brand refresh), per number of companies shown.
 * Slot names: tl = top-left (largest), tr = top-right, bl = bottom-left, br = bottom-right (smallest).
 * Fill order from the design spec: tl → br → tr → bl, so the first blocked company always takes the largest slot.
 * Positions and matrices live in `_icon-list.scss` and must match the coin holes in the illustration (`hero-blocked-*.png`),
 * which sits on top of the logos and draws the strike.
 */
const heroSlots = /** @type {const} */ ({
    1: ['tl'],
    2: ['tl', 'br'],
    3: ['tl', 'br', 'tr'],
    4: ['tl', 'br', 'tr', 'bl'],
});

/**
 * Visible text of the "+N" pill: the number of blocked companies not shown as logos, capped at "99+".
 * @param {number} count - 1 or more
 * @returns {string}
 */
export function heroMoreLabel(count) {
    return count > 99 ? '99+' : `+${count}`;
}

/**
 * The hero is decoration: if it fails on unexpected data, drop it and keep the rest of the primary screen
 * (domain, description, list, toggle) usable.
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderCompanyIconsList(model) {
    try {
        return renderHero(model);
    } catch (e) {
        console.error('blocked-trackers hero failed to render', e);
        return '';
    }
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderHero(model) {
    const companyNames = model.tab.requestDetails.blockedCompanyNames();

    if (companyNames.length === 0) return '';

    const topCompanies = companyNames.slice(0, 4);
    const remainingCount = companyNames.length - topCompanies.length;
    const slots = heroSlots[topCompanies.length];
    const variant = remainingCount > 0 ? '4plus' : String(topCompanies.length);

    const icons = topCompanies.map((name, index) => {
        const slug = normalizeCompanyName(name);
        // a name with no latin letters (e.g. "Яндекс") normalises to "": no letter class, the plain coloured circle shows
        const letter = slug ? slug[0].toUpperCase() : '';
        return html`
            <span class="hero-blocked__slot hero-blocked__slot--${slots[index]}" data-company-icon-position=${index + 1}>
                <span class="icon-list__icon ${letter} color-${getColorId(slug)} ${slug}"></span>
            </span>
        `;
    });

    // the pill shows only the number (no text to translate, no truncation); screen readers get the full sentence
    const more =
        remainingCount > 0
            ? html`<span
                  class="hero-blocked__more token-body-em"
                  role="img"
                  aria-label=${i18n.t('site:trackersBlockedMoreCompanies.title', { count: remainingCount })}
                  >${heroMoreLabel(remainingCount)}</span
              >`
            : '';

    return html`
        <div
            class="key-insight__icon hero-blocked"
            data-company-count="${topCompanies.length}"
            data-hero-variant="${variant}"
            aria-label="List of Blocked Company Icons"
        >
            ${icons} ${more}
        </div>
    `;
}
