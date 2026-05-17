package org.asyncstorage.shared_storage

import android.content.res.Resources
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.driver.AndroidSQLiteDriver
import kotlin.math.max
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.asExecutor
import org.asyncstorage.shared_storage.database.DatabaseFiles
import org.asyncstorage.shared_storage.database.StorageDatabase
import org.asyncstorage.shared_storage.database.of
import org.asyncstorage.shared_storage.database.ofInMemory

@Suppress("unused") // used in consumer app
@OptIn(DelicateCoroutinesApi::class, ExperimentalCoroutinesApi::class)
actual fun SharedStorage(context: PlatformContext, databaseName: String): SharedStorage {

    val dbFiles = DatabaseFiles.of(context, databaseName)
    val writeDispatcher = Dispatchers.IO.limitedParallelism(1, "$databaseName-writer")
    val readDispatcher =
        Dispatchers.IO.limitedParallelism(getWALConnectionPoolSize(), "$databaseName-reader")

    val db =
        Room.databaseBuilder<StorageDatabase>(context, name = dbFiles.fileAbsolutePath)
            .setDriver(AndroidSQLiteDriver())
            .setQueryExecutor(readDispatcher.asExecutor())
            .setTransactionExecutor(writeDispatcher.asExecutor())
            .setJournalMode(RoomDatabase.JournalMode.WRITE_AHEAD_LOGGING)
            .build()

    return SharedStorageImpl(db, dbFiles)
}

internal actual fun sharedStorageInMemory(context: PlatformContext): SharedStorage {
    val db =
        Room.inMemoryDatabaseBuilder<StorageDatabase>(context)
            .setJournalMode(RoomDatabase.JournalMode.WRITE_AHEAD_LOGGING)
            .build()

    return SharedStorageImpl(db, DatabaseFiles.ofInMemory())
}

// as per https://blog.p-y.wtf/parallelism-with-android-sqlite
private fun getWALConnectionPoolSize(): Int =
    try {
        val resources = Resources.getSystem()
        val resId = resources.getIdentifier("db_connection_pool_size", "integer", "android")
        if (resId != 0) {
            max(2, resources.getInteger(resId))
        } else {
            2
        }
    } catch (_: Exception) {
        2
    }
