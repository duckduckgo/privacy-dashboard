import bel from 'bel'
import { aboutLink } from './about-link'
import { trackerNetworksHeroIcon, trackerNetworkSummary } from './tracker-networks-text.es6'
import { thirdpartyHeroIcon, thirdpartySummary } from './thirdparty-text.es6'

/**
 * @param {object} opts
 * @param {HTMLElement} opts.icon
 * @param {string} [opts.summary]
 * @param {"about-link" | "none"} opts.suffix
 * @param {HTMLElement} [opts.children]
 */
export function heroTemplate(opts) {
    return bel`
        <div class="key-insight" data-suffix=${opts.suffix}>
            ${opts.icon}
            ${opts.summary ? bel`<p class="token-title-3">${opts.summary}</p>` : null}
            ${opts.suffix === 'about-link' ? aboutLink() : null}
            ${opts.children ? opts.children : null}
        </div>
    `
}

/**
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 * @returns {HTMLElement}
 */
export function heroFromTabTrackers(requestDetails, protectionsEnabled) {
    const summary = trackerNetworkSummary(requestDetails, protectionsEnabled)
    const icon = trackerNetworksHeroIcon(requestDetails, protectionsEnabled)
    const largeIcon = largeHeroIcon({
        status: icon,
    })
    return heroTemplate({
        suffix: 'about-link',
        icon: largeIcon,
        summary,
    })
}

/**
 * @param {import("../../../browser/utils/request-details").RequestDetails} requestDetails
 * @param {boolean} protectionsEnabled
 * @returns {HTMLElement}
 */
export function heroFromTabNonTrackers(requestDetails, protectionsEnabled) {
    const summary = thirdpartySummary(requestDetails, protectionsEnabled)
    const icon = thirdpartyHeroIcon(requestDetails, protectionsEnabled)
    const largeIcon = largeHeroIcon({
        status: icon,
    })
    return heroTemplate({
        suffix: 'about-link',
        icon: largeIcon,
        summary,
    })
}

/**
 * @param {object} ops
 * @param {string} ops.status
 */
export function largeHeroIcon(ops) {
    return bel`<div class="large-icon-container hero-icon--${ops.status}"></div>`
}
