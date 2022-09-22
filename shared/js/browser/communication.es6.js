// @ts-ignore
module.exports = require('./$ENVIRONMENT-communication.es6.js')

/**
 * @typedef Communication
 * @property {any} fetch
 * @property {() => Promise<{tab: import('./utils/request-details').TabData} & Record<string, any>>} getBackgroundTabData
 */
