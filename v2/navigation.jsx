// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact'
import cn from 'classnames'
import { useContext, useEffect, useReducer, useRef } from 'preact/hooks'
import { ConnectionScreen } from './screens/connection-screen'
import { PrimaryScreen } from './screens/primary-screen'
import { BreakageFormScreen } from './screens/breakage-form-screen'
import { TrackersScreen } from './screens/trackers-screen'
import { NonTrackersScreen } from './screens/non-trackers-screen'
import { ConsentManagedScreen } from './screens/consent-managed-screen'
import { ToggleReportScreen } from './screens/toggle-report-screen'

const availableScreens = {
    primary: { kind: 'root', component: <PrimaryScreen /> },
    breakage: { kind: 'subview', component: <BreakageFormScreen includeToggle={true} /> },
    promptBreakageForm: { kind: 'subview', component: <BreakageFormScreen includeToggle={false} /> },
    toggleReport: { kind: 'subview', component: <ToggleReportScreen /> },
    connection: { kind: 'subview', component: <ConnectionScreen /> },
    trackers: { kind: 'subview', component: <TrackersScreen /> },
    nonTrackers: { kind: 'subview', component: <NonTrackersScreen /> },
    consentManaged: { kind: 'subview', component: <ConsentManagedScreen cosmetic={false} /> },
    cookieHidden: { kind: 'subview', component: <ConsentManagedScreen cosmetic={true} /> },
}

/**
 * @typedef {keyof typeof availableScreens} ScreenName
 */

const NavContext = createContext({
    /** @type {(name: ScreenName) => void} */
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
})

export function useNav() {
    return useContext(NavContext)
}

/**
 * @param {NavState} state
 * @param {NavEvent} event
 */
function navReducer(state, event) {
    console.log('📩', event, state)
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
                    if (!event.opts.animate) {
                        return {
                            ...state,
                            stack: state.stack.concat(event.name),
                            state: /** @type {const} */ ('settled'),
                        }
                    }
                    return {
                        ...state,
                        stack: state.stack.concat(event.name),
                        state: /** @type {const} */ ('transitioning'),
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
                        }
                    }
                    return {
                        ...state,
                        commit: state.stack,
                        stack: state.stack.slice(0, -1),
                        state: /** @type {const} */ ('transitioning'),
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
 * @typedef {{ type: 'push', name: ScreenName, opts: ActionOpts}
 *   | {type: 'pop', opts: ActionOpts}
 *   | {type: 'goto', stack: ScreenName[], opts: ActionOpts}
 *   | {type: 'end'}
 * } NavEvent
 * @typedef {{commit: string[], stack: string[], state: 'settled' | 'transitioning'}} NavState
 */

/**
 * @param {object} props
 * @param {boolean} props.animate
 * @param {ScreenName[]} props.stack
 */
export function Navigation(props) {
    const [state, dispatch] = useReducer(navReducer, {
        stack: props.stack,
        state: 'settled',
        commit: [],
    })

    /** @type {import('preact/hooks').MutableRef<HTMLDivElement | null>} */
    const parentRef = useRef(null)

    // let the reducer know when an animation completes
    useEffect(() => {
        const curr = parentRef.current
        if (!curr) return
        const handler = () => {
            dispatch({ type: 'end' })
        }
        curr.addEventListener('transitionend', handler)
        return () => {
            curr.removeEventListener('transitionend', handler)
        }
    }, [state.state])

    const api = {
        push: (name) => dispatch({ type: 'push', name, opts: { animate: props.animate } }),
        pop: () => dispatch({ type: 'pop', opts: { animate: props.animate } }),
        goto: (stack) => dispatch({ type: 'goto', stack, opts: { animate: props.animate } }),
    }

    console.groupCollapsed('Navigation Render state')
    console.log(' - state: ', state.state)
    console.log(' - stack: ', state.stack)
    console.log(' - commit: ', state.commit)
    console.groupEnd()

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
                    if (!inStack && !commiting) return null
                    if (item.kind === 'root') {
                        return <section key={name}>{item.component}</section>
                    }
                    const translateValue = state.stack.includes(name)
                        ? state.stack.indexOf(name)
                        : state.commit.includes(name)
                        ? state.commit.indexOf(name)
                        : 0
                    const cssProp = `translateX(${translateValue * 100}%)`
                    return (
                        <section className="sliding-subview-v2" key={name} style={{ transform: cssProp }}>
                            {item.component}
                        </section>
                    )
                })}
            </div>
        </NavContext.Provider>
    )
}
