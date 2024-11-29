// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import cn from 'classnames';

/**
 * @typedef {object} ButtonBarComponentProps
 * @property {string} [gap]
 * @property {string} [className]
 * @param {import("preact").ComponentProps<'div'> & ButtonBarComponentProps} props
 */
export function Stack({ children, gap, className, ...rest }) {
    return (
        <div {...rest} className={cn(['stack', className])} style={{ gap: gap }}>
            {children}
        </div>
    );
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
    );
}
