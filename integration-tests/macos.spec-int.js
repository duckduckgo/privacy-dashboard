import { test } from '@playwright/test';
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures';
import { DashboardPage } from './DashboardPage';
import { settingPermissions, toggleFlows } from './utils/common-flows';

test.describe('initial page data', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        await dash.addState([testDataStates.protectionsOn]);
        await dash.showsPrimaryScreen();
    });
});

test.describe('Protections toggle', () => {
    toggleFlows((page) => DashboardPage.webkit(page, { platform: 'macos' }));
});

test.describe('permissions', () => {
    settingPermissions((page) => DashboardPage.webkit(page, { platform: 'macos' }));
});

test('invalid/missing certificate', { tag: '@screenshots' }, async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.webkit(page, { platform: 'macos' });
    await dash.addState([testDataStates['https-without-certificate']]);
    await dash.screenshot('invalid-cert.png');
    await dash.hasInvalidCertText();
    await dash.viewConnection();
    await dash.screenshot('invalid-detail.png');
    await dash.showsInvalidCertDetail();
});

test.describe('phishing & malware protection', () => {
    test('phishing warning', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        await dash.addState([testDataStates.phishing]);
        await dash.screenshot('phishing-warning.png');
        await dash.hasPhishingIcon();
        await dash.hasPhishingHeadingText();
        await dash.hasPhishingWarningText();
        await dash.hasPhishingStatusText();
        await dash.connectionLinkDoesntShow();
    });

    test('malware warning', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        await dash.addState([testDataStates.malware]);
        await dash.screenshot('malware-warning.png');
        await dash.hasMalwareIcon();
        await dash.hasMalwareHeadingText();
        await dash.hasMalwareWarningText();
        await dash.hasMalwareStatusText();
        await dash.connectionLinkDoesntShow();
    });

    test('shows report as safe link', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        await dash.addState([testDataStates.malware]);
        await dash.clickReportAsSafeLink();
        await dash.mocks.calledForReportAsSafeLink('https://privacy-test-pages.site/security/badware/malware.html');
    });

    test('shows help page link', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        await dash.addState([testDataStates.malware]);
        await dash.clickHelpPageLink();
        await dash.mocks.calledForHelpPagesLink();
    });
});

test('insecure certificate', async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.webkit(page, { platform: 'macos' });
    await dash.addState([testDataStates.insecure]);
    await dash.hasInsecureText();
    await dash.viewConnection();
    await dash.hasInsecureTextDetail();
});

test('allowed first party requests', async ({ page }) => {
    /** @type {DashboardPage} */
    const dash = await DashboardPage.webkit(page, { platform: 'macos' });
    await dash.addState([testDataStates.protectionsOn_allowedFirstParty]);
    await dash.hasAllowedFirstPartyText();
    await dash.hidesTrackerCompaniesLink();
});

test.describe('breakage form', () => {
    test('shows breakage form on category selection screen only', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'macos' });
        await dash.addState([testDataStates.google]);
        await dash.showsCategoryTypeSelection();
        await dash.showsOnlyCloseButton();
    });

    test('shows native feedback screen', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'macos' });
        await dash.addState([testDataStates.google]);
        await dash.showsCategoryTypeSelection();
        await dash.showsNativeFeedback();
        await dash.showsOnlyCloseButton();
    });

    test('navigates through categories to breakage form', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, {
            screen: 'breakageForm',
            randomisedCategories: 'false',
            platform: 'macos',
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
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'macos' });
        await dash.addState([testDataStates.google]);
        await dash.showsCategoryTypeSelection();
        await dash.skipsToBreakageFormWhenDisliked();
    });

    test('shows empty description warning', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'macos' });
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
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'macos' });
        await dash.addState([testDataStates.google]);
        await dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await dash.selectsCategory('Something else', 'other');
        await dash.breakageFormIsVisible();
        await dash.submitOtherFeedbackFormWithDescription('something happened');
        await dash.screenshot('screen-breakage-form-success.png');
        await dash.showsBreakageFormSuccessScreen();
        await dash.clickingSuccessScreenClosesBreakageFormScreen();
    });

    test('goes back to primary screen from success screen', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { platform: 'macos', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.clicksWebsiteNotWorking();
        await dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await dash.selectsCategory('Site layout broken', 'layout');
        await dash.submitFeedbackForm();
        await dash.showsBreakageFormSuccessScreen();
        await dash.nav.goesBackToPrimaryScreenFromSuccessScreen();
    });

    test('hides back button in success screen when invoked from menu', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { platform: 'macos', opener: 'menu' });
        await dash.addState([testDataStates.google]);
        await dash.clicksWebsiteNotWorking();
        await dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await dash.selectsCategory('Site layout broken', 'layout');
        await dash.submitFeedbackForm();
        await dash.showsBreakageFormSuccessScreen();
        await dash.showsOnlyCloseButtonInSubview('breakageFormFinalStep');
    });
});

test.describe('opens directly to feedback form', () => {
    test('shows category from previous interaction', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { screen: 'breakageFormFinalStep', category: 'videos', platform: 'macos' });
        await dash.reducedMotion();
        await dash.addState([testDataStates.google]);
        await dash.submitsVideoFeedbackFormWhenOpenedDirectly();
    });
    test('requires description when category is "Other"', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { screen: 'breakageFormFinalStep', category: 'other', platform: 'macos' });
        await dash.reducedMotion();
        await dash.addState([testDataStates.google]);
        await dash.submitsOtherFeedbackFormWhenOpenedDirectly();
    });
});

test.describe('stack based router', () => {
    test('goes back and forward in categorySelection flow', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        // await dash.reducedMotion(); // TODO: Removed because back button was going back two steps rather than one
        await dash.addState([testDataStates.google]);

        await dash.clicksWebsiteNotWorking();
        await dash.selectsCategoryType('The site is not working as expected', 'notWorking');
        await dash.selectsCategory('Site layout broken', 'layout');
        await dash.nav.goesBackToPrimaryScreenFromBreakageScreen();
    });

    test('goes back and forward generally', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
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
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'menu' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.showsOnlyCloseButton('toggleReport');
        await dash.selectClose('toggleReport');
        await dash.screenshot('screen-toggle-report-menu.png');
        await dash.mocks.calledForClose({ screen: 'toggleReport' });
    });
    test('shows toggle report when opened from dashboard', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.screenshot('screen-toggle-report-dashboard.png');
        await dash.closeButtonIsHidden('toggleReport');
    });
    test('sends toggle report', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' });
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
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.rejectToggleReport();
    });
    test('shows information', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'macos', opener: 'dashboard' });
        await dash.addState([testDataStates.google]);
        await dash.toggleReportIsVisible();
        await dash.showsInformation();
        await dash.mocks.calledForSeeWhatsSent();
        await dash.screenshot('screen-toggle-report-show.png');
    });
});

test.describe('open external links', () => {
    test('should call webkit interface for external links', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        await dash.addState([testDataStates.protectionsOn]);
        await dash.viewTrackerCompanies();
        await dash.clickAboutLink();
        await dash.mocks.calledForAboutLink();
    });
});

test.describe('setting the height', () => {
    test('should send the initial height to native', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { platform: 'macos' });
        await dash.addState([testDataStates.protectionsOn]);
        await dash.mocks.calledForInitialHeight();
    });
});

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' });
            await dash.addState([testDataStates['consent-managed']]);
            await dash.indicatesCookiesWereManaged();
        });
    });
    test.describe('configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' });
            await dash.addState([testDataStates['consent-managed-configurable']]);
            await dash.indicatesCookiesWereManaged();
        });
        test('secondary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' });
            await dash.addState([testDataStates['consent-managed-configurable']]);
            await dash.viewCookiePromptManagement();
            await dash.disableCookiesInSettings();
            await dash.mocks.calledForOpenSettings();
        });
    });
});

test.describe('macos screenshots', { tag: '@screenshots' }, () => {
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
                const dash = await DashboardPage.webkit(page, { platform: 'macos' });
                await dash.screenshotEachScreenForState(name, state);
            });
        }
    });
    test.describe('screenshots for cookies (none-configurable)', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { platform: 'macos' });
            await dash.addState([testDataStates['consent-managed']]);
            await dash.indicatesCookiesWereManaged();
            await dash.screenshot('consent-managed.png');
        });
    });
    test.describe('screenshots for cookies (configurable)', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' });
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.indicatesCookiesWereManaged();
                await dash.screenshot('consent-managed-configurable.png');
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' });
                await dash.addState([testDataStates['consent-managed-configurable']]);
                await dash.viewCookiePromptManagement();
                await dash.screenshot('consent-managed-configurable-secondary.png');
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' });
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.indicatesCookiesWereHidden();
                await dash.screenshot('consent-managed-configurable-primary-cosmetic.png');
            });
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page, { platform: 'macos' });
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']]);
                await dash.viewCookiePromptManagement();
                await dash.screenshot('consent-managed-configurable-secondary-cosmetic.png');
                await dash.disableCookiesInSettings();
                await dash.mocks.calledForOpenSettings();
            });
        });
    });
});
