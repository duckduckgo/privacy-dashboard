# Contributing guidelines

# Reporting broken sites

Report broken websites using the "Website not working as expected?" link in the Dashboard.

# Reporting bugs

1. First check to see if the bug has not already been [reported](https://github.com/duckduckgo/duckduckgo-privacy-dashboard/issues).
2. Create a bug report [issue](https://github.com/duckduckgo/duckduckgo-privacy-dashboard/issues/new?template=bug_report.md).
3. Bugs can also submitted through our [bounty program](https://hackerone.com/duckduckgo/reports/new?type=team&report_type=vulnerability) or by sending an email to security@duckduckgo.com.

# Development

## New features

Right now all new feature development is handled internally.

## Bug fixes

Most bug fixes are handled internally, but we will except pull requests for bug fixes if you first:
1. Create an issue describing the bug. See [Reporting bugs](CONTRIBUTING.md#reporting-bugs).
2. Get approval from DDG staff before working on it. Since most bug fixes and feature development are handled internally, we want to make sure that your work doesn't conflict with any current projects.
3. I confirm that this contribution is made under an Apache 2.0 license and that I have the authority necessary to make this contribution on behalf of its copyright owner.

## Local Development

## Building

The Privacy Dashboard can be built for all supported environments using
`npm run build`. To preview the application using mock data, use
`npm run preview.example` to view it in your default browser.

The browser will open at `/html/popup.html` - if you want to see multiple variants
open at once, visit `/html/iframe.html` instead.

## Emulating different platforms/scenarios.

When you are viewing the application in a browser, you can emulate certain environments
by using query parameters.

For example, first run `npm run preview.example` - and then you can alter the query parameters
in the browser that opens.

- `platform` - setting this will ensure that CSS for the selected platform is applied.
    - Values can be: `browser`, `ios`, `macos`, `windows` or `android`
    - Example: [http://localhost:8080/html/popup.html?platform=ios](http://localhost:8080/html/popup.html?platform=ios)
- `theme` - for overriding dark mode
    - Values can be: `dark` or `light`
    - Example: [http://localhost:8080/html/popup.html?theme=dark](http://localhost:8080/html/popup.html?theme=dark)
    - Example Combined: [http://localhost:8080/html/popup.html?platform=ios&theme=dark](http://localhost:8080/html/popup.html?platform=ios&theme=dark)
- `denylisted` - settings this to `true` would simulate the extension marking the current webpage
  as broken, but the user has overridden the choice and wants to keep protections enabled.
    - Values can be `true` or `false`
    - Example: [http://localhost:8080/html/popup.html?platform=browser&isBroken=true&denylisted=true](http://localhost:8080/html/popup.html?platform=browser&isBroken=true&denylisted=true)
- `contentBlockingException` - settings this to `true` would simulate an exception to the `contentBlocking` feature - this means DDG has remotely
  disabled content blocking for the current webpage. This is another way of determining if the current site is deemed to be 'broken'.
    - Values can be `true` or `false`
    - Example: [http://localhost:8080/html/popup.html?platform=browser&contentBlockingException=true](http://localhost:8080/html/popup.html?platform=browser&contentBlockingException=true)

## Browser/Extension specific overrides

Along with the above, you can also override the following to emulate features that are only available in the `browser` platform.

**Note**: Some of these features will become available on other platforms too, when that occurs
they will be documented above.

- `emailUser` - setting this to 'true' would simulate a user being signed in to DDG Email Protection
    - Values can be `true` or `false`
    - Example: [http://localhost:8080/html/popup.html?platform=browser&emailUser=true](http://localhost:8080/html/popup.html?platform=browser&emailUser=true)

## Building Docs

Documentation will be built using [Typedoc](https://typedoc.org/) on every Pull Request. The resulting static site will be deployed the
`gh-pages` branch of this repo.

To verify locally, and to check how your documentation is looking, you can run the `npm run docs` command, and then
serve the `build/example/docs` folder (or just open the file directly in the browser)

- npm command: `npm run docs`
- output folder: `build/example/docs`
- included files: check the `files` array in the [`tsconfig.json`](./tsconfig.json) file

## Watch mode

You can build the 'example' variant in watch mode by running `npm run watch.example`.
If you also want to serve the content, in a separate terminal run `npm run watch.serve`.

CSS, JS & HTML will be processed on each file change - you'll just need to reload manually in the browser.

## Linting

Code can be linted with `npm run lint`. Use `npm run lint.fix` to automatically
fix supported issues.

## Testing

All tests can be run with `npm test` - this runs both unit and end-to-end
tests.

### Unit Tests

These run in Jest, using JSDOM. Test files can be found co-located with the
corresponding code under test, using a `tests/` directory and `.test.js`
filename suffix.

ℹ️ Note: Not all code is covered with unit tests.

### End-to-end Tests

These run in Jest, using Playwright to run a Safari instance. Test files can be
found under the `e2e/` directory with a `.e2e.js` filename suffix.

Included with the end-to-end tests is a visual regression testing setup. Tests
can use the `testScreenshot` helper to confirm that the page looks as expected,
by comparing it against a saved screenshot and failing the test if it differs.
Saved screenshot files can be found under `__image_snapshots__`, and show the
Privacy Dashboard in both light and dark themes.

### Integration Tests

To verify the platform-specific communications, run the integration tests.

- first, you need to build all platforms with `npm run build`
- now run `npm run test.int` to have all platforms tested

