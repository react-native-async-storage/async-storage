export const config: WebdriverIO.Config = {
  runner: "local",
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "../../tsconfig.all.json",
    },
  },
  capabilities: [],
  connectionRetryTimeout: 180000,
  waitforTimeout: 90000,
  framework: "mocha",
  reporters: ["spec"],
  mochaOpts: {
    ui: "bdd",
    /**
     * NOTE: This has been increased for more stable Appium Native app
     * tests because they can take a bit longer.
     */
    timeout: 5 * 60 * 1000, // 5min
  },
  specs: ["./asyncstorage.spec.ts"],
  services: [
    [
      "appium",
      {
        command: "appium",
        args: {
          // This is needed to tell Appium that we can execute local ADB commands
          // and to automatically download the latest version of ChromeDriver
          relaxedSecurity: true,
          address: "127.0.0.1",
          "callback-port": 4723,
          port: 4723,
        },
      },
    ],
  ],
};
