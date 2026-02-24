import { AppRegistry } from "react-native";
import { TestApp } from "example-common-tests";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => TestApp);
