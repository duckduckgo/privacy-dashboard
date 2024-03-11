import { ns } from '../js/ui/base/localize'

/**
 * This provides a type-safe mapping from a toggle report data item into a translated string
 * @param {import("../../schema/__generated__/schema.types").ToggleReportScreenDataItem} item
 * @return {string}
 */
export function namedString(item) {
    switch (item.id) {
        case 'wvVersion':
            return ns.report('dynamic_wvVersion.title')
        case 'requests':
            return ns.report('dynamic_requests.title')
        case 'features':
            return ns.report('dynamic_features.title')
        case 'appVersion':
            return ns.report('dynamic_appVersion.title')
        case 'atb':
            return ns.report('dynamic_atb.title')
        case 'errorDescriptions':
            return ns.report('dynamic_errorDescriptions.title')
        case 'extensionVersion':
            return ns.report('dynamic_extensionVersion.title')
        case 'httpErrorCodes':
            return ns.report('dynamic_httpErrorCodes.title')
        case 'lastSentDay':
            return ns.report('dynamic_lastSentDay.title')
        case 'device':
            return ns.report('dynamic_device.title')
        case 'os':
            return ns.report('dynamic_os.title')
        case 'reportFlow':
            return ns.report('dynamic_reportFlow.title')
        case 'siteUrl':
            return ns.report('dynamic_siteUrl.title')
        case 'listVersions':
            return ns.report('dynamic_listVersions.title')
        case 'didOpenReportInfo':
            return ns.report('dynamic_didOpenReportInfo.title')
        case 'toggleReportCounter':
            return ns.report('dynamic_toggleReportCounter.title')
    }
}
