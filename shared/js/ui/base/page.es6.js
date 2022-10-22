// @ts-nocheck
import $ from 'jquery'
import mixins from './mixins/index.es6.js'
import store from './store.es6.js'

function BasePage(ops) {
    this.views = {}
    this.store = store
    this.ready()
}

BasePage.prototype = $.extend({}, mixins.events, {
    // pageName: '' - should be unique, defined by each page subclass

    ready: function () {},
})

export default BasePage
