// Pins the Swift API mirrored by spm-headers/AsyncStorage-Swift.h.
// If this file fails to compile, update both files together.
#if !os(visionOS)
    import React

    // Swift cannot check the header's Objective-C selector spellings or the
    // mangled runtime class names at compile time.

    private let _storageBase: NSObject.Type = RNStorage.self
    private let _registryBase: NSObject.Type = StorageRegistry.self

    private let _get: (RNStorage) -> ([String], @escaping RCTPromiseResolveBlock, @escaping RCTPromiseRejectBlock) -> Void = RNStorage.get(keys:resolver:rejecter:)
    private let _set: (RNStorage) -> ([[String: String]], @escaping RCTPromiseResolveBlock, @escaping RCTPromiseRejectBlock) -> Void = RNStorage.set(values:resolver:rejecter:)
    private let _remove: (RNStorage) -> ([String], @escaping RCTPromiseResolveBlock, @escaping RCTPromiseRejectBlock) -> Void = RNStorage.remove(keys:resolver:rejecter:)
    private let _allKeys: (RNStorage) -> (@escaping RCTPromiseResolveBlock, @escaping RCTPromiseRejectBlock) -> Void = RNStorage.allKeys(resolver:rejecter:)
    private let _clear: (RNStorage) -> (@escaping RCTPromiseResolveBlock, @escaping RCTPromiseRejectBlock) -> Void = RNStorage.clear(resolver:rejecter:)

    private let _shared: () -> StorageRegistry = { StorageRegistry.shared }
    private let _getRNStorage: (StorageRegistry) -> (String) -> RNStorage = StorageRegistry.getRNStorage(dbName:)

    private let _selectors: [Selector] = [
        #selector(RNStorage.get(keys:resolver:rejecter:)),
        #selector(RNStorage.set(values:resolver:rejecter:)),
        #selector(RNStorage.remove(keys:resolver:rejecter:)),
        #selector(RNStorage.allKeys(resolver:rejecter:)),
        #selector(RNStorage.clear(resolver:rejecter:)),
        #selector(getter: StorageRegistry.shared),
        #selector(StorageRegistry.getRNStorage(dbName:)),
    ]
#endif
