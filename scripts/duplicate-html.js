import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import z from 'zod'
// @ts-ignore
const CWD = new URL('..', import.meta.url).pathname
const env = z
    .object({
        BUILD_OUTPUT: z.string(),
        NODE_ENV: z.union([z.literal('production'), z.literal('development')]).default('production'),
    })
    .parse(process.env)
const base = join(CWD, env.BUILD_OUTPUT, 'html/popup.html')
const html = readFileSync(base, 'utf8')
const platforms = ['ios', 'macos', 'browser', 'android', 'windows']

for (const platform of platforms) {
    const relative = join(env.BUILD_OUTPUT, 'html', platform + '.html')
    const outFile = join(CWD, relative)
    let outContent = html.replace('environment--example', 'environment--' + platform)
    if (platform === 'android' && env.NODE_ENV === 'production') {
        outContent = outContent.replace(
            '<title>DuckDuckGo</title>',
            '<title>DuckDuckGo</title>\n        <base href="duck://privacy-dashboard/" />'
        )
    }
    writeFileSync(outFile, outContent)
    console.log(`✅ [html] [${platform}] ${relative}`)
}
