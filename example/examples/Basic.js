import React from 'react';
import {View, Text, Button, StyleSheet, ScrollView, TextInput, NativeModules} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RCTAsyncStorage = NativeModules.RNC_AsyncSQLiteDBStorage ||
  NativeModules.RNCAsyncStorage;


function NextExample() {
  const [keys, setKeys] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [inputKey, setInputKey] = React.useState();
  const [inputValue, setInputValue] = React.useState();
  const [value, setValue] = React.useState();


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
    await AsyncStorage.setItem(null, 435345);
  }

  function unknownCrash() {
    // very unlikely to happen, unless module used directly
    return new Promise((res, rej) => {
      RCTAsyncStorage.multiSet(['key', 'crash'], function(errors) {
        if (errors) {
          const message = Array.isArray(errors) ? errors[0].message : errors.message;
          rej(new Error(message));
        } else {
          res();
        }
      });
    });
  }

  async function removeValue() {
    await AsyncStorage.removeItem(inputKey);
  }

  async function clearDb() {
    await AsyncStorage.clear();
  }

  return <ScrollView contentContainerStyle={{flexGrow: 1}}>

    {error ? <Text style={{fontSize: 18, color: 'red'}}>{error}</Text> : null}

    <View style={styles.example}>
      <TextInput onChangeText={setInputKey} value={inputKey} style={styles.input} placeholder="key"/>
      <TextInput onChangeText={setInputValue} value={inputValue} style={styles.input} placeholder="value"/>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button title="Read" onPress={runWithCatch(readValue)}/>
        <Button title="Save" onPress={runWithCatch(saveValue)}/>
        <Button title="Delete" onPress={runWithCatch(removeValue)}/>
      </View>
      <Text>Value for {inputKey}: {value}</Text>
    </View>

    <View style={styles.example}>
      <Text style={{fontSize: 16, fontWeight: '700'}}>Crash scenarios</Text>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button title="Key null" onPress={runWithCatch(crashKeyNull)}/>
        <Button title="Wrong value type" onPress={runWithCatch(crashValueType)}/>
        <Button title="Other crash" onPress={runWithCatch(unknownCrash)}/>
      </View>
    </View>

    <View style={styles.example}>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button title="Get all keys" onPress={runWithCatch(getAllKeys)}/>
      </View>
      <Text style={{fontWeight: '700'}}>Keys:</Text>
      <Text>{keys.join(', ')}</Text>
    </View>

    <View style={styles.example}>
      <Text style={{fontSize: 16}}>Clear database entries</Text>
      <Button title="clear" onPress={runWithCatch(clearDb)}/>
    </View>
  </ScrollView>;
}


const styles = StyleSheet.create({
  example: {
    paddingVertical: 24,
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
});


export default NextExample;
