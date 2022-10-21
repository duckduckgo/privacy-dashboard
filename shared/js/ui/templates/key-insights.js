import bel from 'bel'
import raw from 'bel/raw'
import { i18n } from '../base/localize.es6'
import { normalizeCompanyName } from '../models/mixins/normalize-company-name.es6'
import { getColorId } from './shared/utils.es6'

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
export function renderKeyInsight (model) {
    const title = (text) => bel`<h1 class="token-title-3-em">${text}</h1>`
    if (model.httpsState === 'none') {
        return bel`
                <li class="key-insight key-insight--main">
                    <div class="large-icon-container hero-icon--insecure-connection"></div>
                    ${title(model.tab.domain)}
                    <div class="token-title-3">${raw(i18n.t('site:connectionDescriptionUnencrypted.title'))}</div>
                </li>
            `
    }

    // remote disabled
    if (model.isBroken) {
        let text = i18n.t('site:protectionsDisabledRemote.title')
        if (model.isDenylisted) {
            text = i18n.t('site:protectionsDisabledRemoteOverride.title')
        }
        return bel`
        <li class="key-insight key-insight--main">
            <div class="large-icon-container hero-icon--protections-off"></div>
            ${title(model.tab.domain)}
            <div class="note token-title-3">
               ${text}
            </div>
        </li>
    `
    }

    // user allow-listed
    if (!model.protectionsEnabled) {
        return bel`
            <li class="key-insight key-insight--main">
                <div class="large-icon-container hero-icon--protections-off"></div>
                ${title(model.tab.domain)}
                <div class="token-title-3">
                   ${raw(i18n.t('site:protectionsDisabled.title'))}
                </div>
            </li>
            `
    }

    if (model.isaMajorTrackingNetwork && model.tab.parentEntity) {
        const company = model.tab.parentEntity

        return bel`
                <li class="key-insight key-insight--main">
                    <div class="large-icon-container hero-icon--tracker-network"></div>
                        ${title(model.tab.domain)}
                        <div class="token-title-3">
                            ${raw(i18n.t('site:majorTrackingNetworkDesc.title', {
        companyDisplayName: company.displayName,
        companyPrevalence: Math.round(company.prevalence),
        blocked: model.tab.requestDetails.blocked.entitiesCount > 0
    }))}
                    </div>
                </li>
            `
    }

    if (model.tab.requestDetails.blocked.requestCount === 0) {
        if (model.tab.requestDetails.allowedSpecialCount() > 0) {
            return bel`
                <li class="key-insight key-insight--main">
                    <div class="large-icon-container hero-icon--info"></div>
                    ${title(model.tab.domain)}
                    <div class="token-title-3">${i18n.t('site:trackerNetworksSummaryAllowedOnly.title')}</div>
                </li>
            `
        }
        return bel`
                <li class="key-insight key-insight--main">
                    <div class="large-icon-container hero-icon--no-activity"></div>
                    ${title(model.tab.domain)}
                    <div class="token-title-3">${raw(i18n.t('site:trackerNetworksSummaryNone.title'))}</div>
                </li>
            `
    }

    const companyNames = model.tab.requestDetails.blockedCompanyNames()
    if (companyNames.length === 0) {
        return bel`
                <li class="key-insight key-insight--main">
                    <div class="large-icon-container hero-icon--trackers-blocked"></div>
                    ${title(model.tab.domain)}
                    <div class="token-title-3"><span>${raw(i18n.t('site:trackersBlockedDesc.title', generateCompanyNamesList(model)))}</span></div>
                </li>
            `
    }

    return bel`
            <li class="key-insight key-insight--main">
                ${renderCompanyIconsList(model)}
                ${title(model.tab.domain)}
                <div class="token-title-3"><span>${raw(i18n.t('site:trackersBlockedDesc.title', generateCompanyNamesList(model)))}</span></div>
            </li>
        `
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function generateCompanyNamesList (model) {
    // const companyNames = model.tab.requestDetails.companyNames();
    const blockedCompanyNames = model.tab.requestDetails.blockedCompanyNames()
    return {
        companyCount: blockedCompanyNames.length,
        othersCount: blockedCompanyNames.length - 4,
        firstCompany: blockedCompanyNames[0],
        secondCompany: blockedCompanyNames[1],
        thirdCompany: blockedCompanyNames[2],
        fourthCompany: blockedCompanyNames[3]
    }
}
/**
 * @param {import('../models/site.es6.js').PublicSiteModel} model
 */
function renderCompanyIconsList (model) {
    const companyNames = model.tab.requestDetails.blockedCompanyNames()

    if (companyNames.length === 0) return ''

    const topCompanies = companyNames.slice(0, 4)
    const remainingCount = companyNames.length - topCompanies.length
    const remainingCountIcon = remainingCount <= 0
        ? ''
        : bel`
            <span class="icon-positioner">
                <span class="site-info__tracker__icon-wrapper site-info__tracker__icon-wrapper--count">
                    <span class="site-info__tracker__count">+${remainingCount}</span>
                </span>
            </div>
            `
    const topCompaniesIcons = topCompanies.map((name, index) => {
        const slug = normalizeCompanyName(name)
        const locationClass = index === topCompanies.length - 1 ? 'first' : 'other'

        return bel`
            <span class="icon-positioner">
                <span class="site-info__tracker__icon-wrapper site-info__tracker__icon-wrapper--${locationClass}">
                    <span class="site-info__tracker__icon ${slug[0].toUpperCase()} color-${getColorId(slug)} ${slug}"></span>
                    <span class="site-info__tracker__blocked-icon"></span>
                </span>
            </span>
            `
    })

    return bel`
            <div class="large-icon-container tracker-icons">
                ${topCompaniesIcons}
                ${remainingCountIcon}
            </div>
        `
}
