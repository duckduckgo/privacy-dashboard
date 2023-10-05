import html from 'nanohtml'
import { i18n } from '../base/localize.js'
import { paddedToggle } from './shared/protection-toggle'
import { topNav } from './shared/top-nav'
import { protectionHeader } from './protection-header'

/** @this {{model: import('../models/site.js').PublicSiteModel}} */
export default function () {
    // here we'll show CTAs when the tab is disabled
    const supportsCtaScreens = Boolean(this.model.tab?.ctaScreens)
    if (this.model.tab.error) {
        const errorText = i18n.t('site:errorMessage.title')
        return html`
            <div class="site-info">
                <div class="page-inner">
                    ${renderSearchWrapper(this.model)}
                    <div class="padding-x">
                        <div class="cta-screen">
                            <p class="note token-title-3 text--center">${errorText}</p>
                        </div>
                    </div>
                    <div class="padding-x"></div>
                </div>
            </div>
        `
    }
    if (this.model.disabled && supportsCtaScreens) {
        return html`
            <div class="site-info">
                <div class="page-inner">
                    ${renderSearchWrapper(this.model)}
                    <div class="padding-x">
                        <div id="cta-rotation"></div>
                    </div>
                    <div class="padding-x">${renderEmailWrapper(this.model)}</div>
                </div>
            </div>
        `
    }
    const permissions = localizePermissions(this.model.permissions)

    const layout = this.model.featureSettings.primaryScreen.layout

    // prettier-ignore
    return html` <div class="site-info page">
        ${renderSearchWrapper(this.model)} ${topNav({ view: 'primary' })}
        <div class="page-inner" data-with-permissions=${permissions.length > 0}>
            ${layout === 'highlighted-protections-toggle' ? protectionHeader(this.model) : null}
            <div class="padding-x-double">
                <div id="key-insight"></div>
            </div>
            <div class="padding-x">
                <nav id="main-nav"></nav>
                ${layout === 'default' ? paddedToggle(this.model) : null}
            </div>
            <div class="padding-x">
                ${renderEmailWrapper(this.model)} 
                ${layout === 'default' ? renderReportButton() : null}  
            </div>
        </div>
        ${permissions.length ? outer({ children: renderManagePermissions(this.model) }) : null}
    </div>`
}

function outer(props) {
    return html`<div class="page-outer">${props.children}</div>`
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderSearchWrapper(model) {
    if (model.tab?.search) {
        return html`<section id="search-form-container"></section>`
    }
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderEmailWrapper(model) {
    if (model.tab?.emailProtection) {
        return html`<div id="email-alias-container"></div>`
    }
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 */
function renderManagePermissions(model) {
    if (!model.permissions || model.permissions.length === 0) {
        return ''
    }

    const localizedPerms = localizePermissions(model.permissions)

    return html` <ul class="default-list">
        <li class="site-info__li--manage-permissions">
            ${localizedPerms.map(({ key: permissionId, title, permission, options }) => {
                if (!model.permissions) return '' // todo(Shane): typescript issue
                return html`<div class="site-info__page-permission">
                    <label>
                        <div>
                            <div class="site-info__page-permission__icon" data-icon=${permissionId}></div>
                            ${title}
                        </div>
                        <select class="js-site-permission" name="${permissionId}">
                            ${options.map(
                                ({ id, title }) => html`<option value="${id}" ${permission === id ? 'selected' : ''}>${title}</option>`
                            )}
                        </select>
                    </label>
                </div>`
            })}
        </li>
    </ul>`
}

function renderReportButton() {
    return html`<div class="text--center border-light--top">
        <a href="javascript:void(0)" class="js-site-report-broken link-action link-action--text" draggable="false">
            ${i18n.t('site:websiteNotWorkingQ.title')}
        </a>
    </div>`
}

/**
 * @param permissions
 * @returns {any[]}
 */
function localizePermissions(permissions) {
    if (!Array.isArray(permissions) || permissions.length === 0) {
        return []
    }
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
