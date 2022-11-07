import $ from 'jquery'
import Parent from '../base/model.es6'
import { SubmitBrokenSiteReportMessage } from '../../browser/common.es6'

/** @this {any} */
function BreakageFormModel(attrs) {
    attrs = attrs || {}
    Parent.call(this, attrs)
}

BreakageFormModel.prototype = $.extend({}, Parent.prototype, {
    modelName: 'breakageForm',
    /** @this {import('./site.es6').LocalThis} */
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
