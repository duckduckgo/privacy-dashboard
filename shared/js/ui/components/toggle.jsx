// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from 'preact'
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks'
import { MDCSwitch } from '@material/switch'
import { ns } from '../base/localize'
import { isAndroid, isBrowser } from '../environment-check'

/**
 * @import {MigrationModel} from "../templates/protection-header"
 * @typedef {{text: string; label: string; active: boolean; disabled: boolean; toggled: boolean}} ToggleState
 */

/**
 * @param {object} props
 * @param {MigrationModel} props.model
 * @param {() => void} props.toggle
 */
export function ProtectionToggle(props) {
    const [toggleState, toggle] = useToggleState(props.model, props.toggle)
    const altText = ns.site('updatingProtectionList.title')

    return (
        <div class={`site-info-toggle ${toggleState.active ? 'is-active' : ''}`}>
            <p class="site-info__protection">
                <span role="textbox" dangerouslySetInnerHTML={{ __html: toggleState.text }}></span>
            </p>
            <div class="site-info__toggle-container">
                {toggleState.toggled && <img src="../img/spinner.svg" className="toggle-spinner" alt={altText} />}
                {!toggleState.toggled && <ToggleButton toggleState={toggleState} onToggle={toggle} />}
            </div>
        </div>
    )
}

/**
 * @param {MigrationModel} model
 * @param {() => void} toggle
 * @returns {[ToggleState, () => void]}
 */
export function useToggleState(model, toggle) {
    const [state, setState] = useState(() => {
        const toggleState = {
            text: ns.site('protectionsEnabled.title'),
            active: true,
            disabled: false,
            label: '',
            toggled: false,
            sideEffects: false,
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
    })

    /**
     * When the state changes, decide what to do
     */
    useEffect(() => {
        if (!state.sideEffects) return
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches === true
        const timeout = isReducedMotion ? 0 : 300

        const int = setTimeout(() => {
            // toggle, this communicates with native
            toggle()

            // if the platform supports using a spinner
            if (model.features.spinnerFollowingProtectionsToggle) {
                setState((prev) => {
                    return { ...prev, toggled: true }
                })
            }
        }, timeout)
        return () => {
            clearTimeout(int)
        }
    }, [state.active, state.sideEffects])

    /**
     * Wrapper around the toggle method that consumers will call.
     */
    function toggleInternal() {
        setState((prev) => {
            return { ...prev, active: !prev.active, sideEffects: true }
        })
    }

    return [state, toggleInternal]
}

/**
 * @param {object} props
 * @param {ToggleState} props.toggleState
 * @param {() => void} props.onToggle
 */
export function ToggleButton(props) {
    const { toggleState } = props

    const labelEnabled = ns.site('enableProtectionsSwitch.title')
    const labelDisabled = ns.site('disableProtectionsSwitch.title')
    const label = toggleState.active ? labelDisabled : labelEnabled

    // prettier-ignore
    return isAndroid()
        ? <AndroidToggle toggleState={toggleState} onToggle={props.onToggle} label={label} />
        : <DefaultToggleButton toggleState={toggleState} label={label} onToggle={props.onToggle} />
}

/**
 * @param {object} props
 * @param {string} props.label
 * @param {ToggleState} props.toggleState
 * @param {() => void} props.onToggle
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
            props.onToggle()
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
 * @param {() => void} props.onToggle
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
            onClick={props.onToggle}
        >
            <div class="toggle-button__track"></div>
            <div class="toggle-button__handle"></div>
        </button>
    )
}
