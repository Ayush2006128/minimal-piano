import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface PianoBlackKeyProps {
  note: string;
  onPressIn?: () => void;
  onPressOut?: () => void;
  offset: string | number;
  width?: string | number;
}

export default function PianoBlackKey({
  note,
  onPressIn,
  onPressOut,
  offset,
  width = '8%',
}: PianoBlackKeyProps) {
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

  const widthVal = typeof width === 'string' ? parseFloat(width) : width;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.key,
        {
          left: offset,
          width: width,
          marginLeft: typeof width === 'string' ? `-${widthVal / 2}%` : -widthVal / 2,
        },
        isPressed && styles.keyPressed,
      ]}
    >
      <View style={styles.inner} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  key: {
    height: '60%',
    backgroundColor: '#333',
    position: 'absolute',
    zIndex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  keyPressed: {
    backgroundColor: '#000',
    height: '58%',
  },
  inner: {
    flex: 1,
  },
});
