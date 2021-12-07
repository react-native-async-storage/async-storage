/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useCallback, useState } from 'react';
import {
  Button,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BasicExample from './examples/Basic';
import GetSetClear from './examples/GetSetClear';
import MergeItem from './examples/MergeItem';

const TESTS = {
  GetSetClear: {
    title: 'Simple Get/Set value',
    testId: 'get-set-clear',
    description: 'Store and retrieve persisted data',
    render() {
      return <GetSetClear />;
    },
  },
  MergeItem: {
    title: 'Merge item',
    testId: 'merge-item',
    description: 'Merge object with already stored data',
    render() {
      return <MergeItem />;
    },
  },
  Basic: {
    title: 'Basic',
    testId: 'basic',
    description: 'Basic functionality test',
    render() {
      return <BasicExample />;
    },
  },
};

export default function App(): JSX.Element {
  const [iteration, setIteration] = useState(0);
  const [currentTest, setCurrentTest] = useState(TESTS.GetSetClear);

  const dismissKeyboard = useCallback(() => Keyboard.dismiss(), []);
  const simulateRestart = useCallback(
    () => setIteration(iteration + 1),
    [iteration]
  );
  const testBasic = useCallback(() => setCurrentTest(TESTS.Basic), []);
  const testGetSetClear = useCallback(
    () => setCurrentTest(TESTS.GetSetClear),
    []
  );
  const testMergeItem = useCallback(() => setCurrentTest(TESTS.MergeItem), []);

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

      <View style={styles.testPickerContainer}>
        <Button
          testID="testType_getSetClear"
          title="Get/Set/Clear"
          onPress={testGetSetClear}
        />
        <Button
          testID="testType_mergeItem"
          title="Merge Item"
          onPress={testMergeItem}
        />
        <Button title={TESTS.Basic.title} onPress={testBasic} />
      </View>

      <View
        testID={`example-${currentTest.testId}`}
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
