// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
/**
 * @typedef {object} ButtonBarComponentProps
 * @property {string} [gap]
 * @param {import("preact").ComponentProps<'div'> & ButtonBarComponentProps} props
 */
export function Stack({ children, gap, ...rest }) {
    const classes = ['stack'].concat(/** @type {string} */ (rest.className)).filter(Boolean)
    return (
        <div {...rest} className={classes.join(' ')} style={{ gap: gap }}>
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
        <div className={'scrollable'} {...rest}>
            {children}
        </div>
    )
}
