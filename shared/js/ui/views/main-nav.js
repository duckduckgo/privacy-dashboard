import $ from 'jquery'
import bel from 'bel'
import Parent from '../base/view.es6.js'
import { trackerNetworksText } from '../templates/shared/tracker-networks-text.es6'
import { thirdpartyText } from '../templates/shared/thirdparty-text.es6'
import { i18n } from '../base/localize.es6'
import { createPlatformFeatures } from '../platform-features'
import { platform } from '../../browser/communication.es6'
import { isAndroid } from '../environment-check'
import { setupMaterialDesignRipple } from './utils/utils'

/**
 * @param {object} ops
 * @param {import("../models/site.es6.js").default & import("../base/model.es6.js").baseModelMethods} ops.model
 * @param {import("jquery")} ops.appendTo
 * @param {any} ops.store
 * @constructor
 */
export function MainNavView(ops) {
    this.model = ops.model
    this.store = ops.store
    this.template = template
    this.features = createPlatformFeatures(platform)
    this.nav = {
        connection: (e) => {
            this.model.send('navigate', { target: 'connection' })
        },
        trackers: (e) => {
            this.model.send('navigate', { target: 'trackers' })
        },
        nonTrackers: (e) => {
            this.model.send('navigate', { target: 'nonTrackers' })
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
            setupMaterialDesignRipple('.link-action')
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
    rerender() {
        this._rerender()
    },
})

/**
 * @this {MainNavView}
 * @returns {HTMLElement}
 */
function template() {
    const consentRow = bel`<li class="main-nav__row">${renderCookieConsentManaged(this.model)}</li>`
    return bel`
    <ul class='default-list card-list--bordered main-nav token-body-em js-site-main-nav'>
        <li class='main-nav__row'>
            ${renderConnection(this.model, this.nav.connection)}
        </li>
        <li class='main-nav__row js-site-show-page-trackers'>
            ${renderTrackerNetworksNew(this.model, this.nav.trackers)}
        </li>
        <li class='main-nav__row js-site-show-page-non-trackers'>
            ${renderThirdPartyNew(this.model, this.nav.nonTrackers)}
        </li>
        ${this.model.tab?.consentManaged?.consentManaged ? consentRow : null}
    </ul>
    `
}
/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderCookieConsentManaged(model) {
    if (!model.tab?.consentManaged) return null

    const { consentManaged, optoutFailed } = model.tab.consentManaged
    if (consentManaged && !optoutFailed) {
        return bel`
            <div class="main-nav__item">
                <span class="main-nav__icon icon-small--secure"></span>
                <span class="main-nav__text">${i18n.t('site:cookiesMinimized.title')}</span>
            </div>
        `
    }
    return bel``
}
/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderConnection(model, cb) {
    let icon = 'icon-small--insecure'
    if (model.httpsState === 'secure') {
        icon = 'icon-small--secure'
    }
    // sometimes we're 'upgraded', but still are secure with a certificate - if so, make it a green tick
    if (
        model.httpsState === 'upgraded' &&
        /^https/.exec(model.tab.url) &&
        Array.isArray(model.tab.certificate) &&
        model.tab.certificate.length > 0
    ) {
        icon = 'icon-small--secure'
    }

    return bel`
        <a href="javascript:void(0)" 
            class="main-nav__item main-nav__item--link link-action link-action--dark" 
            role="button" 
            draggable="false"
            aria-label="View Connection Information"
            onclick=${cb}
            >
            <span class="main-nav__icon ${icon}"></span>
            <span class="main-nav__text">${model.httpsStatusText}</span>
            <span class="main-nav__chev"></span>
        </a>`
}
/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderTrackerNetworksNew(model, cb) {
    const { title, icon } = trackerNetworksText(model.tab.requestDetails, model.protectionsEnabled)
    return bel`
        <a href="javascript:void(0)" 
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
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderThirdPartyNew(model, cb) {
    const { title, icon } = thirdpartyText(model.tab.requestDetails, model.protectionsEnabled)
    return bel`
        <a href="javascript:void(0)" 
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
