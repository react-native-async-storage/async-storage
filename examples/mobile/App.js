/**
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Button,
  Text,
  TouchableOpacity,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import LegacyExample from './src/legacy';

const Examples = {
  legacy: {
    title: 'Legacy',
    screen: LegacyExample,
  },
};

class AsyncStorageExampleApp extends React.Component {
  state = {
    page: Examples.legacy,
  };

  render() {
    const Example = this.state.page;

    return (
      <SafeAreaView style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            this.setState({page: null});
          }}>
          <Text style={{color: '#fff'}}>Reset</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {Object.keys(Examples).map(pageKey => {
            const example = Examples[pageKey];
            return (
              <View style={styles.sectionButton} key={example.title}>
                <Button
                  title={example.title}
                  onPress={() => {
                    this.setState({page: example});
                  }}
                />
              </View>
            );
          })}
        </View>
        {Example ? (
          <>
            <Text style={styles.sectionTitle}>{Example.title} Example</Text>
            <Example.screen />
          </>
        ) : (
          <Text>Please select an example</Text>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 16,
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 12,
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionButton: {
    marginRight: 15,
  },
  resetButton: {
    backgroundColor: '#ffb340',
    paddingHorizontal: 8,
    paddingVertical: 4,
    elevation: 3,
    alignSelf: 'flex-end',
  },
});

export default AsyncStorageExampleApp;
