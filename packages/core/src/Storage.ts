import { StorageKeys, StorageModel, StorageEntry } from "./types/StorageModel";
import { AsyncStorage } from "./types/AsyncStorage";
import { StorageBackend } from "./types/StorageBackend";
import { StorageExtension } from "./types/Extension";
import { StorageConfig } from "./types/StorageConfig";
import { StorageAdapter } from "./types/StorageAdapter";

class Storage<S extends StorageModel, E extends StorageExtension | undefined>
  implements AsyncStorage<S, E>
{
  private adapter: StorageAdapter<S>;

  constructor(private backend: StorageBackend<E>, config: StorageConfig<S>) {
    this.adapter = config.adapter;
    this.ext = this.backend.extension;
  }

  public ext: E;

  getItem = async <K extends StorageKeys<S>>(key: K): Promise<S[K] | null> => {
    const result = await this.backend.multiGet([key as string]);
    return this.adapter.deserialize(key, result[key]);
  };

  setItem = async <K extends StorageKeys<S>>(
    key: K,
    value: S[K]
  ): Promise<void> => {
    await this.backend.multiSet({ [key]: this.adapter.serialize(key, value) });
  };

  removeItem = async <K extends StorageKeys<S>>(key: K): Promise<void> => {
    await this.backend.multiRemove([key as string]);
  };

  getMany = async <K extends StorageKeys<S>>(
    keys: K[]
  ): Promise<{ [k in K]: S[k] | null }> => {
    const result = await this.backend.multiGet(keys as string[]);
    return keys.reduce((entries, key) => {
      return {
        ...entries,
        [key]: this.adapter.deserialize(key, result[key]),
      };
    }, {} as { [k in K]: S[k] | null });
  };

  setMany = async <K extends StorageKeys<S>>(entries: {
    [k in K]: S[k] | null;
  }): Promise<void> => {
    const serialized = Object.entries(entries).reduce<StorageEntry>(
      (prev, curr) => {
        const [key, value] = curr;
        return {
          ...prev,
          [key]: this.adapter.serialize(key as K, value as S[K]),
        };
      },
      {}
    );
    await this.backend.multiSet(serialized);
  };

  removeMany = async <K extends StorageKeys<S>>(keys: K[]): Promise<void> => {
    await this.backend.multiRemove(keys as string[]);
  };

  clear = async (): Promise<void> => this.backend.drop();
}

export default Storage;
