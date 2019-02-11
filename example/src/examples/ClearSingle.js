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
import {Text, View, Button} from 'react-native';

import AsyncStorage from '@react-native-community/asyns-storage';

import {STORAGE_KEY} from './GetSet';

type Props = {
  resetFunction: () => void,
};
type State = {
  storedNumber: number,
  needRestart: boolean,
};
export default class Clear extends Component<Props, State> {
  state = {
    needRestart: false,
  };

  cleanItem = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);

    this.setState({needRestart: true});
  };

  render() {
    const {needRestart} = this.state;
    return (
      <View>
        <Button title="Clear Local State" onPress={this.cleanItem} />

        {needRestart ? <Text>Hit restart to see effect</Text> : null}
      </View>
    );
  }
}
