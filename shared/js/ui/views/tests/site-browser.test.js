/**
 * @jest-environment jsdom
 */

import generateData from './mock-data/generate-data'
class MockMutationObserver {
    observe () {}
    unobserve () {}
}
// @ts-ignore
window.MutationObserver = MockMutationObserver
jest.mock('../../../browser/$ENVIRONMENT-communication.es6.js', () => ({
    fetch: jest.fn(),
    backgroundMessage: jest.fn(),
    getBackgroundTabData: jest.fn(),
    search: jest.fn(),
    openOptionsPage: jest.fn(),
    openNewTab: jest.fn()
}), { virtual: true })
jest.mock('../../pages/popup.es6.js', () => {})

describe('Browser specific Site view', () => {
    let browserCommunication
    let dataResolve

    beforeEach(() => {
        // Set the scene
        document.body.innerHTML = '<div id="test-container"></div>'

        jest.spyOn(console, 'info').mockImplementation()

        jest.isolateModules(() => {
            // Import the base to set up globals
            require('../../../ui/base/index.es6.js')

            // Mock out communication calls
            const dataPromise = new Promise((resolve) => { dataResolve = resolve })
            // @ts-ignore
            browserCommunication = require('../../../browser/$ENVIRONMENT-communication.es6.js')
            browserCommunication.getBackgroundTabData.mockReturnValue(dataPromise)
            browserCommunication.fetch.mockImplementation((params) => {
                if (params.messageType === 'refreshAlias') {
                    return Promise.resolve({ privateAddress: 'dax222' })
                }
                if (params.messageType === 'getBrowser') {
                    return Promise.resolve('chrome')
                }
                throw new Error('unmocked response')
            })

            // Call the site view and pass in dependencies
            const SiteModel = require('../../models/site.es6.js')
            const siteTemplate = require('../../templates/site.es6')
            /** @type {any} */
            const SiteView = require('../site.es6.js')
            // eslint-disable-next-line no-new
            new SiteView({
                pageView: this,
                model: new SiteModel(),
                appendTo: window.$('#test-container'),
                template: siteTemplate
            })
        })
    })

    describe('when the site is marked as broken', () => {
        beforeEach(() => {
            dataResolve(generateData({
                tab: {
                    permissions: [],
                    protections: {
                        unprotectedTemporary: true,
                        enabledFeatures: ['contentBlocking'],
                        allowlisted: false,
                        denylisted: false
                    }
                }

            }))
        })

        it('renders the correct output', () => {
            expect(document.getElementById('test-container')).toMatchSnapshot()
        })
    })

    describe('when content-blocking has an exception', () => {
        beforeEach(() => {
            dataResolve(generateData({
                tab: {
                    permissions: [],
                    protections: {
                        unprotectedTemporary: false,
                        enabledFeatures: [], // <-- missing 'contentBlocking'
                        allowlisted: false,
                        denylisted: false
                    }
                }
            }))
        })

        it('renders the correct output', () => {
            expect(document.getElementById('test-container')).toMatchSnapshot()
        })
    })

    describe('when the site broken, but the user has overridden that decision', () => {
        beforeEach(() => {
            dataResolve(generateData({
                tab: {
                    permissions: [],
                    protections: {
                        unprotectedTemporary: false,
                        enabledFeatures: [], // <-- missing 'contentBlocking'
                        allowlisted: false,
                        denylisted: true // <-- user overriden
                    }
                }
            }))
        })

        it('renders the correct output', () => {
            expect(document.getElementById('test-container')).toMatchSnapshot()
        })
    })

    describe('email protection: when the user is signed in', () => {
        beforeEach(() => {
            jest.useFakeTimers()
            const data = generateData({
                tab: {
                    permissions: [],
                    emailProtection: {}
                }
            })
            data.emailProtectionUserData = {
                cohort: 'private_beta_dax',
                nextAlias: '123456_next',
                token: '123456',
                userName: 'daxtheduck'
            }
            dataResolve(data)
        })
        afterEach(() => {
            jest.useRealTimers()
        })

        it('renders the correct output with email protection button in place', () => {
            expect(document.getElementById('email-alias-container')).toMatchSnapshot()
        })
        it('copies an alias to clipboard', () => {
            const wrapper = document.getElementById('email-alias-container')
            const button = document.querySelector('[data-test-id="email-alias-button"]')
            button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            expect(wrapper).toMatchSnapshot()
            jest.advanceTimersByTime(2001)
            expect(wrapper).toMatchSnapshot()
        })
    })

    describe('email protection: when the user is NOT signed in', () => {
        beforeEach(() => {
            const data = generateData({
                tab: {
                    permissions: [],
                    emailProtection: {}
                }
            })
            dataResolve(data)
        })

        it('should render the wrapper, but nothing inside', () => {
            expect(document.getElementById('email-alias-container')).toMatchSnapshot()
        })
    })

    describe('search', () => {
        beforeEach(() => {
            const data = generateData({
                tab: {
                    permissions: [],
                    search: {}
                }
            })
            dataResolve(data)
            jest.spyOn(window, 'close').mockImplementation()
        })
        it('should render search + settings button', () => {
            expect(document.getElementById('search-form-container')).toMatchSnapshot()
        })
        it('should open a new tab when searched', () => {
            const form = document.querySelector('[data-test-id="search-form"]')
            const input = form?.querySelector('input')
            if (!(input instanceof HTMLInputElement)) throw new Error('unreachable')
            if (!(form instanceof HTMLFormElement)) throw new Error('unreachable')
            input.value = 'shoes'
            form.submit()
            expect(browserCommunication.search).toHaveBeenCalledWith('shoes')
            expect(window.close).toHaveBeenCalled()
        })
        it('should open settings page', async () => {
            const button = document.querySelector('[aria-label="More options"]')
            button?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

            // allow a tick for the internal 'fetch' call to complete
            await new Promise((resolve) => setTimeout(resolve, 0))
            expect(browserCommunication.openOptionsPage).toHaveBeenCalled()
        })
    })

    describe('CTA screens', () => {
        describe('showing first option', () => {
            beforeEach(() => {
                jest.spyOn(global.Math, 'random').mockImplementation(() => 0.1)
                dataResolve(generateData({
                    tab: {
                        permissions: [],
                        search: {},
                        ctaScreens: {},
                        specialDomainName: 'extensions'
                    }
                }))
            })
            afterEach(() => {
                jest.clearAllMocks()
            })
            it('renders the correct output', () => {
                expect(document.querySelector('[data-test-id="cta-screens"]')).toMatchSnapshot()
            })
        })
        describe('showing second option when email protection is available', () => {
            beforeEach(() => {
                jest.spyOn(global.Math, 'random').mockImplementation(() => 0.6)
                const data = generateData({
                    tab: {
                        permissions: [],
                        search: {},
                        ctaScreens: {},
                        emailProtection: {},
                        specialDomainName: 'extensions'
                    }
                })
                data.emailProtectionUserData = {
                    cohort: 'private_beta_dax',
                    nextAlias: '123456_next',
                    token: '123456',
                    userName: 'daxtheduck'
                }
                dataResolve(data)
            })
            afterEach(() => {
                jest.clearAllMocks()
            })
            it('renders the correct output', () => {
                expect(document.querySelector('[data-test-id="cta-screens"]')).toMatchSnapshot()
            })
        })
    })
})
