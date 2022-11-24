import bel from 'bel'
import { ns } from '../../base/localize.es6'
import { isAndroid } from '../../environment-check'

const labelEnabled = ns.site('enableProtectionsSwitch.title')
const labelDisabled = ns.site('disableProtectionsSwitch.title')

function generateMaterialDesignToggle(isActiveBoolean, klass, disabled) {
    const label = isActiveBoolean ? labelDisabled : labelEnabled
    return bel`
    <button
        id="basic-switch"
        class="mdc-switch mdc-switch--${isActiveBoolean ? 'selected' : 'unselected'} ${klass}"
        type="button"
        role="switch"
        aria-checked="false"
        aria-label=${label}
        ${disabled ? 'disabled' : ''}
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
        `
}

/**
 * @param {boolean} isActiveBoolean
 * @param {string} klass
 * @param {boolean | undefined} disabled
 * @returns {*}
 */
export function toggleButton(isActiveBoolean, klass, disabled) {
    if (isAndroid()) {
        return generateMaterialDesignToggle(isActiveBoolean, klass, disabled)
    }

    const label = isActiveBoolean ? labelDisabled : labelEnabled

    return bel`
    <button class='toggle-button ${klass}'
        type='button'
        role="switch"
        aria-checked='${isActiveBoolean}'
        aria-label='${label}'
        ${disabled ? 'disabled' : ''}
    >
        <div class='toggle-button__track'></div>
        <div class='toggle-button__handle'></div>
    </button>`
}
