import { cpSync } from 'node:fs'
import { join } from 'node:path'
import { cwd } from './utils.mjs'
import z from 'zod'
const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')
const env = z
    .object({
        BUILD_OUTPUT: z.string(),
    })
    .parse(process.env)

function init() {
    cpSync(join(BASE, 'shared/html/popup.html'), join(BASE, env.BUILD_OUTPUT, 'html/popup.html'))
    cpSync(join(BASE, 'debugger/iframe.html'), join(BASE, env.BUILD_OUTPUT, 'html/iframe.html'))
    cpSync(join(BASE, 'v2/index.html'), join(BASE, env.BUILD_OUTPUT, 'html/v2.html'))
    cpSync(join(BASE, 'shared/html/index.html'), join(BASE, env.BUILD_OUTPUT, 'index.html'))
    cpSync(join(BASE, 'shared/img'), join(BASE, env.BUILD_OUTPUT, 'img'), { recursive: true })
    cpSync(join(BASE, 'shared/js/polyfill-loader.js'), join(BASE, env.BUILD_OUTPUT, 'public/js/polyfill-loader.js'))
}

init()
