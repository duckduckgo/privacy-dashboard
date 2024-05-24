// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useNav } from '../navigation'
import { heroTemplate, largeHeroIcon } from '../../shared/js/ui/templates/shared/hero'
import { renderCertificateDetails, renderConnectionDescription } from '../../shared/js/ui/templates/page-connection'
import { useData } from '../data-provider'
import { DomNode } from '../dom-node'
import { Back, TopNav } from '../components/top-nav'

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
            <TopNav back={<Back onClick={() => pop()} />} done={null} />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <DomNode key={data.count}>{hero}</DomNode>
                {/* @ts-ignore */}
                <DomNode key={data.count}>{renderCertificateDetails(data, data.tab)}</DomNode>
            </div>
        </div>
    )
}
