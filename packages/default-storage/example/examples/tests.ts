export type TestValue = string | Record<string, any>;

export type TestStep =
  | {
      command: "merge" | "set";
      key: string;
      value: TestValue;
      expected?: TestValue | null;
    }
  | {
      command: "remove";
      key: string;
    };

const tests: Record<string, TestStep[]> = {
  "Should store value": [
    { command: "set", key: "a", value: "0" },
    { command: "set", key: "a", value: "10" },
    { command: "set", key: "a", value: "20" },
    { command: "set", key: "a", value: "30" },
    { command: "set", key: "a", value: "40" },
  ],
  "Should clear item": [
    { command: "set", key: "a", value: "42" },
    { command: "remove", key: "a" },
  ],
  "Should merge items": [
    {
      command: "set",
      key: "a",
      value: {
        name: "Jerry",
        age: "21",
        shoeSize: "10",
      },
    },
    {
      command: "merge",
      key: "a",
      value: {
        name: "Sarah",
        age: "23",
        eyesColor: "green",
      },
      expected: {
        name: "Sarah",
        age: "23",
        eyesColor: "green",
        shoeSize: "10",
      },
    },
  ],
  "Should keep existing entries when merging with an empty object": [
    {
      command: "set",
      key: "merge_test_2",
      value: {
        name: "Jerry",
        age: "21",
        eyesColor: "blue",
        shoeSize: "9",
      },
    },
    {
      command: "merge",
      key: "merge_test_2",
      value: {},
      expected: {
        name: "Jerry",
        age: "21",
        eyesColor: "blue",
        shoeSize: "9",
      },
    },
  ],
  "Should merge nested objects deeply": [
    {
      command: "set",
      key: "deep_merge_test",
      value: {
        name: "John",
        age: "30",
        address: {
          city: "New York",
          zip: "10001",
        },
        preferences: {
          theme: "dark",
          notifications: "enabled",
        },
      },
    },
    {
      command: "merge",
      key: "deep_merge_test",
      value: {
        age: "31",
        address: {
          country: "USA",
        },
        preferences: {
          theme: "light",
        },
      },
      expected: {
        name: "John",
        age: "31",
        address: {
          city: "New York",
          zip: "10001",
          country: "USA",
        },
        preferences: {
          theme: "light",
          notifications: "enabled",
        },
      },
    },
  ],
};

export default tests;
