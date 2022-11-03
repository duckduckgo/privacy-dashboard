import { MDCRipple } from '@material/ripple'
import { MDCSwitch } from '@material/switch'

const seen = new WeakSet()
export function setupMaterialDesignRipple(...selectors) {
    selectors.forEach((selector) => {
        const $matches = document.querySelectorAll(selector)
        $matches.forEach(($el) => {
            if (seen.has($el)) {
                return
            }
            seen.add($el)
            $el.classList.add('material-design-ripple')
            MDCRipple.attachTo($el)
        })
    })
}

const seenSwitch = new WeakSet()

/**
 * @param {string} selector
 */
export function setupSwitch(selector) {
    document.querySelectorAll(selector).forEach(($el) => {
        if (seenSwitch.has($el)) {
            return
        }
        if ($el instanceof HTMLButtonElement) {
            seenSwitch.add($el)
            // @ts-ignore
            const _switchInstance = new MDCSwitch($el)
        }
    })
}
