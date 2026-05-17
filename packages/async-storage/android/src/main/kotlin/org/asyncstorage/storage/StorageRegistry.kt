package org.asyncstorage.storage

import android.content.Context
import java.util.concurrent.ConcurrentHashMap
import org.asyncstorage.shared_storage.SharedStorage

/**
 * StorageRegistry is a singleton responsible for managing and providing access to SharedStorage and
 * RNStorage instances in a thread-safe manner.
 */
object StorageRegistry {
    /**
     * Cache for Shared Storages instances. These instances are shared by native and RN
     * implementation.
     */
    private val storages = ConcurrentHashMap<String, SharedStorage>()

    /**
     * Cache for PersistentStorage used by RN module. It uses shared storage singleton instances.
     */
    private val rnStorages = ConcurrentHashMap<String, RNStorage>()

    fun getRNStorage(ctx: Context, name: String): RNStorage =
        rnStorages.computeIfAbsent(name) {
            val storage = storages.getOrPut(name) { SharedStorage(ctx, name) }
            RNStorage(storage, name)
        }

    fun getStorage(ctx: Context, name: String): SharedStorage =
        storages.computeIfAbsent(name) { SharedStorage(ctx, name) }
}
