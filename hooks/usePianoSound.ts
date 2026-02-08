import { useEffect, useRef } from 'react';
import { AudioContext, OscillatorNode, GainNode } from 'react-native-audio-api';

const NOTE_FREQUENCIES: Record<string, number> = {
  'C': 261.63,
  'C#': 277.18,
  'D': 293.66,
  'D#': 311.13,
  'E': 329.63,
  'F': 349.23,
  'F#': 369.99,
  'G': 392.00,
  'G#': 415.30,
  'A': 440.00,
  'A#': 466.16,
  'B': 493.88,
};

export function usePianoSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNotes = useRef<Map<string, { osc: OscillatorNode; gain: GainNode }>>(new Map());

  useEffect(() => {
    // Create audio context on mount
    audioContextRef.current = new AudioContext();

    return () => {
      // Close context on unmount
      audioContextRef.current?.close();
    };
  }, []);

  const playNote = (note: string, isOctave: boolean = false) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;

    // Resume context if suspended (common in some environments)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop if already playing the same note to avoid stacking
    stopNote(note);

    let frequency = NOTE_FREQUENCIES[note] || 440;
    if (isOctave) {
      frequency *= 2;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Piano-like sound: Triangle wave is softer than square/sawtooth
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Simple ADSR-like envelope (Attack and Sustain)
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02); // Quick attack

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    activeNotes.current.set(note, { osc, gain });
  };

  const stopNote = (note: string) => {
    const active = activeNotes.current.get(note);
    if (active && audioContextRef.current) {
      const { osc, gain } = active;
      const ctx = audioContextRef.current;

      // Release envelope
      try {
        gain.gain.cancelScheduledValues(ctx.currentTime);
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1); // Quick release

        // Stop oscillator after release
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
            gain.disconnect();
          } catch (_) {
            // Ignore errors if already stopped/disconnected
          }
        }, 120);
      } catch (_) {
        // Fallback for any timing issues
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      }

      activeNotes.current.delete(note);
    }
  };

  return { playNote, stopNote };
}
