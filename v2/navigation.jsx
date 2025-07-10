// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact';
import cn from 'classnames';
import { useCallback, useContext, useEffect, useReducer, useRef } from 'preact/hooks';
import { ConnectionScreen } from './screens/connection-screen';
import { PrimaryScreen } from './screens/primary-screen';
import { TrackersScreen } from './screens/trackers-screen';
import { NonTrackersScreen } from './screens/non-trackers-screen';
import { ConsentManagedScreen } from './screens/consent-managed-screen';
import { ToggleReportScreen } from './screens/toggle-report-screen';
import { BreakagePrimaryScreen, BreakageCategorySelection, BreakageForm, BreakageFormSuccess } from './screens/breakage-form-screen';
import { RequestFeatureFormScreen } from './screens/request-feature-form-screen';
import { isAndroid } from '../shared/js/ui/environment-check';
import { screenKindSchema } from '../schema/__generated__/schema.parsers.mjs';

/**
 * @typedef {import('../schema/__generated__/schema.types').EventOrigin['screen']} ScreenName
 */

/** @type {Record<ScreenName, { kind: 'subview' | 'root', component: () => any}>} */
const availableScreens = {
    primaryScreen: { kind: 'root', component: () => <PrimaryScreen /> },
    requestFeatureForm: { kind: 'root', component: () => <RequestFeatureFormScreen /> },

    // screens that would load immediately
    breakageForm: { kind: 'subview', component: () => <BreakagePrimaryScreen /> },
    breakageFormCategorySelection: { kind: 'subview', component: () => <BreakageCategorySelection /> },
    breakageFormFinalStep: { kind: 'subview', component: () => <BreakageForm /> },
    breakageFormSuccess: { kind: 'subview', component: () => <BreakageFormSuccess /> },
    toggleReport: { kind: 'subview', component: () => <ToggleReportScreen /> },

    //
    connection: { kind: 'subview', component: () => <ConnectionScreen /> },
    trackers: { kind: 'subview', component: () => <TrackersScreen /> },
    nonTrackers: { kind: 'subview', component: () => <NonTrackersScreen /> },
    consentManaged: { kind: 'subview', component: () => <ConsentManagedScreen cosmetic={false} /> },
    cookieHidden: { kind: 'subview', component: () => <ConsentManagedScreen cosmetic={true} /> },
};

// Typescript isn't smart enough to understand what Object.entries does here :(
const entries = /** @type {[ScreenName, { kind: 'subview' | 'root', component: () => any}][]} */ (Object.entries(availableScreens));

const NavContext = createContext({
    /** @type {(name: ScreenName, params?: Record<string, string>, opts?: { animate?: boolean }) => void} */
    push() {
        throw new Error('not implemented');
    },
    /** @type {() => void} */
    pop() {
        throw new Error('not implemented');
    },
    /** @type {() => void} */
    popToRoot() {
        throw new Error('not implemented');
    },
    params: new URLSearchParams(''),
    /** @type {() => boolean} */
    canPop: () => false,
    /** @type {(screen: ScreenName) => boolean} */
    canPopFrom: (screen) => false,
    /** @type {() => ScreenName} */
    screen: () => {
        throw new Error('screen() not implemented');
    },
});

export const ScreenContext = createContext({
    /** @type {ScreenName} */
    screen: /** @type {const} */ ('primaryScreen'),
});

export function useNav() {
    return useContext(NavContext);
}

export function useCanPop() {
    const { screen } = useContext(ScreenContext);
    const { canPopFrom } = useNav();
    return canPopFrom(screen);
}

/**
 * @param {any} input;
 * @returns {input is ScreenName}
 */
function isScreenName(input) {
    return screenKindSchema.safeParse(input).success;
}

/**
 * @param {NavState} state
 * @param {NavEvent} event
 */
function navReducer(state, event) {
    if (!window.__ddg_integration_test) {
        console.log('📩', event, state);
    }
    switch (state.state) {
        case 'transitioning': {
            switch (event.type) {
                case 'end': {
                    return {
                        ...state,
                        commit: [],
                        state: /** @type {const} */ ('settled'),
                    };
                }
            }
            return state;
        }
        case 'initial':
        case 'settled': {
            switch (event.type) {
                case 'replace': {
                    if (!event.opts.animate) {
                        return {
                            ...state,
                            stack: event.stack,
                            state: /** @type {const} */ ('settled'),
                        };
                    }
                    return {
                        ...state,
                        stack: event.stack,
                        state: /** @type {const} */ ('transitioning'),
                    };
                }
                case 'push': {
                    if (!event.opts.animate) {
                        return {
                            ...state,
                            stack: state.stack.concat(event.name),
                            state: /** @type {const} */ ('settled'),
                            via: 'push',
                        };
                    }
                    return {
                        ...state,
                        stack: state.stack.concat(event.name),
                        state: /** @type {const} */ ('transitioning'),
                        via: 'push',
                    };
                }
                case 'pop': {
                    if (state.stack.length < 2) {
                        if (!window.__ddg_integration_test) {
                            console.warn('ignoring a `pop` event', window.location.search);
                        }
                        return state;
                    }
                    if (!event.opts.animate) {
                        const next = state.stack.slice(0, -1);
                        return {
                            ...state,
                            commit: next,
                            stack: next,
                            state: /** @type {const} */ ('settled'),
                            via: 'pop',
                        };
                    }
                    return {
                        ...state,
                        commit: state.stack,
                        stack: state.stack.slice(0, -1),
                        state: /** @type {const} */ ('transitioning'),
                        via: 'pop',
                    };
                }
                default: {
                    console.warn('ignoring', event, 'state', state);
                    return state;
                }
            }
        }
        default:
            throw new Error('unreachable');
    }
}

/**
 * @typedef {{ animate: boolean }} ActionOpts
 * @typedef {{ type: 'push', name: ScreenName, opts: ActionOpts}
 *   | {type: 'pop', opts: ActionOpts}
 *   | {type: 'replace', stack: ScreenName[], opts: ActionOpts}
 *   | {type: 'end'}
 * } NavEvent
 * @typedef {{
 *    commit: string[],
 *    stack: ScreenName[],
 *    state: 'initial' | 'settled' | 'transitioning',
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
        via: undefined,
    });

    /** @type {import('preact/hooks').MutableRef<HTMLDivElement | null>} */
    const parentRef = useRef(null);

    // let the reducer know when an animation completes
    useEffect(() => {
        const curr = parentRef.current;
        if (!curr) return;
        const handler = (e) => {
            if (e.target !== parentRef.current) return;
            dispatch({ type: 'end' });
        };
        curr.addEventListener('transitionend', handler);
        return () => {
            curr.removeEventListener('transitionend', handler);
        };
    }, [state.state]);

    // reflect to the URL
    useEffect(() => {
        /**
         * 'popstateHandler' is invoked on back AND forward navigations
         * - To detect if it's a 'forward' intention, we look at the current 'stack' in the url params
         *   and compare it to our local state. So if the url stack has 1 more item than our state, we know
         *   it's a 'forward' action.
         * - otherwise, it's just a 'back' action, so we can `pop` an item from the stack as usual
         */
        function popstateHandler() {
            const currentUrlParams = new URLSearchParams(location.search);
            const currentURLStack = currentUrlParams.getAll('stack');
            const navigationIntentionIsForwards = currentURLStack.length > state.stack.length;

            if (navigationIntentionIsForwards) {
                const lastEntry = currentURLStack[currentURLStack.length - 1];
                if (isScreenName(lastEntry)) {
                    dispatch({ type: 'push', name: lastEntry, opts: { animate: props.animate && isAndroid() } });
                }
            } else {
                dispatch({ type: 'pop', opts: { animate: props.animate && isAndroid() } });
            }
        }

        window.addEventListener('popstate', popstateHandler);

        return () => {
            window.removeEventListener('popstate', popstateHandler);
        };
    }, [state.state, state.stack, state.via, props.animate]);

    const canPop = useCallback(() => {
        // const curr = state.stack[state.stack.length - 1];
        if (state.state === 'transitioning') {
            return state.commit.length > 1 || state.stack.length > 1;
        }
        // console.log(state.stack.length)
        return state.stack.length > 1;
    }, [state.state, state.stack, state.commit]);

    const canPopFrom = useCallback(
        (screen) => {
            if (state.stack[0] === screen) return false;
            return canPop();
        },
        [state.state, state.stack, state.commit]
    );

    const screen = useCallback(() => {
        const v = /** @type {ScreenName} */ (state.stack[state.stack.length - 1]);
        return v;
    }, [state.state, state.stack, state.commit]);

    const api = {
        /**
         * @param {ScreenName} name
         * @param {Record<string, any>} params
         * @param {object} [opts]
         * @param {boolean} [opts.animate]
         */
        push: (name, params = {}, opts = {}) => {
            const url = new URL(window.location.href);
            const animate = opts.animate !== undefined ? opts.animate : props.animate;

            for (let [key, value] of Object.entries(params)) {
                // using 'set' to override any previous values.
                url.searchParams.set(key, value);
            }

            // reset the navigation stack
            url.searchParams.delete('stack');
            for (let string of state.stack) {
                url.searchParams.append('stack', string);
            }
            url.searchParams.append('stack', name);

            // reflect the new as a push
            window.history.pushState({}, '', url);

            // change component state
            dispatch({ type: 'push', name, opts: { animate } });
        },
        pop: () => {
            // remove a history entry
            window.history.go(-1);

            // change component state
            dispatch({ type: 'pop', opts: { animate: props.animate } });
        },
        /**
         * Pops from current screen directly to primary screen
         */
        popToRoot: () => {
            // Replace current stack with only root screen and current screen
            // Current screen will be popped right after
            const primaryScreen = 'primaryScreen';
            const newStack = /** @type {ScreenName[]} */ ([primaryScreen]);
            if (state.stack.length > 1) {
                newStack.push(state.stack.slice(-1)[0]);
            }

            dispatch({ type: 'replace', stack: newStack, opts: { animate: false } });

            // TODO: build a more integrated solution for sequencing dispatches
            // For now, we'll use requestAnimationFrame
            requestAnimationFrame(() => {
                // Pop to root screen
                dispatch({ type: 'pop', opts: { animate: props.animate } });

                // Update URL
                const url = new URL(window.location.href);
                url.searchParams.delete('stack');
                url.searchParams.append('stack', primaryScreen);
                window.history.replaceState({}, '', url);
            });
        },
        canPop: canPop,
        canPopFrom: canPopFrom,
        screen: screen,
        get params() {
            return new URLSearchParams(location.search);
        },
    };

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
                {entries.map(([screenName, item]) => {
                    const inStack = state.stack.includes(screenName);
                    const commiting = state.commit.includes(screenName);
                    const current = state.stack[state.stack.length - 1] === screenName;
                    if (!inStack && !commiting) return null;
                    if (item.kind === 'root') {
                        return (
                            <ScreenContext.Provider value={{ screen: screenName }}>
                                <section
                                    className="app-height"
                                    key={screenName}
                                    data-testid={`subview-${screenName}`}
                                    data-current={String(current)}
                                >
                                    {item.component()}
                                </section>
                            </ScreenContext.Provider>
                        );
                    }
                    const translateValue = state.stack.includes(screenName)
                        ? state.stack.indexOf(screenName)
                        : state.commit.includes(screenName)
                        ? state.commit.indexOf(screenName)
                        : 0;
                    const cssProp = `translateX(${translateValue * 100}%)`;
                    return (
                        <ScreenContext.Provider value={{ screen: screenName }}>
                            <section
                                data-current={String(current)}
                                className="sliding-subview-v2"
                                key={screenName}
                                data-testid={`subview-${screenName}`}
                                style={{ transform: cssProp }}
                            >
                                {item.component()}
                            </section>
                        </ScreenContext.Provider>
                    );
                })}
            </div>
        </NavContext.Provider>
    );
}
