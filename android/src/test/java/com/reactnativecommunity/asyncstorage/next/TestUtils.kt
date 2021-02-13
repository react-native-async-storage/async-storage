package com.reactnativecommunity.asyncstorage.next

import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import com.facebook.react.bridge.WritableArray

fun <T : Any> createNativeCallArguments(vararg list: T): ReadableArray {
    val args = ArrayList(list.toList())
    return TestingArguments(args)
}

internal class TestingArguments<T : Any>(initBackingArray: ArrayList<T> = arrayListOf()) :
    WritableArray {
    private val backArray: ArrayList<T> = initBackingArray
    override fun size() = backArray.size

    override fun toArrayList(): ArrayList<Any> = backArray as ArrayList<Any>

    override fun isNull(index: Int): Boolean {
        TODO("ignored")
    }

    override fun getBoolean(index: Int): Boolean {
        TODO("ignored")
    }

    override fun getDouble(index: Int): Double {
        TODO("ignored")
    }

    override fun getInt(index: Int): Int {
        TODO("ignored")
    }

    override fun getString(index: Int): String? {
        TODO("ignored")
    }

    override fun getArray(index: Int): ReadableArray? {
        TODO("ignored")
    }

    override fun getMap(index: Int): ReadableMap? {
        TODO("ignored")
    }

    override fun getDynamic(index: Int): Dynamic {
        TODO("ignored")
    }

    override fun getType(index: Int): ReadableType {
        TODO("ignored")
    }

    override fun pushNull() {
        TODO("ignored")
    }

    override fun pushBoolean(value: Boolean) {
        TODO("ignored")
    }

    override fun pushDouble(value: Double) {
        TODO("ignored")
    }

    override fun pushInt(value: Int) {
        TODO("ignored")
    }

    override fun pushString(value: String?) {
        TODO("ignored")
    }

    override fun pushArray(array: ReadableArray?) {
        TODO("ignore")
    }

    override fun pushMap(map: ReadableMap?) {
        TODO("ignored")
    }
}