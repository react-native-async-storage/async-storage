/**
 *
 * @format
 * @flow
 */

import React from 'react';
import {Text, View, StyleSheet, TextInput, Button} from 'react-native';

import storage from './storage';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

class LegacyExample extends React.Component {
  state = {
    key: '',
    value: '',
    savedText: '',
    storageKeys: [],
  };

  componentDidMount() {
    this.readFromStorage();
  }

  saveToStorage = async () => {
    if (this.state.key) {
      await storage.set(this.state.key, this.state.value);
    }
  };

  readFromStorage = async () => {
    let readText = '';
    if (this.state.key) {
      readText = (await storage.get(this.state.key)) || '';
    }

    this.setState({
      savedText: readText,
    });
  };

  clearFromStorage = async () => {
    if (this.state.key) {
      await storage.remove(this.state.key);
    }

    await this.readFromStorage();
  };

  showKeys = async () => {
    const keys = await storage.getKeys();

    console.log({keys});

    this.setState(() => ({
      storageKeys: keys,
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.subtitle}>storage key: </Text>
          <TextInput
            style={styles.input}
            value={this.state.key}
            onChange={({nativeEvent: {text}}) => this.setState({key: text})}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.subtitle}>value: </Text>
          <TextInput
            style={styles.input}
            value={this.state.value}
            onChange={({nativeEvent: {text}}) => this.setState({value: text})}
          />
        </View>

        <Text style={styles.title}>Stored text: {this.state.savedText} </Text>
        <Text style={styles.title}>
          Stored keys: {this.state.storageKeys.join(', ')}
        </Text>

        <View style={styles.buttonsContainer}>
          <Button title={'Save'} onPress={this.saveToStorage} />
          <Button title={'Read'} onPress={this.readFromStorage} />
          <Button title={'Clear'} onPress={this.clearFromStorage} />
          <Button title={'Show keys'} onPress={this.showKeys} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    borderColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    marginHorizontal: 12,
    flex: 3 / 5,
    alignSelf: 'center',
  },

  section: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: 8,
  },
  subtitle: {
    flex: 2 / 5,
    fontSize: 14,
    width: 40,
    alignContent: 'flex-end',
    textAlign: 'right',
  },
  title: {
    fontSize: 18,
    color: Colors.dark,
    marginVertical: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default LegacyExample;
