// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createContext, h } from 'preact'
import cn from 'classnames'
import { useContext, useEffect, useReducer, useRef } from 'preact/hooks'

const routes = /** @type {const} */ (['primary', 'breakage', 'connection'])
console.log('Available routes:', routes)

const NavContext = createContext({
    /** @type {(name: routes[number]) => void} */
    push() {
        throw new Error('not implemented')
    },
    /** @type {() => void} */
    pop() {
        throw new Error('not implemented')
    },
    /** @type {(stack: (typeof routes[number])[]) => void} */
    goto(stack) {
        throw new Error('not implemented ' + stack)
    },
})

function useRouter() {
    return useContext(NavContext)
}

/** @type {Record<routes[number], any>} */
const elementMap = {
    primary: {
        kind: 'root',
        component: (
            <div className="site-info page">
                <div className="page-inner">
                    <header className="header">
                        <ProtectionHeader />
                    </header>
                    <div className="header-spacer"></div>
                    <div className="padding-x-double">
                        <KeyInsights />
                    </div>
                    <div className="padding-x">
                        <MainNav />
                    </div>
                    <footer className="footer">
                        <div className="padding-x"></div>
                    </footer>
                </div>
            </div>
        ),
    },
    breakage: { kind: 'subview', component: <BreakageFormPage /> },
    connection: { kind: 'subview', component: <ConnectionPage /> },
}

export function Navigation(props) {
    /** @type {import('preact/hooks').MutableRef<HTMLDivElement | null>} */
    const parentRef = useRef(null)
    /** @type {[any, import('preact/hooks').Dispatch<{type: 'push', name: routes[number]} | {type: 'pop'} | {type: 'end'} | {type: 'goto', stack: (routes[number])[]}>]} */
    const [state, dispatch] = useReducer(
        (prev, action) => {
            console.log('📩', prev, action)
            switch (prev.state) {
                case 'transitioning': {
                    switch (action.type) {
                        case 'end': {
                            return {
                                ...prev,
                                commit: [],
                                state: /** @type {const} */ ('settled'),
                            }
                        }
                    }
                    return prev
                }
                case 'settled': {
                    switch (action.type) {
                        case 'goto': {
                            return {
                                ...prev,
                                stack: action.stack,
                                state: /** @type {const} */ ('transitioning'),
                            }
                        }
                        case 'push': {
                            return {
                                ...prev,
                                stack: prev.stack.concat(action.name),
                                state: /** @type {const} */ ('transitioning'),
                            }
                        }
                        case 'pop': {
                            return {
                                ...prev,
                                commit: prev.stack,
                                stack: prev.stack.slice(0, -1),
                                state: /** @type {const} */ ('transitioning'),
                            }
                        }
                        default: {
                            console.warn('ignoring', action, 'prev', prev)
                            return prev
                        }
                    }
                }
                case 'exiting': {
                    return {
                        ...prev,
                        commit: [],
                        state: /** @type {const} */ ('settled'),
                    }
                }
                default:
                    throw new Error('unreachable')
            }
        },
        {
            path: '/',
            stack: ['primary'],
            state: /** @type {'settled' | 'transitioning' | 'exiting'} */ ('settled'),
            commit: /** @type {string[]} */ ([]),
        }
    )

    console.log('CURR state', state.state)
    console.log(' - stack', state.stack)
    console.log(' - commit', state.commit)
    useEffect(() => {
        const curr = parentRef.current
        if (!curr) return
        console.group('USEFECT')
        console.log('state', state.state)
        const handler = () => {
            console.log('before dispatch', state.state)
            dispatch({ type: 'end' })
        }
        curr.addEventListener('transitionend', handler)
        return () => {
            console.groupEnd()
            curr.removeEventListener('transitionend', handler)
        }
    }, [state.state])

    const push = (name) => dispatch({ type: 'push', name })
    const pop = () => dispatch({ type: 'pop' })
    const goto = (stack) => dispatch({ type: 'goto', stack })

    return (
        <NavContext.Provider value={{ push, pop, goto }}>
            <div
                id="popup-container"
                ref={parentRef}
                className={cn({
                    'sliding-subview': true,
                    'sliding-subview--root': true,
                    'sliding-subview--animating': state.state === 'transitioning',
                })}
                style={{
                    left: -((state.stack.length - 1) * 100) + '%',
                }}
            >
                {Object.entries(elementMap).map(([name, item]) => {
                    const inStack = state.stack.includes(name)
                    const commiting = state.commit.includes(name)
                    if (!inStack && !commiting) return null
                    if (item.kind === 'root') {
                        return (
                            <section id="site-info-container" key={name}>
                                {item.component}
                            </section>
                        )
                    }
                    return (
                        <section
                            className="sliding-subview"
                            key={name}
                            style={
                                state.stack.includes(name)
                                    ? `left: calc(${state.stack.indexOf(name) * 100}%)`
                                    : state.commit.includes(name)
                                    ? `left: calc(${state.commit.indexOf(name) * 100}%)`
                                    : ''
                            }
                        >
                            {item.component}
                        </section>
                    )
                })}
            </div>
        </NavContext.Provider>
    )
}

function ConnectionPage() {
    const { pop } = useRouter()
    return (
        <div data-page="connection" className="site-info card">
            <div>
                <div className="top-nav">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        aria-label="Back"
                        onClick={() => pop()}
                        className="top-nav__back js-sliding-subview-close js-site-done link-action link-action--dark"
                    >
                        <span data-icon-text="Back" className="icon icon__back-arrow"></span>
                    </a>
                </div>
                <div className="top-nav__spacer"></div>
            </div>
            <div className="padding-x-double">
                <div data-suffix="none" className="key-insight">
                    <div className="large-icon-container hero-icon--connection-secure"></div>
                    <p className="token-title-3">
                        This page uses an encrypted connection, which prevents third parties from viewing your activity or intercepting
                        sensitive information you send on this page.
                    </p>
                </div>
                <div>
                    <div className="section-list-header">Certificate for example.com</div>
                    <div className="page-connection__certificate">
                        <div className="page-connection__certificate-details">
                            <h3 className="token-body-em">Security Certificate Detail</h3>
                            <div>
                                <span>Common Name</span> <span className="page-connection__certificate-value">sni.cloudflaressl.com</span>
                            </div>
                            <div>
                                <span>Summary</span> <span className="page-connection__certificate-value">sni.cloudflaressl.com</span>
                            </div>
                        </div>
                        <div className="page-connection__certificate-details">
                            <h3 className="token-body-em">Public Key</h3>
                            <div>
                                <span>Algorithm</span> <span className="page-connection__certificate-value">Elliptic Curve</span>
                            </div>
                            <div>
                                <span>Key Size</span> <span className="page-connection__certificate-value">256 bits</span>
                            </div>
                            <div>
                                <span>Effective Size</span> <span className="page-connection__certificate-value">256 bits</span>
                            </div>
                            <div>
                                <span>Usage</span> <span className="page-connection__certificate-value">Encrypt, Verify, Derive</span>
                            </div>
                            <div>
                                <span>Permanent</span> <span className="page-connection__certificate-value">No</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BreakageFormPage() {
    const { pop } = useRouter()
    return (
        <div className="breakage-form">
            <div>
                <div className="top-nav">
                    <a
                        href="javascript:void(0)"
                        onClick={() => pop()}
                        role="button"
                        aria-label="Back"
                        className="top-nav__back js-sliding-subview-close js-site-done link-action link-action--dark"
                    >
                        <span data-icon-text="Back" className="icon icon__back-arrow"></span>
                    </a>
                </div>
                <div className="top-nav__spacer"></div>
            </div>
            <div data-state="idle" className="breakage-form__inner js-breakage-form-element">
                <div className="header header--breakage">
                    <div data-testid="breakage-form-protection-header">
                        <div className="card-list--bordered">
                            <div className="protection-toggle">
                                <div className="protection-toggle__row">
                                    <div className="site-info-toggle is-active">
                                        <p className="site-info__protection">
                                            <span role="textbox">
                                                Protections are <b>ON</b> for this site
                                            </span>
                                        </p>
                                        <div className="site-info__toggle-container">
                                            <button
                                                className="toggle-button"
                                                type="button"
                                                role="switch"
                                                aria-checked="true"
                                                aria-label="Disable Protections"
                                            >
                                                <div className="toggle-button__track"></div>
                                                <div className="toggle-button__handle"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="protection-toggle__row protection-toggle__row--alt">
                                    Turning protections OFF might help.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="key-insight key-insight--breakage padding-x-double">
                    <div className="large-icon-container hero-icon--breakage-form"></div>
                    <div className="breakage-form__advise">
                        <p className="token-title-3">Submitting an anonymous broken site report helps us improve the app.</p>
                    </div>
                    <div className="thanks">
                        <p className="thanks__primary">Thank you!</p>
                        <p className="thanks__secondary">
                            Your report will help improve our products and make the experience better for other people.
                        </p>
                    </div>
                </div>
                <div className="breakage-form__content padding-x-double">
                    <div className="breakage-form__element">
                        <div className="form__group">
                            <div className="form__select breakage-form__input--dropdown">
                                <select className="js-breakage-form-dropdown">
                                    <option value="">Describe what happened</option>
                                    <option value="blocked">Site blocked or didn't load</option>
                                    <option value="layout">Site layout broken</option>
                                    <option value="empty-spaces">Site contains large empty spaces</option>
                                    <option value="paywall">Site asked me to disable ad blocker</option>
                                    <option value="videos">Video didn’t play or load</option>
                                    <option value="comments">Comments, reviews, or chats didn’t load</option>
                                    <option value="login">Can’t sign in/register</option>
                                    <option value="shopping">Can't pay, check out, or shop</option>
                                    <option value="other">Something else</option>
                                </select>
                            </div>
                            <textarea
                                placeholder="Share more details (optional):
 • What happened?
 • What should have happened?
 • Did turning protections off help?"
                                maxLength={250}
                                className="form__textarea js-breakage-form-description"
                            ></textarea>
                            <button role="button" className="form__submit token-label-em js-breakage-form-submit">
                                Send Report
                            </button>
                        </div>
                    </div>
                </div>
                <div className="breakage-form__footer padding-x-double token-breakage-form-body">
                    Reports sent to DuckDuckGo only include info required to help us address your feedback.
                </div>
            </div>
        </div>
    )
}

function MainNav() {
    const { goto } = useRouter()
    return (
        <nav id="main-nav">
            <ul className="default-list main-nav token-body-em js-site-main-nav">
                <li className="main-nav__row">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        draggable={false}
                        onClick={() => goto(['primary', 'breakage', 'connection'])}
                        aria-label="View Connection Information"
                        className="main-nav__item main-nav__item--link link-action link-action--dark"
                    >
                        <span className="main-nav__icon icon-small--secure"></span>{' '}
                        <span className="main-nav__text">Connection Is Encrypted</span> <span className="main-nav__chev"></span>
                    </a>
                </li>
                <li className="main-nav__row">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        draggable={false}
                        aria-label="View Tracker Companies"
                        className="main-nav__item main-nav__item--link link-action link-action--dark"
                    >
                        <span className="main-nav__icon icon-small--blocked"></span>{' '}
                        <span className="main-nav__text">Requests Blocked from Loading</span> <span className="main-nav__chev"></span>
                    </a>
                </li>
                <li className="main-nav__row">
                    <a
                        href="javascript:void(0)"
                        role="button"
                        draggable={false}
                        aria-label="View Non-Tracker Companies"
                        className="main-nav__item main-nav__item--link link-action link-action--dark"
                    >
                        <span className="main-nav__icon icon-small--blocked"></span>{' '}
                        <span className="main-nav__text">No Third-Party Requests Found</span> <span className="main-nav__chev"></span>
                    </a>
                </li>
            </ul>
        </nav>
    )
}

function KeyInsights() {
    return (
        <div id="key-insight">
            <div className="key-insight key-insight--main">
                <div data-company-count="1" aria-label="List of Blocked Company Icons" className="key-insight__icon icon-list">
                    <span style="order: 1" data-company-icon-position="1" className="icon-list__item">
                        {' '}
                        <span data-company-icon-size="large" className="icon-list__wrapper">
                            {' '}
                            <span className="icon-list__icon G color-8 google"></span>{' '}
                            <span className="icon-list__blocked-icon">
                                {' '}
                                <svg viewBox="0 0 32 32" fill="none">
                                    <circle fill="white" cx="16" cy="16" r="15"></circle>
                                    <path
                                        fill="#EE1025"
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16ZM24 16C24 20.4183 20.4183 24 16 24C14.5164 24 13.1271 23.5961 11.9361 22.8924L22.8924 11.9361C23.5961 13.1271 24 14.5164 24 16ZM9.10763 20.0639L20.0639 9.10763C18.8729 8.40386 17.4836 8 16 8C11.5817 8 8 11.5817 8 16C8 17.4836 8.40386 18.8729 9.10763 20.0639Z"
                                    ></path>
                                </svg>
                            </span>
                        </span>
                    </span>
                </div>
                <h1 className="token-title-3-em">example.com</h1>
                <div className="token-title-3">
                    <span>
                        We blocked <b>Google</b> from loading tracking requests on this page.
                    </span>
                </div>
            </div>
        </div>
    )
}

function ProtectionHeader() {
    const { push } = useRouter()
    return (
        <div data-testid="protectionHeader">
            <div className="card-list--bordered">
                <div className="protection-toggle">
                    <div className="protection-toggle__row">
                        <div className="site-info-toggle is-active">
                            <p className="site-info__protection">
                                <span role="textbox">
                                    Protections are <b>ON</b> for this site
                                </span>
                            </p>
                            <div className="site-info__toggle-container">
                                <button
                                    className="toggle-button"
                                    type="button"
                                    role="switch"
                                    aria-checked="true"
                                    aria-label="Disable Protections"
                                >
                                    <div className="toggle-button__track"></div>
                                    <div className="toggle-button__handle"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text--center">
                <a
                    href="javascript:void(0)"
                    onClick={() => push('breakage')}
                    className="link-action link-action--text link-action--rounded"
                    draggable={false}
                >
                    Website not working?
                </a>
            </div>
        </div>
    )
}
