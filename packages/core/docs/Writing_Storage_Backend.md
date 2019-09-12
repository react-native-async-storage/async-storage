# Authoring Storage Backend

To create custom storage, one must create a class that implements `IStorageBackend` interface. 
This contract makes sure that Core knows how to use it.

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

### Notes

- Each function should be asynchronous - even if access to storage is not.
- In `localStorage`, remember that __keys__ and __values__  are always `string` - it's up to you if you're going to stringify it or accept stringified arguments. 
- `opts` argument can be used to 'enhance' each call, for example, one could use it to decide if the stored value should be replaced:

```typescript

// in a class

async setSingle<K extends keyof T>(
  key: K,
  value: T[K],
  opts?: StorageOptions,
): Promise<void> {
  
  if(!opts.replaceCurrent) {
    const current = this.storage.getItem(key);
    if(!current){
      this.storage.setItem(key, value);
    } 
    return;
  } 

  return this.storage.setItem(key, value);
} 

```
