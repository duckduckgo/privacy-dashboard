import { execSync, exec as baseExec } from 'node:child_process'
import { basename, join } from 'node:path'
import { promisify } from 'node:util'
import { cwd } from './utils.mjs'
const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')
const debug = Boolean(process.argv.includes('--debug'))
const exec = promisify(baseExec)
const env = {
    ...process.env,
    NODE_ENV: debug ? 'development' : 'production',
}

// sass+schema (parallel)
{
    console.time('sass+schema')
    // @ts-ignore
    const schema = exec('node scripts/schema.js', { cwd: BASE, stdio: 'inherit', env })

    // sass
    const output = 'build/app/public/css'
    // prettier-ignore
    const inputs = [
        'shared/scss/base/base.scss',
        'shared/scss/popup.scss',
        'shared/scss/android.scss'
    ]
    const sass = inputs.map((job) => {
        const name = basename(job, '.scss')
        const outfile = join(output, name + '.css')
        const args = ['sass', job, outfile, '--load-path node_modules']
        if (debug) args.push('--embed-sources')
        if (!debug) args.push('--no-source-map')
        return exec(args.join(' '), {
            cwd: BASE,
            // @ts-ignore
            stdio: 'inherit',
        })
    })
    await Promise.all([schema, ...sass])
    console.timeEnd('sass+schema')
}

// bundle
console.time('bundle')
execSync('node scripts/bundle.mjs', { cwd: BASE, stdio: 'inherit', env })
console.timeEnd('bundle')

// copy assets
console.time('copy')
execSync('node scripts/copy.mjs', { cwd: BASE, stdio: 'inherit', env })
console.timeEnd('copy')

// exec:buildHtml
console.time('html')
execSync('node scripts/duplicate-html.js', { cwd: BASE, stdio: 'inherit', env })
execSync('node scripts/iframe.mjs', { cwd: BASE, stdio: 'inherit', env })
console.timeEnd('html')
