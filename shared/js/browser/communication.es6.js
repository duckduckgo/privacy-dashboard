// @ts-ignore
import comms from './browser-communication.es6.js'
export default comms

/**
 * @typedef Communication
 * @property {any} fetch
 * @property {() => Promise<{tab: import('./utils/request-details').TabData} & Record<string, any>>} getBackgroundTabData
 * @property {() => void} [firstRenderComplete]
 */
