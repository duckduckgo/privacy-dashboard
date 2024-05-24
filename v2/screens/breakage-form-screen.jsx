// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'
import { ns } from '../../shared/js/ui/base/localize'
import { largeHeroIcon } from '../../shared/js/ui/templates/shared/hero'
import { DomNode } from '../dom-node'
import { useState } from 'preact/hooks'
import { CloseMessage, SubmitBrokenSiteReportMessage } from '../../shared/js/browser/common'
import { ToggleAllowList, useData, useFetcher } from '../data-provider'
import { ProtectionHeader } from '../../shared/js/ui/templates/protection-header'
import { Back, Done, TopNav } from '../components/top-nav'

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
    const { pop } = useNav()
    const data = useData()
    const fetcher = useFetcher()
    const [state, setState] = useState(/** @type {"idle" | "sent"} */ 'idle')

    const icon = largeHeroIcon({
        status: 'breakage-form',
    })

    let bullet = '\u000A • '
    let placeholder = ns.report('tellUsMoreDesc.title', { bullet })
    /**
     * Currently using the visibility of the toggle to determine which title
     * to use. This might be too simplistic and need updating later.
     */
    let headerText = includeToggle ? ns.report('selectTheOptionDesc.title') : ns.report('selectTheOptionDescV2.title')

    function submit(e) {
        e.preventDefault()
        const values = Object.fromEntries(new FormData(e.target))
        const msg = new SubmitBrokenSiteReportMessage({
            category: String(values.category) || '',
            description: String(values.description) || '',
        })
        setState('sent')
        fetcher(msg).catch(console.error)
    }

    function toggle() {
        const msg = new ToggleAllowList().intoMessage(data, { screen: data.features.initialScreen })
        fetcher(msg).catch(console.error)
    }

    function done() {
        const msg = new CloseMessage({ eventOrigin: { screen: data.features.initialScreen } })
        fetcher(msg).catch(console.error)
    }
    let topNav = <TopNav back={<Back onClick={pop} />} />
    if (data.features.initialScreen === 'breakageForm') {
        topNav = <TopNav done={<Done onClick={done} />} />
    }
    if (data.features.initialScreen === 'toggleReport') {
        topNav = <TopNav done={<Done onClick={done} />} />
    }
    if (data.features.initialScreen === 'promptBreakageForm') {
        topNav = <TopNav done={<Done onClick={done} />} />
    }

    return (
        <div className="breakage-form">
            {topNav}
            <div className="breakage-form__inner" data-state={state}>
                {includeToggle && (
                    <div class="header header--breakage">
                        <ProtectionHeader model={data} initialState={'site-not-working'} toggle={toggle} />
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
                    <form className="breakage-form__element" onSubmit={submit}>
                        <div className="form__group">
                            <div className="form__select breakage-form__input--dropdown">
                                <select name="category">
                                    <option value="">{ns.report('pickYourIssueFromTheList.title')}</option>$
                                    {categories.map(function (item) {
                                        return <option value={item.value}>{item.category}</option>
                                    })}
                                </select>
                            </div>
                            <textarea className="form__textarea" placeholder={placeholder} maxLength={2500} name="description"></textarea>
                            <button className="form__submit token-label-em" type="submit">
                                {ns.report('sendReport.title')}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="breakage-form__footer padding-x-double token-breakage-form-body">
                    {ns.report('reportsAreAnonymousDesc.title')}
                </div>
            </div>
        </div>
    )
}
