import html from 'nanohtml'
import { ns } from '../../base/localize.js'

export function aboutLink() {
    const text = ns.site('trackerAboutLink.title')
    return html`<a
        class="about-link link-action link-action--text-short"
        href="https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/"
        target="_blank"
        >${text}</a
    >`
}

export function adAttributionLink() {
    const text = ns.site('trackerAdLink.title')
    return html`<a
        class="link-action link-action--text-micro"
        href="https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/#3rd-party-tracker-loading-protection"
        target="_blank"
        >${text}</a
    >`
}

/**
 * @param {() => void} cb
 * @returns {HTMLElement}
 */
export function disableInSettingsLink(cb) {
    const text = ns.site('cookiesMinimizedSettings.title')
    return html`<a class="link-action link-action--text-micro" draggable="false" href="javascript:void(0)" onclick=${cb}>${text}</a>`
}
