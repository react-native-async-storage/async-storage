import { e2e } from '../jest.setup';

const testAppId = 'com.microsoft.ReactTestApp';

export const commands = {
  restartApp: async () => {
    await e2e.terminateApp(testAppId);
    await e2e.activateApp(testAppId);
  },
  elementByLabel: async (id: string) => await e2e.$(`~${id}`),
};
