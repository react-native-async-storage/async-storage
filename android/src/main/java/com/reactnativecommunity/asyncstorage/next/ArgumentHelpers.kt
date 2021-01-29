package com.reactnativecommunity.asyncstorage.next

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReadableArray

fun ReadableArray.toEntryList(): List<Entry> {
    val list = mutableListOf<Entry>()
    for (keyValue in this.toArrayList()) {
        if (keyValue !is ArrayList<*> || keyValue.size != 2) {
            throw AsyncStorageError.invalidKeyValueFormat()
        }
        val key = keyValue[0]
        val value = keyValue[1]

        if (key == null || key !is String) {
            when (key) {
                null -> throw AsyncStorageError.keyIsNull()
                !is String -> throw AsyncStorageError.keyNotString()
            }
        }

        if (value !is String) {
            throw AsyncStorageError.valueNotString(key)
        }

        list.add(Entry(key, value))
    }
    return list
}

fun ReadableArray.toKeyList(): List<String> {
    val list = this.toArrayList()

    for (item in list) {
        if (item !is String) {
            throw AsyncStorageError.keyIsNull()
        }
    }
    return list as List<String>
}

fun List<Entry>.toKeyValueArgument(): ReadableArray {
    val args = Arguments.createArray()

    for (entry in this) {
        val keyValue = Arguments.createArray()
        keyValue.pushString(entry.key)
        keyValue.pushString(entry.value)
        args.pushArray(keyValue)
    }

    return args
}