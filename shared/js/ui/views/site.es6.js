// @ts-ignore
import $ from 'jquery'
import { isAndroid } from '../environment-check.js'
import EmailProtectionModel from '../models/email-protection.es6'
import emailProtectionTemplate from '../templates/email-protection.es6'
import SearchModel from '../models/search.es6'
import searchTemplate from '../templates/search.es6'
import Parent from '../base/view.es6'
import { CtaRotationModel } from '../models/cta-rotation.es6'
import ctaRotationView from '../templates/cta-rotation.es6'
import browserUIWrapper, { platform } from '../../browser/communication.es6.js'
import { sectionsFromSiteTrackers, trackerNetworksTemplate } from '../templates/page-trackers.es6.js'
import { nonTrackersTemplate, sectionsFromSiteNonTracker } from '../templates/page-non-trackers.es6.js'
import { heroFromTabNonTrackers, heroFromTabTrackers } from '../templates/shared/hero.es6'
import { KeyInsightView } from '../templates/key-insights'
import { BreakageFormModel } from '../models/breakage-form.es6'
import { renderUpdatingSpinner } from '../templates/shared/protection-toggle'
import { createPlatformFeatures } from '../platform-features'
import { CookiePromptModel } from '../models/cookie-prompt.es6'
import { setupMaterialDesignRipple, setupSwitch } from './utils/utils.js'
import BreakageFormView from './../views/breakage-form.es6.js'
import pageConnectionTemplate from './../templates/page-connection.es6.js'
import breakageFormTemplate from './../templates/breakage-form.es6.js'
import EmailProtectionView from './email-protection.es6'
import SearchView from './search.es6'
import CtaRotationView from './cta-rotation.es6'
import TrackerNetworksView from './../views/tracker-networks.es6.js'
import { MainNavView } from './main-nav'
import { CookiePromptView } from './cookie-prompt'

/**
 * @constructor
 */
function Site(ops) {
    this.model = ops.model
    this.pageView = ops.pageView
    this.template = ops.template
    this.features = createPlatformFeatures(platform)
    this.updateInProgress = false

    // cache 'body' selector
    this.$body = $('body')

    // get data from background process, then re-render template with it
    this.model
        .getBackgroundTabData()
        .then(() => {
            // render template for the first time here
            Parent.call(this, ops)
            // @ts-ignore
            this._setup()
        })
        .catch((e) => {
            console.log('❌ [views/site.es6.js] --> ', e)
        })
}

Site.prototype = $.extend({}, Parent.prototype, {
    /**
     * @this {Site & Record<string, any>}
     * @param e
     * @private
     */
    _onAllowlistClick: function (e) {
        if (this.$body.hasClass('is-disabled')) return

        // this can only ever be interacted with once
        // so we return if set, otherwise we immediately set this value to prevent further updates
        if (this.updateInProgress) return
        this.updateInProgress = true

        // Provide visual feedback of the change
        const pressed = this.$toggle.attr('aria-checked')
        const next = pressed === 'true' ? 'false' : 'true'
        this.$toggle.attr('aria-checked', next)

        // allow 300ms for the animation
        setTimeout(() => {
            this.model.toggleAllowlist()

            // on platforms that support spinners, just replace the HTML
            if (this.features.spinnerFollowingProtectionsToggle) {
                this.$toggleparent.html(renderUpdatingSpinner())
            }
        }, 300)
    },

    _changePermission: function (e) {
        this.model.updatePermission(e.target.name, e.target.value)
    },

    // NOTE: after ._setup() is called this view listens for changes to
    // site model and re-renders every time model properties change
    _setup: function () {
        this._cacheElems('.js-site', ['toggle', 'toggle-parent', 'report-broken', 'permission', 'done'])

        if (isAndroid()) {
            setupSwitch('.mdc-switch')
            setupMaterialDesignRipple(this.$parent[0], '.js-site-report-broken')
        }

        this.bindEvents([
            [this.$toggle, 'click', this._onAllowlistClick],
            [this.$reportbroken, 'click', this._onReportBrokenSiteClick],
            [this.$done, 'click', this._done],
            [this.$permission, 'change', this._changePermission],
            [this.store.subscribe, 'action:site', this._handleEvents],
        ])

        this._setupFeatures()

        setTimeout(() => {
            browserUIWrapper.firstRenderComplete?.()
        }, 100)
    },
    _handleEvents(event) {
        if (event.action === 'navigate') {
            if (event.data?.target === 'connection') {
                this._showPageConnection()
            }
            if (event.data?.target === 'trackers') {
                this._showPageTrackers()
            }
            if (event.data?.target === 'nonTrackers') {
                this._showPageNonTrackers()
            }
            if (event.data?.target === 'consentManaged') {
                this._showPageConsent()
            }
        }
    },

    _onReportBrokenSiteClick: function (e) {
        e.preventDefault()

        if (this.model && this.model.disabled) {
            return
        }

        this.model
            .checkBrokenSiteReportHandled()
            .then((handled) => {
                if (!handled) {
                    this.showBreakageForm('reportBrokenSite')
                }
            })
            .catch((e) => {
                console.error('could not check')
            })
    },

    // pass clickSource to specify whether page should reload
    // after submitting breakage form.
    showBreakageForm: function (e) {
        blur(e.target)
        this.views.slidingSubview = new BreakageFormView({
            template: breakageFormTemplate,
            model: new BreakageFormModel(),
        })
    },

    _showPageTrackers: function () {
        if (this.$body.hasClass('is-disabled')) return
        this.views.slidingSubview = new TrackerNetworksView({
            template: trackerNetworksTemplate,
            heroFn: heroFromTabTrackers,
            detailsFn: sectionsFromSiteTrackers,
        })
    },

    _showPageNonTrackers: function () {
        if (this.$body.hasClass('is-disabled')) return
        this.views.slidingSubview = new TrackerNetworksView({
            template: nonTrackersTemplate,
            heroFn: heroFromTabNonTrackers,
            detailsFn: sectionsFromSiteNonTracker,
        })
    },

    _showPageConnection: function () {
        if (this.$body.hasClass('is-disabled')) return
        this.views.slidingSubview = new TrackerNetworksView({
            template: pageConnectionTemplate,
        })
    },

    _showPageConsent: function (e) {
        this.views.slidingSubview = new CookiePromptView({
            model: new CookiePromptModel(),
        })
    },

    _done: function () {
        this.model.close()
    },
    _setupFeatures() {
        this.views.mainNav = new MainNavView({
            model: this.model,
            appendTo: $('#main-nav'),
            store: this.store,
        })
        this.views.keyInsight = new KeyInsightView({
            model: this.model,
            appendTo: $('#key-insight'),
            store: this.store,
        })
        if (this.model.tab?.search) {
            this.views.search = new SearchView({
                pageView: this,
                model: new SearchModel({ searchText: '' }),
                appendTo: $('#search-form-container'),
                template: searchTemplate,
            })
        }

        // does the device support CTA screens?
        if (this.model.tab?.ctaScreens && !this.views.ctaRotations) {
            this.views.ctaRotations = new CtaRotationView({
                pageView: this,
                model: new CtaRotationModel({ emailProtectionUserData: this.model.emailProtectionUserData }),
                appendTo: $('#cta-rotation'),
                template: ctaRotationView,
            })
        }

        // does the device support Email Protection?
        if (this.model.tab?.emailProtection) {
            this.views.emailProtection = new EmailProtectionView({
                model: new EmailProtectionModel({ emailProtectionUserData: this.model.emailProtectionUserData }),
                appendTo: $('#email-alias-container'),
                template: emailProtectionTemplate,
            })
        }
    },
})

/**
 * @param {HTMLElement | null} target
 */
function blur(target) {
    const closest = target?.closest('a')
    if (closest && typeof closest.blur === 'function') {
        closest.blur()
    }
}

export default Site
