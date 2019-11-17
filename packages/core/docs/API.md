# Async Storage API

Async Storage provides a unified API for any underlying storage. 
All


## Table of Content

- [API](#api)
    - [get](#get)
    - [set](#set)
    - [remove](#remove)
    - [getMultiple](#getmultiple)
    - [setMultiple](#setmultiple)
    - [removeMultiple](#removemultiple)
    - [getKeys](#getkeys)
    - [clearStorage](#clearstorage)
- [Extensions](#extensions)
    
## API


### `get`

Returns a value (or `null`) for a `key` from a storage.


```typescript
// example.js

const value = await storageInst.get('myKey');
```



### `set`

Stores a `value` for a `key` in storage.

```typescript
// example.js

const myValue = "Hello world!";
await storageInst.set('myKey', myValue);
```

### `remove`

Removes value for `key` from the storage.

```typescript
// example.js

await storageInst.remove('myKey');
```


### `getMultiple`

Returns an object with `key/value` entries, read for given `keys`.


```typescript
//example.js

const values = await storageInst.getMultiple(['key1', 'key2', 'key3']);
console.log(value); 
/*
   output: 
   {
    key1: "value1",
    key2: "value2",
    key3: "value3"
   }
*/

```

### `setMultiple`

Stores multiple `key/value` pairs into storage.

```typescript
// example.js

const value1 = { key1: 'hello1' };
const value2 = { 
    key2: {  
      name: 'jerry',
      age: 25
    }
};

await storageInst.setMultiple([ value1, value2 ])
```

### `removeMultiple`

Removes multiple values stored under `keys`.

```typescript
// example.js

const deleteList = ['key1', 'key2', 'key3'];

await storageInst.removeMultiple(deleteList);
```


### `getKeys`

Returns all keys used to store data in storage.

```typescript

const keys = await storageInst.getKeys();
// output: ['key1', 'key2', 'key3'];

```

### `clearStorage`

Wipes whole data currently stored from storage.

```typescript
// example.js

await storageInst.clearStorage();
````


## Extensions

Basic Async Storage can be extended by additional functions, if [used storage](https://github.com/react-native-community/async-storage/blob/master/README.md#available-storage-backends) provides any.

You can access additional functionality through `.ext` property. 

[More info can be found in Writing Custom Storage section](./Writing_Storage_Backend.md#going-being-default-api)
