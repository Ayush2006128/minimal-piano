import zoomControlsStyle from '@/styles/zoomControlsStyle';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
    <View style={zoomControlsStyle.outerContainer}>
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onZoomChange(Math.max(minZoom, zoom - 1));
        }}
        style={[zoomControlsStyle.tactileButton, isMin && zoomControlsStyle.buttonDisabled]}
        disabled={isMin}
      >
        <Ionicons name="remove" size={20} color={isMin ? "#bbb" : "#444"} />
      </TouchableOpacity>

      <View style={zoomControlsStyle.displayPanel}>
        <Text style={zoomControlsStyle.labelText}>ZOOM</Text>
        <Text style={[zoomControlsStyle.valueText, (isMin || isMax) && { color: '#666' }]}>
          {zoom}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onZoomChange(Math.min(maxZoom, zoom + 1));
        }}
        style={[zoomControlsStyle.tactileButton, isMax && zoomControlsStyle.buttonDisabled]}
        disabled={isMax}
      >
        <Ionicons name="add" size={20} color={isMax ? "#bbb" : "#444"} />
      </TouchableOpacity>
    </View>
  );
}

