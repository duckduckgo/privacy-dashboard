import bel from 'bel'
import { ns } from '../base/localize.es6.js'
import { states } from '../../browser/utils/request-details'
import { largeHeroIcon, topNav } from './shared/hero.es6.js'
import { renderSections } from './tracker-networks.es6'
import { thirdpartySummary, thirdpartyHeroIcon } from './shared/thirdparty-text.es6'
import { aboutLink, adAttributionLink } from './shared/about-link'
import { platformLimitations } from './shared/platform-limitations'

/** @this {{ model: { site: import('../models/site.es6.js').PublicSiteModel }}} */
export function nonTrackersTemplate () {
    if (!this.model) {
        return bel`<section class="sliding-subview"></section>`
    }

    const summary = thirdpartySummary(this.model.site.tab.requestDetails, this.model.site.protectionsEnabled)

    return bel`<div class="tracker-networks site-info card" data-test-id="non-tracker-list-view">
        <div class="js-tracker-networks-hero">
            ${topNav()}
            ${renderHero(this.model.site)}
        </div>
        <div class="tracker-networks__explainer text--center">
            <p data-test-id="thirdPartySubView.summary" class="token-title-3">${summary}</p>
            <p>${aboutLink()}</p>
        </div>
        <div class="tracker-networks__details padded-sides js-tracker-networks-details">
            ${renderNonTrackerDetails(this.model.site)}
        </div>
        ${this.model.site.tab.platformLimitations ? platformLimitations() : null}
    </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 */
function renderHero (site) {
    const icon = thirdpartyHeroIcon(site.tab.requestDetails, site.protectionsEnabled)
    return bel`${largeHeroIcon({
        status: icon,
    })}`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 */
function renderNonTrackerDetails (site) {
    const requestDetails = site.tab.requestDetails
    const onlyAllowedNonTrackers = requestDetails.matches(site.protectionsEnabled, [
        states.protectionsOn_allowedNonTrackers,
        states.protectionsOff_allowedNonTrackers,
        states.protectionsOn_blocked_allowedNonTrackers
    ])

    // when protections are protectionsOff, we just show every request
    if (!site.protectionsEnabled) {
        return renderSections([
            {
                name: 'protectionsDisabled',
                heading: () => null,
                companies: requestDetails.all.sortedByPrevalence(),
                bordered: true
            }
        ])
    }

    // when protections are ON, render all sections
    return renderSections([
        {
            name: 'adAttribution',
            heading: () => bel`
                <div>
                    <p>${ns.site('sectionHeadingAdAttribution.title', { domain: site.tab.domain })}</p>
                    <p class="padded--top-half">${adAttributionLink()}</p>
                </div>
                `,
            companies: requestDetails.allowed.adClickAttribution.sortedByPrevalence()
        },
        {
            name: 'ignored (rule exceptions)',
            heading: () => ns.site('sectionHeadingIgnore.title'),
            companies: requestDetails.allowed.ruleException.sortedByPrevalence()
        },
        {
            name: 'firstParty',
            heading: () => ns.site('sectionHeadingFirstParty.title', { domain: site.tab.domain }),
            companies: requestDetails.allowed.ownedByFirstParty.sortedByPrevalence()
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
            bordered: onlyAllowedNonTrackers
        }
    ])
}
