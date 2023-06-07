import $ from 'jquery'
import Parent from '../base/model.js'
import browserUIWrapper from '../../browser/communication.js'
import { normalizeCompanyName } from './mixins/normalize-company-name.mjs'

/** @this {any} */
function SiteCompanyList(attrs) {
    attrs = attrs || {}
    attrs.tab = null
    attrs.companyList = []
    Parent.call(this, attrs)
}

SiteCompanyList.prototype = $.extend({}, Parent.prototype, normalizeCompanyName, {
    modelName: 'siteCompanyList',

    /** @this {any} */
    fetchAsyncData: function () {
        return new Promise((resolve, reject) => {
            browserUIWrapper.getBackgroundTabData().then(({ tab }) => {
                if (tab) {
                    this.tab = tab
                }
                resolve(null)
            })
        })
    },
})

export default SiteCompanyList
