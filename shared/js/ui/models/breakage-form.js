import $ from 'jquery'
import Parent from '../base/model.js'
import { SubmitBrokenSiteReportMessage } from '../../browser/common.js'

/** @this {any} */
function BreakageFormModel(attrs) {
    attrs = attrs || {}
    Parent.call(this, attrs)
}

BreakageFormModel.prototype = $.extend({}, Parent.prototype, {
    modelName: 'breakageForm',
    /** @this {import('./site.js').LocalThis} */
    submitBreakageForm: function (category, description) {
        try {
            this.fetch(
                new SubmitBrokenSiteReportMessage({
                    category,
                    description,
                })
            )
        } catch (e) {
            console.error('submitBreakageForm error', e)
        }
    },
})
export { BreakageFormModel }
