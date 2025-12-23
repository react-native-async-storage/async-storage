package tests

import app.cash.turbine.test
import kotlin.random.Random
import kotlin.random.nextInt
import kotlin.test.AfterTest
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertContentEquals
import kotlin.test.assertEquals
import kotlin.test.assertNull
import kotlin.time.Duration.Companion.milliseconds
import kotlinx.coroutines.delay
import kotlinx.coroutines.test.runTest
import org.asyncstorage.shared_storage.Entry
import org.asyncstorage.shared_storage.SharedStorage

/**
 * todo: testing scenarios:
 * - Concurrent set and removals
 * - flow cancellation
 */
class SharedStorageTest : TestRunner() {
    val utils = StorageUtils()
    private lateinit var storage: SharedStorage

    @BeforeTest
    fun prepare() {
        storage = utils.getStorage()
    }

    @AfterTest
    fun cleanup() {
        utils.cleanup()
    }

    @Test
    fun `performs basic crud operation`() = runTest {
        var data = storage.getValues(listOf("key1", "key2"))
        assertEquals(2, data.size, "not returned requested items")

        val entry1 = Entry("key1", "value1")
        val entry2 = Entry("key2", "value2")
        val result = storage.setValues(listOf(entry1, entry2))
        assertEquals(2, result.size)
        assertEquals(listOf(entry1, entry2), result)

        storage.removeValues(listOf("key2"))
        data = storage.getValues(listOf("key1", "key2"))
        assertEquals(2, data.size)
        assertEquals("key1", data.first().key)
        assertEquals("value1", data.first().value)
        assertEquals(data[1].key, "key2")
        assertNull(data[1].value, "value 2 not removed")
    }

    @Test
    fun `overrides existing keys with new value`() = runTest {
        var entry = Entry("my-key", "my super value")
        assertEquals("my super value", storage.setValues(listOf(entry)).first().value)
        entry = entry.copy(value = "my updated value")
        val result = storage.setValues(listOf(entry))
        assertEquals("my updated value", result.first().value)
    }

    @Test
    fun `ignores empty saves and removes`() = runTest {
        assertEquals(0, storage.getValues(listOf()).size)
        assertEquals(0, storage.getKeys().size)
        storage.setValues(listOf())
        assertEquals(0, storage.getKeys().size)
        storage.removeValues(listOf())
    }

    @Test
    fun `prevents duplicate insertions`() = runTest {
        val entry = Entry("key1", value = "1")
        storage.setValues(
            listOf(
                entry,
                entry.copy(value = "2"),
                entry.copy(value = "3"),
                entry.copy(value = "4"),
                entry.copy(value = "5"),
            )
        )
        assertEquals("5", storage.getValues(listOf(entry.key)).first().value)
        assertEquals(1, storage.getKeys().size)
    }

    @Test
    fun `ignores duplicate keys on removal`() = runTest {
        storage.setValues(listOf(Entry("key1", value = "1"), Entry("key2", value = "2")))
        assertEquals(2, storage.getKeys().size)
        storage.removeValues(listOf("key1", "key2", "key1", "key2", "key2", "key1", "diff key"))
        assertEquals(0, storage.getKeys().size)
    }

    @Test
    fun `clears whole storage`() = runTest {
        val items = List(Random.nextInt(3..10)) { Entry("key-$it", "$it") }
        storage.setValues(items)
        assertEquals(items.size, storage.getKeys().size)
        storage.clear()
        assertEquals(0, storage.getKeys().size)
    }

    @Test
    fun `returns all requested entries`() = runTest {
        val testValues =
            listOf(Entry("key1", "value1"), Entry("key2", "value2"), Entry("key3", "value3"))
        val result = storage.setValues(testValues)
        assertEquals(3, result.size)

        assertEquals(2, storage.getValues(listOf("nonex1", "nonex2")).size)
        assertEquals(listOf(null, null), storage.getValues(listOf("nonex1", "nonex2")).map { it.value })

        val values =
            storage.getValues(listOf("key1", "key2", "key3", "not existing", "diff key", "key4"))
        assertEquals(6, values.size)
    }

    @Test
    fun `emits values when updating`() = runTest {
        val original = Entry("original", "one")
        storage.getValuesFlow(listOf(original.key)).test {
            val item =
                assertEquals(1, awaitItem().size, "initial value should be 1")

            storage.setValues(listOf(original))
            var items = awaitItem()
            assertEquals(1, items.size)
            assertEquals("one", items.first().value)

            storage.setValues(listOf(original.copy(value = "two")))
            items = awaitItem()
            assertEquals(1, items.size, "size not matching after set")
            assertEquals("two", items.first().value)

            storage.removeValues(listOf(original.key))
            items = awaitItem()
            assertEquals(1, items.size, "should be 1, as requested")
            assertEquals(null, items.first()?.value, "value not removed")

            storage.setValues(listOf(original.copy(value = "three")))
            items = awaitItem()
            assertEquals(1, items.size)
            assertEquals("three", items.first().value)

            // this should not trigger the database update
            storage.setValues(listOf(Entry("don't mind", "me")))
            delay(500.milliseconds)
            expectNoEvents()
        }
    }

    @Test
    fun `returns all keys used in storage`() = runTest {
        storage.setValues(
            listOf(
                Entry("key1", "value1"),
                Entry("key2", "value2"),
                Entry("key3", "value3"),
                Entry("key4", "value4"),
            )
        )

        assertContentEquals(
            listOf("key1", "key2", "key3", "key4").sorted(),
            storage.getKeys().sorted(),
        )
        storage.removeValues(listOf("key2", "key4"))
        assertContentEquals(listOf("key1", "key3").sorted(), storage.getKeys().sorted())
    }

    @Test
    fun `emits keys on updates to database`() = runTest {
        storage.getKeysFlow().test {
            var item = awaitItem()
            assertEquals(0, item.size)

            storage.setValues(listOf(Entry("key", "value")))
            item = awaitItem()
            assertEquals(1, item.size)
            assertEquals("key", item.first())
            storage.removeValues(listOf("key"))
            assertEquals(0, awaitItem().size)
        }
    }

    @Test
    fun `returns requested values even if not existing`() = runTest {
        val entry1 = Entry("key1", "value1")
        val result = storage.setValues(listOf(entry1))
        assertEquals(entry1, result.first())


        val entries = storage.getValues(listOf("key1", "key2", "key3")).sortedBy { it.key }

        assertEquals(3, entries.size)

        assertContentEquals(
            listOf(entry1, Entry("key2", null), Entry("key3", null)).sortedBy { it.key },
            entries
        )


        assertContentEquals(
            listOf(Entry("non-existing", null), Entry("another-null", null)),
            storage.getValues(listOf("non-existing", "another-null"))
        )

    }

    @Test
    fun `does not override stored values if not required`() = runTest {
        val entry1 = Entry("key1", "value1")
        val entry2 = Entry("key2", "value2")
        val entry3 = Entry("key3", "value3")

        storage.setValues(listOf(entry1, entry2, entry3))


        storage.setValues(listOf(entry2.copy(value = "new value")))

        val entries = storage.getValues(listOf("key1", "key2", "key3"))
        assertEquals("value1", entries[0].value)
        assertEquals("new value", entries[1].value)
        assertEquals("value3", entries[2].value)
    }
}
