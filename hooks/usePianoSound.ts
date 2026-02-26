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

  const playNote = (note: string, octave: number = 4) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;

    // Resume context if suspended (common in some environments)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Don't re-trigger if already playing
    const noteKey = `${note}${octave}`;
    if (activeNotes.current.has(noteKey)) return;

    let frequency = NOTE_FREQUENCIES[note] || 440;
    // Calculate frequency based on octave (NOTE_FREQUENCIES is for Octave 4)
    frequency *= Math.pow(2, octave - 4);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Piano-like sound: Triangle wave is softer than square/sawtooth
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Improved ADSR-like envelope (Attack and Decay)
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.01); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0); // Decay over 2 seconds to near-silence

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(now + 2.0); // Ensure the oscillator stops after decay
    activeNotes.current.set(noteKey, { osc, gain });

    // Automatically remove from active notes after decay to allow re-triggering
    // and cleanup resources if stopNote wasn't called (e.g. key held down)
    setTimeout(() => {
      if (activeNotes.current.get(noteKey)?.osc === osc) {
        activeNotes.current.delete(noteKey);
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (_) {
          // Ignore errors
        }
      }
    }, 2100);
  };

  const stopNote = (note: string, octave: number = 4) => {
    const noteKey = `${note}${octave}`;
    const active = activeNotes.current.get(noteKey);
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

      activeNotes.current.delete(noteKey);
    }
  };

  return { playNote, stopNote };
}
