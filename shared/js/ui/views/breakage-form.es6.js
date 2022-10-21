import $ from 'jquery'
import ParentSlidingSubview from './sliding-subview.es6.js'

/** @this {any} */
function BreakageForm (ops) {
    this.model = ops.model
    this.template = ops.template
    this.siteView = ops.siteView
    this.clickSource = ops.clickSource
    this.$root = $('.js-breakage-form')
    // @ts-ignore
    ParentSlidingSubview.call(this, ops)

    this._setup()
}

BreakageForm.prototype = $.extend({},
    // @ts-ignore
    ParentSlidingSubview.prototype,
    {
        _setup: function () {
            this._cacheElems('.js-breakage-form', [
                'close',
                'submit',
                'element',
                'dropdown',
                'description'
            ])
            this.bindEvents([
                [this.$close, 'click', this._closeForm],
                [this.$submit, 'click', this._submitForm]
            ])
        },

        _closeForm: function (e) {
            if (e) e.preventDefault()
            // reload page after closing form if user got to form from
            // toggling privacy protection. otherwise destroy view.
            if (this.clickSource === 'toggle') {
                this.siteView.closePopupAndReload(500)
            }
        },

        _submitForm: function () {
            const category = this.$dropdown.val()
            const description = this.$description.val()
            this.model.submitBreakageForm(category, description)
            this._showThankYouMessage()
        },

        _showThankYouMessage: function () {
            this.$element[0].dataset.state = 'sent'
            // reload page after form submission if user got to form from
            // toggling privacy protection, otherwise destroy view.
            if (this.clickSource === 'toggle') {
                this.siteView.closePopupAndReload(3500)
            }
        }
    }
)

export default BreakageForm
