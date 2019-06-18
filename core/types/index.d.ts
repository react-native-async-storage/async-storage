interface IStorageBackend {
  getSingle(): Promise<any>;
  //todo
}

interface IAsyncStorage {
  set(): Promise<void>;
  // todo
}
