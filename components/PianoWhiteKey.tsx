import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';

interface PianoWhiteKeyProps {
  note: string;
  onPressIn?: () => void;
  onPressOut?: () => void;
  label?: string;
}

export default function PianoWhiteKey({ note, onPressIn, onPressOut, label }: PianoWhiteKeyProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    if (isPressed) return;
    setIsPressed(true);
    onPressIn?.();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    onPressOut?.();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.key, isPressed && styles.keyPressed]}
    >
      <View style={styles.inner}>
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  key: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  keyPressed: {
    backgroundColor: '#ebebeb',
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
  },
  label: {
    fontSize: 10,
    color: '#999',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
});
