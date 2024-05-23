// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'
import { heroTemplate, largeHeroIcon } from '../../shared/js/ui/templates/shared/hero'
import { renderCertificateDetails, renderConnectionDescription } from '../../shared/js/ui/templates/page-connection'
import { useData } from '../data-provider'
import { DomNode } from '../dom-node'

export function ConnectionScreen() {
    const { pop } = useNav()
    const data = useData()
    const summary = renderConnectionDescription(data, data.tab)
    const icon = largeHeroIcon({
        status: `connection-${data.httpsState}`,
    })

    const hero = heroTemplate({
        icon,
        summary,
        suffix: 'none',
    })
    return (
        <div className="site-info card" data-page="connection">
            <div>
                <div className="top-nav">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        aria-label="Back"
                        onClick={() => pop()}
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
                {/* @ts-ignore */}
                <DomNode key={data.count}>{renderCertificateDetails(data, data.tab)}</DomNode>
            </div>
        </div>
    )
}
