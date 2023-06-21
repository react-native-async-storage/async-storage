import { commands as cmd } from './commands';
import testCases from '../examples/tests';

describe('Async Storage', () => {
  describe('functional tests', () => {
    it('should be visible', async () => {
      const el = await cmd.elementByLabel('functional-view');
      await expect(await el.isExisting()).toEqual(true);
    });

    const testNames = Object.keys(testCases);
    for (const name of testNames) {
      it(`${name}`, async () => {
        const el = await cmd.elementByLabel(`test:${name}`);
        await expect(await el.getText()).toEqual('Pass');
      });
    }

    // Re-run tests with native delegate set
    for (const currentName of testNames) {
      const name = currentName + ' with delegate';
      it(`${name}`, async () => {
        const el = await cmd.elementByLabel(`test:${name}`);
        const label = await el.getText();
        if (label === 'Skip') {
          return;
        }

        expect(label).toEqual('Pass');
      });
    }
  });
});
