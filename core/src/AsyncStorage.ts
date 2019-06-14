class AsyncStorage implements IAsyncStorage {
  backend: IStorageBackend;

  constructor(storageBackend: IStorageBackend) {
    this.backend = storageBackend;
  }
}

export default AsyncStorage;
