import bel from 'bel'
import { i18n } from '../../base/localize.es6'

export default function (ops) {
    return bel`
        <div class="hero-wrapper">
            <div class="hero text--center ${ops.className || ''}">
                <a href="javascript:void(0)"
                    class="hero__close js-sliding-subview-close js-site-done link-action"
                    role="button"
                    aria-label="${i18n.t('site:navigationBack.title')}"
                    data-test-id="back-button"
                >
                    <span class="icon icon__back-arrow" data-icon-text="${i18n.t('site:navigationBack.title')}"></span>
                </a>
                <a href="javascript:void(0)"
                    class="hero__done js-sliding-subview-done js-site-done link-action"
                    role="button"
                >
                    ${i18n.t('site:navigationComplete.title')}
                </a>
            </div>
             <div class="hero__icon hero__icon--${ops.status}"></div>
        </div>
    `
}
