import { protectionsStatusSchema, requestDataSchema } from './__generated__/schema.parsers'
import amazon from './__fixtures__/request-data-amazon.json'
import cnn from './__fixtures__/request-data-cnn.json'
import google from './__fixtures__/request-data-google.json'
import protections from './__fixtures__/protections.json'

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
})
