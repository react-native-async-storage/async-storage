/**
 * @format
 */

import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

function Button({title, onPress, active}) {
  return (
    <TouchableOpacity activeOpacity={0.4} onPress={() => onPress()}>
      <View style={[styles.button, active && styles.active]}>
        <Text style={[styles.buttonText, active && styles.activeText]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    backgroundColor: '#e9dde6',
    paddingHorizontal: 4,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  buttonText: {
    color: '#262626',
    fontSize: 18,
  },
  active: {
    backgroundColor: '#0c7cd8',
  },
  activeText: {
    color: '#ffffff',
  },
});

export default Button;
