// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';

/**
 * @typedef {object} ComponentProps
 * @property {"desktop-vibrancy" | "ios-secondary"} [variant]
 * @property {"big" | "desktop-large"} [btnSize]
 * @param {import("preact").ComponentProps<'button'> & ComponentProps} props
 */
export function Button({ children, btnSize, variant = 'desktop-vibrancy', ...rest }) {
    return (
        <button type="button" className="button token-body" {...rest} data-variant={variant} data-size={btnSize}>
            {children}
        </button>
    );
}

/**
 * @typedef {object} ButtonBarComponentProps
 * @property {'horizontal' | 'vertical'} [layout]
 * @param {import("preact").ComponentProps<'div'> & ButtonBarComponentProps} props
 */
export function ButtonBar({ children, layout = 'horizontal', ...rest }) {
    return (
        <div className="button-bar" data-layout={layout} {...rest}>
            {children}
        </div>
    );
}
