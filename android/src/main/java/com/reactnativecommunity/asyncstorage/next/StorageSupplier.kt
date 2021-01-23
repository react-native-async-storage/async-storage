package com.reactnativecommunity.asyncstorage.next

import android.content.Context
import androidx.room.ColumnInfo
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.Transaction
import androidx.room.Update

private const val DATABASE_NAME = "RKStorage"
private const val DATABASE_VERSION = 1
private const val TABLE_NAME = "catalystLocalStorage"
private const val COLUMN_KEY = "key"
private const val COLUMN_VALUE = "value"


@Entity(tableName = TABLE_NAME, primaryKeys = ["key"])
data class Entry(
    @PrimaryKey @ColumnInfo(name = COLUMN_KEY) val key: String,
    @ColumnInfo(name = COLUMN_VALUE) val value: String
)

@Dao
private interface StorageDao {

    // fun mergeValues() // todo

    @Transaction
    @Query("SELECT * FROM $TABLE_NAME WHERE `$COLUMN_KEY` IN (:keys)")
    fun getValues(keys: List<String>): List<Entry>

    @Transaction
    fun setValues(entries: List<Entry>) {
        val insertResult = insert(entries)
        with(entries.filterIndexed { i, _ -> insertResult[i] == -1L }) {
            update(this)
        }
    }

    @Transaction
    @Query("DELETE FROM $TABLE_NAME WHERE `$COLUMN_KEY` in (:keys)")
    fun removeValues(keys: List<String>)

    @Transaction
    @Query("SELECT `$COLUMN_KEY` FROM $TABLE_NAME")
    fun getKeys(): List<String>

    @Transaction
    @Query("DELETE FROM $TABLE_NAME")
    fun clear()


    // insert and update are components of setValues - not to be used separately
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    fun insert(entries: List<Entry>): List<Long>
    @Update
    fun update(entries: List<Entry>)
}

@Database(entities = [Entry::class], version = DATABASE_VERSION, exportSchema = false)
private abstract class StorageDb : RoomDatabase() {
    abstract fun storage(): StorageDao

    companion object {
        private var instance: StorageDb? = null

        fun getDatabase(context: Context): StorageDb {
            var inst = instance
            if (inst != null) {
                return inst
            }

            synchronized(this) {
                inst = Room.databaseBuilder(
                    context, StorageDb::class.java, DATABASE_NAME
                ).build()

                instance = inst
                return instance!!
            }
        }
    }
}

interface AsyncStorageAccess {
    suspend fun getValue(keys: List<String>): List<Entry>
    suspend fun setValues(entries: List<Entry>)
    suspend fun removeValues(keys: List<String>)
    suspend fun getKeys(): List<String>
    suspend fun clear()
    // suspend fun mergeValues() // todo
}

class StorageSupplier private constructor(db: StorageDb) : AsyncStorageAccess {
    companion object {
        fun getInstance(ctx: Context): AsyncStorageAccess {
            return StorageSupplier(StorageDb.getDatabase(ctx))
        }
    }

    private val access = db.storage()

    override suspend fun getValue(keys: List<String>) = access.getValues(keys)
    override suspend fun setValues(entries: List<Entry>) = access.setValues(entries)
    override suspend fun removeValues(keys: List<String>) = access.removeValues(keys)
    override suspend fun getKeys() = access.getKeys()
    override suspend fun clear() = access.clear()
}