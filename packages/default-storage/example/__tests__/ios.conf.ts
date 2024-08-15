import { config as commonConfig } from "./common.conf";

export const config: WebdriverIO.Config = {
  ...commonConfig,
  capabilities: [
    {
      platformName: "iOS",
      "appium:platformVersion": "16.4",
      "appium:deviceName": "iPhone 14",
      "appium:automationName": "XCUITest",
      "appium:app":
        "example/ios/build/Build/Products/Release-iphonesimulator/ReactTestApp.app",
    },
  ],
};
