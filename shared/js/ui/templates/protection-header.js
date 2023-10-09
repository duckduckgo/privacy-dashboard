import html from 'nanohtml'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { render, h, Fragment } from 'preact'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from 'preact/hooks'
import { i18n, ns } from '../base/localize'
import { TextLink } from '../components/text-link.jsx'
import { ProtectionToggle } from '../components/toggle'

/**
 * @typedef MigrationModel
 * @property {boolean} isAllowlisted
 * @property {boolean} isBroken
 * @property {boolean} isDenylisted
 * @property {boolean} protectionsEnabled
 * @property {() => void} toggleAllowlist
 * @property {import("../platform-features.mjs").PlatformFeatures} platformFeatures
 */

/**
 * A wrapper around the preact render
 * @param {import('../models/site.js').PublicSiteModel} model
 * @returns {HTMLElement}
 */
export function protectionHeader(model) {
    const root = html`<div data-testid="protectionHeader"></div>`
    const migrationModel = {
        protectionsEnabled: model.protectionsEnabled,
        isAllowlisted: model.isAllowlisted,
        isDenylisted: model.isDenylisted,
        platformFeatures: model.features,
        isBroken: model.isBroken,
        toggleAllowlist: model.toggleAllowlist.bind(model),
    }
    render(<ProtectionHeader model={migrationModel} />, root)
    return root
}

/**
 * Regular protection toggle
 * @param {import('../models/site.js').PublicSiteModel} model
 * @return {HTMLElement}
 */
export function protectionDefault(model) {
    const root = html`<div class="padding-x padding-y"></div>`
    const migrationModel = {
        protectionsEnabled: model.protectionsEnabled,
        isAllowlisted: model.isAllowlisted,
        isDenylisted: model.isDenylisted,
        platformFeatures: model.features,
        isBroken: model.isBroken,
        toggleAllowlist: model.toggleAllowlist.bind(model),
    }
    render(<ProtectionToggle model={migrationModel} />, root)
    return root
}

/**
 * @typedef {'form-trigger' | 'site-not-working' | 'help-trigger' } UIState
 * @typedef {{text: string; label: string; active: boolean; disabled: boolean; toggled: boolean}} ToggleState
 */

/**
 * @param {object} props
 * @param {MigrationModel} props.model
 */
export function ProtectionHeader(props) {
    /** @type {UIState} */
    const initial = props.model.isBroken || props.model.isAllowlisted ? 'form-trigger' : 'help-trigger'
    const [state, setState] = useState(/** @type {UIState} */ (initial))

    // prettier-ignore
    let buttonText = state === 'help-trigger'
        ? ns.site('websiteNotWorkingPrompt.title')
        : ns.site('websiteNotWorkingCta.title')

    if (props.model.isBroken) {
        buttonText = ns.site('websiteNotWorkingCta.title')
    }

    if (props.model.isAllowlisted) {
        buttonText = ns.site('websiteNotWorkingCta.title')
    }

    function onClickTextLink(e) {
        e.preventDefault()
        if (state === 'help-trigger') {
            setState('site-not-working')
        } else {
            // dispatching this for now, since there a few things that
            // are checked/used in the existing view
            window.dispatchEvent(new CustomEvent('open-feedback'))
        }
    }

    return (
        <>
            <div className="padding-x border--bottom padding-bottom-half">
                <div class="card-list--bordered">
                    {props.model.isBroken && <HeaderDisabled model={props.model} state={state} />}
                    {!props.model.isBroken && <HeaderDefault model={props.model} state={state} />}
                </div>
                <div className="text--center">
                    <TextLink onClick={onClickTextLink} rounded={true}>
                        {buttonText}
                    </TextLink>
                </div>
            </div>
            <div className="padding-spacer"></div>
        </>
    )
}

/**
 * @param {object} props
 * @param {UIState} props.state
 * @param {MigrationModel} props.model
 */
function HeaderDefault(props) {
    const text = ns.site('websiteNotWorkingAdvice.title')
    return (
        <>
            <div className="padding-x padding-y--reduced">
                <ProtectionToggle model={props.model} />
            </div>
            {props.state === 'site-not-working' && <div className="note note--nested note--nested--alt">{text}</div>}
        </>
    )
}

/**
 * @param {object} props
 * @param {UIState} props.state
 * @param {MigrationModel} props.model
 */
function HeaderDisabled(props) {
    let text = i18n.t('site:protectionsDisabledRemote.title')
    if (props.model.isDenylisted) {
        text = i18n.t('site:protectionsDisabledRemoteOverride.title')
    }
    return (
        <>
            <div className="padding-x padding-y--reduced">
                <ProtectionToggle model={props.model} />
            </div>
            <div className="note note--nested">{text}</div>
        </>
    )
}
