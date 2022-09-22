/**
 * @jest-environment jsdom
 */

import generateData from './mock-data/generate-data'
import { Protections } from '../../../browser/utils/request-details'

class MockMutationObserver {
    observe () {}

    unobserve () {}
}

// @ts-ignore
window.MutationObserver = MockMutationObserver
jest.mock('../../../browser/$ENVIRONMENT-communication.es6.js', () => ({
    fetch: jest.fn(),
    backgroundMessage: jest.fn(),
    getBackgroundTabData: jest.fn()
}), { virtual: true })
jest.mock('../../pages/popup.es6.js', () => {})

describe('Site view', () => {
    let macosCommunication
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
            macosCommunication = require('../../../browser/$ENVIRONMENT-communication.es6.js')
            macosCommunication.getBackgroundTabData.mockReturnValue(dataPromise)

            // Call the site view and pass in dependencies
            const SiteModel = require('../../models/site.es6.js')
            const siteTemplate = require('../../templates/site.es6')
            const SiteView = require('../site.es6.js')
            // eslint-disable-next-line no-new

            // @ts-ignore
            // eslint-disable-next-line no-unused-vars
            const _site = new SiteView({
                pageView: this,
                model: new SiteModel(),
                appendTo: window.$('#test-container'),
                template: siteTemplate
            })
        })
    })

    it('renders nothing initially', () => {
        expect(document.getElementById('test-container')?.innerHTML).toBe('')
    })

    describe('when protection is enabled', () => {
        describe('and locale is changed', () => {
            beforeEach(() => {
                dataResolve(generateData({ tab: { permissions: [], locale: 'cimode' } }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and connection is secure', () => {
            beforeEach(() => {
                dataResolve(generateData({ tab: { permissions: [] } }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and connection is insecure', () => {
            beforeEach(() => {
                dataResolve(generateData({ tab: { permissions: [] }, isSecure: false }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and connection was upgraded', () => {
            beforeEach(() => {
                dataResolve(generateData({ tab: { permissions: [], upgradedHttps: true } }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and no trackers are found', () => {
            beforeEach(() => {
                const data = generateData({ requests: [], tab: { permissions: [] } })
                dataResolve(data)
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and site is owned by tracking network', () => {
            beforeEach(() => {
                const data = generateData({
                    tab: {
                        permissions: [],
                        parentEntity: { displayName: 'Example', prevalence: 90.123 }
                    }
                })
                dataResolve(data)
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })
    })

    describe('when protection is not enabled', () => {
        describe('and locale is changed', () => {
            beforeEach(() => {
                dataResolve(generateData({
                    tab: {
                        permissions: [],
                        protections: {
                            ...Protections.default(),
                            allowlisted: true
                        },
                        locale: 'cimode'
                    }
                }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and connection is secure', () => {
            beforeEach(() => {
                dataResolve(generateData({
                    tab: {
                        permissions: [],
                        protections: {
                            ...Protections.default(),
                            allowlisted: true
                        }
                    },
                    isSecure: true
                }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and connection is insecure', () => {
            beforeEach(() => {
                dataResolve(generateData({
                    tab: {
                        permissions: [],
                        protections: {
                            ...Protections.default(),
                            allowlisted: true
                        }
                    },
                    isSecure: false
                }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and connection was upgraded', () => {
            beforeEach(() => {
                dataResolve(generateData({
                    tab: {
                        permissions: [],
                        protections: {
                            ...Protections.default(),
                            allowlisted: true
                        },
                        upgradedHttps: true
                    },
                    isSecure: true
                }))
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and no trackers are found', () => {
            beforeEach(() => {
                const data = generateData({
                    requests: [],
                    tab: {
                        permissions: [],
                        protections: {
                            ...Protections.default(),
                            allowlisted: true
                        }
                    }
                })
                dataResolve(data)
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })

        describe('and site is owned by tracking network', () => {
            beforeEach(() => {
                const data = generateData({
                    tab: {
                        permissions: [],
                        parentEntity: { displayName: 'Example', prevalence: 90.123 },
                        protections: {
                            ...Protections.default(),
                            allowlisted: true
                        }
                    }
                })
                dataResolve(data)
            })

            it('renders the correct output', () => {
                expect(document.getElementById('test-container')).toMatchSnapshot()
            })
        })
    })

    describe('when permissions are set', () => {
        beforeEach(() => {
            const permissions = [
                {
                    key: 'camera',
                    options: [
                        { id: 'ask', title: 'Always Ask on example.com' },
                        { id: 'grant', title: 'Always Allow on example.com' },
                        { id: 'deny', title: 'Never ask again for example.com' }
                    ],
                    paused: false,
                    permission: 'ask',
                    title: 'camera',
                    used: true
                }
            ]
            dataResolve(generateData({ tab: { permissions } }))
        })

        it('renders the correct output', () => {
            expect(document.getElementById('test-container')).toMatchSnapshot()
        })

        describe('and permission access is changed', () => {
            beforeEach(() => {
                // Change the permission
                const $select = document.querySelector('.js-site-permission')
                if (!($select instanceof HTMLSelectElement)) throw new Error('cannot find element')
                $select.selectedIndex = 2 // deny
                $select.dispatchEvent(new Event('change'))
            })

            it('calls the native handler', () => {
                expect(macosCommunication.fetch).toBeCalledTimes(1)
                expect(macosCommunication.fetch.mock.calls[0][0]).toEqual({
                    updatePermission: {
                        id: 'camera',
                        value: 'deny'
                    }
                })
            })
        })
    })

    describe('when cookie consent popups are hidden', () => {
        beforeEach(() => {
            const consentManaged = {
                consentManaged: true,
                optoutFailed: false,
                selftestFailed: false
            }
            // @ts-ignore
            dataResolve(generateData({ tab: { consentManaged } }))
        })

        it('renders the correct output', () => {
            expect(document.getElementById('test-container')).toMatchSnapshot()
        })
    })
})
