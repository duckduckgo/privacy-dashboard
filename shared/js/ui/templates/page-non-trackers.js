import html from 'nanohtml';
import { ns } from '../base/localize.js';
import { states } from '../../browser/utils/request-details.mjs';
import { renderSections } from './page-trackers.js';
import { adAttributionLink } from './shared/links';

/**
 * @param {import('../models/site.js').PublicSiteModel} site
 */
export function sectionsFromSiteNonTracker(site) {
    const requestDetails = site.tab.requestDetails;
    const onlyAllowedNonTrackers = requestDetails.matches(site.protectionsEnabled, [
        states.protectionsOn_allowedNonTrackers,
        states.protectionsOff_allowedNonTrackers,
        states.protectionsOn_blocked_allowedNonTrackers,
    ]);

    // when protections are protectionsOff, we just show every request
    if (!site.protectionsEnabled) {
        return renderSections([
            {
                name: 'protectionsDisabled',
                heading: () => ns.site('sectionHeadingProtectionsDisabled.title'),
                companies: requestDetails.all.sortedByPrevalence(),
                bordered: false,
            },
        ]);
    }

    // when protections are ON, render all sections
    return renderSections([
        {
            name: 'adAttribution',
            heading: () => html`
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
                    return null;
                }
                return ns.site('sectionHeadingThirdParty.title');
            },
            companies: requestDetails.allowed.otherThirdPartyRequest.sortedByPrevalence(),
            bordered: onlyAllowedNonTrackers,
        },
    ]);
}
