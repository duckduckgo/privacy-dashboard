
import Foundation

#if os(iOS)
import PrivacyDashboard_resources_for_ios
#elseif os(macOS)
import PrivacyDashboard_resources_for_macos
#endif

public extension Bundle {
    static var privacyDashboardURL: URL? {
        #if os(iOS)
            platformResourcesBundle?.url(forResource: "ios", withExtension: "html", subdirectory: "assets/html")
        #elseif os(macOS)
            platformResourcesBundle?.url(forResource: "macos", withExtension: "html", subdirectory: "assets/html")
        #else
            nil
        #endif
    }
    
    private static var platformResourcesBundle: Bundle? {
        return Bundle.privacyDashboardIOSResourcesBundle
    }
}
