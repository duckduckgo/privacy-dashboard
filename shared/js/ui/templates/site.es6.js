import bel from 'bel'
import { i18n } from '../base/localize.es6'
import { isAndroid, isIOS } from '../environment-check'
import { topNav } from './shared/hero.es6.js'
import { trackerNetworksText } from './shared/tracker-networks-text.es6.js'
import { protectionToggle } from './shared/protection-toggle'
import { thirdpartyText } from './shared/thirdparty-text.es6'
import { renderKeyInsight } from './key-insights'

const topNavSupported = isIOS() || isAndroid()

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
    const consentRow = bel`<li class="main-nav__row">${renderCookieConsentManaged(this.model)}</li>`

    return bel`
    <div class="site-info site-info--main">
        ${renderSearchWrapper(this.model)}
        ${topNavSupported ? topNav() : null}
        <div class="list-wrapper">
            <ul class="default-list card-list">
                ${renderKeyInsight(this.model)}
            </ul>
        </div>
        <div class="list-wrapper">
            <ul class="default-list card-list card-list--bordered main-nav token-body-em">
                <li class="main-nav__row js-site-show-page-connection">
                    ${renderConnection(this.model)}
                </li>
                <li class="main-nav__row js-site-show-page-trackers">
                    ${renderTrackerNetworksNew(this.model)}
                </li>
                <li class="main-nav__row js-site-show-page-non-trackers">
                    ${renderThirdPartyNew(this.model)}
                </li>
                ${this.model.tab?.consentManaged?.consentManaged ? consentRow : null}
            </ul>
        </div>
        ${protectionToggle(this.model)}
        ${renderEmailWrapper(this.model)}
        <div class="list-wrapper card-list--last">
            ${renderReportButton()}
        </div>
        ${renderManagePermissions(this.model)}
    </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderSearchWrapper(model) {
    if (model.tab?.search) {
        return bel`<section id="search-form-container"></section>`
    }
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderEmailWrapper(model) {
    if (model.tab?.emailProtection) {
        return bel`<div class="list-wrapper" id="email-alias-container"></div>`
    }
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderConnection(model) {
    const icon = model.httpsState === 'secure' ? 'icon-small--secure' : 'icon-small--insecure'

    return bel`
        <a href="javascript:void(0)" class="main-nav__item main-nav__item--link link-action link-action--dark" role="button" draggable="false">
            <span class="main-nav__icon ${icon}"></span>
            <span class="main-nav__text">${model.httpsStatusText}</span>
            <span class="main-nav__chev"></span>
        </a>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderTrackerNetworksNew(model) {
    const { title, icon } = trackerNetworksText(model.tab.requestDetails, model.protectionsEnabled)
    return bel`
        <a href="javascript:void(0)" class="main-nav__item main-nav__item--link link-action link-action--dark" role="button" draggable="false">
            <span class="main-nav__icon icon-small--${icon}"></span>
            <span class="main-nav__text">${title}</span>
            <span class="main-nav__chev"></span>
        </a>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderThirdPartyNew(model) {
    const { title, icon } = thirdpartyText(model.tab.requestDetails, model.protectionsEnabled)
    return bel`
        <a href="javascript:void(0)" class="main-nav__item main-nav__item--link link-action link-action--dark" role="button" draggable="false">
            <span class="main-nav__icon icon-small--${icon}"></span>
            <span class="main-nav__text">${title}</span>
            <span class="main-nav__chev"></span>
        </a>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderManagePermissions(model) {
    if (!model.permissions || model.permissions.length === 0) {
        return ''
    }

    const localizedPerms = localizePermissions(model.permissions)

    return bel`<ul class="default-list">
        <li class="site-info__li--manage-permissions">
            ${localizedPerms.map(({ key: permissionId, title, permission, options }, index) => {
                if (!model.permissions) return '' // todo(Shane): typescript issue
                return bel`<div class="site-info__page-permission ${
                    index !== model.permissions.length - 1 ? 'border-light--bottom--inner' : ''
                }">
                    <label>
                        <div>
                            <div class="site-info__page-permission__icon" data-icon=${permissionId}></div>
                            ${title}
                        </div>
                        <select class="js-site-permission" name="${permissionId}">
                            ${options.map(
                                ({ id, title }) => bel`<option value="${id}" ${permission === id ? 'selected' : ''}>${title}</option>`
                            )}
                        </select>
                    </label>
                </div>`
            })}
        </li>
    </ul>`
}

function renderReportButton() {
    return bel`<div class="report-breakage border-light--top">
            <a href="javascript:void(0)" class="js-site-report-broken link-action report-breakage__link" draggable="false">
                ${i18n.t('site:websiteNotWorkingQ.title')}
            </a>
        </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderCookieConsentManaged(model) {
    if (!model.tab?.consentManaged) return null

    const { consentManaged, optoutFailed } = model.tab.consentManaged
    if (consentManaged && !optoutFailed) {
        return bel`
            <div class="main-nav__item">
                <span class="main-nav__icon icon-small--secure"></span>
                <span class="main-nav__text">${i18n.t('site:cookiesMinimized.title')}</span>
            </div>
        `
    }
    return bel``
}

function localizePermissions(permissions) {
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
