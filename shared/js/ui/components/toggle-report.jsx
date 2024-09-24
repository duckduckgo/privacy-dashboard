// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { ns } from '../base/localize'
import { PlainTextLink } from './text-link'
import { Button, ButtonBar } from './button'
import { platform } from '../../browser/communication'
import { Scrollable, Stack } from './stack'
import { useContext } from 'preact/hooks'
import { useIosAnimation } from './toggle-report/use-ios-animation'
import { ToggleReportContext } from './toggle-report/toggle-report-provider'
import { useToggleReportState } from './toggle-report/use-toggle-report-state'
import { ToggleReportDataList } from './toggle-report/toggle-report-data-list'
import { ToggleReportSent } from './toggle-report/toggle-report-sent'
import { ToggleReportWrapper } from './toggle-report/toggle-report-wrapper'
import { ToggleReportTitle } from './toggle-report/toggle-report-title'

export function ToggleReport() {
    const innerGap = platform.name === 'ios' ? '24px' : '16px'
    const desktop = platform.name === 'macos' || platform.name === 'windows'
    const extension = platform.name === 'browser'

    // data context (data, api, messages)
    const { value, didClickSuccessScreen } = useContext(ToggleReportContext)

    // local state
    const [state, dispatch] = useToggleReportState()

    // iOS animation
    useIosAnimation(state, dispatch)

    // on desktop only, transition to a success screen
    if (state.value === 'sent' && desktop) {
        return (
            <ToggleReportWrapper state={state.value}>
                <ToggleReportSent onClick={didClickSuccessScreen} />
            </ToggleReportWrapper>
        )
    }

    if (desktop) {
        return (
            <ToggleReportWrapper state={state.value}>
                <Stack gap="40px">
                    <Stack gap="24px">
                        <Stack gap={innerGap}>
                            <div className="medium-icon-container hero-icon--toggle-report"></div>
                            <ToggleReportTitle>{ns.toggleReport('siteNotWorkingTitle.title')}</ToggleReportTitle>
                            <div>
                                <h2 className="token-title-3 text--center">{ns.toggleReport('siteNotWorkingSubTitle.title')}</h2>
                                <DesktopRevealText state={state} toggle={() => dispatch('toggle')} />
                            </div>
                        </Stack>
                        {state.value === 'showing' && (
                            <Scrollable>
                                <ToggleReportDataList rows={value.data} />
                            </Scrollable>
                        )}
                        <ToggleReportButtons send={() => dispatch('send')} reject={() => dispatch('reject')} />
                    </Stack>
                </Stack>
            </ToggleReportWrapper>
        )
    }

    if (platform.name === 'ios') {
        return (
            <ToggleReportWrapper state={state.value}>
                <Stack gap="40px">
                    <Stack gap="24px">
                        <Stack gap={innerGap}>
                            <div className="medium-icon-container hero-icon--toggle-report"></div>
                            <ToggleReportTitle>{ns.toggleReport('siteNotWorkingTitle.title')}</ToggleReportTitle>
                            <div>
                                <h2 className="token-title-3 text--center">{ns.toggleReport('siteNotWorkingSubTitle.title')}</h2>
                            </div>
                        </Stack>
                        <ToggleReportButtons send={() => dispatch('send')} reject={() => dispatch('reject')} />
                        {state.value !== 'showing' && <RevealText toggle={() => dispatch('toggle-ios')} />}
                    </Stack>
                    {state.value === 'showing' && (
                        <div className="ios-separator">
                            <ToggleReportDataList rows={value.data} />
                        </div>
                    )}
                </Stack>
            </ToggleReportWrapper>
        )
    }

    if (extension) {
        return (
            <ToggleReportWrapper state={state.value}>
                <Stack gap="40px">
                    <Stack gap="24px">
                        <Stack gap={innerGap}>
                            <div className="medium-icon-container hero-icon--toggle-report"></div>
                            <ToggleReportTitle>{ns.toggleReport('siteNotWorkingTitle.title')}</ToggleReportTitle>
                            <div>
                                <h2 className="token-title-3 text--center">{ns.toggleReport('siteNotWorkingSubTitle.title')}</h2>
                            </div>
                        </Stack>
                        <ToggleReportButtons send={() => dispatch('send')} reject={() => dispatch('reject')} />
                        <Scrollable>
                            <ToggleReportDataList rows={value.data} />
                        </Scrollable>
                    </Stack>
                </Stack>
            </ToggleReportWrapper>
        )
    }

    return <p>unsupported platform: {platform.name}</p>
}

function ToggleReportButtons({ send, reject }) {
    const buttonVariant = platform.name === 'ios' ? 'ios-secondary' : 'macos-standard'
    const buttonLayout = platform.name === 'ios' ? 'vertical' : 'horizontal'
    const buttonSize = platform.name === 'ios' ? 'big' : 'small'

    return (
        <ButtonBar layout={buttonLayout}>
            <Button variant={buttonVariant} btnSize={buttonSize} onClick={reject}>
                {ns.toggleReport('dontSendReport.title')}
            </Button>
            <Button variant={buttonVariant} btnSize={buttonSize} onClick={send}>
                {ns.report('sendReport.title')}
            </Button>
        </ButtonBar>
    )
}

function RevealText({ toggle }) {
    return (
        <p className={'text--center token-title-3'}>
            <PlainTextLink onClick={toggle} className="token-bold">
                {ns.toggleReport('siteNotWorkingInfoReveal.title')}
            </PlainTextLink>
        </p>
    )
}

function DesktopRevealText({ state, toggle }) {
    return (
        <div>
            <p className={'text--center token-title-3'}>
                <PlainTextLink onClick={toggle}>
                    {state.value === 'hiding' && ns.toggleReport('siteNotWorkingInfoReveal.title')}
                    {state.value === 'showing' && ns.toggleReport('siteNotWorkingInfoHide.title')}
                </PlainTextLink>
            </p>
        </div>
    )
}
