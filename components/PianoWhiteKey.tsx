import whiteKeyStyle from '@/styles/whiteKeyStyle';
import React from 'react';
import { Text, View } from 'react-native';

interface PianoWhiteKeyProps {
  note: string;
  isPressed?: boolean;
  label?: string;
}

export default function PianoWhiteKey({ note, isPressed = false, label }: PianoWhiteKeyProps) {
  return (
    <View style={[whiteKeyStyle.key, isPressed && whiteKeyStyle.keyPressed]}>
      <View style={whiteKeyStyle.topHighlight} />
      <View style={whiteKeyStyle.inner}>
        {label && <Text style={whiteKeyStyle.label}>{label}</Text>}
      </View>
      <View style={[whiteKeyStyle.bottomLip, isPressed && whiteKeyStyle.bottomLipPressed]} />
    </View>
  );
}


