import $ from 'jquery'
import Parent from '../base/model.js'
import { SubmitBrokenSiteReportMessage } from '../../browser/common.js'

/**
 * @param {{site: import("./site").default, opener: string}} attrs
 * @constructor
 */
function BreakageFormModel(attrs) {
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
