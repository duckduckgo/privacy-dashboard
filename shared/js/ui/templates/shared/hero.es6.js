import bel from 'bel'
import { i18n } from '../../base/localize.es6'

/**
 * @param {object} ops
 * @param {string} ops.status
 * @param {boolean} [ops.topNav]
 * @param {string} [ops.className]
 */
export function heroTemplate (ops) {
    return bel`
        <div class="hero-wrapper">
             ${ops.topNav ? topNav() : null}
        </div>
    `
}

/**
 * @param {object} ops
 * @param {string} ops.status
 */
export function largeHeroIcon (ops) {
    return bel`<div class="large-icon-container hero-icon--${ops.status}"></div>`
}

export function topNav () {
    return bel`
    <div>
        <div class="top-nav text--center">
            <a href="javascript:void(0)"
                class="top-nav__close js-sliding-subview-close js-site-done link-action"
                role="button"
                aria-label="${i18n.t('site:navigationBack.title')}"
                data-test-id="back-button"
            >
                <span class="icon icon__back-arrow" data-icon-text="${i18n.t('site:navigationBack.title')}"></span>
            </a>
            <a href="javascript:void(0)"
                class="top-nav__done js-sliding-subview-done js-site-done link-action"
                role="button"
            >
                ${i18n.t('site:navigationComplete.title')}
            </a>
        </div>    
        <div style="height: 56px"></div>
    </div>
`
}
