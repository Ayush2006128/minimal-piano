import OctaveControls from "@/components/ui/OctaveControls";
import ZoomControls from "@/components/ui/ZoomControls";
import { usePianoSound } from "@/hooks/usePianoSound";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Keyboard from "@/components/Keyboard";

export default function Index() {
  const { playNote, stopNote } = usePianoSound();
  const [zoom, setZoom] = useState(1);
  const [currentOctave, setCurrentOctave] = useState(4);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => <ZoomControls zoom={zoom} onZoomChange={setZoom} />,
          headerRight: () => (
            <OctaveControls
              currentOctave={currentOctave}
              onOctaveChange={setCurrentOctave}
              disabled={zoom > 1}
            />
          ),
        }}
      />
      <Keyboard
        zoom={zoom}
        currentOctave={currentOctave}
        playNote={playNote}
        stopNote={stopNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
