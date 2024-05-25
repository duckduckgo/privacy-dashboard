import html from 'nanohtml'
import { aboutLink } from './links'
import { trackerNetworksHeroIcon, trackerNetworkSummary } from './tracker-networks-text.js'
import { thirdpartyHeroIcon, thirdpartySummary } from './thirdparty-text.js'
import raw from 'nanohtml/raw'

/**
 * @param {object} opts
 * @param {HTMLElement} opts.icon
 * @param {string} [opts.summary]
 * @param {"about-link" | "none"} opts.suffix
 * @param {HTMLElement} [opts.children]
 */
export function heroTemplate(opts) {
    return html`
        <div class="key-insight" data-suffix=${opts.suffix} lol>
            ${opts.icon} ${opts.summary ? html`<p class="token-title-3">${raw(opts.summary)}</p>` : null}
            ${opts.suffix === 'about-link' ? aboutLink() : null} ${opts.children ? opts.children : null}
        </div>
    `
}

/**
 * @param {import("../../../browser/utils/request-details.mjs").RequestDetails} requestDetails
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
 * @param {import("../../../browser/utils/request-details.mjs").RequestDetails} requestDetails
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
 * @param {object} props
 * @param {string} props.status
 */
export function largeHeroIcon(props) {
    return html`<div class="large-icon-container hero-icon--${props.status}"></div>`
}
