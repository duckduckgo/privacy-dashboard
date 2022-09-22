const Parent = window.DDG.base.Model
const normalizeCompanyName = require('./mixins/normalize-company-name.es6')
const browserUIWrapper = require('../../browser/communication.es6.js')

/** @this {any} */
function SiteCompanyList (attrs) {
    attrs = attrs || {}
    attrs.tab = null
    attrs.companyList = []
    Parent.call(this, attrs)
}

SiteCompanyList.prototype = window.$.extend({},
    Parent.prototype,
    normalizeCompanyName,
    {

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
        }
    }
)

module.exports = SiteCompanyList
