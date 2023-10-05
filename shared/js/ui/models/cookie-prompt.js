import $ from 'jquery'
import Parent from '../base/model.js'
import { OpenSettingsMessages } from '../../browser/common.js'

/** @this {any} */
export function CookiePromptModel(attrs) {
    this.isCosmetic = attrs.isCosmetic
    Parent.call(this, attrs)
}

CookiePromptModel.prototype = $.extend({}, Parent.prototype, {
    modelName: 'cookiePrompt',
    openSettings: function (_category) {
        this.fetch(
            new OpenSettingsMessages({
                target: 'cpm',
            })
        )
    },
})
