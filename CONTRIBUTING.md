# Contributing guidelines

# Reporting broken sites

Report broken websites using the "Website not working as expected?" link in the Dashboard.

# Reporting bugs

1. First check to see if the bug has not already been [reported](https://github.com/duckduckgo/privacy-dashboard/issues).
2. Create a bug report [issue](https://github.com/duckduckgo/privacy-dashboard/issues/new?template=bug_report.md).

## Reporting security bugs

Security bugs can be submitted through our [bounty program](https://hackerone.com/duckduckgo/reports/new?type=team&report_type=vulnerability) or by sending an email to security@duckduckgo.com

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
`npm run preview` to view it in your default browser.

The browser will open at `/html/iframe.html` - from there, you can click 'open in new tab' on
any of the test instances to work on that configuration exclusively.

It's also recommended to run `npm run fetch-fonts` if you're making a UI change, to prevent unnecessary snapshot diffs

## Emulating different platforms/scenarios.

When you run `npm run preview`, it opens `iframe.html` which contains iframes for all the individual platforms.
Clicking any of the 'open in new tab' links will open the application in dedicated window.

-   emulating dark/light mode
    -   use the dev tools 'emulate dark/light mode'
-   emulating tracker states, allowlisting and more
    -   use the select in the header to choose a state

## Browser/Extension specific overrides

Along with the above, you can also override the following to emulate features that are only available in the `browser` platform.

**Note**: Some of these features will become available on other platforms too, when that occurs
they will be documented above.

-   `state=emailUser` - this would simulate a user being signed in to DDG Email Protection
    -   Example: [http://127.0.0.1:3220/html/browser.html?theme=dark&state=email-user](http://127.0.0.1:3220/html/browser.html?theme=dark&state=email-user)

## Translations

Inside `shared/js/ui/base/localize.js` the following line is used to load the translations:

```js
// this is picked up by an esbuild plugin to load all locale files, see `scripts/bundle.mjs`
import localeResources from '../../../locales/*/*.json';
```

## Building Docs

Documentation will be built using [Typedoc](https://typedoc.org/) on every Pull Request. The resulting static site will be deployed the
`gh-pages` branch of this repo.

To verify locally, and to check how your documentation is looking, you can run the `npm run docs` command, and then
serve the `build/docs` folder (or just open the file directly in the browser)

-   npm command: `npm run docs`
-   output folder: `build/docs`
-   included files: check the `files` array in the [`tsconfig.json`](./tsconfig.json) file

## Watch mode

To run the build every time you edit files, run `npm run watch.build`.

If you also want to serve the content, in a separate terminal run `npm run preview`.

CSS, JS & HTML will be processed on each file change - you'll just need to reload manually in the browser.

## Linting

Code can be linted with `npm run lint`. Use `npm run lint.fix` to automatically
fix supported issues.

## Formatting (prettier)

Code can be auto-formatted with `npm run pretter.fix`

## Testing

All tests can be run with `npm test` - this runs unit tests, integration, linting, typechecking and documentation

### Unit Tests

Test files can be found co-located with the corresponding code using `.test.js` filename suffix. These run node's native test runner.

### Integration Tests

To verify the platform-specific communications, run the integration tests

-   Run `npm run test.int` to have all platforms tested
-   Run `npm run test.int --project ios` to only run the iOS tests, likewise for the other platforms
-   Run `npm run test.int -- --grep @screenshots` to only run screenshot tests
-   Run `npm run test.int -- --grep-invert @screenshots` to only run non-screenshot tests
-   Run `npm run test.int.update-screenshots` to also update screenshots (if you've made changes to anything visual)
