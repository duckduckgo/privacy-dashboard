// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact'
import html from 'nanohtml'
import { topNav } from '../templates/shared/top-nav'
import { ns } from '../base/localize'
import { PlainTextLink } from './text-link'
import { Button, ButtonBar } from './button'
import { platform } from '../../browser/communication'
import { Scrollable, Stack } from './stack'
import { useContext } from 'preact/hooks'
import { useIosAnimation } from './toggle-report/use-ios-animation'
import { ToggleReportContext, ToggleReportProvider } from './toggle-report/toggle-report-provider'
import { useToggleReportState } from './toggle-report/use-toggle-report-state'
import { ToggleReportDataList } from './toggle-report/toggle-report-data-list'
import { ToggleReportSent } from './toggle-report/toggle-report-sent'
import { ToggleReportWrapper } from './toggle-report/toggle-report-wrapper'
import { ToggleReportTitle } from './toggle-report/toggle-report-title'

export function ToggleReport() {
    const buttonVariant = platform.name === 'ios' ? 'ios-secondary' : 'macos-standard'
    const buttonLayout = platform.name === 'ios' ? 'vertical' : 'horizontal'
    const buttonSize = platform.name === 'ios' ? 'big' : 'small'
    const innerGap = platform.name === 'ios' ? '24px' : '16px'

    // data context (data, api, messages)
    const { value, didClickSuccessScreen } = useContext(ToggleReportContext)

    // local state
    const [state, dispatch] = useToggleReportState()

    // iOS animation
    useIosAnimation(state, dispatch)

    // on macOS only, transition to a success screen
    if (state.value === 'sent' && platform.name === 'macos') {
        return (
            <ToggleReportWrapper state={state.value}>
                <ToggleReportSent onClick={didClickSuccessScreen} />
            </ToggleReportWrapper>
        )
    }

    return (
        <ToggleReportWrapper state={state.value}>
            <Stack gap="40px">
                <Stack gap="24px">
                    <Stack gap={innerGap}>
                        <div className="medium-icon-container hero-icon--toggle-report"></div>
                        <ToggleReportTitle>{ns.noTrans('siteNotWorkingTitle.title')}</ToggleReportTitle>
                        <div>
                            <h2 className="token-title-3 text--center">{ns.noTrans('siteNotWorkingSubTitle.title')}</h2>
                            {platform.name === 'macos' && (
                                <div>
                                    <p className={'text--center token-title-3'}>
                                        <PlainTextLink onClick={() => dispatch('toggle')}>
                                            {state.value === 'hiding' && ns.noTrans('siteNotWorkingInfoReveal.title')}
                                            {state.value === 'showing' && ns.noTrans('siteNotWorkingInfoHide.title')}
                                        </PlainTextLink>
                                    </p>
                                </div>
                            )}
                        </div>
                    </Stack>
                    {platform.name === 'macos' && state.value === 'showing' && (
                        <Scrollable>
                            <ToggleReportDataList rows={value.data} />
                        </Scrollable>
                    )}
                    <ButtonBar layout={buttonLayout}>
                        <Button variant={buttonVariant} btnSize={buttonSize} onClick={() => dispatch('reject')}>
                            {ns.noTrans('dontSendReport.title')}
                        </Button>
                        <Button variant={buttonVariant} btnSize={buttonSize} onClick={() => dispatch('send')}>
                            {ns.report('sendReport.title')}
                        </Button>
                    </ButtonBar>
                    {platform.name === 'ios' && state.value !== 'showing' && (
                        <p className={'text--center token-title-3'}>
                            <PlainTextLink onClick={() => dispatch('toggle-ios')} className="token-bold">
                                {ns.noTrans('siteNotWorkingInfoReveal.title')}
                            </PlainTextLink>
                        </p>
                    )}
                </Stack>
                {platform.name === 'ios' && state.value === 'showing' && (
                    <div className="ios-separator">
                        <ToggleReportDataList rows={value.data} />
                    </div>
                )}
            </Stack>
        </ToggleReportWrapper>
    )
}

/**
 * @this {{
 *     mainModel: import('../models/site.js').PublicSiteModel,
 *     model: import('../models/breakage-form').BreakageFormModel & { opener: string, fetch: (arg: import("../../browser/common").Msg) => Promise<unknown> | void },
 *     roots: Map<HTMLElement, boolean>,
 *     immediate: boolean,
 *     fetch: any,
 * }}
 */
export function toggleReportTemplate() {
    const root = html`<div data-testid="toggle-report"></div>`
    const template = html`
        <section class="sliding-subview">
            <div data-toggle-report="parent" class="toggle-report" data-opener=${this.model.opener} style="min-height: 286px">
                ${topNav({ view: 'secondary', immediate: this.immediate })} ${root}
            </div>
        </section>
    `
    this.roots.set(root, true)
    render(
        <ToggleReportProvider model={this.model} screen={'toggleReport'}>
            <ToggleReport />
        </ToggleReportProvider>,
        root
    )
    return template
}
