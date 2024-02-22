import $ from 'jquery'
import ParentSlidingSubview from './sliding-subview.js'

/**
 * @param {object} ops
 * @param {() => HTMLElement} ops.template
 * @param {import("../models/breakage-form.js").BreakageFormModel} ops.model
 * @param {import('../models/site.js').PublicSiteModel} ops.mainModel
 * @param {boolean} ops.immediate
 * @constructor
 */
function BreakageFormView(ops) {
    this.model = ops.model
    this.mainModel = ops.mainModel
    this.template = ops.template
    this.immediate = ops.immediate
    // this.$root = $('.js-breakage-form')
    // @ts-ignore
    ParentSlidingSubview.call(this, ops)
    // @ts-ignore
    this._setup()
}

BreakageFormView.prototype = $.extend(
    {},
    // @ts-ignore
    ParentSlidingSubview.prototype,
    {
        roots: new Map(),
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

export { BreakageFormView }

/**
 * @param {object} ops
 * @param {() => HTMLElement} ops.template
 * @param {import("../models/breakage-form.js").BreakageFormModel} ops.model
 * @param {import('../models/site.js').PublicSiteModel} ops.mainModel
 * @param {boolean} ops.immediate
 * @constructor
 */
function SimpleBreakageReportView(ops) {
    this.model = ops.model
    this.mainModel = ops.mainModel
    this.template = ops.template
    this.immediate = ops.immediate
    // this.$root = $('.js-breakage-form')
    // @ts-ignore
    ParentSlidingSubview.call(this, ops)
    // @ts-ignore
    this._setup()
}

SimpleBreakageReportView.prototype = $.extend(
    {},
    // @ts-ignore
    ParentSlidingSubview.prototype,
    {
        roots: new Map(),
        _setup: function () {
            // this._cacheElems('.js-breakage-form', ['close', 'submit', 'element', 'dropdown', 'description'])
            // this.bindEvents([[this.$submit, 'click', this._submitForm]])
            console.log('setup!')
        },
        //
        // _submitForm: function () {
        //     const category = this.$dropdown.val()
        //     const description = this.$description.val()
        //     this.model.submitBreakageForm(category, description)
        //     this._showThankYouMessage()
        // },
        //
        // _showThankYouMessage: function () {
        //     this.$element[0].dataset.state = 'sent'
        // },
    }
)

export { SimpleBreakageReportView }
