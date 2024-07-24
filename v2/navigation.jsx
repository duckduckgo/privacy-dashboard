// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact'
import cn from 'classnames'
import { useCallback, useContext, useEffect, useReducer, useRef } from 'preact/hooks'
import { ConnectionScreen } from './screens/connection-screen'
import { PrimaryScreen } from './screens/primary-screen'
import { BreakageFormScreen } from './screens/breakage-form-screen'
import { TrackersScreen } from './screens/trackers-screen'
import { NonTrackersScreen } from './screens/non-trackers-screen'
import { ConsentManagedScreen } from './screens/consent-managed-screen'
import { ToggleReportScreen } from './screens/toggle-report-screen'
import { ChoiceBreakageForm, CategorySelection, CategoryTypeSelection, ChoiceToggleScreen } from './screens/choice-problem'

/** @type {Record<ScreenName, { kind: 'subview' | 'root', component: () => any}>} */
const availableScreens = {
    primaryScreen: { kind: 'root', component: () => <PrimaryScreen /> },

    // screens that would load immediately
    breakageForm: { kind: 'subview', component: () => <BreakageFormScreen includeToggle={true} /> },
    promptBreakageForm: { kind: 'subview', component: () => <BreakageFormScreen includeToggle={false} /> },
    toggleReport: { kind: 'subview', component: () => <ToggleReportScreen /> },

    //
    categoryTypeSelection: { kind: 'subview', component: () => <CategoryTypeSelection /> },
    categorySelection: { kind: 'subview', component: () => <CategorySelection /> },
    choiceToggle: { kind: 'subview', component: () => <ChoiceToggleScreen /> },
    choiceBreakageForm: { kind: 'subview', component: () => <ChoiceBreakageForm /> },

    connection: { kind: 'subview', component: () => <ConnectionScreen /> },
    trackers: { kind: 'subview', component: () => <TrackersScreen /> },
    nonTrackers: { kind: 'subview', component: () => <NonTrackersScreen /> },
    consentManaged: { kind: 'subview', component: () => <ConsentManagedScreen cosmetic={false} /> },
    cookieHidden: { kind: 'subview', component: () => <ConsentManagedScreen cosmetic={true} /> },
}

/**
 * @typedef {import('../schema/__generated__/schema.types').EventOrigin['screen']} ScreenName
 */

const NavContext = createContext({
    /** @type {(name: ScreenName, params?: Record<string, string>) => void} */
    push() {
        throw new Error('not implemented')
    },
    /** @type {() => void} */
    pop() {
        throw new Error('not implemented')
    },
    /** @type {(stack: ScreenName[]) => void} */
    goto(stack) {
        throw new Error('not implemented ' + stack)
    },
    params: new URLSearchParams(''),
    /** @type {() => boolean} */
    canPop: () => false,
    /** @type {(screen: import('../schema/__generated__/schema.types').EventOrigin['screen']) => boolean} */
    canPopFrom: (screen) => false,
    /** @type {() => ScreenName} */
    screen: () => {
        throw new Error('screen() not implemented')
    },
})

export const ScreenContext = createContext({
    /** @type {import('../schema/__generated__/schema.types').EventOrigin['screen']} */
    screen: /** @type {const} */ ('primaryScreen'),
})

export function useNav() {
    return useContext(NavContext)
}

export function useCanPop() {
    const { screen } = useContext(ScreenContext)
    const { canPopFrom } = useNav()
    return canPopFrom(screen)
}

/**
 * @param {NavState} state
 * @param {NavEvent} event
 */
function navReducer(state, event) {
    if (!window.__ddg_integration_test) {
        console.log('📩', event, state)
    }
    switch (state.state) {
        case 'transitioning': {
            switch (event.type) {
                case 'end': {
                    return {
                        ...state,
                        commit: [],
                        state: /** @type {const} */ ('settled'),
                    }
                }
            }
            return state
        }
        case 'initial':
        case 'settled': {
            switch (event.type) {
                case 'goto': {
                    if (!event.opts.animate) {
                        return {
                            ...state,
                            stack: event.stack,
                            state: /** @type {const} */ ('settled'),
                        }
                    }
                    return {
                        ...state,
                        stack: event.stack,
                        state: /** @type {const} */ ('transitioning'),
                    }
                }
                case 'push': {
                    const nextParams = new URLSearchParams(state.params)
                    for (let [key, value] of Object.entries(event.params)) {
                        // using 'set' to override previous values.
                        nextParams.set(key, value)
                    }
                    if (!event.opts.animate) {
                        return {
                            ...state,
                            params: nextParams,
                            stack: state.stack.concat(event.name),
                            state: /** @type {const} */ ('settled'),
                            via: 'push',
                        }
                    }
                    return {
                        ...state,
                        params: nextParams,
                        stack: state.stack.concat(event.name),
                        state: /** @type {const} */ ('transitioning'),
                        via: 'push',
                    }
                }
                case 'pop': {
                    if (state.stack.length < 2) {
                        console.warn('ignoring a `pop` event')
                        return state
                    }
                    if (!event.opts.animate) {
                        const next = state.stack.slice(0, -1)
                        return {
                            ...state,
                            commit: next,
                            stack: next,
                            state: /** @type {const} */ ('settled'),
                            via: 'pop',
                        }
                    }
                    return {
                        ...state,
                        commit: state.stack,
                        stack: state.stack.slice(0, -1),
                        state: /** @type {const} */ ('transitioning'),
                        via: 'pop',
                    }
                }
                default: {
                    console.warn('ignoring', event, 'state', state)
                    return state
                }
            }
        }
        default:
            throw new Error('unreachable')
    }
}

/**
 * @typedef {{ animate: boolean }} ActionOpts
 * @typedef {{ type: 'push', name: ScreenName, opts: ActionOpts, params: Record<string, string>}
 *   | {type: 'pop', opts: ActionOpts}
 *   | {type: 'goto', stack: ScreenName[], opts: ActionOpts}
 *   | {type: 'end'}
 * } NavEvent
 * @typedef {{
 *    commit: string[],
 *    stack: string[],
 *    state: 'initial' | 'settled' | 'transitioning',
 *    params: URLSearchParams,
 *    via: NavEvent['type'] | string | undefined
 * }} NavState
 */

/**
 * @param {object} props
 * @param {boolean} props.animate
 * @param {ScreenName[]} props.stack
 * @param {URLSearchParams} props.params
 */
export function Navigation(props) {
    const [state, dispatch] = useReducer(navReducer, {
        stack: props.stack,
        state: 'initial',
        commit: [],
        params: props.params,
        via: undefined,
    })

    /** @type {import('preact/hooks').MutableRef<HTMLDivElement | null>} */
    const parentRef = useRef(null)

    // let the reducer know when an animation completes
    useEffect(() => {
        const curr = parentRef.current
        if (!curr) return
        const handler = (e) => {
            if (e.target !== parentRef.current) return
            dispatch({ type: 'end' })
        }
        curr.addEventListener('transitionend', handler)
        return () => {
            curr.removeEventListener('transitionend', handler)
        }
    }, [state.state])

    // reflect to the URL
    useEffect(() => {
        // only act on navigations when settled
        if (state.state !== 'settled') {
            return
        }

        if (state.via === 'push') {
            const url = new URL(window.location.href)
            url.searchParams.delete('stack')
            for (let string of state.stack) {
                url.searchParams.append('stack', string)
            }
            for (let [key, value] of Object.entries(state.params)) {
                url.searchParams.set(key, value)
            }
            window.history.pushState({}, '', url)
        }

        if (state.via === 'pop') {
            window.history.go(-1)
        }

        function handler() {
            dispatch({ type: 'pop', opts: { animate: props.animate } })
        }

        window.addEventListener('popstate', handler)

        return () => {
            window.removeEventListener('popstate', handler)
        }
    }, [state.state, state.params, state.via, props.animate])

    const canPop = useCallback(() => {
        // const curr = state.stack[state.stack.length - 1];
        if (state.state === 'transitioning') {
            return state.commit.length > 1 || state.stack.length > 1
        }
        // console.log(state.stack.length)
        return state.stack.length > 1
    }, [state.state, state.stack, state.commit])

    const canPopFrom = useCallback(
        (screen) => {
            if (state.stack[0] === screen) return false
            return canPop()
        },
        [state.state, state.stack, state.commit]
    )

    const screen = useCallback(() => {
        const v = /** @type {ScreenName} */ (state.stack[state.stack.length - 1])
        return v
    }, [state.state, state.stack, state.commit])

    const api = {
        push: (name, params = {}) => dispatch({ type: 'push', name, opts: { animate: props.animate }, params }),
        pop: () => dispatch({ type: 'pop', opts: { animate: props.animate } }),
        goto: (stack) => dispatch({ type: 'goto', stack, opts: { animate: props.animate } }),
        canPop: canPop,
        canPopFrom: canPopFrom,
        screen: screen,
        params: state.params,
    }

    // console.groupCollapsed('Navigation Render state')
    // console.log(' - state: ', state.state)
    // console.log(' - stack: ', state.stack)
    // console.log(' - commit: ', state.commit)
    // console.groupEnd()

    return (
        <NavContext.Provider value={api}>
            <div
                id="popup-container"
                ref={parentRef}
                className={cn({
                    'sliding-subview-v2': true,
                    'sliding-subview-v2--root': true,
                    'sliding-subview-v2--animating': state.state === 'transitioning',
                })}
                style={{
                    transform: `translateX(` + -((state.stack.length - 1) * 100) + '%)',
                }}
            >
                {Object.entries(availableScreens).map(([name, item]) => {
                    const inStack = state.stack.includes(name)
                    const commiting = state.commit.includes(name)
                    const current = state.stack[state.stack.length - 1] === name
                    if (!inStack && !commiting) return null
                    if (item.kind === 'root') {
                        return (
                            <ScreenContext.Provider value={{ screen: /** @type {ScreenName} */ (name) }}>
                                <section className="app-height" key={name}>
                                    {item.component()}
                                </section>
                            </ScreenContext.Provider>
                        )
                    }
                    const translateValue = state.stack.includes(name)
                        ? state.stack.indexOf(name)
                        : state.commit.includes(name)
                        ? state.commit.indexOf(name)
                        : 0
                    const cssProp = `translateX(${translateValue * 100}%)`
                    return (
                        <ScreenContext.Provider value={{ screen: /** @type {ScreenName} */ (name) }}>
                            <section
                                data-current={String(current)}
                                className="sliding-subview-v2"
                                key={name}
                                style={{ transform: cssProp }}
                            >
                                {item.component()}
                            </section>
                        </ScreenContext.Provider>
                    )
                })}
            </div>
        </NavContext.Provider>
    )
}
