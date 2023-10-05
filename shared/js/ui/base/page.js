import $ from 'jquery'
import * as mixins from './mixins/index.js'
import * as store from './store.js'

/**
 * @param _ops
 * @constructor
 */
function BasePage(_ops) {
    this.views = {}
    this.store = store
    // @ts-ignore
    this.ready()
}

BasePage.prototype = $.extend({}, mixins.events, {
    // pageName: '' - should be unique, defined by each page subclass

    ready: function () {},
})

export default BasePage
