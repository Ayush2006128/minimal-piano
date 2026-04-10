import whiteKeyStyle from '@/styles/whiteKeyStyle';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface PianoWhiteKeyProps {
  note: string;
  isPressed?: boolean;
  label?: string;
}

const TIMING_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

export default function PianoWhiteKey({ note, isPressed = false, label }: PianoWhiteKeyProps) {
  const pressed = useSharedValue(isPressed ? 1 : 0);

  useEffect(() => {
    pressed.value = withTiming(isPressed ? 1 : 0, TIMING_CONFIG);
  }, [isPressed]);

  const keyAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value === 1 ? '#f0f0f0' : '#ffffff',
      transform: [{ translateY: pressed.value * 2 }],
      shadowOpacity: 0.1 - pressed.value * 0.05,
      elevation: 3 - pressed.value * 2,
    };
  });

  const bottomLipAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: 8 - pressed.value * 4,
      backgroundColor: pressed.value === 1 ? '#d4d4d4' : '#e8e8e8',
    };
  });

  return (
    <Animated.View style={[whiteKeyStyle.key, keyAnimatedStyle]}>
      <View style={whiteKeyStyle.topHighlight} />
      <View style={whiteKeyStyle.inner}>
        {label && <Text style={whiteKeyStyle.label}>{label}</Text>}
      </View>
      <Animated.View style={[whiteKeyStyle.bottomLip, bottomLipAnimatedStyle]} />
    </Animated.View>
  );
}
