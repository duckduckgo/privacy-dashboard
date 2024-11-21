import { expect } from '@playwright/test';
import { installAndroidMocks, installWebkitMocks, installWindowsMocks } from './helpers';
import { z } from 'zod';

export class Mocks {
    page;
    platform;
    /**
     * @param {import("@playwright/test").Page} page
     * @param {import("../shared/js/ui/platform-features.mjs").Platform} platform
     */
    constructor(page, platform) {
        this.page = page;
        this.platform = platform;
    }

    /**
     * @returns {Promise<void|*|string>}
     */
    async install() {
        switch (this.platform.name) {
            case 'android':
                return installAndroidMocks(this.page);
            case 'ios':
            case 'macos':
                return installWebkitMocks(this.page);
            case 'windows':
                return installWindowsMocks(this.page);
            case 'browser':
                return Promise.resolve();
            default: {
                /** @type {never} */
                const n = this.platform.name;
                throw new Error('unreachable ' + n);
            }
        }
    }

    /**
     * @param {{names: string[]}} [opts]
     * @returns {Promise<any[]>}
     */
    async outgoing(opts = { names: [] }) {
        await this.page.waitForFunction(
            (opts) => {
                const current = window.__playwright.mocks.outgoing;
                if (opts.names.length) {
                    const target = opts.names.length;
                    const messages = current.filter(([name]) => opts.names.includes(name));
                    if (messages.length >= target) return true;
                    return false;
                }
                if (current.length > 0) return true;
                return false;
            },
            opts,
            { timeout: 5000 }
        );

        const values = await this.page.evaluate(() => window.__playwright.mocks.outgoing);

        if (Array.isArray(opts.names) && opts.names.length > 0) {
            return values.filter(([name]) => opts.names.includes(name));
        }
        return values;
    }

    async calledForShowBreakageForm() {
        // only on ios/android
        if (!['android', 'ios'].includes(this.platform.name)) return;

        const calls = await this.outgoing();
        if (this.platform.name === 'android') {
            expect(calls).toMatchObject([['showBreakageForm', undefined]]);
            return;
        }
        if (this.platform.name === 'ios') {
            expect(calls).toMatchObject([['privacyDashboardShowReportBrokenSite', {}]]);
        }
    }

    async calledForSendToggleReport() {
        if (this.platform.name === 'android') {
            const calls = await this.outgoing({ names: ['sendToggleReport'] });
            expect(calls).toMatchObject([['sendToggleReport', undefined]]);
            return;
        }

        if (this.platform.name === 'browser') {
            const calls = await this.outgoing({ names: ['sendToggleReport'] });
            expect(calls).toMatchObject([
                [
                    'sendToggleReport',
                    {
                        messageType: 'sendToggleReport',
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({
                names: ['SendToggleBreakageReport'],
            });
            expect(calls).toMatchObject([
                [
                    'SendToggleBreakageReport',
                    {
                        Feature: 'PrivacyDashboard',
                        Name: 'SendToggleBreakageReport',
                        Data: {},
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'macos' || this.platform.name === 'ios') {
            const out = await this.outgoing({
                names: ['privacyDashboardSendToggleReport'],
            });
            expect(out).toMatchObject([['privacyDashboardSendToggleReport', {}]]);
            return;
        }

        throw new Error('unreachable. mockCalledForSendToggleReport must be handled');
    }

    async calledForRejectToggleReport() {
        if (this.platform.name === 'android') {
            const calls = await this.outgoing({ names: ['rejectToggleReport'] });
            expect(calls).toMatchObject([['rejectToggleReport', undefined]]);
            return;
        }

        if (this.platform.name === 'browser') {
            const calls = await this.outgoing({ names: ['rejectToggleReport'] });
            expect(calls).toMatchObject([
                [
                    'rejectToggleReport',
                    {
                        messageType: 'rejectToggleReport',
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({
                names: ['RejectToggleBreakageReport'],
            });
            expect(calls).toMatchObject([
                [
                    'RejectToggleBreakageReport',
                    {
                        Feature: 'PrivacyDashboard',
                        Name: 'RejectToggleBreakageReport',
                        Data: {},
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'macos' || this.platform.name === 'ios') {
            const out = await this.outgoing({
                names: ['privacyDashboardRejectToggleReport'],
            });
            expect(out).toMatchObject([['privacyDashboardRejectToggleReport', {}]]);
            return;
        }

        throw new Error('unreachable. mockCalledForRejectToggleReport must be handled');
    }

    async calledForSeeWhatsSent() {
        if (this.platform.name === 'android') {
            const calls = await this.outgoing({ names: ['seeWhatIsSent'] });
            expect(calls).toMatchObject([['seeWhatIsSent', undefined]]);
            return;
        }

        if (this.platform.name === 'browser') {
            const calls = await this.outgoing({ names: ['seeWhatIsSent'] });
            expect(calls).toMatchObject([
                [
                    'seeWhatIsSent',
                    {
                        messageType: 'seeWhatIsSent',
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({
                names: ['SeeWhatIsSent'],
            });
            expect(calls).toMatchObject([
                [
                    'SeeWhatIsSent',
                    {
                        Feature: 'PrivacyDashboard',
                        Name: 'SeeWhatIsSent',
                        Data: {},
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'macos' || this.platform.name === 'ios') {
            const out = await this.outgoing({
                names: ['privacyDashboardSeeWhatIsSent'],
            });
            expect(out).toMatchObject([['privacyDashboardSeeWhatIsSent', {}]]);
            return;
        }

        throw new Error('unreachable. mockCalledForSeeWhatsSent must be handled');
    }

    /**
     * @param {object} params
     * @param {import('../schema/__generated__/schema.types').EventOrigin['screen']} params.screen
     * @param {import('../schema/__generated__/schema.types').TelemetrySpan['attributes']} params.attributes
     * @return {Promise<void>}
     */
    async didSendTelemetry({ screen, attributes }) {
        const calls = await this.outgoing({
            names: ['privacyDashboardTelemetrySpan'],
        });
        const filtered = calls.find(([_name, payload]) => payload.attributes?.name === attributes.name);
        expect(filtered).toMatchObject([
            'privacyDashboardTelemetrySpan',
            {
                eventOrigin: {
                    screen,
                },
                attributes,
            },
        ]);
    }

    async calledForNativeFeedback() {
        if (this.platform.name === 'browser') return;

        if (this.platform.name === 'android') {
            const out = await this.outgoing({ names: ['showNativeFeedback'] });
            expect(out).toMatchObject([['showNativeFeedback', undefined]]);
            return;
        }

        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({
                names: ['ShowNativeFeedback'],
            });
            expect(calls).toMatchObject([
                [
                    'ShowNativeFeedback',
                    {
                        Feature: 'PrivacyDashboard',
                        Name: 'ShowNativeFeedback',
                        Data: {},
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'macos' || this.platform.name === 'ios') {
            const calls = await this.outgoing({
                names: ['privacyDashboardShowNativeFeedback'],
            });
            expect(calls).toMatchObject([['privacyDashboardShowNativeFeedback', {}]]);
            return;
        }

        throw new Error('unreachable. mockCalledForNativeFeedback must be handled');
    }

    async calledForSubmitBreakageForm({ category = '', description = '' }) {
        if (this.platform.name === 'android') {
            const out = await this.outgoing({ names: ['submitBrokenSiteReport'] });
            expect(out).toMatchObject([['submitBrokenSiteReport', JSON.stringify({ category, description })]]);
            return;
        }

        if (this.platform.name === 'browser') {
            const out = await this.outgoing({ names: ['submitBrokenSiteReport'] });
            expect(out).toMatchObject([
                [
                    'submitBrokenSiteReport',
                    {
                        messageType: 'submitBrokenSiteReport',
                        options: {
                            category,
                            description,
                        },
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({
                names: ['SubmitBrokenSiteReport'],
            });
            expect(calls).toMatchObject([
                [
                    'SubmitBrokenSiteReport',
                    {
                        Feature: 'PrivacyDashboard',
                        Name: 'SubmitBrokenSiteReport',
                        Data: {
                            category,
                            description,
                        },
                    },
                ],
            ]);
            return;
        }

        if (this.platform.name === 'macos' || this.platform.name === 'ios') {
            const out = await this.outgoing({
                names: ['privacyDashboardSubmitBrokenSiteReport'],
            });
            expect(out).toMatchObject([['privacyDashboardSubmitBrokenSiteReport', { category, description }]]);
            return;
        }

        throw new Error('unreachable. mockCalledForSubmitBreakageForm must be handled');
    }

    async calledForAboutLink() {
        if (this.platform.name === 'android') {
            const calls = await this.outgoing({ names: ['openInNewTab'] });
            expect(calls).toMatchObject([
                [
                    'openInNewTab',
                    JSON.stringify({
                        url: 'https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/',
                    }),
                ],
            ]);
            return;
        }
        if (this.platform.name === 'macos' || this.platform.name === 'ios') {
            const calls = await this.outgoing({
                names: ['privacyDashboardOpenUrlInNewTab'],
            });
            expect(calls).toMatchObject([
                [
                    'privacyDashboardOpenUrlInNewTab',
                    {
                        url: 'https://help.duckduckgo.com/duckduckgo-help-pages/privacy/web-tracking-protections/',
                    },
                ],
            ]);
            return;
        }
        throw new Error('unreachable. mockCalledForAboutLink must be handled');
    }

    async calledForInitialExtensionMessage() {
        const calls = await this.outgoing();
        z.array(
            z.tuple([
                z.literal('getPrivacyDashboardData'),
                z
                    .object({
                        messageType: z.literal('getPrivacyDashboardData'),
                        options: z.object({ tabId: z.null() }),
                        id: z.number(),
                    })
                    .strict(),
            ])
        )
            .length(1)
            .parse(calls);
    }

    async calledForOptions() {
        if (this.platform.name === 'browser') {
            const calls = await this.outgoing({ names: ['openOptions'] });
            expect(calls).toMatchObject([
                [
                    'openOptions',
                    {
                        messageType: 'openOptions',
                    },
                ],
            ]);
            return;
        }
        throw new Error('unreachable: must handle `mockCalledForSearch` on platform ' + this.platform.name);
    }

    /**
     * @param {import('../schema/__generated__/schema.types').EventOrigin} eventOrigin
     * @return {Promise<void>}
     */
    async calledForClose(eventOrigin = { screen: 'primaryScreen' }) {
        if (this.platform.name === 'android') {
            const calls = await this.outgoing({ names: ['close'] });
            expect(calls).toMatchObject([['close', undefined]]);
            return;
        }
        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({ names: ['CloseCommand'] });
            expect(calls).toMatchObject([
                [
                    'CloseCommand',
                    {
                        Data: {
                            eventOrigin,
                        },
                        Feature: 'PrivacyDashboard',
                        Name: 'CloseCommand',
                    },
                ],
            ]);
            return;
        }
        if (this.platform.name === 'ios' || this.platform.name === 'macos') {
            const calls = await this.outgoing({ names: ['privacyDashboardClose'] });
            expect(calls).toMatchObject([
                [
                    'privacyDashboardClose',
                    {
                        eventOrigin,
                    },
                ],
            ]);
            return;
        }
        throw new Error('unreachable. mockCalledForClose must be handled');
    }

    async calledForInitialHeight() {
        await this.page.locator('"No Tracking Requests Found"').click();

        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({ names: ['SetSize'] });
            expect(calls.length).toBeGreaterThanOrEqual(2);
            return;
        }

        if (this.platform.name === 'macos') {
            const calls = await this.outgoing({ names: ['privacyDashboardSetSize'] });
            expect(calls.length).toBeGreaterThanOrEqual(1);
            return;
        }

        throw new Error('unreachable. sendsInitialHeight must be handled');
    }

    /**
     * @param {"protections-off" | "protections-on" | "protections-on-override"} kind
     * @param {import('../schema/__generated__/schema.types').EventOrigin} eventOrigin
     * @returns {Promise<void>}
     */
    async calledForToggleAllowList(kind = 'protections-off', eventOrigin = { screen: 'primaryScreen' }) {
        if (this.platform.name === 'android') {
            const calls = await this.outgoing({ names: ['toggleAllowlist'] });
            expect(calls).toMatchObject([
                [
                    'toggleAllowlist',
                    JSON.stringify({
                        eventOrigin,
                        isProtected: false,
                    }),
                ],
            ]);
            return;
        }
        if (this.platform.name === 'windows') {
            const calls = await this.outgoing({ names: ['AddToAllowListCommand'] });
            expect(calls).toMatchObject([
                [
                    'AddToAllowListCommand',
                    {
                        Feature: 'PrivacyDashboard',
                        Name: 'AddToAllowListCommand',
                        Data: { eventOrigin },
                    },
                ],
            ]);
            return;
        }
        if (this.platform.name === 'macos' || this.platform.name === 'ios') {
            const calls = await this.outgoing({ names: ['privacyDashboardSetProtection'] });
            expect(calls).toMatchObject([
                [
                    'privacyDashboardSetProtection',
                    {
                        eventOrigin,
                        isProtected: false,
                    },
                ],
            ]);
            return;
        }
        if (this.platform.name === 'browser') {
            const calls = await this.outgoing({ names: ['setLists'] });
            const expected = {
                'protections-off': [
                    { list: 'denylisted', domain: 'example.com', value: false },
                    { list: 'allowlisted', domain: 'example.com', value: true },
                ],
                'protections-on': [
                    { list: 'denylisted', domain: 'example.com', value: false },
                    { list: 'allowlisted', domain: 'example.com', value: false },
                ],
                'protections-on-override': [{ list: 'denylisted', domain: 'example.com', value: true }],
            };
            expect(calls).toMatchObject([
                [
                    'setLists',
                    {
                        messageType: 'setLists',
                        options: {
                            lists: expected[kind],
                        },
                    },
                ],
            ]);
            return;
        }
        throw new Error('unreachable. mockCalledForAboutLink must be handled');
    }

    async calledForSearch(term) {
        if (this.platform.name === 'browser') {
            const calls = await this.outgoing({ names: ['search'] });
            expect(calls).toMatchObject([
                [
                    'search',
                    {
                        messageType: 'search',
                        options: {
                            term,
                        },
                    },
                ],
            ]);
            return;
        }
        throw new Error('unreachable: must handle `mockCalledForSearch` on platform ' + this.platform.name);
    }

    async calledForOpenSettings() {
        /**
         * @type {Record<import('../shared/js/ui/platform-features.mjs').Platform['name'], any>}
         */
        const implementations = {
            windows: async () => {
                const calls = await this.outgoing({ names: ['OpenSettings'] });
                expect(calls).toMatchObject([
                    [
                        'OpenSettings',
                        {
                            Feature: 'PrivacyDashboard',
                            Name: 'OpenSettings',
                            Data: { target: 'cpm' },
                        },
                    ],
                ]);
            },
            ios: async () => {
                const calls = await this.outgoing({ names: ['privacyDashboardOpenSettings'] });
                expect(calls).toMatchObject([['privacyDashboardOpenSettings', { target: 'cpm' }]]);
            },
            macos: async () => {
                const calls = await this.outgoing({ names: ['privacyDashboardOpenSettings'] });
                expect(calls).toMatchObject([['privacyDashboardOpenSettings', { target: 'cpm' }]]);
            },
            android: async () => {
                const calls = await this.outgoing({ names: ['openSettings'] });
                expect(calls).toMatchObject([['openSettings', JSON.stringify({ target: 'cpm' })]]);
            },
            browser: undefined,
        };
        const impl = implementations[this.platform.name];
        if (!impl) throw new Error('calledForOpenSettings not implemented for ' + this.platform.name);
        await impl();
    }

    /**
     * @param {object} params
     * @param {"camera"} params.permission
     * @param {"grant"} params.value
     * @return {Promise<void>}
     */
    async calledForSettingPermissions({ permission, value }) {
        /**
         * @type {Record<import('../shared/js/ui/platform-features.mjs').Platform['name'], any>}
         */
        const implementations = {
            windows: async () => {
                const calls = await this.outgoing({ names: ['SetPermissionCommand'] });
                expect(calls).toMatchObject([
                    [
                        'SetPermissionCommand',
                        {
                            Feature: 'PrivacyDashboard',
                            Name: 'SetPermissionCommand',
                            Data: {
                                permission,
                                value,
                            },
                        },
                    ],
                ]);
            },
            macos: async () => {
                const calls = await this.outgoing({ names: ['privacyDashboardSetPermission'] });
                expect(calls).toMatchObject([
                    [
                        'privacyDashboardSetPermission',
                        {
                            permission,
                            value,
                        },
                    ],
                ]);
            },
            ios: undefined,
            android: undefined,
            browser: undefined,
        };
        const impl = implementations[this.platform.name];
        if (!impl) throw new Error('calledForOpenSettings not implemented for ' + this.platform.name);
        await impl();
    }
}
