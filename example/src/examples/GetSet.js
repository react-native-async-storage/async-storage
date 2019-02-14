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
import {StyleSheet, Text, View, Button} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

type Props = {};
type State = {
  storedNumber: string,
  needRestart: boolean,
};
export default class GetSet extends Component<Props, State> {
  state = {
    storedNumber: '',
    needRestart: false,
  };

  async componentWillMount() {
    const storedNumber = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedNumber) {
      this.setState({
        storedNumber,
      });
    }
  }

  storeRandom = async () => {
    const randomNum = Math.round(Math.random() * 100).toString();
    await AsyncStorage.setItem(STORAGE_KEY, randomNum);

    this.setState({storedNumber: randomNum, needRestart: true});
  };

  render() {
    const {storedNumber, needRestart} = this.state;
    return (
      <View>
        <Text style={styles.text}>Currently stored: {storedNumber}</Text>

        <Button title="Save random number" onPress={this.storeRandom} />

        {needRestart ? <Text>Hit restart to see effect</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export const STORAGE_KEY = 'random';
