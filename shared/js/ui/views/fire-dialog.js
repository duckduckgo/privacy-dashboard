import $ from 'jquery'
import bel from 'bel'
import Parent from '../base/view.es6.js'
import { BurnMessage, FetchBurnOptions } from '../../browser/common.es6.js'

/**
 * @param {object} ops 
 * @constructor
 */
export function FireDialog(ops) {
    this.model = ops.model
    this.template = template
    Parent.call(this, ops)

    // fetch all the options for the model from the extension.
    // This tells us what options should be shown in the dropdown and what stats to display with
    // them.
    this.model.fetch(new FetchBurnOptions()).then((resp) => {
        this.model.fireOptions = resp.options
        // @ts-ignore
        this._rerender()
        // @ts-ignore
        this._setup()
    })
}

FireDialog.prototype = $.extend({}, Parent.prototype, {
    _setup: function () {
        this._cacheElems('#fire-button', ['burn', 'cancel', 'opts'])
        this.bindEvents([
            [this.$burn, 'click', this._onBurn],
            [this.$cancel, 'click', this._close],
            [this.$opts, 'change', this._updateSummary],
        ])
    },

    _onBurn: function () {
        const selectedOption = this.$opts[0].selectedIndex
        const opts = this.model.fireOptions[selectedOption].options
        this.model.fetch(new BurnMessage(opts)).then(() => {
            this._close()
        })
    },

    _close: function () {
        document.getElementById('fire-button-container')?.remove()
    },

    _updateSummary: function (ev) {
        const selectedOption = this.$opts[0].selectedIndex
        const opts = this.model.fireOptions[selectedOption]
        const summaryElement = $('#fire-button-summary')
        summaryElement.replaceWith(fireSummaryTemplate(opts))
    }
})

/**
 * @this {any}
 * @returns {null|HTMLElement}
 */
function template() {
    /**
     * @type {{
     *  fireOptions: import('../../../../schema/__generated__/schema.types.js').FireOption[]
     * }}
     */
    const { fireOptions } = this.model
    if (!fireOptions) {
        return bel`<dialog id="fire-button-container"></dialog>`
    }
    const selectOptions = fireOptions.map(({ name }) => bel`<option>${name}</option>`)
    const summary = fireSummaryTemplate(fireOptions[0])
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
            ${summary}
            <button id="fire-button-burn">🔥 Close tabs and clear data</button>
            <button id="fire-button-cancel">Cancel</button>
        </div>
    </dialog>`
}

/**
 * Generate a string to describe what will be burned.
 * @param {import('../../../../schema/__generated__/schema.types.js').FireOption} selectedOption
 * @returns {null|HTMLElement}
 */
function fireSummaryTemplate(selectedOption) {
    const { descriptionStats } = selectedOption
    return bel`<p id="fire-button-summary">
        ${descriptionStats.openTabs ? `Close ${descriptionStats.openTabs} tabs, ` : ''}
        ${descriptionStats.history ? `clear ${descriptionStats.history} browsing history ` : ''}
        ${descriptionStats.openTabs || descriptionStats.history ? 'and ' : ''}
        delete cookies on ${descriptionStats.cookies} sites?
    </p>`
}
