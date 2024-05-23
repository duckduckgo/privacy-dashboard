// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { DomNode } from '../dom-node'
import { useData } from '../data-provider'
import { useNav } from '../navigation'
import { heroFromTabNonTrackers } from '../../shared/js/ui/templates/shared/hero'
import { platformLimitations } from '../../shared/js/ui/templates/shared/platform-limitations'
import { sectionsFromSiteNonTracker } from '../../shared/js/ui/templates/page-non-trackers'

export function NonTrackersScreen() {
    // const c = useChannel()
    const data = useData()
    const { pop } = useNav()
    return (
        <div className="site-info card page-inner" data-page="non-trackers">
            <div>
                <div className="top-nav">
                    <a
                        href="javascript:void(0)"
                        onClick={() => pop()}
                        role="button"
                        aria-label="Back"
                        className="top-nav__back link-action link-action--dark"
                    >
                        <span data-icon-text="Back" className="icon icon__back-arrow"></span>
                    </a>
                </div>
                <div className="top-nav__spacer"></div>
            </div>
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
