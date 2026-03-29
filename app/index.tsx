import OctaveControls from "@/components/ui/OctaveControls";
import RecordControls from "@/components/ui/RecordControls";
import ZoomControls from "@/components/ui/ZoomControls";
import { usePianoSound } from "@/hooks/usePianoSound";
import { useRecorder } from "@/hooks/useRecorder";
import { useWavExporter } from "@/hooks/useWavExporter";
import { Stack } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import Keyboard from "@/components/Keyboard";

export default function Index() {
  const { playNote, stopNote } = usePianoSound();
  const recorder = useRecorder(playNote, stopNote);
  const exporter = useWavExporter();
  const [zoom, setZoom] = useState(1);
  const [currentOctave, setCurrentOctave] = useState(4);

  const handleToggleRecord = () => {
    if (recorder.isRecording) {
      recorder.stopRecording();
    } else {
      recorder.startRecording();
    }
  };

  const handleExport = async () => {
    const filePath = await exporter.exportToWav(recorder.noteEvents);
    if (filePath) {
      Alert.alert("Export Complete", "Recording saved successfully!");
    } else if (exporter.exportError) {
      Alert.alert("Export Failed", exporter.exportError);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerLeft: () => <ZoomControls zoom={zoom} onZoomChange={setZoom} />,
          headerRight: () => (
            <View style={styles.headerRight}>
              <RecordControls
                isRecording={recorder.isRecording}
                isExporting={exporter.isExporting}
                hasRecording={recorder.hasRecording}
                onToggleRecord={handleToggleRecord}
                onExport={handleExport}
                onClear={recorder.clearRecording}
              />
              <OctaveControls
                currentOctave={currentOctave}
                onOctaveChange={setCurrentOctave}
                disabled={zoom > 1}
              />
            </View>
          ),
        }}
      />
      <Keyboard
        zoom={zoom}
        currentOctave={currentOctave}
        playNote={recorder.wrappedPlayNote}
        stopNote={recorder.wrappedStopNote}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
