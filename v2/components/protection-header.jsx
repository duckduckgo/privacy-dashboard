// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { ProtectionHeader as ProtectionHeaderComponent } from '../../shared/js/ui/templates/protection-header';
import { useData, useFeatureSettings, useFetcher, useToggle } from '../data-provider';
import { TextLink } from '../../shared/js/ui/components/text-link';
import { useNav } from '../navigation';
import { ns } from '../../shared/js/ui/base/localize';
import { CheckBrokenSiteReportHandledMessage } from '../../shared/js/browser/common';

export function BreakageFormLink() {
    const { push } = useNav();
    const fetcher = useFetcher();
    const featureSettings = useFeatureSettings();

    return (
        <TextLink
            onClick={() => {
                // this is a workaround for ios, to ensure we follow the old implementation
                fetcher(new CheckBrokenSiteReportHandledMessage())
                    .then(() => {
                        if (featureSettings.webBreakageForm.state === 'enabled') {
                            push('breakageForm');
                        }
                    })
                    .catch(console.error);
            }}
            rounded={true}
        >
            {ns.site('websiteNotWorkingPrompt.title')}
        </TextLink>
    );
}

export function PhishingMalwareLink() {
    return (
        <a className="link-action link-action--text" href="https://www.duckduckgo.com" target="_blank">
            {ns.site('reportWebsiteAsSafeCTA.title')}
        </a>
    );
}

export function ProtectionHeader() {
    const data = useData();
    const onToggle = useToggle();

    const isPhishingMalware = data.tab?.phishingStatus || data.tab?.malwareStatus;

    return (
        <div data-testid="protectionHeader">
            <ProtectionHeaderComponent model={data} toggle={onToggle}>
                <div className="text--center">{isPhishingMalware ? <PhishingMalwareLink /> : <BreakageFormLink />}</div>
            </ProtectionHeaderComponent>
        </div>
    );
}
