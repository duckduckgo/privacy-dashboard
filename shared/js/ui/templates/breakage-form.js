import html from 'nanohtml'
import { i18n, ns } from '../base/localize.js'
import { largeHeroIcon } from './shared/hero.js'
import { topNav } from './shared/top-nav'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, h } from 'preact'
import { ProtectionHeader } from './protection-header'

/**
 * @this {{
 *     mainModel: import('../models/site.js').PublicSiteModel,
 *     roots: Map<HTMLElement, boolean>
 * }}
 */
export default function () {
    const categories = [
        { category: ns.report('blocked.title'), value: 'blocked' },
        { category: ns.report('layout.title'), value: 'layout' },
        { category: ns.report('emptySpaces.title'), value: 'empty-spaces' },
        { category: ns.report('paywall.title'), value: 'paywall' },
        { category: ns.report('videos.title'), value: 'videos' },
        { category: ns.report('comments.title'), value: 'comments' },
        { category: ns.report('login.title'), value: 'login' },
        { category: ns.report('shopping.title'), value: 'shopping' },
        { category: ns.report('browser.title'), value: 'browser' },
        { category: ns.report('other.title'), value: 'other' },
    ]
    const icon = largeHeroIcon({
        status: 'breakage-form',
    })

    let bullet = '\u000A • '
    let placeholder = ns.report('tellUsMoreDesc.title', { bullet })

    return html`<section class="sliding-subview">
        <div class="breakage-form">
            ${topNav({ view: 'secondary' })}
            <div class="breakage-form__inner padding-x-double js-breakage-form-element" data-state="idle">
                <div class="padding-y">${wrap(this.mainModel, this)}</div>
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
                                    <option value="">${i18n.t('report:pickYourIssueFromTheList.title')}</option>
                                    ${categories.map(function (item) {
                                        return html`<option value=${item.value}>${item.category}</option>`
                                    })}
                                </select>
                            </div>
                            <textarea
                                class="form__textarea js-breakage-form-description"
                                placeholder="${placeholder}"
                                maxlength="2500"
                            ></textarea>
                            <button class="form__submit token-label-em js-breakage-form-submit" role="button">
                                ${i18n.t('report:sendReport.title')}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="breakage-form__footer token-breakage-form-body">${i18n.t('report:reportsAreAnonymousDesc.title')}</div>
            </div>
        </div>
    </section>`
}

function wrap(model, view) {
    const root = html`<div></div>`
    const migrationModel = {
        protectionsEnabled: model.protectionsEnabled,
        isAllowlisted: model.isAllowlisted,
        isDenylisted: model.isDenylisted,
        platformFeatures: model.features,
        isBroken: model.isBroken,
        toggleAllowlist: model.toggleAllowlist.bind(model),
    }
    view.roots.set(root, true)
    render(<ProtectionHeader model={migrationModel} initialState={'site-not-working'} />, root)
    return root
}
