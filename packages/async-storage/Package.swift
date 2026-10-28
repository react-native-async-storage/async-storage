// swift-tools-version: 6.0

import Foundation
import PackageDescription

// React Native's autolinker evaluates this package through its libs/AsyncStorage
// symlink; these dependencies are relative to that generated location.
let reactHeaders: [Target.Dependency] = [
    .product(name: "ReactHeaders", package: "ReactNative"),
    .product(name: "ReactNativeHeaders", package: "ReactNative"),
    .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
    .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
]

// The Swift target includes its Foundation import shim outside apple/. Exclude
// every unused root entry so examples, dependencies and metadata are not scanned
// as resources, in both repository checkouts and published npm packages.
let usedRootEntries: Set<String> = ["apple", "spm-support", "Package.swift"]
let unusedRootEntries = try! FileManager.default.contentsOfDirectory(atPath: Context.packageDirectory)
    .filter { !usedRootEntries.contains($0) }
    .sorted()
let unusedAppleEntries = try! FileManager.default.contentsOfDirectory(atPath: Context.packageDirectory + "/apple")
    .filter { $0 != "storage" }
    .map { "apple/" + $0 }
    .sorted()

let package = Package(
    name: "AsyncStorage",
    platforms: [.iOS("15.1")],
    products: [
        .library(name: "AsyncStorage", targets: ["AsyncStorage", "AsyncStorageObjC"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
    ],
    targets: [
        .binaryTarget(
            name: "SharedAsyncStorage",
            path: "apple-frameworks/SharedAsyncStorage.xcframework"
        ),
        // Preserve the Swift module name and Objective-C runtime class names
        // used by the private bridge declarations. Swift never depends on ObjC.
        .target(
            name: "AsyncStorage",
            dependencies: [.target(name: "SharedAsyncStorage")] + reactHeaders,
            path: ".",
            exclude: unusedRootEntries + unusedAppleEntries,
            sources: ["apple/storage", "spm-support/Foundation.swift"]
        ),
        .target(
            name: "AsyncStorageObjC",
            dependencies: [.target(name: "AsyncStorage")] + reactHeaders,
            path: "apple",
            exclude: ["storage"],
            resources: [.process("PrivacyInfo.xcprivacy")],
            publicHeadersPath: ".",
            cSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("legacy_storage"),
                .headerSearchPath("../spm-headers"),
            ],
            cxxSettings: [
                .define("RCT_NEW_ARCH_ENABLED", to: "1"),
                .headerSearchPath("legacy_storage"),
                .headerSearchPath("../spm-headers"),
                .define("DEBUG", .when(configuration: .debug)),
                .define("NDEBUG", .when(configuration: .release)),
            ],
            linkerSettings: [.linkedFramework("Foundation")]
        ),
    ],
    swiftLanguageModes: [.v5],
    cxxLanguageStandard: .cxx20
)
