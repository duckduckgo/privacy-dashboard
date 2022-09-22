import { states } from '../../../browser/utils/request-details'
import { ns } from '../../base/localize.es6'

/**
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {any} protectionsEnabled
 * @returns {{title: string, icon: string}}
 */
export function trackerNetworksText (requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
    case states.protectionsOn_blocked:
    case states.protectionsOn_blocked_allowedNonTrackers: {
        return {
            title: ns.site('trackerNetworksDesc.title'),
            icon: 'blocked'
        }
    }
    case states.protectionsOn_blocked_allowedTrackers:
    case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers: {
        return {
            title: ns.site('trackerNetworksDesc.title'),
            icon: 'info'
        }
    }
    case states.protectionsOn_allowedTrackers_allowedNonTrackers:
    case states.protectionsOn_allowedTrackers: {
        return {
            title: ns.site('trackerNetworksNotBlocked.title'),
            icon: 'info'
        }
    }
    case states.protectionsOff_allowedTrackers:
    case states.protectionsOff_allowedTrackers_allowedNonTrackers: {
        return {
            title: ns.site('trackerNetworksNotBlocked.title'),
            icon: 'warning'
        }
    }
    case states.protectionsOn:
    case states.protectionsOff:
    case states.protectionsOn_allowedNonTrackers:
    case states.protectionsOff_allowedNonTrackers: {
        return {
            title: ns.site('trackerNetworksNotFound.title'),
            icon: 'blocked'
        }
    }
    // if no 3rd party requests were observed in any way, then we use the 'nothing found' messaging
    default: return unreachable(state)
    }
}

/**
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 */
export function trackerNetworkSummary (requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
    case states.protectionsOn:
    case states.protectionsOff:
    case states.protectionsOn_allowedNonTrackers:
    case states.protectionsOff_allowedNonTrackers: {
        return ns.site('trackerNetworksSummaryNoneFound.title')
    }
    case states.protectionsOn_allowedTrackers:
    case states.protectionsOn_allowedTrackers_allowedNonTrackers: {
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
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 * @returns {string}
 */
export function trackerNetworksHeroIcon (requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
    case states.protectionsOn:
    case states.protectionsOff:
    case states.protectionsOff_allowedNonTrackers:
    case states.protectionsOn_allowedNonTrackers: {
        return 'major-networks-no-activity'
    }
    case states.protectionsOn_blocked_allowedTrackers:
    case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
    case states.protectionsOn_allowedTrackers:
    case states.protectionsOn_allowedTrackers_allowedNonTrackers: {
        return 'major-networks-info'
    }
    case states.protectionsOff_allowedTrackers:
    case states.protectionsOff_allowedTrackers_allowedNonTrackers: {
        return 'major-networks-warning'
    }
    case states.protectionsOn_blocked:
    case states.protectionsOn_blocked_allowedNonTrackers: {
        return 'major-networks-blocked'
    }
    default: return unreachable(state)
    }
}

/**
 * @param {never} x
 * @returns {never}
 */
function unreachable (x) {
    throw new Error("Didn't expect to get here with value" + x)
}
