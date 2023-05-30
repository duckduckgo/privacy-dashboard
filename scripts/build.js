import { execSync } from 'node:child_process'
import { join } from 'node:path'
import { cwd } from './utils.mjs'
import { exec } from 'child_process'
import { promisify } from 'node:util'
const CWD = cwd(import.meta.url)
const BASE = join(CWD, '..')

// schema
{
    console.time('sass+schema')
    const schema = promisify(exec)('node scripts/schema.js', { cwd: BASE })
    const sass = promisify(exec)('node scripts/sass.mjs', { cwd: BASE })
    await Promise.all([schema, sass])
    console.timeEnd('sass+schema')
}

// bundle
{
    console.time('bundle')
    execSync('node scripts/bundle.mjs', { cwd: BASE })
    console.timeEnd('bundle')
}
// copy assets
{
    console.time('copy')
    execSync('node scripts/copy.mjs', { cwd: BASE })
    console.timeEnd('copy')
}

// exec:buildHtml
{
    console.time('html')
    execSync('node scripts/duplicate-html.js', { cwd: BASE })
    execSync('node scripts/iframe.mjs', { cwd: BASE })
    console.timeEnd('html')
}
