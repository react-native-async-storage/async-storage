# Storage Backend: Legacy

An `AsyncStorage` storage backend, fully compatible with former version.  

## Installation


```bash
$ yarn add @react-native-community/async-storage-backend-legacy@next
```


## Usage


```typescript

import LegacyStorage from '@react-native-community/async-storage-backend-legacy';
import AsyncStorageFactory from '@react-native-community/async-storage';

type MyModel = {
  // ...your storage model
}

const legacyStorage = new LegacyStorage();

const storage = AsyncStorageFactory.create<MyModel>(legacyStorage);

// ready to use
export default storage;
```

## License

MIT.
