package tests

import org.junit.Assert.assertThrows
import org.junit.Test

class BundledSqliteAbsentOnAndroidTest {
    @Test
    fun bundledSqliteDriverIsAbsentOnAndroidClasspath() {
        assertThrows(ClassNotFoundException::class.java) {
            Class.forName(
                "androidx.sqlite.driver.bundled.BundledSQLiteDriver",
                false,
                BundledSqliteAbsentOnAndroidTest::class.java.classLoader,
            )
        }
    }
}
