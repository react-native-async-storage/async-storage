/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Button,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@@KEY';

type Props = {};
type State = {
  needRestart: boolean,
  name: string,
  age: string,
  traits: {
    trait1: string,
    trait2: string,
  },
};

const INPUTS = [
  {
    title: 'Name',
    stateFragment: 'name',
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
    testId: 'testInput-eyes',
  },
  {
    title: 'Shoe size',
    stateFragment: 'trait2',
    inputType: 'number-pad',
    testId: 'testInput-shoe',
  },
];

export default class Merge extends Component<Props, State> {
  state = {
    needRestart: false,
    name: '',
    age: '',
    traits: {
      trait1: '',
      trait2: '',
    },
  };

  mergeItem = async () => {
    const {
      name,
      age,
      traits: {trait1, trait2},
    } = this.state;

    const obj = {
      name,
      age,
      traits: {
        trait1,
        trait2,
      },
    };

    try {
      await AsyncStorage.mergeItem(KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn(e);
    }

    this.setState({needRestart: true});
  };

  saveItem = async () => {
    const {
      name,
      age,
      traits: {trait1, trait2},
    } = this.state;

    const obj = {
      name,
      age,
      traits: {
        trait1,
        trait2,
      },
    };

    try {
      await AsyncStorage.setItem(KEY, JSON.stringify(obj));
    } catch (e) {
      console.warn(e);
    }

    this.setState({needRestart: true});
  };

  restoreItem = async () => {
    let storedItem = {};

    try {
      const saved = await AsyncStorage.getItem(KEY);
      storedItem = JSON.parse(saved || '{"traits": {}}');
    } catch (e) {
      console.warn(e);
    }

    const {traits} = storedItem || {};

    this.setState({
      name: storedItem.name || '',
      age: storedItem.age || '',
      traits: {
        trait1: traits.trait1 || '',
        trait2: traits.trait2 || '',
      },
    });
  };

  render() {
    const {needRestart, name, age, traits} = this.state;
    const {trait1, trait2} = traits;
    return (
      <View>
        <View>
          <Text
            testID="storyTextView"
            style={
              styles.story
            }>{`${name} is ${age}, has ${trait1} eyes and shoe size of ${trait2}.`}</Text>
        </View>

        {INPUTS.map((input) => {
          const isTraitsPart = input.stateFragment.includes('trait');

          const value = isTraitsPart
            ? // $FlowFixMe
              traits[input.stateFragment]
            : // $FlowFixMe
              this.state[input.stateFragment];

          const onChangeHandler = (text) => {
            isTraitsPart
              ? this.setState(({traits: currentTraits}) => ({
                  // $FlowFixMe
                  traits: {
                    // $FlowFixMe
                    ...currentTraits,
                    // $FlowFixMe
                    [input.stateFragment]: text,
                  },
                }))
              : this.setState((state) =>
                  // $FlowFixMe
                  ({
                    // $FlowFixMe
                    ...state,
                    // $FlowFixMe
                    [input.stateFragment]: text,
                  }),
                );
          };

          return (
            <View key={input.title}>
              <Text>{input.title}:</Text>
              <TextInput
                testID={input.testId}
                style={styles.inputView}
                keyboardType={input.inputType || 'default'}
                onChangeText={onChangeHandler}
                value={value}
              />
            </View>
          );
        })}

        <View style={styles.bottomButtons}>
          <Button
            testID="saveItem_button"
            title="Save item"
            onPress={this.saveItem}
          />
          <Button
            testID="mergeItem_button"
            title="Merge item"
            onPress={this.mergeItem}
          />
          <Button
            testID="restoreItem_button"
            title="Restore item"
            onPress={this.restoreItem}
          />
        </View>

        <View style={styles.bottomButtons}>
          <Button
            testID="setDelegate_button"
            title="Set native delegate"
            disabled={
              !NativeModules.AsyncStorageTestSupport ||
              !NativeModules.AsyncStorageTestSupport.test_setDelegate
            }
            onPress={() =>
              NativeModules.AsyncStorageTestSupport.test_setDelegate(() => {})
            }
          />
          <Button
            testID="unsetDelegate_button"
            title="Unset native delegate"
            disabled={
              !NativeModules.AsyncStorageTestSupport ||
              !NativeModules.AsyncStorageTestSupport.test_unsetDelegate
            }
            onPress={() =>
              NativeModules.AsyncStorageTestSupport.test_unsetDelegate(() => {})
            }
          />
        </View>

        {needRestart ? <Text>Hit restart to see effect</Text> : null}
      </View>
    );
  }
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
