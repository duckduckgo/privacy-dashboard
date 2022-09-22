/** @type {any} */
const bel = require('bel')
const { isAndroid } = require('../../environment-check')

const generateMaterialDesignToggle = (isActiveBoolean, klass, disabled) => {
    return bel`
    <button
        id="basic-switch"
        class="mdc-switch mdc-switch--${isActiveBoolean ? 'selected' : 'unselected'} ${klass}"
        type="button"
        role="switch"
        aria-checked="false"
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
export function toggleButton (isActiveBoolean, klass, disabled) {
    if (isAndroid()) {
        return generateMaterialDesignToggle(isActiveBoolean, klass, disabled)
    }

    return bel`
    <button class="toggle-button toggle-button--is-active-${isActiveBoolean} ${klass}"
        type="button"
        aria-pressed="${isActiveBoolean ? 'true' : 'false'}"
        ${disabled ? 'disabled' : ''}
    >
        <div class="toggle-button__bg">
        </div>
        <div class="toggle-button__knob"></div>
    </button>`
}
