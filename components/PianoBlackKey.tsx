import blackKeyStyle from '@/styles/blackKeyStyle';
import React, { useEffect } from 'react';
import { DimensionValue, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

interface PianoBlackKeyProps {
  note: string;
  isPressed?: boolean;
  offset: string | number;
  width?: string | number;
}

const TIMING_CONFIG = {
  duration: 80,
  easing: Easing.out(Easing.quad),
};

export default function PianoBlackKey({
  note,
  isPressed = false,
  offset,
  width = '8%',
}: PianoBlackKeyProps) {
  const widthVal = typeof width === 'string' ? parseFloat(width) : width;
  const pressed = useSharedValue(isPressed ? 1 : 0);

  useEffect(() => {
    pressed.value = withTiming(isPressed ? 1 : 0, TIMING_CONFIG);
  }, [isPressed]);

  const keyAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value === 1 ? '#000' : '#111',
      transform: [{ translateY: pressed.value * 2 }],
      shadowOpacity: interpolate(pressed.value, [0, 1], [0.6, 0.3]),
      elevation: interpolate(pressed.value, [0, 1], [8, 4]),
    };
  });

  const bottomLipAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(pressed.value, [0, 1], [12, 8]),
      backgroundColor: pressed.value === 1 ? '#111' : '#1a1a1a',
    };
  });

  return (
    <Animated.View
      style={[
        blackKeyStyle.key,
        {
          left: offset as DimensionValue,
          width: width as DimensionValue,
          marginLeft: (typeof width === 'string' ? `-${widthVal / 2}%` : -widthVal / 2) as DimensionValue,
        },
        keyAnimatedStyle,
      ]}
      pointerEvents="none"
    >
      <View style={blackKeyStyle.topSurface}>
        <View style={blackKeyStyle.topHighlight} />
      </View>
      <Animated.View style={[blackKeyStyle.bottomLip, bottomLipAnimatedStyle]} />
    </Animated.View>
  );
}
