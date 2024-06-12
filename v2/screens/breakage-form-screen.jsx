// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { ns } from '../../shared/js/ui/base/localize'
import { largeHeroIcon } from '../../shared/js/ui/templates/shared/hero'
import { DomNode } from '../dom-node'
import { useState } from 'preact/hooks'
import { useClose, useData, useSendReport, useToggle } from '../data-provider'
import { ProtectionHeader } from '../../shared/js/ui/templates/protection-header'
import { Close, Done, SecondaryTopNav, TopNav } from '../components/top-nav'
import { useNav } from '../navigation'
import { platformSwitch } from '../../shared/js/ui/environment-check'

export const categories = () => {
    return {
        blocked: ns.report('blocked.title'),
        layout: ns.report('layout.title'),
        'empty-spaces': ns.report('emptySpaces.title'),
        paywall: ns.report('paywall.title'),
        videos: ns.report('videos.title'),
        comments: ns.report('comments.title'),
        login: ns.report('login.title'),
        shopping: ns.report('shopping.title'),
        other: ns.report('other.title'),
    }
}

/**
 * @param {object} props
 * @param {object} props.includeToggle
 */
export function BreakageFormScreen({ includeToggle }) {
    const data = useData()
    const onToggle = useToggle()
    const onClose = useClose()
    const nav = useNav()
    const canPop = nav.canPop()
    const sendReport = useSendReport()
    const [state, setState] = useState(/** @type {"idle" | "sent"} */ 'idle')

    const icon = largeHeroIcon({
        status: 'breakage-form',
    })

    /**
     * Currently using the visibility of the toggle to determine which title
     * to use. This might be too simplistic and need updating later.
     */
    let headerText = includeToggle ? ns.report('selectTheOptionDesc.title') : ns.report('selectTheOptionDescV2.title')

    function submit(e) {
        e.preventDefault()
        const values = Object.fromEntries(new FormData(e.target))
        sendReport({
            category: String(values.category || ''),
            description: String(values.description || ''),
        })
        setState('sent')
    }

    let topNav = <SecondaryTopNav />

    // if we can't go back, swap out the nav
    if (!canPop) {
        topNav = platformSwitch({
            ios: () => <TopNav done={<Done onClick={onClose} />} />,
            default: () => <TopNav done={<Close onClick={onClose} />} />,
        })
    }

    return (
        <div className="breakage-form page-inner">
            {topNav}
            <div className="breakage-form__inner" data-state={state}>
                {includeToggle && (
                    <div class="header header--breakage">
                        <ProtectionHeader
                            model={data}
                            initialState={'site-not-working'}
                            toggle={onToggle}
                            data-testid="breakage-form-protection-header"
                        />
                    </div>
                )}
                <div className="key-insight key-insight--breakage padding-x-double">
                    {/* @ts-ignore */}
                    <DomNode>{icon}</DomNode>
                    <div className="breakage-form__advise">
                        <p className="token-title-3">{headerText}</p>
                    </div>
                    <div className="thanks">
                        <p className="thanks__primary">{ns.report('thankYou.title')}</p>
                        <p className="thanks__secondary">{ns.report('yourReportWillHelpDesc.title')}</p>
                    </div>
                </div>
                <div className="breakage-form__content padding-x-double">
                    <FormElement
                        onSubmit={submit}
                        before={
                            <div className="form__select breakage-form__input--dropdown">
                                <select name="category">
                                    <option value="">{ns.report('pickYourIssueFromTheList.title')}</option>$
                                    {Object.entries(categories()).map(([key, value]) => {
                                        return <option value={key}>{value}</option>
                                    })}
                                </select>
                            </div>
                        }
                    />
                </div>
                <div className="breakage-form__footer padding-x-double token-breakage-form-body">
                    {ns.report('reportsAreAnonymousDesc.title')}
                </div>
            </div>
        </div>
    )
}

/**
 * Creates a form element.
 *
 * @param {Object} options - The options for the form element.
 * @param {(args:any) => void} options.onSubmit - The submit event handler function for the form.
 * @param {import("preact").ComponentChild} [options.before] - The content to display before the textarea.
 * @param {import("preact").ComponentChild} [options.after] - The content to display before the textarea.
 * @param {string} [options.placeholder] - The placeholder text in the textare
 */
export function FormElement({ onSubmit, before, after, placeholder }) {
    let bullet = '\u000A • '
    placeholder = placeholder || ns.report('tellUsMoreDesc.title', { bullet })

    return (
        <form className="breakage-form__element" onSubmit={onSubmit}>
            <div className="form__group">
                {before}
                <textarea className="form__textarea" placeholder={placeholder} maxLength={2500} name="description"></textarea>
                {after}
            </div>
            <button className="form__submit token-label-em" type="submit">
                {ns.report('sendReport.title')}
            </button>
        </form>
    )
}
