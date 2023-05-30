import i18next from 'i18next'
import ICU from 'i18next-icu'
// eslint-disable-next-line no-unused-vars
import siteTranslations from '../../../locales/en/site.json'

// @ts-ignore
import localeResources from '../../../locales/*/*.json'

i18next.use(ICU).init({
    // debug: true,
    initImmediate: false,
    fallbackLng: 'en',
    lng: 'en',
    ns: ['shared', 'site', 'connection', 'report', 'ctascreens'],
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

export const ns = {
    site: site,
}
