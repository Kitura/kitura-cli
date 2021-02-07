// swift-tools-version:5.3
// The swift-tools-version declares the minimum version of Swift required to build this package.

import PackageDescription

let package = Package(
    name: "kitura",
    platforms: [.macOS(.v10_11)],
    products: [
        .executable(
            name: "kitura",
            targets: [ "kitura" ]),
        .library(
            name: "KituraCommandCore",
            targets: ["KituraCommandCore"]),
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-argument-parser", .upToNextMinor(from: "0.3.2")),
        .package(url: "https://github.com/kareman/SwiftShell", from: "5.1.0"),
        .package(url: "https://github.com/onevcat/Rainbow", .upToNextMinor(from: "3.2.0"))
    ],
    targets: [
        .target(
            name: "KituraCommandCore",
            dependencies: [ "SwiftShell" ]),
        .target(
            name: "kitura",
            dependencies: [
                "KituraCommandCore",
                "Rainbow",
                .product(name: "ArgumentParser", package: "swift-argument-parser"),]),
        .testTarget(
            name: "KituraCLITests",
            dependencies: ["KituraCommandCore"]),
    ]
)
