import $ from 'jquery'
import ParentSlidingSubview from './sliding-subview.js'
import CompanyListModel from './../models/site-company-list.js'
import SiteModel from './../models/site.js'

/**
 * @param {object} opts
 * @param {any} opts.template
 * @param {import("../templates/shared/hero.js").heroFromTabTrackers} [opts.heroFn]
 * @param {import("../templates/page-trackers.js").sectionsFromSiteTrackers} [opts.detailsFn]
 * @constructor
 */
function TrackerNetworks(opts) {
    // model data is async
    /** @type {import("jquery") | null} */
    this.$hero = null

    /** @type {import("jquery") | null} */
    this.$details = null

    this.model = null
    this.currentModelName = null
    this.currentSiteModelName = null
    this.template = opts.template

    /**
     * @type {import("../templates/shared/hero.js").heroFromTabTrackers | undefined}
     */
    this.heroFn = opts.heroFn

    /**
     * @type {import("../templates/page-trackers.js").sectionsFromSiteTrackers | undefined}
     */
    this.detailsFn = opts.detailsFn

    // @ts-ignore
    ParentSlidingSubview.call(this, opts)

    // @ts-ignore
    this.renderAsyncContent()
}

TrackerNetworks.prototype = $.extend(
    {},
    // @ts-ignore
    ParentSlidingSubview.prototype,
    {
        /** @this {any} */
        setup: function () {
            this._cacheElems('.js-tracker-networks', ['hero', 'details'])

            this.bindEvents([[this.store.subscribe, `change:${this.currentSiteModelName}`, this._rerender]])
        },
        /** @this {any} */
        renderAsyncContent: function () {
            const random = Math.round(Math.random() * 100000)
            this.currentModelName = 'siteCompanyList' + random
            this.currentSiteModelName = 'site' + random

            this.model = new CompanyListModel({
                modelName: this.currentModelName,
            })
            this.model.fetchAsyncData().then(() => {
                this.model.site = new SiteModel({
                    modelName: this.currentSiteModelName,
                })
                this.model.site.getBackgroundTabData().then(() => {
                    const content = this.template()
                    this.$el.append(content)
                    this.setup()
                    this.setupClose()
                })
            })
        },

        /**
         * @this {TrackerNetworks}
         */
        _renderHeroTemplate: function () {
            if (this.model.site && this.heroFn) {
                // /** @type {import('./../models/site.js').PublicSiteModel} */
                const site = this.model.site
                const heroElement = this.heroFn(site.tab.requestDetails, site.protectionsEnabled)
                this.$hero?.html(heroElement)
            }
            if (this.model.site && this.detailsFn) {
                const site = this.model.site
                const detailsElement = this.detailsFn(site)
                this.$details?.html(detailsElement)
            }
        },

        _rerender: function (e) {
            if (e && e.change) {
                if (
                    e.change.attribute === 'isaMajorTrackingNetwork' ||
                    e.change.attribute === 'isAllowlisted' ||
                    e.change.attribute === 'totalTrackerNetworksCount'
                ) {
                    this._renderHeroTemplate()
                    this.unbindEvents()
                    this.setup()
                    this.setupClose()
                }
            }
        },
    }
)

export default TrackerNetworks
