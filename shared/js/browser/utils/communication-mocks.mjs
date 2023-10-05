/**
 * @param {object} params
 * @param {import("../../ui/views/tests/generate-data.mjs").MockData} params.state
 * @param {import('../../ui/platform-features.mjs').Platform} params.platform
 * @param {Record<string, any>} params.messages
 */
export async function mockDataProvider(params) {
    const { state, platform, messages } = params

    // ensure certain globals are assigned. This is how the browser/extension mocks work
    Object.assign(window.__playwright.messages, messages)

    // on windows, all data is delivered through a single API call.
    if (platform?.name === 'windows') {
        if (!window.__playwright.messages.windowsViewModel) throw new Error('missing `windowsViewModel` on messages')
        for (const listener of window.__playwright.listeners || []) {
            listener({
                data: window.__playwright.messages.windowsViewModel,
            })
        }
        return
    }

    // in the 'browser/extension' scenario, we trigger the `updateTabData` event, and the Object.assign
    // above takes care of ensuring the correct data is available on `window.__playwright.messages.x`
    if (platform?.name === 'browser') {
        for (const listener of window.__playwright.listeners || []) {
            listener({ updateTabData: true }, { id: 'test' })
        }
        return
    }

    // If we get here, we're on ios/android or macOS - where everything is delivered through window methods
    if (state.cookiePromptManagementStatus) {
        window.onChangeConsentManaged(state.cookiePromptManagementStatus)
    }
    window.onChangeParentEntity(state.parentEntity)
    window.onChangeProtectionStatus(state.protections)
    window.onChangeUpgradedHttps(state.upgradedHttps)
    window.onChangeCertificateData({
        secCertificateViewModels: state.certificate,
    })
    window.onChangeLocale?.(state.localeSettings)
    if (state.remoteFeatureSettings) {
        window.onChangeFeatureSettings?.(state.remoteFeatureSettings)
    }
    window.onChangeRequestData(state.url, { requests: state.requests || [] })
}

export function windowsMockApis() {
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
        // console.log('window.chrome.webview', window.chrome.webview)
    } catch (e) {
        console.error("❌couldn't set up mocks")
        console.error(e)
    }
}

export function webkitMockApis() {
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
                privacyDashboardOpenSettings: {
                    postMessage: (arg) => {
                        window.__playwright.mocks.outgoing.push(['privacyDashboardOpenSettings', arg])
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
                privacyDashboardSetProtection: {
                    postMessage: (arg) => {
                        window.__playwright.mocks.outgoing.push(['privacyDashboardSetProtection', arg])
                    },
                },
            },
        }
    } catch (e) {
        console.error("❌couldn't set up mocks")
        console.error(e)
    }
}

export function mockAndroidApis() {
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
            openSettings(arg) {
                window.__playwright.mocks.outgoing.push(['openSettings', arg])
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
}

export function mockBrowserApis() {
    const messages = {
        submitBrokenSiteReport: {},
        setLists: {},
        search: {},
        openOptions: {},
        setBurnDefaultOption: {},
        doBurn: {},
    }
    try {
        if (!window.chrome) {
            // @ts-ignore
            window.chrome = {
                // @ts-ignore
                permissions: {
                    // eslint-disable-next-line n/no-callback-literal
                    request: (permissions, cb) => cb && cb(true),
                },
            }
        }
        window.__playwright = {
            messages,
            mocks: {
                outgoing: [],
                incoming: [],
            },
            calls: [],
            listeners: [],
        }

        // override some methods on window.chrome.runtime to fake the incoming/outgoing messages
        window.chrome.runtime = {
            id: 'test',
            async sendMessage(message, cb) {
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
                    setTimeout(() => {
                        const matchingMessage = window.__playwright.messages[message.messageType]
                        if (matchingMessage) {
                            window.__playwright.mocks.outgoing.push([message.messageType, message])
                            respond(() => cb(matchingMessage), 0)
                        } else {
                            console.trace(`❌ [(mocks): window.chrome.runtime] Missing support for ${JSON.stringify(message)}`)
                        }
                    }, 200)
                }
            },
            // @ts-ignore
            onMessage: {
                addListener(listener) {
                    window.__playwright.listeners?.push(listener)
                },
            },
        }
    } catch (e) {
        console.error("❌couldn't set up browser mocks")
        console.error(e)
    }
}

/**
 * @param {import("../../ui/platform-features.mjs").Platform} platform
 * @return {Promise<void>}
 */
export async function installMocks(platform) {
    if (window.__playwright) console.log('❌ mocked already there')
    if (platform.name === 'windows') {
        windowsMockApis()
    } else if (platform.name === 'ios' || platform.name === 'macos') {
        webkitMockApis()
    } else if (platform.name === 'android') {
        mockAndroidApis()
    } else if (platform.name === 'browser') {
        mockBrowserApis()
    }

    const { testDataStates } = await import('../../ui/views/tests/states-with-fixtures')
    const stateFromUrl = new URLSearchParams(window.location.search).get('state')

    let mock
    if (stateFromUrl && stateFromUrl in testDataStates) {
        mock = testDataStates[stateFromUrl]
    } else {
        mock = testDataStates.protectionsOn_blocked
        console.warn('state not found, falling back to default. state: ', 'protectionsOn_blocked')
    }

    console.groupCollapsed(`${platform.name} open for more Dashboard States`)
    const urls = Object.keys(testDataStates).map((key) => {
        const clone = new URL(location.href)
        clone.searchParams.set('state', key)
        return clone.href
    })
    for (let url of urls) {
        console.log(url)
    }
    console.groupEnd()

    let messages = {}
    if (platform.name === 'browser') {
        messages['getBurnOptions'] = mock.toBurnOptions()
        messages['getPrivacyDashboardData'] = mock.toExtensionDashboardData()
    }
    if (platform.name === 'windows') {
        messages['windowsViewModel'] = mock.toWindowsViewModel()
    }

    await mockDataProvider({
        state: mock,
        platform: platform,
        messages,
    })
}
