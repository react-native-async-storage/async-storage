class AsyncStorage implements IAsyncStorage {
  backend: IStorageBackend;

  constructor(storageBackend: IStorageBackend) {
    this.backend = storageBackend;
  }

  set(): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export default AsyncStorage;
