/**
 * Copyright (c) Krzysztof Borowy
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {AsyncStorageNext} from '@react-native-community/async-storage';
import {STORAGE_KEY} from './GetSetClear';

export default function NextExample() {
  const [storedNumber, setStoredNumber] = React.useState(0);
  const [needRestart, setNeedRestart] = React.useState(false);

  const increaseByTen = async () => {
    const newNumber = +storedNumber > 0 ? +storedNumber + 10 : 10;

    await AsyncStorageNext.setItem(STORAGE_KEY, `${newNumber}`);
    await AsyncStorageNext.setItem(`${STORAGE_KEY}_2`, `${newNumber}`);
    await AsyncStorageNext.setItem(`${STORAGE_KEY}_3`, `${newNumber}`);
    await AsyncStorageNext.setItem(`${STORAGE_KEY}_4`, `${newNumber}`);
    setStoredNumber(newNumber);
    setNeedRestart(true);
  };

  const clearItem = async () => {
    await AsyncStorageNext.removeItem(STORAGE_KEY);

    setNeedRestart(true);
  };

  const displayKeys = async () => {
    const keys = await AsyncStorageNext.getAllKeys();
    alert(keys);
  };

  const dropDP = async () => {
    await AsyncStorageNext.clear();
  };

  const deleteMany = async () => {
    await AsyncStorageNext.multiRemove([
      'value1',
      'value2',
      'value3',
      'value4',
    ]);
  };

  const setMany = async () => {
    const values = {
      value1: '' + Math.floor(Math.random() * 100),
      value2: '' + Math.floor(Math.random() * 100),
      value3: '' + Math.floor(Math.random() * 100),
      value4: '' + Math.floor(Math.random() * 100),
    };

    await AsyncStorageNext.multiSet(values);
  };

  const getMany = async () => {
    const results = await AsyncStorageNext.multiGet([
      'value1',
      'value2',
      'value3',
      'value4',
    ]);

    alert(JSON.stringify(results));
  };

  React.useEffect(() => {
    (async () => {
      const value = await AsyncStorageNext.getItem(STORAGE_KEY);
      setStoredNumber(value || 0);
    })();
  }, []);

  return (
    <View>
      <Text style={styles.text}>Currently stored: </Text>
      <Text testID="storedNumber_text" style={styles.text}>
        {storedNumber}
      </Text>

      <Button
        testID="increaseByTen_button"
        title="Increase by 10"
        onPress={increaseByTen}
      />

      <Button testID="clear_button" title="Delete item" onPress={clearItem} />

      <Button
        testID="increaseByTen_button"
        title="get all keys"
        onPress={displayKeys}
      />
      <Button title="Drop DB" onPress={dropDP} />
      <Button title="Set many" onPress={setMany} />
      <Button title="Get many" onPress={getMany} />
      <Button title="Delete many" onPress={deleteMany} />

      {needRestart ? <Text>Hit restart to see effect</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
