import html from 'nanohtml';
import { displayCategories } from '../../../data/constants';
import { i18n } from '../base/localize.js';
import { heroFromTabTrackers } from './shared/hero.js';
import { getColorId } from './shared/utils.js';
import { platformLimitations } from './shared/platform-limitations';
import { topNav } from './shared/top-nav';

/** @this {{ model: { site: import('../models/site.js').PublicSiteModel }}} */
export function trackerNetworksTemplate() {
    if (!this.model) {
        return html`<section class="sliding-subview"></section>`;
    }

    const sections = sectionsFromSiteTrackers(this.model.site);
    const hero = heroFromTabTrackers(this.model.site.tab.requestDetails, this.model.site.protectionsEnabled);
    const limitations = this.model.site.tab.platformLimitations
        ? html`<div class="padding-x-double">${platformLimitations()}</div>`
        : html`<div></div>`;

    return html` <div class="site-info card page-inner" data-page="trackers">
        ${topNav({ view: 'secondary' })}
        <div class="padding-x-double js-tracker-networks-hero">${hero}</div>
        <div class="padding-x-double js-tracker-networks-details" aria-label="List of Tracker Companies">${sections}</div>
        ${limitations}
    </div>`;
}

/**
 * This is exported so that the allowedRequests UI can re-use the template
 * @param {string} name
 * @param {any} heading
 * @param {any[]} companiesList
 * @param {boolean | undefined} bordered
 */
export function trackerListWrapper(name, heading, companiesList, bordered) {
    return html`
        <ol class="default-list site-info__trackers__company-list ${bordered ? 'border--top' : ''}" aria-label="List of tracker networks">
            ${heading ? html`<li class="section-list-header" data-section-name=${name}>${heading}</li>` : html``} ${companiesList}
        </ol>
    `;
}

/**
 * @param {import("../../browser/utils/request-details.mjs").AggregateCompanyData} company
 */
export function renderCompany(company) {
    if (company.displayName && company.displayName === 'unknown') {
        company.displayName = `(${i18n.t('site:trackerNetworkUnknown.title')})`;
    }
    const slug = company.normalizedName;
    const title = company.name || company.displayName;
    const titleClasses = [
        'site-info__tracker__icon',
        'site-info__tracker__icon--company',
        slug[0].toUpperCase(),
        'color-' + getColorId(slug),
        slug,
    ];
    const listLabel = i18n.t('site:trackerDomainsForCompany.title', {
        companyName: company.displayName,
    });

    return html`<li class="site-info__trackers__company-list-item">
        <p title=${title} class="site-info__domain block token-title-3-em">
            <span class=${titleClasses.join(' ')}></span>
            ${company.displayName}
        </p>
        <ol class="default-list site-info__trackers__company-list__url-list" aria-label=${listLabel}>
            ${Object.keys(company.urls).map((urlHostname) => {
                const url = company.urls[urlHostname];
                const matched = displayCategories[url.category];
                return html` <li class="url-list-item">
                    <p class="url" title=${urlHostname}>${urlHostname}</p>
                    ${matched ? html`<div class="category">${i18n.t(matched)}</div>` : ''}
                </li>`;
            })}
        </ol>
    </li>`;
}

/**
 * @param {{
 *  heading: () => any | null,
 *  companies: import("../../browser/utils/request-details.mjs").AggregateCompanyData[],
 *  name: string,
 *  bordered?: boolean,
 *  }[]} sections
 */
export function renderSections(sections) {
    const output = sections
        // exclude all empty lists
        .filter((section) => section.companies.length > 0)
        // convert each 'section' into a heading + list of companies
        .map((section) => {
            const companiesList = section.companies.map((company) => renderCompany(company));
            const sectionHeading = section.heading();
            return trackerListWrapper(section.name, sectionHeading, companiesList, section.bordered);
        });

    return output;
}

/**
 * @param {import('../models/site.js').PublicSiteModel} site
 */
export function sectionsFromSiteTrackers(site) {
    const { blocked } = site.tab.requestDetails;
    const sections = renderSections([
        {
            name: 'blocked',
            heading: () => null,
            companies: blocked.sortedByPrevalence(),
            bordered: true,
        },
    ]);
    return sections;
}
