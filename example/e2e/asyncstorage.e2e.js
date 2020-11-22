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

  async function dismissKeyboard() {
    if (device.getPlatform() === 'android') {
      return device.pressBack();
    }
    return closeKeyboard.tap();
  }

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
      await test_getSetClear.tap();
    });

    it('should be visible', async () => {
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
      await test_mergeItem.tap();
    });

    it('should be visible', async () => {
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

      let i = 0;
      async function performInput() {
        const name = i === 0 ? 'Jerry' : 'Sarah';
        const age = i === 0 ? '21' : '23';
        const eyesColor = i === 0 ? 'blue' : 'green';
        const shoeSize = i === 0 ? '9' : '10';
        i += 1;

        await nameInput.clearText();
        await nameInput.typeText(name);
        await dismissKeyboard();

        await ageInput.clearText();
        await ageInput.typeText(age);
        await dismissKeyboard();

        await eyesInput.clearText();
        await eyesInput.typeText(eyesColor);
        await dismissKeyboard();

        await shoeInput.clearText();
        await shoeInput.typeText(shoeSize);
        await dismissKeyboard();

        return `${name} is ${age}, has ${eyesColor} eyes and shoe size of ${shoeSize}.`;
      }

      const story = await performInput();
      await buttonSaveItem.tap();
      await restartButton.tap();
      await buttonRestoreItem.tap();
      await expect(storyText).toHaveText(story);
      await restartButton.tap();

      // merging here

      const newStory = await performInput();

      await buttonMergeItem.tap();
      await restartButton.tap();
      await buttonRestoreItem.tap();
      await expect(storyText).toHaveText(newStory);
    });
  });

  // disabling this for now, due to some weird issues with latest builds
  xdescribe('get / set / clear item delegate test', () => {
    beforeAll(async () => {
      await test_getSetClear.tap();
      if (device.getPlatform() === 'android') {
        // Not yet supported.
        return;
      }

      await device.openURL({url: 'rnc-asyncstorage://set-delegate'});
    });

    it('should store value with delegate', async () => {
      if (device.getPlatform() === 'android') {
        // Not yet supported.
        return;
      }

      const storedNumberText = await element(by.id('storedNumber_text'));
      const increaseByTenButton = await element(by.id('increaseByTen_button'));

      await expect(storedNumberText).toHaveText('');

      const tapTimes = Math.round(Math.random() * 9) + 1;

      for (let i = 0; i < tapTimes; i++) {
        await increaseByTenButton.tap();
      }

      await expect(storedNumberText).toHaveText(`${tapTimes * 10}`);
      await restartButton.tap();

      // The delegate will distinguish itself by always returning the stored value + 1000000
      await expect(storedNumberText).toHaveText(`${tapTimes * 10 + 1000000}`);
    });

    it('should clear item with delegate', async () => {
      if (device.getPlatform() === 'android') {
        // Not yet supported.
        return;
      }

      const storedNumberText = await element(by.id('storedNumber_text'));
      const increaseByTenButton = await element(by.id('increaseByTen_button'));
      const clearButton = await element(by.id('clear_button'));

      await increaseByTenButton.tap();
      await clearButton.tap();
      await restartButton.tap();

      // The delegate will distinguish itself by actually setting storing 1000000
      // instead of clearing. It will also always return the stored value + 1000000.
      await expect(storedNumberText).toHaveText('2000000');
    });
  });

  describe('merge item delegate test', () => {
    beforeAll(async () => {
      await test_mergeItem.tap();
      if (device.getPlatform() === 'android') {
        // Not yet supported.
        return;
      }

      await element(by.id('setDelegate_button')).tap();
    });

    afterAll(async () => {
      if (device.getPlatform() === 'android') {
        // Not yet supported.
        return;
      }

      await element(by.id('unsetDelegate_button')).tap();
    });

    it('should merge items with delegate', async () => {
      if (device.getPlatform() === 'android') {
        // Not yet supported.
        return;
      }

      const buttonMergeItem = await element(by.id('mergeItem_button'));
      const buttonRestoreItem = await element(by.id('restoreItem_button'));

      const nameInput = await element(by.id('testInput-name'));
      const ageInput = await element(by.id('testInput-age'));
      const eyesInput = await element(by.id('testInput-eyes'));
      const shoeInput = await element(by.id('testInput-shoe'));
      const storyText = await element(by.id('storyTextView'));

      let i = 0;
      async function performInput() {
        const name = i === 0 ? 'Jerry' : 'Sarah';
        const age = i === 0 ? '21' : '23';
        const eyesColor = i === 0 ? 'blue' : 'green';
        const shoeSize = i === 0 ? '9' : '10';
        i += 1;

        await nameInput.clearText();
        await nameInput.typeText(name);
        await dismissKeyboard();

        await ageInput.clearText();
        await ageInput.typeText(age);
        await dismissKeyboard();

        await eyesInput.clearText();
        await eyesInput.typeText(eyesColor);
        await dismissKeyboard();

        await shoeInput.clearText();
        await shoeInput.typeText(shoeSize);
        await dismissKeyboard();

        return `${name} from delegate is ${age} from delegate, has ${eyesColor} eyes and shoe size of ${shoeSize}.`;
      }

      const story = await performInput();
      await buttonMergeItem.tap();
      await restartButton.tap();
      await buttonRestoreItem.tap();
      await expect(storyText).toHaveText(story);
    });
  });
});
