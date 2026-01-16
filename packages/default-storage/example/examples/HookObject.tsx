// @ts-expect-error cannot find module
import { useAsyncStorageObject } from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import isEqual from "lodash/isEqual";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";

type User = {
  name: string;
  age: number;
  address?: {
    city: string;
    zip: string;
    country?: string;
  };
  preferences?: {
    theme: string;
    notifications?: string;
  };
};

type TestResult = {
  name: string;
  passed: boolean;
  error?: string;
};

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

function HookObject(): JSX.Element {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const runTests = async () => {
      const testResults: TestResult[] = [];

      // Test 1: Store and retrieve an object
      try {
        const hook = useAsyncStorageObject<User>("test_user");
        const user: User = { name: "Alice", age: 25 };
        await hook.setItem(user);
        const retrieved = await hook.getItem();

        if (isEqual(retrieved, user)) {
          testResults.push({
            name: "Should store and retrieve object",
            passed: true,
          });
        } else {
          testResults.push({
            name: "Should store and retrieve object",
            passed: false,
            error: `Expected ${JSON.stringify(user)}, got ${JSON.stringify(
              retrieved
            )}`,
          });
        }
        await hook.removeItem();
      } catch (error) {
        testResults.push({
          name: "Should store and retrieve object",
          passed: false,
          error: String(error),
        });
      }

      // Test 2: Return null for non-existent key
      try {
        const hook = useAsyncStorageObject<User>("nonexistent_key");
        const retrieved = await hook.getItem();

        if (retrieved === null) {
          testResults.push({
            name: "Should return null for non-existent key",
            passed: true,
          });
        } else {
          testResults.push({
            name: "Should return null for non-existent key",
            passed: false,
            error: `Expected null, got ${JSON.stringify(retrieved)}`,
          });
        }
      } catch (error) {
        testResults.push({
          name: "Should return null for non-existent key",
          passed: false,
          error: String(error),
        });
      }

      // Test 3: Deep merge objects
      try {
        const hook = useAsyncStorageObject<User>("merge_user");
        const initialUser: User = {
          name: "Bob",
          age: 30,
          address: { city: "New York", zip: "10001" },
          preferences: { theme: "dark", notifications: "enabled" },
        };
        await hook.setItem(initialUser);

        await hook.mergeItem({
          age: 31,
          address: { country: "USA" },
          preferences: { theme: "light" },
        });

        const merged = await hook.getItem();
        const expected: User = {
          name: "Bob",
          age: 31,
          address: { city: "New York", zip: "10001", country: "USA" },
          preferences: { theme: "light", notifications: "enabled" },
        };

        if (isEqual(merged, expected)) {
          testResults.push({
            name: "Should deep merge objects",
            passed: true,
          });
        } else {
          testResults.push({
            name: "Should deep merge objects",
            passed: false,
            error: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(
              merged
            )}`,
          });
        }
        await hook.removeItem();
      } catch (error) {
        testResults.push({
          name: "Should deep merge objects",
          passed: false,
          error: String(error),
        });
      }

      // Test 4: Remove item
      try {
        const hook = useAsyncStorageObject<User>("remove_user");
        await hook.setItem({ name: "Charlie", age: 28 });
        await hook.removeItem();
        const retrieved = await hook.getItem();

        if (retrieved === null) {
          testResults.push({
            name: "Should remove item",
            passed: true,
          });
        } else {
          testResults.push({
            name: "Should remove item",
            passed: false,
            error: `Expected null after removal, got ${JSON.stringify(
              retrieved
            )}`,
          });
        }
      } catch (error) {
        testResults.push({
          name: "Should remove item",
          passed: false,
          error: String(error),
        });
      }

      // Test 5: Handle arrays (they should be replaced, not merged)
      try {
        const hook = useAsyncStorageObject<{ tags: string[] }>("array_test");
        await hook.setItem({ tags: ["tag1", "tag2"] });
        await hook.mergeItem({ tags: ["tag3", "tag4"] });
        const retrieved = await hook.getItem();
        const expected = { tags: ["tag3", "tag4"] };

        if (isEqual(retrieved, expected)) {
          testResults.push({
            name: "Should replace arrays when merging",
            passed: true,
          });
        } else {
          testResults.push({
            name: "Should replace arrays when merging",
            passed: false,
            error: `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(
              retrieved
            )}`,
          });
        }
        await hook.removeItem();
      } catch (error) {
        testResults.push({
          name: "Should replace arrays when merging",
          passed: false,
          error: String(error),
        });
      }

      // Test 6: Merge with empty object should keep existing data
      try {
        const hook = useAsyncStorageObject<User>("empty_merge_test");
        const user: User = {
          name: "David",
          age: 35,
          address: { city: "Boston", zip: "02101" },
        };
        await hook.setItem(user);
        await hook.mergeItem({});
        const retrieved = await hook.getItem();

        if (isEqual(retrieved, user)) {
          testResults.push({
            name: "Should keep data when merging empty object",
            passed: true,
          });
        } else {
          testResults.push({
            name: "Should keep data when merging empty object",
            passed: false,
            error: `Expected ${JSON.stringify(user)}, got ${JSON.stringify(
              retrieved
            )}`,
          });
        }
        await hook.removeItem();
      } catch (error) {
        testResults.push({
          name: "Should keep data when merging empty object",
          passed: false,
          error: String(error),
        });
      }

      setResults(testResults);
    };

    runTests();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        {results.map((result) => {
          const testID = "test:" + result.name;
          if (result.passed) {
            return (
              <View key={result.name} style={styles.passed}>
                <Text style={styles.testLabel}>{result.name}</Text>
                <Text {...testProp(testID)} style={styles.testResult}>
                  Pass
                </Text>
              </View>
            );
          }

          return (
            <View key={result.name} style={styles.failed}>
              <Text style={styles.testLabel}>{result.name}</Text>
              <View>
                <Text {...testProp(testID)} style={styles.testResult}>
                  Fail
                </Text>
                <Text style={styles.errorText}>{result.error}</Text>
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
  errorText: {
    color: "#ffffff",
    fontSize: 12,
  },
  failed: {
    backgroundColor: "#e53935",
    flex: 1,
    padding: 4,
  },
  passed: {
    flex: 1,
    flexDirection: "row",
    padding: 4,
  },
  testLabel: {
    color: "#000000",
    flex: 1,
  },
  testResult: {
    color: "#000000",
  },
});

export default {
  title: "Hook Object",
  testId: "hook-object",
  description: "useAsyncStorageObject hook tests",
  render() {
    return <HookObject />;
  },
};
