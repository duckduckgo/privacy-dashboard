import $ from 'jquery'
import Parent from '../base/model.js'
import { httpsMessages } from '../../../data/constants'
import browserUIWrapper, { platform } from '../../browser/communication.js'
import { i18n } from '../base/localize.js'
import { createPlatformFeatures, FeatureSettings } from '../platform-features.mjs'
import { CheckBrokenSiteReportHandledMessage, CloseMessage, SetListsMessage, UpdatePermissionMessage } from '../../browser/common.js'
import { remoteFeatureSettingsSchema } from '../../../../schema/__generated__/schema.parsers.mjs'

// We consider major tracker networks as those found on this percentage of sites
// that we crawl
const MAJOR_TRACKER_THRESHOLD_PCT = 25

/** @this {any} */
function Site(attrs) {
    attrs = attrs || {}
    this.disabled = true // disabled by default
    this.tab = null
    this.permissions = null
    this.domain = '-'
    this.protectionsEnabled = false
    this.isBroken = false
    this.displayBrokenUI = false
    this.isAllowlisted = false
    this.isDenylisted = false
    this.httpsState = 'none'
    this.httpsStatusText = ''
    this.trackersCount = 0 // unique trackers count
    this.majorTrackerNetworksCount = 0
    this.totalTrackerNetworksCount = 0
    this.trackerNetworks = []
    this.isaMajorTrackingNetwork = false
    this.emailProtectionUserData = null
    this.acceptingUpdates = true
    this.features = createPlatformFeatures(platform)
    Parent.call(this, attrs)

    this.bindEvents([[this.store.subscribe, 'action:backgroundMessage', this.handleBackgroundMsg]])
}

/**
 * @typedef PublicSiteModel
 * @property {boolean} protectionsEnabled
 * @property {'secure' | 'upgraded' | 'none' | 'invalid'} httpsState
 * @property {string} httpsStatusText
 * @property {boolean} isBroken
 * @property {boolean} isAllowlisted
 * @property {boolean} isDenylisted
 * @property {boolean} displayBrokenUI
 * @property {boolean} isaMajorTrackingNetwork
 * @property {boolean} disabled
 * @property {import("../platform-features.mjs").PlatformFeatures} features
 * @property {FeatureSettings} featureSettings
 * @property {any[] | null} permissions
 * @property {import('../../browser/utils/request-details.mjs').TabData} tab
 * @property {(origin: import('../../../../schema/__generated__/schema.types.js').EventOrigin) => void} toggleAllowlist
 */

/**
 * @typedef {{
 *   tab: import('../../browser/utils/request-details.mjs').TabData,
 *   features: import("../platform-features.mjs").PlatformFeatures
 * } & Record<string, any>
 *   & { fetch: import("../../browser/common.js").fetcher} } LocalThis
 */

Site.prototype = $.extend({}, Parent.prototype, {
    modelName: 'site',

    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    getBackgroundTabData: function () {
        return new Promise((resolve) => {
            browserUIWrapper
                .getBackgroundTabData()
                .then(({ tab, emailProtectionUserData, fireButton, featureSettings }) => {
                    if (tab) {
                        if (tab.locale) {
                            // @ts-ignore
                            if (Object.keys(i18n.options.resources).includes(tab.locale)) {
                                i18n.changeLanguage(tab.locale)
                            } else {
                                console.warn(`Unsupported locale ${tab.locale}`)
                            }
                        }

                        this.set('tab', tab)
                        this.domain = tab.domain
                        this.set('isaMajorTrackingNetwork', (tab.parentEntity?.prevalence || 0) >= MAJOR_TRACKER_THRESHOLD_PCT)
                    } else {
                        this.domain = 'new tab'
                        console.debug('Site model: no tab')
                    }

                    this.emailProtectionUserData = emailProtectionUserData
                    this.fireButton = fireButton

                    if (featureSettings) {
                        const parsed = remoteFeatureSettingsSchema.safeParse(featureSettings)
                        if (parsed.success) {
                            this.featureSettings = new FeatureSettings(parsed.data)
                        } else {
                            console.error(parsed.error)
                            throw new Error('platform did not provide featureSettings')
                        }
                    } else {
                        // default
                        this.featureSettings = new FeatureSettings({})
                    }

                    this.update()
                    resolve(null)
                })
                .catch((e) => {
                    console.log('❌ [models/site.es6.js] --> ', e)
                })
        })
    },
    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    setSiteProperties: function () {
        if (!this.tab) {
            this.domain = 'new tab' // tab can be null for firefox new tabs
        } else {
            this.initAllowlisted(this.tab.protections.allowlisted, this.tab.protections.denylisted)
            if (this.tab.specialDomainName) {
                this.domain = this.tab.specialDomainName // eg "extensions", "options", "new tab"
            } else {
                this.set({ disabled: false })
            }
        }

        if (this.domain && this.domain === '-') this.set('disabled', true)
    },

    /** @this {PublicSiteModel} */
    setHttpsMessage: function () {
        if (!this.tab) return

        /** @type {PublicSiteModel['httpsState']} */
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

        this.httpsStatusText = i18n.t(httpsMessages[this.httpsState])
    },
    timeout: null,
    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    handleBackgroundMsg: function (message) {
        if (!this.tab) return
        if (message.action && message.action === 'updateTabData') {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                browserUIWrapper
                    .getBackgroundTabData()
                    .then(({ tab, emailProtectionUserData }) => {
                        this.tab = tab
                        this.emailProtectionUserData = emailProtectionUserData
                        this.update()
                    })
                    .catch((e) => {
                        console.log('❌ [models/site.es6.js:handleBackgroundMsg()] --> ', e)
                    })
            }, 100)
        }
    },

    /** @this {{ tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any> & {fetch: import("../../browser/common.js").fetcher}} */
    updatePermission: function (id, value) {
        if (!this.permissions) return

        const permissionIndex = this.permissions.findIndex(({ key }) => key === id)
        if (permissionIndex === -1) return

        // Deep copy permissions before mutating
        const updatedPermissions = JSON.parse(JSON.stringify(this.permissions))
        updatedPermissions[permissionIndex].permission = value
        this.set('permissions', updatedPermissions)

        try {
            this.fetch(new UpdatePermissionMessage({ id, value }))
        } catch (e) {
            console.error('updatePermission error', e)
        }
    },

    // calls `this.set()` to trigger view re-rendering
    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    update: function () {
        if (!this.acceptingUpdates) {
            console.log('not updating because acceptingUpdates was false')
            return
        }
        this.setSiteProperties()
        this.setHttpsMessage()

        if (this.tab) {
            this.set('permissions', this.tab.permissions)

            const newTrackersCount = this.getUniqueTrackersCount()
            if (newTrackersCount !== this.trackersCount) {
                this.set('trackersCount', newTrackersCount)
            }

            const newTrackersBlockedCount = this.getUniqueTrackersBlockedCount()
            if (newTrackersBlockedCount !== this.trackersBlockedCount) {
                this.set('trackersBlockedCount', newTrackersBlockedCount)
            }

            const newTrackerNetworks = this.getTrackerNetworksOnPage()
            if (this.trackerNetworks.length === 0 || newTrackerNetworks.length !== this.trackerNetworks.length) {
                this.set('trackerNetworks', newTrackerNetworks)
            }

            const newUnknownTrackersCount = this.getUnknownTrackersCount()
            const newTotalTrackerNetworksCount = newUnknownTrackersCount + newTrackerNetworks.length
            if (newTotalTrackerNetworksCount !== this.totalTrackerNetworksCount) {
                this.set('totalTrackerNetworksCount', newTotalTrackerNetworksCount)
            }

            const newMajorTrackerNetworksCount = this.getMajorTrackerNetworksCount()
            if (newMajorTrackerNetworksCount !== this.majorTrackerNetworksCount) {
                this.set('majorTrackerNetworksCount', newMajorTrackerNetworksCount)
            }
        }
    },
    /**
     * @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>}
     * @returns {number}
     */
    getUniqueTrackersCount: function () {
        return 0
    },

    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    getUniqueTrackersBlockedCount: function () {
        return 0
    },

    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    getUnknownTrackersCount: function () {
        let count = 0
        const entities = this.tab.requestDetails.all.entities
        for (const entity of Object.values(entities)) {
            if (entity.name === 'unknown') count += Object.keys(entity.urls).length
        }
        return count
    },

    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    getMajorTrackerNetworksCount: function () {
        // Show only blocked major trackers count, unless site is allowlisted
        let total = 0
        this.tab.requestDetails.forEachEntity((entity) => {
            const isMajor = entity.prevalence > MAJOR_TRACKER_THRESHOLD_PCT
            total += isMajor ? 1 : 0
        })
        return total
    },

    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    getTrackerNetworksOnPage: function () {
        const requests = this.tab.requestDetails
        const names = []
        requests.forEachEntity((en) => {
            if (en.name !== 'unknown') {
                names.push(en.name)
            }
        })
        return names
    },
    /** @this {LocalThis} */
    initAllowlisted: function (allowListValue, denyListValue) {
        this.isAllowlisted = allowListValue
        this.isDenylisted = denyListValue

        this.isBroken = Boolean(
            this.tab.protections.unprotectedTemporary || !this.tab.protections.enabledFeatures?.includes('contentBlocking')
        )
        this.displayBrokenUI = this.isBroken

        if (denyListValue) {
            this.displayBrokenUI = false
            this.protectionsEnabled = true
        } else {
            this.displayBrokenUI = this.isBroken
            this.protectionsEnabled = !(this.isAllowlisted || this.isBroken)
        }
        this.set('protectionsEnabled', this.protectionsEnabled)
    },

    /**
     * @param {import('../../../../schema/__generated__/schema.types.js').EventOrigin} eventOrigin
     * @this {LocalThis}
     */
    toggleAllowlist: function (eventOrigin) {
        /** @type {SetListsMessage["lists"]} */
        const lists = []
        this.set('acceptingUpdates', false)
        if (this.tab && this.tab.domain) {
            if (this.isBroken) {
                lists.push({
                    list: 'denylisted',
                    domain: this.tab.domain,
                    value: !this.isDenylisted,
                })
            } else {
                // Explicitly remove all denylisting if the site is isn't broken. This covers the case when the site has been removed from the list.
                lists.push({
                    list: 'denylisted',
                    domain: this.tab.domain,
                    value: false,
                })
                lists.push({
                    list: 'allowlisted',
                    domain: this.tab.domain,
                    value: !this.isAllowlisted,
                })
            }
        }
        this.setLists(lists, eventOrigin).catch((e) => console.error(e))
    },

    /**
     * @param {SetListsMessage["lists"]} lists
     * @param {import('../../../../schema/__generated__/schema.types.js').EventOrigin} eventOrigin
     * @returns {Promise<boolean>}
     */
    async setLists(lists, eventOrigin) {
        try {
            return this.fetch(new SetListsMessage({ lists, eventOrigin: eventOrigin }))
        } catch (e) {
            console.error('setList error', e)
            return false
        }
    },
    /** @this {{tab: import('../../browser/utils/request-details.mjs').TabData} & Record<string, any>} */
    companyNames: function () {
        return []
    },

    /**
     * @this {LocalThis}
     * @return {Promise<boolean>}
     */
    checkBrokenSiteReportHandled: function () {
        try {
            return this.fetch(new CheckBrokenSiteReportHandledMessage())
        } catch (e) {
            console.error('checkBrokenSiteReportHandled error', e)
            return Promise.resolve(false)
        }
    },
    /** @this {LocalThis} */
    close: function () {
        try {
            this.fetch(new CloseMessage({ eventOrigin: { screen: this.features.initialScreen } }))
        } catch (e) {
            console.error('close error', e)
        }
    },
})

export default Site
