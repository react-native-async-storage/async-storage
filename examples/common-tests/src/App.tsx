import React, { useState } from "react";
import { Platform, StatusBar, Text, useColorScheme, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabButton } from "./components/TabButton";
import BasicTests from "./tests/BasicTests";

export function TestApp(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const [example, setExample] = useState<
    "basic" | "legacy-basic" | "perf" | "legacy-perf"
  >("basic");

  function getPlatform() {
    switch (Platform.OS) {
      case "ios": {
        return Platform.isVision ? "visionOS" : "iOS";
      }
      default:
        return Platform.OS;
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <Text style={{ fontSize: 24, color: "red" }}>
          Platform: {getPlatform()}
        </Text>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: 8,
            gap: 2,
          }}
        >
          <TabButton
            title="Basic"
            active={example === "basic"}
            onPress={() => setExample("basic")}
          />

          <TabButton
            title="Basic (Legacy)"
            active={example === "legacy-basic"}
            onPress={() => setExample("legacy-basic")}
          />
          <TabButton
            title="Performance"
            active={example === "perf"}
            onPress={() => setExample("perf")}
          />

          <TabButton
            title="Performance (Legacy)"
            active={example === "legacy-perf"}
            onPress={() => setExample("legacy-perf")}
          />
        </View>
        <BasicTests key={example} storageName="test-db-storage" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
