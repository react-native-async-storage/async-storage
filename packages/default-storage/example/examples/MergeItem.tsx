/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useState } from 'react';
import {
  Button,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Personalia = {
  age: string;
  name: string;
  traits: {
    trait1: string;
    trait2: string;
  };
};

const KEY = '@@KEY';

const INPUTS = [
  {
    title: 'Name',
    stateFragment: 'name',
    inputType: undefined,
    testId: 'testInput-name',
  },
  {
    title: 'Age',
    stateFragment: 'age',
    inputType: 'number-pad',
    testId: 'testInput-age',
  },
  {
    title: 'Eyes color',
    stateFragment: 'trait1',
    inputType: undefined,
    testId: 'testInput-eyes',
  },
  {
    title: 'Shoe size',
    stateFragment: 'trait2',
    inputType: 'number-pad',
    testId: 'testInput-shoe',
  },
] as const;

function Merge(): JSX.Element {
  const [needRestart, setNeedRestart] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [traits, setTraits] = useState({ trait1: '', trait2: '' });

  const mergeItem = useCallback(async () => {
    const obj = { name, age, traits };
    try {
      await AsyncStorage.mergeItem(KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn(e);
    }

    setNeedRestart(true);
  }, [name, age, traits]);

  const saveItem = useCallback(async () => {
    const obj = { name, age, traits };
    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn(e);
    }

    setNeedRestart(true);
  }, [name, age, traits]);

  const restoreItem = useCallback(async () => {
    let storedItem: Partial<Personalia> = {};

    try {
      const saved = await AsyncStorage.getItem(KEY);
      storedItem = JSON.parse(saved || '{"traits": {}}');
    } catch (e) {
      console.warn(e);
    }

    const { name, age, traits } = storedItem || {};

    setName(name || '');
    setAge(age || '');
    setTraits(traits || { trait1: '', trait2: '' });
  }, []);

  const { trait1, trait2 } = traits;

  return (
    <View>
      <View>
        <Text
          testID="storyTextView"
          style={styles.story}
        >{`${name} is ${age}, has ${trait1} eyes and shoe size of ${trait2}.`}</Text>
      </View>

      {INPUTS.map(({ title, stateFragment, inputType, testId }) => {
        const value = (() => {
          switch (stateFragment) {
            case 'age':
              return age;
            case 'name':
              return name;

            case 'trait1':
            case 'trait2':
              return traits[stateFragment];
          }
        })();

        const onChangeHandler = (() => {
          switch (stateFragment) {
            case 'age':
              return setAge;
            case 'name':
              return setName;

            case 'trait1':
            case 'trait2':
              return (text: string) =>
                setTraits({
                  ...traits,
                  [stateFragment]: text,
                });
          }
        })();

        return (
          <View key={title}>
            <Text>{title}:</Text>
            <TextInput
              testID={testId}
              style={styles.inputView}
              keyboardType={inputType || 'default'}
              onChangeText={onChangeHandler}
              value={value}
            />
          </View>
        );
      })}

      <View style={styles.bottomButtons}>
        <Button testID="saveItem_button" title="Save item" onPress={saveItem} />
        <Button
          testID="mergeItem_button"
          title="Merge item"
          onPress={mergeItem}
        />
        <Button
          testID="restoreItem_button"
          title="Restore item"
          onPress={restoreItem}
        />
      </View>

      <View style={styles.bottomButtons}>
        <Button
          testID="setDelegate_button"
          title="Set native delegate"
          disabled={
            !NativeModules['AsyncStorageTestSupport'] ||
            !NativeModules['AsyncStorageTestSupport'].test_setDelegate
          }
          onPress={() =>
            NativeModules['AsyncStorageTestSupport'].test_setDelegate(() => {})
          }
        />
        <Button
          testID="unsetDelegate_button"
          title="Unset native delegate"
          disabled={
            !NativeModules['AsyncStorageTestSupport'] ||
            !NativeModules['AsyncStorageTestSupport'].test_unsetDelegate
          }
          onPress={() =>
            NativeModules['AsyncStorageTestSupport'].test_unsetDelegate(
              () => {}
            )
          }
        />
      </View>

      {needRestart ? <Text>Hit restart to see effect</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputView: {
    borderColor: '#333',
    borderWidth: 0.5,
    borderStyle: 'solid',
    fontSize: 14,
    padding: 0,
  },
  bottomButtons: {
    justifyContent: 'space-around',
    marginTop: 20,
    flexDirection: 'row',
  },
  story: {
    fontSize: 18,
    color: '#222',
  },
});

export default {
  title: 'Merge item',
  testId: 'merge-item',
  description: 'Merge object with already stored data',
  render() {
    return <Merge />;
  },
};
