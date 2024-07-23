import { test } from '@playwright/test'
import { testDataStates } from '../shared/js/ui/views/tests/states-with-fixtures'
import { DashboardPage } from './DashboardPage'
import { toggleFlows } from './utils/common-flows'

test.describe('page data (no trackers)', () => {
    test('should fetch initial data', async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.showsPrimaryScreen()
    })
    test('should accept updates when on trackers list screen', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.viewTrackerCompanies()
        await dash.screenshot('tracker-list-before.png')
        await dash.addState([testDataStates.cnn])
        await dash.waitForCompanyName('Google LLC')
        await dash.screenshot('tracker-list-after.png')
    })
    test('should accept updates when on non-trackers list screen', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.viewThirdParties()
        await dash.screenshot('non-tracker-list-before.png')
        await dash.addState([testDataStates.cnn])
        await dash.waitForCompanyName('Google LLC')
        await dash.screenshot('non-tracker-list-after.png')
    })
    test('does not alter the appearance of connection panel', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.viewConnection()
        await dash.screenshot('connection-before.png')
        await dash.addState([testDataStates.cnn])
        await dash.screenshot('connection-before.png')
    })
})

test.describe('page data (with trackers)', () => {
    test('should display correct primary screen', { tag: '@screenshots' }, async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates.cnn])
        await dash.showsPrimaryScreen()
        await dash.screenshot('primary-screen.png')
    })
})

test.describe('Protections toggle', () => {
    toggleFlows((page) => DashboardPage.webkit(page))
})

test.describe('open external links', () => {
    test('should call ios interface for links', async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.reducedMotion()
        await dash.addState([testDataStates.protectionsOn])
        await dash.viewTrackerCompanies()
        await dash.clickAboutLink()
        await dash.mocks.calledForAboutLink()
    })
})

test.describe('localization', () => {
    test('should load with `pl` locale', async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates['locale-pl']])
        await dash.hasPolishLinkTextForConnectionInfo()
    })
    test('should load with `fr` locale', async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates['locale-fr']])
        await dash.hasFrenchLinkTextForConnectionInfo()
    })
})

test.describe('Close', () => {
    test('pressing close should call native API on iOS', async ({ page }) => {
        const dash = await DashboardPage.webkit(page)
        await dash.addState([testDataStates.protectionsOn])
        await dash.clickClose()
        await dash.mocks.calledForClose()
    })
})

test.describe('cookie prompt management', () => {
    test.describe('none-configurable', () => {
        test('primary screen', async ({ page }) => {
            const dash = await DashboardPage.webkit(page)
            await dash.addState([testDataStates['consent-managed']])
            await dash.indicatesCookiesWereManaged()
        })
    })
    test.describe('configurable', () => {
        test.describe('non-cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.indicatesCookiesWereManaged()
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page)
                await dash.addState([testDataStates['consent-managed-configurable']])
                await dash.viewCookiePromptManagement()
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
                await dash.clickCloseFromSecondaryScreen()
                await dash.mocks.calledForClose({ screen: 'consentManaged' })
            })
        })

        test.describe('cosmetic', () => {
            test('primary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.indicatesCookiesWereHidden()
            })
            test('secondary screen', async ({ page }) => {
                const dash = await DashboardPage.webkit(page)
                await dash.addState([testDataStates['consent-managed-configurable-cosmetic']])
                await dash.viewCookiePromptManagement()
                await dash.disableCookiesInSettings()
                await dash.mocks.calledForOpenSettings()
                await dash.clickCloseFromSecondaryScreen()
                await dash.mocks.calledForClose({ screen: 'cookieHidden' })
            })
        })
    })
})

test.describe('opening breakage form', () => {
    test('shows breakage form only', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'breakageForm', platform: 'ios' })
        await dash.addState([testDataStates.google])
        await dash.screenshot('breakage-form-only.png')
        await dash.breakageFormIsVisible()
        await dash.screenshot('screen-breakage-form.png')
        await dash.showsOnlyDoneButton()
    })
    test('shows breakage form without toggle (promptBreakageForm)', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'promptBreakageForm', platform: 'ios' })
        await dash.addState([testDataStates.google])
        await dash.promptBreakageFormIsVisible()
        await dash.toggleIsAbsent()
        await dash.screenshot('breakage-form-prompt.png')
    })
    test('sends toggle report', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'ios', opener: 'menu' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.screenshot('screen-toggle-report.png')
        await dash.showsOnlyDoneButton('toggleReport')
        await dash.sendToggleReport()
    })
    test('rejects toggle report', async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'ios', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.rejectToggleReport()
    })
    test('shows information once', { tag: '@screenshots' }, async ({ page }) => {
        /** @type {DashboardPage} */
        const dash = await DashboardPage.webkit(page, { screen: 'toggleReport', platform: 'ios', opener: 'dashboard' })
        await dash.addState([testDataStates.google])
        await dash.toggleReportIsVisible()
        await dash.showsInformation()
        await dash.cannotHideInformation()
        await dash.screenshot('screen-toggle-report-show.png')
    })
})

test.describe('stack based router', () => {
    test('goes back and forward', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { breakageScreen: 'categorySelection', platform: 'ios' })
        await dash.reducedMotion()
        await dash.addState([testDataStates.google])
        await dash.breakage.showsReportFromPrimaryScreen()
        await dash.nav.goesBackToPrimaryScreen()
    })
})
test.describe('temporary reporting flows', () => {
    test.describe('opens to category selection from menu', () => {
        // sends report after selecting a category
        test('sends report after selecting a category', { tag: '@screenshots' }, async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { screen: 'categorySelection', platform: 'ios' })
            await dash.reducedMotion()
            await dash.addState([testDataStates.google])
            await dash.screenshot('category-selection.png')
            await dash.breakage.selectsCategory("Site blocked or didn't load", 'blocked')
            await dash.screenshot('choice-breakage-form.png')
            await dash.breakage.submitsFormWithCategory('blocked')
        })
        test('forced to enter a description if "something else" is selected', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { screen: 'categorySelection', platform: 'ios' })
            await dash.reducedMotion()
            await dash.addState([testDataStates.google])
            await dash.breakage.selectsCategory('Something else', 'other')
            await dash.breakage.submitsForm()
            await dash.mocks.calledForAlert('missingDescription')
        })
    })
    test('opens to category selection from primary screen when breakageScreen param is present', async ({ page }) => {
        const dash = await DashboardPage.webkit(page, { breakageScreen: 'categorySelection', platform: 'ios' })
        await dash.reducedMotion()
        await dash.addState([testDataStates.google])
        await dash.breakage.showsReportFromPrimaryScreen()
    })

    test.describe('opens to category type selection from menu', () => {
        test('shows category type list', { tag: '@screenshots' }, async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { screen: 'categoryTypeSelection', platform: 'ios' })
            await dash.reducedMotion()
            await dash.addState([testDataStates.google])
            await dash.screenshot('category-type-selection.png')
            await dash.breakage.reportsWhenStartingFromCategoryTypeSelection()
        })
        test('skips to feedback form when "dislike" category type is selected ', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { screen: 'categoryTypeSelection', platform: 'ios' })
            await dash.reducedMotion()
            await dash.addState([testDataStates.google])
            await dash.breakage.skipsToBreakageFormWhenDisliked()
        })
        test('shows general feedback', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { screen: 'categoryTypeSelection', platform: 'ios' })
            await dash.reducedMotion()
            await dash.addState([testDataStates.google])
            await dash.breakage.showsNativeFeedback()
        })
    })

    test.describe('opens directly to feedback form', () => {
        test('shows category from previous interaction', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { screen: 'choiceBreakageForm', category: 'videos', platform: 'ios' })
            await dash.reducedMotion()
            await dash.addState([testDataStates.google])
            await dash.breakage.submitsVideoFeedbackFormWhenOpenedDirectly()
        })
        test('requires description when category is "Other"', async ({ page }) => {
            const dash = await DashboardPage.webkit(page, { screen: 'choiceBreakageForm', category: 'other', platform: 'ios' })
            await dash.reducedMotion()
            await dash.addState([testDataStates.google])
            await dash.breakage.submitsOtherFeedbackFormWhenOpenedDirectly()
        })
    })
})

test.describe('screenshots', { tag: '@screenshots' }, () => {
    const states = [
        { name: '01', state: testDataStates.protectionsOn },
        { name: '02', state: testDataStates.protectionsOn_blocked },
        { name: '03', state: testDataStates.protectionsOn_blocked_allowedTrackers },
        { name: '04', state: testDataStates.protectionsOn_blocked_allowedNonTrackers },
        { name: '05', state: testDataStates.protectionsOn_blocked_allowedTrackers_allowedNonTrackers },
        { name: '06', state: testDataStates.protectionsOn_allowedTrackers },
        { name: '07', state: testDataStates.protectionsOn_allowedNonTrackers },
        { name: '08', state: testDataStates.protectionsOn_allowedTrackers_allowedNonTrackers },
        { name: '09', state: testDataStates.protectionsOff_allowedTrackers },
        { name: '10', state: testDataStates.protectionsOff_allowedNonTrackers },
        { name: '11', state: testDataStates.protectionsOff_allowedTrackers_allowedNonTrackers },
        { name: '12', state: testDataStates.protectionsOn_allowedFirstParty },
        { name: '13', state: testDataStates.protectionsOn_allowedFirstParty_allowedNonTrackers },
        { name: 'ad-attribution', state: testDataStates['ad-attribution'] },
        { name: 'new-entities', state: testDataStates['new-entities'] },
        { name: 'upgraded+secure', state: testDataStates['upgraded+secure'] },
        { name: 'google-off', state: testDataStates['google-off'] },
        { name: 'cnn', state: testDataStates.cnn },
        { name: 'allowlisted', state: testDataStates.allowlisted },
    ]
    for (const { name, state } of states) {
        test(name, async ({ page }) => {
            const dash = await DashboardPage.webkit(page)
            await dash.screenshotEachScreenForState(name, state)
        })
    }
})
