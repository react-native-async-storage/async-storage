/**
 * Copyright (c) Krzysztof Borowy
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.reactnativecommunity.asyncstorage.next

import android.content.Context
import androidx.room.ColumnInfo
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Delete
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase

typealias KeyType = String
typealias ValueType = String?

// todo: change those to use old DB
// todo: unit tests
const val DB_NAME = "AsyncStorageNextDB"
const val DB_VERSION = 1
const val TABLE_NAME = "as_table"
const val KEY_COLUMN = "as_keys"
const val VALUE_COLUMN = "as_value"

// The only table in this DB

@Entity(tableName = TABLE_NAME)
data class AsyncStorageEntry(
  @PrimaryKey
  @ColumnInfo(name = KEY_COLUMN)
  val key: String,
  @ColumnInfo(name = VALUE_COLUMN)
  val value: String? = null
)

@Dao
interface ASDao {

  @Query("SELECT $VALUE_COLUMN FROM $TABLE_NAME WHERE $KEY_COLUMN = :key")
  suspend fun get(key: KeyType): ValueType

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun set(entry: AsyncStorageEntry)

  @Delete
  suspend fun delete(entry: AsyncStorageEntry)

  @Query("SELECT $KEY_COLUMN FROM $TABLE_NAME")
  suspend fun keys(): List<KeyType>

  @Query("DELETE from $TABLE_NAME")
  suspend fun dropDatabase()

  @Insert(onConflict = OnConflictStrategy.REPLACE)
  suspend fun setMany(entries: List<AsyncStorageEntry>)

  @Query("SELECT * FROM $TABLE_NAME WHERE $KEY_COLUMN in (:keys)")
  suspend fun getMany(keys: List<KeyType>): List<AsyncStorageEntry>

  @Query("DELETE FROM $TABLE_NAME WHERE $KEY_COLUMN in (:keys)")
  suspend fun deleteMany(keys: List<KeyType>)
}

@Database(entities = [AsyncStorageEntry::class], version = DB_VERSION)
abstract class AsyncStorageDB : RoomDatabase() {

  companion object {
    private var instance: AsyncStorageDB? = null

    fun getDatabase(context: Context): AsyncStorageDB {

      var inst = instance

      if (inst != null) {
        return inst
      }
      synchronized(this) {
        inst = Room
          .databaseBuilder(context, AsyncStorageDB::class.java, DB_NAME)
          .build()

        instance = inst
        return instance!!
      }
    }
  }

  abstract fun getASDao(): ASDao
}

