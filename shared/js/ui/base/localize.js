import i18next from 'i18next'
import ICU from 'i18next-icu'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import siteTranslations from '../../../locales/en/site.json'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import reportTranslations from '../../../locales/en/report.json'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import toggleReportTranslations from '../../../locales/en/toggle-report.json'

// @ts-ignore
import localeResources from '../../../locales/*/*.json'

i18next.use(ICU).init({
    // debug: true,
    initImmediate: false,
    fallbackLng: 'en',
    lng: 'en',
    ns: ['shared', 'site', 'connection', 'report', 'ctascreens', 'firebutton', 'toggle-report'],
    defaultNS: 'shared',
    resources: localeResources,
    i18nFormat: {
        parseErrorHandler: (err, key, res, options) => {
            console.warn('parseErrorHandler', err, key, res, options)
        },
    },
})

export const i18n = i18next

/**
 * A helper for accessing the 'site' namespace with a bit of help from Typescript
 * @template {keyof siteTranslations} K
 * @template {`${K}.${string}`} F
 * @param {F} key
 * @param {Record<string, any>} [options]
 */
function site(key, options) {
    return i18next.t(`site:${key}`, options)
}

/**
 * A helper for accessing the 'report' namespace with a bit of help from Typescript
 * @template {keyof reportTranslations} K
 * @template {`${K}.${string}`} F
 * @param {F} key
 * @param {Record<string, any>} [options]
 */
function report(key, options) {
    return i18next.t(`report:${key}`, options)
}

/**
 * A helper for accessing the 'report' namespace with a bit of help from Typescript
 * @template {keyof toggleReportTranslations} K
 * @template {`${K}.title`} F
 * @param {F} key
 * @param {Record<string, any>} [options]
 */
function toggleReport(key, options) {
    return i18next.t(`toggle-report:${key}`, options)
}

export const ns = {
    site,
    report,
    toggleReport,
}
