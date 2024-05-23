// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { Navigation } from './navigation'
import { useGlobalSettings } from './settings'
import { useData } from './data-provider'

export function App() {
    const { reducedMotion } = useGlobalSettings()
    const data = useData()

    /** @type {import('./navigation').ScreenName[]} */
    const stack = (() => {
        if (data.features.initialScreen === 'breakageForm') {
            return ['breakage']
        }
        if (data.features.initialScreen === 'promptBreakageForm') {
            return ['breakage']
        }
        if (data.features.initialScreen === 'toggleReport') {
            return ['toggleReport']
        }
        return ['primary']
    })()
    return <Navigation stack={stack} animate={!reducedMotion} />
}
