package com.reactnativecommunity.asyncstorage.next

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class StorageModule(reactContext: ReactContext) : ReactContextBaseJavaModule(), CoroutineScope {
    override fun getName() = "RNC_AsyncSQLiteDBStorage"

    override val coroutineContext =
        Dispatchers.IO + CoroutineName("AsyncStorageScope") + SupervisorJob()

    private val storage = StorageSupplier.getInstance(reactContext)

    /**
     * Todo:
     *  - Documenting the migration,
     *  - access from Native (Java interop)
     */

    @ReactMethod
    fun multiGet(keys: ReadableArray, cb: Callback) {
        launch(createExceptionHandler(cb)) {
            val entries = storage.getValues(keys.toKeyList())
            cb(null, entries.toKeyValueArgument())
        }
    }

    @ReactMethod
    fun multiSet(keyValueArray: ReadableArray, cb: Callback) {
        launch(createExceptionHandler(cb)) {
            val entries = keyValueArray.toEntryList()
            storage.setValues(entries)
            cb(null)
        }
    }

    @ReactMethod
    fun multiRemove(keys: ReadableArray, cb: Callback) {
        launch(createExceptionHandler(cb)) {
            storage.removeValues(keys.toKeyList())
            cb(null)
        }
    }

    @ReactMethod
    fun multiMerge(keyValueArray: ReadableArray, cb: Callback) {
        launch(createExceptionHandler(cb)) {
            val entries = keyValueArray.toEntryList()
            storage.mergeValues(entries)
            cb(null)
        }
    }

    @ReactMethod
    fun getAllKeys(cb: Callback) {
        launch(createExceptionHandler(cb)) {
            val keys = storage.getKeys()
            val result = Arguments.createArray()
            keys.forEach { result.pushString(it) }
            cb.invoke(null, result)
        }
    }

    @ReactMethod
    fun clear(cb: Callback) {
        launch(createExceptionHandler(cb)) {
            storage.clear()
            cb(null)
        }
    }
}