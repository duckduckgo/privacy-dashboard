import { MDCRipple } from '@material/ripple'
import { MDCSwitch } from '@material/switch'

const seen = new WeakSet()
export function setupMaterialDesignRipple(parent, ...selectors) {
    const cleanups = []
    selectors.forEach((selector) => {
        const $matches = parent.querySelectorAll(selector)
        $matches.forEach(($el) => {
            if (seen.has($el)) {
                return
            }
            seen.add($el)
            $el.classList.add('material-design-ripple')
            const instance = MDCRipple.attachTo($el)

            // only
            instance.listen('click', function (e) {
                // @ts-ignore
                e.target?.closest?.('a').blur()
            })
            cleanups.push(() => instance.destroy())
        })
    })
    return cleanups
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
            // eslint-disable-next-line no-unused-vars
            const switchInstance = new MDCSwitch($el)
            // don't allow more than a single click on the switch
            switchInstance.listen('click', () => {
                switchInstance.destroy()
            })
        }
    })
}
