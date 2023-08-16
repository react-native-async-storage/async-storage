---
id: api
title: API
sidebar_label: API
---


<!-- ------------------------ GET ITEM ------------------------ -->

## `getItem`

Gets a string value for given `key`. This function can either return a string value for existing `key` or return `null` otherwise.

In order to store object value, you need to deserialize it, e.g. using `JSON.parse()`.

*Note (legacy)*: you can use optional callback as an alternative for returned promise.

**Signature**:

```js
static getItem(key: string, [callback]: ?(error: ?Error, result: ?string) => void): Promise
```

**Returns**:

`Promise` resolving with a string value, if entry exists for given `key`, or `null` otherwise.

`Promise` can also be rejected in case of underlying storage error.

**Example**:

```js
getMyStringValue = async () => {
  try {
    return await AsyncStorage.getItem('@key')
  } catch(e) {
    // read error
  }

  console.log('Done.')
}
```

```js
getMyObject = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@key')
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch(e) {
    // read error
  }

  console.log('Done.')
}
```


<br />
<br />

<!-- ------------------------ SET ITEM ------------------------ -->

## `setItem`

Sets a string `value` for given `key`. This operation can either modify an existing entry, if it did exist for given `key`, or add new one otherwise.

In order to store object value, you need to serialize it, e.g. using `JSON.stringify()`.

*Note (legacy)*: you can use optional callback as an alternative for returned promise.

**Signature**:

```js
static setItem(key: string, value: string, [callback]: ?(error: ?Error) => void): Promise
```

**Returns**:

`Promise` resolving when the set operation is completed.

`Promise` can also be rejected in case of underlying storage error.

**Example**:

```js
setStringValue = async (value) => {
  try {
    await AsyncStorage.setItem('key', value)
  } catch(e) {
    // save error
  }

  console.log('Done.')
}
```

```js
setObjectValue = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('key', jsonValue)
  } catch(e) {
    // save error
  }

  console.log('Done.')
}
```

<br />
<br />

<!-- ------------------------ MERGE ITEM ------------------------ -->

## `mergeItem`

Merges an existing value stored under `key`, with new `value`, assuming both values are **stringified JSON**.

**Signature**:

```js
static mergeItem(key: string, value: string, [callback]: ?(error: ?Error) => void): Promise
```

**Returns**:

`Promise` with merged data, if exists, `null` otherwise.

**Example**:

```js
const USER_1 = {
  name: 'Tom',
  age: 20,
  traits: {
    hair: 'black',
    eyes: 'blue'
  }
}

const USER_2 = {
  name: 'Sarah',
  age: 21,
  hobby: 'cars',
  traits: {
    eyes: 'green',
  }
}


mergeUsers = async () => {
  try {
    //save first user
    await AsyncStorage.setItem('@MyApp_user', JSON.stringify(USER_1))

    // merge USER_2 into saved USER_1
    await AsyncStorage.mergeItem('@MyApp_user', JSON.stringify(USER_2))

    // read merged item
    const currentUser = await AsyncStorage.getItem('@MyApp_user')

    console.log(currentUser)

    // console.log result:
    // {
    //   name: 'Sarah',
    //   age: 21,
    //   hobby: 'cars',
    //   traits: {
    //     eyes: 'green',
    //     hair: 'black'
    //   }
    // }
  }
}
```

<br />
<br />


<!-- ------------------------ REMOVE ITEM ------------------------ -->

## `removeItem`

Removes item for a `key`, invokes (optional) callback once completed.

**Signature**:

```js
static removeItem(key: string, [callback]: ?(error: ?Error) => void): Promise
```

**Returns**:

`Promise` object.

**Example**:

```js
removeValue = async () => {
  try {
    await AsyncStorage.removeItem('@MyApp_key')
  } catch(e) {
    // remove error
  }

  console.log('Done.')
}
```


<br />
<br />

<!-- ------------------------ GET ALL KEYS ------------------------ -->


## `getAllKeys`

Returns all keys known to your App, for all callers, libraries, etc. Once completed, invokes `callback` with errors (if any) and array of keys.


**Signature**:

```js
static getAllKeys([callback]: ?(error: ?Error, keys: ?Array<string>) => void): Promise
```

**Returns**:

`Promise` object.

**Example**:

```js
getAllKeys = async () => {
  let keys = []
  try {
    keys = await AsyncStorage.getAllKeys()
  } catch(e) {
    // read key error
  }

  console.log(keys)
  // example console.log result:
  // ['@MyApp_user', '@MyApp_key']
}
```

<br />
<br />

<!-- ------------------------ MULTI GET ITEM ------------------------ -->

## `multiGet`

Fetches multiple key-value pairs for given array of `keys` in a batch. Once completed, invokes `callback` with errors (if any) and results.

**Signature**:

```js
static multiGet(keys: Array<string>, [callback]: ?(errors: ?Array<Error>, result: ?Array<Array<string>>) => void): Promise
```

**Returns**:

`Promise` of array with coresponding key-value pairs found, stored as `[key, value]` array.


**Example**:

```js
getMultiple = async () => {

  let values
  try {
    values = await AsyncStorage.multiGet(['@MyApp_user', '@MyApp_key'])
  } catch(e) {
    // read error
  }
  console.log(values)

  // example console.log output:
  // [ ['@MyApp_user', 'myUserValue'], ['@MyApp_key', 'myKeyValue'] ]
}
```

<br />
<br />

<!-- ------------------------ MULTI SET ITEM ------------------------ -->

## `multiSet`

Stores multiple key-value pairs in a batch. Once completed, `callback` with any errors will be called.


**Signature**:

```js
static multiSet(keyValuePairs: Array<Array<string>>, [callback]: ?(errors: ?Array<Error>) => void): Promise
```

**Returns**:

`Promise` object.

**Example**:

```js
multiSet = async () => {
  const firstPair = ["@MyApp_user", "value_1"]
  const secondPair = ["@MyApp_key", "value_2"]
  try {
    await AsyncStorage.multiSet([firstPair, secondPair])
  } catch(e) {
    //save error
  }

  console.log("Done.")
}
```

<br />
<br />

<!-- ------------------------ MULTI MERGE ------------------------ -->

## `multiMerge`

Multiple merging of existing and new values in a batch. Assumes that values are *stringified JSON*. Once completed, invokes `callback` with errors (if any).

**Signature**:

```js
static multiMerge(keyValuePairs: Array<Array<string>>, [callback]: ?(errors: ?Array<Error>) => void): Promise
```

**Returns**:

`Promise` object.

**Example**:

```js
const USER_1 = {
  name: 'Tom',
  age: 30,
  traits: {hair: 'brown'},
};

const USER_1_DELTA = {
  age: 31,
  traits: {eyes: 'blue'},
};

const USER_2 = {
  name: 'Sarah',
  age: 25,
  traits: {hair: 'black'},
};

const USER_2_DELTA = {
  age: 26,
  traits: {hair: 'green'},
};


const multiSet = [
  ["@MyApp_USER_1", JSON.stringify(USER_1)],
  ["@MyApp_USER_2", JSON.stringify(USER_2)]
]

const multiMerge = [
  ["@MyApp_USER_1", JSON.stringify(USER_1_DELTA)],
  ["@MyApp_USER_2", JSON.stringify(USER_2_DELTA)]
]


mergeMultiple = async () => {
  let currentlyMerged

  try {
    await AsyncStorage.multiSet(multiSet)
    await AsyncStorage.multiMerge(multiMerge)
    currentlyMerged = await AsyncStorage.multiGet(['@MyApp_USER_1', '@MyApp_USER_2'])
  } catch(e) {
    // error
  }

  console.log(currentlyMerged)
  // console.log output:
  // [
  //   [
  //     'USER_1',
  //     {
  //       name:"Tom",
  //       age:30,
  //       traits: {
  //         hair: 'brown'
  //         eyes: 'blue'
  //       }
  //     }
  //   ],
  //   [
  //     'USER_2',
  //     {
  //       name:'Sarah',
  //       age:26,
  //       traits: {
  //         hair: 'green'
  //       }
  //     }
  //   ]
  // ]
}
```


<br />
<br />

<!-- ------------------------ MULTI REMOVE ------------------------ -->

## `multiRemove`

Clears multiple key-value entries for given array of `keys` in a batch. Once completed, invokes a `callback` with errors (if any).

**Signature**:

```js
static multiRemove(keys: Array<string>, [callback]: ?(errors: ?Array<Error>) => void)
```

**Returns**:

`Promise` object.

**Example**:

```js
removeFew = async () => {
  const keys = ['@MyApp_USER_1', '@MyApp_USER_2']
  try {
    await AsyncStorage.multiRemove(keys)
  } catch(e) {
    // remove error
  }

  console.log('Done')
}

```


<br />
<br />

<!-- ------------------------ CLEAR ------------------------ -->

## `clear`

Removes **whole** `AsyncStorage` data, for all clients, libraries, etc. You probably want to use [removeItem](#removeItem) or [multiRemove](#multiRemove) to clear only your App's keys.

**Signature**:

```js
static clear([callback]: ?(error: ?Error) => void): Promise
```

**Returns**:

`Promise` object.

**Example**:

```js
clearAll = async () => {
  try {
    await AsyncStorage.clear()
  } catch(e) {
    // clear error
  }

  console.log('Done.')
}
```

<!-- ------------------------ HOOKS ------------------------ -->


## `useAsyncStorage`

**Note**: A hooks-like interface that we're experimenting with. This will change in the nearest future to fully leverage Hooks API, so feel free to [follow this discussion to learn more](https://github.com/react-native-community/react-native-async-storage/issues/32).


The `useAsyncStorage` returns an object that exposes all methods that allow you to interact with the stored value.

**Signature**:

```js
static useAsyncStorage(key: string): {
  getItem: (
    callback?: ?(error: ?Error, result: string | null) => void,
  ) => Promise<string | null>,
  setItem: (
    value: string,
    callback?: ?(error: ?Error) => void,
  ) => Promise<null>,
  mergeItem: (
    value: string,
    callback?: ?(error: ?Error) => void,
  ) => Promise<null>,
  removeItem: (callback?: ?(error: ?Error) => void) => Promise<null>,
}
```

**Returns**:

`object`

**Specific Example**:

You can replace your `App.js` with the following to see it in action.

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';

export default function App() {
  const [value, setValue] = useState('value');
  const { getItem, setItem } = useAsyncStorage('@storage_key');

  const readItemFromStorage = async () => {
    const item = await getItem();
    setValue(item);
  };

  const writeItemToStorage = async newValue => {
    await setItem(newValue);
    setValue(newValue);
  };

  useEffect(() => {
    readItemFromStorage();
  }, []);

  return (
    <View style={{ margin: 40 }}>
      <Text>Current value: {value}</Text>
      <TouchableOpacity
        onPress={() =>
          writeItemToStorage(
            Math.random()
              .toString(36)
              .substr(2, 5)
          )
        }
      >
        <Text>Update value</Text>
      </TouchableOpacity>
    </View>
  );
}
```

In this example:

1. On mount, we read the value at `@storage_key` and save it to the state under `value`
2. When pressing on "update value", a new string gets generated, saved to async storage, and to the component state
3. Try to reload your app - you'll see that the last value is still being read from async storage
