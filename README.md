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

React hooks (introduced in 16.8) allow you to use state and async requests without writing a class. For more info on hooks and how to use them, see [hooks documentation](https://reactjs.org/docs/hooks-intro.html) or the [hooks example](docs/Hooks.md) in this repo.

`useAsyncStorage` has no hard-coded dependencies in react hooks, it is just a convenience wrapper around `AsyncStorage`.

```js
import { useAsyncStorage } from '@react-native-community/async-storage';
```

```jsx
const {
  getItem,
  setItem,
  mergeItem,
  removeItem
} = useAsyncStorage('@storage_key');
```

See docs for [api and more examples.](docs/API.md)

## License

MIT