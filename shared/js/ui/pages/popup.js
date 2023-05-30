import $ from 'jquery'
import Parent from '../base/page.js'
import SiteView from './../views/site.js'
import SiteModel from './../models/site.js'
import BackgroundMessageModel from './../models/background-message.js'
import siteTemplate from './../templates/site.js'

function Trackers(ops) {
    /** @type {BackgroundMessageModel | null} */
    this.message = null
    this.views = {
        /** @type {SiteView | null} */
        site: null,
    }
    this.$parent = $('#popup-container')
    Parent.call(this, ops)
}

Trackers.prototype = $.extend({}, Parent.prototype, {
    pageName: 'popup',

    /**
     * @this {Trackers}
     */
    ready: function () {
        Parent.prototype.ready.call(this)
        this.message = new BackgroundMessageModel()
        this.views.site = new SiteView({
            pageView: this,
            model: new SiteModel(),
            appendTo: $('#site-info-container'),
            template: siteTemplate,
        })
    },
})

// kickoff!
export function initPopup() {
    return new Trackers()
}
