import $ from 'jquery'
import bel from 'bel'
import Parent from '../base/view.es6.js'
import { BurnMessage } from '../../browser/common.es6.js'

/**
 * @param {object} ops 
 * @constructor
 */
export function FireDialog(ops) {
    this.model = ops.model
    this.template = template
    Parent.call(this, ops)
    // @ts-ignore
    this._setup()
}

FireDialog.prototype = $.extend({}, Parent.prototype, {
    _setup: function () {
        this._cacheElems('#fire-button', ['burn', 'cancel', 'opts'])
        this.bindEvents([
            [this.$burn, 'click', this._onBurn],
            [this.$cancel, 'click', this._close]
        ])
    },

    _onBurn: function () {
        const selectedOption = this.$opts[0].selectedIndex
        const opts = fireOptions[selectedOption][1]
        this.model.fetch(new BurnMessage(opts))
    },

    _close: function () {
        document.getElementById('fire-button-container')?.remove()
    }
})

const ONE_HOUR = 60 * 60 * 1000
const fireOptions = [
    ['All time', {}],
    ['Last hour', { since: Date.now() - ONE_HOUR }],
    ['Last 24 hours', { since: Date.now() - (ONE_HOUR * 24) }],
    // ['Current site only', { currentSiteOnly: true }]
]

function template() {
    const selectOptions = fireOptions.map((opt) => bel`<option>${opt[0]}</option>`)
    return bel`
    <dialog id="fire-button-container" open>
        <div id="fire-button-content">
            <span id="fire-button-header">
                <img src="../img/fire-button-header.svg" />
                <h3>Clear browsing history and data</h3>
            </span>
            <select id="fire-button-opts">
                ${selectOptions}
            </select>
            <button id="fire-button-burn">🔥 Close tabs and clear data</button>
            <button id="fire-button-cancel">Cancel</button>
        </div>
    </dialog>`
}
