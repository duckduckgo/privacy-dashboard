import i18next from 'i18next'
import ICU from 'i18next-icu'
import connection from '../../../locales/en/connection.json'
import ctascreens from '../../../locales/en/ctascreens.json'
import firebutton from '../../../locales/en/firebutton.json'
import permissions from '../../../locales/en/permissions.json'
import report from '../../../locales/en/report.json'
import shared from '../../../locales/en/shared.json'
import site from '../../../locales/en/site.json'
import toggleReport from '../../../locales/en/toggle-report.json'

const resources = {
    connection,
    ctascreens,
    firebutton,
    permissions,
    report,
    shared,
    site,
    'toggle-report': toggleReport,
}

i18next.use(ICU).init({
    // debug: true,
    initImmediate: false,
    fallbackLng: 'en',
    lng: 'en',
    ns: Object.keys(resources),
    resources: { en: resources },
    i18nFormat: {
        parseErrorHandler: (err, key, res, options) => {
            console.warn('parseErrorHandler', err, key, res, options)
        },
    },
})

export const i18n = i18next

/**
 * A helper for accessing the 'site' namespace with a bit of help from Typescript
 * @template {keyof site} K
 * @template {`${K}.${string}`} F
 * @param {F} key
 * @param {Record<string, any>} [options]
 */
function siteT(key, options) {
    return i18next.t(`site:${key}`, options)
}

/**
 * A helper for accessing the 'report' namespace with a bit of help from Typescript
 * @template {keyof report} K
 * @template {`${K}.${string}`} F
 * @param {F} key
 * @param {Record<string, any>} [options]
 */
function reportT(key, options) {
    return i18next.t(`report:${key}`, options)
}

/**
 * A helper for accessing the 'report' namespace with a bit of help from Typescript
 * @template {keyof toggleReport} K
 * @template {`${K}.title`} F
 * @param {F} key
 * @param {Record<string, any>} [options]
 */
function toggleReportT(key, options) {
    return i18next.t(`toggle-report:${key}`, options)
}

export const ns = {
    site: siteT,
    report: reportT,
    toggleReport: toggleReportT,
}
