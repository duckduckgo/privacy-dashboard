import bel from 'bel'
import { ns } from '../base/localize.es6.js'
import { states } from '../../browser/utils/request-details.mjs'
import { heroFromTabNonTrackers } from './shared/hero.es6.js'
import { renderSections } from './page-trackers.es6.js'
import { adAttributionLink } from './shared/links'
import { platformLimitations } from './shared/platform-limitations'
import { topNav } from './shared/top-nav'

/** @this {{ model: { site: import('../models/site.es6.js').PublicSiteModel }}} */
export function nonTrackersTemplate() {
    if (!this.model) {
        return bel`<section class="sliding-subview"></section>`
    }

    const sections = sectionsFromSiteNonTracker(this.model.site)
    const hero = heroFromTabNonTrackers(this.model.site.tab.requestDetails, this.model.site.protectionsEnabled)
    const limitations = this.model.site.tab.platformLimitations
        ? bel`<div class="padding-x-double">${platformLimitations()}</div>`
        : bel`<div></div>`

    return bel`
    <div class="site-info card page-inner" data-page='non-trackers'>
        ${topNav({ view: 'secondary' })}
        <div class="padding-x-double js-tracker-networks-hero">
            ${hero}
        </div>
        <div class="padding-x-double js-tracker-networks-details">
            ${sections}
        </div>
        ${limitations}
    </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 */
export function sectionsFromSiteNonTracker(site) {
    const requestDetails = site.tab.requestDetails
    const onlyAllowedNonTrackers = requestDetails.matches(site.protectionsEnabled, [
        states.protectionsOn_allowedNonTrackers,
        states.protectionsOff_allowedNonTrackers,
        states.protectionsOn_blocked_allowedNonTrackers,
    ])

    // when protections are protectionsOff, we just show every request
    if (!site.protectionsEnabled) {
        return renderSections([
            {
                name: 'protectionsDisabled',
                heading: () => ns.site('sectionHeadingProtectionsDisabled.title'),
                companies: requestDetails.all.sortedByPrevalence(),
                bordered: false,
            },
        ])
    }

    // when protections are ON, render all sections
    return renderSections([
        {
            name: 'adAttribution',
            heading: () => bel`
                <div>
                    <p>${ns.site('sectionHeadingAdAttribution.title', { domain: site.tab.domain })}</p>
                    ${adAttributionLink()}
                </div>
                `,
            companies: requestDetails.allowed.adClickAttribution.sortedByPrevalence(),
        },
        {
            name: 'ignored (rule exceptions)',
            heading: () => ns.site('sectionHeadingIgnore.title'),
            companies: requestDetails.allowed.ruleException.sortedByPrevalence(),
        },
        {
            name: 'firstParty',
            heading: () => ns.site('sectionHeadingFirstParty.title', { domain: site.tab.domain }),
            companies: requestDetails.allowed.ownedByFirstParty.sortedByPrevalence(),
        },
        {
            name: 'thirdParty',
            heading: () => {
                // don't display the header if the only allowed requests are non-trackers
                if (onlyAllowedNonTrackers) {
                    return null
                }
                return ns.site('sectionHeadingThirdParty.title')
            },
            companies: requestDetails.allowed.otherThirdPartyRequest.sortedByPrevalence(),
            bordered: onlyAllowedNonTrackers,
        },
    ])
}
