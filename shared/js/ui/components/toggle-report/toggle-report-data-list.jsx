// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { Stack } from '../stack'
import { ns } from '../../base/localize'
import { namedString } from '../../../../data/text'

export function ToggleReportDataList({ rows }) {
    return (
        <Stack gap="4px">
            <p className="token-bold">{ns.toggleReport('reportsNoInfoSent.title')}</p>
            <ul className="data-list">
                {rows.map((item) => {
                    const string = namedString(item)
                    const additional = item.id === 'siteUrl' ? '[' + item.additional?.url + ']' : null
                    return (
                        <li className="data-list__item token-breakage-form-body">
                            <span dangerouslySetInnerHTML={{ __html: `<!-- ${item.id} -->` }}></span>
                            {string}
                            {additional && <strong className="block">{additional}</strong>}
                        </li>
                    )
                })}
            </ul>
        </Stack>
    )
}
