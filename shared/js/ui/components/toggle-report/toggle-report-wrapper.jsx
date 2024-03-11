// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { platform } from '../../../browser/communication'

export function ToggleReportWrapper({ children, state }) {
    switch (platform.name) {
        case 'android':
        case 'ios':
            return (
                <div className="padding-x-xl vertically-centered" data-state={state} data-toggle-report="child">
                    {children}
                </div>
            )
        case 'windows':
        case 'browser':
        case 'macos':
            return (
                <div className="padding-x-double">
                    {children}
                    {state === 'sent' ? <div style="height: 40px"></div> : <div style="height: 32px"></div>}
                </div>
            )
        default:
            return null
    }
}
