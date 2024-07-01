import fs from 'fs'
import path from 'path'
import { basename, join } from 'node:path'
import { cwd } from './utils.mjs'
import z from 'zod'
import { mkdirSync } from 'node:fs'

const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')
const LOCALES_BASE = join(BASE, 'shared/locales')

const env = z
    .object({
        BUILD_OUTPUT: z.string().default('build/app-debug'),
        NODE_ENV: z.union([z.literal('production'), z.literal('development')]).default('production'),
    })
    .parse(process.env)

const OUTPUT_DIR = join(BASE, env.BUILD_OUTPUT, 'locales')

/**
 * Creates a locale file by reading all the JSON files in the given locale path,
 * removing unnecessary properties, and writing the resulting JSON object to a file.
 *
 * @param {string} locale - The name of the locale for the output file.
 *
 */
function createLocaleFile(locale) {
    const localePath = path.join(LOCALES_BASE, locale)
    const items = fs.readdirSync(localePath, { withFileTypes: true })
    const json = items
        /**
         * Only include .json files
         */
        .filter((x) => x.isFile() && x.name.endsWith('.json'))
        /**
         * use the name of the json file to create the `ns` (namespace)
         */
        .map((item) => {
            return {
                ns: basename(item.name, '.json'),
                json: JSON.parse(fs.readFileSync(path.join(localePath, item.name), 'utf8')),
            }
        })
        /**
         * Cleanup the JSON, removing unused keys like 'smartling' or `.note` from each item
         */
        .map((item) => {
            const { smartling, ...rest } = item.json
            const without = Object.entries(rest).map(([key, v]) => {
                return [key, { title: v.title }]
            })
            return [item.ns, Object.fromEntries(without)]
        })

    return Object.fromEntries(json)
}

// Function to traverse the locales directory and process each locale
function processLocales() {
    const localeDirs = fs.readdirSync(LOCALES_BASE, { withFileTypes: true })
    mkdirSync(OUTPUT_DIR, { recursive: true })

    for (let locale of localeDirs) {
        if (locale.isDirectory()) {
            const json = createLocaleFile(locale.name)
            const output = path.join(OUTPUT_DIR, `${locale.name}.json`)
            fs.writeFileSync(output, JSON.stringify(json, null, 2), 'utf8')
            console.log(`✅ Created ${output}`)
        }
    }
}

processLocales()
