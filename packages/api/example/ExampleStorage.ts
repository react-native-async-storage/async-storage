import { AsyncStorage, StorageKeys, StorageModel } from "../src";
import { ExampleExtension, MyExampleExtension } from "./ExampleExtension";

type MyModel = StorageModel<{
  age: number;
  name: string;
  likes: boolean[];
}>;

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ExampleStorage implements AsyncStorage<MyModel, MyExampleExtension> {
  private storage: MyModel = {
    age: null,
    name: null,
    likes: null,
  };

  getItem = async <K extends keyof MyModel>(key: K): Promise<MyModel[K]> => {
    return this.storage[key];
  };

  setItem = async <K extends StorageKeys<MyModel>>(
    key: K,
    value: MyModel[K]
  ): Promise<void> => {
    this.storage[key] = value;
  };

  removeItem = async <K extends StorageKeys<MyModel>>(
    key: K
  ): Promise<void> => {
    this.storage[key] = null;
  };

  getMany = async <K extends StorageKeys<MyModel>>(
    keys: K[]
  ): Promise<{ [k in K]: MyModel[k] }> => {
    return keys.reduce((entries, key) => {
      return {
        ...entries,
        [key]: this.storage[key] ?? null,
      };
    }, {} as { [k in K]: MyModel[k] });
  };

  setMany = async <K extends StorageKeys<MyModel>>(entries: {
    [k in K]: MyModel[k];
  }): Promise<void> => {
    Object.entries(entries).forEach((entry) => {
      const key = entry[0] as K;
      this.storage[key] = entry[1] as MyModel[K];
    });
  };

  removeMany = async <K extends StorageKeys<MyModel>>(
    keys: K[]
  ): Promise<void> => {
    keys.forEach((k) => {
      this.storage[k] = null;
    });
  };

  clear = async (): Promise<void> => {
    this.storage.age = null;
    this.storage.name = null;
    this.storage.likes = null;
  };

  ext: MyExampleExtension = new ExampleExtension();
}
