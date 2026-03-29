import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';
import {
  EncodingType,
  StorageAccessFramework,
  writeAsStringAsync,
} from 'expo-file-system/legacy';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { OfflineAudioContext } from 'react-native-audio-api';
import { scheduleFullNote } from './pianoSynthesis';
import type { NoteEvent } from './useRecorder';

const SAMPLE_RATE = 44100;
const TAIL_SECONDS = 0.5; // extra time after last event for decay
const STORAGE_KEY = 'minimal_piano_save_directory_uri';
const WAV_MIME_TYPE = 'audio/wav';

/**
 * Request access to a directory via SAF and persist the URI.
 * Returns the directory URI or null if the user cancelled.
 */
async function requestAndPersistDirectory(): Promise<string | null> {
  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync();

  if (!permissions.granted) {
    return null;
  }

  await AsyncStorage.setItem(STORAGE_KEY, permissions.directoryUri);
  return permissions.directoryUri;
}

/**
 * Get a valid save directory URI — either from persisted storage or by
 * prompting the user via SAF. If the persisted URI is no longer valid,
 * the user will be re-prompted.
 */
async function getSaveDirectoryUri(): Promise<string | null> {
  const persisted = await AsyncStorage.getItem(STORAGE_KEY);

  if (persisted) {
    try {
      // Validate the URI is still accessible by listing its contents
      await StorageAccessFramework.readDirectoryAsync(persisted);
      return persisted;
    } catch {
      // Permission was revoked or directory no longer exists — re-prompt
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }

  return requestAndPersistDirectory();
}

/**
 * Write a base64-encoded WAV to the given SAF directory.
 * Returns the content:// URI of the created file.
 */
async function writeWavToSAF(
  directoryUri: string,
  fileName: string,
  wavBase64: string,
): Promise<string> {
  const fileUri = await StorageAccessFramework.createFileAsync(
    directoryUri,
    fileName,
    WAV_MIME_TYPE,
  );

  await writeAsStringAsync(fileUri, wavBase64, {
    encoding: EncodingType.Base64,
  });

  return fileUri;
}

export function useWavExporter() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [savedDirectoryUri, setSavedDirectoryUri] = useState<string | null>(
    null,
  );

  // Load persisted directory URI on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((uri) => {
      if (uri) setSavedDirectoryUri(uri);
    });
  }, []);

  /**
   * Allow the user to explicitly change their save directory.
   */
  const changeSaveDirectory = useCallback(async () => {
    const newUri = await requestAndPersistDirectory();
    if (newUri) {
      setSavedDirectoryUri(newUri);
    }
    return newUri;
  }, []);

  const exportToWav = useCallback(
    async (noteEvents: NoteEvent[]): Promise<string | null> => {
      if (noteEvents.length === 0) {
        setExportError('No note events to export');
        return null;
      }

      setIsExporting(true);
      setExportError(null);

      try {
        // 1. Pair noteOn/noteOff events
        const notes = pairNoteEvents(noteEvents);

        if (notes.length === 0) {
          throw new Error('No complete note pairs found');
        }

        // 2. Compute total duration
        const lastEnd = Math.max(
          ...notes.map((n) => n.startTime + n.duration),
        );
        const totalDuration = lastEnd + TAIL_SECONDS;
        const totalSamples = Math.ceil(totalDuration * SAMPLE_RATE);

        // 3. Create OfflineAudioContext
        const offlineCtx = new OfflineAudioContext(
          1,
          totalSamples,
          SAMPLE_RATE,
        );

        // 4. Schedule all notes
        for (const n of notes) {
          scheduleFullNote(
            offlineCtx,
            n.note,
            n.octave,
            n.startTime,
            n.duration,
          );
        }

        // 5. Render
        const audioBuffer = await offlineCtx.startRendering();

        // 6. Extract PCM data
        const channelData = audioBuffer.getChannelData(0);

        // 7. Encode as WAV
        const wavBase64 = encodeWavBase64(channelData, SAMPLE_RATE);

        // 8. Save via SAF (Android) or fallback (other platforms)
        const timestamp = Date.now();
        const fileName = `piano_recording_${timestamp}`;
        let savedUri: string;

        if (Platform.OS === 'android') {
          // Get or request a save directory via SAF
          const directoryUri = await getSaveDirectoryUri();

          if (!directoryUri) {
            throw new Error('No save directory selected');
          }

          // Update persisted state
          setSavedDirectoryUri(directoryUri);

          savedUri = await writeWavToSAF(directoryUri, fileName, wavBase64);
        } else {
          // Fallback for non-Android platforms: use app document directory
          const pianoDir = Paths.document.uri + '/minimal-piano';
          const file = new File(pianoDir, `${fileName}.wav`);
          file.create();
          file.write(wavBase64, { encoding: 'base64' });
          savedUri = file.uri;
        }

        setIsExporting(false);
        return savedUri;
      } catch (error: any) {
        const message = error?.message || 'Unknown export error';
        setExportError(message);
        setIsExporting(false);
        return null;
      }
    },
    [],
  );

  return {
    exportToWav,
    isExporting,
    exportError,
    changeSaveDirectory,
    savedDirectoryUri,
  };
}

// --- Helpers ---

interface PairedNote {
  note: string;
  octave: number;
  startTime: number;
  duration: number;
}

/**
 * Pair noteOn events with their corresponding noteOff events.
 */
function pairNoteEvents(events: NoteEvent[]): PairedNote[] {
  const paired: PairedNote[] = [];
  // Map of "note+octave" → array of pending noteOn times (FIFO)
  const pending = new Map<string, number[]>();

  for (const event of events) {
    const key = `${event.note}${event.octave}`;

    if (event.type === 'noteOn') {
      if (!pending.has(key)) pending.set(key, []);
      pending.get(key)!.push(event.time);
    } else {
      // noteOff
      const starts = pending.get(key);
      if (starts && starts.length > 0) {
        const startTime = starts.shift()!;
        const duration = Math.max(event.time - startTime, 0.05); // min 50ms
        paired.push({
          note: event.note,
          octave: event.octave,
          startTime,
          duration,
        });
        if (starts.length === 0) pending.delete(key);
      }
    }
  }

  // Handle any unpaired noteOn events (give them a default 1s duration)
  for (const [key, starts] of pending) {
    const match = key.match(/^([A-G]#?)(\d+)$/);
    if (match) {
      for (const startTime of starts) {
        paired.push({
          note: match[1],
          octave: parseInt(match[2], 10),
          startTime,
          duration: 1.0,
        });
      }
    }
  }

  return paired;
}

/**
 * Encode Float32Array PCM data as a WAV file and return base64 string.
 */
function encodeWavBase64(samples: Float32Array, sampleRate: number): string {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const dataLength = samples.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const buffer = new ArrayBuffer(totalLength);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true); // byte rate
  view.setUint16(32, numChannels * bytesPerSample, true); // block align
  view.setUint16(34, bitsPerSample, true);

  // data chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // PCM samples — convert float32 [-1, 1] to int16
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  // Convert to base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
