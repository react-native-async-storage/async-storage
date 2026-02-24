import type { TestRunner } from "example-common-tests";
import React from "react";
import { Button, Pressable, ScrollView, Text, View } from "react-native";

export const TestRunnerView: React.FC<{ runner: TestRunner }> = ({
  runner,
}) => {
  const { tests, logs, clearLogs } = runner;
  return (
    <View style={{ paddingHorizontal: 16, flex: 1 }}>
      <View style={{ gap: 8, flexDirection: "row", flexWrap: "wrap" }}>
        {tests.map((test) => {
          return (
            <Button key={test.name} title={test.name} onPress={test.run} />
          );
        })}
      </View>

      <View style={{ width: "100%", flex: 1 }}>
        <View style={{ width: "100%", alignItems: "flex-end" }}>
          <Pressable
            onPress={clearLogs}
            style={({ pressed }) => [
              {
                padding: 12,
                width: 90,
                backgroundColor: pressed ? "rgb(210, 230, 255)" : "transparent",
              },
            ]}
          >
            <Text>clear logs</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ gap: 12 }}>
          {logs.map((log, i) => (
            <View key={i}>
              {log.messages.map((message) => (
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      log.type === "ok"
                        ? "green"
                        : log.type === "err"
                          ? "red"
                          : "",
                  }}
                  key={message}
                >
                  {message}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
