import { useLayoutEffect } from 'preact/hooks'
import { MDCRipple } from '@material/ripple'
import { isAndroid } from '../environment-check'
import { useEffect, useRef } from 'preact/hooks'

/**
 * @param {object} params
 * @param {any} params.ref
 */
export function useRipple(params) {
    const { ref } = params
    useLayoutEffect(() => {
        const $el = ref.current
        if (!$el) return
        if (!isAndroid()) return
        $el.classList.add('material-design-ripple')
        const instance = MDCRipple.attachTo($el)
        instance.listen('click', function (e) {
            if (e.target instanceof HTMLElement) {
                e.target.closest?.('a')?.blur()
            }
        })
        return () => {
            // cleanup
            instance.destroy()
        }
    }, [])
}

/**
 * @returns {import('preact/hooks').Ref<any>}
 */
export function useRippleChildren() {
    /** @type {import('preact/hooks').MutableRef<HTMLElement | null>} */
    const ref = useRef(null)
    useEffect(() => {
        const $el = ref.current
        if (!$el) return console.warn('missing ref')
        if (!isAndroid()) return
        const links = $el.querySelectorAll('a')
        const cleanup = addRippleTo(links)
        return () => {
            cleanup()
        }
    }, [])
    return ref
}

/**
 * @param {NodeListOf<HTMLAnchorElement>} elements
 * @return {() => void}
 */
export function addRippleTo(elements) {
    const instances = []
    elements.forEach((element) => {
        const instance = MDCRipple.attachTo(element)
        element.classList.add('material-design-ripple')
        instance.listen('click', function (e) {
            if (e.target instanceof HTMLElement) {
                e.target.closest?.('a')?.blur()
            }
        })
        instances.push(instance)
    })
    return () => {
        while (instances.length) {
            const last = instances.pop()
            last.destroy()
            console.log('destroy')
        }
    }
}
