import { StorageExtension } from "../src";

export interface MyExampleExtension extends StorageExtension {
  double: (num: number) => Promise<number>;

  uppercase: (text: string) => string;

  key: string;
}

export class ExampleExtension implements MyExampleExtension {
  key = "my-example-storage";

  double = async (num: number) => num * 2;

  uppercase = (text: string): string => text.toUpperCase();
}
