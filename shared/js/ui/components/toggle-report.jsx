// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h, render } from 'preact'
import html from 'nanohtml'
import { topNav } from '../templates/shared/top-nav'
import { ns } from '../base/localize'
import { PlainTextLink } from './text-link'
import { Button, ButtonBar } from './button'
import { platform } from '../../browser/communication'
import { Scrollable, Stack } from './stack'
import { useContext, useEffect, useReducer } from 'preact/hooks'
import { FetchToggleReportOptions, RejectToggleBreakageReport, SeeWhatIsSent, SendToggleBreakageReport } from '../../browser/common'
import { namedString } from '../../../data/text'

export function ToggleReport() {
    const buttonVariant = platform.name === 'ios' ? 'ios-secondary' : 'macos-standard'
    const buttonLayout = platform.name === 'ios' ? 'vertical' : 'horizontal'
    const buttonSize = platform.name === 'ios' ? 'big' : 'small'
    const innerGap = platform.name === 'ios' ? '24px' : '16px'
    const { value, send, reject, didShowWhatIsSent } = useContext(DataContext)
    useEffect(() => {
        let int = setTimeout(() => {
            /** @type {HTMLElement | null} */
            const f = document.querySelector('[class="breakage-form"]')
            if (f) f.style.minHeight = 'auto'
        }, 1000)
        return () => clearTimeout(int)
    }, [])
    const [state, dispatch] = useReducer(
        (state, /** @type {"toggle" | "toggle-ios" | "animation-complete" | "send" | "reject"} */ action) => {
            switch (action) {
                case 'toggle-ios': {
                    didShowWhatIsSent()
                    return { ...state, value: /** @type {const} */ ('animating') }
                }
                case 'animation-complete': {
                    return { ...state, value: /** @type {const} */ ('showing') }
                }
                case 'toggle': {
                    const next = state.value === 'hiding' ? /** @type {const} */ ('showing') : /** @type {const} */ ('hiding')
                    if (next === 'showing') {
                        didShowWhatIsSent()
                    }
                    return { ...state, value: next }
                }
                case 'send': {
                    send()
                    return { ...state, value: /** @type {const} */ ('sent') }
                }
                case 'reject': {
                    reject()
                    return state
                }
            }
            return state
        },
        { value: /** @type {'hiding' | 'showing' | 'sent' | 'rejected' | 'animating'} */ ('hiding') }
    )
    useEffect(() => {
        if (state.value !== 'animating') return
        let int = setTimeout(() => {
            dispatch('animation-complete')
        }, 500)
        return () => clearTimeout(int)
    }, [state.value])
    if (state.value === 'sent' && platform.name === 'macos') {
        return (
            <ToggleReportWrapper state={state.value}>
                <Sent />
            </ToggleReportWrapper>
        )
    }
    return (
        <ToggleReportWrapper state={state.value}>
            <Stack gap="40px" className="fade-in">
                <Stack gap="24px">
                    <Stack gap={innerGap}>
                        <div className="medium-icon-container hero-icon--toggle-report"></div>
                        <ToggleReportTitle>{ns.report('siteNotWorkingTitle.title')}</ToggleReportTitle>
                        <div>
                            <h2 className="token-title-3 text--center">{ns.report('siteNotWorkingSubTitle.title')}</h2>
                            {platform.name === 'macos' && (
                                <div>
                                    <p className={'text--center token-title-3'}>
                                        <PlainTextLink onClick={() => dispatch('toggle')}>
                                            {state.value === 'hiding' && ns.report('siteNotWorkingInfoReveal.title')}
                                            {state.value === 'showing' && ns.report('siteNotWorkingInfoHide.title')}
                                        </PlainTextLink>
                                    </p>
                                </div>
                            )}
                        </div>
                    </Stack>
                    {platform.name === 'macos' && state.value === 'showing' && (
                        <Scrollable>
                            <DataList rows={value.data} />
                        </Scrollable>
                    )}
                    <ButtonBar layout={buttonLayout}>
                        <Button variant={buttonVariant} btnSize={buttonSize} onClick={() => dispatch('reject')}>
                            {ns.report('dontSendReport.title')}
                        </Button>
                        <Button variant={buttonVariant} btnSize={buttonSize} onClick={() => dispatch('send')}>
                            {ns.report('sendReport.title')}
                        </Button>
                    </ButtonBar>
                    {platform.name === 'ios' && state.value !== 'showing' && (
                        <p className={'text--center token-title-3'}>
                            <PlainTextLink onClick={() => dispatch('toggle-ios')} className="token-bold">
                                {ns.report('siteNotWorkingInfoReveal.title')}
                            </PlainTextLink>
                        </p>
                    )}
                </Stack>
                {platform.name === 'ios' && state.value === 'showing' && (
                    <div className="ios-separator">
                        <DataList rows={value.data} />
                    </div>
                )}
            </Stack>
        </ToggleReportWrapper>
    )
}

function DataList({ rows }) {
    return (
        <Stack gap="4px">
            <p className="token-bold">{ns.report('reportsNoInfoSent.title')}</p>
            <ul className="data-list">
                {rows.map((item) => {
                    const string = namedString(item)
                    const additional = item.id === 'siteUrl' ? '[' + item.additional?.url + ']' : null
                    return (
                        <li className="data-list__item token-breakage-form-body">
                            {string}
                            {additional && <strong className="block">{additional}</strong>}
                        </li>
                    )
                })}
            </ul>
        </Stack>
    )
}

function Sent() {
    return (
        <div>
            <div className="medium-icon-container hero-icon--toggle-report-sent"></div>
            <Stack gap={'8px'}>
                <h1 className="token-title-2-em text--center">{ns.report('thankYou.title')}</h1>
                <h2 className="token-title-3 text--center">{ns.report('yourReportWillHelpDesc.title')}</h2>
            </Stack>
        </div>
    )
}

const DataContext = createContext({
    value: /** @type {import('../../../../schema/__generated__/schema.types').ToggleReportScreen} */ ({}),
    /** @type {() => void} */
    send: () => {
        throw new Error('todo implement send')
    },
    /** @type {() => void} */
    reject: () => {
        throw new Error('todo implement reject')
    },
    /** @type {() => void} */
    didShowWhatIsSent: () => {
        throw new Error('todo implement didShowWhatIsSent')
    },
})

function DataProvider({ children, model }) {
    const initial = { status: 'pending' }
    const [state, dispatch] = useReducer((state, action) => action, initial)
    useEffect(() => {
        const msg = new FetchToggleReportOptions()
        return model
            .fetch(msg)
            .then((data) => {
                console.log('?', data)
                dispatch({ status: 'ready', value: data })
            })
            .catch((e) => {
                dispatch({ status: 'error', error: e.toString() })
            })
    }, [model])

    function send() {
        model.fetch(new SendToggleBreakageReport())
    }
    function reject() {
        model.fetch(new RejectToggleBreakageReport())
    }
    function didShowWhatIsSent() {
        model.fetch(new SeeWhatIsSent())
    }
    if (state.status === 'ready') {
        return <DataContext.Provider value={{ value: state.value, send, reject, didShowWhatIsSent }}>{children}</DataContext.Provider>
    }
    if (state.status === 'error')
        return (
            <div>
                <p>Something went wrong</p>
                <pre>
                    <code>{state.error}</code>
                </pre>
            </div>
        )
    return null
}

function ToggleReportWrapper({ children, state }) {
    switch (platform.name) {
        case 'android':
        case 'ios':
            return (
                <div className="padding-x-xl vertically-centered" data-state={state}>
                    {children}
                </div>
            )
        case 'windows':
        case 'browser':
        case 'macos':
            return <div className="padding-x-double">{children}</div>
        default:
            return null
    }
}

function ToggleReportTitle({ children }) {
    switch (platform.name) {
        case 'android':
        case 'ios':
            return <h1 className="token-ios-title-3 text--center">{children}</h1>
        case 'windows':
        case 'browser':
        case 'macos':
            return <h1 className="token-title-2-em text--center">{children}</h1>
        default:
            return null
    }
}

/**
 * @this {{
 *     mainModel: import('../models/site.js').PublicSiteModel,
 *     model: import('../models/breakage-form').BreakageFormModel & { opener: string },
 *     roots: Map<HTMLElement, boolean>,
 *     immediate: boolean,
 *     fetch: any,
 * }}
 */
export function toggleReportTemplate() {
    const root = html`<div data-testid="toggle-report"></div>`
    const template = html`
        <section class="sliding-subview">
            <div class="breakage-form" data-opener=${this.model.opener} style="min-height: 286px">
                ${topNav({ view: 'secondary', immediate: this.immediate })} ${root}
                ${platform.name === 'macos' ? html`<div style="height: 32px"></div>` : null}
            </div>
        </section>
    `
    this.roots.set(root, true)
    render(
        <DataProvider model={this.model}>
            <ToggleReport />
        </DataProvider>,
        root
    )
    return template
}
