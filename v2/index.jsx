// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact'
import { App } from './app'
import { SettingsProvider } from './settings'
import { DataProvider } from './data-provider'

window.onunhandledrejection = (event) => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`)
}

async function init() {
    const app = document.querySelector('#app')
    if (!app) throw new Error('unreachable')
    render(
        <SettingsProvider>
            <DataProvider>
                <App />
            </DataProvider>
        </SettingsProvider>,
        app
    )
}

init().catch((e) => {
    console.error('start up error', e)
})
