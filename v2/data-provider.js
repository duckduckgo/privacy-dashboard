// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, createContext } from 'preact'
import comms, { platform } from '../shared/js/browser/communication.js'
import { useContext, useEffect, useState } from 'preact/hooks'
import { i18n } from '../shared/js/ui/base/localize'
import { createPlatformFeatures, FeatureSettings, PlatformFeatures } from '../shared/js/ui/platform-features.mjs'

/**
 * @typedef {Object} DataChannelPublicData
 * @property {boolean} protectionsEnabled
 * @property {'secure' | 'upgraded' | 'none' | 'invalid'} httpsState
 * @property {boolean} isBroken
 * @property {boolean} isAllowlisted
 * @property {boolean} isDenylisted
 * @property {boolean} displayBrokenUI
 * @property {boolean} isaMajorTrackingNetwork
 * @property {boolean} disabled
 * @property {PlatformFeatures} features
 * @property {FeatureSettings} featureSettings
 * @property {any[] | null | undefined} permissions
 * @property {import('../shared/js/browser/utils/request-details.mjs').TabData} tab
 * @property {number} count
 *
 *
 * @property {import('../schema/__generated__/schema.types').EmailProtectionUserData} [emailProtectionUserData]
 * @property {{ enabled: boolean }} [fireButton]
 */

class DataChannel extends EventTarget {
    protectionsEnabled = false
    /** @type {'secure' | 'upgraded' | 'none' | 'invalid'} */
    httpsState = 'none'
    isBroken = false
    isAllowlisted = false
    isDenylisted = false
    displayBrokenUI = false
    isaMajorTrackingNetwork = false
    disabled = false
    features = createPlatformFeatures(platform)
    /** @type {FeatureSettings | null} */
    featureSettings = null
    /** @type {any[] | null | undefined} */
    permissions = null
    /** @type {import('../shared/js/browser/utils/request-details.mjs').TabData | null} */
    tab = null
    /** @type {any} */
    emailProtectionUserData = {}
    count = 0

    _timeout = /** @type {any} */ (null)

    /**
     * This will be called by the communication layer
     */
    send() {
        clearTimeout(this._timeout)
        this._timeout = window.setTimeout(() => {
            comms
                .getBackgroundTabData()
                .then((resp) => {
                    this.accept(resp)
                })
                .catch((e) => {
                    console.log('❌ [models/site.es6.js:handleBackgroundMsg()] --> ', e)
                })
        }, 100)
    }

    /**
     * @param {import('../shared/js/browser/common.js').BackgroundTabData} data
     */
    accept({ tab, emailProtectionUserData, fireButton }) {
        if (tab) {
            if (tab.locale) {
                // @ts-ignore
                if (Object.keys(i18n.options.resources).includes(tab.locale)) {
                    i18n.changeLanguage(tab.locale)
                } else {
                    console.warn(`Unsupported locale ${tab.locale}`)
                }
            }

            this.tab = tab
            this.domain = tab.domain
            const MAJOR_TRACKER_THRESHOLD_PCT = 25
            this.isaMajorTrackingNetwork = (tab.parentEntity?.prevalence || 0) >= MAJOR_TRACKER_THRESHOLD_PCT
        } else {
            this.domain = 'new tab'
            console.debug('Site model: no tab')
        }

        this.emailProtectionUserData = emailProtectionUserData
        this.fireButton = fireButton
        this.featureSettings = new FeatureSettings({})

        this.setSiteProperties()
        this.setHttpsMessage()

        if (this.tab) {
            this.permissions = this.tab.permissions
        }

        this.broadcast()
    }

    setSiteProperties() {
        if (!this.tab) {
            this.domain = 'new tab' // tab can be null for firefox new tabs
        } else {
            this.initAllowlisted(this.tab.protections.allowlisted, this.tab.protections.denylisted)
            if (this.tab.specialDomainName) {
                this.domain = this.tab.specialDomainName // eg "extensions", "options", "new tab"
            } else {
                this.disabled = false
            }
        }

        if (this.domain && this.domain === '-') {
            this.disabled = true
        }
    }

    initAllowlisted(allowListValue, denyListValue) {
        this.isAllowlisted = allowListValue
        this.isDenylisted = denyListValue

        this.isBroken = Boolean(
            this.tab?.protections.unprotectedTemporary || !this.tab?.protections.enabledFeatures?.includes('contentBlocking')
        )
        this.displayBrokenUI = this.isBroken

        if (denyListValue) {
            this.displayBrokenUI = false
            this.protectionsEnabled = true
        } else {
            this.displayBrokenUI = this.isBroken
            this.protectionsEnabled = !(this.isAllowlisted || this.isBroken)
        }
    }

    setHttpsMessage() {
        if (!this.tab) return

        /** @type {import('../shared/js/ui/models/site.js').PublicSiteModel['httpsState']} */
        let nextState = (() => {
            if (this.tab.upgradedHttps) {
                return 'upgraded'
            }
            if (/^https/.exec(this.tab.url)) {
                if (this.features.supportsInvalidCerts) {
                    if (!this.tab.certificate || this.tab.certificate.length === 0) {
                        return 'invalid'
                    }
                }
                return 'secure'
            }
            return 'none'
        })()

        this.httpsState = nextState
    }

    broadcast() {
        this.count += 1
        this.dispatchEvent(new CustomEvent('data', { detail: this.lastValue() }))
    }

    /**
     * @return {DataChannelPublicData}
     */
    lastValue() {
        if (!this.tab) throw new Error('unreachable')
        if (!this.featureSettings) throw new Error('unreachable')
        return {
            protectionsEnabled: this.protectionsEnabled,
            httpsState: this.httpsState,
            isBroken: this.isBroken,
            isAllowlisted: this.isAllowlisted,
            isDenylisted: this.isDenylisted,
            displayBrokenUI: this.displayBrokenUI,
            isaMajorTrackingNetwork: this.isaMajorTrackingNetwork,
            disabled: this.disabled,
            features: this.features,
            featureSettings: this.featureSettings,
            permissions: this.permissions,
            tab: this.tab,
            count: this.count,
        }
    }

    /**
     * @param {import('../schema/__generated__/schema.types.js').EventOrigin} eventOrigin
     * @param eventOrigin
     */
    toggleAllowlist(eventOrigin) {
        console.warn('todo: implement toggleAllowlist')
        debugger
    }
}

const dc = new DataChannel()
comms.backgroundMessage(dc)

const ChannelContext = createContext({
    /** @type {DataChannel} */
    channel: /** @type {any} */ (null),
})

/**
 * Provides data to the children components.
 *
 * @param {Object} props - The properties of the DataProvider component.
 * @param {import("preact").ComponentChild} props.children - The children components to be rendered.
 */
export function DataProvider({ children }) {
    const d = useInternalData()
    if (!d || d.count === 0) return null
    return <ChannelContext.Provider value={{ channel: dc }}>{children}</ChannelContext.Provider>
}

export function useChannel() {
    return useContext(ChannelContext).channel
}

/**
 * @return {null | DataChannelPublicData}
 */
export function useInternalData() {
    const [state, setState] = useState(null)
    useEffect(() => {
        const handler = (evt) => {
            setState(evt.detail)
        }
        dc.addEventListener('data', handler)
        return () => {
            dc.removeEventListener('data', handler)
        }
    }, [])
    return state
}
/**
 * Public data is always ready to read.
 * @return {DataChannelPublicData}
 */
export function useData() {
    const [state, setState] = useState(() => dc.lastValue())
    useEffect(() => {
        const handler = (evt) => {
            setState(evt.detail)
        }
        dc.addEventListener('data', handler)
        return () => {
            dc.removeEventListener('data', handler)
        }
    }, [])
    return state
}
