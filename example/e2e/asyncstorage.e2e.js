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
  let closeKeyboard;
  let test_getSetClear;
  let test_mergeItem;

  beforeAll(async () => {
    await device.reloadReactNative();
    restartButton = await element(by.id('restart_button'));
    closeKeyboard = await element(by.id('closeKeyboard'));
    test_getSetClear = await element(by.id('testType_getSetClear'));
    test_mergeItem = await element(by.id('testType_mergeItem'));
  });

  it('should load default screen', async () => {
    await expect(restartButton).toExist();
    await expect(closeKeyboard).toExist();
    await expect(test_getSetClear).toExist();
    await expect(test_mergeItem).toExist();
  });

  describe('get / set / clear item test', () => {
    beforeAll(async () => {
      await device.openURL({ url: 'rnc-asyncstorage://unset-delegate' });
    });

    it('should be visible', async () => {
      await test_getSetClear.tap();
      await expect(element(by.id('clear_button'))).toExist();
      await expect(element(by.id('increaseByTen_button'))).toExist();
      await expect(element(by.id('storedNumber_text'))).toExist();
    });

    it('should store value in async storage', async () => {
      const storedNumberText = await element(by.id('storedNumber_text'));
      const increaseByTenButton = await element(by.id('increaseByTen_button'));

      await expect(storedNumberText).toHaveText('');

      const tapTimes = Math.round(Math.random() * 9) + 1;

      for (let i = 0; i < tapTimes; i++) {
        await increaseByTenButton.tap();
      }

      await expect(storedNumberText).toHaveText(`${tapTimes * 10}`);
      await restartButton.tap();
      await expect(storedNumberText).toHaveText(`${tapTimes * 10}`);
    });

    it('should clear item', async () => {
      const storedNumberText = await element(by.id('storedNumber_text'));
      const increaseByTenButton = await element(by.id('increaseByTen_button'));
      const clearButton = await element(by.id('clear_button'));

      await increaseByTenButton.tap();
      await clearButton.tap();
      await restartButton.tap();
      await expect(storedNumberText).toHaveText('');
    });
  });

  describe('merge item test', () => {
    beforeAll(async () => {
      await device.openURL({ url: 'rnc-asyncstorage://unset-delegate' });
    });

    it('should be visible', async () => {
      await test_mergeItem.tap();
      await expect(element(by.id('saveItem_button'))).toExist();
      await expect(element(by.id('mergeItem_button'))).toExist();
      await expect(element(by.id('restoreItem_button'))).toExist();
      await expect(element(by.id('testInput-name'))).toExist();
      await expect(element(by.id('testInput-age'))).toExist();
      await expect(element(by.id('testInput-eyes'))).toExist();
      await expect(element(by.id('testInput-shoe'))).toExist();
    });

    it('should merge items in async storage', async () => {
      const buttonSaveItem = await element(by.id('saveItem_button'));
      const buttonMergeItem = await element(by.id('mergeItem_button'));
      const buttonRestoreItem = await element(by.id('restoreItem_button'));

      const nameInput = await element(by.id('testInput-name'));
      const ageInput = await element(by.id('testInput-age'));
      const eyesInput = await element(by.id('testInput-eyes'));
      const shoeInput = await element(by.id('testInput-shoe'));
      const storyText = await element(by.id('storyTextView'));

      const isAndroid = device.getPlatform() === 'android';

      async function performInput() {
        const name = Math.random() > 0.5 ? 'Jerry' : 'Sarah';
        const age = Math.random() > 0.5 ? '21' : '23';
        const eyesColor = Math.random() > 0.5 ? 'blue' : 'green';
        const shoeSize = Math.random() > 0.5 ? '9' : '10';

        if (!isAndroid) {
          await eyesInput.tap();
        }
        await nameInput.typeText(name);
        await closeKeyboard.tap();

        if (!isAndroid) {
          await eyesInput.tap();
        }
        await ageInput.typeText(age);
        await closeKeyboard.tap();

        if (!isAndroid) {
          await eyesInput.tap();
        }
        await eyesInput.typeText(eyesColor);
        await closeKeyboard.tap();

        if (!isAndroid) {
          await eyesInput.tap();
        }
        await shoeInput.typeText(shoeSize);
        await closeKeyboard.tap();

        return `${name} is ${age}, has ${eyesColor} eyes and shoe size of ${shoeSize}.`;
      }

      const story = await performInput();
      await buttonSaveItem.tap();
      await restartButton.tap();
      await buttonRestoreItem.tap();
      expect(storyText).toHaveText(story);
      await restartButton.tap();

      // merging here

      const newStory = await performInput();

      await buttonMergeItem.tap();
      await restartButton.tap();
      await buttonRestoreItem.tap();
      expect(storyText).toHaveText(newStory);
    });
  });

  describe('get / set / clear item delegate test', () => {
    beforeAll(async () => {
      await device.openURL({ url: 'rnc-asyncstorage://set-delegate' });
    });

    it('should be visible', async () => {
      await test_getSetClear.tap();
      await expect(element(by.id('clear_button'))).toExist();
      await expect(element(by.id('increaseByTen_button'))).toExist();
      await expect(element(by.id('storedNumber_text'))).toExist();
    });

    it('should store value in async storage', async () => {
      const storedNumberText = await element(by.id('storedNumber_text'));
      const increaseByTenButton = await element(by.id('increaseByTen_button'));

      await expect(storedNumberText).toHaveText('');

      const tapTimes = Math.round(Math.random() * 9) + 1;

      for (let i = 0; i < tapTimes; i++) {
        await increaseByTenButton.tap();
      }

      await expect(storedNumberText).toHaveText(`${tapTimes * 10}`);
      await restartButton.tap();
      await expect(storedNumberText).toHaveText(`${tapTimes * 10}`);
    });

    it('should clear item', async () => {
      const storedNumberText = await element(by.id('storedNumber_text'));
      const increaseByTenButton = await element(by.id('increaseByTen_button'));
      const clearButton = await element(by.id('clear_button'));

      await increaseByTenButton.tap();
      await clearButton.tap();
      await restartButton.tap();
      await expect(storedNumberText).toHaveText('');
    });
  });

  describe('merge item delegate test', () => {
    beforeAll(async () => {
      await device.openURL({ url: 'rnc-asyncstorage://set-delegate' });
    });

    it('should be visible', async () => {
      await test_mergeItem.tap();
      await expect(element(by.id('saveItem_button'))).toExist();
      await expect(element(by.id('mergeItem_button'))).toExist();
      await expect(element(by.id('restoreItem_button'))).toExist();
      await expect(element(by.id('testInput-name'))).toExist();
      await expect(element(by.id('testInput-age'))).toExist();
      await expect(element(by.id('testInput-eyes'))).toExist();
      await expect(element(by.id('testInput-shoe'))).toExist();
    });

    it('should crash when merging items in async storage', async () => {
      const buttonMergeItem = await element(by.id('mergeItem_button'));
      try {
        await buttonMergeItem.tap();
        fail();
      } catch {
        // Expected
      }
    });
  });
});
