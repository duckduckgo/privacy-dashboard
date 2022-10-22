import $ from 'jquery'
import Parent from '../base/view.es6.js'

function UserData(ops) {
    this.model = ops.model
    this.pageView = ops.pageView
    this.template = ops.template

    Parent.call(this, ops)

    // bind events
    // @ts-ignore
    this.setup()
}

UserData.prototype = $.extend({}, Parent.prototype, {
    _logout: function (e) {
        e.preventDefault()
        this.model.logout()
    },

    setup: function () {
        this._cacheElems('.js-userdata', ['logout'])

        this.bindEvents([
            [this.$logout, 'click', this._logout],
            // listen for changes to the userData model
            [this.store.subscribe, 'change:userData', this.rerender],
        ])
    },

    rerender: function () {
        this.unbindEvents()
        this._rerender()
        this.setup()
    },
})

export default UserData
