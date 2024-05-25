// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { DomNode } from '../dom-node'
import { useData } from '../data-provider'
import { heroFromTabNonTrackers } from '../../shared/js/ui/templates/shared/hero'
import { platformLimitations } from '../../shared/js/ui/templates/shared/platform-limitations'
import { sectionsFromSiteNonTracker } from '../../shared/js/ui/templates/page-non-trackers'
import { SecondaryTopNav } from '../components/top-nav'

export function NonTrackersScreen() {
    // const c = useChannel()
    const data = useData()
    return (
        <div className="site-info card page-inner" data-page="non-trackers">
            <SecondaryTopNav />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <DomNode key={data.count}>{heroFromTabNonTrackers(data.tab.requestDetails, data.protectionsEnabled)}</DomNode>
            </div>
            <div className="padding-x-double" aria-label="List of Tracker Companies">
                {sectionsFromSiteNonTracker(data).map((el, index) => {
                    /* @ts-ignore */
                    return <DomNode key={String(data.count) + String(index)}>{el}</DomNode>
                })}
            </div>
            {data.tab.platformLimitations && (
                <div class="padding-x-double">
                    {/* @ts-ignore */}
                    <DomNode key={data.count}>{platformLimitations()}</DomNode>
                </div>
            )}
        </div>
    )
}
