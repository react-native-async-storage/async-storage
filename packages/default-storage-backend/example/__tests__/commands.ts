const testAppId = "com.microsoft.ReactTestApp";
import { browser } from "@wdio/globals";

export const commands = {
  restartApp: async () => {
    await browser.terminateApp(testAppId);
    await browser.activateApp(testAppId);
  },
  elementByLabel: async (id: string) => await $(`~${id}`),
};
