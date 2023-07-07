import $ from 'jquery'
import html from 'nanohtml'
import raw from 'nanohtml/raw'
import Parent from '../base/view.js'
import { i18n } from '../base/localize.js'
import { BurnMessage, FetchBurnOptions, SetBurnDefaultOption } from '../../browser/common.js'

/**
 * @param {object} ops
 * @constructor
 */
export function FireDialog(ops) {
    this.model = ops.model
    this.template = template
    // fetch all the options for the model from the extension.
    // This tells us what options should be shown in the dropdown and what stats to display with
    // them.
    this.model.fetch(new FetchBurnOptions()).then((resp) => {
        this.model.fireOptions = resp.options
        Parent.call(this, ops)
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
        this.model.fetch(new SetBurnDefaultOption(opts.name))
        const summaryElement = $('#fire-button-summary')
        summaryElement.replaceWith(fireSummaryTemplate(opts))
    },
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
        return html`<dialog id="fire-button-container"></dialog>`
    }
    const selectedOptionIndex = fireOptions.findIndex(({ selected }) => selected)
    const selectedOption = fireOptions[selectedOptionIndex >= 0 ? selectedOptionIndex : 0]
    const selectOptions = fireOptions.map(
        ({ name, selected }) => html`<option ${selected ? 'selected' : ''}>${i18n.t(`firebutton:option${name}.title`)}</option>`
    )
    const summary = fireSummaryTemplate(selectedOption)
    return html` <dialog id="fire-button-container" open>
        <div id="fire-button-content">
            <span id="fire-button-header">
                <img src="../img/fire-button-header.svg" />
                <h3>
                    ${selectedOption.descriptionStats.clearHistory
                        ? i18n.t('firebutton:fireDialogHeader.title')
                        : i18n.t('firebutton:clearData.title')}
                </h3>
            </span>
            <select id="fire-button-opts">
                ${selectOptions}
            </select>
            ${summary}
            <div id="fire-button-row">
                <button id="fire-button-cancel">${i18n.t('firebutton:cancel.title')}</button>
                <button id="fire-button-burn">${i18n.t('firebutton:clearData.title')}</button>
            </div>
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
    let template = 'firebutton:summary'
    if (descriptionStats.clearHistory && descriptionStats.openTabs) {
        template += 'ClearTabsHistory'
    } else if (descriptionStats.clearHistory && !descriptionStats.openTabs) {
        template += 'ClearHistory'
    } else if (!descriptionStats.clearHistory && descriptionStats.openTabs) {
        template += 'ClearTabs'
    } else {
        template += 'ClearCookies'
    }
    if (descriptionStats.site) {
        template += 'Site'
    } else if (descriptionStats.duration === 'all') {
        template += 'All'
    } else {
        template += 'Duration'
    }
    template += '.title'
    return html`<div id="fire-button-summary">
        <p>
            ${raw(
                i18n.t(template, {
                    durationDesc: i18n.t('firebutton:historyDuration.title', { duration: descriptionStats.duration }),
                    ...descriptionStats,
                })
            )}
        </p>
        ${descriptionStats.site
            ? html`<p class="fire-button-disclaimer">${i18n.t('firebutton:historyAndDownloadsNotAffected.title')}</p>`
            : null}
        ${descriptionStats.openTabs && descriptionStats.pinnedTabs
            ? html`<p class="fire-button-disclaimer">
                  ${raw(i18n.t('firebutton:summaryPinnedIgnored.title', { tabs: descriptionStats.pinnedTabs }))}
              </p>`
            : null}
    </div>`
}
