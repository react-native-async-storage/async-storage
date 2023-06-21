/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  Button,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Basic from './examples/Basic';
import Functional from './examples/Functional';
import GetSetClear from './examples/GetSetClear';
import MergeItem from './examples/MergeItem';

const SCREENS = {
  Functional,
  GetSetClear,
  MergeItem,
  Basic,
};

export default function App(): JSX.Element {
  const [iteration, setIteration] = useState(0);
  const [currentTest, setCurrentTest] = useState(SCREENS.Functional);

  const dismissKeyboard = useCallback(() => Keyboard.dismiss(), []);
  const simulateRestart = useCallback(
    () => setIteration(iteration + 1),
    [iteration]
  );
  const navigationBar = useMemo(
    () =>
      Object.values(SCREENS).map((t) => {
        const { testId, title } = t;
        return (
          <Button
            key={testId}
            testID={testId}
            title={title}
            onPress={() => setCurrentTest(t)}
          />
        );
      }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.closeKeyboardView}
        onPress={dismissKeyboard}
        testID="closeKeyboard"
      />
      <TouchableOpacity
        testID="restart_button"
        onPress={simulateRestart}
        style={styles.restartButton}
        activeOpacity={0.6}
      >
        <Text>Simulate Restart</Text>
      </TouchableOpacity>

      <View style={styles.testPickerContainer}>{navigationBar}</View>

      <View
        accessibilityLabel={`${currentTest.testId}-view`}
        key={currentTest.title + iteration}
        style={styles.exampleContainer}
      >
        <Text style={styles.exampleTitle}>{currentTest.title}</Text>
        <Text style={styles.exampleDescription}>{currentTest.description}</Text>
        <View style={styles.exampleInnerContainer}>{currentTest.render()}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 8,
  },
  exampleContainer: {
    padding: 4,
    backgroundColor: '#FFF',
    borderColor: '#EEE',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flex: 1,
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
    paddingTop: 10,
    flex: 1,
  },
  restartButton: {
    padding: 6,
    borderRadius: 5,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  closeKeyboardView: {
    width: 5,
    height: 5,
  },
  testPickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
