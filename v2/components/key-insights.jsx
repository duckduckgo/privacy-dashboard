// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useData } from '../data-provider'
import { renderKeyInsight } from '../../shared/js/ui/templates/key-insights'
import { DomNode } from '../dom-node'

export function KeyInsights() {
    const data = useData()
    return (
        <div id="key-insight">
            {/* @ts-ignore */}
            <DomNode key={data.count}>{renderKeyInsight(data)}</DomNode>
        </div>
    )
}
