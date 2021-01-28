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
import androidx.room.migration.Migration
import androidx.sqlite.db.SupportSQLiteDatabase

private const val DATABASE_VERSION = 2
private const val DATABASE_NAME = "AsyncStorage"
private const val TABLE_NAME = "Storage"
private const val COLUMN_KEY = "key"
private const val COLUMN_VALUE = "value"


@Entity(tableName = TABLE_NAME)
data class Entry(
    @PrimaryKey @ColumnInfo(name = COLUMN_KEY) val key: String,
    @ColumnInfo(name = COLUMN_VALUE) val value: String?
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


/**
 * Previous version of AsyncStorage is violating the SQL standard (based on bug in SQLite),
 * where PrimaryKey ('key' column) should never be null (https://www.sqlite.org/lang_createtable.html#the_primary_key).
 * Because of that, we cannot reuse the old DB, because ROOM is guarded against that case (won't compile).
 *
 * In order to work around this, two steps are necessary:
 *  - Room DB pre-population from the old database file (https://developer.android.com/training/data-storage/room/prepopulate#from-asset)
 *  - Version migration, so that we can mark 'key' column as NOT-NULL
 *
 * This migration will happens only once, when developer enable this feature (when DB is still not created).
 */
@Suppress("ClassName")
private object MIGRATION_TO_NEXT : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        val oldTableName = "catalystLocalStorage" // from ReactDatabaseSupplier

        database.execSQL("CREATE TABLE IF NOT EXISTS `${TABLE_NAME}` (`${COLUMN_KEY}` TEXT NOT NULL, `${COLUMN_VALUE}` TEXT, PRIMARY KEY(`${COLUMN_KEY}`));")

        // even if the old AsyncStorage has checks for not nullable keys
        // make sure we don't copy any, to not fail migration
        database.execSQL("DELETE FROM $oldTableName WHERE `${COLUMN_KEY}` IS NULL")

        database.execSQL(
            """
            INSERT INTO $TABLE_NAME (`${COLUMN_KEY}`, `${COLUMN_VALUE}`)
            SELECT `${COLUMN_KEY}`, `${COLUMN_VALUE}`
            FROM $oldTableName;
        """.trimIndent()
        )
    }
}

@Database(entities = [Entry::class], version = DATABASE_VERSION, exportSchema = true)
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
                val oldDbFile = context.getDatabasePath("RKStorage")
                val db = Room.databaseBuilder(
                    context, StorageDb::class.java, DATABASE_NAME
                )

                if (oldDbFile.exists()) {
                    // migrate data from old database, if it exists
                    db.createFromFile(oldDbFile).addMigrations(MIGRATION_TO_NEXT)
                }

                inst = db.build()
                instance = inst
                return instance!!
            }
        }
    }
}

interface AsyncStorageAccess {
    suspend fun getValues(keys: List<String>): List<Entry>
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

    override suspend fun getValues(keys: List<String>) = access.getValues(keys)
    override suspend fun setValues(entries: List<Entry>) = access.setValues(entries)
    override suspend fun removeValues(keys: List<String>) = access.removeValues(keys)
    override suspend fun getKeys() = access.getKeys()
    override suspend fun clear() = access.clear()
}