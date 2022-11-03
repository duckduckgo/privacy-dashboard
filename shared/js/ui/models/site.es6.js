import $ from 'jquery'
import Parent from '../base/model.es6'
import { httpsMessages } from '../../../data/constants'
import browserUIWrapper, { platform } from '../../browser/communication.es6.js'
import { i18n } from '../base/localize.es6'
import { createPlatformFeatures } from '../platform-features'

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
 * @property {string} httpsState
 * @property {string} httpsStatusText
 * @property {boolean} isBroken
 * @property {boolean} isAllowlisted
 * @property {boolean} isDenylisted
 * @property {boolean} displayBrokenUI
 * @property {boolean} isaMajorTrackingNetwork
 * @property {boolean} disabled
 * @property {any[] | null} permissions
 * @property {import('../../browser/utils/request-details').TabData} tab
 */

Site.prototype = $.extend({}, Parent.prototype, {
    modelName: 'site',

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    getBackgroundTabData: function () {
        return new Promise((resolve) => {
            browserUIWrapper
                .getBackgroundTabData()
                .then(({ tab, emailProtectionUserData }) => {
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

                    this.update()
                    resolve(null)
                })
                .catch((e) => {
                    console.log('❌ [models/site.es6.js] --> ', e)
                })
        })
    },
    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
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

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    setHttpsMessage: function () {
        if (!this.tab) return

        if (this.tab.upgradedHttps) {
            this.httpsState = 'upgraded'
        } else if (/^https/.exec(this.tab.url)) {
            this.httpsState = 'secure'
        } else {
            this.httpsState = 'none'
        }

        this.httpsStatusText = i18n.t(httpsMessages[this.httpsState])
    },
    timeout: null,
    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
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

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    updatePermission: function (id, value) {
        if (!this.permissions) return

        const permissionIndex = this.permissions.findIndex(({ key }) => key === id)
        if (permissionIndex === -1) return

        // Deep copy permissions before mutating
        const updatedPermissions = JSON.parse(JSON.stringify(this.permissions))
        updatedPermissions[permissionIndex].permission = value
        this.set('permissions', updatedPermissions)

        try {
            this.fetch({ updatePermission: { id, value } })
        } catch (e) {
            console.error('updatePermission error', e)
        }
    },

    // calls `this.set()` to trigger view re-rendering
    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    update: function (ops) {
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
     * @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>}
     * @returns {number}
     */
    getUniqueTrackersCount: function () {
        return 0
    },

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    getUniqueTrackersBlockedCount: function () {
        return 0
    },

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    getUnknownTrackersCount: function () {
        let count = 0
        const entities = this.tab.requestDetails.all.entities
        for (const entity of Object.values(entities)) {
            if (entity.name === 'unknown') count += Object.keys(entity.urls).length
        }
        return count
    },

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    getMajorTrackerNetworksCount: function () {
        // Show only blocked major trackers count, unless site is allowlisted
        let total = 0
        this.tab.requestDetails.forEachEntity((entity) => {
            const isMajor = entity.prevalence > MAJOR_TRACKER_THRESHOLD_PCT
            total += isMajor ? 1 : 0
        })
        return total
    },

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
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
    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
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

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any> & Site} */
    toggleAllowlist: function () {
        const fetches = []
        this.acceptingUpdates = false
        if (this.tab && this.tab.domain) {
            if (this.isBroken) {
                // this.initAllowlisted(this.isAllowlisted, !this.isDenylisted)
                fetches.push(this.setList('denylisted', this.tab.domain, !this.isDenylisted))
            } else {
                // Explicitly remove all denylisting if the site is isn't broken. This covers the case when the site has been removed from the list.
                fetches.push(this.setList('denylisted', this.tab.domain, false))
                // this.initAllowlisted(!this.isAllowlisted)
                fetches.push(this.setList('allowlisted', this.tab.domain, !this.isAllowlisted))
            }
        }
        // if the platform supports showing a spinner, make it display
        if (this.features.spinnerFollowingProtectionsToggle && fetches.length > 0) {
            this.tab.isPendingUpdates = true
            // force a re-render without fetching new data
            this.set('disabled', false)
        }

        Promise.all(fetches)
            .then(() => {
                if (this.tab.id) {
                    return this.fetch({ postToggleAllowlist: { id: this.tab.id } })
                }
            })
            .catch((e) => console.error(e))
    },

    setList(list, domain, value) {
        try {
            return this.fetch({
                setList: {
                    list,
                    domain,
                    value,
                },
            })
        } catch (e) {
            console.error('setList error', e)
            return false
        }
    },
    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    companyNames: function () {
        return []
    },

    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    checkBrokenSiteReportHandled: function () {
        try {
            return this.fetch({ checkBrokenSiteReportHandled: true })
        } catch (e) {
            console.error('checkBrokenSiteReportHandled error', e)
            return false
        }
    },
    /** @this {{tab: import('../../browser/utils/request-details').TabData} & Record<string, any>} */
    close: function () {
        try {
            this.fetch({ closePrivacyDashboard: true })
        } catch (e) {
            console.error('close error', e)
        }
    },
})

export default Site
