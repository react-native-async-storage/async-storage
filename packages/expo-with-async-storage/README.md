---
title: Expo config plugin
---

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
