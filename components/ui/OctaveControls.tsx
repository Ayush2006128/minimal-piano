import octaveControlsStyle from '@/styles/octaveControlsStyle';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
    <View style={[octaveControlsStyle.outerContainer, disabled && octaveControlsStyle.disabled]}>
      <TouchableOpacity
        onPress={() => onOctaveChange(Math.max(minOctave, currentOctave - 1))}
        style={[octaveControlsStyle.tactileButton, (isMin || disabled) && octaveControlsStyle.buttonDisabled]}
        disabled={isMin || disabled}
      >
        <Ionicons name="chevron-back" size={20} color={isMin || disabled ? "#bbb" : "#444"} />
      </TouchableOpacity>

      <View style={octaveControlsStyle.displayPanel}>
        <Text style={[octaveControlsStyle.labelText]}>OCTAVE</Text>
        <Text style={[octaveControlsStyle.valueText, (isMin || isMax || disabled) && { color: '#666' }]}>
          {currentOctave}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onOctaveChange(Math.min(maxOctave, currentOctave + 1))}
        style={[octaveControlsStyle.tactileButton, (isMax || disabled) && octaveControlsStyle.buttonDisabled]}
        disabled={isMax || disabled}
      >
        <Ionicons name="chevron-forward" size={20} color={isMax || disabled ? "#bbb" : "#444"} />
      </TouchableOpacity>
    </View>
  );
}


