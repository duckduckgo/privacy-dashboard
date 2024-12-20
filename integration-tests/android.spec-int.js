import { test } from '@playwright/test';
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures';
import { DashboardPage } from './DashboardPage';
import { toggleFlows } from './utils/common-flows';

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates.protectionsOn]);
        await dash.showsPrimaryScreen();
    });
});

test.describe('page data (with trackers)', () => {
    test('should display correct primary screen', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates.cnn]);
        await dash.showsPrimaryScreen();
        await dash.screenshot('primary-cnn.png');
    });
    test('should display correct tracker screen + ripple effect on about link', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates.cnn]);
        await dash.viewTrackerCompanies();
        await dash.aboutLinkHasRipple();
    });
});

test.describe('open external links', () => {
    test('should call android interface for links', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates.protectionsOn]);
        await dash.viewTrackerCompanies();
        await dash.clickAboutLink();
        await dash.mocks.calledForAboutLink();
    });
});

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates['locale-pl']]);
        await dash.hasPolishLinkTextForConnectionInfo();
    });
    test('should load with `fr` locale', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates['locale-fr']]);
        await dash.hasFrenchLinkTextForConnectionInfo();
    });
});

test.describe('Protections toggle', () => {
    toggleFlows((page) => DashboardPage.android(page));
});

test.describe('Breakage form', () => {
    test('displays web breakage form', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates['webBreakageForm-enabled']]);
        await dash.clicksWebsiteNotWorking();
        await dash.submitBreakageForm();
        await dash.mocks.calledForSubmitBreakageForm({ category: '', description: '' });
    });
    test('uses native breakage form', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates['webBreakageForm-disabled']]);
        await dash.clicksWebsiteNotWorking();
        await dash.mocks.calledForShowBreakageForm();
    });
    test('shows breakage form only', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, { screen: 'breakageForm' });
        await dash.addState([testDataStates.google]);
        await dash.screenshot('breakage-form-only.png');
        await dash.breakageFormIsVisible();
        await dash.screenshot('screen-breakage-form.png');
        await dash.showsOnlyBackButton();
    });
    test('shows breakage form without toggle (promptBreakageForm)', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, { screen: 'promptBreakageForm' });
        await dash.addState([testDataStates.google]);
        await dash.promptBreakageFormIsVisible();
        await dash.toggleIsAbsent();
        await dash.screenshot('breakage-form-prompt.png');
    });
    test('uses material web dialog', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, {
            screen: 'breakageForm',
            randomisedCategories: 'false',
        });
        await dash.addState([testDataStates.google]);
        await dash.breakageFormIsVisible();
        await dash.mwd.usesMaterialWebDialog();
    });
    test('android can still use the default select on older webviews', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, {
            screen: 'breakageForm',
            randomisedCategories: 'false',
            // forcing it to 'default' - like an older webview would on android in platform-features.mjs
            breakageFormCategorySelect: 'default',
        });

        await dash.addState([testDataStates.google]);
        await dash.breakageFormIsVisible();
        await dash.mwd.usesTheDefaultSelect();
    });
});

test.describe('opens toggle report', () => {
    test('sends toggle report', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, { screen: 'toggleReport', opener: 'menu' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.screenshot('screen-toggle-report.png');
        await dash.showsOnlyBackButton('toggleReport');
        await dash.sendToggleReport();
    });
    test('back button rejects toggle report', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, { screen: 'toggleReport', opener: 'menu' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.backButtonRejectsToggleReport();
    });
    test('rejects toggle report', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, { screen: 'toggleReport', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.rejectToggleReport();
    });
    test('shows information once', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.android(page, { screen: 'toggleReport', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.showsInformation();
        await dash.cannotHideInformation();
        await dash.screenshot('screen-toggle-report-show.png');
    });
});

test.describe('Close', () => {
    test('pressing close should call native API', async ({ page }) => {
        const dash = await DashboardPage.android(page);
        await dash.addState([testDataStates.protectionsOn]);
        await dash.clickClose();
        await dash.mocks.calledForClose();
    });
});

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.android(page);
            await dash.addState([testDataStates['consent-managed']]);
            await dash.indicatesCookiesWereManaged();
        });
    });
    test.describe('configurable', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.indicatesCookiesWereManaged();
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.viewCookiePromptManagement();
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.indicatesCookiesWereHidden();
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.viewCookiePromptManagement();
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
    });
});

test.describe('Android screenshots', { tag: '@screenshots' }, () => {
    test.describe('states', () => {
        const states = [
            { name: 'ad-attribution', state: testDataStates['ad-attribution'] },
            { name: 'new-entities', state: testDataStates['new-entities'] },
            { name: 'upgraded+secure', state: testDataStates['upgraded+secure'] },
            { name: 'google-off', state: testDataStates['google-off'] },
            { name: 'cnn', state: testDataStates.cnn },
        ];
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                await page.emulateMedia({ reducedMotion: 'reduce' });
                const dash = await DashboardPage.android(page);
                await dash.screenshotEachScreenForState(name, state);
            });
        }
    });

    test.describe('screenshots for alternative layout states', () => {
        const states = [
            { name: 'alternative-layout-exp-1', state: testDataStates['alternative-layout-exp-1'] },
            { name: 'alternative-layout-exp-1-disabled', state: testDataStates['alternative-layout-exp-1-disabled'] },
            { name: 'alternative-layout-exp-1-protections-off', state: testDataStates['alternative-layout-exp-1-protections-off'] },
        ];
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([state]);
                await dash.showsPrimaryScreen();
                await dash.screenshot(`${name}.png`);
            });
        }
    });

    test.describe('screenshots for cookies (non-configurable)', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.android(page);
            await dash.addState([testDataStates['consent-managed']]);
            await dash.indicatesCookiesWereManaged();
            await dash.screenshot('consent-managed.png');
        });
    });

    test.describe('screenshots for cookies (configurable)', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.indicatesCookiesWereManaged();
                await dash.screenshot('consent-managed-configurable.png');
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.viewCookiePromptManagement();
                await dash.screenshot('consent-managed-configurable-secondary.png');
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.indicatesCookiesWereHidden();
                await dash.screenshot('consent-managed-configurable-primary-cosmetic.png');
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.android(page);
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.viewCookiePromptManagement();
                await dash.screenshot('consent-managed-configurable-secondary-cosmetic.png');
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
    });
});
