// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
/**
 * @typedef {object} ButtonBarComponentProps
 * @property {string} [gap]
 * @param {import("preact").ComponentProps<'div'> & ButtonBarComponentProps} props
 */
export function Stack({ children, gap, ...rest }) {
    return (
        <div {...rest} className="stack" style={{ gap: gap }}>
            {children}
        </div>
    )
}

/**
 * @typedef {object} ScrollableComponentProps
 * @param {import("preact").ComponentProps<'div'> & ScrollableComponentProps} props
 */
export function Scrollable({ children, ...rest }) {
    return (
        <div className="scrollable fade-in" {...rest}>
            {children}
        </div>
    )
}
