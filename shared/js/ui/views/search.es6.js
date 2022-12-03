import $ from 'jquery'
import Parent from '../base/view.es6'
const FOCUS_CLASS = 'go--focused'

/** @this {any} */
function Search(ops) {
    this.model = ops.model
    this.pageView = ops.pageView
    this.template = ops.template
    Parent.call(this, ops)

    this._cacheElems('.js-search', ['form', 'input', 'go', 'cog-button'])

    this.bindEvents([
        [this.$input, 'input', this._handleInput],
        [this.$input, 'blur', this._handleBlur],
        [this.$go, 'click', this._handleSubmit],
        [this.$form, 'submit', this._handleSubmit],
        [this.$cogbutton, 'click', this._handleCogClick],
    ])
}

Search.prototype = $.extend({}, Parent.prototype, {
    // Hover effect on search button while typing
    _addHoverEffect: function () {
        if (!this.$go.hasClass(FOCUS_CLASS)) {
            this.$go.addClass(FOCUS_CLASS)
        }
    },

    _removeHoverEffect: function () {
        if (this.$go.hasClass(FOCUS_CLASS)) {
            this.$go.removeClass(FOCUS_CLASS)
        }
    },

    _handleBlur: function (e) {
        this._removeHoverEffect()
    },

    _handleInput: function (e) {
        const searchText = this.$input.val()
        this.model.set('searchText', searchText)

        if (searchText.length > 0) {
            this._addHoverEffect()
        } else {
            this._removeHoverEffect()
        }
    },

    _handleSubmit: function (e) {
        e.preventDefault()
        this.model.doSearch(this.$input.val())
    },

    _handleCogClick: function (e) {
        e.preventDefault()
        this.model.openOptionsPage()
    },
})

export default Search
