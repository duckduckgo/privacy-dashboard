/**
 * @module Generated Schema Definitions
 * @description This was auto-generated by the 'npm run schema' command.
 * It uses JSON schema files located in the 'schema' folder
 *
 * The 'Interfaces' listed below can be used to document API boundaries where JSON is sent/received to the various
 * platforms. They all have a corresponding Zod parser that can be used in runtime code to verify incoming/outgoing data.
 *
 * For example, {@link RequestData} is used by all platforms to describe the minimum amount of data required
 * by the Privacy Dashboard - it's parser can be imported from 'schema/__generated__/schema.parsers.js' and used
 * to validate incoming Tracker data.
 */
/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This indicates that the request was allowed because either the user or DuckDuckGo disabled protections
 */
export type ProtectionsDisabledReason = "protectionDisabled";
/**
 * This indicates that the request was allowed because the request was to a domain that the current web page's owner also owns
 */
export type OwnedByFirstPartyReason = "ownedByFirstParty";
/**
 * This indicates that the request was allowed because of a rule exception, such as a Tracker Radar 'ignore' entry
 */
export type RuleExceptionReason = "ruleException";
/**
 * This indicates that the request was allowed because of Ad Attribution
 */
export type AdClickAttributionReason = "adClickAttribution";
/**
 * This indicates that the request was allowed because it was to a third party, but was not classified to be a tracker
 */
export type OtherThirdPartyRequestReason = "otherThirdPartyRequest";
/**
 * A helper list of messages that the Dashboard accepts from Windows
 */
export type WindowsIncomingMessage = WindowsIncomingVisibility | WindowsIncomingViewModel;
export type ScreenKind = "primaryScreen" | "breakageForm" | "toggleReport" | "promptBreakageForm";
export type DataItemId =
  | WvVersionTitle
  | RequestsTitle
  | FeaturesTitle
  | AppVersionTitle
  | AtbTitle
  | ErrorDescriptionsTitle
  | ExtensionVersionTitle
  | HttpErrorCodesTitle
  | LastSentDayTitle
  | DeviceTitle
  | OsTitle
  | ListVersionsTitle
  | ReportFlowTitle
  | SiteUrlTitle
  | DidOpenReportInfoTitle
  | ToggleReportCounterTitle
  | OpenerContextTitle
  | UserRefreshCountTitle
  | JsPerformanceTitle;
/**
 * wvVersion description
 */
export type WvVersionTitle = "wvVersion";
/**
 * requests description
 */
export type RequestsTitle = "requests";
/**
 * features description
 */
export type FeaturesTitle = "features";
/**
 * appVersion description
 */
export type AppVersionTitle = "appVersion";
/**
 * atb description
 */
export type AtbTitle = "atb";
/**
 * errorDescriptions description
 */
export type ErrorDescriptionsTitle = "errorDescriptions";
/**
 * extensionVersion description
 */
export type ExtensionVersionTitle = "extensionVersion";
/**
 * httpErrorCodes description
 */
export type HttpErrorCodesTitle = "httpErrorCodes";
/**
 * lastSentDay description
 */
export type LastSentDayTitle = "lastSentDay";
/**
 * device description
 */
export type DeviceTitle = "device";
/**
 * os description
 */
export type OsTitle = "os";
/**
 * listVersions description
 */
export type ListVersionsTitle = "listVersions";
/**
 * reportFlow description
 */
export type ReportFlowTitle = "reportFlow";
/**
 * siteUrl description
 */
export type SiteUrlTitle = "siteUrl";
/**
 * didOpenReportInfo description
 */
export type DidOpenReportInfoTitle = "didOpenReportInfo";
/**
 * toggleReportCounter description
 */
export type ToggleReportCounterTitle = "toggleReportCounter";
/**
 * openerContext description
 */
export type OpenerContextTitle = "openerContext";
/**
 * userRefreshCount description
 */
export type UserRefreshCountTitle = "userRefreshCount";
/**
 * jsPerformance description
 */
export type JsPerformanceTitle = "jsPerformance";

/**
 * This describes all of the top-level generated types
 * @internal
 */
export interface API {
  "request-data": RequestData;
  "extension-message-get-privacy-dashboard-data": ExtensionMessageGetPrivacyDashboardData;
  "get-privacy-dashboard-data"?: GetPrivacyDashboardData;
  "search-message"?: Search;
  "breakage-report": BreakageReport;
  "set-list"?: SetListOptions;
  "windows-incoming-message"?: WindowsIncomingMessage;
  "locale-settings"?: LocaleSettings;
  "refresh-alias-response"?: RefreshAliasResponse;
  exe?: ExtensionMessageSetListOptions;
  "fire-button"?: FireButtonData;
  "feature-settings"?: RemoteFeatureSettings;
  "set-protection"?: SetProtectionParams;
  "toggle-report-screen"?: ToggleReportScreen;
  "close-message"?: CloseMessageParams;
}
/**
 * This describes the shape of the data that's required to display grouped requests in the Dashboard.
 *
 * It should include trackers (blocked or not) along with third party requests - all under the `requests` key.
 *
 * This type is left as an 'open object' deliberately for future extension
 *
 * **Please see the following JSON files as examples**
 *
 * Note: These JSON files are validated against the generated types here, so can/should be used as reliable references
 *
 * - [amazon.json](media://request-data-amazon.json)
 * - [cnn.json](media://request-data-cnn.json)
 * - [google.json](media://request-data-google.json)
 *
 *
 */
export interface RequestData {
  /**
   * Requests that were detected as trackers - whether they were blocked or not
   */
  requests: DetectedRequest[];
  /**
   * A *optional* list of domains that indicate if a surrogate has been used on it
   */
  installedSurrogates?: string[];
}
/**
 * This describes a single request. It's expected that native platforms de-duplicate requests.
 *
 * This type is mainly used by {@link RequestData} when platforms deliver request data to the dashboard.
 *
 * Also, please see the following JSON files where this type is used under the `requests` key:
 *
 * - [amazon.json](media://request-data-amazon.json)
 * - [cnn.json](media://request-data-cnn.json)
 * - [google.json](media://request-data-google.json)
 */
export interface DetectedRequest {
  /**
   * The full URL of this request
   */
  url: string;
  /**
   * The eTLD+1 for this request. For example, if the tracker `https://google.com/a.js` was loaded in the page `https://example.com`, then the eTLD+1 for this request would be `google.com`
   */
  eTLDplus1?: string;
  /**
   * The full page URL where this request was observed
   */
  pageUrl: string;
  /**
   * The state of the request - 'blocked', or 'allowed' with a given reason
   *
   * @example
   *
   * When blocked, there're no additional properties (yet):
   *
   * ```json
   * { "blocked": {} }
   * ```
   *
   * When allowed, 'reason' is always present and will be one of the keys defined in {@link StateAllowed}
   *
   * ```json
   * {
   *   "allowed": {
   *     "reason": "adClickAttribution"
   *   }
   * }
   * ```
   *
   *
   */
  state: StateBlocked | StateAllowed;
  /**
   * The **display name** of the entity this request belongs to, for example: `Amazon.com`, or `Google`. **NOT** `Google LLC` <- that would be the `ownerName`
   */
  entityName?: string;
  /**
   * The category to display for this request. For example, 'Advertising'. Note: the Tracker Radar may assign multiple categories, but we would only show one of them. Please refer to existing implementations to see the order in which you should choose.
   */
  category?: string;
  /**
   * The prevalence of the associated entity - if one is known. For example, `10.2` or `82.8`
   */
  prevalence?: number;
  /**
   * The name of the company this requests belongs to, if one is known. For example `Google LLC`
   */
  ownerName?: string;
}
/**
 * When present, indicates that this request was blocked
 */
export interface StateBlocked {
  blocked: {
    [k: string]: unknown;
  };
}
/**
 * When present, indicates that this request was allowed to load. The `reason` key should indicate why it was allowed
 */
export interface StateAllowed {
  allowed: {
    /**
     * - {@link ProtectionsDisabledReason}
     * - {@link OwnedByFirstPartyReason}
     * - {@link RuleExceptionReason}
     * - {@link AdClickAttributionReason}
     * - {@link OtherThirdPartyRequestReason}
     */
    reason:
      | ProtectionsDisabledReason
      | OwnedByFirstPartyReason
      | RuleExceptionReason
      | AdClickAttributionReason
      | OtherThirdPartyRequestReason;
  };
}
/**
 * This describes the data that the extension needs to provide
 */
export interface ExtensionMessageGetPrivacyDashboardData {
  messageType: "getPrivacyDashboardData";
  options: {
    /**
     * If we send a tabId, it's likely because the dashboard was loaded for debugging. But if we send `null` we expect the extension to figure out the correct tab
     */
    tabId?: number | null;
  };
}
/**
 * This describes the data that the extension needs to provide
 */
export interface GetPrivacyDashboardData {
  requestData: RequestData;
  emailProtectionUserData?: EmailProtectionUserData;
  tab: Tab;
  fireButton?: FireButton;
}
export interface EmailProtectionUserData {
  nextAlias: string;
}
export interface Tab {
  /**
   * Optional Tab ID - mostly used in the extensions
   */
  id?: number;
  url: string;
  upgradedHttps: boolean;
  phishing: boolean;
  protections: ProtectionsStatus;
  localeSettings?: LocaleSettings;
  parentEntity?: ParentEntity;
  /**
   * Provide this if the current tab is a domain that we cannot provide regular dashboard features for (like new tab, about://blank etc)
   */
  specialDomainName?: string;
}
/**
 * This provides information about privacy features and current status of protections for the current site.
 */
export interface ProtectionsStatus {
  /**
   * Does the current domain have an entry in `unprotectedTemporary` in remote/privacy config
   */
  unprotectedTemporary: boolean;
  /**
   * Is `contentBlocking` enabled for this domain in remote/privacy config?
   */
  enabledFeatures: string[];
  /**
   * Is the current domain in the user's `allowlist`
   */
  allowlisted: boolean;
  /**
   * Is the current domain in the user's `denylist` - meaning, did the user override our remote/privacy config?
   */
  denylisted: boolean;
}
/**
 * This describes the payload required to set the locale
 */
export interface LocaleSettings {
  /**
   * 2 letters, such as `pl`, `en`, `fr` etc
   */
  locale: string;
}
/**
 * This fields required to describe a 'parent entity'
 */
export interface ParentEntity {
  displayName: string;
  prevalence: number;
}
export interface FireButton {
  enabled: boolean;
}
export interface Search {
  term: string;
}
/**
 * The data sent in a Breakage Report
 */
export interface BreakageReport {
  request?: BreakageReportRequest;
  response?: {
    [k: string]: unknown;
  };
}
export interface BreakageReportRequest {
  /**
   * Chosen from the dropdown list
   */
  category?: string;
  /**
   * The users' message
   */
  description?: string;
}
export interface SetListOptions {
  lists: {
    /**
     * `allowlist` if this domain should be added/removed from the users allowlist. `denylist` if this domain should be added/removed from the users denylist (remote overrides)
     */
    list: "allowlisted" | "denylisted";
    domain: string;
    value: boolean;
  }[];
}
/**
 * This message is used by Windows to indicate when the visibility of the Dashboard should change
 */
export interface WindowsIncomingVisibility {
  Feature: "PrivacyDashboard";
  Name: "VisibilityChanged";
  Data: {
    isVisible: boolean;
  };
}
/**
 * This message contains the Windows View Model that's used to provide all data to the Dashboard
 */
export interface WindowsIncomingViewModel {
  Feature: "PrivacyDashboard";
  Name: "ViewModelUpdated";
  Data: WindowsViewModel;
}
/**
 * This describes the required data for the dashboard
 */
export interface WindowsViewModel {
  protections: ProtectionsStatus;
  rawRequestData: RequestData;
  tabUrl: string;
  upgradedHttps: boolean;
  phishing?: boolean;
  parentEntity?: ParentEntity;
  permissions?: unknown[];
  certificates?: unknown[];
  cookiePromptManagementStatus?: CookiePromptManagementStatus;
}
/**
 * This describes the fields needed for the dashboard to display the status of CPM (Cookie Prompt Management)
 */
export interface CookiePromptManagementStatus {
  /**
   * A required boolean flag to indicate if consent was managed automatically by the browser
   */
  consentManaged: boolean;
  /**
   * An optional boolean to indicate that the cookie popup was hidden cosmetically, without active tracking rejection
   */
  cosmetic?: boolean;
  /**
   * An optional boolean flag to indicate if our attempts to optout automatically failed. Not currently used in the dashboard
   */
  optoutFailed?: boolean;
  /**
   * An optional boolean flag to indicate if the self-test verification failed. Not currently used in the dashboard
   */
  selftestFailed?: boolean;
  /**
   * An optional boolean to indicate whether the platform supports showing the secondary screen with a link to settings
   */
  configurable?: boolean;
}
export interface RefreshAliasResponse {
  personalAddress: string;
  privateAddress: string;
}
export interface ExtensionMessageSetListOptions {
  messageType: "setLists";
  options: SetListOptions;
}
/**
 * This describes settings for the FireButton in the dashboard UI
 */
export interface FireButtonData {
  options: FireOption[];
}
export interface FireOption {
  name: "CurrentSite" | "LastHour" | "Last24Hour" | "Last7days" | "Last4Weeks" | "AllTime";
  selected?: boolean;
  options: {
    since?: number;
    origins?: string[];
  };
  descriptionStats: {
    clearHistory: boolean;
    site?: string;
    duration: "hour" | "day" | "week" | "month" | "all";
    openTabs: number;
    cookies: number;
    pinnedTabs: number;
  };
  [k: string]: unknown;
}
/**
 * This describes the payload for feature settings
 */
export interface RemoteFeatureSettings {
  primaryScreen?: PrimaryScreen;
}
export interface PrimaryScreen {
  /**
   * A string to represent different screen layouts
   */
  layout: "default" | "highlighted-protections-toggle";
}
export interface SetProtectionParams {
  isProtected: boolean;
  eventOrigin: EventOrigin;
}
export interface EventOrigin {
  screen: ScreenKind;
}
/**
 * <details>
 * <summary>Show example JSON</summary>
 *
 * ```json
 * [[include:toggle-report-screen.json]]
 * ```
 * </details>
 */
export interface ToggleReportScreen {
  /**
   * The line-items to show to the user for indicating what data the report will send to DuckDuckGo
   */
  data: ToggleReportScreenDataItem[];
}
export interface ToggleReportScreenDataItem {
  id: DataItemId;
  additional?: SiteUrlAdditionalData;
}
export interface SiteUrlAdditionalData {
  url: string;
}
export interface CloseMessageParams {
  eventOrigin: EventOrigin;
}

