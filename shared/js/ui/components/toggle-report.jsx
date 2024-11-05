// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { ns } from '../base/localize';
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

export function ToggleReport() {
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
                <div className="toggle-report__heading">
                    <Stack gap="16px">
                        <div className="medium-icon-container hero-icon--toggle-report"></div>
                        <ToggleReportTitle>{ns.toggleReport('siteNotWorkingTitle.title')}</ToggleReportTitle>
                        <div>
                            <h2 className="token-title-3 text--center">{ns.toggleReport('siteNotWorkingSubTitle.title')}</h2>
                            <DesktopRevealText state={state} toggle={() => dispatch('toggle')} />
                        </div>
                    </Stack>
                </div>
                {state.value === 'showing' && (
                    <div className="toggle-report__scroller">
                        <Scrollable>
                            <ToggleReportDataList rows={value.data} />
                        </Scrollable>
                    </div>
                )}
                <div>
                    <ToggleReportButtons send={() => dispatch('send')} reject={() => dispatch('reject')} />
                </div>
            </ToggleReportWrapper>
        );
    }

    if (platform.name === 'ios') {
        return (
            <ToggleReportWrapper state={state.value}>
                <Stack gap="40px">
                    <Stack gap="24px">
                        <Stack gap="24px">
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

function ToggleReportButtons({ send, reject }) {
    const buttonVariant = platform.name === 'ios' ? 'ios-secondary' : 'desktop-vibrancy';
    const buttonLayout = platform.name === 'ios' ? 'vertical' : 'horizontal';
    const buttonSize = platform.name === 'ios' ? 'big' : 'desktop-large';

    return (
        <ButtonBar layout={buttonLayout}>
            <Button variant={buttonVariant} btnSize={buttonSize} onClick={reject}>
                {ns.toggleReport('dontSendReport.title')}
            </Button>
            <Button variant={buttonVariant} btnSize={buttonSize} onClick={send}>
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
    return (
        <div>
            <p className={'text--center token-title-3'}>
                <PlainTextLink onClick={toggle}>
                    {state.value === 'hiding' && ns.toggleReport('siteNotWorkingInfoReveal.title')}
                    {state.value === 'showing' && ns.toggleReport('siteNotWorkingInfoHide.title')}
                </PlainTextLink>
            </p>
        </div>
    );
}
