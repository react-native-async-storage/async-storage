---
id: usage
title: Usage
sidebar_label: Usage
---


**Async Storage** can only store `string` data, so in order to store object data you need to serialize it first. 
For data that can be serialized to JSON you can use `JSON.stringify()` when saving the data and `JSON.parse()` when loading the data.


### Importing

```js
import AsyncStorage from '@react-native-async-storage/async-storage';
```

### Storing data

`setItem()` is used both to add new data item (when no data for given key exists), and to modify existing item (when previous data for given key exists).

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

const getData = async () => {
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

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}

```


### More

For more examples, [head over to API section.](API.md)

