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

import AsyncStorage from '@react-native-community/async-storage';

type Props = {};
type State = {
  needRestart: boolean,
};
export default class Clear extends Component<Props, State> {
  state = {
    needRestart: false,
  };

  clearAsyncStorage = async () => {
    await AsyncStorage.clear();

    this.setState({needRestart: true});
  };

  render() {
    const {needRestart} = this.state;
    return (
      <View>
        <Button
          testID="clear_button"
          title="Clear Local State"
          onPress={this.clearAsyncStorage}
        />

        {needRestart ? <Text>Hit restart to see effect</Text> : null}
      </View>
    );
  }
}
