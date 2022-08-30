/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import tests from '../examples/tests';

describe('Async Storage', () => {
  beforeAll(async () => {
    await device.reloadReactNative();
  });

  describe('functional tests', () => {
    it('should be visible', async () => {
      await expect(element(by.id('functional-view'))).toExist();
    });

    const testNames = Object.keys(tests);
    for (const name of testNames) {
      it(name, async () => {
        await expect(element(by.id(`test:${name}`))).toHaveLabel('Pass');
      });
    }

    // Re-run tests with native delegate set
    for (const currentName of testNames) {
      const name = currentName + ' with delegate';
      it(name, async () => {
        const el = await element(by.id(`test:${name}`)).getAttributes();
        if (el.label === "Skip") {
          return;
        }

        await expect(element(by.id(`test:${name}`))).toHaveLabel('Pass');
      });
    }
  });
});
