import { MDCRipple } from '@material/ripple'

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
