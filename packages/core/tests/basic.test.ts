import AsyncStorageFactory from "../src";
import TestStorageBackend from "./TestStorage.fixture";

describe("Async Storage", () => {
  describe("Storage Backend usage", () => {
    const testBackend = new TestStorageBackend();

    beforeEach(() => {
      testBackend.clearMock();
    });

    it("calls provided storage backend", async () => {
      const storage = AsyncStorageFactory.create(testBackend);
      const key = "test_key";
      const value = "testing_value";
      await storage.setItem(key, value);
      let read = await storage.getItem(key);
      expect(read).toEqual(value);
      await storage.removeItem(key);
      read = await storage.getItem(key);
      expect(read).toEqual(null);
      expect(storage.ext.double(2)).toEqual(4);

      expect(testBackend.multiGet).toBeCalledTimes(2);
      expect(testBackend.multiGet).toHaveBeenCalledWith([key]);
      expect(testBackend.multiSet).toBeCalledTimes(1);
      expect(testBackend.multiSet).toBeCalledWith({ [key]: value });
      expect(testBackend.multiRemove).toBeCalledTimes(1);
      expect(testBackend.multiRemove).toBeCalledWith([key]);
      expect(testBackend.extension.double).toBeCalledTimes(1);
    });
  });
});
