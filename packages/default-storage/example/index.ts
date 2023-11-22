/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { AppRegistry, Platform } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === "web") {
  const rootTag = document.getElementById("root");
  AppRegistry.runApplication(appName, { rootTag });
}
