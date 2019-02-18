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
  let closeKeyboard;

  beforeAll(async () => {
    await device.reloadReactNative();
    restartButton = await element(by.id('restart_button'));
    clearButton = await element(by.id('clear_button'));
    increaseByTenButton = await element(by.id('increaseByTen_button'));
    storedNumberText = await element(by.id('text_storedNumber'));
    closeKeyboard = await element(by.id('closeKeyboard'));
  });

  it('should load all examples', async () => {
    await expect(element(by.id('examples_container'))).toExist();
    await expect(element(by.id('example-clear'))).toExist();
    await expect(element(by.id('example-get-set'))).toExist();
    await expect(element(by.id('example-merge-item'))).toExist();
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

  it('should merge items in async storage', async () => {
    const buttonSaveItem = await element(by.id('saveItem_button'));
    const buttonMergeItem = await element(by.id('mergeItem_button'));
    const buttonRestoreItem = await element(by.id('restoreItem_button'));

    const nameInput = await element(by.id('testInput-name'));
    const ageInput = await element(by.id('testInput-age'));
    const eyesInput = await element(by.id('testInput-eyes'));
    const shoeInput = await element(by.id('testInput-shoe'));
    const storyText = await element(by.id('storyTextView'));

    async function performInput() {
      const name = Math.random() > 0.5 ? 'Jerry' : 'Sarah';
      const age = Math.random() > 0.5 ? '21' : '23';
      const eyesColor = Math.random() > 0.5 ? 'blue' : 'green';
      const shoeSize = Math.random() > 0.5 ? '9' : '10';

      await nameInput.tap();
      await nameInput.typeText(name);
      await closeKeyboard.tap();

      await ageInput.tap();
      await ageInput.typeText(age);
      await closeKeyboard.tap();

      await eyesInput.tap();
      await eyesInput.typeText(eyesColor);
      await closeKeyboard.tap();

      await shoeInput.tap();
      await shoeInput.typeText(shoeSize);
      await closeKeyboard.tap();

      return `${name} is ${age}, has ${eyesColor} eyes and shoe size of ${shoeSize}.`;
    }

    await element(by.id('examples_container')).scrollTo('bottom');

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
