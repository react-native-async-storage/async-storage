package com.reactnativecommunity.asyncstorage.next

import com.facebook.react.bridge.JavaOnlyArray
import com.facebook.react.bridge.ReadableArray

fun List<Any?>.toReadableArray(): ReadableArray {
    val arr = JavaOnlyArray()
    forEach {
        when (it) {
            null -> arr.pushNull()
            is Boolean -> arr.pushBoolean(it)
            is Double -> arr.pushDouble(it)
            is Int -> arr.pushInt(it)
            is String -> arr.pushString(it)
            else -> throw NotImplementedError()
        }
    }
    return arr
}
