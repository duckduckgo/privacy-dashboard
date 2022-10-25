import { dataStates } from '../shared/js/ui/views/tests/generate-data'

/**
 * @param {import('@playwright/test').Page} page
 * @param {import('../schema/__generated__/schema.types').RequestData} requestData
 * @param {Partial<import('../schema/__generated__/schema.types').Tab>} tab
 */
export async function withExtensionRequests(page, requestData, tab = {}) {
    const messages = {
        submitBrokenSiteReport: {},
        /** @type {import('../schema/__generated__/schema.types').ExtensionGetPrivacyDashboardData} */
        getPrivacyDashboardData: {
            tab: {
                id: 1533,
                url: 'https://example.com',
                upgradedHttps: false,
                protections: {
                    unprotectedTemporary: false,
                    enabledFeatures: ['contentBlocking'],
                    denylisted: false,
                    allowlisted: false,
                },
                ...tab,
            },
            requestData: requestData,
        },
        setList: {},
    }
    await page.addInitScript((messages) => {
        try {
            const listeners = []
            if (!window.chrome) {
                // @ts-ignore
                window.chrome = {}
            }
            window.__playwright = {
                messages: messages,
                mocks: {
                    outgoing: [],
                    incoming: [],
                },
                calls: [],
            }

            // override some methods on window.chrome.tabs that the extension might call
            window.chrome.tabs = {
                ...window.chrome.tabs,
                reload: async function (id) {
                    window.__playwright.calls.push(['reload', id])
                },

                // @ts-ignore
                create: async (arg) => {
                    window.__playwright.calls.push(['create', arg])
                },
            }

            // override some methods on window.chrome.extension that the extension might call
            window.chrome.extension = {
                ...window.chrome.extension,
                // @ts-ignore
                getViews: function (arg) {
                    window.__playwright.calls.push(['getViews', arg])
                    return [
                        {
                            close: (arg) => {
                                window.__playwright.calls.push(['close', arg])
                            },
                        },
                    ]
                },
            }

            // override some methods on window.chrome.runtime to fake the incoming/outgoing messages
            window.chrome.runtime = {
                async sendMessage(message, cb) {
                    function send(fn, timeout = 100) {
                        setTimeout(() => {
                            fn()
                        }, timeout)
                    }

                    // does the incoming message match one that's been mocked here?
                    const matchingMessage = window.__playwright.messages[message.messageType]
                    if (matchingMessage) {
                        window.__playwright.mocks.outgoing.push(message)
                        console.log(`addInitScript.sendMessage -> ${JSON.stringify(message)}`)
                        send(() => cb(matchingMessage), 200)
                    } else {
                        console.log(`❌ [(mocks): window.chrome.runtime] Missing support for ${JSON.stringify(message)}`)
                    }
                },
                // @ts-ignore
                onMessage: {
                    addListener(listener) {
                        listeners.push(listener)
                    },
                },
            }
        } catch (e) {
            console.error("❌couldn't set up mocks")
            console.error(e)
        }
    }, messages)

    return {
        /**
         * @param {{names: string[]}} [opts]
         * @returns {Promise<any[]>}
         */
        async outgoing(opts = { names: [] }) {
            const result = await page.evaluate(() => window.__playwright.mocks.outgoing)
            /** @type {any[]} */
            if (opts.names.length === 0) return result
            return result.filter((item) => opts.names.includes(item.messageType))
        },
        async calls() {
            return page.evaluate(() => window.__playwright.calls)
        },
    }
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {import('../schema/__generated__/schema.types').RequestData} requestData
 * @param {Partial<import('../schema/__generated__/schema.types').Tab>} tab
 */
export async function withWindowsRequests(page, requestData, tab = {}) {
    const messages = {
        /** @type {import('../schema/__generated__/schema.types').WindowsViewModel} */
        windowsViewModel: {
            protections: {
                unprotectedTemporary: false,
                enabledFeatures: ['contentBlocking'],
                denylisted: false,
                allowlisted: false,
            },
            rawRequestData: requestData,
            tabUrl: 'https://example.com',
            upgradedHttps: false,
            parentEntity: undefined,
            permissions: undefined,
            certificates: [],
        },
    }
    await page.addInitScript((messages) => {
        try {
            if (!window.chrome) {
                // @ts-ignore
                window.chrome = {}
            }
            window.__playwright = {
                listeners: [],
                messages: messages,
                mocks: {
                    outgoing: [],
                    incoming: [],
                },
                calls: [],
            }
            // override some methods on window.chrome.runtime to fake the incoming/outgoing messages
            window.chrome.webview = {
                // @ts-ignore
                addEventListener: (messageName, listener) => {
                    window.__playwright.listeners?.push(listener)
                },
                postMessage(arg) {
                    window.__playwright.mocks.outgoing.push(arg)
                },
            }
        } catch (e) {
            console.error("❌couldn't set up mocks")
            console.error(e)
        }
    }, messages)

    return {
        async deliverInitial() {
            await page.evaluate((messages) => {
                for (const listener of window.__playwright.listeners || []) {
                    listener({ data: messages.windowsViewModel })
                }
            }, messages)
        },
        /**
         * @param {{names: string[]}} [opts]
         * @returns {Promise<any[]>}
         */
        async outgoing(opts = { names: [] }) {
            const result = await page.evaluate(() => window.__playwright.mocks.outgoing)
            /** @type {any[]} */
            if (opts.names.length === 0) return result
            return result.filter((item) => opts.names.includes(item.Name))
        },
    }
}

/**
 * @param {import('@playwright/test').Page} page
 */
export function forwardConsole(page) {
    page.on('console', (msg, other) => {
        const replaced = msg.text().replace(/http:\/\/localhost:3210/g, './build/browser')
        console.log('->', msg.type(), replaced)
    })
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {import('../schema/__generated__/schema.types').RequestData} requestData
 * @param {Partial<import('../schema/__generated__/schema.types').Tab>} tab
 */
export async function withAndroidRequests(page, requestData, tab = {}) {
    const messages = {
        submitBrokenSiteReport: {},
        /** @type {import('../schema/__generated__/schema.types').ExtensionGetPrivacyDashboardData} */
        getPrivacyDashboardData: {
            /** @type {import('../schema/__generated__/schema.types').Tab} */
            tab: {
                id: 1533,
                url: 'https://example.com',
                upgradedHttps: false,
                protections: {
                    unprotectedTemporary: false,
                    enabledFeatures: ['contentBlocking'],
                    denylisted: false,
                    allowlisted: false,
                },
                localeSettings: {
                    locale: 'en',
                },
                ...tab,
            },
            requestData: requestData,
        },
        setList: {},
    }
    await page.waitForFunction(() => typeof window.onChangeRequestData === 'function')
    await page.evaluate((messages) => {
        try {
            window.__playwright = {
                messages: messages,
                mocks: {
                    outgoing: [],
                    incoming: [],
                },
                calls: [],
            }
            // @ts-ignore
            window.PrivacyDashboard = {
                showBreakageForm(arg) {
                    window.__playwright.mocks.outgoing.push(['showBreakageForm', arg])
                },
                openInNewTab(arg) {
                    window.__playwright.mocks.outgoing.push(['openInNewTab', arg])
                },
            }
            window.onChangeUpgradedHttps(false)
            window.onChangeProtectionStatus({
                unprotectedTemporary: false,
                enabledFeatures: ['contentBlocking'],
                allowlisted: false,
                denylisted: false,
            })
            window.onChangeLocale(messages.getPrivacyDashboardData.tab.localeSettings)
            window.onChangeRequestData(messages.getPrivacyDashboardData.tab.url, messages.getPrivacyDashboardData.requestData)
        } catch (e) {
            console.error("❌couldn't set up mocks")
            console.error(e)
        }
    }, messages)

    return {
        /**
         * @param {{names: string[]}} [opts]
         * @returns {Promise<any[]>}
         */
        async outgoing(opts = { names: [] }) {
            const result = await page.evaluate(() => window.__playwright.mocks.outgoing)
            return result
        },
    }
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {import('../schema/__generated__/schema.types').RequestData} requestData
 * @param {Partial<import('../schema/__generated__/schema.types').Tab>} tab
 */
export async function withWebkitRequests(page, requestData, tab = {}) {
    const messages = {
        submitBrokenSiteReport: {},
        /** @type {import('../schema/__generated__/schema.types').ExtensionGetPrivacyDashboardData} */
        getPrivacyDashboardData: {
            /** @type {import('../schema/__generated__/schema.types').Tab} */
            tab: {
                id: 1533,
                url: 'https://example.com',
                upgradedHttps: false,
                protections: {
                    unprotectedTemporary: false,
                    enabledFeatures: ['contentBlocking'],
                    denylisted: false,
                    allowlisted: false,
                },
                localeSettings: {
                    locale: 'en',
                },
                ...tab,
            },
            requestData: requestData,
        },
        setList: {},
    }
    await page.waitForFunction(() => typeof window.onChangeRequestData === 'function')
    await page.evaluate((messages) => {
        try {
            window.__playwright = {
                messages: messages,
                mocks: {
                    outgoing: [],
                    incoming: [],
                },
                calls: [],
            }
            window.webkit = {
                messageHandlers: {
                    privacyDashboardShowReportBrokenSite: {
                        postMessage: (arg) => {
                            window.__playwright.mocks.outgoing.push(['privacyDashboardShowReportBrokenSite', arg])
                        },
                    },
                    privacyDashboardOpenUrlInNewTab: {
                        postMessage: (arg) => {
                            window.__playwright.mocks.outgoing.push(['privacyDashboardOpenUrlInNewTab', arg])
                        },
                    },
                    privacyDashboardSubmitBrokenSiteReport: {
                        postMessage: (arg) => {
                            window.__playwright.mocks.outgoing.push(['privacyDashboardSubmitBrokenSiteReport', arg])
                        },
                    },
                    privacyDashboardSetSize: {
                        postMessage: (arg) => {
                            window.__playwright.mocks.outgoing.push(['privacyDashboardSetSize', arg])
                        },
                    },
                },
            }
            window.onChangeLocale(messages.getPrivacyDashboardData.tab.localeSettings)
            window.onChangeUpgradedHttps(false)
            window.onChangeProtectionStatus({
                unprotectedTemporary: false,
                enabledFeatures: ['contentBlocking'],
                allowlisted: false,
                denylisted: false,
            })
            window.onChangeRequestData(messages.getPrivacyDashboardData.tab.url, messages.getPrivacyDashboardData.requestData)
        } catch (e) {
            console.error("❌couldn't set up mocks")
            console.error(e)
        }
    }, messages)

    return {
        /**
         * @param {{names: string[]}} [opts]
         * @returns {Promise<any[]>}
         */
        async outgoing(opts = { names: [] }) {
            const result = await page.evaluate(() => window.__playwright.mocks.outgoing)
            if (Array.isArray(opts.names) && opts.names.length > 0) {
                return result.filter(([name]) => opts.names.includes(name))
            }
            return result
        },
    }
}

/**
 * @param {import('@playwright/test').Page} page
 * @param {("new-requests" | "none" | "state:cnn")[]} kind
 * @returns {Promise<void>}
 */
export async function playTimeline(page, kind) {
    await page.evaluate(
        async (params) => {
            const { dataStates, kind } = params
            for (const timelineKind of kind) {
                if (timelineKind === 'new-requests') {
                    /** @type {import('../schema/__generated__/schema.types').DetectedRequest[]} */
                    const payload1 = dataStates['02'].requests.slice(0, 1)
                    const payload2 = dataStates['02'].requests.slice(0, 2)
                    const payload3 = dataStates['02'].requests.slice()
                    const payload4 = dataStates['02'].requests.slice().concat(dataStates['03'].requests)
                    const payloads = [payload1, payload2, payload3, payload4]
                    for (const payload of payloads) {
                        await new Promise((resolve) => setTimeout(resolve, 100))
                        window.onChangeRequestData('https://example.com', {
                            requests: payload,
                        })
                    }
                }
                if (timelineKind === 'state:cnn') {
                    const state = dataStates.cnn
                    /** @type {import('../schema/__generated__/schema.types').DetectedRequest[]} */
                    const payload = state.requests
                    window.onChangeParentEntity(state.parentEntity)
                    window.onChangeRequestData(state.url, {
                        requests: payload,
                    })
                }
            }
        },
        { dataStates, kind }
    )
}
