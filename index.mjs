import { shouldPolyfill as shouldPolyfillGetCanonicalLocales } from '@formatjs/intl-getcanonicallocales/should-polyfill'
import { shouldPolyfill as shouldPolyfillIntlLocale } from '@formatjs/intl-locale/should-polyfill'
import { shouldPolyfill as shouldPolyfillPluralRules } from '@formatjs/intl-pluralrules/should-polyfill'
import { shouldPolyfill as shouldPolyfillNumberFormat } from '@formatjs/intl-numberformat/should-polyfill'
import { shouldPolyfill as shouldPolyfillDateTimeFormat } from '@formatjs/intl-datetimeformat/should-polyfill'

export function shouldPolyfillAny(locale) {
    return (
        shouldPolyfillGetCanonicalLocales() ||
        shouldPolyfillIntlLocale() ||
        (locale && shouldPolyfillPluralRules(locale)) ||
        (locale && shouldPolyfillNumberFormat(locale)) ||
        (locale && shouldPolyfillDateTimeFormat(locale))
    )
}

console.log(shouldPolyfillAny('en'))
