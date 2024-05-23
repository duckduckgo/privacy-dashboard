// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useFetcher } from '../data-provider'
import { ToggleReportProvider } from '../../shared/js/ui/components/toggle-report/toggle-report-provider'
import { ToggleReport } from '../../shared/js/ui/components/toggle-report'
import { useEffect } from 'preact/hooks'

export function ToggleReportScreen() {
    const fetcher = useFetcher()
    useEffect(() => {
        document.body.dataset.screen = 'toggleReport'
        return () => {
            document.body.dataset.screen = ''
        }
    }, [])

    // todo(v2): add opener param
    return (
        <div data-testid="toggle-report">
            <div data-toggle-report="parent" className="toggle-report" data-opener={'todo(v2): data opener'} style="min-height: 286px">
                <div>
                    <div className="top-nav">
                        <a href="javascript:void(0)" role="button" className="top-nav__done link-action link-action--dark">
                            Close
                        </a>
                    </div>
                    <div className="top-nav__spacer"></div>
                </div>
                <ToggleReportProvider model={{ fetch: fetcher }}>
                    <ToggleReport />
                </ToggleReportProvider>
            </div>
        </div>
    )
}
