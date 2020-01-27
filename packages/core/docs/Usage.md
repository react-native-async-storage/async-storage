# Async Storage usage

Async Storage is a collection of persistent storage for different platforms, with unified API.

It comes in two parts: the core and storage itself.

*Core* - a consumer for the storage, provides a unified API to use it.

*Storage backend* - platform-dependant implementation of persistent data storage.


## Install necessary dependencies

In this example, [Legacy storage](https://github.com/react-native-community/async-storage/tree/master/packages/storage-legacy) is used.

```bash
# Install core

$ yarn add @react-native-community/async-storage@next
```

```bash
# Install legacy backend storage

$ yarn add @react-native-community/async-storage-backend-legacy@next
```


## Create an instance of AsyncStorage

```typescript
// storage.ts

import AsyncStorageFactory from '@react-native-community/async-storage';
import LegacyStorage from '@react-native-community/async-storage-backend-legacy';

const legacyStorage = new LegacyStorage();

export type StorageModel = {
  user: {
    name: string
    age: number
  }
}

const storage = AsyncStorageFactory.create<StorageModel>(legacyStorage)

export default storage;
```

## Use created instance

Import previously exported AsyncStorage instance and use it. [See full API here.](https://github.com/react-native-community/async-storage/tree/master/packages/core/docs/API.md)


```typescript

import storage from './storage.ts';


async function saveItem() {
  const myUser = {
    name: 'John',
    age: 22
  };
  
  await storage.set('user', myUser);
}

```

