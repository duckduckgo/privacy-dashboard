// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { DomNode } from '../dom-node';
import { disableInSettingsLink } from '../../shared/js/ui/templates/shared/links';
import { ns } from '../../shared/js/ui/base/localize';
import { heroTemplate, largeHeroIcon } from '../../shared/js/ui/templates/shared/hero';
import { useData, useFetcher } from '../data-provider';
import { OpenSettingsMessages } from '../../shared/js/browser/common';
import { SecondaryTopNav } from '../components/top-nav';

export function ConsentManagedScreen({ cosmetic }) {
    const data = useData();
    const fetcher = useFetcher();
    const summary = cosmetic ? ns.site('cookiesHiddenSummary.title') : ns.site('cookiesMinimizedSummary.title');
    const icon = largeHeroIcon({
        status: cosmetic ? 'cookies-hidden' : 'cookies-managed',
    });

    const hero = heroTemplate({
        icon,
        summary,
        suffix: 'none',
    });

    function disable() {
        const msg = new OpenSettingsMessages({
            target: 'cpm',
        });
        fetcher(msg).catch(console.error);
    }

    return (
        <div className="card page-inner" data-page="cookie-prompt">
            <SecondaryTopNav />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <DomNode key={data.count}>{hero}</DomNode>
            </div>
            <div className="padding-x-double">
                <div className="padding-y border--top--inner text--center">
                    {/* @ts-ignore */}
                    <DomNode key={data.count}>{disableInSettingsLink(disable)}</DomNode>
                </div>
            </div>
        </div>
    );
}
