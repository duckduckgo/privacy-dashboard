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
    const [ready, setReady] = useState(false)
    useEffect(() => {
        let cont = new AbortController()
        async function fetchFile(locale, signal) {
            try {
                const s = await fetch(`../locales/${locale}.json`, { signal }).then((x) => x.json())
                for (let [ns, translations] of Object.entries(s)) {
                    i18n.addResourceBundle(locale, ns, translations)
                }
            } catch (e) {
                console.error('could not load locale')
            }

            if (Object.keys(/** @type {any} */ (i18n.options.resources)).includes(locale)) {
                i18n.changeLanguage(locale)
            } else {
                console.warn(`Unsupported locale ${locale}`)
            }
        }
        if (locale) {
            fetchFile(locale, cont.signal)
                .then(() => setReady(true))
                .catch(console.error)
        } else {
            console.log('ignoring dup')
        }
        return () => {
            cont.abort()
        }
    }, [locale])

    if (!ready) return null
    return <TranslationContext.Provider value={{ locale: 'en' }}>{children}</TranslationContext.Provider>
}
