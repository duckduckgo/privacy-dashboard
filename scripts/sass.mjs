import { cwd } from './utils.mjs'
import { dirname, join } from 'node:path'
import sass from 'sass'
import { mkdirSync, writeFileSync } from 'node:fs'
const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')

function init() {
    compileSass('shared/scss/base/base.scss', 'build/app/public/css/base.css')
    compileSass('shared/scss/popup.scss', 'build/app/public/css/popup.css')
    compileSass('shared/scss/android.scss', 'build/app/public/css/android.css')
}

init()

function compileSass(input, output) {
    const result = sass.compile(join(BASE, input), { loadPaths: [join(BASE, 'node_modules')] })
    writeFile(join(BASE, output), result.css)
}

function writeFile(filepath, content) {
    mkdirSync(dirname(filepath), { recursive: true })
    writeFileSync(filepath, content)
}
