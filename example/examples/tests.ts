import isEqual from 'lodash/isEqual';
import AsyncStorage from '../../src/index';

export default {
  'Should store value in AsyncStorage': async (key: string) => {
    let value = 0;
    for (let i = 0; i < 42; i += 10) {
      await AsyncStorage.setItem(key, i.toString());
      value = i;
    }
    return value.toString();
  },
  'Should clear item': async (key: string) => {
    const value = '42';
    await AsyncStorage.setItem(key, value);
    if ((await AsyncStorage.getItem(key)) !== value) {
      return false;
    }

    await AsyncStorage.removeItem(key);
    const actual = await AsyncStorage.getItem(key);
    return actual === value ? false : null;
  },
  'Should merge items': async (key: string) => {
    const initial = {
      name: 'Jerry',
      age: '21',
      eyesColor: 'blue',
      shoeSize: '9',
    };
    const edit = {
      name: 'Sarah',
      age: '23',
      eyesColor: 'green',
      shoeSize: '10',
    };

    await AsyncStorage.setItem(key, JSON.stringify(initial));
    if (isEqual(await AsyncStorage.getItem(key), initial)) {
      return false;
    }

    await AsyncStorage.mergeItem(key, JSON.stringify(edit));
    return edit;
  },
};
