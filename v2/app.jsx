// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { Navigation } from './navigation'
import { useGlobalSettings } from './settings'
import { useFeatures } from './data-provider'

export function App() {
    const { reducedMotion } = useGlobalSettings()
    const data = useFeatures()
    const stack = initialStack(data)
    return <Navigation stack={stack} animate={!reducedMotion} params={new URLSearchParams(window.location.search)} />
}

/**
 * Decide which screen to start the dashboard at
 *
 * @param {import("../shared/js/ui/platform-features.mjs").PlatformFeatures} features
 * @return {import('./navigation').ScreenName[]}
 */
function initialStack(features) {
    if (features.initialScreen === 'breakageForm') {
        return ['breakageForm']
    }
    if (features.initialScreen === 'promptBreakageForm') {
        return ['promptBreakageForm']
    }
    if (features.initialScreen === 'toggleReport') {
        return ['toggleReport']
    }
    if (features.initialScreen === 'choiceBreakageForm') {
        return ['choiceBreakageForm']
    }
    if (features.initialScreen === 'categoryTypeSelection') {
        return ['categoryTypeSelection']
    }
    if (features.initialScreen === 'categorySelection') {
        return ['categorySelection']
    }
    return ['primaryScreen']
}
