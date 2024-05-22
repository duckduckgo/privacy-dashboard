// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { Navigation } from './navigation'
import { useGlobalSettings } from './settings'

export function App() {
    const { reducedMotion } = useGlobalSettings()
    return <Navigation stack={['primary']} animate={!reducedMotion} />
}
