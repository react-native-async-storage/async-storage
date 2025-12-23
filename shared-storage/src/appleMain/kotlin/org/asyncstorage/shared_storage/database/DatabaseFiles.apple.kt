package org.asyncstorage.shared_storage.database

import kotlinx.cinterop.BetaInteropApi
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.ObjCObjectVar
import kotlinx.cinterop.alloc
import kotlinx.cinterop.memScoped
import kotlinx.cinterop.ptr
import kotlinx.cinterop.value
import org.asyncstorage.shared_storage.PlatformContext
import platform.Foundation.NSApplicationSupportDirectory
import platform.Foundation.NSBundle
import platform.Foundation.NSCharacterSet
import platform.Foundation.NSError
import platform.Foundation.NSFileManager
import platform.Foundation.NSString
import platform.Foundation.NSURL
import platform.Foundation.NSURLIsExcludedFromBackupKey
import platform.Foundation.NSUserDomainMask
import platform.Foundation.URLQueryAllowedCharacterSet
import platform.Foundation.stringByAddingPercentEncodingWithAllowedCharacters

@Throws(IllegalStateException::class, IllegalArgumentException::class)
actual fun DatabaseFiles.Companion.of(
    context: PlatformContext,
    databaseName: String,
): DatabaseFiles {
    val databasePath = getDatabasesPath()
    return DatabaseFiles(databaseName, databasePath).also {
        createDbDirectory(it.directoryAbsolutePath)
    }
}

internal fun DatabaseFiles.Companion.ofInMemory(): DatabaseFiles {
    return DatabaseFiles("in-memory", "/")
}

@OptIn(ExperimentalForeignApi::class, BetaInteropApi::class)
@Throws(Exception::class)
private fun createDbDirectory(dir: String) {
    val fs = NSFileManager.defaultManager
    val url = dir.asEscapedURL()

    if (!fs.fileExistsAtPath(dir)) {
        memScoped {
            val errorPtr = alloc<ObjCObjectVar<NSError?>>()
            fs.createDirectoryAtPath(
                path = dir,
                withIntermediateDirectories = true,
                attributes = null,
                error = errorPtr.ptr,
            )
            errorPtr.value?.let { error(it.localizedDescription) }
        }
    }

    // exclude databases directory from iCloud backup
    url.setResourceValue(value = true, forKey = NSURLIsExcludedFromBackupKey, error = null)
}

@OptIn(ExperimentalForeignApi::class, BetaInteropApi::class)
private fun getDatabasesPath(): String {
    memScoped {
        val errorPtr = alloc<ObjCObjectVar<NSError?>>()

        val supportDirUrl =
            NSFileManager.defaultManager.URLForDirectory(
                directory = NSApplicationSupportDirectory,
                inDomain = NSUserDomainMask,
                appropriateForURL = null,
                create = false,
                error = errorPtr.ptr,
            )

        errorPtr.value?.let { error(it.localizedDescription) }
        val supportDir = supportDirUrl?.path
        requireNotNull(supportDir)

        val bundleId = NSBundle.mainBundle.bundleIdentifier ?: "AsyncStorageDatabases"

        return supportDir.removeSuffix("/") + "/${bundleId.removeSuffix("/")}"
    }
}

/** Turns given string into URL-safe URL. This is required for file paths on iOS 16 and below */
private fun String.asEscapedURL(): NSURL {
    val escaped =
        (this as NSString).stringByAddingPercentEncodingWithAllowedCharacters(
            NSCharacterSet.URLQueryAllowedCharacterSet
        )
    requireNotNull(escaped)
    val escapedUrl = NSURL.URLWithString(escaped)
    requireNotNull(escapedUrl)
    return escapedUrl
}
