/**
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Switch,
  TextInput,
} from 'react-native';

import LegacyStorage from './src/legacy';
import Button from './src/components/Button';
import LegacyAsyncStorage from '@react-native-community/async-storage-backend-legacy';

const storagesAvailable = {
  Legacy: LegacyStorage,
};

function AsyncStorageExampleApp() {
  const [selectedStorageName, updateStorage] = useState('Legacy');
  const [multiValueMode, updateMultiValueMode] = useState(false);
  const [key, updateKey] = useState('');
  const [value, updateValue] = useState('');
  const [savedKeys, updatedSavedKeys] = useState([]);

  const storage = storagesAvailable[selectedStorageName];

  async function setValue() {
    if (multiValueMode) {
      const keys = key.split(',').map(k => k.trim());
      const values = value.split(',').map(v => v.trim());

      const keyValues = keys.map((k, index) => ({[k]: values[index]}));
      await storage.setMultiple(keyValues);
    } else {
      await storage.set(key, value);
    }
  }
  async function readValue() {
    if (multiValueMode) {
      const keys = key.split(',').map(k => k.trim());

      const values = await storage.getMultiple(keys);

      const val = Object.keys(values).map(k => values[k]);
      updateValue(val.join(', '));
    } else {
      const val = await storage.get(key);
      updateValue(val);
    }
  }
  async function deleteValue() {
    if (multiValueMode) {
      const keys = key.split(',').map(k => k.trim());
      await storage.removeMultiple(keys);
    } else {
      await storage.remove(key);
    }
  }
  async function getKeys() {
    const keys = await storage.getKeys();
    updatedSavedKeys(keys || []);
  }
  async function drop() {
    await storage.clearStorage();
  }

  const buttons = [
    {
      name: multiValueMode ? 'get many' : 'get single',
      func: readValue,
    },
    {
      name: multiValueMode ? 'save many' : 'save single',
      func: setValue,
    },
    {
      name: multiValueMode ? 'delete many' : 'delete single',
      func: deleteValue,
    },
    {
      name: 'get keys',
      func: getKeys,
    },
    {
      name: 'clear',
      func: drop,
    },
  ];

  return (
    <SafeAreaView style={styles.flexOne}>
      <View style={styles.container}>
        <Text style={styles.header}>Async Storage - Mobile example</Text>
        <View style={[styles.flexOne, styles.optionsContainer]}>
          <View style={styles.alignCenter}>
            <Text>Multi-value mode:</Text>
            <Switch
              style={styles.switch}
              onValueChange={updateMultiValueMode}
              value={multiValueMode}
            />
          </View>
          <View style={styles.optionsButtonContainer}>
            {Object.keys(storagesAvailable).map(storageName => {
              return (
                <Button
                  key={storageName}
                  title={storageName}
                  onPress={() => updateStorage(storageName)}
                  active={storageName === selectedStorageName}
                />
              );
            })}
          </View>
        </View>
      </View>
      <View style={styles.inputsContainer}>
        {multiValueMode ? (
          <Text>Note: keys and values should be separated by a coma</Text>
        ) : null}
        <TextInput
          autoCapitalize="none"
          placeholder={multiValueMode ? 'keys' : 'key'}
          style={styles.input}
          onChangeText={text => updateKey(text)}
          value={key}
        />
        <TextInput
          autoCapitalize="none"
          placeholder={multiValueMode ? 'values' : 'value'}
          style={styles.input}
          onChangeText={text => updateValue(text)}
          value={value}
        />
      </View>
      <View style={styles.savedKeysContainer}>
        <Text>Saved keys: {savedKeys.join(', ')}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        {buttons.map(({name, func}) => (
          <Button key={name} title={name} onPress={func} active />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  alignCenter: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  container: {
    marginTop: 16,
    paddingHorizontal: 12,
    flex: 1 / 4,
  },
  header: {
    fontSize: 18,
    color: '#020202',
    marginVertical: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionsButtonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  switch: {
    marginLeft: 10,
  },
  savedKeysContainer: {
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  inputsContainer: {
    flex: 1 / 4,
    paddingHorizontal: 12,
  },
  input: {
    backgroundColor: '#e8e8e8',
    marginVertical: 8,
    padding: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    flex: 2 / 4,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});

export default AsyncStorageExampleApp;
