import {
    cookiePromptManagementStatusSchema,
    localeSettingsSchema,
    protectionsStatusSchema,
    requestDataSchema,
} from './__generated__/schema.parsers.mjs'
import amazon from './__fixtures__/request-data-amazon.json'
import cnn from './__fixtures__/request-data-cnn.json'
import google from './__fixtures__/request-data-google.json'
import protections from './__fixtures__/protections.json'
import locale from './__fixtures__/locale-settings.json'
import cpm from './__fixtures__/cpm.json'
import cpmSecondary from './__fixtures__/cpm-secondary.json'

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
