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

class StorageModule(reactContext: ReactContext) : ReactContextBaseJavaModule() {
    override fun getName() = "RNC_AsyncSQLiteDBStorage"

    private val storage: AsyncStorageAccess = StorageSupplier.getInstance(reactContext)
    private val scope = CoroutineScope(
        Dispatchers.IO + CoroutineName("AsyncStorageCoroutine") + SupervisorJob()
    )

    @ReactMethod
    fun getAllKeys(cb: Callback) {
        scope.launch {
            val keys = storage.getKeys()
            val result = Arguments.createArray()
            keys.forEach { result.pushString(it) }
            cb.invoke(result)
        }
    }
}