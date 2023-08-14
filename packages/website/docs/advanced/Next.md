---
id: next
title: Next storage implementation
sidebar_label: Next storage implementation
---
import PlatformSupport from "../../src/components/Platform.js"

**Supported platforms:**
<PlatformSupport title="Android" platformIcon="icon_android.svg"></PlatformSupport>

---

### Motivation

Current implementation of persistence layer is created using [SQLiteOpenHelper](https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper), 
a helper class that manages database creation and migrations. Even if this approach is powerful, the lack of compile time query verification and a big boilerplate of mapping SQLite queries  to actual values make this implementation prone to many errors.

This Async Storage feature improves the persistence layer, using modern approaches to access SQLite (using [Room](https://developer.android.com/training/data-storage/room)), to reduce possible anomalies to the minimum. 
On top of that, it allows accessing AsyncStorage from the native side, useful in [Brownfield integration.](BrownfieldIntegration.md#android)

### Migration

This feature requires no migration from the developer perspective - the current database will be recreated (based on the current one), meaning user won't lose any data if you decide to opt in.
There's a small drawback to know - the database "recreation" happens **only once**. 

#### How it works

The new database (the one used by this feature) will be created based on the current database file, if the new one does not exist yet. 
If we detect that there's already the new database on the device, recreation will not kick in.


#### Why is it important

Let's say you enabled the feature for the first time - recreation kicks in and the old database file is untouched.
If you decide to disable the feature, your users will be back using old database. No data migrations is happening from new to old database file.
When you enable the feature again, the new database is **not** recreated, because it already exists, and no data is copied over.


### Enable

In your project's `android` directory, locate `gradle.properties` file (if it does not exist, create one) and add the line:
```groovy
AsyncStorage_useNextStorage=true
```

### Configuration

**Kotlin version**

Next storage is tested against Kotlin version `1.8.10`. 
You can specify different version, in one of two ways:

- add `kotlinVersion` extension to the `rootProject`:

```groovy
rootProject.ext.kotlinVersion = '1.8.10'
```

- specify `AsyncStorage_kotlinVersion` in `gradle.properties`:

```groovy
AsyncStorage_kotlinVersion=1.8.10
```

**Room**

Next AsyncStorage uses [Room persistence library](https://developer.android.com/jetpack/androidx/releases/room) to store data.
Currently, tested version is `2.4.3`. You can specify different version, by adding a flag to `gradle.properties`:

```groovy
AsyncStorage_next_roomVersion=2.4.3
```

### Notable changes

Alongside of a warning regarding `key`/`value`, errors are thrown when:

- Your `key` is `null` or `not a string`
- You provide value that is `not a string` 
