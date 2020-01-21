# Storage Backend: Web

Storage backend for `AsyncStorage`, targeting Web platform.

## Installation

```bash
$ yarn add @react-native-community/async-storage@next

$ yarn add @react-native-community/async-storage-backend-web@next
```

## Usage

```typescript

import WebStorage from '@react-native-community/async-storage-backend-web';
import AsyncStorageFactory from '@react-native-community/async-storage';

type MyModel = {
  userName: string,
  userId: number
};

const webStorage = new WebStorage('idb'); // see storage options below

const storage = AsyncStorageFactory.create<MyModel>(webStorage);


export default storage;
```

## Storage Options

- `storageType`

*values*: `idb` | `local` | `session`
*description*: Type of store to be used. `idb` is [implemented with IndexedDB, largely based on async-storage by Mozilla](https://www.npmjs.com/package/idb-keyval), while `local` and `session` refers to `localStorage` and `sessionStorage` respectively.


## License

MIT.
