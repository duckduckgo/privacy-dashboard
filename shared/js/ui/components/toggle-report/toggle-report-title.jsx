// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { platform } from '../../../browser/communication';

export function ToggleReportTitle({ children }) {
    switch (platform.name) {
        case 'android':
        case 'ios':
            return <h1 className="token-ios-title-3 text--center">{children}</h1>;
        case 'windows':
        case 'browser':
        case 'macos':
            return <h1 className="token-title-2-em text--center">{children}</h1>;
        default:
            return null;
    }
}
