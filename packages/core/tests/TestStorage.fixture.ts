import { StorageBackend, StorageEntry, StorageExtension } from "../src";

interface TestExtension extends StorageExtension {
  double: (value: number) => number;
}

class TestStorageBackend implements StorageBackend<TestExtension> {
  private storage = new Map<string, string | null>();

  clearMock = () => {
    this.storage.clear();
    jest.clearAllMocks();
  };

  extension: TestExtension = {
    double: jest.fn((value: number) => value * 2),
  };

  drop = jest.fn(async (): Promise<void> => {
    this.storage.clear();
  });

  multiGet = jest.fn(async (keys: readonly string[]): Promise<StorageEntry> => {
    return keys.reduce((entries, key) => {
      return {
        ...entries,
        [key]: this.storage.get(key) ?? null,
      };
    }, {} as StorageEntry);
  });

  multiRemove = jest.fn(async (keys: readonly string[]): Promise<void> => {
    keys.forEach((key) => {
      this.storage.delete(key);
    });
  });

  multiSet = jest.fn(async (entries: StorageEntry): Promise<StorageEntry> => {
    Object.entries(entries).forEach(([key, value]) => {
      this.storage.set(key, value);
    });
    return entries;
  });
}

export default TestStorageBackend;
