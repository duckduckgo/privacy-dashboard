import bel from 'bel'
import { i18n } from '../base/localize.es6'
import { largeHeroIcon } from './shared/hero.es6.js'
import { topNav } from './shared/top-nav'

const categories = [
    { category: i18n.t('report:videos.title'), value: 'videos' },
    { category: i18n.t('report:images.title'), value: 'images' },
    { category: i18n.t('report:comments.title'), value: 'comments' },
    { category: i18n.t('report:content.title'), value: 'content' },
    { category: i18n.t('report:links.title'), value: 'links' },
    { category: i18n.t('report:login.title'), value: 'login' },
    { category: i18n.t('report:paywall.title'), value: 'paywall' },
    { category: i18n.t('report:other.title'), value: 'other' },
]

export default function () {
    const icon = largeHeroIcon({
        status: 'breakage-form',
    })
    return bel`<section class="sliding-subview">
        <div class="breakage-form">
        ${topNav({ view: 'secondary' })}
        <div class="padding-x-double js-breakage-form-element" data-state="idle">
            <div class="key-insight">
                ${icon}
                <div class="breakage-form__advise">
                    <p class="token-title-3">${i18n.t('report:selectTheOptionDesc.title')}</p>
                </div>
                <div class="breakage-form__message">
                    <p class="token-title-3-em">${i18n.t('report:thankYou.title')}</p>
                    <p class="token-title-3">${i18n.t('report:yourReportWillHelpDesc.title')}</p>
                </div>
            </div>
            <div class="breakage-form__content">
                <div class="breakage-form__element">
                    <div class="form__group">
                        <div class="form__select breakage-form__input--dropdown">
                            <select class="js-breakage-form-dropdown">
                                <option value=''>${i18n.t('report:pickYourIssueFromTheList.title')}</option>
                                ${categories.map(function (item) {
                                    return bel`<option value=${item.value}>${item.category}</option>`
                                })}
                            </select>
                        </div>
                        <textarea class="form__textarea js-breakage-form-description" placeholder="${i18n.t(
                            'report:tellUsMoreDesc.title'
                        )}" maxlength="2500"></textarea>
                        <button class="form__submit token-label-em js-breakage-form-submit" role="button">${i18n.t(
                            'report:sendReport.title'
                        )}</button>
                    </div>
                    <div class="breakage-form__footer token-breakage-form-body">
                        ${i18n.t('report:reportsAreAnonymousDesc.title')}
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>`
}
