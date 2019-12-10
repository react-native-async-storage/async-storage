# Storage Backend: Web

An AsyncStorage backend, targeting web platform. Uses either [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [`sessionStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage).  

## Installation

```bash
$ yarn add @react-native-community/async-storage@next

$ yarn add @react-native-community/async-storage-backend-web@next
```

## Usage

```typescript

import WebStorage from '@react-native-community/async-storage-backend-web';
import AsyncStorageFactory from '@react-native-community/async-storage';

type MyModel = {};


const webStorage = new WebStorage(true);

const storage = AsyncStorageFactory.create<MyModel>(webStorage);


export default storage;
```

## Options

`WebStorage` accepts a single `boolean` argument, deciding if `sessionStorage` should be used instead of `localStorage`. Default is `false`.


## License

MIT.
