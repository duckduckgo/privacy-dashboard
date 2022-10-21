import bel from 'bel'
import { i18n } from '../base/localize.es6'
import { topNav } from './shared/hero.es6.js'
import { trackerNetworksText } from './shared/tracker-networks-text.es6.js'
import { protectionToggle } from './shared/protection-toggle'
import { thirdpartyText } from './shared/thirdparty-text.es6'
import { renderKeyInsight } from './key-insights'
import { isAndroid, isIOS } from '../environment-check'

const topNavSupported = isIOS() || isAndroid();

/** @this {{model: import('../models/site.es6.js').PublicSiteModel}} */
export default function () {
    // here we'll show CTAs when the tab is disabled
    const supportsCtaScreens = Boolean(this.model.tab?.ctaScreens)
    if (this.model.disabled && supportsCtaScreens) {
        return bel`
            <div class="site-info site-info--main">
                ${renderSearchWrapper(this.model)}
                <div class="list-wrapper" id="cta-rotation"></div>
                ${renderEmailWrapper(this.model)}
            </div>
        `
    }
    // console.log('this.model.tab.requestDetails.state(true)', this.model.tab.requestDetails.state(this.model.protectionsEnabled))

    return bel`
    <div class="site-info site-info--main">
    ${renderSearchWrapper(this.model)}
    ${topNavSupported ? topNav() : null}
    <div class="list-wrapper" data-test-id="key-insight">
        <ul class="default-list card-list">
            ${renderKeyInsight(this.model)}
        </ul>
    </div>
    <div class="list-wrapper">
        <ul class="default-list card-list card-list--bordered token-body-em" data-test-id="list-links">
            <li class="js-site-show-page-connection site-info__li--https-status">
                <a href="javascript:void(0)" class="link-action" role="button">
                    ${renderConnection(this.model)}
                </a>
            </li>
            <li class="js-site-tracker-networks js-site-show-page-trackers site-info__li--trackers border-light--top" data-test-id="tracker-list-link">
                <a href="javascript:void(0)" class="link-action" role="button">
                    ${renderTrackerNetworksNew(this.model)}
                </a>
            </li>
            <li class="js-site-show-page-non-trackers site-info__li--trackers border-light--top" data-test-id="thirdparty-list-link">
                <a href="javascript:void(0)" class="link-action" role="button">
                    ${renderThirdPartyNew(this.model)}
                </a>
            </li>
            ${renderCookieConsentManaged(this.model)}
        </ul>
    </div>
    ${protectionToggle(this.model)}
    ${renderEmailWrapper(this.model)}
    <div class="list-wrapper card-list--last">
        <ul class="default-list">
            <li class="js-site-manage-allowlist-li site-info__li--manage-allowlist border-light--top">
                ${renderManageAllowlist()}
            </li>
        </ul>
    </div>
    ${renderManagePermissions(this.model)}
</div>`
}

/**
* @param {import('../models/site.es6.js').PublicSiteModel} model
*/
function renderSearchWrapper (model) {
    if (model.tab?.search) {
        return bel`<section id="search-form-container"></section>`
    }
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderEmailWrapper (model) {
    if (model.tab?.emailProtection) {
        return bel`<div class="list-wrapper" id="email-alias-container"></div>`
    }
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderConnection (model) {
    return bel`<div>
            <div class="site-info__trackers">
                <span class="site-info__https-status__icon is-${model.httpsState}"></span>
                <span>${model.httpsStatusText}</span>
                <span class="icon icon__arrow pull-right"></span>
            </div>
        </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderTrackerNetworksNew (model) {
    const isActive = !model.isAllowlisted ? 'is-active' : ''
    const { title, icon } = trackerNetworksText(model.tab.requestDetails, model.protectionsEnabled)
    return bel`
        <div>
            <div class="site-info__trackers">
                <span class="site-info__trackers-status__icon icon-${icon}" data-test-id="trackerLink.icon"></span>
                <span class="${isActive}">${title}</span>
                <span class="icon icon__arrow pull-right"></span>
            </div>
        </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderThirdPartyNew (model) {
    const isActive = !model.isAllowlisted ? 'is-active' : ''
    const { title, icon } = thirdpartyText(model.tab.requestDetails, model.protectionsEnabled)
    return bel`
        <div>
            <div class="site-info__trackers">
                <span class="site-info__trackers-status__icon icon-${icon}" data-test-id="trackerLink.icon"></span>
                <span class="${isActive}">${title}</span>
                <span class="icon icon__arrow pull-right"></span>
            </div>
        </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderManagePermissions (model) {
    if (!model.permissions || model.permissions.length === 0) {
        return ''
    }

    const localizedPerms = localizePermissions(model.permissions)

    return bel`<ul class="default-list">
        <li class="site-info__li--manage-permissions">
            ${localizedPerms.map(({ key: permissionId, title, permission, options }, index) => {
        if (!model.permissions) return '' // todo(Shane): typescript issue
        return bel`<div class="site-info__page-permission ${index !== model.permissions.length - 1 ? 'border-light--bottom--inner' : ''}">
                    <label>
                        <div>
                            <div class="site-info__page-permission__icon" data-icon=${permissionId}></div>
                            ${title}
                        </div>
                        <select class="js-site-permission" name="${permissionId}">
                            ${options.map(({ id, title }) =>
        bel`<option value="${id}" ${permission === id ? 'selected' : ''}>${title}</option>`)
}
                        </select>
                    </label>
                </div>`
    })}
        </li>
    </ul>`
}

function renderManageAllowlist () {
    return bel`<div class="manage-allowlist">
            <a href="javascript:void(0)" class="js-site-report-broken site-info__report-broken">
                ${i18n.t('site:websiteNotWorkingQ.title')}
            </a>
        </div>`
}


/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderCookieConsentManaged (model) {
    if (!model.tab?.consentManaged) return bel``

    const { consentManaged, optoutFailed } = model.tab.consentManaged
    if (consentManaged && !optoutFailed) {
        return bel`
            <li class="js-site-show-consent-managed site-info__li--consent-managed border-light--top">
                <div>
                    <div class="site-info__trackers">
                        <span class="site-info__https-status__icon is-secure"></span>
                        <span>${i18n.t('site:cookiesMinimized.title')}</span>
                    </div>
                </div>
            </li>
            `
    }
    return bel``
}

function localizePermissions (permissions) {
    // deep copy before mutating
    const updatedPermissions = JSON.parse(JSON.stringify(permissions))

    return updatedPermissions.map((perm) => {
        const permKey = `permissions:${perm.key}.title`
        if (i18n.exists(permKey)) {
            perm.title = i18n.t(permKey)
        }

        perm.options = perm.options.map((option) => {
            const optionKey = `permissions:${option.id}.title`
            if (i18n.exists(optionKey)) {
                option.title = i18n.t(optionKey)
            }
            return option
        })

        return perm
    })
}
