import { join } from 'path'
import { readFileSync, writeFileSync } from 'node:fs'
const ROOT = join(cwd(import.meta.url), '..');

import { createDataStates } from '../shared/js/ui/views/tests/generate-data.mjs'
const google = JSON.parse(readFileSync(join(ROOT, 'schema/__fixtures__/request-data-google.json'), "utf8"))
const cnn = JSON.parse(readFileSync(join(ROOT, 'schema/__fixtures__/request-data-cnn.json'), "utf8"))
const iframeSrc = readFileSync(join(ROOT, 'shared/html/iframe.html'), "utf8")
const iframe = createDataStates(google, cnn)

let optionList = '';
const keys = Object.keys(iframe).sort();
for (let key of keys) {
    // const mockData = states[key];
    optionList += `<option value=${JSON.stringify(key)}>${key}</option>\n`
}

const newSrc = iframeSrc.replace('<!-- states -->', optionList);
writeFileSync(join(ROOT, 'build/app/html/iframe.html'), newSrc)


/**
 * Cross-platform absolute directory path for modules.
 *
 * On windows, 'pathname' has a leading `/` which needs removing
 */
export function cwd (current) {
    const pathname = new URL('.', current).pathname
    if (process.platform === 'win32') {
        return pathname.slice(1)
    }
    return pathname
}
