import html from 'nanohtml'
import { ns } from '../../base/localize.es6'

export function platformLimitations() {
    return html`<p class="platform-limitations border--top--inner">${ns.site('trackerLimitationsNote.title')}</p>`
}
