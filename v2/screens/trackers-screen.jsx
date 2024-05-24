// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { DomNode } from '../dom-node'
import { useData } from '../data-provider'
import { heroFromTabTrackers } from '../../shared/js/ui/templates/shared/hero'
import { sectionsFromSiteTrackers } from '../../shared/js/ui/templates/page-trackers'
import { platformLimitations } from '../../shared/js/ui/templates/shared/platform-limitations'
import { Back, TopNav } from '../components/top-nav'
import { useNav } from '../navigation'

export function TrackersScreen() {
    // const c = useChannel()
    const data = useData()
    const { pop } = useNav()
    return (
        <div className="site-info card page-inner" data-page="trackers">
            <TopNav back={<Back onClick={() => pop()} />} />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <DomNode key={data.count}>{heroFromTabTrackers(data.tab.requestDetails, data.protectionsEnabled)}</DomNode>
            </div>
            <div className="padding-x-double" aria-label="List of Tracker Companies">
                {sectionsFromSiteTrackers(data).map((el, index) => {
                    /* @ts-ignore */
                    return <DomNode key={String(data.count) + String(index)}>{el}</DomNode>
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
    )
}
