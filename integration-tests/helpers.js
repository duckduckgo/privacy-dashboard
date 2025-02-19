import {
    mockAndroidApis,
    sharedMockDataProvider,
    webkitMockApis,
    windowsMockApis,
} from '../shared/js/browser/utils/communication-mocks.mjs';
import { readFileSync } from 'node:fs';
const toggleReportScreen = JSON.parse(readFileSync('./schema/__fixtures__/toggle-report-screen.json', 'utf8'));

/**
 * @param {import('@playwright/test').Page} page
 */
export function forwardConsole(page) {
    page.on('console', (msg) => {
        const replaced = msg.text().replace(/http:\/\/localhost:3210/g, './build/app');
        console.log('->', msg.type(), replaced);
    });
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {import("../shared/js/ui/views/tests/generate-data.mjs").MockData} state
 * @param {import('../shared/js/ui/platform-features.mjs').Platform} [platform]
 * @returns {Promise<Record<string, any>>}
 */
export async function playTimeline(page, state, platform) {
    platform = platform || { name: 'ios' };
    const messages = {};
    if (platform.name === 'browser') {
        messages.getBurnOptions = state.toBurnOptions();
        messages.getPrivacyDashboardData = state.toExtensionDashboardData();
    }
    if (platform.name === 'windows') {
        messages.windowsViewModel = state.toWindowsViewModel();
        messages.GetToggleReportOptions = state.toWindowsToggleReportOptions(toggleReportScreen);
    }
    if (platform.name === 'ios' || platform.name === 'macos') {
        messages.privacyDashboardGetToggleReportOptions = toggleReportScreen;
    }
    await page.evaluate(sharedMockDataProvider, { state, platform, messages });
    return messages;
}

export async function installAndroidMocks(page) {
    await page.waitForFunction(() => typeof window.onChangeRequestData === 'function');
    return page.evaluate(mockAndroidApis, {
        messages: {
            getToggleReportOptions: toggleReportScreen,
        },
    });
}

/**
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<void>}
 */
export function installWindowsMocks(page) {
    return page.addInitScript(windowsMockApis);
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {Record<string, any>} [_args]
 * @returns {Promise<void>}
 */
export async function installWebkitMocks(page, _args) {
    await page.waitForFunction(() => typeof window.onChangeRequestData === 'function');
    return page.evaluate(webkitMockApis, {
        messages: {
            privacyDashboardGetToggleReportOptions: toggleReportScreen,
        },
    });
}
