import html from 'nanohtml'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, h, Fragment } from 'preact'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useLayoutEffect, useRef, useState } from 'preact/hooks'
import { MDCRipple } from '@material/ripple'
import { MDCSwitch } from '@material/switch'
import { i18n, ns } from '../base/localize'
import { isAndroid, isBrowser } from '../environment-check'

/**
 * A wrapper around the preact render
 * @param {import('../models/site.js').PublicSiteModel} model
 * @returns {HTMLElement}
 */
export function protectionHeader(model) {
    const root = html`<div data-testid="protectionHeader"></div>`
    render(<ProtectionHeader model={model} />, root)
    return root
}

/**
 * @typedef {'form-trigger' | 'site-not-working' | 'help-trigger' } UIState
 * @typedef {{text: string; label: string; active: boolean; disabled: boolean}} ToggleState
 */

/**
 * @param {object} props
 * @param {import('../models/site.js').PublicSiteModel} props.model
 */
export function ProtectionHeader(props) {
    /** @type {UIState} */
    const initial = props.model.isBroken || props.model.isAllowlisted ? 'form-trigger' : 'help-trigger'
    const [state, setState] = useState(/** @type {UIState} */ (initial))

    let buttonText = state === 'help-trigger' ? ns.site('websiteNotWorkingPrompt.title') : ns.site('websiteNotWorkingCta.title')

    if (props.model.isBroken) {
        buttonText = ns.site('websiteNotWorkingCta.title')
    }

    if (props.model.isAllowlisted) {
        buttonText = ns.site('websiteNotWorkingCta.title')
    }

    const ui = props.model.isBroken ? (
        <HeaderDisabled model={props.model} state={state} />
    ) : (
        <HeaderDefault model={props.model} state={state} />
    )

    function onClickTextLink(e) {
        e.preventDefault()
        if (state === 'help-trigger') {
            setState('site-not-working')
        } else {
            window.dispatchEvent(new CustomEvent('open-feedback'))
        }
    }

    return (
        <>
            <div className="padding-x border--bottom padding-bottom-half">
                <div class="card-list--bordered">{ui}</div>
                <TextLink onClick={onClickTextLink} state={state} model={props.model}>
                    {buttonText}
                </TextLink>
            </div>
            <div className="padding-spacer"></div>
        </>
    )
}

/**
 * @param {object} props
 * @param {UIState} props.state
 * @param {import('../models/site.js').PublicSiteModel} props.model
 * @param {import('preact').ComponentChildren} props.children
 * @param {() => void} props.onClick
 */
function TextLink(props) {
    const { onClick } = props
    const ref = useRef(null)

    useRipple({ ref })

    return (
        <div className="text--center">
            <a href="javascript:void(0)" className="link-action link-action--text" draggable={false} ref={ref} onClick={onClick}>
                {props.children}
            </a>
        </div>
    )
}

function useRipple(params) {
    const { ref } = params
    useLayoutEffect(() => {
        const $el = ref.current
        if (!$el) return
        $el.classList.add('material-design-ripple')
        const instance = MDCRipple.attachTo($el)
        instance.listen('click', function (e) {
            if (e.target instanceof HTMLElement) {
                e.target.closest?.('a')?.blur()
            }
        })
        return () => {
            // cleanup
            instance.destroy()
        }
    }, [])
}

/**
 * @param {object} props
 * @param {UIState} props.state
 * @param {import('../models/site.js').PublicSiteModel} props.model
 */
function HeaderDefault(props) {
    const text = ns.site('websiteNotWorkingAdvice.title')
    return (
        <>
            <div className="padding-x padding-y--reduced">
                <ProtectionToggle model={props.model} />
            </div>
            {props.state === 'site-not-working' && <div className="note note--nested-alt">{text}</div>}
        </>
    )
}

/**
 * @param {object} props
 * @param {UIState} props.state
 * @param {import('../models/site.js').PublicSiteModel} props.model
 */
function HeaderDisabled(props) {
    let text = i18n.t('site:protectionsDisabledRemote.title')
    if (props.model.isDenylisted) {
        text = i18n.t('site:protectionsDisabledRemoteOverride.title')
    }
    return (
        <>
            <div className="note note--nested">{text}</div>
            <div className="padding-x padding-y--reduced">
                <ProtectionToggle model={props.model} />
            </div>
        </>
    )
}

/**
 * @param {object} props
 * @param {import('../models/site.js').PublicSiteModel} props.model
 */
export function ProtectionToggle(props) {
    const toggleState = getToggleState(props.model)

    return (
        <div class={`site-info-toggle ${toggleState.active ? 'is-active' : ''}`}>
            <p class="site-info__protection">
                <span role="textbox" dangerouslySetInnerHTML={{ __html: toggleState.text }}></span>
            </p>
            <div class="site-info__toggle-container js-site-toggle-parent">
                <ToggleButton toggleState={toggleState} />
            </div>
        </div>
    )
}

/**
 * @param {import('../models/site.js').PublicSiteModel} model
 * @returns {ToggleState}
 */
function getToggleState(model) {
    /** @type {ToggleState} */
    const toggleState = {
        text: ns.site('protectionsEnabled.title'),
        active: true,
        disabled: false,
        label: '',
    }

    if (!model.protectionsEnabled) {
        toggleState.text = ns.site('protectionsDisabled.title')
        toggleState.active = false
    }

    /**
     * Only the `extension` can toggle protections back ON (currently)
     * So for all other platforms, a 'broken site' means that we disable the toggle
     */
    if (model.isBroken) {
        if (!isBrowser()) {
            toggleState.active = false
            toggleState.disabled = true
        }
    }

    const labelEnabled = ns.site('enableProtectionsSwitch.title')
    const labelDisabled = ns.site('disableProtectionsSwitch.title')
    toggleState.label = toggleState.active ? labelDisabled : labelEnabled

    return toggleState
}

/**
 * @param {object} props
 * @param {ToggleState} props.toggleState
 */
function ToggleButton(props) {
    const { toggleState } = props

    const labelEnabled = ns.site('enableProtectionsSwitch.title')
    const labelDisabled = ns.site('disableProtectionsSwitch.title')
    const label = toggleState.active ? labelDisabled : labelEnabled

    // prettier-ignore
    return isAndroid()
        ? <AndroidToggle toggleState={toggleState} label={label} />
        : <DefaultToggleButton toggleState={toggleState} label={label} />
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {ToggleState} props.toggleState
 */
export function AndroidToggle(props) {
    const ref = useRef(null)
    const className = `mdc-switch mdc-switch--${props.toggleState.active ? 'selected' : 'unselected'}`

    useLayoutEffect(() => {
        if (!ref.current) return
        const elem = /** @type {HTMLButtonElement} */ (ref.current)
        if (!(elem instanceof HTMLButtonElement)) return

        const switchInstance = new MDCSwitch(ref.current)
        switchInstance.listen('click', () => {
            const pressed = elem.getAttribute('aria-checked')
            const next = pressed === 'true' ? 'false' : 'true'
            elem.setAttribute('aria-checked', next)
            window.dispatchEvent(new CustomEvent('allow-list-change'))
            switchInstance.destroy()
        })
        return () => {
            switchInstance.destroy()
        }
    }, [])

    return (
        <button
            ref={ref}
            id="basic-switch"
            class={className}
            type="button"
            role="switch"
            aria-checked="false"
            aria-label={props.label}
            disabled={props.toggleState.disabled}
        >
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__handle-track">
                <div class="mdc-switch__handle">
                    <div class="mdc-switch__shadow">
                        <div class="mdc-elevation-overlay"></div>
                    </div>
                    <div class="mdc-switch__ripple"></div>
                </div>
            </div>
            <span class="mdc-switch__focus-ring-wrapper">
                <div class="mdc-switch__focus-ring"></div>
            </span>
        </button>
    )
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {ToggleState} props.toggleState
 */
export function DefaultToggleButton(props) {
    const { toggleState, label } = props

    return (
        <button
            class="toggle-button"
            type="button"
            role="switch"
            aria-checked={toggleState.active}
            aria-label={label}
            disabled={toggleState.disabled}
        >
            <div class="toggle-button__track"></div>
            <div class="toggle-button__handle"></div>
        </button>
    )
}
