// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { Stack } from '../stack';
import { ns } from '../../base/localize';
import { ToggleReportIcon } from '../toggle-report';

export function ToggleReportSent({ onClick }) {
    return (
        <div onClick={onClick}>
            <ToggleReportIcon variant="sent" />
            <Stack gap={'8px'}>
                <h1 className="token-title-2-em text--center">{ns.report('thankYou.title')}</h1>
                <h2 className="token-title-3 text--center text--balance">{ns.toggleReport('yourReportWillHelpToggleReport.title')}</h2>
            </Stack>
        </div>
    );
}
