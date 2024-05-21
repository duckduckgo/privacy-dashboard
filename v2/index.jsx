// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact'
import { Navigation } from './navigation'

window.onunhandledrejection = (event) => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`)
}

async function init() {
    const app = document.querySelector('#app')
    if (!app) throw new Error('unreachable')
    render(<Navigation />, app)
}

init().catch((e) => {
    console.error('start up error', e)
})
