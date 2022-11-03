import $ from 'jquery'
import Parent from '../base/model.es6'

/** @this {any} */
function BreakageFormModel(attrs) {
    attrs = attrs || {}
    Parent.call(this, attrs)
}

BreakageFormModel.prototype = $.extend({}, Parent.prototype, {
    modelName: 'breakageForm',
    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    submitBreakageForm: function (category, description) {
        try {
            this.fetch({ submitBrokenSiteReport: { category, description } })
        } catch (e) {
            console.error('submitBreakageForm error', e)
        }
    },
})
export { BreakageFormModel }
