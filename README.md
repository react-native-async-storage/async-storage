# React Native Async Storage

An asynchronous, persistent, key-value storage system for React Native.


## Getting Started


```
# Install
$ yarn add @react-native-community/async-storage

# Link
$ react-native link @react-native-community/async-storage
```

See docs for [manual linking guide.](docs/Linking.md)


## Usage

### Import

```js
import AsyncStorage from '@react-native-community/async-storage';
```

### Store data
```jsx

storeData = async () => {
  try {
    await AsyncStorage.setItem('@storage_Key', 'stored value')
  } catch (e) {
    // saving error
  }
}

```

### Read data
```jsx

getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key')
    if(value !== null) {
      // value previously stored
    }
  } catch(e) {
    // error reading value
  }
}

```

### useAsyncStorage hook

From React 16.8 onwards, you can use the new hooks API. React hooks allow you to use state and async requests without writing a class. For more info on hooks and how to use them, see [hooks documentation](https://reactjs.org/docs/hooks-intro.html).

```js
import { useEffect } from 'react';
import { useAsyncStorage } from '@react-native-community/async-storage';
```

```jsx
  const { getItem } = useAsyncStorage('@storage_key');

  const readItemFromStorage = async () => {
    const item = await getItem();
    console.log(item);
  }

  useEffect(() => {
    readItemFromStorage();
  }, []);
```

See docs for [api and more examples.](docs/API.md)

## License

MIT