import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  minZoom?: number;
  maxZoom?: number;
}

export default function ZoomControls({
  zoom,
  onZoomChange,
  minZoom = 1,
  maxZoom = 4,
}: ZoomControlsProps) {
  const isMin = zoom <= minZoom;
  const isMax = zoom >= maxZoom;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onZoomChange(Math.max(minZoom, zoom - 1))}
        style={[styles.iconButton, isMin && styles.disabled]}
        disabled={isMin}
      >
        <Ionicons name="remove-circle-outline" size={24} color={isMin ? "#ccc" : "#333"} />
      </TouchableOpacity>
      <Text style={[styles.text, (isMin || isMax) && { color: '#666' }]}>
        {zoom} {zoom === 1 ? 'Octave' : 'Octaves'}
      </Text>
      <TouchableOpacity
        onPress={() => onZoomChange(Math.min(maxZoom, zoom + 1))}
        style={[styles.iconButton, isMax && styles.disabled]}
        disabled={isMax}
      >
        <Ionicons name="add-circle-outline" size={24} color={isMax ? "#ccc" : "#333"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  iconButton: {
    padding: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#333',
  },
});
