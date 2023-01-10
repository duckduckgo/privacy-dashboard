/**
 * @module Features
 *
 * @description
 *
 * ## Cookie Prompt Management
 *
 * Enable this feature by providing {@link "Generated Schema Definitions".CookiePromptManagementStatus}
 *
 * An API call will be made if the user clicks 'disable in settings'
 *
 * - **Windows**:
 *   - ViewModel field: {@link "Generated Schema Definitions".WindowsViewModel#cookiePromptManagementStatus}
 *   - API Call: {@link "Windows integration".OpenSettings}
 *
 * - **iOS + macOS**:
 *   - global method call: {@link "macOS integration".onChangeConsentManaged}
 *   - API Call: {@link "macOS integration".privacyDashboardOpenSettings}
 *
 * - **Android**:
 *   - global method call: {@link "Android integration".PrivacyDashboardJavascriptInterface#openSettings}
 *   - API Call: {@link "macOS integration".privacyDashboardOpenSettings}
 */

/**
 * Just a placeholder to enable the docs to be generated
 */
export default function () {}
