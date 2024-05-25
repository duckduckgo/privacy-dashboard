// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useClose, useFeatures, useFetcher } from '../data-provider'
import { ToggleReportProvider } from '../../shared/js/ui/components/toggle-report/toggle-report-provider'
import { ToggleReport } from '../../shared/js/ui/components/toggle-report'
import { useEffect } from 'preact/hooks'
import { Done, TopNav } from '../components/top-nav'

export function ToggleReportScreen() {
    const fetcher = useFetcher()
    const features = useFeatures()
    const onClose = useClose()

    useEffect(() => {
        document.body.dataset.screen = 'toggleReport'
        return () => {
            document.body.dataset.screen = ''
        }
    }, [])

    return (
        <div data-testid="toggle-report">
            <div data-toggle-report="parent" class="toggle-report" data-opener={features.opener}>
                {features.opener === 'menu' ? <TopNav done={<Done onClick={onClose} />} /> : <TopNav />}
                <ToggleReportProvider model={{ fetch: fetcher }} screen={features.initialScreen}>
                    <ToggleReport />
                </ToggleReportProvider>
            </div>
        </div>
    )
}
