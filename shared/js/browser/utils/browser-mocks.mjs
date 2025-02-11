import toggleReportScreen from '../../../../schema/__fixtures__/toggle-report-screen.json';
import { createDataStates } from '../../ui/views/tests/generate-data.mjs';
import google from '../../../../schema/__fixtures__/request-data-google.json';
import cnn from '../../../../schema/__fixtures__/request-data-cnn.json';
import { mockAndroidApis, mockBrowserApis, sharedMockDataProvider, webkitMockApis, windowsMockApis } from './communication-mocks.mjs';

/**
 * @param {import('../../ui/platform-features.mjs').Platform} platform
 */
export function installBrowserMocks(platform) {
    console.log('installing...');
    if (window.__playwright) {
        console.log('installing... NOE');
        return () => console.log('❌ mocked already there');
    }
    if (platform.name === 'windows') {
        windowsMockApis();
    } else if (platform.name === 'ios' || platform.name === 'macos') {
        webkitMockApis({
            messages: {
                privacyDashboardGetToggleReportOptions: toggleReportScreen,
            },
        });
    } else if (platform.name === 'android') {
        mockAndroidApis({
            messages: {
                getToggleReportOptions: toggleReportScreen,
            },
        });
    } else if (platform.name === 'browser') {
        mockBrowserApis();
    }

    const testDataStates = createDataStates(/** @type {any} */ (google), /** @type {any} */ (cnn));
    const stateFromUrl = new URLSearchParams(window.location.search).get('state');

    let mock;
    if (stateFromUrl && stateFromUrl in testDataStates) {
        mock = testDataStates[stateFromUrl];
    } else {
        mock = testDataStates.protectionsOn_blocked;
        console.warn('state not found, falling back to default. state: ', 'protectionsOn_blocked', stateFromUrl);
    }

    console.groupCollapsed(`${platform.name} open for more Dashboard States`);
    const urls = Object.keys(testDataStates).map((key) => {
        const clone = new URL(location.href);
        clone.searchParams.set('state', key);
        return clone.href;
    });
    for (const url of urls) {
        console.log(url);
    }
    console.groupEnd();

    const messages = {};

    if (platform.name === 'browser') {
        messages.getBurnOptions = mock.toBurnOptions();
        messages.getPrivacyDashboardData = mock.toExtensionDashboardData();
        messages.getToggleReportOptions = toggleReportScreen;
        messages.getBreakageFormOptions = toggleReportScreen;
    }
    if (platform.name === 'windows') {
        messages.windowsViewModel = mock.toWindowsViewModel();
        messages.GetToggleReportOptions = mock.toWindowsToggleReportOptions(toggleReportScreen);
    }

    return () =>
        sharedMockDataProvider({
            state: mock,
            platform,
            messages,
        });
}
