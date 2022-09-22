import i18next from 'i18next'
import ICU from 'i18next-icu'

// @ts-ignore
const localeResources = require('../../../locales/*/*.json', { mode: 'list' })
// eslint-disable-next-line no-unused-vars
const siteTranslations = require('../../../locales/en/site.json')

const resources = localeResources.reduce((mapping, { name, module }) => {
    const [locale, namespace] = name.split('/')
    mapping[locale] = mapping[locale] || {}
    mapping[locale][namespace] = module
    return mapping
}, {})

i18next
    .use(ICU)
    .init({
    // debug: true,
        initImmediate: false,
        fallbackLng: 'en',
        lng: 'en',
        ns: ['shared', 'site', 'connection', 'report'],
        defaultNS: 'shared',
        resources
    })

export const i18n = i18next

/**
 * A helper for accessing the 'site' namespace with a bit of help from Typescript
 * @template {keyof siteTranslations} K
 * @template {`${K}.${string}`} F
 * @param {F} key
 * @param {Record<string, any>} [options]
 */
function site (key, options) {
    return i18next.t(`site:${key}`, options)
}

export const ns = {
    site: site
}
