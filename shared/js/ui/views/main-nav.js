import html from 'nanohtml'
import { trackerNetworksText } from '../templates/shared/tracker-networks-text.js'
import { thirdpartyText } from '../templates/shared/thirdparty-text.js'
import { i18n } from '../base/localize.js'
import { httpsMessages } from '../../../data/constants'
import { states } from '../../browser/utils/request-details.mjs'

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 * @returns {HTMLElement}
 */
export function template(model, nav) {
    const consentCb = model.tab.cookiePromptManagementStatus?.cosmetic ? nav.cookieHidden : nav.consentManaged
    const consentRow = html`<li class="main-nav__row">${renderCookieConsentManaged(model, consentCb)}</li>`
    const networkTrackersText = shouldRenderTrackerNetworksText(model)
        ? html`<li class="main-nav__row">${renderTrackerNetworksNew(model, nav.trackers)}</li>`
        : ''

    return html`
        <ul class="default-list main-nav token-body-em js-site-main-nav">
            <li class="main-nav__row">${renderConnection(model, nav.connection)}</li>
            ${networkTrackersText}
            <li class="main-nav__row">${renderThirdPartyNew(model, nav.nonTrackers)}</li>
            ${model.tab?.cookiePromptManagementStatus?.consentManaged ? consentRow : null}
        </ul>
    `
}
/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderCookieConsentManaged(model, cb) {
    if (!model.tab?.cookiePromptManagementStatus) return null

    const { consentManaged, cosmetic, optoutFailed, configurable } = model.tab.cookiePromptManagementStatus

    if (consentManaged && !optoutFailed) {
        const text = cosmetic ? i18n.t('site:cookiesHidden.title') : i18n.t('site:cookiesMinimized.title')
        if (configurable) {
            return html`
                <a
                    href="javascript:void(0)"
                    class="main-nav__item main-nav__item--link link-action link-action--dark"
                    role="button"
                    draggable="false"
                    onclick=${cb}
                >
                    <span class="main-nav__icon ${cosmetic ? 'icon-small--info' : 'icon-small--secure'}"></span>
                    <span class="main-nav__text">${text}</span>
                    <span class="main-nav__chev"></span>
                </a>
            `
        } else {
            return html`
                <div class="main-nav__item">
                    <span class="main-nav__icon icon-small--secure"></span>
                    <span class="main-nav__text">${text}</span>
                </div>
            `
        }
    }

    return html``
}
/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderConnection(model, cb) {
    let icon = 'icon-small--insecure'
    let text = i18n.t(httpsMessages[model.httpsState])
    let isSecure = model.httpsState === 'secure'
    let isUpgraded = model.httpsState === 'upgraded' && /^https/.exec(model.tab.url)

    if (isSecure || isUpgraded) {
        icon = 'icon-small--secure'
    }

    return html` <a
        href="javascript:void(0)"
        class="main-nav__item main-nav__item--link link-action link-action--dark"
        role="button"
        draggable="false"
        aria-label="View Connection Information"
        onclick=${cb}
    >
        <span class="main-nav__icon ${icon}"></span>
        <span class="main-nav__text">${text}</span>
        <span class="main-nav__chev"></span>
    </a>`
}
/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderTrackerNetworksNew(model, cb) {
    const { title, icon } = trackerNetworksText(model.tab.requestDetails, model.protectionsEnabled)
    return html` <a
        href="javascript:void(0)"
        class="main-nav__item main-nav__item--link link-action link-action--dark"
        role="button"
        draggable="false"
        aria-label="View Tracker Companies"
        onclick=${cb}
    >
        <span class="main-nav__icon icon-small--${icon}"></span>
        <span class="main-nav__text">${title}</span>
        <span class="main-nav__chev"></span>
    </a>`
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderThirdPartyNew(model, cb) {
    const { title, icon } = thirdpartyText(model.tab.requestDetails, model.protectionsEnabled)
    return html` <a
        href="javascript:void(0)"
        class="main-nav__item main-nav__item--link link-action link-action--dark"
        role="button"
        draggable="false"
        aria-label="View Non-Tracker Companies"
        onclick=${cb}
    >
        <span class="main-nav__icon icon-small--${icon}"></span>
        <span class="main-nav__text">${title}</span>
        <span class="main-nav__chev"></span>
    </a>`
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 * @returns {boolean}
 */
export function shouldRenderTrackerNetworksText(model) {
    const state = model.tab.requestDetails.state(model.protectionsEnabled)

    switch (state) {
        case states.protectionsOn_allowedTrackers_allowedNonTrackers:
        case states.protectionsOn_allowedTrackers:
            return false;
        default:
            return true;
    }
}