import { states } from '../../../browser/utils/request-details'
export const text = {
    'no trackers found': () => 'No Tracking Requests Found',
    'no trackers blocked': () => 'No Tracking Requests Blocked',
    'no third parties found': () => 'No Third-Party Requests Found',
    'requests blocked': () => 'Requests Blocked from Loading',
    'thirdparties loaded': () => 'Third Party Requests Loaded',
    'hero no trackers found': () => 'We did not identify any tracking requests on this page.',
    'hero no thirdparties found': () => 'We did not identify any requests from third-party domains.',
    'hero blocked': () =>
        "The following third-party domains’ requests were blocked from loading because they were identified as tracking requests. If a company's requests are loaded, it can allow them to profile you.",
    'hero trackers not blocked': () =>
        "No tracking requests were blocked from loading on this page. If a company's requests are loaded, it can allow them to profile you.",
    'hero thirdparties loaded': () =>
        "The following third-party domains’ requests were loaded. If a company's requests are loaded, it can allow them to profile you, though our other web tracking protections still apply.",
    'hero not blocked protections off': () =>
        "No tracking requests were blocked from loading because Protections are turned protectionsOff for this site. If a company's requests are loaded, it can allow them to profile you.",
    'hero third parties protections off': () =>
        "The following third-party domains’ requests were loaded because Protections are turned protectionsOff for this site. If a company's requests are loaded, it can allow them to profile you, though our other web tracking protections still apply.",
}
export const icons = {
    large: {
        'no-activity': () => 'hero__icon--major-networks-no-activity',
        'shield green check': () => 'shield green check',
        'shield grey info': () => 'shield grey info',
        'shield red info': () => 'hero__icon--major-networks-warning',
    },
    small: {
        'green check': () => 'icon-blocked',
        'green tick': () => 'green tick',
        'grey info': () => 'grey info',
        'red info': () => 'icon-warning',
    },
}

// eslint-disable-next-line no-unused-vars
const keys = /** @type {const} */ ([
    'tracker-list-link.text',
    'tracker-list-link.icon',
    'third-party-list-link.text',
    'third-party-list-link.icon',
    'tracker-hero.text',
    'tracker-hero.icon',
    'third-party-hero.text',
    'third-party-hero.icon',
])
/** @typedef {Record<keys[number], string>} TextIconMapping */
/** @type {Record<string, TextIconMapping>} */
export const selectors = {
    [states.protectionsOn]: {
        'tracker-list-link.text': text['no trackers found'](),
        'tracker-list-link.icon': icons.small['green check'](),
        'third-party-list-link.text': text['no third parties found'](),
        'third-party-list-link.icon': icons.small['green check'](),
        'tracker-hero.text': text['hero no trackers found'](),
        'tracker-hero.icon': icons.large['no-activity'](),
        'third-party-hero.text': text['hero no thirdparties found'](),
        'third-party-hero.icon': icons.large['no-activity'](),
    },
    // [states.protectionsOn_blocked]: {
    //     'tracker-list-link.text': text['requests blocked'],
    //     'tracker-list-link.icon': icons.small['green check'],
    //     'third-party-list-link.text': text['no third parties found'],
    //     'third-party-list-link.icon': icons.small['green check'],
    //     'tracker-heroTemplate.text': text['heroTemplate blocked'],
    //     'tracker-heroTemplate.icon': icons.large['shield green check'],
    //     'third-party-heroTemplate.text': text['heroTemplate no thirdparties found'],
    //     'third-party-heroTemplate.icon': icons.large['no-activity']
    // },
    // [states.protectionsOn_allowedTrackers]: {
    //     'tracker-list-link.text': text['no trackers blocked'],
    //     'tracker-list-link.icon': icons.small['grey info'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate trackers not blocked'],
    //     'tracker-heroTemplate.icon': icons.large['shield grey info'],
    //     'third-party-heroTemplate.text': text['heroTemplate thirdparties loaded'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOn_allowedNonTrackers]: {
    //     'tracker-list-link.text': text['no trackers found'],
    //     'tracker-list-link.icon': icons.small['green check'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate no trackers found'],
    //     'tracker-heroTemplate.icon': icons.large['no-activity'],
    //     'third-party-heroTemplate.text': text['heroTemplate thirdparties loaded'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOn_blocked_allowedTrackers]: {
    //     'tracker-list-link.text': text['requests blocked'],
    //     'tracker-list-link.icon': icons.small['grey info'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate blocked'],
    //     'tracker-heroTemplate.icon': icons.large['shield green check'],
    //     'third-party-heroTemplate.text': text['heroTemplate thirdparties loaded'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOn_allowedTrackers_allowedNonTrackers]: {
    //     'tracker-list-link.text': text['no trackers blocked'],
    //     'tracker-list-link.icon': icons.small['grey info'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate trackers not blocked'],
    //     'tracker-heroTemplate.icon': icons.large['shield grey info'],
    //     'third-party-heroTemplate.text': text['heroTemplate thirdparties loaded'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOn_blocked_allowedNonTrackers]: {
    //     'tracker-list-link.text': text['requests blocked'],
    //     'tracker-list-link.icon': icons.small['green tick'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate blocked'],
    //     'tracker-heroTemplate.icon': icons.small['green check'],
    //     'third-party-heroTemplate.text': text['heroTemplate thirdparties loaded'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOn_blocked_allowedTrackers_allowedNonTrackers]: {
    //     'tracker-list-link.text': text['requests blocked'],
    //     'tracker-list-link.icon': icons.small['grey info'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate blocked'],
    //     'tracker-heroTemplate.icon': icons.small['green check'],
    //     'third-party-heroTemplate.text': text['heroTemplate thirdparties loaded'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOff]: {
    //     'tracker-list-link.text': text['no trackers found'],
    //     'tracker-list-link.icon': icons.small['green check'],
    //     'third-party-list-link.text': text['no third parties found'],
    //     'third-party-list-link.icon': icons.small['green check'],
    //     'tracker-heroTemplate.text': text['heroTemplate no trackers found'],
    //     'tracker-heroTemplate.icon': icons.large['no-activity'],
    //     'third-party-heroTemplate.text': text['heroTemplate no thirdparties found'],
    //     'third-party-heroTemplate.icon': icons.large['no-activity']
    // },
    // [states.protectionsOff_allowedTrackers]: {
    //     'tracker-list-link.text': text['no trackers blocked'],
    //     'tracker-list-link.icon': icons.small['red info'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate not blocked protections protectionsOff'],
    //     'tracker-heroTemplate.icon': icons.large['shield red info'],
    //     'third-party-heroTemplate.text': text['heroTemplate third parties protections protectionsOff'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOff_allowedNonTrackers]: {
    //     'tracker-list-link.text': text['no trackers found'],
    //     'tracker-list-link.icon': icons.small['green check'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate no trackers found'],
    //     'tracker-heroTemplate.icon': icons.large['no-activity'],
    //     'third-party-heroTemplate.text': text['heroTemplate third parties protections protectionsOff'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // },
    // [states.protectionsOff_allowedTrackers_allowedNonTrackers]: {
    //     'tracker-list-link.text': text['no trackers blocked'],
    //     'tracker-list-link.icon': icons.small['red info'],
    //     'third-party-list-link.text': text['thirdparties loaded'],
    //     'third-party-list-link.icon': icons.small['grey info'],
    //     'tracker-heroTemplate.text': text['heroTemplate not blocked protections protectionsOff'],
    //     'tracker-heroTemplate.icon': icons.large['shield red info'],
    //     'third-party-heroTemplate.text': text['heroTemplate third parties protections protectionsOff'],
    //     'third-party-heroTemplate.icon': icons.large['shield grey info']
    // }
}
