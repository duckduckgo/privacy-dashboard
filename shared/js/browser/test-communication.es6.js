import { setupColorScheme } from './common.es6'

setupColorScheme()

export function fetch () {
    // noop
}

export function backgroundMessage () {
    // noop
}

export async function getBackgroundTabData () {
    return window.__DDG_TEST_DATA
}
