// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { createContext } from 'preact'
import { useData } from './data-provider'
import { useEffect, useState } from 'preact/hooks'
import { i18n } from '../shared/js/ui/base/localize'

const TranslationContext = createContext({
    /** @type {string} */
    locale: 'en',
})

export function TranslationProvider({ children }) {
    const data = useData()
    const locale = data.tab?.locale
    const [state, setReady] = useState(/** @type {'idle'|'ready'|'loading'|'error'} */ ('idle'))
    useEffect(() => {
        async function fetchFile(locale) {
            setReady('loading')
            const v = `/locales/${locale}.js`
            const mod = await import(v)
            for (let [ns, translations] of Object.entries(mod.default)) {
                i18n.addResourceBundle(locale, ns, translations)
            }
            if (Object.keys(/** @type {any} */ (i18n.options.resources)).includes(locale)) {
                i18n.changeLanguage(locale)
            } else {
                console.warn(`Unsupported locale ${locale}`)
            }
            setReady('ready')
        }
        if (typeof locale === 'string' && locale.length === 2 && locale !== 'en') {
            fetchFile(data.tab?.locale)
                .then(() => setReady('ready'))
                .catch(() => {
                    console.error(`could not load the locale ${locale}`)
                    setReady('error')
                })
        } else {
            setReady('ready')
        }
    }, [locale])

    if (state === 'idle') return null
    if (state === 'loading') return null
    return <TranslationContext.Provider value={{ locale: 'en' }}>{children}</TranslationContext.Provider>
}
