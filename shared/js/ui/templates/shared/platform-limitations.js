import bel from 'bel'
import { ns } from '../../base/localize.es6'

export function platformLimitations () {
    return bel`<div>
        <div class="horizontal-separator horizontal-separator--light"></div>
        <p class="text--center">${ns.site('trackerLimitationsNote.title')}</p>
    </div>`
}
