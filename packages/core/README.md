# Async Storage Core

Main Async Storage component. 

## Installation

```bash
$ yarn install @react-native-community/async-storage
```

## Usage

Use `AsyncStorageFactory` to create your Async Storage instance 


```typescript

// storage.js

import ASFactory from '@react-native-community/async-storage'

// use any available Storage Backend
const storageBackend = new StorageBackend();

const mobileStorage = ASFactory.create(storageBackend);

export default mobileStorage;
```

## Providing a storage model

You can provide a `Model` type when creating Async Storage, to have a fully typed storage. 


```typescript
import ASFactory from '@react-native-community/async-storage'

type StorageModel = {
  user: {
    name: string;
    age: number;
  };
  preferences: {
    darkModeEnabled: boolean;
  };
  subscribedChannels: Array<Channel>;
  onboardingCompleted: boolean;
};

// use any available Storage Backend
const storageBackend = new StorageBackend();

const storage = ASFactory.create<StorageModel>(storageBackend);

```
  
## License

MIT.
