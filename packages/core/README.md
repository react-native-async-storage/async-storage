# Async Storage Core

Public-facing API of Async Storage. 

## Install

```bash
$ yarn install @react-native-community/async-storage
```

## API


### `AsyncStorageFactory`

A factory module for `AsyncStorage` instance with selected storage backend attached. 


```typescript
// storage.js

import ASFactory from '@react-native-community/async-storage'

// use any available Storage Backend
const storageBackend = new StorageBackend();

const mobileStorage = ASFactory.create(storageBackend, options);

export default mobileStorage;
```


**Factory options**

`AsyncStorageFactory.create` accepts an options object, that enables additional features.


- *logger*

```typescript
type logger = ((action: LoggerAction) => void) | boolean;
``` 

Used to log `AsyncStorage` method calls and used arguments.
You can provide your own implementation or use provided default logger (enabled by default in DEV mode).


- *errorHandler*

```typescript
type errorHandler = ((error: Error | string) => void) | boolean;
````

Used to report any errors thrown.
You can provide your own implementation or use provided default error handler (enabled by default in DEV mode).


**Providing a storage model**

If you know the structure of the stored data upfront, you can use the full potential of the type system, by providing a type argument to  `AsyncStorageFactory.create<T>` method.


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
  subscribedChannels: Array<string>;
  onboardingCompleted: boolean;
};

// use any available Storage Backend
const storageBackend = new StorageBackend();


const storage = ASFactory.create<StorageModel>(storageBackend);

```
  
## License

MIT

