// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useData, useFetcher } from '../data-provider'
import { ToggleReportProvider } from '../../shared/js/ui/components/toggle-report/toggle-report-provider'
import { ToggleReport } from '../../shared/js/ui/components/toggle-report'
import { useEffect } from 'preact/hooks'
import { CloseMessage } from '../../shared/js/browser/common'
import { ns } from '../../shared/js/ui/base/localize'

export function ToggleReportScreen() {
    const fetcher = useFetcher()
    const data = useData()
    useEffect(() => {
        document.body.dataset.screen = 'toggleReport'
        return () => {
            document.body.dataset.screen = ''
        }
    }, [])

    return (
        <div data-testid="toggle-report">
            <div data-toggle-report="parent" className="toggle-report" data-opener={data.features.opener} style="min-height: 286px">
                <div>
                    <div className="top-nav">
                        <a
                            href="javascript:void(0)"
                            role="button"
                            className="top-nav__done link-action link-action--dark"
                            onClick={() => fetcher(new CloseMessage({ eventOrigin: { screen: data.features.initialScreen } }))}
                        >
                            {ns.site('navigationClose.title')}
                        </a>
                    </div>
                    <div className="top-nav__spacer"></div>
                </div>
                <ToggleReportProvider model={{ fetch: fetcher }} screen={data.features.initialScreen}>
                    <ToggleReport />
                </ToggleReportProvider>
            </div>
        </div>
    )
}
