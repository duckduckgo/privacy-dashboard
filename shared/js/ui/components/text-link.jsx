// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRef } from 'preact/hooks'
import { useRipple } from '../hooks/useRipple'

/**
 * @param {object} props
 * @param {import("../templates/protection-header").UIState} props.state
 * @param {import('preact').ComponentChildren} props.children
 * @param {() => void} props.onClick
 */
export function TextLink(props) {
    const { onClick } = props

    const ref = useRef(null)

    useRipple({ ref })

    return (
        <div className="text--center">
            <a href="javascript:void(0)" className="link-action link-action--text" draggable={false} ref={ref} onClick={onClick}>
                {props.children}
            </a>
        </div>
    )
}
