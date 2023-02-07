---
id: where_data_stored
title: Where your data is stored
sidebar_label: Where data is stored
---

* **Android** - SQLite
* **iOS** - small values (not exceeding 1024 characters) are serialized and stored in a common `manifest.json` file, while larger values are stored in individual, dedicated files (named as MD5 hashed `key`)
* **macOS** - Same as iOS
* **Web** - window.localStorage
* **Windows** - SQLite