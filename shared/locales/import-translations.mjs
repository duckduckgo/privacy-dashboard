import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const extensionPath = process.argv[2]
const inputPath = process.argv[3]

const extensionKeys = ['fireButtonHeading',
    'fireButtonDesc',
    'fireButtonClearHistoryTitle',
    'fireButtonClearHistoryDesc',
    'fireButtonTabClosureTitle',
    'burnPageTitle'
]

const locales = fs.readdirSync(inputPath).filter(p => p.length === 2 || p.length === 5)
locales.forEach((locale) => {
    const lang = locale.slice(0, 2)
    const extensionOptionsPath = path.join(extensionPath, 'shared/locales', lang, 'options.json')
    const translation = JSON.parse(fs.readFileSync(path.join(inputPath, locale, 'firebutton.json')))
    const extensionOptions = JSON.parse(fs.readFileSync(extensionOptionsPath))
    extensionKeys.forEach((key) => {
        extensionOptions[key] = translation[key]
        delete translation[key]
    })
    // write new files
    fs.writeFileSync(path.join(__dirname, lang, 'firebutton.json'), JSON.stringify(translation, undefined, 2))
    fs.writeFileSync(extensionOptionsPath, JSON.stringify(extensionOptions, undefined, 2))
})
