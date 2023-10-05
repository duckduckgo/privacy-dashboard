import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
// @ts-ignore
const CWD = new URL('..', import.meta.url).pathname
const base = join(CWD, 'build/app/html/popup.html')
const html = readFileSync(base, 'utf8')
const platforms = ['ios', 'macos', 'browser', 'android', 'windows']

for (const platform of platforms) {
    const relative = join('build/app/html', platform + '.html')
    const outFile = join(CWD, relative)
    const outContent = html.replace('environment--example', 'environment--' + platform)
    writeFileSync(outFile, outContent)
    console.log(`✅ [html] [${platform}] ${relative}`)
}
