// swift-tools-version:5.5
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "PrivacyDashboardResources",
    platforms: [
        .iOS("14.0"),
        .macOS("10.15")
    ],
    products: [
        .library(
            name: "PrivacyDashboardResources",
            targets: ["PrivacyDashboardResources"]),
    ],
    dependencies: [
    ],
    targets: [
        .target(
            name: "PrivacyDashboardResources",
            dependencies: [.target(name: "PrivacyDashboard-resources")],
            path: "swift-package/Sources"),

        .target(
            name: "PrivacyDashboard-resources",
            path: "build",
            exclude: ["app/font"], 
            resources: [.copy ("app/html"),
                        .copy("app/img"),
                        .copy ("app/public"),
                        .copy ("app/index.html")]),
    ]
)
