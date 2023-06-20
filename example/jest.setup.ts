import { remote, RemoteOptions } from 'webdriverio';

jest.retryTimes(3);

const Capabilities = {
  android: {
    platformName: 'Android',
    'appium:deviceName': 'Android Emulator',
    'appium:app':
      'example/android/app/build/outputs/apk/release/app-release.apk',
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 240,
  },
  ios: {},
};

let client: WebdriverIO.Browser;

function getDriverConfig(platform: string | undefined) {
  if (!platform || (platform !== 'android' && platform !== 'ios')) {
    throw Error(
      `Unrecognized platform passed from E2E_PLATFORM env: ${platform}`
    );
  }

  const config: RemoteOptions = {
    port: 4723,
    waitforTimeout: 60000,
    logLevel: 'error',
    capabilities: Capabilities[platform],
  };

  return config;
}

beforeAll(async () => {
  const platform = process.env['E2E_PLATFORM'];
  const config = getDriverConfig(platform);
  client = await remote(config);
});

afterAll(async () => {
  await client.deleteSession();
});

export { client as e2e };
