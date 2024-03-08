// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef } from 'preact/hooks'
import { useRipple } from '../hooks/useRipple'

/**
 * @param {object} props
 * @param {import('preact').ComponentChildren} [props.children]
 * @param {boolean} [props.rounded]
 * @param {() => void} props.onClick
 */
export function TextLink(props) {
    const { onClick, rounded = false } = props

    const ref = useRef(null)

    useRipple({ ref })

    let classNames = [`link-action`, `link-action--text`]
    if (rounded) classNames.push(`link-action--rounded`)

    return (
        <a href="javascript:void(0)" className={classNames.join(' ')} draggable={false} ref={ref} onClick={onClick}>
            {props.children}
        </a>
    )
}

/**
 * @typedef {object} PlainTextLinkProps
 * @param {import("preact").ComponentProps<'a'> & PlainTextLinkProps} props
 */
export function PlainTextLink({ children, className, ...rest }) {
    const classes = ['text-link-as-button']
    if (className) classes.push(className)
    return (
        <a href="javascript:void(0)" className={classes.join(' ')} draggable={false} {...rest}>
            {children}
        </a>
    )
}
