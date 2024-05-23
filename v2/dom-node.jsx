import { h } from 'preact'

/**
 * This is stable - it's deliberately supported by Preact
 * https://github.com/preactjs/preact/issues/3278#issuecomment-1826451012
 * @props {object} props
 * @props {HTMLElement} props.children
 */
export function DomNode({ children }) {
    this.shouldComponentUpdate = () => false
    // @ts-ignore
    return /** @type {any} */ (Object.defineProperty(h(children.localName), '__e', { get: () => children, set: Object }))
}
