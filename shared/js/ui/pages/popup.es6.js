import $ from 'jquery'
import Parent from '../base/page.es6.js'
import SiteView from './../views/site.es6.js'
import SiteModel from './../models/site.es6.js'
import BackgroundMessageModel from './../models/background-message.es6.js'
import siteTemplate from './../templates/site.es6.js'

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
