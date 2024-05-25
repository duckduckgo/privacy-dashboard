// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { ProtectionHeader as ProtectionHeaderComponent } from '../../shared/js/ui/templates/protection-header'
import { useData, useToggle } from '../data-provider'
import { TextLink } from '../../shared/js/ui/components/text-link'
import { useNav } from '../navigation'
import { ns } from '../../shared/js/ui/base/localize'

export function ProtectionHeader() {
    const { push } = useNav()
    const data = useData()
    const onToggle = useToggle()

    return (
        <div data-testid="protectionHeader">
            <ProtectionHeaderComponent model={data} toggle={onToggle}>
                <div className="text--center">
                    <TextLink onClick={() => push('choiceProblem')} rounded={true}>
                        {ns.site('websiteNotWorkingPrompt.title')}
                    </TextLink>
                </div>
            </ProtectionHeaderComponent>
        </div>
    )
}
