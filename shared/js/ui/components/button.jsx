// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import cn from 'classnames';

/**
 * @typedef {object} ComponentProps
 * @property {"standard" | "desktop-vibrancy" | "desktop-standard" | "ios-secondary" | "macos-standard"} [variant]
 * @property {"big" | "desktop-large" | "small"} [btnSize]
 * @property {string} [className]
 * @param {import("preact").ComponentProps<'button'> & ComponentProps} props
 */
export function Button({ children, className='', btnSize, variant = 'desktop-vibrancy', ...rest }) {
    return (
        <button type="button" className={cn(["button token-body", className])} {...rest} data-variant={variant} data-size={btnSize}>
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
