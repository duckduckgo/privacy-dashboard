import $ from 'jquery'
import { z } from 'zod'
import Parent from '../base/model.es6'
import { RefreshEmailAliasMessage } from '../../browser/common.es6'

/** @this {any} */
function EmailProtectionModel(attrs) {
    attrs = attrs || {}
    if (!('emailProtectionUserData' in attrs)) {
        throw new Error('`emailProtectionUserData` is required for EmailProtectionModel')
    }
    Parent.call(this, attrs)
    this._setup()
}

/**
 * @typedef {object} UserData
 * @property {string} cohort
 * @property {string} nextAlias
 * @property {string} token
 * @property {string} userName
 */

EmailProtectionModel.prototype = $.extend({}, Parent.prototype, {
    modelName: 'emailProtection',
    /**
     * @type {UserData | null}
     */
    emailProtectionUserData: null,
    /**
     * A state enum the UI can use to decide what to render.
     *
     * 'unknown' - this means we don't have sufficient data to determine the current state
     * 'idle' - this means we are able to provide an alias, but nothing is currently happening
     * 'added' - this is a temporary state that is entered into following use of the alias.
     *
     * @type {"unknown" | "idle" | "added"}
     */
    state: 'unknown',

    /**
     * From the initial data, decide what the first state should be
     * @private
     */
    _setup() {
        if (this.emailProtectionUserData?.nextAlias) {
            this.state = 'idle'
        }
    },

    /**
     * @this {import('./site.es6').LocalThis}
     * @returns {*}
     */
    refreshAlias: function () {
        return this.fetch(new RefreshEmailAliasMessage()).then((resp) => {
            const response = z.object({
                privateAddress: z.string().optional(),
            })
            const parsed = response.safeParse(resp)
            if (!parsed.success) {
                console.warn('response did not contain a valid private address', resp)
                this.emailProtectionUserData.nextAlias = null
            } else {
                this.emailProtectionUserData.nextAlias = parsed.data.privateAddress
            }
        })
    },
})

export default EmailProtectionModel
