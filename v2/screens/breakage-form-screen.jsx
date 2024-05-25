// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { ns } from '../../shared/js/ui/base/localize'
import { largeHeroIcon } from '../../shared/js/ui/templates/shared/hero'
import { DomNode } from '../dom-node'
import { useState } from 'preact/hooks'
import { useClose, useData, useSendReport, useToggle } from '../data-provider'
import { ProtectionHeader } from '../../shared/js/ui/templates/protection-header'
import { Done, SecondaryTopNav, TopNav } from '../components/top-nav'
import { useNav } from '../navigation'

const categories = [
    { category: ns.report('blocked.title'), value: 'blocked' },
    { category: ns.report('layout.title'), value: 'layout' },
    { category: ns.report('emptySpaces.title'), value: 'empty-spaces' },
    { category: ns.report('paywall.title'), value: 'paywall' },
    { category: ns.report('videos.title'), value: 'videos' },
    { category: ns.report('comments.title'), value: 'comments' },
    { category: ns.report('login.title'), value: 'login' },
    { category: ns.report('shopping.title'), value: 'shopping' },
    { category: ns.report('other.title'), value: 'other' },
]

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
        topNav = <TopNav done={<Done onClick={onClose} />} />
    }

    return (
        <div className="breakage-form">
            {topNav}
            <div className="breakage-form__inner" data-state={state}>
                {includeToggle && (
                    <div class="header header--breakage">
                        <ProtectionHeader model={data} initialState={'site-not-working'} toggle={onToggle} />
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
                                    {categories.map(function (item) {
                                        return <option value={item.value}>{item.category}</option>
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
