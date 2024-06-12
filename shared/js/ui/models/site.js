/**
 * @typedef PublicSiteModel
 * @property {boolean} protectionsEnabled
 * @property {'secure' | 'upgraded' | 'none' | 'invalid'} httpsState
 * @property {boolean} isBroken
 * @property {boolean} isAllowlisted
 * @property {boolean} isDenylisted
 * @property {boolean} displayBrokenUI
 * @property {boolean} isaMajorTrackingNetwork
 * @property {boolean} disabled
 * @property {import("../platform-features.mjs").PlatformFeatures} features
 * @property {import("../platform-features.mjs").FeatureSettings} featureSettings
 * @property {any[] | null | undefined} permissions
 * @property {import('../../browser/utils/request-details.mjs').TabData} tab
 */
export {}
