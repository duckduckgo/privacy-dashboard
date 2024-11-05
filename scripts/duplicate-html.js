import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import z from 'zod';
// @ts-ignore
const CWD = new URL('..', import.meta.url).pathname;
const env = z
    .object({
        BUILD_OUTPUT: z.string(),
    })
    .parse(process.env);
const base = join(CWD, env.BUILD_OUTPUT, 'html/popup.html');
const html = readFileSync(base, 'utf8');
const platforms = ['ios', 'macos', 'browser', 'android', 'windows'];

for (const platform of platforms) {
    const relative = join(env.BUILD_OUTPUT, 'html', platform + '.html');
    const outFile = join(CWD, relative);
    const outContent = html.replace('environment--example', 'environment--' + platform);
    writeFileSync(outFile, outContent);
    console.log(`✅ [html] [${platform}] ${relative}`);
}
