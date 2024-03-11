import { join } from 'path'
import { readFileSync, writeFileSync } from 'node:fs'
const ROOT = join(cwd(import.meta.url), '..')

import { createDataStates } from '../shared/js/ui/views/tests/generate-data.mjs'
import { cwd } from './utils.mjs'
import z from 'zod'
const google = JSON.parse(readFileSync(join(ROOT, 'schema/__fixtures__/request-data-google.json'), 'utf8'))
const cnn = JSON.parse(readFileSync(join(ROOT, 'schema/__fixtures__/request-data-cnn.json'), 'utf8'))
const iframeSrc = readFileSync(join(ROOT, 'shared/html/iframe.html'), 'utf8')
const iframe = createDataStates(google, cnn)

const env = z
    .object({
        BUILD_OUTPUT: z.string(),
    })
    .parse(process.env)

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

writeFileSync(join(ROOT, env.BUILD_OUTPUT, 'html/states.json'), json)
console.log(`✅ [json] ${env.BUILD_OUTPUT}/html/states.json`)
writeFileSync(join(ROOT, env.BUILD_OUTPUT, 'html/iframe.html'), newSrc)
console.log(`✅ [html] ${env.BUILD_OUTPUT}/html/iframe.html`)
