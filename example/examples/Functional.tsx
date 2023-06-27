// @ts-ignore
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import {
  NativeModules,
  Platform,
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

const testProp = (id: string) =>
  Platform.select({
    android: {
      accessible: true,
      accessibilityLabel: id,
    },
    ios: {
      accessible: false,
      testID: id,
    },
  });

function Functional(): JSX.Element {
  const [results, setResults] = useState<[string, TestResult?][]>([]);
  useEffect(() => {
    const testResults: [string, TestResult?][] = [];
    Promise.resolve()
      .then(async () => {
        for (const [name, test] of Object.entries(tests)) {
          try {
            await execute(test);
            testResults.push([name, undefined]);
          } catch (e: any) {
            testResults.push([name, e]);
          }
        }
      })
      .then(async () => {
        const AsyncStorageTestSupport =
          NativeModules['AsyncStorageTestSupport'];

        for (const [currentName, test] of Object.entries(tests)) {
          const name = currentName + ' with delegate';

          if (!AsyncStorageTestSupport?.test_setDelegate) {
            testResults.push([name, SKIP_TEST]);
            continue;
          }

          const isNativeDelegateSet = await new Promise((resolve) => {
            AsyncStorageTestSupport.test_setDelegate(resolve);
          });
          if (!isNativeDelegateSet) {
            testResults.push([
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
            testResults.push([name, undefined]);
          } catch (e: any) {
            testResults.push([name, e]);
            await new Promise((resolve) => {
              AsyncStorageTestSupport.test_unsetDelegate(resolve);
            });
          }
        }
      })
      .then(() => setResults(testResults));
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        {results.map(([name, result]) => {
          const testID = 'test:' + name;
          if (!result) {
            return (
              <View key={name} style={styles.passed}>
                <Text style={styles.testLabel}>{name}</Text>
                <Text {...testProp(testID)} style={styles.testResult}>
                  Pass
                </Text>
              </View>
            );
          }

          if (result === SKIP_TEST) {
            return (
              <View key={name} style={styles.skipped}>
                <Text style={styles.testLabel}>{name}</Text>
                <Text {...testProp(testID)} style={styles.testResult}>
                  Skip
                </Text>
              </View>
            );
          }

          return (
            <View key={name} style={styles.failed}>
              <Text {...testProp(testID)} style={styles.testLabel}>
                {name}
              </Text>
              <View>
                <Text style={styles.testResult}>{`Step: ${
                  result.step + 1
                }`}</Text>
                <Text style={styles.testResult}>{`Expected: ${stringify(
                  result.expected
                )}`}</Text>
                <Text
                  style={styles.testResult}
                >{`Actual: ${result.actual}`}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
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
    color: '#000000',
    flex: 1,
  },
  testResult: {
    color: '#000000',
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
