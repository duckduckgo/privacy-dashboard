import { MDCSwitch } from '@material/switch'
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
import browserUIWrapper from '../../browser/communication.es6.js'
import { sectionsFromSiteTrackers, trackerNetworksTemplate } from '../templates/tracker-networks.es6'
import { nonTrackersTemplate, sectionsFromSiteNonTracker } from '../templates/non-trackers.es6'
import { heroFromTabNonTrackers, heroFromTabTrackers } from '../templates/shared/hero.es6'
import { setupMaterialDesignRipple } from './utils/utils.js'
import BreakageFormView from './../views/breakage-form.es6.js'
import pageConnectionTemplate from './../templates/page-connection.es6.js'
import breakageFormTemplate from './../templates/breakage-form.es6.js'
import EmailProtectionView from './email-protection.es6'
import SearchView from './search.es6'
import CtaRotationView from './cta-rotation.es6'
/** @type {import('../../browser/communication.es6.js').Communication} */
import TrackerNetworksView from './../views/tracker-networks.es6.js'

function Site(ops) {
    this.model = ops.model
    this.pageView = ops.pageView
    this.template = ops.template

    // cache 'body' selector
    this.$body = $('body')

    // get data from background process, then re-render template with it
    this.model
        .getBackgroundTabData()
        .then(() => {
            if (this.model.tab && (this.model.tab.status === 'complete' || this.model.domain === 'new tab')) {
                // render template for the first time here
                Parent.call(this, ops)
                // @ts-ignore
                this._setup()
            } else {
                // the timeout helps buffer the re-render cycle during heavy
                // page loads with lots of trackers
                Parent.call(this, ops)
                // @ts-ignore
                setTimeout(() => this.rerender(), 750)
            }
        })
        .catch((e) => {
            console.log('❌ [views/site.es6.js] --> ', e)
        })
}

Site.prototype = $.extend({}, Parent.prototype, {
    _onAllowlistClick: function (e) {
        if (this.$body.hasClass('is-disabled')) return

        // Provide visual feedback of change
        this.$toggle.toggleClass('toggle-button--is-active-true')
        this.$toggle.toggleClass('toggle-button--is-active-false')

        // Complete the update once the animation has completed
        setTimeout(() => {
            this.model.toggleAllowlist()
        }, 250)
    },

    _changePermission: function (e) {
        this.model.updatePermission(e.target.name, e.target.value)
    },

    // NOTE: after ._setup() is called this view listens for changes to
    // site model and re-renders every time model properties change
    _setup: function () {
        this._cacheElems('.js-site', [
            'toggle',
            'protection',
            'show-page-connection',
            'show-page-trackers',
            'show-page-non-trackers',
            'report-broken',
            'permission',
            'done',
        ])

        if (isAndroid()) {
            document.querySelectorAll('.mdc-switch').forEach(
                ($el) =>
                    // @ts-ignore
                    new MDCSwitch($el) // eslint-disable-line no-new
            )
            setupMaterialDesignRipple('.js-site-show-page-connection', '.js-site-show-page-trackers', '.js-site-done')
        }

        this.bindEvents([
            [this.$toggle, 'click', this._onAllowlistClick],
            [this.$showpageconnection, 'click', this._showPageConnection],
            [this.$showpagetrackers, 'click', this._showPageTrackers],
            [this.$showpagenontrackers, 'click', this._showPageNonTrackers],
            [this.$reportbroken, 'click', this._onReportBrokenSiteClick],
            [this.$done, 'click', this._done],
            [this.$permission, 'change', this._changePermission],
            [this.store.subscribe, 'change:site', this.rerender],
        ])

        this._setupFeatures()

        setTimeout(() => {
            browserUIWrapper.firstRenderComplete?.()
        }, 100)
    },

    rerender: function () {
        // Prevent rerenders when confirmation form is active,
        // otherwise form will disappear on rerender.
        if (this.$body.hasClass('confirmation-active')) return

        if (this.model && this.model.disabled) {
            if (!this.$body.hasClass('is-disabled')) {
                this.$body.addClass('is-disabled')
                this._rerender()
                this._setup()
            }
        } else {
            this.$body.removeClass('is-disabled')
            this.unbindEvents()
            this._rerender()
            this._setup()
        }
    },

    _onReportBrokenSiteClick: function (e) {
        e.preventDefault()

        if (this.model && this.model.disabled) {
            return
        }

        const isHandledExternally = this.model.checkBrokenSiteReportHandled()
        console.log('', { isHandledExternally: JSON.stringify(isHandledExternally) })
        if (!isHandledExternally) {
            this.showBreakageForm('reportBrokenSite')
        }
    },

    // pass clickSource to specify whether page should reload
    // after submitting breakage form.
    showBreakageForm: function (clickSource) {
        this.views.breakageForm = new BreakageFormView({
            siteView: this,
            template: breakageFormTemplate,
            model: this.model,
            appendTo: this.$body,
            clickSource: clickSource,
        })
    },

    _showPageTrackers: function (e) {
        if (this.$body.hasClass('is-disabled')) return
        this.views.slidingSubview = new TrackerNetworksView({
            template: trackerNetworksTemplate,
            heroFn: heroFromTabTrackers,
            detailsFn: sectionsFromSiteTrackers,
        })
    },

    _showPageNonTrackers: function (e) {
        if (this.$body.hasClass('is-disabled')) return
        this.views.slidingSubview = new TrackerNetworksView({
            template: nonTrackersTemplate,
            heroFn: heroFromTabNonTrackers,
            detailsFn: sectionsFromSiteNonTracker,
        })
    },

    _showPageConnection: function (e) {
        if (this.$body.hasClass('is-disabled')) return
        this.views.slidingSubview = new TrackerNetworksView({
            template: pageConnectionTemplate,
        })
    },

    _done: function () {
        this.model.close()
    },
    _setupFeatures() {
        if (this.model.tab?.search) {
            if (this.views.search) {
                this.views.search.destroy()
            }
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
            if (this.views.emailProtection) {
                this.views.emailProtection.destroy()
            }
            this.views.emailProtection = new EmailProtectionView({
                model: new EmailProtectionModel({ emailProtectionUserData: this.model.emailProtectionUserData }),
                appendTo: $('#email-alias-container'),
                template: emailProtectionTemplate,
            })
        }
    },
})

export default Site
