import bel from 'bel'
import { displayCategories } from '../../../data/constants'
import { i18n } from '../base/localize.es6'
import { heroFromTabTrackers, topNav } from './shared/hero.es6.js'
import { getColorId } from './shared/utils.es6.js'
import { platformLimitations } from './shared/platform-limitations'

/** @this {{ model: { site: import('../models/site.es6.js').PublicSiteModel }}} */
export function trackerNetworksTemplate () {
    if (!this.model) {
        return bel`<section class="sliding-subview"></section>`
    }

    const sections = sectionsFromSiteTrackers(this.model.site)
    const hero = heroFromTabTrackers(this.model.site.tab.requestDetails, this.model.site.protectionsEnabled)

    return bel`
    <div class="site-info card">
        ${topNav()}
        <div class="padded-sides js-tracker-networks-hero">
            ${hero}
        </div>
        <div class="padded-sides js-tracker-networks-details">
            ${sections}
        </div>
        ${this.model.site.tab.platformLimitations ? platformLimitations() : null}
    </div>`
}

/**
 * This is exported so that the allowedRequests UI can re-use the template
 * @param {string} name
 * @param {any} heading
 * @param {any[]} companiesList
 * @param {boolean | undefined} bordered
 */
export function trackerListWrapper (name, heading, companiesList, bordered) {
    return bel`
        <ol class="default-list site-info__trackers__company-list ${bordered ? 'border--top' : ''}" 
             aria-label="List of tracker networks">
            ${heading
        ? bel`<li class="section-list-header" data-test-id="sectionHeading">${heading}</li>`
        : bel``
}
            ${companiesList}
        </ol>
    `
}

/**
 * @param {import("../../browser/utils/request-details.js").AggregateCompanyData} company
 */
export function renderCompany (company) {
    if (company.displayName && company.displayName === 'unknown') {
        company.displayName = `(${i18n.t('site:trackerNetworkUnknown.title')})`
    }
    const slug = company.normalizedName

    return bel`<li class="site-info__trackers__company-list-item" data-test-id="entityListItem">
        <h1 title="${company.name || company.displayName}" class="site-info__domain block token-title-3-em" data-test-id="entityTitle">
            <span class="site-info__tracker__icon site-info__tracker__icon--company ${slug[0].toUpperCase()} color-${getColorId(slug)} ${slug}"></span>
            ${company.displayName}
        </h1>
        <ol class="default-list site-info__trackers__company-list__url-list" aria-label="${i18n.t('site:trackerDomainsForCompany.title', { companyName: company.displayName })}">
            ${Object.keys(company.urls).map((urlHostname) => {
        const url = company.urls[urlHostname]
        const matched = displayCategories[url.category]
        return bel`
                <li data-test-id="entityUrlListItem" class="url-list-item">
                    <div class="url" title="${urlHostname}">${urlHostname}</div>
                    ${matched ? bel`<div class="category">${i18n.t(matched)}</div>` : ''}
                </li>`
    })}
        </ol>
    </li>`
}

/**
 * @param {{
 *  heading: () => any | null,
 *  companies: import("../../browser/utils/request-details.js").AggregateCompanyData[],
 *  name: string,
 *  bordered?: boolean,
 *  }[]} sections
 */
export function renderSections (sections) {
    const output = sections
        // exclude all empty lists
        .filter(section => section.companies.length > 0)
        // convert each 'section' into a heading + list of companies
        .map((section) => {
            const companiesList = section.companies.map((company) => renderCompany(company))
            const sectionHeading = section.heading()
            return trackerListWrapper(section.name, sectionHeading, companiesList, section.bordered)
        })

    return output
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 */
export function sectionsFromSiteTrackers (site) {
    const { blocked } = site.tab.requestDetails
    const sections = renderSections([
        {
            name: 'blocked',
            heading: () => null,
            companies: blocked.sortedByPrevalence(),
            bordered: true
        }
    ])
    return sections
}
