interface Window {
  __DDG_TEST_DATA: any
  DDG: any;
  webkit: any;
  onChangeConsentManaged: any;
  onChangeParentEntity: any;
  /**
   * @deprecated use window.onChangeRequestData
   */
  onChangeTrackerBlockingData: any;
  onChangeTheme: any;
  onChangeRequestData: any;
  onChangeLocale: any;
  onChangeAllowedPermissions: any;
  onChangeUpgradedHttps: any;
  onChangeProtectionStatus: any;
  onChangeCertificateData: any;
  onIsPendingUpdates: any;

  /**
   * Android's Window API
   * TODO: type these methods
   */
  PrivacyDashboard: {
    toggleAllowlist: (isProtected) => boolean,
    close: (...args: any[]) => any,
    showBreakageForm: (...args: any[]) => any,
    openInNewTab: (payload: string) => void
  }
  /**
   * Overrides
   */
  environmentOverride?: string
  $: import("jquery");
  __playwright: {
    listeners?: any[],
    calls: any[],
    messages: any,
    mocks: {
      outgoing: any[],
      incoming: any[]
    }
  },
  webkit?: {
    messageHandlers?: {
      privacyDashboardSubmitBrokenSiteReport?: any,
      privacyDashboardOpenUrlInNewTab?: any,
      privacyDashboardSetSize?: any,
      privacyDashboardShowReportBrokenSite?: any,
      privacyDashboardClose?: any
    }
  },
}

interface Window {
  chrome: {
    webview?: {
      postMessage?: Window['postMessage'],
      addEventListener?: Window['addEventListener'],
      removeEventListener?: Window['removeEventListener'],
    }
  }
}

interface Navigator {
  brave?: any
}


