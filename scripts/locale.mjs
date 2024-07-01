import fs from 'fs'
import path from 'path'
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { cwd } from './utils.mjs'
import z from 'zod'

const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')
const LOCALES_BASE = join(BASE, 'shared/locales')

const env = z
    .object({
        BUILD_OUTPUT: z.string(),
        NODE_ENV: z.union([z.literal('production'), z.literal('development')]).default('production'),
    })
    .parse(process.env)

// const IS_PROD = env.NODE_ENV === 'production'
const OUTPUT_DIR = join(BASE, env.BUILD_OUTPUT, 'locales')

// Function to read JSON file and return its contents as an object
function readJSONFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(data)
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err)
        return null
    }
}

// Function to create a combined JSON file for a locale directory
function createLocaleFile(localePath, locale) {
    const result = {}
    const files = fs.readdirSync(localePath)

    files.forEach((file) => {
        const filePath = path.join(localePath, file)
        if (fs.statSync(filePath).isFile() && file.endsWith('.json')) {
            const fileName = path.basename(file, '.json')
            const json = readJSONFile(filePath)
            delete json.smartling
            Object.values(json).forEach((value) => {
                try {
                    delete value.note
                } catch (e) {
                    //
                }
            })
            result[fileName] = json
        }
    })

    let output = path.join(OUTPUT_DIR, `${locale}.json`)
    mkdirSync(dirname(output), { recursive: true })
    fs.writeFileSync(output, JSON.stringify(result, null, 2), 'utf8')
    console.log(`✅ Created ${output}`)
}

// Function to traverse the locales directory and process each locale
function processLocales() {
    const locales = fs.readdirSync(LOCALES_BASE)

    locales.forEach((locale) => {
        const localePath = path.join(LOCALES_BASE, locale)
        if (fs.statSync(localePath).isDirectory()) {
            createLocaleFile(localePath, locale)
        }
    })
}

processLocales()
