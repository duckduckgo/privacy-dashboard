import { createDataStates, requests } from '../shared/js/ui/views/tests/generate-data.mjs'
import google from '../schema/__fixtures__/request-data-google.json'
import cnn from '../schema/__fixtures__/request-data-cnn.json'

const states = createDataStates(/** @type {any} */ (google), /** @type {any} */ (cnn))
const keys = Object.keys(states)

/**
 * @typedef {import('../schema/__generated__/schema.types').EventOrigin['screen']} Screen
 */

/**
 * @type {Screen[]}
 */
const validInitialScreens = [
    'breakageForm',
    'promptBreakageForm',
    'toggleReport',
    'choiceBreakageForm',
    'categoryTypeSelection',
    'categorySelection',
    'primaryScreen',
]
const screens = Object.fromEntries(validInitialScreens.map((x) => [x, x]))

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

const knownPlatforms = items.map((x) => x.platform)

export class Settings {
    /**
     * @param {object} params
     * @param {string} [params.state]
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} [params.screen]
     * @param {URLSearchParams} [params.reflectParams]
     * @param {import('../shared/js/ui/platform-features.mjs').Platform['name'][]} [params.platforms]
     * @param {string[]} [params.requests]
     */
    constructor({
        state = keys[0],
        screen = 'primaryScreen',
        reflectParams = new URLSearchParams({ state: state }),
        platforms = ['android', 'ios', 'macos'],
        requests = [],
    } = {}) {
        this.state = state
        this.screen = screen
        this.screens = screens
        this.reflectParams = reflectParams
        this.platforms = platforms
        this.requests = requests
        this.items = items
    }

    /**
     * @param {string|null|undefined} state
     */
    withState(state) {
        if (!state) return this
        if (!keys.includes(state)) return this
        return new Settings({
            ...this,
            state,
        })
    }

    /**
     * @param {string|null|undefined} screen
     */
    withScreen(screen) {
        if (!screen) return this
        if (!validInitialScreens.includes(/** @type {Screen} */ (screen))) return this
        return new Settings({
            ...this,
            screen,
        })
    }

    /**
     * @param {URLSearchParams} params
     */
    withReflectParams(params) {
        const nextParams = new URLSearchParams(this.reflectParams)
        let reflectList = ['screen', 'requests']
        for (let [key, value] of params) {
            if (reflectList.includes(key)) {
                nextParams.append(key, value)
            }
        }
        return new Settings({
            ...this,
            reflectParams: nextParams,
        })
    }

    /**
     * @param {string|null|undefined} platforms
     */
    withPlatforms(platforms) {
        if (!platforms) return this
        if (typeof platforms !== 'string') return this
        const selected = platforms
            .split(',')
            .map((x) => x.trim())
            .filter((x) => knownPlatforms.includes(/** @type {any} */ (x)))
        if (selected.length > 0) {
            return new Settings({
                ...this,
                platforms: selected,
            })
        }
        return this
    }

    /**
     * @param {string[]|null|undefined} requestNames
     */
    withRequests(requestNames) {
        if (!requestNames) return this
        if (!Array.isArray(requestNames)) return this
        const known = Object.keys(requests)
        const next = requestNames.filter((x) => known.includes(x))
        return new Settings({
            ...this,
            requests: next,
        })
    }
}
