import { detectedRequestSchema } from '../../../../../schema/__generated__/schema.parsers.mjs'

/**
 * @param {import("../../../../../schema/__generated__/schema.types").DetectedRequest[]} requests
 * @returns {import("../../../../../schema/__generated__/schema.types").DetectedRequest[]}
 */
export function protectionsOff(requests) {
    return requests.map((r) => {
        if ('blocked' in r.state) {
            return detectedRequestSchema.parse({
                ...r,
                state: { allowed: { reason: 'protectionDisabled' } },
            })
        }
        if ('allowed' in r.state) {
            if (r.state.allowed.reason === 'otherThirdPartyRequest') {
                return r
            }
            return detectedRequestSchema.parse({
                ...r,
                state: { allowed: { reason: 'protectionDisabled' } },
            })
        }
        return r
    })
}
