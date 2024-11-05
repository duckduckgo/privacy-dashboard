// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact';
import { template as mainNavTemplate } from '../../shared/js/ui/views/main-nav';
import { useData } from '../data-provider';
import { DomNode } from '../dom-node';
import { useNav } from '../navigation';
import { useRippleChildren } from '../../shared/js/ui/hooks/useRipple';

export function MainNav() {
    const data = useData();
    const { push } = useNav();
    const ref = useRippleChildren(data.count);
    return (
        <nav id="main-nav" ref={ref}>
            {/* @ts-ignore */}
            <DomNode key={data.count}>
                {mainNavTemplate(data, {
                    connection: () => {
                        push('connection');
                    },
                    trackers: () => {
                        push('trackers');
                    },
                    nonTrackers: () => {
                        push('nonTrackers');
                    },
                    consentManaged: () => {
                        push('consentManaged');
                    },
                    cookieHidden: () => {
                        push('cookieHidden');
                    },
                })}
            </DomNode>
        </nav>
    );
}
