import PianoBlackKey from "@/components/PianoBlackKey";
import PianoWhiteKey from "@/components/PianoWhiteKey";
import { JSX } from "react";
import { StyleSheet, View } from "react-native";

const OCTAVE_WHITE_NOTES = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS_DATA = [
  { note: "C#", afterIndex: 0 },
  { note: "D#", afterIndex: 1 },
  { note: "F#", afterIndex: 3 },
  { note: "G#", afterIndex: 4 },
  { note: "A#", afterIndex: 5 },
];

interface KeyboardProps {
  zoom: number;
  currentOctave: number;
  playNote: (note: string, octave: number) => void;
  stopNote: (note: string, octave: number) => void;
}

export default function Keyboard({
  zoom,
  currentOctave,
  playNote,
  stopNote,
}: KeyboardProps) {
  const totalWhiteKeysCount = zoom * 7 + 1;
  const whiteKeyWidthPercent = 100 / totalWhiteKeysCount;

  const whiteKeys: JSX.Element[] = [];
  const blackKeys: JSX.Element[] = [];

  for (let o = 0; o < zoom; o++) {
    const octave = currentOctave + o;
    const octaveStartIdx = o * 7;

    // Add white keys for this octave
    OCTAVE_WHITE_NOTES.forEach((note) => {
      whiteKeys.push(
        <PianoWhiteKey
          key={`white-${octave}-${note}`}
          note={note}
          label={note === "C" ? `${note}${octave}` : undefined}
          onPressIn={() => playNote(note, octave)}
          onPressOut={() => stopNote(note, octave)}
        />,
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
        />,
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
    />,
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.topBarHighlight} />
      </View>
      <View style={styles.keyboard}>
        <View style={styles.feltStrip} />
        {whiteKeys}
        {blackKeys}
        <View style={styles.lidShadow} pointerEvents="none" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  topBar: {
    height: 12,
    backgroundColor: "#222",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  topBarHighlight: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: "100%",
  },
  feltStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "#b22222", // Firebrick red felt
    zIndex: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.2)",
  },
  keyboard: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    position: "relative",
    backgroundColor: "#fff",
  },
  lidShadow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 15,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    zIndex: 10,
  },
});
