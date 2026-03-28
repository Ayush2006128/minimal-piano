import { useEffect, useRef } from 'react';
import { AudioContext, GainNode, OscillatorNode } from 'react-native-audio-api';
import { scheduleNoteAttack } from './pianoSynthesis';

export function usePianoSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNotes = useRef<Map<string, { osc: OscillatorNode; gain: GainNode; filter: any }>>(new Map());

  useEffect(() => {
    audioContextRef.current = new AudioContext();

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playNote = (note: string, octave: number = 4) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const noteKey = `${note}${octave}`;
    if (activeNotes.current.has(noteKey)) return;

    const { osc, gain, filter } = scheduleNoteAttack(ctx, note, octave, ctx.currentTime);

    activeNotes.current.set(noteKey, { osc, gain, filter });

    setTimeout(() => {
      if (activeNotes.current.get(noteKey)?.osc === osc) {
        activeNotes.current.delete(noteKey);
        try {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch (_) {}
      }
    }, 2100);
  };

  const stopNote = (note: string, octave: number = 4) => {
    const noteKey = `${note}${octave}`;
    const active = activeNotes.current.get(noteKey);
    
    if (active && audioContextRef.current) {
      const { osc, gain, filter } = active;
      const ctx = audioContextRef.current;
      const now = ctx.currentTime;

      try {
        // Cancel the playing envelope
        gain.gain.cancelScheduledValues(now);
        filter.frequency.cancelScheduledValues(now);

        // Lock current values
        gain.gain.setValueAtTime(gain.gain.value, now);
        filter.frequency.setValueAtTime(filter.frequency.value, now);

        // Release envelope — 120ms fade
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.12);

        // Disconnect after fade
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
            filter.disconnect();
            gain.disconnect();
          } catch (_) {}
        }, 150);
      } catch (_) {
        osc.stop();
        osc.disconnect();
        filter?.disconnect();
        gain.disconnect();
      }

      activeNotes.current.delete(noteKey);
    }
  };

  return { playNote, stopNote };
}
