import { cpSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from './utils.mjs'
const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')

function init() {
    cpSync(join(BASE, 'shared/html/popup.html'), join(BASE, 'build/app/html/popup.html'))
    cpSync(join(BASE, 'shared/html/index.html'), join(BASE, 'build/app/index.html'))
    cpSync(join(BASE, 'shared/img'), join(BASE, 'build/app/img'), { recursive: true })
    cpSync(join(BASE, 'shared/js/polyfill-loader.js'), join(BASE, 'build/app/public/js/polyfill-loader.js'))
}

init();
