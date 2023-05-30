import { execSync, exec } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { cwd } from './utils.mjs'
const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')

// sass+schema (parallel)
{
    console.time('sass+schema')
    // @ts-ignore
    const schema = promisify(exec)('node scripts/schema.js', { cwd: BASE, stdio: 'inherit' })
    // @ts-ignore
    const sass = promisify(exec)('node scripts/sass.mjs', { cwd: BASE, stdio: 'inherit' })
    await Promise.all([schema, sass])
    console.timeEnd('sass+schema')
}

// bundle
console.time('bundle')
execSync('node scripts/bundle.mjs', { cwd: BASE, stdio: 'inherit' })
console.timeEnd('bundle')

// copy assets
console.time('copy')
execSync('node scripts/copy.mjs', { cwd: BASE, stdio: 'inherit' })
console.timeEnd('copy')

// exec:buildHtml
console.time('html')
execSync('node scripts/duplicate-html.js', { cwd: BASE, stdio: 'inherit' })
execSync('node scripts/iframe.mjs', { cwd: BASE, stdio: 'inherit' })
console.timeEnd('html')
