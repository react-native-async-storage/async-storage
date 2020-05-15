# React Native Async Storage

An asynchronous, unencrypted, persistent, key-value storage system for React Native.


## Supported platforms

- iOS
- Android
- [Web](https://github.com/react-native-community/async-storage/releases/tag/v1.9.0)
- [MacOS](https://github.com/react-native-community/async-storage/releases/tag/v1.8.1)
- [Windows](https://github.com/react-native-community/async-storage/releases/tag/v1.10.0)


## Getting Started


### Install

```
$ yarn add @react-native-community/async-storage
```

### Link

- **React Native 0.60+**

[CLI autolink feature](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md) links the module while building the app. 

Use CocoaPods to add the native `RNAsyncStorage` to your project:

```bash
$ npx pod-install
```

- **React Native <= 0.59**


```bash
$ react-native link @react-native-community/async-storage
```

*Note:* For `macOS` and `Windows` the [manual linking](docs/Linking.md) is currently the only linking option.


See docs for [manual linking guide.](docs/Linking.md)

### **Upgrading to React Native *0.60+*** 
 
React Native 0.60+ comes with `autolinking` feature, which automatically links Native Modules in your project.
In order to get it to work, make sure you `unlink` `Async Storage` first (if you had linked it before):

```bash
$ react-native unlink @react-native-community/async-storage
```


## Usage

AsyncStorage can only store `string` data, so in order to store object data you need to serialize it first. 
For data that can be serialized to JSON you can use `JSON.stringify()` when saving the data and `JSON.parse()` when loading the data.


### Importing

```js
import AsyncStorage from '@react-native-community/async-storage';
```

### Storing data

`setItem()` is used both to add new data item (when no data for given key exists), and to modify exiting item (when previous data for given key exists).

#### Storing string value
```jsx
const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('@storage_Key', value)
  } catch (e) {
    // saving error
  }
}
```

#### Storing object value
```jsx
const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch (e) {
    // saving error
  }
}
```

### Reading data

`getItem` returns a promise that either resolves to stored value when data is found for given key, or returns `null` otherwise.  

#### Reading string value
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
#### Reading object value 

```jsx

getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

```

## Advanced usage
See docs for [API and more examples](docs/API.md) or [advanced usages](docs/advanced).

## Writing tests

Using [Jest](https://jestjs.io/) for testing? Make sure to check out [docs on how to integrate it with this module.](./docs/Jest-integration.md)

## Contribution

See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

## License

MIT
