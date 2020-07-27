/**
 * Copyright (c) Krzysztof Borowy
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.reactnativecommunity.asyncstorage.next

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlin.coroutines.CoroutineContext

class AsyncStorageModuleNext(reactAppContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactAppContext), CoroutineScope {
  companion object {
    const val MODULE_NAME = "RNC_AsyncStorageNext"
  }

  override val coroutineContext: CoroutineContext
    get() = Dispatchers.IO + CoroutineName("AsyncStorageCoroutine")

  private val db: ASDao
    get() = AsyncStorageDB.getDatabase(reactApplicationContext).getASDao()

  override fun getName() = MODULE_NAME

  @ReactMethod
  fun getSingle(key: String, promise: Promise) {
    launch {
      val value = db.get(key)
      promise.resolve(value)
    }
  }

  @ReactMethod
  fun setSingle(key: String, value: String?, promise: Promise) {
    val entry = AsyncStorageEntry(key, value)
    launch {
      db.set(entry)
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun deleteSingle(key: String, promise: Promise) {
    val entry = AsyncStorageEntry(key)
    launch {
      db.delete(entry)
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun getMany(keys: ReadableArray, promise: Promise) {
    val queryKeys = keys.toKeyList()

    launch {
      val entries = db.getMany(queryKeys).toReadableMap()
      promise.resolve(entries)
    }
  }

  @ReactMethod
  fun setMany(entries: ReadableMap, promise: Promise) {
    val entryList = entries.toAsyncStorageEntries()

    launch {
      db.setMany(entryList)
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun deleteMany(keys: ReadableArray, promise: Promise) {
    val keysToDelete = keys.toKeyList()

    launch {
      db.deleteMany(keysToDelete)
      promise.resolve(true)
    }
  }

  @ReactMethod
  fun getAllKeys(promise: Promise) {
    launch {
      val keys = db.keys().toReadableArray()
      promise.resolve(keys)
    }
  }

  @ReactMethod
  fun dropDatabase(promise: Promise) {
    launch {
      db.dropDatabase()
      promise.resolve(true)
    }
  }
}