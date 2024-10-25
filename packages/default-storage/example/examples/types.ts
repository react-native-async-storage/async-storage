import type { TurboModule } from "react-native";

type AsyncStorageDelegate = (value?: boolean) => void;

export type AsyncStorageTestSupport = TurboModule & {
  test_setDelegate: (delegate: AsyncStorageDelegate) => void;
  test_unsetDelegate: (delegate: AsyncStorageDelegate) => void;
};
