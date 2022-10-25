import bel from 'bel'
import { ns } from '../../base/localize.es6'

export function platformLimitations() {
    return bel`<p class="platform-limitations border--top--inner">${ns.site('trackerLimitationsNote.title')}</p>`
}
