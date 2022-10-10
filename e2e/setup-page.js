import { webkit } from 'playwright-webkit'
import { toMatchImageSnapshot } from 'jest-image-snapshot'
import { getContentHeightForScreenShot } from '../shared/js/browser/common.es6'

expect.extend({ toMatchImageSnapshot })

const defaultPageWidth = 350
const defaultPageHeight = 550
let browser
let context

function setupPage () {
    beforeAll(async () => {
        browser = await webkit.launch()
    })

    afterAll(async () => {
        await browser.close()
    })

    beforeEach(async () => {
        context = await browser.newContext()
        globalThis.page = await context.newPage({
            viewport: {
                width: defaultPageWidth,
                height: defaultPageHeight
            }
        })
    })
    afterEach(async () => {
        await context.close()
    })

    // ---

    const goToState = async (searchParams) => {
        const params = new URLSearchParams(Object.entries(searchParams)).toString()
        await globalThis.page.goto(`http://localhost:8080/html/popup.html?${params}`)
        await wait(250) // wait for animations to complete
    }

    const wait = (timeout) =>
        new Promise((resolve) => setTimeout(resolve, timeout))

    const setupColorScheme = async (colorScheme) => {
        await globalThis.page.emulateMedia({ colorScheme })
    }

    const takeScreenshot = async () => {
        const height = await globalThis.page.evaluate(getContentHeightForScreenShot)
        await globalThis.page.setViewportSize({
            width: defaultPageWidth,
            height: height || defaultPageHeight
        })
        return await globalThis.page.screenshot()
    }

    const clickTrackerListAction = async () => {
        await globalThis.page.click('.site-info__li--trackers a')
        await wait(350) // Wait for animation
    }

    const clickConnectionAction = async () => {
        await globalThis.page.click('.site-info__li--https-status a')
        await wait(350) // Wait for animation
    }

    const clickBrokenSiteAction = async () => {
        await globalThis.page.click('.site-info__report-broken')
        await wait(350) // Wait for animation
    }

    return {
        goToState,
        wait,
        setupColorScheme,
        takeScreenshot,
        clickTrackerListAction,
        clickConnectionAction,
        clickBrokenSiteAction
    }
}

export default setupPage
