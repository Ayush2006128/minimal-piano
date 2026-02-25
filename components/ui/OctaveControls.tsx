import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OctaveControlsProps {
  currentOctave: number;
  onOctaveChange: (octave: number) => void;
  minOctave?: number;
  maxOctave?: number;
}

export default function OctaveControls({
  currentOctave,
  onOctaveChange,
  minOctave = 1,
  maxOctave = 7,
}: OctaveControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onOctaveChange(Math.max(minOctave, currentOctave - 1))}
        style={styles.iconButton}
      >
        <Ionicons name="chevron-back-outline" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.text}>Octave {currentOctave}</Text>
      <TouchableOpacity
        onPress={() => onOctaveChange(Math.min(maxOctave, currentOctave + 1))}
        style={styles.iconButton}
      >
        <Ionicons name="chevron-forward-outline" size={24} color="#333" />
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
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#333',
  },
});
