// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { ProtectionHeader as ProtectionHeaderComponent } from '../../shared/js/ui/templates/protection-header'
import { useData, useFeatures, useFetcher, useToggle } from '../data-provider'
import { TextLink } from '../../shared/js/ui/components/text-link'
import { useNav } from '../navigation'
import { ns } from '../../shared/js/ui/base/localize'
import { isAndroid, isIOS } from '../../shared/js/ui/environment-check'
import { CheckBrokenSiteReportHandledMessage } from '../../shared/js/browser/common'

export function ProtectionHeader() {
    const { push } = useNav()
    const data = useData()
    const onToggle = useToggle()
    const fetcher = useFetcher()
    const { breakageScreen } = useFeatures()

    return (
        <div data-testid="protectionHeader">
            <ProtectionHeaderComponent model={data} toggle={onToggle}>
                <div className="text--center">
                    <TextLink
                        onClick={() => {
                            // this is a workaround for ios, to ensure we follow the old implementation
                            if (isIOS()) {
                                fetcher(new CheckBrokenSiteReportHandledMessage())
                                    .then(() => push(breakageScreen))
                                    .catch(console.error)
                            } else if (isAndroid()) {
                                fetcher(new CheckBrokenSiteReportHandledMessage()).catch(console.error)
                            }
                        }}
                        rounded={true}
                    >
                        {ns.site('websiteNotWorkingPrompt.title')}
                    </TextLink>
                </div>
            </ProtectionHeaderComponent>
        </div>
    )
}
