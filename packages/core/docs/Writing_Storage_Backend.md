# Authoring Storage Backend

Async Storage is a [facade](https://en.wikipedia.org/wiki/Facade_pattern) over the underlying Storage solution. 
In order for the new storage to be compatible, it has to implement `IStorageBackend` and its methods.


## Table of Content

1. [Creating a storage](#creating-storage-backend)
2. [Adding extra functionality](#going-being-default-api)
3. [Example](#example)



## Creating Storage Backend

To create storage compatible with Async Storage, one must create a class that implements `IStorageBackend`. It contains a handful of methods,
that simplifies access to the storage features. Those methods are:

- `getSingle`       - retrieves a single element, using provided `key`.
- `setSingle`       - sets a `value` under provided `key`
- `removeSingle`    - removes an entry for provided `key`
- `getMany`         - returns an array of `values`, for a provided array of `keys`
- `setMany`         - provided an array of `key-value` pairs, saves them to the storage
- `removeMany`      - removes a bunch of values, for a provided array of `keys` 
- `getKeys`         - returns an array of `keys` that were used to store values 
- `dropStorage`     - purges the storage


Few points to keep in mind while developing new storage:

- Every public method should be asynchronous (returns a promise) - even if access to the storage is not. This helps to keep API consistent.
- Each method accepts additional `opts` argument, which can be used to modify the call (i. e. decide if the underlying value should be overridden, if already exists)



## Going being default API

Unified API can be limiting - storages differ from each other and contain features that others do not. Async Storage comes with an extension property, that lets you extend its standard API.

The `ext` property is a custom getter that exposes publicly available methods from your Storage.
Let's say that you have a feature that removes entries older than 30 days and you call it `purge`.

#### Notes

In order for a property to be exposed:

- It has to be a function
- It has to have `public` property access (for type safety)
- Does not start with _underscore_ character - AsyncStorage consider those private


#### Example:

Simply add a public method to expose it for Async Storage's extension.

```typescript
import { IStorageBackend } from '@react-native-community/async-storage';


class MyStorage implements IStorageBackend<MyModel> {  
    // overridden methods here    

    public async purgeEntries() {
      // implementation
    }
}
```

Now your method is exposed through `ext` property:


```typescript

import MyStorage from 'my-awesome-storage'
import ASFactory from '@react-native-community/async-storage'

const storage = ASFactory.create(new MyStorage(), {});

// somewhere in the codebase
async function removeOldEntries() {
  await storage.ext.purgeEntries();
  console.log('Done!');
}
```

## Example

Let's create a storage backend for web, using `LocalStorage` API. 

Start by adding `AsyncStorage` to your dependencies.

```bash
$ yarn add @react-native-community/async-storage
``` 

Then, create a class and implement `IStorageBackend` interface;


```typescript

import { IStorageBackend, EmptyStorageModel, StorageOptions } from '@react-native-community/async-storage';

class WebStorage<T extends EmptyStorageModel = EmptyStorageModel> implements IStorageBackend<T> {

    storage = window.localStorage;
 
    async getSingle<K extends keyof T>(
      key: K,
      opts?: StorageOptions,
    ): Promise<T[K] | null> {
      
      return this.storage.getItem(key);
    } 
  
    async setSingle<K extends keyof T>(
      key: K,
      value: T[K],
      opts?: StorageOptions,
    ): Promise<void> {
      return this.storage.setItem(key, value);
    } 
  
    async getMany<K extends keyof T>(
      keys: Array<K>,
      opts?: StorageOptions,
    ): Promise<{[k in K]: T[k] | null}>{
      
      return Promise.all(keys.map(k => this.storage.getItem(k)))
    }
  
    async setMany<K extends keyof T>(
      values: Array<{[k in K]: T[k]}>,
      opts?: StorageOptions,
    ): Promise<void>{
     
      for(let keyValue of values){
        const key = Object.getOwnPropertyNames(keyValue)[0];
        if(!key) continue;
        this.storage.setItem(key, keyValue[key])
      }     
    }
  
    async removeSingle(key: keyof T, opts?: StorageOptions): Promise<void> {
      return this.storage.removeItem(key);
    } 
  
    async removeMany(keys: Array<keyof T>, opts?: StorageOptions): Promise<void> {
      for (let key in keys) {
        this.storage.removeItem(key);
      }
    } 
  
    async getKeys(opts?: StorageOptions): Promise<Array<keyof T>> {
      return Object.keys(this.storage);
    }
  
    async dropStorage(opts?: StorageOptions): Promise<void> {
      const keys = await this.getKeys();
      await this.removeMany(keys);
    }
}

export default WebStorage;
```
