import $ from 'jquery'
import Parent from '../base/view.js'

/**
 * Given a username, returns a valid email address with the duck domain
 * @param {string} address
 * @returns {string}
 */
const formatAddress = (address) => address + '@duck.com'

/** @this {any} */
function EmailProtectionView(ops) {
    this.model = ops.model
    this.pageView = ops.pageView
    this.template = ops.template
    Parent.call(this, ops)
    this._setup()
}

EmailProtectionView.prototype = $.extend({}, Parent.prototype, {
    _setup: function () {
        this.bindEvents([[this.store.subscribe, `change:${this.model.modelName}`, this._rerender]])
    },

    copyAlias: function () {
        // write to clipboard
        const alias = this.model.emailProtectionUserData.nextAlias
        navigator.clipboard?.writeText(formatAddress(alias))

        // update the UI to the 'added' state
        this.model.set('state', 'added')

        // this timeout doesn't need any cleanup because the UI
        // prevents submissions in the 'added' state
        setTimeout(() => {
            this.model.set('state', 'idle')
        }, 2000)

        // always refresh the alias once it was used
        this.model.refreshAlias().catch((e) => console.error(e))
    },
})

export default EmailProtectionView
