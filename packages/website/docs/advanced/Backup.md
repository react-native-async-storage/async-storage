---
id: backup
title: Database backup exclusion
sidebar_label: iCloud backup
---
import PlatformSupport from "../../src/components/Platform.js"

**Supported platforms:**
<PlatformSupport title="iOS/MacOS" platformIcon="icon_ios.svg" />

---

Async Storage stores data in `Application Support` directory, which is backed up by iCloud by default.  
This can lead to unintentional behavior where data is persisted even after an app re-installation.

Async Storage disables that feature by default. 

In order to enable iCloud backup, open your app's `info.plist` in Xcode and add **boolean** entry called **RCTAsyncStorageExcludeFromBackup** and set its value to **NO** (NO as no for exclusion).

Alternatively, you can open `info.plist` in editor and add new entry: 
```diff
+	<key>RCTAsyncStorageExcludeFromBackup</key>
+	<false/>
```
