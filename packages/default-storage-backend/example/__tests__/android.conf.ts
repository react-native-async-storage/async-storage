import { config as commonConfig } from "./common.conf";

export const config: WebdriverIO.Config = {
  ...commonConfig,
  capabilities: [
    {
      platformName: "Android",
      maxInstances: 1,
      "appium:deviceName": "Android Emulator",
      "appium:app":
        "example/android/app/build/outputs/apk/release/app-release.apk",
      "appium:automationName": "UiAutomator2",
      "appium:newCommandTimeout": 240,
      "appium:appWaitActivity":
        "com.microsoft.reacttestapp.component.ComponentActivity",
    },
  ],
};
