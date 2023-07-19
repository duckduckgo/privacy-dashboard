import { it } from 'node:test'
import { ok } from 'node:assert'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import i18next from 'i18next'
import ICU from 'i18next-icu'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const locales = readdirSync(path.resolve(__dirname)).filter(p => p.length === 2)

function loadTranslationFile(lang, name) {
    return JSON.parse(readFileSync(path.join(__dirname, lang, name)))
}

const translationsUnderTest = {
    firebutton: {
        stringArguments: {
            cookies: 1,
            duration: 'hour',
            openTabs: 14,
            tabs: 3,
            durationDesc: '1 week',
            site: 'example.com'
        }
    }
}

Object.keys(translationsUnderTest).forEach(ns => {
    const jsonFilename = `${ns}.json`
    const enStrings = loadTranslationFile('en', `${ns}.json`)
    locales.forEach((lang) => {
        it(`${lang}/${jsonFilename} exists`, () => {
            ok(existsSync(path.join(__dirname, lang, jsonFilename)))
        })
        it(`${lang}/${jsonFilename} contains all translation strings`, () => {
            const translations = loadTranslationFile(lang, jsonFilename)
            Object.keys(enStrings).filter(k => k !== 'smartling').forEach((key) => {
                ok(translations[key]?.title, `${lang}/${jsonFilename}: "${key}" is missing`)
            })
        })
        it(`${lang}/${jsonFilename} contains valid translation strings`, () => {
            const translations = loadTranslationFile(lang, jsonFilename)
            i18next.use(ICU).init({
                initImmediate: false,
                fallbackLng: 'en',
                lng: lang,
                ns: [ns],
                defaultNS: ns,
                resources: {
                    en: {
                        [ns]: enStrings,
                    },
                    [lang]: {
                        [ns]: translations
                    }
                },
                i18nFormat: {
                    parseErrorHandler: (err, key, res, options) => {
                        throw new Error(`Error in translation key ${key}: ${err}`)
                    },
                },
            })
            Object.keys(enStrings).filter(k => k !== 'smartling').forEach((key) => {
                ok(i18next.t(`${ns}:${key}.title`, translationsUnderTest[ns].stringArguments))
            })
        })
    })
})
