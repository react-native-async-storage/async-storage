import React from 'react';
import {View, Text, Button, StyleSheet, ScrollView, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const mergeInitialValue = {
  initial: 'keep',
  override1: 'override',
  nested: {
    nestedValue: 'keep',
    override2: 'override',
    deeper: {
      deeperValue: 'keep',
      override3: 'override',
    },
  },
};

function NextExample() {
  const [keys, setKeys] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [inputKey, setInputKey] = React.useState();
  const [inputValue, setInputValue] = React.useState();
  const [value, setValue] = React.useState();
  const [mergedValue, setMergedValue] = React.useState();
  const [overrideValue, setOverrideValue] = React.useState({
    override1: '',
    override2: '',
    override3: '',
  });


  function runWithCatch(block) {
    return async () => {
      try {
        setError(null);
        await block();
      } catch (e) {
        setError('Caught: ' + e.message || e);
      }
    };
  }

  async function getAllKeys() {
    const allKeys = await AsyncStorage.getAllKeys();
    setKeys(allKeys);
  }

  async function readValue() {
    const v = await AsyncStorage.getItem(inputKey);
    setValue(v);
  }

  async function saveValue() {
    await AsyncStorage.setItem(inputKey, inputValue);
  }

  async function crashValueType() {
    await AsyncStorage.setItem('CRASH', 435345);
  }

  async function crashKeyNull() {
    await AsyncStorage.setItem(null, '435345');
  }

  async function crashKeyNotString() {
    await AsyncStorage.setItem(432, '435345');
  }

  async function removeValue() {
    await AsyncStorage.removeItem(inputKey);
  }

  async function clearDb() {
    await AsyncStorage.clear();
  }

  async function resetMergedValue() {
    await AsyncStorage.setItem('MERGER', JSON.stringify(mergeInitialValue));
    const saved = await AsyncStorage.getItem('MERGER');
    setMergedValue(JSON.parse(saved));
  }

  async function readMergedValue() {
    const saved = await AsyncStorage.getItem('MERGER');
    setMergedValue(saved ? JSON.parse(saved) : {});
  }

  async function mergeValues() {
    const {override1, override2, override3} = overrideValue;

    // leave out empty inputs
    const toMerge = {};
    if (override1) {
      toMerge.override1 = override1;
    }
    if (override2) {
      toMerge.nested = {
        override2: override2,
      };
    }
    if (override3) {
      if (!toMerge.nested) {
        toMerge.nested = {
          deeper: {
            override3: override3,
          },
        };
      } else {
        toMerge.nested.deeper = {
          override3: override3,
        };
      }
    }
    await AsyncStorage.mergeItem('MERGER', JSON.stringify(toMerge));
  }


  return <ScrollView contentContainerStyle={{flexGrow: 1}}>

    {error ? <Text style={styles.error}>{error}</Text> : null}

    <View style={styles.example}>
      <Text style={styles.title}>Basic operations</Text>
      <TextInput onChangeText={setInputKey} value={inputKey} style={styles.input} placeholder="key"/>
      <TextInput onChangeText={setInputValue} value={inputValue} style={styles.input} placeholder="value"/>
      <View style={styles.row}>
        <Button title="Read" onPress={runWithCatch(readValue)}/>
        <Button title="Save" onPress={runWithCatch(saveValue)}/>
        <Button title="Delete" onPress={runWithCatch(removeValue)}/>
      </View>
      <Text>Value for {inputKey}: {value}</Text>
    </View>

    <View style={styles.example}>
      <Text style={styles.title}>Crash scenarios</Text>
      <View style={styles.row}>
        <Button title="Key null" onPress={runWithCatch(crashKeyNull)}/>
        <Button title="Key not string" onPress={runWithCatch(crashKeyNotString)}/>
        <Button title="Wrong value type" onPress={runWithCatch(crashValueType)}/>
      </View>
    </View>

    <View style={styles.example}>
      <Text style={styles.title}>Merging</Text>
      <View style={styles.row}>
        <Text>{`Value:\n\n${JSON.stringify(mergedValue, null, 2)}`}</Text>
        <Text>{`Merge with:\n\n${JSON.stringify(overrideValue, null, 2)}`}</Text>
      </View>
      <View style={styles.row}>
        <Button title="Read" onPress={runWithCatch(readMergedValue)}/>
        <Button title="Reset" onPress={runWithCatch(resetMergedValue)}/>
        <Button title="Merge" onPress={runWithCatch(mergeValues)}/>
      </View>
      <View>
        <TextInput
          onChangeText={t => setOverrideValue(c => ({...c, override1: t}))}
          value={overrideValue.override1}
          style={styles.input} placeholder="override1"
        />
        <TextInput
          onChangeText={t => setOverrideValue(c => ({...c, override2: t}))}
          value={overrideValue.override2}
          style={styles.input} placeholder="override2"
        />
        <TextInput
          onChangeText={t => setOverrideValue(c => ({...c, override3: t}))}
          value={overrideValue.override3}
          style={styles.input} placeholder="override3"
        />
      </View>
    </View>

    <View style={styles.example}>
      <Text style={styles.title}>Display all keys</Text>
      <View style={styles.row}>
        <Button title="Get all keys" onPress={runWithCatch(getAllKeys)}/>
      </View>
      <Text>{keys.join(', ')}</Text>
    </View>

    <View style={styles.example}>
      <Text style={styles.title}>Clear database entries</Text>
      <Button title="clear" onPress={runWithCatch(clearDb)}/>
    </View>
  </ScrollView>;
}


const styles = StyleSheet.create({
  example: {
    paddingBottom: 24,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    borderStyle: 'solid',
    justifyContent: 'space-between',
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: 12,
  },
});


export default NextExample;
