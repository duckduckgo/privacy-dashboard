// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useData, useFetcher } from '../data-provider'
import { ToggleReportProvider } from '../../shared/js/ui/components/toggle-report/toggle-report-provider'
import { ToggleReport } from '../../shared/js/ui/components/toggle-report'
import { useEffect } from 'preact/hooks'
import { CloseMessage } from '../../shared/js/browser/common'
import { Done, TopNav } from '../components/top-nav'

export function ToggleReportScreen() {
    const fetcher = useFetcher()
    const data = useData()
    useEffect(() => {
        document.body.dataset.screen = 'toggleReport'
        return () => {
            document.body.dataset.screen = ''
        }
    }, [])

    function done() {
        const msg = new CloseMessage({ eventOrigin: { screen: data.features.initialScreen } })
        fetcher(msg).catch(console.error)
    }

    return (
        <div data-testid="toggle-report">
            <div data-toggle-report="parent" className="toggle-report" data-opener={data.features.opener} style="min-height: 286px">
                <TopNav done={<Done onClick={done} />} />
                <ToggleReportProvider model={{ fetch: fetcher }} screen={data.features.initialScreen}>
                    <ToggleReport />
                </ToggleReportProvider>
            </div>
        </div>
    )
}
