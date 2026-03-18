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
    <View style={[styles.outerContainer, disabled && styles.disabled]}>
      <TouchableOpacity
        onPress={() => onOctaveChange(Math.max(minOctave, currentOctave - 1))}
        style={[styles.tactileButton, (isMin || disabled) && styles.buttonDisabled]}
        disabled={isMin || disabled}
      >
        <Ionicons name="chevron-back" size={20} color={isMin || disabled ? "#bbb" : "#444"} />
      </TouchableOpacity>
      
      <View style={styles.displayPanel}>
        <Text style={[styles.labelText]}>OCTAVE</Text>
        <Text style={[styles.valueText, (isMin || isMax || disabled) && { color: '#666' }]}>
          {currentOctave}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onOctaveChange(Math.min(maxOctave, currentOctave + 1))}
        style={[styles.tactileButton, (isMax || disabled) && styles.buttonDisabled]}
        disabled={isMax || disabled}
      >
        <Ionicons name="chevron-forward" size={20} color={isMax || disabled ? "#bbb" : "#444"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tactileButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    // Shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
    elevation: 0,
    shadowOpacity: 0,
  },
  displayPanel: {
    marginHorizontal: 10,
    alignItems: 'center',
    minWidth: 50,
  },
  labelText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
    marginTop: -2,
    fontFamily: 'monospace',
  },
  disabled: {
    opacity: 0.6,
  },
});
