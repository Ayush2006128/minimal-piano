import { useCallback, useRef, useState } from 'react';

export interface NoteEvent {
  note: string;
  octave: number;
  type: 'noteOn' | 'noteOff';
  time: number; // relative time in seconds from recording start
}

export function useRecorder(
  playNote: (note: string, octave: number) => void,
  stopNote: (note: string, octave: number) => void,
) {
  const [isRecording, setIsRecording] = useState(false);
  const [noteEvents, setNoteEvents] = useState<NoteEvent[]>([]);

  const isRecordingRef = useRef(false);
  const noteEventsRef = useRef<NoteEvent[]>([]);
  const startTimeRef = useRef(0);
  // Track which notes are currently held down during recording
  const heldNotesRef = useRef<Set<string>>(new Set());

  const startRecording = useCallback(() => {
    noteEventsRef.current = [];
    heldNotesRef.current = new Set();
    startTimeRef.current = performance.now();
    isRecordingRef.current = true;
    setNoteEvents([]);
    setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return;

    const now = (performance.now() - startTimeRef.current) / 1000;

    // Inject noteOff for any still-held notes
    for (const key of heldNotesRef.current) {
      const [note, octaveStr] = parseNoteKey(key);
      noteEventsRef.current.push({
        note,
        octave: parseInt(octaveStr, 10),
        type: 'noteOff',
        time: now,
      });
    }
    heldNotesRef.current.clear();

    isRecordingRef.current = false;
    setNoteEvents([...noteEventsRef.current]);
    setIsRecording(false);
  }, []);

  const clearRecording = useCallback(() => {
    noteEventsRef.current = [];
    heldNotesRef.current.clear();
    setNoteEvents([]);
  }, []);

  const wrappedPlayNote = useCallback(
    (note: string, octave: number) => {
      // Always play the sound
      playNote(note, octave);

      // Record if active
      if (isRecordingRef.current) {
        const time = (performance.now() - startTimeRef.current) / 1000;
        const noteKey = `${note}${octave}`;
        heldNotesRef.current.add(noteKey);
        noteEventsRef.current.push({ note, octave, type: 'noteOn', time });
      }
    },
    [playNote],
  );

  const wrappedStopNote = useCallback(
    (note: string, octave: number) => {
      // Always stop the sound
      stopNote(note, octave);

      // Record if active
      if (isRecordingRef.current) {
        const time = (performance.now() - startTimeRef.current) / 1000;
        const noteKey = `${note}${octave}`;
        heldNotesRef.current.delete(noteKey);
        noteEventsRef.current.push({ note, octave, type: 'noteOff', time });
      }
    },
    [stopNote],
  );

  const hasRecording = noteEvents.length > 0;

  return {
    isRecording,
    noteEvents,
    startRecording,
    stopRecording,
    clearRecording,
    wrappedPlayNote,
    wrappedStopNote,
    hasRecording,
  };
}

/**
 * Parse a noteKey like "C#4" into ["C#", "4"]
 */
function parseNoteKey(key: string): [string, string] {
  // Note name can be 1-2 characters (e.g. "C" or "C#"), octave is the rest
  const match = key.match(/^([A-G]#?)(\d+)$/);
  if (match) {
    return [match[1], match[2]];
  }
  return [key, '4'];
}
