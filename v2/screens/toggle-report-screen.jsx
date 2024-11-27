// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { useClose, useConnectionCount, useFeatures, useFetcher } from '../data-provider';
import { useToggleReportState } from '../../shared/js/ui/components/toggle-report/use-toggle-report-state';
import { ToggleReportProvider } from '../../shared/js/ui/components/toggle-report/toggle-report-provider';
import { ToggleReport } from '../../shared/js/ui/components/toggle-report';
import { useEffect } from 'preact/hooks';
import { Back, Close, Done, TopNav } from '../components/top-nav';
import { platformSwitch } from '../../shared/js/ui/environment-check';

export function ToggleReportScreen() {
    const fetcher = useFetcher();
    const features = useFeatures();
    const { count } = useConnectionCount();
    const connectionId = `connection-${count}`;

    useEffect(() => {
        document.body.dataset.screen = 'toggleReport';
        return () => {
            document.body.dataset.screen = '';
        };
    }, []);

    return (
        <ToggleReportProvider key={connectionId} model={{ fetch: fetcher }} screen={features.initialScreen}>
            <ToggleReportWrapper>
                <ToggleReport />
            </ToggleReportWrapper>
        </ToggleReportProvider>
    );
}

export function ToggleReportWrapper({ children }) {
    const features = useFeatures();
    const onClose = useClose();
    const [_, dispatch] = useToggleReportState();

    useEffect(() => {
        document.body.dataset.screen = 'toggleReport';
        return () => {
            document.body.dataset.screen = '';
        };
    }, []);

    const done = platformSwitch({
        ios: () => <Done onClick={onClose} />,
        macos: () => <Close onClick={onClose} />,
        default: () => null,
    });

    const back = platformSwitch({
        android: () => <Back onClick={() => dispatch('reject')} />,
        default: () => null,
    });

    return (
        <div data-toggle-report="parent" class="toggle-report page-inner" data-opener={features.opener}>
            {features.opener === 'menu' ? <TopNav back={back} done={done} /> : <TopNav back={back} />}
            <div data-testid="toggle-report">{children}</div>
        </div>
    );
}
