#if !os(visionOS) // not supported
import React
import SharedAsyncStorage

@objc
public class RNStorage: NSObject {
    private let db: SharedStorage

    init(db: SharedStorage) {
        self.db = db
    }

    @objc
    public func get(
        keys: [String],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        runWithReject(rejecter) {
            let result = try await self.db.getValues(keys: keys)
            resolver(result.map { $0.toRNValue() })
        }
    }

    @objc
    public func set(
        values: [[String: String]],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        runWithReject(rejecter) {
            let entries = values.map { entry in Entry.fromRNValue(rnValue: entry) }
            let result = try await self.db.setValues(entries: entries)
            resolver(result.map { entry in entry.toRNValue() })
        }
    }

    @objc
    public func remove(
        keys: [String],
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        runWithReject(rejecter) {
            try await self.db.removeValues(keys: keys)
            resolver(nil)
        }
    }

    @objc
    public func allKeys(
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        runWithReject(rejecter) {
            let keys = try await self.db.getKeys()
            resolver(keys)
        }
    }

    @objc
    public func clear(
        resolver: @escaping RCTPromiseResolveBlock,
        rejecter: @escaping RCTPromiseRejectBlock
    ) {
        runWithReject(rejecter) {
            try await self.db.clear()
            resolver(nil)
        }
    }
}

extension Entry {
    // js expects: {key: string, value: string?}
    func toRNValue() -> [String: String?] {
        ["key": key, "value": value]
    }

    static func fromRNValue(rnValue: [String: String]) -> Entry {
        let key: String = rnValue["key"]! // will throw in not there
        let value = rnValue["value"]

        return Entry(key: key, value: value)
    }
}

func runWithReject(_ reject: @escaping RCTPromiseRejectBlock, block: @escaping () async throws -> Void) {
    Task {
        do {
            try await block()
        } catch let error as NSError {
            if let exception = error.getStorageException() {
                reject("AsyncStorageError", exception.localizedDescription, exception)
            } else {
                reject("AsyncStorageError", error.localizedDescription, error)
            }
        } catch {
            reject("AsyncStorageError", error.localizedDescription, error)
        }
    }
}

extension NSError {
    func getStorageException() -> NSError? {
        guard let exception = userInfo["KotlinException"] as? StorageException else {
            return nil
        }

        if exception is StorageException.SqliteException {
            return NSError(domain: "SqliteException", code: 0, userInfo: [NSLocalizedDescriptionKey: exception.message ?? exception.description(), "type": "SqliteException"])

        } else if exception is StorageException.OtherException {
            return NSError(domain: "OtherException", code: 0, userInfo: [NSLocalizedDescriptionKey: exception.message ?? exception.description(), "type": "OtherException"])
        }

        return nil
    }
}
#endif
