import { test } from '@playwright/test';
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures';
import { DashboardPage } from './DashboardPage';
import { settingPermissions, toggleFlows } from './utils/common-flows';

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.windows(page);
        await dash.addState([testDataStates.protectionsOn]);
        await dash.showsPrimaryScreen();
    });
});

test.describe('breakage form', () => {
    test('shows breakage form on category selection screen only', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'breakageForm' });
        await dash.addState([testDataStates.google]);
        await dash.showsCategoryTypeSelection();
        await dash.showsOnlyCloseButton();
    });

    test('shows native feedback screen', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'breakageForm' });
        await dash.addState([testDataStates.google]);
        await dash.showsCategoryTypeSelection();
        await dash.showsNativeFeedback();
        await dash.showsOnlyCloseButton();
    });

    test('navigates through categories to breakage form', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, {
            screen: 'breakageForm',
            randomisedCategories: 'false',
        });
        await dash.addState([testDataStates.google]);
        await dash.screenshot('category-type-selection.png');
        await dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await dash.screenshot('category-selection.png');
        await dash.selectsCategory('Site layout broken', 'layout');
        await dash.breakageFormIsVisible();
        await dash.descriptionPromptIsVisible();
        await dash.screenshot('screen-breakage-form.png');
        await dash.submitFeedbackForm();
        await dash.showsBreakageFormSuccessScreen();
        await dash.mocks.calledForSubmitBreakageForm({ category: 'layout', description: '' });
    });

    test('hides description prompt on "dislike" category', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, {
            screen: 'breakageForm',
            randomisedCategories: 'false',
            platform: 'macos',
        });
        await dash.addState([testDataStates.google]);
        await dash.selectsCategoryType('I dislike the content on this site', 'dislike');
        await dash.breakageFormIsVisible('I dislike the content');
        await dash.descriptionPromptIsNotVisible();
        await dash.screenshot('category-type-dislike.png');
    });
    
    test('skips to breakage form when disliked', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'breakageForm' });
        await dash.addState([testDataStates.google]);
        await dash.showsCategoryTypeSelection();
        await dash.skipsToBreakageFormWhenDisliked();
    });

    test('shows empty description warning', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'breakageForm' });
        await dash.addState([testDataStates.google]);
        await dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await dash.selectsCategory('Something else', 'other');
        await dash.breakageFormIsVisible();
        await dash.submitEmptyFeedbackForm();
        await dash.emptyDescriptionWarningIsVisible();
        await dash.screenshot('screen-breakage-form-empty-description.png');
    });

    test('submits form with description', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'breakageForm' });
        await dash.addState([testDataStates.google]);
        await dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await dash.selectsCategory('Something else', 'other');
        await dash.breakageFormIsVisible();
        await dash.submitOtherFeedbackFormWithDescription('something happened');
        await dash.screenshot('screen-breakage-form-success.png');
        await dash.clickingSuccessScreenClosesBreakageFormScreen();
    });
});

test.describe('opens directly to feedback form', () => {
    test('shows category from previous interaction', async ({ page }) => {
        const dash = await DashboardPage.windows(page, { screen: 'breakageFormFinalStep', category: 'videos' });
        await dash.reducedMotion();
        await dash.addState([testDataStates.google]);
        await dash.submitsVideoFeedbackFormWhenOpenedDirectly();
    });
    test('requires description when category is "Other"', async ({ page }) => {
        const dash = await DashboardPage.windows(page, { screen: 'breakageFormFinalStep', category: 'other' });
        await dash.reducedMotion();
        await dash.addState([testDataStates.google]);
        await dash.submitsOtherFeedbackFormWhenOpenedDirectly();
    });
});

test.describe('stack based router', () => {
    test('goes back and forward in categorySelection flow', async ({ page }) => {
        const dash = await DashboardPage.browser(page, testDataStates.google);
        // await dash.reducedMotion(); // TODO: Removed because back button was going back two steps rather than one
        await dash.clicksWebsiteNotWorking();
        await dash.nav.goesBackToPrimaryScreenFromBreakageScreen();
    });
    test('goes back and forward generally', async ({ page }) => {
        const dash = await DashboardPage.windows(page);
        await dash.reducedMotion();
        await dash.addState([testDataStates.google]);
        await dash.clicksWebsiteNotWorking();
        await dash.showsCategoryTypeSelection();

        // needed to allow the router to settle
        // playwright is too fast here and is doing something a user never could
        await page.waitForTimeout(100);
        await page.goBack();
        await dash.showsPrimaryScreen();

        // same as previous wait point
        await page.waitForTimeout(100);
        await page.goForward();
        await dash.showsCategoryTypeSelection();
    });
});

test.describe('toggle report', () => {
    test('shows toggle report when opened from menu', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'toggleReport', opener: 'menu' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.screenshot('screen-toggle-report-menu.png');
    });
    test('shows toggle report when opened from dashboard', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'toggleReport', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.screenshot('screen-toggle-report-dashboard.png');
    });
    test('sends toggle report', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'toggleReport', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.sendToggleReport();

        // this is macOS specific:
        await dash.showsSuccessScreen();
        await dash.screenshot('screen-toggle-report-sent.png');
        await dash.clickingSuccessScreenClosesDashboard();
    });
    test('rejects toggle report', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'toggleReport', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.rejectToggleReport();
    });
    test('shows information', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.windows(page, { screen: 'toggleReport', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.showsInformation();
        await dash.mocks.calledForSeeWhatsSent();
        await dash.screenshot('screen-toggle-report-show.png');
    });
});

test.describe('Protections toggle', () => {
    toggleFlows((page) => DashboardPage.windows(page));
});

test.describe('permissions', () => {
    settingPermissions((page) => DashboardPage.windows(page));
});

test('invalid certificate shows as insecure', { tag: '@screenshots' }, async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.windows(page);
    await dash.addState([testDataStates['https-with-invalid-certificate']]);
    await dash.screenshot('invalid-cert.png');
    await dash.hasInvalidCertText();
    await dash.viewConnection();
    await dash.screenshot('invalid-detail.png');
    await dash.showsInvalidCertDetail();
});

test('upgraded requests without certs always show as secure', { tag: '@screenshots' }, async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.windows(page);
    await dash.addState([testDataStates['upgraded+secure+without-certs']]);
    await dash.screenshot('upgraded-missing-certs.png');
});

test('upgraded requests with invalid certs always show as insecure', { tag: '@screenshots' }, async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.windows(page);
    await dash.addState([testDataStates['upgraded-with-invalid-cert']]);
    await dash.screenshot('upgraded-invalid-cert.png');
    await dash.hasInvalidCertText();
    await dash.viewConnection();
    await dash.screenshot('upgraded-invalid-detail.png');
    await dash.showsInvalidCertDetail();
});

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page }) => {
        const dash = await DashboardPage.windows(page);
        await dash.addState([testDataStates.protectionsOn]);
        await dash.mocks.calledForInitialHeight();
    });
});

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.windows(page);
            await dash.addState([testDataStates['consent-managed']]);
            await dash.indicatesCookiesWereManaged();
        });
    });
    test.describe('configurable', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page);
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.indicatesCookiesWereManaged();
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page);
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.viewCookiePromptManagement();
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page);
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.indicatesCookiesWereHidden();
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.windows(page);
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.viewCookiePromptManagement();
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
    });
});

test.describe('windows screenshots', { tag: '@screenshots' }, () => {
    const states = [
        { name: 'ad-attribution', state: testDataStates['ad-attribution'] },
        { name: 'new-entities', state: testDataStates['new-entities'] },
        { name: 'upgraded+secure', state: testDataStates['upgraded+secure'] },
        { name: 'google-off', state: testDataStates['google-off'] },
        { name: 'cnn', state: testDataStates.cnn },
    ];
    test.describe('states', () => {
        for (const { name, state } of states) {
            test(name, async ({ page }) => {
                await page.emulateMedia({ reducedMotion: 'reduce' });
                const dash = await DashboardPage.windows(page);
                await dash.screenshotEachScreenForState(name, state);
            });
        }
    });
});
