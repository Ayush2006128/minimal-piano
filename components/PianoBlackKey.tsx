import blackKeyStyle from '@/styles/blackKeyStyle';
import React from 'react';
import { DimensionValue, View } from 'react-native';

interface PianoBlackKeyProps {
  note: string;
  isPressed?: boolean;
  offset: string | number;
  width?: string | number;
}

export default function PianoBlackKey({
  note,
  isPressed = false,
  offset,
  width = '8%',
}: PianoBlackKeyProps) {
  const widthVal = typeof width === 'string' ? parseFloat(width) : width;

  return (
    <View
      style={[
        blackKeyStyle.key,
        {
          left: offset as DimensionValue,
          width: width as DimensionValue,
          marginLeft: (typeof width === 'string' ? `-${widthVal / 2}%` : -widthVal / 2) as DimensionValue,
        },
        isPressed && blackKeyStyle.keyPressed,
      ]}
      pointerEvents="none"
    >
      <View style={blackKeyStyle.topSurface}>
        <View style={blackKeyStyle.topHighlight} />
      </View>
      <View style={[blackKeyStyle.bottomLip, isPressed && blackKeyStyle.bottomLipPressed]} />
    </View>
  );
}


