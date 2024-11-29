// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { ns } from '../base/localize';
import cn from 'classnames';
import { PlainTextLink } from './text-link';
import { Button, ButtonBar } from './button';
import { platform } from '../../browser/communication';
import { Scrollable, Stack } from './stack';
import { useContext, useEffect } from 'preact/hooks';
import { useIosAnimation } from './toggle-report/use-ios-animation';
import { ToggleReportContext } from './toggle-report/toggle-report-provider';
import { useToggleReportState } from './toggle-report/use-toggle-report-state';
import { ToggleReportDataList } from './toggle-report/toggle-report-data-list';
import { ToggleReportSent } from './toggle-report/toggle-report-sent';
import { ToggleReportWrapper } from './toggle-report/toggle-report-wrapper';
import { ToggleReportTitle } from './toggle-report/toggle-report-title';
import { getContentHeight, setupMutationObserverForExtensions } from '../../browser/common';

/**
 * @param {object} props
 * @param {'standard'|'sent'} [props.variant='standard']
 * @returns
 */
export function ToggleReportIcon({ variant = 'standard' }) {
    const classes = cn({
        'hero-icon--toggle-report': variant === 'standard',
        'hero-icon--toggle-report-sent': variant === 'sent',
        'large-icon-container': platform.name === 'browser' || platform.name === 'windows',
        'medium-icon-container': platform.name === 'macos' || platform.name === 'ios' || platform.name === 'android',
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
                {extension && <SetAutoHeight />}
                <ToggleReportSent onClick={didClickSuccessScreen} />
            </ToggleReportWrapper>
        );
    }

    if (desktop || extension) {
        return (
            <ToggleReportWrapper state={state.value}>
                {extension && <SetAutoHeight />}
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
 * Sets the height of the page to auto.
 *
 * This function is called to set the height of the page dynamically based on the content height.
 * It searches for the required element in the DOM, sets its height to 'auto', and updates the CSS variable '--height'
 * to reflect the new height. It also sets up a mutation observer to track any changes in the content height
 * and updates the '--height' variable accordingly.
 *
 * This is done as a temporary work-around for the ToggleReport only (and only in the extension).
 * It's very likely we want this behaviour everywhere later.
 */
function SetAutoHeight() {
    useEffect(() => {
        const inner = /** @type {HTMLElement} */ (document.querySelector('[data-screen="toggleReport"] .page-inner'));
        if (inner) {
            inner.style.height = 'auto';
            const height = getContentHeight();

            document.body.style.setProperty('--height', `${height}px`);
            const unsub = setupMutationObserverForExtensions((height) => {
                document.body.style.setProperty('--height', `${height}px`);
            });
            return () => {
                unsub();
            };
        } else {
            console.warn('Could not select the required element');
        }
    }, []);

    return null;
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
