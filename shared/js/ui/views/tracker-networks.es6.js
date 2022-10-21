import $ from 'jquery'
import ParentSlidingSubview from './sliding-subview.es6.js'
import { heroTemplate } from './../templates/shared/hero.es6.js'
import CompanyListModel from './../models/site-company-list.es6.js'
import SiteModel from './../models/site.es6.js'

function TrackerNetworks (ops) {
    // model data is async
    this.model = null
    this.currentModelName = null
    this.currentSiteModelName = null
    this.template = ops.template
    this.heroFn = ops.heroFn

    // @ts-ignore
    ParentSlidingSubview.call(this, ops)

    // @ts-ignore
    this.renderAsyncContent()
}

TrackerNetworks.prototype = $.extend({},
    // @ts-ignore
    ParentSlidingSubview.prototype,
    {

        /** @this {any} */
        setup: function () {
            this._cacheElems('.js-tracker-networks', [
                'hero',
                'details'
            ])

            this.bindEvents([[
                this.store.subscribe,
                `change:${this.currentSiteModelName}`,
                this._rerender
            ]])
        },
        /** @this {any} */
        renderAsyncContent: function () {
            const random = Math.round(Math.random() * 100000)
            this.currentModelName = 'siteCompanyList' + random
            this.currentSiteModelName = 'site' + random

            this.model = new CompanyListModel({
                modelName: this.currentModelName
            })
            this.model.fetchAsyncData().then(() => {
                this.model.site = new SiteModel({
                    modelName: this.currentSiteModelName
                })
                this.model.site.getBackgroundTabData().then(() => {
                    const content = this.template()
                    this.$el.append(content)
                    this.setup()
                    this.setupClose()
                })
            })
        },

        _renderHeroTemplate: function () {
            if (this.model.site) {
                /** @type {import('./../models/site.es6.js').PublicSiteModel} */
                const site = this.model.site
                const icon = this.heroFn?.(site.tab.requestDetails, site.protectionsEnabled)
                // todo(Shane): Fix this next
                this.$hero.html(heroTemplate({
                    status: icon
                }))
            }
        },

        _rerender: function (e) {
            if (e && e.change) {
                if (e.change.attribute === 'isaMajorTrackingNetwork' ||
                    e.change.attribute === 'isAllowlisted' ||
                    e.change.attribute === 'totalTrackerNetworksCount') {
                    this._renderHeroTemplate()
                    this.unbindEvents()
                    this.setup()
                    this.setupClose()
                }
            }
        }
    }
)

export default TrackerNetworks
