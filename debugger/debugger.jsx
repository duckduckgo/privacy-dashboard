// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from 'preact'
import styles from './debugger.module.css'
import { createDataStates } from '../shared/js/ui/views/tests/generate-data.mjs'

import google from '../schema/__fixtures__/request-data-google.json'
import cnn from '../schema/__fixtures__/request-data-cnn.json'

const states = createDataStates(google, cnn)
const keys = Object.keys(states)

const items = [
    {
        platform: 'android',
        height: 780,
    },
    {
        platform: 'ios',
        height: 780,
    },
    {
        platform: 'macos',
        height: 600,
    },
    {
        platform: 'windows',
        height: 780,
    },
    {
        platform: 'browser',
    },
]

let initialState = new URL(window.location).searchParams.get('state')
if (!keys.includes(initialState)) {
    initialState = 'protectionsOn_blocked'
}

let platforms = (() => {
    let subject = new URL(window.location).searchParams.get('platforms')
    const known = items.map((x) => x.platform)
    if (subject) {
        const selected = subject
            .split(',')
            .map((x) => x.trim())
            .filter((x) => known.includes(x))
        if (selected.length > 0) {
            return selected
        }
    }
    return known.slice(0, 3)
})()

function update(value) {
    const url = new URL(window.location.href)
    url.searchParams.set('state', value)
    window.location = url
}

function updatePlatforms(value) {
    const url = new URL(window.location.href)
    url.searchParams.set('platforms', value.join(','))
    window.location = url
}

function App() {
    return (
        <div class={styles.grid}>
            <div class={styles.header}>
                <Selector selected={initialState} onChange={update} />
                <Toggles selected={platforms} onChange={updatePlatforms} />
            </div>
            <div class={styles.content}>
                <Frames platforms={platforms} initialState={initialState} />
            </div>
        </div>
    )
}

function Selector({ selected, onChange }) {
    return (
        <select onChange={(e) => onChange(e.target.value)}>
            {Object.entries(states).map(([key, value]) => {
                return (
                    <option value={key} selected={selected === key}>
                        {key}
                    </option>
                )
            })}
        </select>
    )
}

function Toggles({ selected, onChange }) {
    function onChanged(e) {
        const d = new FormData(e.target.form)
        onChange(d.getAll('platform'))
    }
    return (
        <form onChange={onChanged}>
            {items.map((item) => {
                return (
                    <label class={styles.label}>
                        <input type="checkbox" name="platform" value={item.platform} checked={selected.includes(item.platform)}></input>{' '}
                        {item.platform}
                    </label>
                )
            })}
        </form>
    )
}

function Frames({ platforms, initialState }) {
    const previewJSON = states[initialState]
    const { certificate, ...rest } = previewJSON
    rest.certificate = certificate
    return (
        <div class={styles.frames}>
            <div class={styles.code} data-state="ready">
                <pre>
                    <code>{JSON.stringify(rest, null, 2)}</code>
                </pre>
            </div>
            {items.map((item) => {
                const { platform, ...rest } = item
                const params = new URLSearchParams({ ...rest, state: initialState }).toString()
                const src = item.platform + '.html?' + params.toString()
                const height = item.height ?? 600
                return (
                    <div class={styles.frame} data-state={platforms.includes(platform) ? 'ready' : 'hidden'}>
                        <p>
                            <a href={src} target="_blank">
                                Open in new tab
                            </a>
                        </p>
                        <p>
                            <code>{item.platform}</code> <small>{initialState}</small>
                        </p>
                        <iframe
                            src={src}
                            frameBorder="0"
                            style={{
                                width: '360px',
                                height: height + 'px',
                            }}
                        ></iframe>
                    </div>
                )
            })}
        </div>
    )
}

render(<App />, document.querySelector('#app'))
