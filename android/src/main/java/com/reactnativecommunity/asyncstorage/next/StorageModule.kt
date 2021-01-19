package com.reactnativecommunity.asyncstorage.next

import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

class StorageModule(private val reactContext: ReactContext) : ReactContextBaseJavaModule() {
    override fun getName() = "RNC_AsyncSQLiteDBStorage"
}