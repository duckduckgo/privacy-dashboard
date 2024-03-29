import $ from 'jquery'
import html from 'nanohtml'
import { topNav } from '../templates/shared/top-nav'
import { heroTemplate, largeHeroIcon } from '../templates/shared/hero.js'
import { disableInSettingsLink } from '../templates/shared/links'
import { ns } from '../base/localize.js'
import ParentSlidingSubview from './sliding-subview.js'

/**
 * @param {object} ops
 * @param {import('../models/cookie-prompt.js').CookiePromptModel & import("../base/model.js").baseModelMethods} ops.model
 * @constructor
 */
export function CookiePromptView(ops) {
    this.model = ops.model
    this.template = template
    this.links = {
        disable: (e) => {
            e.preventDefault()
            this.model.openSettings('cpm')
        },
    }
    ParentSlidingSubview.call(this, ops)
}

CookiePromptView.prototype = $.extend(
    {},
    // @ts-ignore
    ParentSlidingSubview.prototype
)

/**
 * @this {CookiePromptView}
 * @returns {HTMLElement}
 */
function template() {
    const summary = this.model.isCosmetic ? ns.site('cookiesHiddenSummary.title') : ns.site('cookiesMinimizedSummary.title')
    const icon = largeHeroIcon({
        status: this.model.isCosmetic ? 'cookies-hidden' : 'cookies-managed',
    })

    const hero = heroTemplate({
        icon,
        summary,
        suffix: 'none',
    })
    return html`<section class="sliding-subview">
        <div class="card" data-page="cookie-prompt">
            ${topNav({ view: 'secondary' })}
            <div class="padding-x-double">${hero}</div>
            <div class="padding-x-double">
                <div class="padding-y border--top--inner text--center">${disableInSettingsLink(this.links.disable)}</div>
            </div>
        </div>
    </section> `
}
