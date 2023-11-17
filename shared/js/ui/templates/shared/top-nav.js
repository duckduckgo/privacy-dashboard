import html from 'nanohtml'
import { platformSwitch } from '../../environment-check'
import { ns } from '../../base/localize.js'

/**
 * @param {object} opts
 * @param {"primary" | "secondary"} [opts.view] - certain platforms show different things depending on view
 * @param {boolean} [opts.immediate]
 */
export function topNav(opts = {}) {
    /** @type {typeof opts} */
    const { view = 'primary', immediate = false } = opts
    let elements
    if (view === 'primary') {
        elements = platformSwitch({
            ios: () => [close()],
            android: () => [back()],
            default: () => [],
        })
    } else {
        // here, must be 'secondary' view
        elements = platformSwitch({
            ios: () => {
                // if 'immediate' is set, don't allow 'back' navigation
                if (immediate) {
                    return [close()]
                }
                return [back(), close()]
            },
            default: () => [back()],
        })
    }
    if (!elements.length) return null
    return html`
        <div>
            <div class="top-nav">${elements}</div>
            <div class="top-nav__spacer"></div>
        </div>
    `
}

function back() {
    const textLabel = ns.site('navigationBack.title')
    return html` <a
        href="javascript:void(0)"
        class="top-nav__back js-sliding-subview-close js-site-done link-action link-action--dark"
        role="button"
        aria-label="${textLabel}"
    >
        <span class="icon icon__back-arrow" data-icon-text="${textLabel}"></span>
    </a>`
}

function close() {
    const textLabel = ns.site('navigationComplete.title')
    return html` <a
        href="javascript:void(0)"
        class="top-nav__done js-sliding-subview-done js-site-done link-action link-action--dark"
        role="button"
    >
        ${textLabel}
    </a>`
}
