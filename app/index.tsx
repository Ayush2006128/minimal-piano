import PianoBlackKey from "@/components/PianoBlackKey";
import PianoWhiteKey from "@/components/PianoWhiteKey";
import { usePianoSound } from "@/hooks/usePianoSound";
import { StyleSheet, View } from "react-native";
import { Stack } from "expo-router";
import { useState } from "react";
import ZoomControls from "@/components/ui/ZoomControls";
import OctaveControls from "@/components/ui/OctaveControls";

const OCTAVE_WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS_DATA = [
  { note: "C#", afterIndex: 0 },
  { note: "D#", afterIndex: 1 },
  { note: "F#", afterIndex: 3 },
  { note: "G#", afterIndex: 4 },
  { note: "A#", afterIndex: 5 },
];

export default function Index() {
  const { playNote, stopNote } = usePianoSound();
  const [zoom, setZoom] = useState(1);
  const [currentOctave, setCurrentOctave] = useState(4);

  const totalWhiteKeysCount = zoom * 7 + 1;
  const whiteKeyWidthPercent = 100 / totalWhiteKeysCount;

  const renderKeyboard = () => {
    const whiteKeys = [];
    const blackKeys = [];

    for (let o = 0; o < zoom; o++) {
      const octave = currentOctave + o;
      const octaveStartIdx = o * 7;

      // Add white keys for this octave
      OCTAVE_WHITE_NOTES.forEach((note, index) => {
        whiteKeys.push(
          <PianoWhiteKey
            key={`white-${octave}-${note}`}
            note={note}
            label={note === "C" ? `${note}${octave}` : undefined}
            onPressIn={() => playNote(note, octave)}
            onPressOut={() => stopNote(note, octave)}
          />
        );
      });

      // Add black keys for this octave
      BLACK_KEYS_DATA.forEach((data) => {
        const globalIdx = octaveStartIdx + data.afterIndex;
        const offset = `${(globalIdx + 1) * whiteKeyWidthPercent}%`;
        blackKeys.push(
          <PianoBlackKey
            key={`black-${octave}-${data.note}`}
            note={data.note}
            offset={offset}
            width={`${whiteKeyWidthPercent * 0.7}%`}
            onPressIn={() => playNote(data.note, octave)}
            onPressOut={() => stopNote(data.note, octave)}
          />
        );
      });
    }

    // Add the final trailing 'C' key
    const finalOctave = currentOctave + zoom;
    whiteKeys.push(
      <PianoWhiteKey
        key={`white-${finalOctave}-C`}
        note="C"
        label={`C${finalOctave}`}
        onPressIn={() => playNote("C", finalOctave)}
        onPressOut={() => stopNote("C", finalOctave)}
      />
    );

    return (
      <View style={styles.keyboard}>
        {whiteKeys}
        {blackKeys}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <ZoomControls zoom={zoom} onZoomChange={setZoom} />
          ),
          headerRight: () => (
            <OctaveControls
              currentOctave={currentOctave}
              onOctaveChange={setCurrentOctave}
              disabled={zoom > 1}
            />
          ),
        }}
      />
      {renderKeyboard()}
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
