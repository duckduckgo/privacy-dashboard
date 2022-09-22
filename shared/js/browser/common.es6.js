/**
 * @module common
 */

const getHostname = (url) => {
    if (url.indexOf('//') === 0) {
        url = `http:${url}`
    }

    try {
        return new URL(url).hostname
    } catch (e) {
        return null
    }
}

const convertTrackers = (trackerList) => {
    return trackerList.reduce((mapping, tracker) => {
        if (!tracker.knownTracker) return mapping

        const key = tracker.knownTracker.owner.name

        if (!mapping[key]) {
            mapping[key] = {
                displayName: tracker.entity.displayName,
                prevalence: tracker.entity.prevalence,
                urls: {}
            }
        }

        const urlKey = getHostname(tracker.url)
        if (!urlKey) return mapping

        mapping[key].urls[urlKey] = {
            isBlocked: tracker.blocked,
            categories: tracker.knownTracker.categories
        }
        mapping[key].count = Object.keys(mapping[key].urls).length

        return mapping
    }, {})
}

export const convertTrackerDataPayload = (tabUrl, upgradedHttps, allowlisted, data) => {
    const allTrackers = data.trackersDetected.concat(data.trackersBlocked)
    const trackers = convertTrackers(allTrackers)
    const trackersBlocked = convertTrackers(data.trackersBlocked)
    const tabDomain = (new URL(tabUrl).host).replace(/^www\./, '')

    return {
        url: tabUrl,
        status: 'complete',
        upgradedHttps,
        site: {
            url: tabUrl,
            domain: tabDomain,
            allowlisted,
            enabledFeatures: ['contentBlocking']
        },
        trackers,
        trackersBlocked
    }
}

export function concatParams (args) {
    args = args || []

    let paramString = ''
    let objParamString = ''
    let resultString = ''
    const randomNum = Math.ceil(Math.random() * 1e7)

    args.forEach((arg) => {
        // append keys if object
        if (typeof arg === 'object') {
            objParamString += Object.keys(arg).reduce((params, key) => {
                const val = arg[key]
                if (val || val === 0) return `${params}&${key}=${val}`
                return params
            }, '')
        } else if (arg) {
            // otherwise just add args separated by _
            paramString += `_${arg}`
        }
    })

    resultString = `${paramString}?${randomNum}${objParamString}`

    return resultString
}

export const getContentHeight = () => {
    const $rootSubview = window.document.querySelector('.site-info.site-info--main')
    return $rootSubview?.scrollHeight
}

export function setupMutationObserver (callback) {
    const bufferHeight = 200
    let lastHeight
    const mutationObserver = new MutationObserver(() => {
        const contentHeight = getContentHeight()
        if (!contentHeight) return

        const height = Math.min(window.screen.height - bufferHeight, contentHeight)

        // Only update if the height has changed since last run
        if (lastHeight === height) return
        lastHeight = height

        callback(height)
    })
    const config = { childList: true, attributes: true, subtree: true }
    mutationObserver.observe(window.document, config)
}

const DARK_THEME = 'dark'
const LIGHT_THEME = 'light'
let explicitlySetTheme = ''
let detectedTheme = LIGHT_THEME
const oppositeTheme = {
    [LIGHT_THEME]: DARK_THEME,
    [DARK_THEME]: LIGHT_THEME
}

function swapThemeTo (theme) {
    document.body.classList.remove(`body--theme-${oppositeTheme[theme]}`)
    document.body.classList.add(`body--theme-${theme}`)
}

function updateTheme () {
    if (explicitlySetTheme) {
        swapThemeTo(explicitlySetTheme)
    } else {
        swapThemeTo(detectedTheme)
    }
}

export function setupColorScheme () {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        detectedTheme = DARK_THEME
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        detectedTheme = event.matches ? DARK_THEME : LIGHT_THEME
        updateTheme()
    })

    updateTheme()

    return (theme = '') => {
        theme = theme.trim().toLowerCase()

        if (theme === LIGHT_THEME || theme === DARK_THEME) {
            explicitlySetTheme = theme
        } else {
            explicitlySetTheme = ''
        }

        updateTheme()
    }
}

/**
 * @param condition
 * @param message
 * @returns {asserts condition}
 */
export function assert (condition, message = '') {
    if (!condition) {
        if (!message) {
            throw new Error('invariant')
        }
        throw new Error(message)
    }
}

/**
 * Calling this method should close the dashboard and open the given URL in a **new tab**.
 * @param {{url: string}} payload
 */
export function openInNewTab (payload) {}

/**
 * Communicate the height of the dashboard so that native sides can
 * alter the height of their webview
 *
 * @param {{height: number}} payload
 */
export function setHeight (payload) {}

/**
 * Call this method with Protection status updates.
 *
 * See {@link "Generated Schema Definitions".ProtectionsStatus} for details on the required properties
 *
 * @param {import('../../../schema/__generated__/schema.types').ProtectionsStatus} protectionsStatus
 */
export function onChangeProtectionStatus (protectionsStatus) {}

/**
 * This is used when the user has reported a broken site from
 * within the dashboard.
 *
 * Note: We only send the properties seen here: {@link "Generated Schema Definitions".BreakageReportRequest} (like `category`, `description`)
 * native sides should combine these with any additional data they require.
 *
 * @param {import('../../../schema/__generated__/schema.types').BreakageReportRequest} report
 */
export function submitBrokenSiteReport (report) {}

/**
 * @param {import('../../../schema/__generated__/schema.types').SetListOptions} options
 */
export function setList (options) {

}
