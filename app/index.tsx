import PianoBlackKey from "@/components/PianoBlackKey";
import PianoWhiteKey from "@/components/PianoWhiteKey";
import { usePianoSound } from "@/hooks/usePianoSound";
import { StyleSheet, View } from "react-native";

const whiteNotes = ["C", "D", "E", "F", "G", "A", "B", "C"];

interface BlackKeyConfig {
  note: string;
  whiteKeyIndex: number;
  offset: number;
}

const blackKeysConfig: BlackKeyConfig[] = [
  { note: "C#", whiteKeyIndex: 0, offset: 40 },
  { note: "D#", whiteKeyIndex: 1, offset: 100 },
  { note: "F#", whiteKeyIndex: 3, offset: 220 },
  { note: "G#", whiteKeyIndex: 4, offset: 280 },
  { note: "A#", whiteKeyIndex: 5, offset: 340 },
];

export default function Index() {
  const { playNote, stopNote } = usePianoSound();

  return (
    <View style={styles.container}>
      <View style={styles.keyboardContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  keyboard: {
    flexDirection: "row",
    height: 250,
    position: "relative",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});
