import html from 'nanohtml'
import { i18n } from '../base/localize.js'
import { heroTemplate, largeHeroIcon } from './shared/hero.js'
import { topNav } from './shared/top-nav'

/**
 * @this {{
 *  model: {
 *      tab: import("../../browser/utils/request-details.mjs").TabData,
 *      site: import('../models/site.js').PublicSiteModel
 *   }
 * }}
 */
export default function () {
    if (!this.model) {
        return html`<section class="sliding-subview"></section>`
    }

    const summary = renderConnectionDescription(this.model.site, this.model.tab)
    const icon = largeHeroIcon({
        status: `connection-${this.model.site.httpsState}`,
    })

    const hero = heroTemplate({
        icon,
        summary,
        suffix: 'none',
    })

    return html` <div class="site-info card" data-page="connection">
        ${topNav({ view: 'secondary' })}
        <div class="padding-x-double">${hero} ${renderCertificateDetails(this.model.site, this.model.tab)}</div>
    </div>`
}

function getKeyUsage(key) {
    const capabilities = {
        canEncrypt: i18n.t('connection:encrypt.title'),
        canDecrypt: i18n.t('connection:decrypt.title'),
        canSign: i18n.t('connection:sign.title'),
        canVerify: i18n.t('connection:verify.title'),
        canDerive: i18n.t('connection:derive.title'),
        canWrap: i18n.t('connection:wrap.title'),
        canUnwrap: i18n.t('connection:unwrap.title'),
    }

    return Object.keys(capabilities).reduce((usage, capability) => {
        if (!key[capability]) return usage
        return [].concat(usage, capabilities[capability])
    }, [])
}

/**
 * @param {import('../models/site.js').PublicSiteModel} site
 * @param {import("../../browser/utils/request-details.mjs").TabData} tab
 */
export function renderCertificateDetails(site, tab) {
    if (site.httpsState === 'none' || !tab.certificate || tab.certificate.length === 0) return ''

    const certificate = tab.certificate[0]
    return html`
        <div>
            ${renderHeader(site, tab)}
            <div class="page-connection__certificate">
                <div class="page-connection__certificate-details">
                    <h3 class="token-body-em">${i18n.t('connection:certificateDetail.title')}</h3>
                    <div>
                        <span>${i18n.t('connection:commonName.title')}</span>
                        <span class="page-connection__certificate-value">${certificate.commonName}</span>
                    </div>
                    ${renderCertificateSummary(certificate)}
                </div>
                ${renderPublicKeyDetails(certificate)}
            </div>
        </div>
    `
}

function renderCertificateSummary(certificate) {
    if (!certificate.summary) return ''

    return html`<div>
        <span>${i18n.t('connection:summary.title')}</span>
        <span class="page-connection__certificate-value">${certificate.summary}</span>
    </div>`
}

function renderPublicKeyDetails(certificate) {
    if (!certificate.publicKey) return ''

    return html`<div class="page-connection__certificate-details">
        <h3 class="token-body-em">${i18n.t('connection:publicKey.title')}</h3>
        ${renderCertificateType(certificate.publicKey)} ${renderCertificateBitSize(certificate.publicKey)}
        ${renderCertificateEffectiveSize(certificate.publicKey)} ${renderCertificateKeyUsage(certificate.publicKey)}
        ${renderCertificateIsPermanent(certificate.publicKey)}
    </div>`
}

function renderCertificateType(publicKey) {
    if (!publicKey.type) return ''

    return html`<div>
        <span>${i18n.t('connection:algorithm.title')}</span>
        <span class="page-connection__certificate-value">${publicKey.type}</span>
    </div>`
}

function renderCertificateBitSize(publicKey) {
    if (!publicKey.bitSize) return ''

    return html`<div>
        <span>${i18n.t('connection:keySize.title')}</span>
        <span class="page-connection__certificate-value">${publicKey.bitSize} bits</span>
    </div>`
}

function renderCertificateIsPermanent(publicKey) {
    if (typeof publicKey.isPermanent !== 'boolean') return ''

    return html`<div>
        <span>${i18n.t('connection:permanent.title')}</span>
        <span class="page-connection__certificate-value">${publicKey.isPermanent ? 'Yes' : 'No'}</span>
    </div>`
}

function renderCertificateKeyUsage(publicKey) {
    const keyUsage = getKeyUsage(publicKey)
    if (keyUsage.length === 0) return ''

    return html`<div>
        <span>${i18n.t('connection:usage.title')}</span>
        <span class="page-connection__certificate-value">${keyUsage.join(', ')}</span>
    </div>`
}

function renderCertificateEffectiveSize(publicKey) {
    if (!publicKey.effectiveSize) return ''

    return html`<div>
        <span>${i18n.t('connection:effectiveSize.title')}</span>
        <span class="page-connection__certificate-value">${publicKey.effectiveSize} bits</span>
    </div>`
}

/**
 * @param {import('../models/site.js').PublicSiteModel} site
 * @param {import("../../browser/utils/request-details.mjs").TabData} tab
 */
function renderHeader(site, tab) {
    if (site.httpsState === 'none') {
        return html`<div class="section-list-header certificate-header--not-found">${i18n.t('connection:certificateNotFound.title')}</div>`
    }

    return html`<div class="section-list-header">${i18n.t('connection:certificateForDomain.title', { domain: tab.domain })}</div>`
}

/**
 * @param {import('../models/site.js').PublicSiteModel} site
 * @param {import("../../browser/utils/request-details.mjs").TabData} tab
 */
export function renderConnectionDescription(site, tab) {
    if (site.httpsState === 'invalid') {
        return i18n.t('connection:invalidConnectionDesc.title', { domain: tab.domain })
    }
    if (site.httpsState === 'none') {
        return i18n.t('connection:insecureConnectionDesc.title')
    }

    if (site.httpsState === 'upgraded') {
        return i18n.t('connection:upgradedConnectionDesc.title')
    }

    return i18n.t('connection:secureConnectionDesc.title')
}
