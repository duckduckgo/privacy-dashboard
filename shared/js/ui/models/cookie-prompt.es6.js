import $ from 'jquery'
import Parent from '../base/model.es6'
import { OpenSettingsMessages } from '../../browser/common.es6'

/** @this {any} */
export function CookiePromptModel(attrs) {
    this.isCosmetic = attrs.isCosmetic
    Parent.call(this, attrs)
}

CookiePromptModel.prototype = $.extend({}, Parent.prototype, {
    modelName: 'cookiePrompt',
    openSettings: function (category) {
        this.fetch(
            new OpenSettingsMessages({
                target: 'cpm',
            })
        )
    },
})
