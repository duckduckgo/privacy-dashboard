// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { template as mainNavTemplate } from '../../shared/js/ui/views/main-nav'
import { useData } from '../data-provider'
import { DomNode } from '../dom-node'
import { useNav } from '../navigation'

/**
 * todo(v2): support android ripple
 */
export function MainNav() {
    const data = useData()
    const { push } = useNav()
    return (
        <nav id="main-nav">
            {/* @ts-ignore */}
            <DomNode key={data.count}>
                {mainNavTemplate(data, {
                    connection: () => {
                        push('connection')
                    },
                    trackers: () => {
                        push('trackers')
                    },
                    nonTrackers: () => {
                        push('nonTrackers')
                    },
                    consentManaged: () => {
                        push('consentManaged')
                    },
                    cookieHidden: () => {
                        console.log('navigate', { target: 'cookieHidden' })
                    },
                })}
            </DomNode>
        </nav>
    )
}
