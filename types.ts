interface WebkitMessageHandlers {
    privacyDashboardShowNativeFeedback?: any;
    privacyDashboardTelemetrySpan?: any;
    privacyDashboardSubmitBrokenSiteReport?: any;
    privacyDashboardOpenUrlInNewTab?: any;
    privacyDashboardSetSize?: any;
    privacyDashboardShowReportBrokenSite?: any;
    privacyDashboardReportBrokenSiteShown?: any;
    privacyDashboardClose?: any;
    privacyDashboardSetProtection?: {
        postMessage: (params: import('./schema/__generated__/schema.types').SetProtectionParams) => void;
    };
    privacyDashboardOpenSettings?: any;
    privacyDashboardSetPermission?: any;
    privacyDashboardGetToggleReportOptions?: {
        postMessage: (params: any) => void;
    };
    privacyDashboardRejectToggleReport?: {
        postMessage: (params: any) => Promise<void>;
    };
    privacyDashboardSendToggleReport?: {
        postMessage: (params: any) => Promise<void>;
    };
    privacyDashboardSeeWhatIsSent?: {
        postMessage: (params: any) => Promise<void>;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
    __DDG_TEST_DATA: any;
    DDG: any;
    onChangeConsentManaged: (payload: import('./schema/__generated__/schema.types').CookiePromptManagementStatus) => void;
    onChangeParentEntity: any;
    /**
     * @deprecated use window.onChangeRequestData
     */
    onChangeTrackerBlockingData: any;
    onChangeTheme: any;
    onChangeRequestData: (url: string, rawRequestData: import('./schema/__generated__/schema.types').RequestData) => void;
    onChangeLocale: (payload: import('./schema/__generated__/schema.types').LocaleSettings) => void;
    onChangeFeatureSettings: (remoteFeatureSettings: import('./schema/__generated__/schema.types').RemoteFeatureSettings) => void;
    onChangeAllowedPermissions: any;
    onChangeUpgradedHttps: any;
    onChangeProtectionStatus: (protections: import('./shared/js/browser/utils/protections.mjs').Protections) => void;
    onChangeMaliciousSiteStatus?: any;
    onChangeCertificateData: any;
    onIsPendingUpdates: any;

    __ddg_did_load?: string[];

    /**
     * Android's Window API
     * TODO: type these methods
     */
    PrivacyDashboard: {
        toggleAllowlist: (payload: string) => void;
        close: (...args: any[]) => any;
        showBreakageForm: (...args: any[]) => any;
        openInNewTab: (payload: string) => void;
        openSettings: (payload: string) => void;
        submitBrokenSiteReport: (payload: string) => void;
        getToggleReportOptions: () => void;
        sendToggleReport: () => void;
        rejectToggleReport: () => void;
        seeWhatIsSent: () => void;
        showNativeFeedback: () => void;
        reportBrokenSiteShown: () => void;
    };
    /**
     * This is set in Playwright tests
     */
    __ddg_integration_test?: boolean;
    __playwright: {
        listeners?: any[];
        calls: any[];
        messages: any;
        responses: any;
        mocks: {
            outgoing: any[];
            incoming: any[];
        };
        handler?: (message: Record<string, any>) => void;
        onDisconnect?: () => void;
    };
    webkit?: {
        messageHandlers?: WebkitMessageHandlers;
    };
    onGetToggleReportOptionsResponse?: (data: import('./schema/__generated__/schema.types').ToggleReportScreen) => void;
    chrome: {
        webview?: {
            postMessage?: Window['postMessage'];
            addEventListener?: Window['addEventListener'];
            removeEventListener?: Window['removeEventListener'];
        };
    };
}

declare module '*.css' {
    const classMap: Record<string, any>;
    export default classMap;
}
