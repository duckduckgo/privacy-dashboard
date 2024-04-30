import $ from 'jquery'
import html from 'nanohtml'
import Parent from '../base/view.js'
import { trackerNetworksText } from '../templates/shared/tracker-networks-text.js'
import { thirdpartyText } from '../templates/shared/thirdparty-text.js'
import { i18n } from '../base/localize.js'
import { createPlatformFeatures } from '../platform-features.mjs'
import { platform } from '../../browser/communication.js'
import { isAndroid } from '../environment-check'
import { setupMaterialDesignRipple } from './utils/utils'
import { httpsMessages } from '../../../data/constants'

/**
 * @param {object} ops
 * @param {import("../models/site.js").default & import("../base/model.js").baseModelMethods} ops.model
 * @param {import("jquery")} ops.appendTo
 * @param {any} ops.store
 * @constructor
 */
export function MainNavView(ops) {
    this.model = ops.model
    this.store = ops.store
    this.template = template
    this.features = createPlatformFeatures(platform)
    this.cleanups = []
    this.nav = {
        connection: () => {
            this.model.send('navigate', { target: 'connection' })
        },
        trackers: () => {
            this.model.send('navigate', { target: 'trackers' })
        },
        nonTrackers: () => {
            this.model.send('navigate', { target: 'nonTrackers' })
        },
        consentManaged: () => {
            this.model.send('navigate', { target: 'consentManaged' })
        },
        cookieHidden: () => {
            this.model.send('navigate', { target: 'cookieHidden' })
        },
    }
    Parent.call(this, ops)
    // @ts-ignore
    this._setup()
}

MainNavView.prototype = $.extend({}, Parent.prototype, {
    /**
     * @this {MainNavView}
     * @private
     */
    _setup: function () {
        // @ts-ignore
        this.bindEvents([
            // @ts-ignore
            [this.store.subscribe, 'change:site', this.rerender],
            // @ts-ignore
            [this.$parent, 'mouseover', this._mouseover],
            // @ts-ignore
            [this.$parent, 'mouseleave', this._mouseleave],
        ])

        if (isAndroid()) {
            // @ts-ignore
            this.cleanups.push(...setupMaterialDesignRipple(this.$parent[0], '.link-action'))
        }
    },
    /**
     * @this {MainNavView}
     * @private
     */
    _mouseover(e) {
        if (!this.features.supportsHover) return
        const li = e.target?.closest('li')
        if (li) {
            // @ts-ignore
            const links = this.$parent.find('li').index(li)
            // @ts-ignore
            this.$parent[0].dataset.hover = links
        }
    },
    _mouseleave() {
        if (!this.features.supportsHover) return
        try {
            delete this.$parent[0].dataset.hover
        } catch (e) {
            console.warn('cannot delete data-hover')
            // no-op
        }
    },
    cleanup() {
        for (const cleanup of this.cleanups) {
            cleanup()
        }
        this.cleanups = []
    },
    rerender() {
        this.cleanup()
        this._rerender()

        if (isAndroid()) {
            this.cleanups.push(...setupMaterialDesignRipple(this.$parent[0], '.link-action'))
        }
    },
})

/**
 * @this {MainNavView}
 * @returns {HTMLElement}
 */
function template() {
    /** @type {import('../models/site.js').PublicSiteModel} */
    const model = this.model
    const consentCb = model.tab.cookiePromptManagementStatus?.cosmetic ? this.nav.cookieHidden : this.nav.consentManaged
    const consentRow = html`<li class="main-nav__row">${renderCookieConsentManaged(model, consentCb)}</li>`
    return html`
        <ul class="default-list main-nav token-body-em js-site-main-nav">
            <li class="main-nav__row">${renderConnection(model, this.nav.connection)}</li>
            <li class="main-nav__row">${renderTrackerNetworksNew(model, this.nav.trackers)}</li>
            <li class="main-nav__row">${renderThirdPartyNew(model, this.nav.nonTrackers)}</li>
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
