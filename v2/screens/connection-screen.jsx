// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { heroTemplate, largeHeroIcon } from '../../shared/js/ui/templates/shared/hero';
import { renderCertificateDetails, renderConnectionDescription } from '../../shared/js/ui/templates/page-connection';
import { useData } from '../data-provider';
import { DomNode as _DomNode } from '../dom-node';
import { SecondaryTopNav } from '../components/top-nav';

const DomNode = /** @type {any} */ (_DomNode);

export function ConnectionScreen() {
    const data = useData();
    const summary = renderConnectionDescription(data, data.tab);
    const icon = largeHeroIcon({
        status: `connection-${data.httpsState}`,
    });

    const hero = heroTemplate({
        icon,
        summary,
        suffix: 'none',
    });

    // prettier-ignore
    const certDetails = data.tab.certificate
        ? renderCertificateDetails(data, data.tab)
        : null

    // prettier-ignore
    const certDetailsElement = certDetails
        ? <DomNode key={data.count}>{certDetails}</DomNode>
        : null

    return (
        <div className="site-info card page-inner" data-page="connection">
            <SecondaryTopNav />
            <div className="padding-x-double">
                <DomNode key={data.count}>{hero}</DomNode>
                {certDetailsElement}
            </div>
        </div>
    );
}
