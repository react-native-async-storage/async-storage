export type TestValue = string | Record<string, string>;

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
  "Should store value in AsyncStorage": [
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
        eyesColor: "blue",
        shoeSize: "9",
      },
    },
    {
      command: "merge",
      key: "a",
      value: {
        name: "Sarah",
        age: "23",
        eyesColor: "green",
        shoeSize: "10",
      },
    },
  ],
};

export default tests;
