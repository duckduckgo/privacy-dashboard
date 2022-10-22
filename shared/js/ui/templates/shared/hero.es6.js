import bel from 'bel'
import { i18n } from '../../base/localize.es6'
import { isAndroid, isIOS } from '../../environment-check'
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
        <div class="key-insight">
            ${opts.icon}
            ${opts.summary ? bel`<p class="token-title-3">${opts.summary}</p>` : null}
            ${opts.suffix === 'about-link' ? bel`<p>${aboutLink()}</p>` : null}
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

/**
 * @param {object} opts
 * @param {"tall" | "short"} [opts.variant]
 */
export function topNav(opts = {}) {
    const variant = isIOS() || isAndroid() ? 'tall' : 'short'
    return bel`
    <div>
        <div class="top-nav top-nav--${variant}">
            <a href="javascript:void(0)"
                class="top-nav__close js-sliding-subview-close js-site-done link-action"
                role="button"
                aria-label="${i18n.t('site:navigationBack.title')}"
                data-test-id="back-button"
            >
                <span class="icon icon__back-arrow" data-icon-text="${i18n.t('site:navigationBack.title')}"></span>
            </a>
            <a href="javascript:void(0)"
                class="top-nav__done js-sliding-subview-done js-site-done link-action"
                role="button"
            >
                ${i18n.t('site:navigationComplete.title')}
            </a>
        </div>    
        <div class="top-nav__spacer"></div>
    </div>
`
}
