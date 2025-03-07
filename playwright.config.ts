import { PlaywrightTestConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: './integration-tests',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000,
    },
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 2 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 5000,
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://localhost:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        video: { mode: 'on-first-retry' },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'browser',
            use: {
                ...devices['Galaxy S8'],
                viewport: {
                    height: 600,
                    width: 360,
                },
            },
            testMatch: /browser\.spec-int\.js$/,
        },
        {
            name: 'windows',
            use: {
                ...devices['Desktop Chrome'],
                viewport: {
                    height: 650,
                    width: 360,
                },
            },
            testMatch: /windows\.spec-int\.js$/,
        },
        {
            name: 'android',
            use: {
                ...devices['Galaxy S8'],
            },
            testMatch: /android\.spec-int\.js$/,
        },
        {
            name: 'ios',
            use: {
                ...devices['iPhone 11'],
            },
            testMatch: /ios\.spec-int\.js$/,
        },
        {
            name: 'macos',
            use: {
                ...devices['Desktop Safari'],
                viewport: {
                    height: 600,
                    width: 360,
                },
            },
            testMatch: /macos\.spec-int\.js$/,
        },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    webServer: {
        command: 'npm run build.debug && npm run serve',
        port: 3220,
        reuseExistingServer: true,
        ignoreHTTPSErrors: true,
        env: process.env as any,
    },
};

export default config;
