# Increase AsyncStorage Database Size on Android

Current Async Storage's size is set to 6MB. Going over this limit causes `database or disk is full` error.

```
database or disk is full (code 13)
```

Disclaimer: This 6MB limit is a sane limit to protect the user from the app storing too much data in the database. This also protects the database from filling up the disk cache and becoming malformed (endTransaction() calls will throw an exception, not rollback, and leave the db malformed). You have to be aware of that risk when increasing the database size. We recommend to ensure that your app does not write more data to AsyncStorage than space is left on disk. Since AsyncStorage is based on SQLite on Android you also have to be aware of the [SQLite limits](https://www.sqlite.org/limits.html).

### Increase limit

Modify your `MainApplication.java`'s `getPackages`:

```
new AsyncStorage()
```

to

```
new AsyncStorage(100L * 1024L * 1024L)
```

Where the 100 defines the new size in MB. In this example, new limit is 100 MB.
