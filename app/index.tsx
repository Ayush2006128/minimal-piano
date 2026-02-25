import PianoBlackKey from "@/components/PianoBlackKey";
import PianoWhiteKey from "@/components/PianoWhiteKey";
import { usePianoSound } from "@/hooks/usePianoSound";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import ZoomControls from "@/components/ui/ZoomControls";
import OctaveControls from "@/components/ui/OctaveControls";

const whiteNotes = ["C", "D", "E", "F", "G", "A", "B", "C"];

interface BlackKeyConfig {
  note: string;
  whiteKeyIndex: number;
  offset: string;
}

const blackKeysConfig: BlackKeyConfig[] = [
  { note: "C#", whiteKeyIndex: 0, offset: "12.5%" },
  { note: "D#", whiteKeyIndex: 1, offset: "25%" },
  { note: "F#", whiteKeyIndex: 3, offset: "50%" },
  { note: "G#", whiteKeyIndex: 4, offset: "62.5%" },
  { note: "A#", whiteKeyIndex: 5, offset: "75%" },
];

export default function Index() {
  const { playNote, stopNote } = usePianoSound();
  const [zoom, setZoom] = useState(1);
  const [currentOctave, setCurrentOctave] = useState(4);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <ZoomControls zoom={zoom} onZoomChange={setZoom} />
          ),
          headerRight: () => (
            <OctaveControls currentOctave={currentOctave} onOctaveChange={setCurrentOctave} />
          ),
        }}
      />
      <View style={styles.keyboard}>
        {/* White Keys */}
        {whiteNotes.map((note, index) => (
          <PianoWhiteKey
            key={`white-${index}`}
            note={note}
            onPressIn={() => playNote(note, index === 7)}
            onPressOut={() => stopNote(note)}
          />
        ))}

        {/* Black Keys */}
        {blackKeysConfig.map((blackKey) => (
          <PianoBlackKey
            key={`black-${blackKey.note}`}
            note={blackKey.note}
            offset={blackKey.offset}
            onPressIn={() => playNote(blackKey.note)}
            onPressOut={() => stopNote(blackKey.note)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboard: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    position: "relative",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
