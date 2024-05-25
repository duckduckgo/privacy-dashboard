// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { ns } from '../../shared/js/ui/base/localize'
import { platformSwitch } from '../../shared/js/ui/environment-check'
import { useNav } from '../navigation'
import { useClose } from '../data-provider'

/**
 * @param {object} props
 * @param {import("preact").ComponentChild} [props.back]
 * @param {import("preact").ComponentChild} [props.done]
 */
export function TopNav({ back, done }) {
    return (
        <div>
            <div className="top-nav">
                {back}
                {done}
            </div>
            <div className="top-nav__spacer" />
        </div>
    )
}

export function SecondaryTopNav() {
    const { pop } = useNav()
    const onClose = useClose()
    return platformSwitch({
        ios: () => {
            return <TopNav back={<Back onClick={pop} />} done={<Done onClick={onClose} />} />
        },
        default: () => {
            return <TopNav back={<Back onClick={pop} />} done={null} />
        },
    })
}

export function Back({ onClick }) {
    const textLabel = ns.site('navigationBack.title')
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
    )
}

export function Done({ textLabel = ns.site('navigationComplete.title'), onClick }) {
    return (
        <a href="javascript:void(0)" onClick={onClick} className="top-nav__done link-action link-action--dark" role="button">
            {textLabel}
        </a>
    )
}
