import { ns } from '../js/ui/base/localize';

/**
 * This provides a type-safe mapping from a toggle report data item into a translated string
 * @param {import("../../schema/__generated__/schema.types").ToggleReportScreenDataItem} item
 * @return {string}
 */
export function namedString(item) {
    switch (item.id) {
        case 'openerContext':
            return ns.toggleReport('dynamic_openerContext.title');
        case 'userRefreshCount':
            return ns.toggleReport('dynamic_userRefreshCount.title');
        case 'jsPerformance':
            return ns.toggleReport('dynamic_jsPerformance.title');
        case 'wvVersion':
            return ns.toggleReport('dynamic_wvVersion.title');
        case 'requests':
            return ns.toggleReport('dynamic_requests.title');
        case 'features':
            return ns.toggleReport('dynamic_features.title');
        case 'appVersion':
            return ns.toggleReport('dynamic_appVersion.title');
        case 'atb':
            return ns.toggleReport('dynamic_atb.title');
        case 'errorDescriptions':
            return ns.toggleReport('dynamic_errorDescriptions.title');
        case 'extensionVersion':
            return ns.toggleReport('dynamic_extensionVersion.title');
        case 'httpErrorCodes':
            return ns.toggleReport('dynamic_httpErrorCodes.title');
        case 'lastSentDay':
            return ns.toggleReport('dynamic_lastSentDay.title');
        case 'device':
            return ns.toggleReport('dynamic_device.title');
        case 'os':
            return ns.toggleReport('dynamic_os.title');
        case 'reportFlow':
            return ns.toggleReport('dynamic_reportFlow.title');
        case 'siteUrl':
            return ns.toggleReport('dynamic_siteUrl.title');
        case 'listVersions':
            return ns.toggleReport('dynamic_listVersions.title');
        case 'didOpenReportInfo':
            return ns.toggleReport('dynamic_didOpenReportInfo.title');
        case 'toggleReportCounter':
            return ns.toggleReport('dynamic_toggleReportCounter.title');
        case 'locale':
            return ns.toggleReport('dynamic_locale.title');
    }
}
