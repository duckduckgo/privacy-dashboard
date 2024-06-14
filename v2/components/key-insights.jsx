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

export function KeyInsightsMain({ title, children, icon = 'chat' }) {
    return (
        <div className="key-insight key-insight--main">
            <div className={`key-insight__icon hero-icon--${icon}`}></div>
            <h1 className="token-title-3-em">{title}</h1>
            <div className="token-title-3">
                <span>{children}</span>
            </div>
        </div>
    )
}
