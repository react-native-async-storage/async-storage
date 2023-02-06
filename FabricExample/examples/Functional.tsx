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
import type { TestStep, TestValue } from './tests';
import tests from './tests';

const SKIP_TEST = '51609ccd-8ca7-4559-a03a-273e237dba4f';

type TestResult =
  | typeof SKIP_TEST
  | {
      step: number;
      expected: TestValue;
      actual?: string | null;
    };

function compare(expected: TestValue, actual: string): boolean {
  return typeof expected === 'string'
    ? expected === actual
    : isEqual(expected, JSON.parse(actual));
}

function stringify(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

async function executeStep(step: TestStep): Promise<void> {
  switch (step.command) {
    case 'merge': {
      const { key, value, expected } = step;
      await AsyncStorage.mergeItem(key, stringify(value));
      const actual = await AsyncStorage.getItem(key);
      if (!compare(expected || value, actual)) {
        throw [expected || value, actual];
      }
      break;
    }
    case 'remove': {
      const { key } = step;
      await AsyncStorage.removeItem(key);
      const actual = await AsyncStorage.getItem(key);
      if (actual !== null) {
        throw [null, actual];
      }
      break;
    }
    case 'set': {
      const { key, value, expected } = step;
      await AsyncStorage.setItem(key, stringify(value));
      const actual = await AsyncStorage.getItem(key);
      if (!compare(expected || value, actual)) {
        throw [expected || value, actual];
      }
      break;
    }
  }
}

async function execute(steps: TestStep[]): Promise<void> {
  const numSteps = steps.length;
  for (let i = 0; i < numSteps; ++i) {
    try {
      await executeStep(steps[i]);
    } catch ([expected, actual]) {
      throw { step: i, expected, actual };
    } finally {
      await AsyncStorage.clear();
    }
  }
}

function Functional(): JSX.Element {
  const [results, setResults] = useState<[string, TestResult?][]>([]);
  useEffect(() => {
    const results: [string, TestResult?][] = [];
    Promise.resolve()
      .then(async () => {
        for (const [name, test] of Object.entries(tests)) {
          try {
            await execute(test);
            results.push([name, undefined]);
          } catch (e: any) {
            results.push([name, e]);
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
              {
                step: 0,
                expected: 'Native delegate is set',
                actual: 'Failed to set native delegate',
              },
            ]);
            continue;
          }

          try {
            await execute(test);
            results.push([name, undefined]);
          } catch (e: any) {
            results.push([name, e]);
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
        {results.map(([name, result]) => {
          const testID = 'test:' + name;
          if (!result) {
            return (
              <View key={name} style={styles.passed}>
                <Text style={styles.testLabel}>{name}</Text>
                <Text accessibilityLabel="Pass" testID={testID}>
                  Pass
                </Text>
              </View>
            );
          }

          if (result === SKIP_TEST) {
            return (
              <View key={name} style={styles.skipped}>
                <Text style={styles.testLabel}>{name}</Text>
                <Text accessibilityLabel="Skip" testID={testID}>
                  Skip
                </Text>
              </View>
            );
          }

          return (
            <View key={name} style={styles.failed}>
              <Text style={styles.testLabel}>{name}</Text>
              <View accessibilityLabel="Fail" testID={testID}>
                <Text>{`Step: ${result.step + 1}`}</Text>
                <Text>{`Expected: ${stringify(result.expected)}`}</Text>
                <Text>{`Actual: ${result.actual}`}</Text>
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
