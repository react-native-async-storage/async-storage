# Increase AsyncStorage Database Size on Android

On Android there is a default size limit of 6MB an AsyncStorage. If you try to add more data to your AsyncStorage you will recieve an error like this: 

```
database or disk is full (code 13)
```

Disclaimer: This 6MB limit is a sane limit to protect the user from the app storing too much data in the database. This also protects the database from filling up the disk cache and becoming malformed (endTransaction() calls will throw an exception, not rollback, and leave the db malformed). You have to be aware of that risk when increasing the database size. We recommend to ensure that your app does not write more data to AsyncStorage than space is left on disk. Since AsyncStorage is based on SQLite on Android you also have to be aware of the [SQLite limits](https://www.sqlite.org/limits.html).

### How to increase DB size

Go to your MainApplication.java and change the initialization of AsyncStorage in your getPackages() from

```
new AsyncStorage()
```

to

```
new AsyncStorage(100L * 1024L * 1024L)
```

where the 100 defines the number in MB, the new database limit will be. In this example the new database size is 100 MB.
