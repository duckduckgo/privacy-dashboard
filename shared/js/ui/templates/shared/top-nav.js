import bel from 'bel'
import { platformSwitch } from '../../environment-check'
import { ns } from '../../base/localize.es6'

/**
 * @param {object} opts
 * @param {"primary" | "secondary"} [opts.view] - certain platforms show different things depending on view
 */
export function topNav(opts = {}) {
    const { view = 'primary' } = opts
    const variant = platformSwitch({
        ios: () => 'tall',
        android: () => 'tall',
        default: () => 'short',
    })
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
            ios: () => [back(), close()],
            default: () => [back()],
        })
    }
    if (!elements.length) return null
    return bel`
        <div>
            <div class="top-nav top-nav--${variant}">
                ${elements}
            </div>    
            <div class="top-nav__spacer"></div>
        </div>
    `
}

function back() {
    const textLabel = ns.site('navigationBack.title')
    return bel`
        <a href='javascript:void(0)'
            class='top-nav__back js-sliding-subview-close js-site-done link-action link-action--dark'
            role='button'
            aria-label='${textLabel}'
            data-test-id='back-button'
        >
            <span class='icon icon__back-arrow' data-icon-text='${textLabel}'></span>
        </a>`
}

function close() {
    const textLabel = ns.site('navigationComplete.title')
    return bel`
        <a href="javascript:void(0)"
            class="top-nav__done js-sliding-subview-done js-site-done link-action link-action--dark"
            role="button"
        >
            ${textLabel}
        </a>`
}
