import AsyncStorage from "../AsyncStorage";
import { useAsyncStorage, useAsyncStorageObject } from "../hooks";

jest.mock("../AsyncStorage", () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    mergeItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe("useAsyncStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an object with getItem, setItem, mergeItem, and removeItem methods", () => {
    const hook = useAsyncStorage("testKey");

    expect(hook).toHaveProperty("getItem");
    expect(hook).toHaveProperty("setItem");
    expect(hook).toHaveProperty("mergeItem");
    expect(hook).toHaveProperty("removeItem");
  });

  it("getItem calls AsyncStorage.getItem with the correct key", async () => {
    mockedAsyncStorage.getItem.mockResolvedValue("testValue");

    const hook = useAsyncStorage("testKey");
    const result = await hook.getItem();

    expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith("testKey");
    expect(result).toBe("testValue");
  });

  it("setItem calls AsyncStorage.setItem with the correct key and value", async () => {
    mockedAsyncStorage.setItem.mockResolvedValue(undefined);

    const hook = useAsyncStorage("testKey");
    await hook.setItem("testValue");

    expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
      "testKey",
      "testValue"
    );
  });
});

describe("useAsyncStorageObject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  interface TestUser {
    name: string;
    age: number;
    preferences?: {
      theme: string;
      notifications: boolean;
    };
  }

  describe("getItem", () => {
    it("returns parsed object from storage", async () => {
      const storedUser: TestUser = { name: "John", age: 30 };
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedUser));

      const hook = useAsyncStorageObject<TestUser>("user");
      const result = await hook.getItem();

      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith("user");
      expect(result).toEqual(storedUser);
    });

    it("returns null when storage is empty and no default provided", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const hook = useAsyncStorageObject<TestUser>("user");
      const result = await hook.getItem();

      expect(result).toBeNull();
    });

    it("returns defaultValue when storage is empty", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);
      const defaultUser: TestUser = { name: "Default", age: 0 };

      const hook = useAsyncStorageObject<TestUser>("user", defaultUser);
      const result = await hook.getItem();

      expect(result).toEqual(defaultUser);
    });

    it("returns null on invalid JSON (no default)", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue("invalid json {{{");

      const hook = useAsyncStorageObject<TestUser>("user");
      const result = await hook.getItem();

      expect(result).toBeNull();
    });

    it("returns defaultValue on invalid JSON", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue("invalid json {{{");
      const defaultUser: TestUser = { name: "Fallback", age: 25 };

      const hook = useAsyncStorageObject<TestUser>("user", defaultUser);
      const result = await hook.getItem();

      expect(result).toEqual(defaultUser);
    });

    it("calls callback with parsed result", async () => {
      const storedUser: TestUser = { name: "Jane", age: 28 };
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedUser));

      const callback = jest.fn();
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.getItem(callback);

      expect(callback).toHaveBeenCalledWith(null, storedUser);
    });

    it("calls callback with null on empty storage", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const callback = jest.fn();
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.getItem(callback);

      expect(callback).toHaveBeenCalledWith(null, null);
    });

    it("calls callback with defaultValue on empty storage", async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);
      const defaultUser: TestUser = { name: "Default", age: 0 };

      const callback = jest.fn();
      const hook = useAsyncStorageObject<TestUser>("user", defaultUser);
      await hook.getItem(callback);

      expect(callback).toHaveBeenCalledWith(null, defaultUser);
    });

    it("handles nested objects correctly", async () => {
      const complexUser: TestUser = {
        name: "Alice",
        age: 35,
        preferences: {
          theme: "dark",
          notifications: true,
        },
      };
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(complexUser));

      const hook = useAsyncStorageObject<TestUser>("user");
      const result = await hook.getItem();

      expect(result).toEqual(complexUser);
      expect(result?.preferences?.theme).toBe("dark");
    });
  });

  describe("setItem", () => {
    it("stores stringified object", async () => {
      mockedAsyncStorage.setItem.mockResolvedValue(undefined);

      const user: TestUser = { name: "Bob", age: 40 };
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.setItem(user);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(user),
        undefined
      );
    });

    it("stores nested objects correctly", async () => {
      mockedAsyncStorage.setItem.mockResolvedValue(undefined);

      const user: TestUser = {
        name: "Carol",
        age: 25,
        preferences: {
          theme: "light",
          notifications: false,
        },
      };
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.setItem(user);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(user),
        undefined
      );
    });

    it("passes callback to AsyncStorage.setItem", async () => {
      mockedAsyncStorage.setItem.mockResolvedValue(undefined);

      const callback = jest.fn();
      const user: TestUser = { name: "Dave", age: 50 };
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.setItem(user, callback);

      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(user),
        callback
      );
    });
  });

  describe("mergeItem", () => {
    it("merges partial object with stored object", async () => {
      mockedAsyncStorage.mergeItem.mockResolvedValue(undefined);

      const partialUpdate: Partial<TestUser> = { age: 31 };
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.mergeItem(partialUpdate);

      expect(mockedAsyncStorage.mergeItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(partialUpdate),
        undefined
      );
    });

    it("merges nested partial objects", async () => {
      mockedAsyncStorage.mergeItem.mockResolvedValue(undefined);

      const partialUpdate: Partial<TestUser> = {
        preferences: {
          theme: "dark",
          notifications: true,
        },
      };
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.mergeItem(partialUpdate);

      expect(mockedAsyncStorage.mergeItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(partialUpdate),
        undefined
      );
    });

    it("passes callback to AsyncStorage.mergeItem", async () => {
      mockedAsyncStorage.mergeItem.mockResolvedValue(undefined);

      const callback = jest.fn();
      const partialUpdate: Partial<TestUser> = { name: "Updated" };
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.mergeItem(partialUpdate, callback);

      expect(mockedAsyncStorage.mergeItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify(partialUpdate),
        callback
      );
    });
  });

  describe("removeItem", () => {
    it("calls AsyncStorage.removeItem with the correct key", async () => {
      mockedAsyncStorage.removeItem.mockResolvedValue(undefined);

      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.removeItem();

      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith("user");
    });

    it("passes callback to AsyncStorage.removeItem", async () => {
      mockedAsyncStorage.removeItem.mockResolvedValue(undefined);

      const callback = jest.fn();
      const hook = useAsyncStorageObject<TestUser>("user");
      await hook.removeItem(callback);

      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith(
        "user",
        callback
      );
    });
  });

  describe("TypeScript type safety", () => {
    it("maintains type safety for getItem return value", async () => {
      const storedUser: TestUser = { name: "TypeSafe", age: 42 };
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedUser));

      const hook = useAsyncStorageObject<TestUser>("user");
      const result = await hook.getItem();

      // TypeScript should know result is TestUser | null
      if (result) {
        expect(result.name).toBe("TypeSafe");
        expect(result.age).toBe(42);
      }
    });

    it("works with arrays", async () => {
      const storedArray = [1, 2, 3, 4, 5];
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(storedArray));

      const hook = useAsyncStorageObject<number[]>("numbers");
      const result = await hook.getItem();

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("works with primitive types wrapped in object", async () => {
      interface Counter {
        value: number;
      }
      const storedCounter: Counter = { value: 10 };
      mockedAsyncStorage.getItem.mockResolvedValue(
        JSON.stringify(storedCounter)
      );

      const hook = useAsyncStorageObject<Counter>("counter");
      const result = await hook.getItem();

      expect(result?.value).toBe(10);
    });
  });
});
