---
title: Expo config plugin
---

!!! warning "No longer required for version 3.1.0+"

    This plugin originally was intended to include locally build artifact for Android.
    With version 3.1.0 of Async Storage, this artifact is provided via Maven Central (no extra steps needed).


# Expo config plugin for Async Storage

An [Expo config plugin](https://docs.expo.dev/config-plugins/introduction/) that automatically configures
`@react-native-async-storage/async-storage` for managed and bare Expo projects.

## Installation

**1. Install the plugin:**

```bash
yarn add @react-native-async-storage/expo-with-async-storage
```

**2. Add the plugin to your `app.json`:**

```json
{
  "expo": {
    "plugins": [
      "@react-native-async-storage/expo-with-async-storage"
    ]
  }
}
```

After adding the plugin, run `expo prebuild` (or `eas build`) to apply the changes.

!!! note "Expo version requirement"

    This plugin requires **`expo >= 53`**.
