// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { ns } from '../../shared/js/ui/base/localize';
import { platformSwitch } from '../../shared/js/ui/environment-check';
import { useCanPop, useNav } from '../navigation';
import { useClose } from '../data-provider';

/**
 * @param {object} props
 * @param {import("preact").ComponentChild} [props.back]
 * @param {import("preact").ComponentChild} [props.done]
 * @param {import("preact").ComponentChild} [props.children]
 */
export function TopNav({ back, done, children }) {
    return (
        <div>
            <div className="top-nav">
                {back}
                {children}
                {done}
            </div>
            <div className="top-nav__spacer" />
        </div>
    );
}

/**
 * @param {object} props
 * @param {import("preact").ComponentChild} [props.children]
 */
export function SecondaryTopNav({ children }) {
    const { pop } = useNav();
    const onClose = useClose();
    return platformSwitch({
        ios: () => {
            return (
                <TopNav back={<Back onClick={pop} />} done={<Done onClick={onClose} />}>
                    {children}
                </TopNav>
            );
        },
        default: () => {
            return (
                <TopNav back={<Back onClick={pop} />} done={null}>
                    {children}
                </TopNav>
            );
        },
    });
}

/**
 * @param {object} props
 * @param {boolean} [props.hideBackButton=false]
 * @param {import("preact").ComponentChild} [props.children]
 */
export function SecondaryTopNavAlt({ hideBackButton = false, children }) {
    const { pop } = useNav();
    const canPop = useCanPop();
    const onClose = useClose();

    const canGoBack = canPop && !hideBackButton;

    return platformSwitch({
        ios: () => {
            return (
                <TopNav back={canGoBack ? <Back onClick={pop} /> : null} done={<Cancel onClick={onClose} />}>
                    {children}
                </TopNav>
            );
        },
        android: () => {
            return <TopNav back={canGoBack ? <Back onClick={pop} /> : <Back onClick={onClose} />}>{children}</TopNav>;
        },
        browser: () => {
            return <TopNav back={canGoBack ? <Back onClick={pop} /> : null}>{children}</TopNav>;
        },
        default: () => {
            return (
                <TopNav back={canGoBack ? <Back onClick={pop} /> : null} done={<Close onClick={onClose} />}>
                    {children}
                </TopNav>
            );
        },
    });
}

export function Back({ onClick }) {
    const textLabel = ns.site('navigationBack.title');
    return (
        <a
            href="javascript:void(0)"
            onClick={onClick}
            className="top-nav__back link-action link-action--dark"
            role="button"
            aria-label={textLabel}
        >
            <span className="icon icon__back-arrow" data-icon-text={textLabel}></span>
        </a>
    );
}

export function Done({ textLabel = ns.site('navigationComplete.title'), onClick }) {
    return (
        <a href="javascript:void(0)" onClick={onClick} className="top-nav__done link-action link-action--dark" role="button">
            {textLabel}
        </a>
    );
}

export function Close({ onClick }) {
    return <Done textLabel={ns.site('navigationClose.title')} onClick={onClick} />;
}

export function Cancel({ onClick }) {
    return (
        <a href="javascript:void(0)" onClick={onClick} className="top-nav__cancel link-action link-action--dark" role="button">
            {ns.site('navigationCancel.title')}
        </a>
    );
}

export function Title({ children }) {
    return <span className="top-nav__title">{children}</span>;
}
