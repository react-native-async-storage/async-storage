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
On top of that, it allows to access Async Storage from the native side, useful in [Brownfield integration.](BrownfieldIntegration.md#android)

### Migration

This feature requires no migration from the developer perspective - the current database will be recreated (based on the current one), meaning user won't lose any data if you decide to opt in.
There's a small drawback to know - the database "recreation" happens **only once**. Unless you want to disable the feature in the future, there's nothing to worry about.

#### How it works

The new database (the one used by this feature) will be created based on the current database file, if the new one does not exist yet. 
If we detect that there's already the new database on the device, recreation will not kick in.


#### Why is it important

Let's say you enabled the feature for the first time - recreation kicks in and the old database file is untouched.
If you decide to disable the feature, your users will be back using old database. No data migrations is happening from new to old database file.
When you enable the feature again, the new database is **not** recreated, because it already exists, and no data is copied over.


### Enabling

1. In your project's `android` directory, locate root `build.gradle` file. Add Kotlin dependency to the `buildscript`:

```diff
buildscript {
    ext {
        // other extensions
+        kotlinVersion = '1.4.21'
    }
    
    dependencies {
        // other dependencies
+        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion"
    }
}

```

2. In the same directory (normally `android`) locate `gradle.properties` file (if does not exists, create one) and add the line:

```groovy
AsyncStorage_useNextStorage=true
```

**How to specifying Kotlin version**

Supported Kotlin versions are `1.4.x`. You can specify which one to use in two ways:

- having an `kotlinVersion` extension on the `rootProject` (recommended):

```groovy
rootProject.ext.kotlinVersion = '1.4.21'
```

- specify `AsyncStorage_kotlinVersion` in `gradle.properties`:

```groovy
AsyncStorage_kotlinVersion=1.4.21
```

### Notable changes

Alongside of a warning regarding `key`/`value`, errors are thrown when:

- Your `key` is `null` or `not a string`
- You provide value that is `not a string` 
