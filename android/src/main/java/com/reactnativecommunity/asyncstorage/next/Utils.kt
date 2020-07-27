/**
 * Copyright (c) Krzysztof Borowy
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.reactnativecommunity.asyncstorage.next

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

fun ReadableArray.toKeyList(): List<String> {
  val keys: MutableList<String> = mutableListOf()
  for (index in 0 until this.size()) {
    val key = getString(index)
    if (key != null) {
      keys.add(key)
    }
  }
  return keys
}

fun ReadableMap.toAsyncStorageEntries(): List<AsyncStorageEntry> {
  val entryList = mutableListOf<AsyncStorageEntry>()
  val keyIterator = keySetIterator()
  while (keyIterator.hasNextKey()) {
    val key = keyIterator.nextKey()
    val value = getString(key)
    entryList.add(AsyncStorageEntry(key, value))
  }
  return entryList
}

fun List<KeyType>.toReadableArray(): ReadableArray {
  val keyArray = Arguments.createArray()
  forEach { key ->
    keyArray.pushString(key)
  }
  return keyArray
}

fun List<AsyncStorageEntry>.toReadableMap(): ReadableMap {
  val result = Arguments.createMap()
  forEach {
    result.putString(it.key, it.value)
  }
  return result
}