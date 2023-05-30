import { join } from 'path'
import { readFileSync, writeFileSync } from 'node:fs'
const ROOT = join(cwd(import.meta.url), '..')

import { createDataStates } from '../shared/js/ui/views/tests/generate-data.mjs'
import { cwd } from './utils.mjs'
const google = JSON.parse(readFileSync(join(ROOT, 'schema/__fixtures__/request-data-google.json'), 'utf8'))
const cnn = JSON.parse(readFileSync(join(ROOT, 'schema/__fixtures__/request-data-cnn.json'), 'utf8'))
const iframeSrc = readFileSync(join(ROOT, 'shared/html/iframe.html'), 'utf8')
const iframe = createDataStates(google, cnn)

let optionList = ''
const keys = Object.keys(iframe).sort()
for (let key of keys) {
    // const mockData = states[key];
    optionList += `<option value=${JSON.stringify(key)}>${key}</option>\n`
}

// iframe json
const cleaned = {}
for (let [key, mockData] of Object.entries(iframe)) {
    // const { certificate, ...rest } = mockData;
    cleaned[key] = mockData
}
const json = JSON.stringify(cleaned, null, 2)

const newSrc = iframeSrc.replace('<!-- states -->', optionList).replace('const json = {}', `const json = ${json}`)

writeFileSync(join(ROOT, 'build/app/html/states.json'), json)
console.log(`✅ [json] build/app/html/states.json`)
writeFileSync(join(ROOT, 'build/app/html/iframe.html'), newSrc)
console.log(`✅ [html] build/app/html/iframe.html`)
