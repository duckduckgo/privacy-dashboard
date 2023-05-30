import esbuild from 'esbuild'
import { basename, join } from 'node:path'
import { readdirSync, readFileSync } from 'node:fs'
import { cwd } from './utils.mjs'
const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')
const LOCALES_BASE = join(BASE, 'shared/locales')

/**
 * Bundle the base and polyfill files.
 */
async function init() {
    const manifest = {
        base: {
            input: join(BASE, 'shared/js/ui/base/index.es6.js'),
            output: join(BASE, 'build/app/public/js/base.js'),
        },
        polyfills: {
            input: join(BASE, 'shared/js/polyfill.js'),
            output: join(BASE, 'build/app/public/js/polyfills.js'),
        },
    }
    await esbuild.build({
        entryPoints: [manifest.base.input],
        bundle: true,
        outfile: manifest.base.output,
        plugins: [
            {
                name: 'require-globify-shim',
                setup(build) {
                    build.onResolve({ filter: /locales\/\*\/\*.json/ }, (args) => {
                        return { path: args.path, namespace: 'require-globify-shim' }
                    })
                    build.onLoad({ filter: /.*/, namespace: 'require-globify-shim' }, () => {
                        return {
                            contents: JSON.stringify(buildLocaleMap()),
                            loader: 'json',
                        }
                    })
                },
            },
        ],
    })

    await esbuild.build({
        entryPoints: [manifest.polyfills.input],
        bundle: true,
        outfile: manifest.polyfills.output,
    })
}

init()

/**
 * Convert the folder structure into a map of locale keys to their respective namespaces
 * eg:
 *
 * ```json
 * {
 *   "en": {
 *     "site": { ... },
 *     "certificates": { ...}
 *   }
 * }
 *
 * ```
 */
function buildLocaleMap() {
    const localeList = readdirSync(LOCALES_BASE, { withFileTypes: true })
    const processedList = localeList.filter((d) => d.isDirectory()).map((dir) => [dir.name, processLocale(dir.name)])

    return Object.fromEntries(processedList)
}

/**
 * Process a single locale, converts a list of .json files into an object
 * For example, given the following json files:
 * - shared/locales/en/site.json
 * - shared/locales/en/connection.json
 * - shared/locales/en/permission.json
 * - shared/locales/en/report.json
 * - shared/locales/en/shared.json
 *
 * It will produce the following object:
 * {
 *     "site": { ... },
 *     "connection": { ... },
 *     ...
 * }
 * @param localeName
 * @return {{[p: string]: any}}
 */
function processLocale(localeName) {
    const localeFolder = join(LOCALES_BASE, localeName)
    const readListOfFoldersFromDisk = readdirSync(localeFolder, { withFileTypes: true })
        .filter((item) => item.isFile())
        .map((file) => {
            const nsFile = readFileSync(join(LOCALES_BASE, localeName, file.name), 'utf-8')
            const parsed = JSON.parse(nsFile)

            // returning [key, value] pairs such as ['site', { ... }]
            return [basename(file.name, '.json'), parsed]
        })

    return Object.fromEntries(readListOfFoldersFromDisk)
}
