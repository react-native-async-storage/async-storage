#if !os(visionOS) // not supported
    import SharedAsyncStorage

    /**
     * StorageRegistry is a singleton responsible for managing and providing access to SharedStorage and
     * RNStorage instances in a thread-safe manner.
     */
    @objc
    public class StorageRegistry: NSObject {
        @objc
        public static let shared = StorageRegistry()

        private let lock = NSLock()
        private var storages: [String: SharedStorage] = [:]
        private var rnStorages: [String: RNStorage] = [:]

        override private init() {
            super.init()
        }

        @objc
        public func getRNStorage(dbName: String) -> RNStorage {
            lock.lock()
            defer {
                lock.unlock()
            }

            return rnStorages[dbName] ?? {
                let storage = storages[dbName] ?? {
                    let s = SharedStorage(context: PlatformContext.Instance(), databaseName: dbName)
                    storages[dbName] = s
                    return s
                }()
                let rnStorage = RNStorage(db: storage)
                rnStorages[dbName] = rnStorage
                return rnStorage
            }()
        }

        public func getStorage(dbName: String) -> SharedStorage {
            lock.lock()
            defer {
                lock.unlock()
            }

            return storages[dbName] ?? {
                let s = SharedStorage(context: PlatformContext.Instance(), databaseName: dbName)
                storages[dbName] = s
                return s
            }()
        }
    }
#endif
