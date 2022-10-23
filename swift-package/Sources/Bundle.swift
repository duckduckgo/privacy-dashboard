
import Foundation
import PrivacyDashboard_resources

public extension Bundle {
    static var privacyDashboardURL: URL? {
        #if os(iOS)
            privacyDashboardResourcesBundle.url(forResource: "ios", withExtension: "html", subdirectory: "assets/html")
        #elseif os(macOS)
            privacyDashboardResourcesBundle.url(forResource: "macos", withExtension: "html", subdirectory: "assets/html")
        #else
            nil
        #endif
    }
    
    private static var platformResourcesBundle: Bundle? {
        return Bundle.privacyDashboardResourcesBundle
    }
}

