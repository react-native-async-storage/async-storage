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
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Keyboard,
} from 'react-native';

import SimpleGetSet from './examples/GetSet';
import ClearStorage from './examples/ClearSingle';
import MergeItem from './examples/MergeItem';

const EXAMPLES = [
  {
    title: 'Simple Get/Set value',
    testId: 'get-set',
    description: 'Store and retrieve persisted data',
    render() {
      return <SimpleGetSet />;
    },
  },
  {
    title: 'Clear',
    testId: 'clear',
    description: 'Clear persisting data storage',
    render() {
      return <ClearStorage />;
    },
  },
  {
    title: 'Merge item',
    testId: 'merge-item',
    description: 'Merge object with already stored data',
    render() {
      return <MergeItem />;
    },
  },
];

type Props = {};
type State = {restarting: boolean};

export default class App extends Component<Props, State> {
  state = {
    restarting: false,
  };

  _simulateRestart = () => {
    this.setState({restarting: true}, () => this.setState({restarting: false}));
  };

  render() {
    const {restarting} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.closeKeyboardView}
          onPress={() => Keyboard.dismiss()}
          testID="closeKeyboard"
        />

        <TouchableOpacity
          testID="restart_button"
          onPress={this._simulateRestart}
          style={styles.restartButton}
          activeOpacity={0.6}>
          <Text>Simulate Restart</Text>
        </TouchableOpacity>
        <ScrollView testID="examples_container">
          {restarting
            ? null
            : EXAMPLES.map(example => {
                return (
                  <View
                    testID={`example-${example.testId}`}
                    key={example.title}
                    style={styles.exampleContainer}>
                    <Text style={styles.exampleTitle}>{example.title}</Text>
                    <Text style={styles.exampleDescription}>
                      {example.description}
                    </Text>
                    <View style={styles.exampleInnerContainer}>
                      {example.render()}
                    </View>
                  </View>
                );
              })}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 14,
  },
  exampleContainer: {
    padding: 16,
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  exampleTitle: {
    fontSize: 18,
  },
  exampleDescription: {
    color: '#333333',
    marginBottom: 16,
  },
  exampleInnerContainer: {
    borderColor: '#EEE',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  restartButton: {
    padding: 15,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  closeKeyboardView: {
    width: 5,
    height: 5,
    margin: 20,
  },
});
