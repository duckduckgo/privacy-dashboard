// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { ns } from '../base/localize';
import cn from 'classnames';
import { PlainTextLink } from './text-link';
import { Button, ButtonBar } from './button';
import { platform } from '../../browser/communication';
import { Scrollable, Stack } from './stack';
import { useContext } from 'preact/hooks';
import { useIosAnimation } from './toggle-report/use-ios-animation';
import { ToggleReportContext } from './toggle-report/toggle-report-provider';
import { useToggleReportState } from './toggle-report/use-toggle-report-state';
import { ToggleReportDataList } from './toggle-report/toggle-report-data-list';
import { ToggleReportSent } from './toggle-report/toggle-report-sent';
import { ToggleReportWrapper } from './toggle-report/toggle-report-wrapper';
import { ToggleReportTitle } from './toggle-report/toggle-report-title';

/**
 * @param {object} props
 * @param {'standard'|'sent'} [props.variant='standard']
 * @returns
 */
export function ToggleReportIcon({ variant = 'standard' }) {
    const classes = cn({
        'hero-icon--toggle-report': variant === 'standard',
        'hero-icon--toggle-report-sent': variant === 'sent',
        'medium-icon-container': true,
    });

    return <div className={classes}></div>;
}

export function ToggleReport() {
    const mobile = platform.name === 'android' || platform.name === 'ios';
    const innerGap = mobile ? '24px' : '16px';
    const desktop = platform.name === 'macos' || platform.name === 'windows';
    const extension = platform.name === 'browser';

    // data context (data, api, messages)
    const { value, didClickSuccessScreen } = useContext(ToggleReportContext);

    // local state
    const [state, dispatch] = useToggleReportState();

    // iOS animation
    useIosAnimation(state, dispatch);

    // on desktop only, transition to a success screen
    if (state.value === 'sent' && (desktop || extension)) {
        return (
            <ToggleReportWrapper state={state.value}>
                <ToggleReportSent onClick={didClickSuccessScreen} />
            </ToggleReportWrapper>
        );
    }

    if (desktop || extension) {
        return (
            <ToggleReportWrapper state={state.value}>
                <Stack gap="40px">
                    <Stack gap="24px">
                        <Stack gap={innerGap}>
                            <ToggleReportIcon />
                            <ToggleReportTitle>{ns.toggleReport('siteNotWorkingTitle.title')}</ToggleReportTitle>
                            <Stack gap="24px">
                                <h2 className="token-title-3 text--center">{ns.toggleReport('siteNotWorkingSubTitle.title')}</h2>
                                <DesktopRevealText state={state} toggle={() => dispatch('toggle')} />
                            </Stack>
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
        );
    }

    if (mobile) {
        return (
            <ToggleReportWrapper state={state.value}>
                <Stack gap="40px">
                    <Stack gap="24px">
                        <Stack gap={innerGap}>
                            <ToggleReportIcon />
                            <ToggleReportTitle>{ns.toggleReport('siteNotWorkingTitle.title')}</ToggleReportTitle>
                            <div>
                                <h2 className="token-title-3 text--center">{ns.toggleReport('siteNotWorkingSubTitle.title')}</h2>
                            </div>
                        </Stack>
                        <ToggleReportButtons send={() => dispatch('send')} reject={() => dispatch('reject')} />
                        {state.value !== 'showing' && (
                            <RevealText toggle={() => dispatch(platform.name === 'ios' ? 'toggle-ios' : 'toggle')} />
                        )}
                    </Stack>
                    {state.value === 'showing' && (
                        <div className="ios-separator">
                            <ToggleReportDataList rows={value.data} />
                        </div>
                    )}
                </Stack>
            </ToggleReportWrapper>
        );
    }

    return <p>unsupported platform: {platform.name}</p>;
}

/**
 * @typedef {object} ButtonStyle
 * @property {import('./button').ComponentProps['variant']} variant
 * @property {import('./button').ComponentProps['btnSize']} size
 * @property {import('./button').ButtonBarComponentProps['layout']} layout
 * @returns {ButtonStyle}
 */
function getButtonStyles() {
    switch (platform.name) {
        case 'ios':
        case 'android':
            return { variant: 'ios-secondary', size: 'big', layout: 'vertical' };
        case 'windows':
            return { variant: 'desktop-standard', size: 'desktop-large', layout: 'horizontal' };
        default:
            return { variant: 'desktop-vibrancy', size: 'desktop-large', layout: 'horizontal' };
    }
}

function ToggleReportButtons({ send, reject }) {
    const { variant, size, layout } = getButtonStyles();

    return (
        <ButtonBar layout={layout}>
            <Button variant={variant} btnSize={size} onClick={reject}>
                {ns.toggleReport('dontSendReport.title')}
            </Button>
            <Button variant={variant} btnSize={size} onClick={send}>
                {ns.report('sendReport.title')}
            </Button>
        </ButtonBar>
    );
}

function RevealText({ toggle }) {
    return (
        <p className={'text--center token-title-3'}>
            <PlainTextLink onClick={toggle} className="token-bold">
                {ns.toggleReport('siteNotWorkingInfoReveal.title')}
            </PlainTextLink>
        </p>
    );
}

function DesktopRevealText({ state, toggle }) {
    if (state.value === 'showing') return null;

    return (
        <div>
            <p className={'text--center token-title-3'}>
                <PlainTextLink onClick={toggle}>{ns.toggleReport('siteNotWorkingInfoReveal.title')}</PlainTextLink>
            </p>
        </div>
    );
}
