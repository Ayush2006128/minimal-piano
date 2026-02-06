import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface PianoWhiteKeyProps {
  note: string;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export default function PianoWhiteKey({ note, onPressIn, onPressOut }: PianoWhiteKeyProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
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
      <View style={styles.inner} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  key: {
    width: 60,
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
  },
});
