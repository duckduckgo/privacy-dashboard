/**
 * @param {import('@playwright/test').Page} page
 * @param {import('../schema/__generated__/schema.types').GetPrivacyDashboardData} privacyDashboardData
 */
export async function withExtensionRequests(page, privacyDashboardData) {
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
 */
export function forwardConsole(page) {
    page.on('console', (msg, other) => {
        const replaced = msg.text().replace(/http:\/\/localhost:3210/g, './build/browser')
        console.log('->', msg.type(), replaced)
    })
}

/**
 * @param {import('@playwright/test').Page} page
 */
export async function withWebkitMocks(page) {
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
 * @param {import("../shared/js/ui/views/tests/generate-data").MockData[]} states
 * @param {import('../shared/js/ui/platform-features').Platform} [platform]
 * @returns {Promise<void>}
 */
export async function playTimeline(page, states, platform) {
    platform = platform || { name: 'ios' }
    await page.evaluate(
        async (params) => {
            const { states, platform } = params
            for (const state of states) {
                const nextParentEntity = state.parentEntity
                const nextUpgradedHttps = state.upgradedHttps
                const nextCerts = state.certificate
                const nextProtections = state.protections
                const nextLocale = state.localeSettings
                const nextPermissions = state.permissions
                const nextRequestData = { requests: state.requests }

                if (platform?.name === 'windows') {
                    for (const listener of window.__playwright.listeners || []) {
                        // todo(Shane): Centralise this so that it's shared in the comms file
                        listener({
                            data: {
                                Feature: 'PrivacyDashboard',
                                Name: 'ViewModelUpdated',
                                Data: {
                                    protections: nextProtections,
                                    rawRequestData: nextRequestData,
                                    tabUrl: state.url,
                                    upgradedHttps: nextUpgradedHttps,
                                    parentEntity: nextParentEntity,
                                    permissions: nextPermissions,
                                    certificates: nextCerts,
                                },
                            },
                        })
                    }
                    return
                }
                if (platform?.name === 'browser') {
                    window.__playwright.messages = Object.assign(window.__playwright.messages, {
                        getPrivacyDashboardData: {
                            tab: {
                                id: 1533,
                                url: state.url,
                                upgradedHttps: nextUpgradedHttps,
                                protections: nextProtections,
                                parentEntity: nextParentEntity,
                            },
                            requestData: nextRequestData,
                            emailProtectionUserData: {
                                cohort: 'private_beta_dax',
                                nextAlias: '123456_next',
                                token: '123456',
                                userName: 'daxtheduck',
                            },
                        },
                    })
                    for (const listener of window.__playwright.listeners || []) {
                        listener({ updateTabData: true }, { id: 'test' })
                    }
                    return
                }
                window.onChangeParentEntity(nextParentEntity)
                window.onChangeProtectionStatus(nextProtections)
                window.onChangeUpgradedHttps(nextUpgradedHttps)
                window.onChangeCertificateData({
                    secCertificateViewModels: nextCerts,
                })
                window.onChangeLocale(nextLocale)
                window.onChangeRequestData(state.url, nextRequestData)
            }
        },
        { states, platform }
    )
}

export async function installAndroidMocks(page) {
    await page.waitForFunction(() => typeof window.onChangeRequestData === 'function')
    return page.evaluate(() => {
        try {
            window.__playwright = {
                messages: {},
                mocks: {
                    outgoing: [],
                    incoming: [],
                },
                calls: [],
            }
            window.PrivacyDashboard = {
                showBreakageForm(arg) {
                    window.__playwright.mocks.outgoing.push(['showBreakageForm', arg])
                },
                openInNewTab(arg) {
                    window.__playwright.mocks.outgoing.push(['openInNewTab', arg])
                },
                close(arg) {
                    window.__playwright.mocks.outgoing.push(['close', arg])
                },
                toggleAllowlist(arg) {
                    window.__playwright.mocks.outgoing.push(['toggleAllowlist', arg])
                },
            }
        } catch (e) {
            console.error("❌couldn't set up mocks")
            console.error(e)
        }
    })
}

/**
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<void>}
 */
export function installWindowsMocks(page) {
    return page.addInitScript(() => {
        try {
            if (!window.chrome) {
                // @ts-ignore
                window.chrome = {}
            }
            window.__playwright = {
                listeners: [],
                messages: {},
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
                    window.__playwright.mocks.outgoing.push([arg.Name, arg])
                },
            }
            console.log('window.chrome.webview', window.chrome.webview)
        } catch (e) {
            console.error("❌couldn't set up mocks")
            console.error(e)
        }
    })
}

/**
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<void>}
 */
export async function installWebkitMocks(page) {
    await page.waitForFunction(() => typeof window.onChangeRequestData === 'function')
    return page.evaluate(() => {
        try {
            window.__playwright = {
                messages: {},
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
                    privacyDashboardClose: {
                        postMessage: (arg) => {
                            window.__playwright.mocks.outgoing.push(['privacyDashboardClose', arg])
                        },
                    },
                },
            }
        } catch (e) {
            console.error("❌couldn't set up mocks")
            console.error(e)
        }
    })
}

/**
 * @param {import("@playwright/test").Page} page
 * @param {Object} [opts]
 * @param {string} [opts.locale]
 * @returns {Promise<void>}
 */
export async function installBrowserMocks(page, opts = { locale: 'en' }) {
    return page.addInitScript((opts) => {
        const messages = {
            submitBrokenSiteReport: {},
            setLists: {},
            search: {},
            openOptions: {},
        }
        try {
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
                listeners: [],
            }

            // @ts-ignore
            window.chrome.i18n = {
                getUILanguage() {
                    return opts?.locale || 'en'
                },
            }

            // override some methods on window.chrome.runtime to fake the incoming/outgoing messages
            window.chrome.runtime = {
                id: 'test',
                async sendMessage(message, cb) {
                    console.log('message', message)
                    function respond(fn, timeout = 100) {
                        setTimeout(() => {
                            fn()
                        }, timeout)
                    }

                    // does the incoming message match one that's been mocked here?
                    const matchingMessage = window.__playwright.messages[message.messageType]
                    if (matchingMessage) {
                        window.__playwright.mocks.outgoing.push([message.messageType, message])
                        respond(() => cb(matchingMessage), 200)
                    } else {
                        console.log(`❌ [(mocks): window.chrome.runtime] Missing support for ${JSON.stringify(message)}`)
                    }
                },
                // @ts-ignore
                onMessage: {
                    addListener(listener) {
                        console.log('got listener...')
                        window.__playwright.listeners?.push(listener)
                    },
                },
            }
        } catch (e) {
            console.error("❌couldn't set up browser mocks")
            console.error(e)
        }
    }, opts)
}
