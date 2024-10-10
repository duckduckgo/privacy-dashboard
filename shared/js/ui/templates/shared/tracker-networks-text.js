import { states } from '../../../browser/utils/request-details.mjs'
import { ns } from '../../base/localize.js'

/**
 * @param {import("../../../browser/utils/request-details.mjs").RequestDetails} requestDetails
 * @param {any} protectionsEnabled
 * @returns {{title: string, icon: string}}
 */
export function trackerNetworksText(requestDetails, protectionsEnabled, phishingDetected) {
    const state = requestDetails.state(protectionsEnabled)
    const title = ns.site('trackerNetworksDesc.title')
    let icon = 'info'

    if (phishingDetected) {
        icon = 'info'
    } else {
        switch (state) {
            case states.protectionsOn_blocked:
            case states.protectionsOn_blocked_allowedTrackers:
            case states.protectionsOn_blocked_allowedNonTrackers:
            case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
                icon = 'blocked'
                break
            case states.protectionsOff_allowedTrackers:
            case states.protectionsOff_allowedTrackers_allowedNonTrackers:
                icon = 'warning'
                break
            case states.protectionsOn:
            case states.protectionsOff:
            case states.protectionsOn_allowedNonTrackers:
            case states.protectionsOff_allowedNonTrackers:
                icon = 'blocked'
                break
            default:
                unreachable(state)
        }
    }

    return {
        title,
        icon,
    }
}

/**
 * @param {import("../../../browser/utils/request-details.mjs").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 */
export function trackerNetworkSummary(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
        case states.protectionsOn:
        case states.protectionsOff:
        case states.protectionsOn_allowedNonTrackers:
        case states.protectionsOff_allowedNonTrackers: {
            return ns.site('trackerNetworksSummaryNoneFound.title')
        }
        case states.protectionsOn_allowedTrackers:
        case states.protectionsOn_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_allowedFirstParty:
        case states.protectionsOn_allowedFirstParty_allowedNonTrackers: {
            return ns.site('trackerNetworksSummaryNoneBlocked.title')
        }
        case states.protectionsOff_allowedTrackers:
        case states.protectionsOff_allowedTrackers_allowedNonTrackers:
            return ns.site('trackerNetworksSummaryProtectionsOff.title')
        default:
            return ns.site('trackerNetworksSummaryBlocked.title')
    }
}

/**
 * @param {import("../../../browser/utils/request-details.mjs").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 * @returns {string}
 */
export function trackerNetworksHeroIcon(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
        case states.protectionsOn:
        case states.protectionsOff:
        case states.protectionsOff_allowedNonTrackers:
        case states.protectionsOn_allowedNonTrackers: {
            return 'major-networks-no-activity'
        }
        case states.protectionsOn_allowedTrackers:
        case states.protectionsOn_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_allowedFirstParty:
        case states.protectionsOn_allowedFirstParty_allowedNonTrackers: {
            return 'major-networks-info'
        }
        case states.protectionsOff_allowedTrackers:
        case states.protectionsOff_allowedTrackers_allowedNonTrackers: {
            return 'major-networks-warning'
        }
        case states.protectionsOn_blocked_allowedTrackers:
        case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_blocked:
        case states.protectionsOn_blocked_allowedNonTrackers: {
            return 'major-networks-blocked'
        }
        default:
            return unreachable(state)
    }
}

/**
 * @param {never} x
 * @returns {never}
 */
function unreachable(x) {
    throw new Error("Didn't expect to get here with value" + x)
}
