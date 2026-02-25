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
  maxZoom = 3,
}: ZoomControlsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onZoomChange(Math.max(minZoom, zoom - 1))}
        style={styles.iconButton}
      >
        <Ionicons name="remove-circle-outline" size={24} color="#333" />
      </TouchableOpacity>
      <Text style={styles.text}>
        {zoom} {zoom === 1 ? 'Octave' : 'Octaves'}
      </Text>
      <TouchableOpacity
        onPress={() => onZoomChange(Math.min(maxZoom, zoom + 1))}
        style={styles.iconButton}
      >
        <Ionicons name="add-circle-outline" size={24} color="#333" />
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
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 4,
    color: '#333',
  },
});
