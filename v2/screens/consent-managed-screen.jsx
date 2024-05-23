// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'
import { DomNode } from '../dom-node'
import { disableInSettingsLink } from '../../shared/js/ui/templates/shared/links'
import { ns } from '../../shared/js/ui/base/localize'
import { heroTemplate, largeHeroIcon } from '../../shared/js/ui/templates/shared/hero'
import { useData, useFetcher } from '../data-provider'
import { OpenSettingsMessages } from '../../shared/js/browser/common'

export function ConsentManagedScreen({ cosmetic }) {
    const { pop } = useNav()
    const data = useData()
    const fetcher = useFetcher()
    const summary = cosmetic ? ns.site('cookiesHiddenSummary.title') : ns.site('cookiesMinimizedSummary.title')
    const icon = largeHeroIcon({
        status: cosmetic ? 'cookies-hidden' : 'cookies-managed',
    })

    const hero = heroTemplate({
        icon,
        summary,
        suffix: 'none',
    })

    function disable() {
        const msg = new OpenSettingsMessages({
            target: 'cpm',
        })
        fetcher(msg).catch(console.error)
    }

    return (
        <div className="card" data-page="cookie-prompt">
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
                <DomNode key={data.count}>{hero}</DomNode>
            </div>
            <div className="padding-x-double">
                <div className="padding-y border--top--inner text--center">
                    {/* @ts-ignore */}
                    <DomNode key={data.count}>{disableInSettingsLink(disable)}</DomNode>
                </div>
            </div>
        </div>
    )
}
