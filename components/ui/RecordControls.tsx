import recordControlsStyle from '@/styles/recordControlsStyle';
import { colors } from '@/styles/theme';
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
  // Pulse animation for the record dot (scale + opacity)
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(1)).current;
  // Glow ring animation (expanding ring behind button)
  const glowScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (isRecording) {
      // Dot pulse: scale up and fade simultaneously
      const dotPulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseScale, {
              toValue: 1.35,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 0.4,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseScale, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(pulseOpacity, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      // Glow ring: expands outward and fades away
      const glowPulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(glowScale, {
              toValue: 1.8,
              duration: 900,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(glowScale, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(glowOpacity, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

      dotPulse.start();
      glowPulse.start();
      return () => {
        dotPulse.stop();
        glowPulse.stop();
      };
    } else {
      pulseScale.setValue(1);
      pulseOpacity.setValue(1);
      glowScale.setValue(1);
      glowOpacity.setValue(0);
    }
  }, [isRecording, pulseScale, pulseOpacity, glowScale, glowOpacity]);

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
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          {/* Glow ring behind the button */}
          {isRecording && (
            <Animated.View
              style={{
                position: 'absolute',
                width: 34,
                height: 34,
                borderRadius: 8,
                backgroundColor: colors.recordRed,
                transform: [{ scale: glowScale }],
                opacity: glowOpacity,
              }}
            />
          )}
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
                style={[
                  recordControlsStyle.recordDot,
                  {
                    opacity: pulseOpacity,
                    transform: [{ scale: pulseScale }],
                  },
                ]}
              />
            )}
          </TouchableOpacity>
        </View>
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
          color={canExport ? colors.activeIcon : colors.disabledIcon}
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
          color={canClear ? colors.activeIcon : colors.disabledIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
