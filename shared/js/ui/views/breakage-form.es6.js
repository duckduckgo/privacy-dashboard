import $ from 'jquery'
import ParentSlidingSubview from './sliding-subview.es6.js'

/**
 * @param {object} ops
 * @param {() => HTMLElement} ops.template
 * @param {import("../models/breakage-form.es6").BreakageFormModel} ops.model
 * @constructor
 */
function BreakageForm(ops) {
    this.model = ops.model
    this.template = ops.template
    this.$root = $('.js-breakage-form')
    // @ts-ignore
    ParentSlidingSubview.call(this, ops)
    // @ts-ignore
    this._setup()
}

BreakageForm.prototype = $.extend(
    {},
    // @ts-ignore
    ParentSlidingSubview.prototype,
    {
        _setup: function () {
            this._cacheElems('.js-breakage-form', ['close', 'submit', 'element', 'dropdown', 'description'])
            this.bindEvents([[this.$submit, 'click', this._submitForm]])
        },

        _submitForm: function () {
            const category = this.$dropdown.val()
            const description = this.$description.val()
            this.model.submitBreakageForm(category, description)
            this._showThankYouMessage()
        },

        _showThankYouMessage: function () {
            this.$element[0].dataset.state = 'sent'
        },
    }
)

export default BreakageForm
