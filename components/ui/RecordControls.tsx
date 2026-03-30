import recordControlsStyle from '@/styles/recordControlsStyle';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

interface RecordControlsProps {
  isRecording: boolean;
  isExporting: boolean;
  hasRecording: boolean;
  onToggleRecord: () => void;
  onExport: () => void;
  onClear: () => void;
}

export default function RecordControls({
  isRecording,
  isExporting,
  hasRecording,
  onToggleRecord,
  onExport,
  onClear,
}: RecordControlsProps) {
  // Pulse animation for the record button when recording
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const canExport = hasRecording && !isRecording && !isExporting;
  const canClear = hasRecording && !isRecording && !isExporting;

  // Status label
  let statusText = 'IDLE';
  if (isRecording) statusText = 'REC';
  else if (isExporting) statusText = 'SAVING';
  else if (hasRecording) statusText = 'READY';

  return (
    <View style={recordControlsStyle.outerContainer}>
      {/* Record / Stop button */}
      <Animated.View style={{ opacity: isExporting ? 0.5 : 1 }}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onToggleRecord();
          }}
          style={[
            recordControlsStyle.tactileButton,
            recordControlsStyle.recordButton,
            isRecording && recordControlsStyle.recordButtonActive,
            isExporting && recordControlsStyle.buttonDisabled,
          ]}
          disabled={isExporting}
        >
          {isRecording ? (
            <View style={recordControlsStyle.stopSquare} />
          ) : (
            <Animated.View
              style={[recordControlsStyle.recordDot, { opacity: pulseAnim }]}
            />
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Status display */}
      <View style={recordControlsStyle.displayPanel}>
        <Text style={recordControlsStyle.labelText}>RECORD</Text>
        <Text
          style={[
            recordControlsStyle.valueText,
            isRecording && recordControlsStyle.recordingLabel,
          ]}
        >
          {statusText}
        </Text>
      </View>

      {/* Export button */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onExport();
        }}
        style={[
          recordControlsStyle.tactileButton,
          !canExport && recordControlsStyle.buttonDisabled,
        ]}
        disabled={!canExport}
      >
        <Ionicons
          name="download-outline"
          size={16}
          color={canExport ? '#444' : '#bbb'}
        />
      </TouchableOpacity>

      {/* Clear button */}
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onClear();
        }}
        style={[
          recordControlsStyle.tactileButton,
          !canClear && recordControlsStyle.buttonDisabled,
        ]}
        disabled={!canClear}
      >
        <Ionicons
          name="trash-outline"
          size={16}
          color={canClear ? '#444' : '#bbb'}
        />
      </TouchableOpacity>
    </View>
  );
}
