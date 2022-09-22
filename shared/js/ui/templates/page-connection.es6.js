/** @type {any} */
const bel = require('bel')
const hero = require('./shared/hero.es6.js')
const { aboutLink } = require('./shared/about-link.js')
const i18n = window.DDG.base.i18n

/**
 * @this {{
 *  model: {
 *      tab: import("../../browser/utils/request-details.js").TabData,
 *      site: import('../models/site.es6.js').PublicSiteModel
 *   }
 * }}
 */
module.exports = function () {
    if (!this.model) {
        return bel`<section class="sliding-subview"></section>`
    }

    return bel`<div class="tracker-networks site-info card">
        <div class="js-tracker-networks-hero">
            ${renderHero(this.model.site)}
        </div>
        <div class="tracker-networks__explainer text--center">
            <p class="token-title-3">${renderConnectionDescription(this.model.site)}</p>
            <p>
                ${aboutLink()}
            </p>
        </div>
        ${renderCertificateDetails(this.model.site, this.model.tab)}
    </div>`
}

function getKeyUsage (key) {
    const capabilities = {
        canEncrypt: i18n.t('connection:encrypt.title'),
        canDecrypt: i18n.t('connection:decrypt.title'),
        canSign: i18n.t('connection:sign.title'),
        canVerify: i18n.t('connection:verify.title'),
        canDerive: i18n.t('connection:derive.title'),
        canWrap: i18n.t('connection:wrap.title'),
        canUnwrap: i18n.t('connection:unwrap.title')
    }

    return Object.keys(capabilities).reduce((usage, capability) => {
        if (!key[capability]) return usage
        return [].concat(usage, capabilities[capability])
    }, [])
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 * @param {import("../../browser/utils/request-details.js").TabData} tab
 */
function renderCertificateDetails (site, tab) {
    if (site.httpsState === 'none' || !tab.certificate || tab.certificate.length === 0) return ''

    const certificate = tab.certificate[0]
    return bel`
        <div>
            <div class="padded-sides">
                ${renderHeader(site, tab)}
            </div>
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

function renderCertificateSummary (certificate) {
    if (!certificate.summary) return ''

    return bel`<div>
                <span>${i18n.t('connection:summary.title')}</span>
                <span class="page-connection__certificate-value">${certificate.summary}</span>
            </div>`
}

function renderPublicKeyDetails (certificate) {
    if (!certificate.publicKey) return ''

    return bel`<div class="page-connection__certificate-details">
        <h3 class="token-body-em">${i18n.t('connection:publicKey.title')}</h3>
        ${renderCertificateType(certificate.publicKey)}
        ${renderCertificateBitSize(certificate.publicKey)}
        ${renderCertificateEffectiveSize(certificate.publicKey)}
        ${renderCertificateKeyUsage(certificate.publicKey)}
        ${renderCertificateIsPermanent(certificate.publicKey)}
    </div>`
}

function renderCertificateType (publicKey) {
    if (!publicKey.type) return ''

    return bel`<div>
                <span>${i18n.t('connection:algorithm.title')}</span>
                <span class="page-connection__certificate-value">${publicKey.type}</span>
            </div>`
}

function renderCertificateBitSize (publicKey) {
    if (!publicKey.bitSize) return ''

    return bel`<div>
                <span>${i18n.t('connection:keySize.title')}</span>
                <span class="page-connection__certificate-value">${publicKey.bitSize} bits</span>
            </div>`
}

function renderCertificateIsPermanent (publicKey) {
    if (typeof publicKey.isPermanent !== 'boolean') return ''

    return bel`<div>
                <span>${i18n.t('connection:permanent.title')}</span>
                <span class="page-connection__certificate-value">${publicKey.isPermanent ? 'Yes' : 'No'}</span>
            </div>`
}

function renderCertificateKeyUsage (publicKey) {
    const keyUsage = getKeyUsage(publicKey)
    if (keyUsage.length === 0) return ''

    return bel`<div>
                <span>${i18n.t('connection:usage.title')}</span>
                <span class="page-connection__certificate-value">${keyUsage.join(', ')}</span>
            </div>`
}

function renderCertificateEffectiveSize (publicKey) {
    if (!publicKey.effectiveSize) return ''

    return bel`<div>
                <span>${i18n.t('connection:effectiveSize.title')}</span>
                <span class="page-connection__certificate-value">${publicKey.effectiveSize} bits</span>
            </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 * @param {import("../../browser/utils/request-details.js").TabData} tab
 */
function renderHeader (site, tab) {
    if (site.httpsState === 'none') {
        return bel`<div class="section-list-header certificate-header--not-found">
            ${i18n.t('connection:certificateNotFound.title')}
        </div>`
    }

    return bel`<div class="section-list-header">
        ${i18n.t('connection:certificateForDomain.title', { domain: tab.domain })}
    </div>`
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 */
function renderConnectionDescription (site) {
    if (site.httpsState === 'none') {
        return i18n.t('connection:insecureConnectionDesc.title')
    }

    if (site.httpsState === 'upgraded') {
        return i18n.t('connection:upgradedConnectionDesc.title')
    }

    return i18n.t('connection:secureConnectionDesc.title')
}

/**
 * @param {import('../models/site.es6.js').PublicSiteModel} site
 */
function renderHero (site) {
    return bel`${hero({
        status: `connection-${site.httpsState}`
    })}`
}
