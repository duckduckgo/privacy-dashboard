// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'

export function Text(props) {
    return props.children
}

/**
 * Renders raw HTML content within a span element.
 *
 * @param {Object} props - The props object
 * @param {string} props.text - The HTML content to be rendered
 */
export function Raw(props) {
    return <span dangerouslySetInnerHTML={{ __html: props.text }}></span>
}
