// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
    __DDG_TEST_DATA: any
    DDG: any
    onChangeConsentManaged: (payload: import('./schema/__generated__/schema.types').CookiePromptManagementStatus) => void
    onChangeParentEntity: any
    /**
     * @deprecated use window.onChangeRequestData
     */
    onChangeTrackerBlockingData: any
    onChangeTheme: any
    onChangeRequestData: (url: string, rawRequestData: import('./schema/__generated__/schema.types').RequestData) => void
    onChangeLocale: (payload: import('./schema/__generated__/schema.types').LocaleSettings) => void
    onChangeFeatureSettings: (remoteFeatureSettings: import('./schema/__generated__/schema.types').RemoteFeatureSettings) => void
    onChangeAllowedPermissions: any
    onChangeUpgradedHttps: any
    onChangeProtectionStatus: (protections: import('./shared/js/browser/utils/protections.mjs').Protections) => void
    onChangeCertificateData: any
    onIsPendingUpdates: any

    /**
     * Android's Window API
     * TODO: type these methods
     */
    PrivacyDashboard: {
        toggleAllowlist: (isProtected) => void
        close: (...args: any[]) => any
        showBreakageForm: (...args: any[]) => any
        openInNewTab: (payload: string) => void
        openSettings: (payload: string) => void
    }
    /**
     * Overrides
     */
    $: import('jquery')
    /**
     * This is set in Playwright tests
     */
    __ddg_integration_test?: boolean
    __playwright: {
        listeners?: any[]
        calls: any[]
        messages: any
        responses: any
        mocks: {
            outgoing: any[]
            incoming: any[]
        }
    }
    webkit?: {
        messageHandlers?: {
            privacyDashboardSubmitBrokenSiteReport?: any
            privacyDashboardOpenUrlInNewTab?: any
            privacyDashboardSetSize?: any
            privacyDashboardShowReportBrokenSite?: any
            privacyDashboardClose?: any
            privacyDashboardSetProtection?: {
                postMessage: (params: import('./schema/__generated__/schema.types').SetProtectionParams) => void
            }
            privacyDashboardOpenSettings?: any
            privacyDashboardSetPermission?: any
            privacyDashboardGetSimpleReportOptions?: {
                postMessage: (params: any) => Promise<import('./schema/__generated__/schema.types').SimpleReportScreen>
            }
            privacyDashboardRejectSimpleBreakageReport?: {
                postMessage: (params: any) => Promise<void>
            }
            privacyDashboardSendSimpleBreakageReport?: {
                postMessage: (params: any) => Promise<void>
            }
        }
    }
    chrome: {
        webview?: {
            postMessage?: Window['postMessage']
            addEventListener?: Window['addEventListener']
            removeEventListener?: Window['removeEventListener']
        }
    }
}
