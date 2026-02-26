import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OctaveControlsProps {
  currentOctave: number;
  onOctaveChange: (octave: number) => void;
  minOctave?: number;
  maxOctave?: number;
  disabled?: boolean;
}

export default function OctaveControls({
  currentOctave,
  onOctaveChange,
  minOctave = 1,
  maxOctave = 7,
  disabled = false,
}: OctaveControlsProps) {
  const isMin = currentOctave <= minOctave;
  const isMax = currentOctave >= maxOctave;

  return (
    <View style={[styles.container, disabled && styles.disabled]}>
      <TouchableOpacity
        onPress={() => onOctaveChange(Math.max(minOctave, currentOctave - 1))}
        style={[styles.iconButton, (isMin || disabled) && styles.buttonDisabled]}
        disabled={isMin || disabled}
      >
        <Ionicons name="chevron-back-outline" size={24} color={isMin || disabled ? "#ccc" : "#333"} />
      </TouchableOpacity>
      <Text style={[styles.text, (isMin || isMax || disabled) && { color: '#999' }]}>
        Octave {currentOctave}
      </Text>
      <TouchableOpacity
        onPress={() => onOctaveChange(Math.min(maxOctave, currentOctave + 1))}
        style={[styles.iconButton, (isMax || disabled) && styles.buttonDisabled]}
        disabled={isMax || disabled}
      >
        <Ionicons name="chevron-forward-outline" size={24} color={isMax || disabled ? "#ccc" : "#333"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  iconButton: {
    padding: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonDisabled: {
    // optional extra styling for disabled buttons
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#333',
  },
});
