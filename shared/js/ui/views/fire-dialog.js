import html from 'nanohtml'
import raw from 'nanohtml/raw'
import { i18n } from '../base/localize.js'

/**
 * Generate a string to describe what will be burned.
 * @param {import('../../../../schema/__generated__/schema.types.js').FireOption} selectedOption
 * @returns {null|HTMLElement}
 */
export function fireSummaryTemplate(selectedOption) {
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
        ${descriptionStats.site && descriptionStats.clearHistory
        ? html`<p class="fire-button-disclaimer">${i18n.t('firebutton:historyAndDownloadsNotAffected.title')}</p>`
        : null}
        ${descriptionStats.openTabs && descriptionStats.pinnedTabs
        ? html`<p class="fire-button-disclaimer">
                  ${raw(i18n.t('firebutton:summaryPinnedIgnored.title', { tabs: descriptionStats.pinnedTabs }))}
              </p>`
        : null}
    </div>`
}
