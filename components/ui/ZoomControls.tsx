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
    <View style={styles.outerContainer}>
      <TouchableOpacity
        onPress={() => onZoomChange(Math.max(minZoom, zoom - 1))}
        style={[styles.tactileButton, isMin && styles.buttonDisabled]}
        disabled={isMin}
      >
        <Ionicons name="remove" size={20} color={isMin ? "#bbb" : "#444"} />
      </TouchableOpacity>

      <View style={styles.displayPanel}>
        <Text style={styles.labelText}>ZOOM</Text>
        <Text style={[styles.valueText, (isMin || isMax) && { color: '#666' }]}>
          {zoom}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onZoomChange(Math.min(maxZoom, zoom + 1))}
        style={[styles.tactileButton, isMax && styles.buttonDisabled]}
        disabled={isMax}
      >
        <Ionicons name="add" size={20} color={isMax ? "#bbb" : "#444"} />
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
    minWidth: 40,
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
});
