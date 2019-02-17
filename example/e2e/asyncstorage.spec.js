/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

describe('Async Storage', () => {
  let restartButton;
  let clearButton;
  let increaseByTenButton;
  let storedNumberText;

  beforeAll(async () => {
    await device.reloadReactNative();
    restartButton = await element(by.id('restart_button'));
    clearButton = await element(by.id('clear_button'));
    increaseByTenButton = await element(by.id('increaseByTen_button'));
    storedNumberText = await element(by.id('text_storedNumber'));
  });

  it('should load all examples', async () => {
    await expect(element(by.id('examples_container'))).toExist();
    await expect(element(by.id('example-clear'))).toExist();
    await expect(element(by.id('example-get-set'))).toExist();
  });

  it('should store value in async storage', async () => {
    await expect(storedNumberText).toHaveText('');

    const tapTimes = Math.round(Math.random() * 9) + 1;

    for (let i = 0; i < tapTimes; i++) {
      await increaseByTenButton.tap();
    }

    await expect(storedNumberText).toHaveText(`${tapTimes * 10}`);
    await restartButton.tap();
    await expect(storedNumberText).toHaveText(`${tapTimes * 10}`);
  });

  it('should clear async storage', async () => {
    await increaseByTenButton.tap();
    await clearButton.tap();
    await restartButton.tap();
    await expect(storedNumberText).toHaveText('');
  });
});
