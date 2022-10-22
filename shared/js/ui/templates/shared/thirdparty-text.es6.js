import { states } from '../../../browser/utils/request-details'
import { ns } from '../../base/localize.es6'

/**
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 * @returns {{title: string, icon: string}}
 */
export function thirdpartyText(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
        case states.protectionsOn:
        case states.protectionsOn_blocked:
        case states.protectionsOff: {
            return {
                title: ns.site('thirdPartiesNoneFound.title'),
                icon: 'blocked',
            }
        }
        case states.protectionsOn_allowedTrackers:
        case states.protectionsOn_allowedNonTrackers:
        case states.protectionsOn_blocked_allowedTrackers:
        case states.protectionsOn_blocked_allowedNonTrackers:
        case states.protectionsOn_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
        case states.protectionsOff_allowedTrackers_allowedNonTrackers:
        case states.protectionsOff_allowedNonTrackers:
        case states.protectionsOff_allowedTrackers: {
            return {
                title: ns.site('thirdPartiesLoaded.title'),
                icon: 'info',
            }
        }

        // if no 3rd party requests were observed in any way, then we use the 'nothing found' messaging
        default:
            return unreachable(state)
    }
}

/**
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 */
export function thirdpartySummary(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
        case states.protectionsOn_blocked_allowedTrackers:
        case states.protectionsOn_blocked_allowedNonTrackers:
        case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_allowedTrackers:
        case states.protectionsOff_allowedTrackers:
        case states.protectionsOn_allowedNonTrackers:
        case states.protectionsOff_allowedTrackers_allowedNonTrackers:
        case states.protectionsOff_allowedNonTrackers: {
            return ns.site('thirdPartiesSummaryProtectionsOff.title')
        }
        case states.protectionsOn:
        case states.protectionsOff:
        case states.protectionsOn_blocked: {
            return ns.site('thirdPartiesSummaryNone.title')
        }
        default:
            return unreachable(state)
    }
}

/**
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 * @returns {string}
 */
export function thirdpartyHeroIcon(requestDetails, protectionsEnabled) {
    const state = requestDetails.state(protectionsEnabled)
    switch (state) {
        case states.protectionsOn:
        case states.protectionsOn_blocked:
        case states.protectionsOff: {
            return 'major-networks-no-activity'
        }
        case states.protectionsOn_blocked_allowedTrackers:
        case states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_allowedTrackers:
        case states.protectionsOn_allowedNonTrackers:
        case states.protectionsOff_allowedNonTrackers:
        case states.protectionsOff_allowedTrackers:
        case states.protectionsOn_blocked_allowedNonTrackers:
        case states.protectionsOff_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_allowedTrackers_allowedNonTrackers: {
            return 'major-networks-info'
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
    throw new Error("Didn't expect to get here with value " + x)
}
