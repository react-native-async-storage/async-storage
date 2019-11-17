# Async Storage usage

Async Storage is a collection of usable storage backends for your App. 

It comes in two parts: core and storage backend, you want to use.

*Core* is a consumer of the storage, provides you a unified API to save and read data.

*Storage backend* implements an interface that *core* API understands and uses. Its functionality depends on storage itself.


## Install necessary dependencies

In this example, we'll be using [Legacy storage](https://github.com/react-native-community/async-storage/tree/master/packages/storage-legacy).

```bash
# Install core
$ yarn add @react-native-community/async-storage

# Install legacy backend storage
$ yarn add @react-native-community/async-storage-backend-legacy
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
    name: 'test'
  };
  
  await storage.set('user', myUser);
}

```

