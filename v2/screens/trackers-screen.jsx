// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { DomNode } from '../dom-node';
import { useData } from '../data-provider';
import { platform } from '../../shared/js/browser/communication.js';
import { heroFromTabTrackers } from '../../shared/js/ui/templates/shared/hero';
import { sectionsFromSiteTrackers } from '../../shared/js/ui/templates/page-trackers';
import { platformLimitations } from '../../shared/js/ui/templates/shared/platform-limitations';
import { SecondaryTopNav } from '../components/top-nav';
import { useRippleChildren } from '../../shared/js/ui/hooks/useRipple';

export function TrackersScreen() {
    const data = useData();
    const ref = useRippleChildren(data.count);
    const shouldCapHeight = platform.name === 'macos' || platform.name === 'windows' || platform.name === 'browser';
    const maxViewHeight = 700;

    return (
        <div className="site-info card page-inner" data-page="trackers" data-max-view-height={shouldCapHeight && maxViewHeight}>
            <SecondaryTopNav />
            <div className="padding-x-double" ref={ref}>
                {/* @ts-ignore */}
                <DomNode key={data.count}>{heroFromTabTrackers(data.tab.requestDetails, data.protectionsEnabled)}</DomNode>
            </div>
            <div className="padding-x-double" aria-label="List of Tracker Companies">
                {sectionsFromSiteTrackers(data).map((el, index) => {
                    /* @ts-ignore */
                    return <DomNode key={String(data.count) + String(index)}>{el}</DomNode>;
                })}
            </div>
            {data.tab.platformLimitations ? (
                <div class="padding-x-double">
                    {/* @ts-ignore */}
                    <DomNode key={data.count}>{platformLimitations()}</DomNode>
                </div>
            ) : (
                <div />
            )}
        </div>
    );
}
