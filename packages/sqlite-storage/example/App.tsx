import React, { useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { multiply } from "@react-native-async-storage/sqlite-storage";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const [result, setResult] = useState<string | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  async function test() {
    const random = Math.round(Math.random() * 100);
    const result = await multiply(random, 2);
    setResult(`${random} * 2 = ${result}`);
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Button title="test module" onPress={() => test()} />
        <View style={styles.result}>
          {result ? <Text style={styles.title}>{result}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: "400",
  },
  result: {
    fontSize: 24,
    marginTop: 24,
    fontWeight: "700",
  },
});

export default App;
