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
import { sectionsFromSiteTrackers, trackerNetworksTemplate } from '../templates/page-trackers.es6.js'
import { nonTrackersTemplate, sectionsFromSiteNonTracker } from '../templates/page-non-trackers.es6.js'
import { heroFromTabNonTrackers, heroFromTabTrackers } from '../templates/shared/hero.es6'
import { setupMaterialDesignRipple, setupSwitch } from './utils/utils.js'
import BreakageFormView from './../views/breakage-form.es6.js'
import pageConnectionTemplate from './../templates/page-connection.es6.js'
import breakageFormTemplate from './../templates/breakage-form.es6.js'
import EmailProtectionView from './email-protection.es6'
import SearchView from './search.es6'
import CtaRotationView from './cta-rotation.es6'
/** @type {import('../../browser/communication.es6.js').Communication} */
import TrackerNetworksView from './../views/tracker-networks.es6.js'
import { MainNavView } from './main-nav'
import { KeyInsightView } from '../templates/key-insights'

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
        e.target?.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
        })
        this.model.toggleAllowlist()
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
            'main-nav',
            'done',
        ])

        if (isAndroid()) {
            setupSwitch('.mdc-switch')
            setupMaterialDesignRipple('.link-action')
        }

        this.bindEvents([
            [this.$toggle, 'click', this._onAllowlistClick],
            [this.$done, 'click', this._done],
            [this.$permission, 'change', this._changePermission],
            [this.$mainnav, 'mouseover', this._mouseover],
            [this.$mainnav, 'mouseleave', this._mouseleave],
            [this.store.subscribe, 'action:site', this.oops],
        ])

        this._setupFeatures()

        setTimeout(() => {
            browserUIWrapper.firstRenderComplete?.()
        }, 100)
    },
    oops(event) {
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
        }
    },

    _onReportBrokenSiteClick: function (e) {
        e.preventDefault()

        if (this.model && this.model.disabled) {
            return
        }

        const isHandledExternally = this.model.checkBrokenSiteReportHandled()
        if (!isHandledExternally) {
            this.showBreakageForm('reportBrokenSite')
        }
    },

    // pass clickSource to specify whether page should reload
    // after submitting breakage form.
    showBreakageForm: function (e) {
        blur(e.target)
        this.views.breakageForm = new BreakageFormView({
            siteView: this,
            template: breakageFormTemplate,
            model: this.model,
            appendTo: this.$body,
            clickSource: e,
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
    _mouseover(e) {
        const li = e.target?.closest('li')
        if (li) {
            const links = this.$mainnav.find('li').index(li)
            this.$mainnav[0].dataset.hover = links
        }
    },
    _mouseleave() {
        try {
            delete this.$mainnav[0].dataset.hover
        } catch (e) {
            console.warn('cannot delete data-hover')
            // no-op
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
