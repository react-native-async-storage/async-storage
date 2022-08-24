// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import {
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import tests from "./tests";

const SKIP_TEST = '51609ccd-8ca7-4559-a03a-273e237dba4f';

function Functional(): JSX.Element {
  const [results, setResults] = useState<[string, unknown, string?][]>([]);
  useEffect(() => {
    const results: [string, unknown, string?][] = [];
    Promise.resolve()
      .then(async () => {
        for (const [name, test] of Object.entries(tests)) {
          try {
            const expected = await test(name);
            const actual = await AsyncStorage.getItem(name);
            results.push([name, expected, actual]);
          } finally {
            await AsyncStorage.removeItem(name);
          }
        }
      })
      .then(async () => {
        const AsyncStorageTestSupport =
          NativeModules['AsyncStorageTestSupport'];

        for (const [currentName, test] of Object.entries(tests)) {
          const name = currentName + ' with delegate';

          if (!AsyncStorageTestSupport?.test_setDelegate) {
            results.push([name, SKIP_TEST]);
            continue;
          }

          const isNativeDelegateSet = await new Promise((resolve) => {
            AsyncStorageTestSupport.test_setDelegate(resolve);
          });
          if (!isNativeDelegateSet) {
            results.push([
              name,
              'Native delegate is set',
              'Failed to set native delegate',
            ]);
            continue;
          }

          try {
            const expected = await test(name);
            const actual = await AsyncStorage.getItem(name);
            results.push([name, expected, actual]);
          } finally {
            await AsyncStorage.removeItem(name);
            await new Promise((resolve) => {
              AsyncStorageTestSupport.test_unsetDelegate(resolve);
            });
          }
        }
      })
      .then(() => setResults(results));
  }, []);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View>
        {results.map(([name, expected, actual]) => {
          const testID = 'test:' + name;
          if (expected === SKIP_TEST) {
            return (
              <View key={name} style={styles.skipped}>
                <Text style={styles.testLabel}>{name}</Text>
                <Text accessibilityLabel="Skip" testID={testID}>Skip</Text>
              </View>
            );
          }

          const result =
            typeof expected === 'string'
              ? expected === actual
              : isEqual(expected, actual ? JSON.parse(actual) : null);
          return result ? (
            <View key={name} style={styles.passed}>
              <Text style={styles.testLabel}>{name}</Text>
              <Text accessibilityLabel="Pass" testID={testID}>Pass</Text>
            </View>
          ) : (
            <View key={name} style={styles.failed}>
              <Text style={styles.testLabel}>{name}</Text>
              <View accessibilityLabel="Fail" testID={testID}>
                <Text>{`Expected: ${JSON.stringify(expected)}`}</Text>
                <Text>{`Actual: ${actual}`}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  failed: {
    backgroundColor: '#e53935',
    flex: 1,
    padding: 4,
  },
  passed: {
    flex: 1,
    flexDirection: 'row',
    padding: 4,
  },
  skipped: {
    backgroundColor: '#ffeb3b',
    flex: 1,
    flexDirection: 'row',
    padding: 4,
  },
  testLabel: {
    flex: 1,
  },
});

export default {
  title: 'Functional',
  testId: 'functional',
  description: 'Functional tests',
  render() {
    return <Functional />;
  },
};
