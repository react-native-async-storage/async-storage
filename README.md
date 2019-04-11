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

**Note:** For iOS project using `pods`, run:
	```
	$ cd ios/ && pod install
	```


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

See docs for [api and more examples](docs/API.md), and [brownfield integration guide](docs/AdvancedUsage.md).

## Writing tests

Using [Jest](https://jestjs.io/) for testing? Make sure to check out [docs on how to integrate it with this module.](./docs/Jest-integration.md)

## Contribution

See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

## License

MIT
