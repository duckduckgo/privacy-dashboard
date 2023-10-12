import { MDCRipple } from '@material/ripple'

const seen = new WeakSet()
const seenSwitch = new WeakSet()

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
            instance.listen('click', function (e) {
                if (e.target instanceof HTMLElement) {
                    e.target.closest?.('a')?.blur()
                }
            })
            cleanups.push(() => instance.destroy())
        })
    })
    return cleanups
}

/**
 * Detect a 'long-press' on Android and Blur the current target
 * We do this because our tappable links do not currently show any context menus
 */
export function setupBlurOnLongPress() {
    let pressedTime = 0
    // @ts-ignore
    const hasPointerEvents = 'PointerEvent' in window || (window.navigator && 'msPointerEnabled' in window.navigator)
    // @ts-ignore
    const isTouch = 'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
    const mouseDown = hasPointerEvents ? 'pointerdown' : isTouch ? 'touchstart' : 'mousedown'
    const mouseUp = hasPointerEvents ? 'pointerup' : isTouch ? 'touchend' : 'mouseup'

    document.addEventListener(mouseDown, () => {
        pressedTime = 0
    })

    document.addEventListener(mouseUp, (event) => {
        const now = Date.now()
        const delta = (now - pressedTime) / 1000
        const target = event.target
        if (delta > 0.5 && target instanceof HTMLElement) {
            const trigger = target.closest('a,button')
            if (trigger instanceof HTMLElement) {
                if (seen.has(trigger) || seenSwitch.has(trigger)) {
                    trigger?.blur()
                }
            }
        }
    })
}

/**
 * Call a callback when a link with _blank is clicked.
 * This allowed platforms like ios/android/macOS to open external links.
 *
 * @param {(href: string) => void} cb
 */
export function setupGlobalOpenerListener(cb) {
    document.addEventListener('click', (e) => {
        const targetElem = e.target
        if (targetElem instanceof HTMLAnchorElement) {
            if (targetElem.target === '_blank' && targetElem.origin) {
                e.preventDefault()
                cb(targetElem.href)
            }
        }
    })
}
