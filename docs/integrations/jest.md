---
title: Jest integration
---

# Jest integration

AsyncStorage requires a native module that is not available in a Jest environment. The package ships a built-in
in-memory mock at `@react-native-async-storage/async-storage/jest` that replaces the native implementation during
tests.

## Setup

### Transform configuration

The package ships as ESM source, so Jest must be configured to transform it. Add it to the `transformIgnorePatterns` in
your Jest config:

```js
transformIgnorePatterns: [
    'node_modules/(?!@react-native-async-storage/)',
],
```

### Automatic mock file

Create a manual mock file that Jest will pick up automatically for every test:

```
__mocks__/@react-native-async-storage/async-storage.js
```

With content:

```js
module.exports = require("@react-native-async-storage/async-storage/jest");
```

Jest resolves files under `__mocks__/` automatically when the module is imported, so no additional configuration is
needed.

### Inline mock

To mock the module for a specific test file, call `jest.mock` at the top of the file:

```js
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest")
);
```

## What the mock provides

The mock is a full in-memory implementation of the `AsyncStorage` interface. Additionally, it exports
`clearAllMockStorages` to clear all in-memory storages.
Example usage:

```ts
import { clearAllMockStorages } from "@react-native-async-storage/async-storage/jest";

beforeEach(() => {
  clearAllMockStorages();
});
```
