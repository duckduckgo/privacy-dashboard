const isEnvironment = (environment) => environment === '$ENVIRONMENT' || environment === window.environmentOverride
const isIOS = () => isEnvironment('ios')
const isAndroid = () => isEnvironment('android')
const isBrowser = () => true

export {
    isIOS,
    isAndroid,
    isBrowser
}
