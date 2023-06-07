import { describe, it } from 'node:test'
import {
    cookiePromptManagementStatusSchema,
    localeSettingsSchema,
    protectionsStatusSchema,
    requestDataSchema,
} from './__generated__/schema.parsers.mjs'
import { readFileSync } from 'node:fs'
import { join } from 'path'
import { cwd } from '../scripts/utils.mjs'
const CWD = cwd(import.meta.url)

const amazon = JSON.parse(readFileSync(join(CWD, '__fixtures__/request-data-amazon.json'), 'utf8'))
const cnn = JSON.parse(readFileSync(join(CWD, '__fixtures__/request-data-cnn.json'), 'utf8'))
const google = JSON.parse(readFileSync(join(CWD, '__fixtures__/request-data-google.json'), 'utf8'))
const protections = JSON.parse(readFileSync(join(CWD, '__fixtures__/protections.json'), 'utf8'))
const locale = JSON.parse(readFileSync(join(CWD, '__fixtures__/locale-settings.json'), 'utf8'))
const cpm = JSON.parse(readFileSync(join(CWD, '__fixtures__/cpm.json'), 'utf8'))
const cpmSecondary = JSON.parse(readFileSync(join(CWD, '__fixtures__/cpm-secondary.json'), 'utf8'))

describe('__fixtures__', () => {
    it('validates request-data', () => {
        const jsons = [amazon, cnn, google]
        for (const json of jsons) {
            requestDataSchema.parse(json)
        }
    })
    it('validates protections data', () => {
        protectionsStatusSchema.parse(protections)
    })
    it('validates locale settings', () => {
        localeSettingsSchema.parse(locale)
    })
    it('validates cpm incoming', () => {
        cookiePromptManagementStatusSchema.parse(cpm)
        cookiePromptManagementStatusSchema.parse(cpmSecondary)
    })
})
