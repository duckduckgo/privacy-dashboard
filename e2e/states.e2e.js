import setupPage from './setup-page'

describe('Privacy Dashboard States', () => {
    const { goToState, setupColorScheme, takeScreenshot, clickTrackerListAction, clickConnectionAction, clickBrokenSiteAction } =
        setupPage()

    const sanitize = (value) =>
        value
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')

    describe.each([
        ['Light Appearance', 'light', 'macos'],
        ['Dark Appearance', 'dark', 'macos'],
    ])('%s', (name, colorScheme, platform) => {
        const testScreenshot = () => {
            it('renders correctly', async () => {
                // @ts-ignore
                expect(await takeScreenshot()).toMatchImageSnapshot({
                    customSnapshotIdentifier: ({ currentTestName, counter }) => {
                        const [, testDetails] = currentTestName.split(' Appearance ')
                        const imageName = testDetails.replace('renders correctly', '')
                        return `states/${platform}/${colorScheme}/${sanitize(imageName)}-${counter}`
                    },
                    failureThreshold: 0.005,
                    failureThresholdType: 'percent',
                })
            })
        }

        beforeEach(() => {
            setupColorScheme(colorScheme)
        })

        describe('when there is populated data', () => {
            beforeEach(async () => {
                await goToState({
                    platform,
                    state: '02',
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })

            describe('on tracker list page', () => {
                beforeEach(clickTrackerListAction)
                testScreenshot()
            })

            describe('on connection page', () => {
                beforeEach(clickConnectionAction)
                testScreenshot()
            })

            describe('on report broken site page', () => {
                beforeEach(clickBrokenSiteAction)
                testScreenshot()
            })
        })

        describe('when there are no permissions requested', () => {
            beforeEach(async () => {
                await goToState({
                    platform,
                    state: '02',
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })
        })

        describe('when the site parent entity is a tracker network', () => {
            beforeEach(async () => {
                await goToState({
                    platform,
                    state: 'google',
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })
        })

        describe('when there are no trackers detected', () => {
            beforeEach(async () => {
                await goToState({
                    platform: platform,
                    state: '01',
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })

            describe('on tracker list page', () => {
                beforeEach(clickTrackerListAction)
                testScreenshot()
            })
        })

        describe('when protections are disabled', () => {
            beforeEach(async () => {
                await goToState({
                    platform: platform,
                    state: '02',
                    allowlisted: true,
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })

            describe('on tracker list page', () => {
                beforeEach(clickTrackerListAction)
                testScreenshot()
            })
        })

        describe('when locale is changed to French', () => {
            beforeEach(async () => {
                await goToState({
                    platform: platform,
                    state: '01',
                    locale: 'fr',
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })

            describe('on tracker list page', () => {
                beforeEach(clickTrackerListAction)
                testScreenshot()
            })
        })

        describe('when there is an upgraded connection', () => {
            beforeEach(async () => {
                await goToState({
                    platform: platform,
                    state: 'upgraded',
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })

            describe('on connection page', () => {
                beforeEach(clickConnectionAction)
                testScreenshot()
            })
        })

        describe('when there is an insecure connection', () => {
            beforeEach(async () => {
                await goToState({
                    state: 'insecure',
                    platform,
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })

            describe('on connection page', () => {
                beforeEach(clickConnectionAction)
                testScreenshot()
            })
        })

        describe('when there are cookie consent popups hidden', () => {
            beforeEach(async () => {
                await goToState({
                    platform,
                    state: '01',
                    consentManaged: true,
                })
            })

            describe('on summary page', () => {
                testScreenshot()
            })
        })
    })
})
