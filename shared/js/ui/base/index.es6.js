window.onunhandledrejection = (event) => {
    console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`)
}

try {
    const { initPopup } = require('../pages/popup.es6.js')
    const { loadCss } = require('./loadcss.js')
    initPopup()
    loadCss()
} catch (/** @type {any} */ e) {
    console.error('start up error', e)
}
