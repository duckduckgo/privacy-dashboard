import $ from 'jquery'
import bel from 'bel'
import { topNav } from '../templates/shared/top-nav'
import { heroTemplate, largeHeroIcon } from '../templates/shared/hero.es6'
import { disableInSettingsLink } from '../templates/shared/links'
import { ns } from '../base/localize.es6'
import ParentSlidingSubview from './sliding-subview.es6.js'

/**
 * @param {object} ops
 * @param {import('../models/cookie-prompt.es6').CookiePromptModel & import("../base/model.es6.js").baseModelMethods} ops.model
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
    const summary = ns.site('cookiesMinimizedSummary.title')
    const icon = largeHeroIcon({
        status: 'cookies-managed',
    })

    const hero = heroTemplate({
        icon,
        summary,
        suffix: 'none',
    })
    return bel`<section class='sliding-subview'>
    <div class='card' data-page='cookie-prompt'>
        ${topNav({ view: 'secondary' })}
        <div class='padding-x-double'>
            ${hero}
        </div>
        <div class='padding-x-double'>        
            <div class='padding-y border--top--inner text--center'>
                ${disableInSettingsLink(this.links.disable)}
            </div>
        </div>
    </div>
</section>
    `
}
