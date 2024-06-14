// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, Fragment } from 'preact'
import { heroTemplate, largeHeroIcon } from '../../shared/js/ui/templates/shared/hero'
import { renderCertificateDetails, renderConnectionDescription } from '../../shared/js/ui/templates/page-connection'
import { useData } from '../data-provider'
import { DomNode } from '../dom-node'
import { SecondaryTopNav } from '../components/top-nav'

export function ConnectionScreen() {
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
        <div className="site-info card page-inner" data-page="connection">
            <SecondaryTopNav />
            <div className="padding-x-double">
                {/* @ts-ignore */}
                <DomNode key={data.count}>{hero}</DomNode>
                {data.tab.certificate && (
                    <>
                        {/* @ts-ignore */}
                        <DomNode key={data.count}>{renderCertificateDetails(data, data.tab)}</DomNode>
                    </>
                )}
            </div>
        </div>
    )
}
