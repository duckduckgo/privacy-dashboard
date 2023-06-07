import html from 'nanohtml'
import raw from 'nanohtml/raw'
import { isBrowser } from '../../environment-check'
import { i18n } from '../../base/localize.js'
import { toggleButton } from './toggle-button.js'

export const renderUpdatingSpinner = () => {
    return html`<img src="../img/spinner.svg" class="toggle-spinner" alt="${i18n.t('site:updatingProtectionList.title')}" />`
}

/**
 * @param {import('../../models/site.js').PublicSiteModel} model
 * @returns {HTMLElement}
 */
export function protectionToggle(model) {
    let text = i18n.t('site:protectionsEnabled.title')
    let active = true
    let disabled = false

    if (!model.protectionsEnabled) {
        text = i18n.t('site:protectionsDisabled.title')
        active = false
    }

    /**
     * Only the `extension` can toggle protections back ON (currently)
     * So for all other platforms, a 'broken site' means that we disable the toggle
     */
    if (model.isBroken) {
        if (!isBrowser()) {
            disabled = true
            active = false
        }
    }

    const protectionToggle = toggleButton(active, 'js-site-toggle', disabled)

    return html`<div class="site-info__protection-wrapper">
        <ul class="default-list">
            <li class="site-info__li--toggle ${active ? 'is-active' : ''}">
                <p class="site-info__protection"><span role="text">${raw(text)}</span></p>
                <div class="site-info__toggle-container js-site-toggle-parent">${protectionToggle}</div>
            </li>
        </ul>
    </div>`
}
