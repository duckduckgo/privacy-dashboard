import { ns } from '../js/ui/base/localize'

/**
 * This provides a type-safe mapping from a toggle report data item into a translated string
 * @param {import("../../schema/__generated__/schema.types").ToggleReportScreenDataItem} item
 * @return {string}
 */
export function namedString(item) {
    switch (item.id) {
        case 'openerContext':
            return ns.noTrans('dynamic_openerContext.title')
        case 'userRefreshCount':
            return ns.noTrans('dynamic_userRefreshCount.title')
        case 'jsPerformance':
            return ns.noTrans('dynamic_jsPerformance.title')
        case 'wvVersion':
            return ns.noTrans('dynamic_wvVersion.title')
        case 'requests':
            return ns.noTrans('dynamic_requests.title')
        case 'features':
            return ns.noTrans('dynamic_features.title')
        case 'appVersion':
            return ns.noTrans('dynamic_appVersion.title')
        case 'atb':
            return ns.noTrans('dynamic_atb.title')
        case 'errorDescriptions':
            return ns.noTrans('dynamic_errorDescriptions.title')
        case 'extensionVersion':
            return ns.noTrans('dynamic_extensionVersion.title')
        case 'httpErrorCodes':
            return ns.noTrans('dynamic_httpErrorCodes.title')
        case 'lastSentDay':
            return ns.noTrans('dynamic_lastSentDay.title')
        case 'device':
            return ns.noTrans('dynamic_device.title')
        case 'os':
            return ns.noTrans('dynamic_os.title')
        case 'reportFlow':
            return ns.noTrans('dynamic_reportFlow.title')
        case 'siteUrl':
            return ns.noTrans('dynamic_siteUrl.title')
        case 'listVersions':
            return ns.noTrans('dynamic_listVersions.title')
        case 'didOpenReportInfo':
            return ns.noTrans('dynamic_didOpenReportInfo.title')
        case 'toggleReportCounter':
            return ns.noTrans('dynamic_toggleReportCounter.title')
    }
}
