/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GetSet() {
  const [storedNumber, setStoredNumber] = React.useState('');
  const [needsRestart, setNeedsRestart] = React.useState(false);

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((value) => {
      if (value) {
        setStoredNumber(value);
      }
    });
  }, []);

  const increaseByTen = React.useCallback(async () => {
    const newNumber = +storedNumber > 0 ? +storedNumber + 10 : 10;

    await AsyncStorage.setItem(STORAGE_KEY, `${newNumber}`);

    setStoredNumber(`${newNumber}`);
    setNeedsRestart(true);
  }, [setNeedsRestart, setStoredNumber, storedNumber]);

  const clearItem = React.useCallback(async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setNeedsRestart(true);
  }, [setNeedsRestart]);

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

      <Button testID="clear_button" title="Clear item" onPress={clearItem} />

      {needsRestart ? <Text>Hit restart to see effect</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export const STORAGE_KEY = 'random';
