// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useEffect, useReducer } from 'preact/hooks'

/**
 * Load a script containing a custom-element. Don't load it twice.
 *
 * @param {object} props
 * @param {string} props.src - where the script can be loaded from
 * @param {string} props.element - the name of the element to load
 * @param {import("preact").ComponentChild} props.children - children to be rendered, only when the element is ready
 */
export function CustomElementLoader(props) {
    const [state, dispatch] = useReducer(reducer, { status: 'idle' })

    useEffect(() => {
        if (state.status === 'idle') {
            if (window.__ddg_did_load && window.__ddg_did_load.includes(props.element)) {
                dispatch({ kind: 'skip-loading' })
            } else {
                dispatch({ kind: 'load-script', element: props.element })
            }
            return
        }
        if (state.status === 'script-ready') {
            dispatch({ kind: 'load-element' })
            customElements.whenDefined(props.element).then(() => {
                window.__ddg_did_load ??= []
                window.__ddg_did_load.push(props.element)
                dispatch({ kind: 'element-loaded' })
            })
        }
    }, [state.status, props.src, props.element])

    /**
     * If the state is 'element-ready' - the script AND the element has loaded, so
     * we can continue to render children
     */
    if (state.status === 'element-ready') {
        return props.children
    }

    /**
     * if we're in 'script-pending' state, that means we want to actively load a JS file
     */
    if (state.status === 'script-pending') {
        return <script src={props.src} onLoad={() => dispatch({ kind: 'script-loaded' })}></script>
    }

    return /** @type {any} */ (null)
}

/**
 * @typedef {{ kind: 'load-script'; element: string }
 *  | { kind: 'script-loaded' }
 *  | { kind: 'load-element' }
 *  | { kind: 'element-loaded' }
 *  | { kind: 'skip-loading' }
 *  } Events
 */

/**
 * @param {{status: 'idle'}
 * | {status: 'script-pending'}
 * | {status: 'script-ready'}
 * | {status: 'element-pending'}
 * | {status: 'element-ready'}
 * } state
 *
 *
 * @param {Events} event
 */
function reducer(state, event) {
    console.log('incoming', event, 'current', state)
    switch (state.status) {
        case 'idle': {
            switch (event.kind) {
                case 'load-script': {
                    return { ...state, status: /** @type {const} */ ('script-pending') }
                }
                case 'skip-loading': {
                    return { ...state, status: /** @type {const} */ ('element-ready') }
                }
            }
            break
        }
        case 'script-pending': {
            switch (event.kind) {
                case 'script-loaded': {
                    return { ...state, status: /** @type {const} */ ('script-ready') }
                }
            }
            break
        }
        case 'script-ready': {
            switch (event.kind) {
                case 'load-element': {
                    return { ...state, status: /** @type {const} */ ('element-pending') }
                }
            }
            break
        }
        case 'element-pending': {
            switch (event.kind) {
                case 'element-loaded': {
                    return { ...state, status: /** @type {const} */ ('element-ready') }
                }
            }
        }
    }
    return state
}
