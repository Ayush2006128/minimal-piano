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

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const noteKey = `${note}${octave}`;
    if (activeNotes.current.has(noteKey)) return;

    let frequency = NOTE_FREQUENCIES[note] || 440;
    frequency *= Math.pow(2, octave - 4);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    // 1. Create the Filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';

    if (octave <= 2) {
      osc.type = 'sawtooth';
    } else if (octave === 3) {
      osc.type = 'square';
    } else {
      osc.type = 'triangle';
    }
      
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    let targetGain = 0.4;
    if (octave <= 2) targetGain = 0.8;
    else if (octave === 3) targetGain = 0.6;
    else if (octave >= 6) targetGain = 0.2;

    const now = ctx.currentTime;

    // 2. The Filter Envelope (Dynamic Tone)
    // A real piano string starts bright when the hammer hits, then loses high frequencies over time.
    // We set the cutoff frequency to 4x the fundamental note (bright attack), 
    // then decay it down to 1.5x the fundamental note (warm sustain).
    filter.frequency.setValueAtTime(frequency * 4, now); 
    filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, now + 1.5);

    // Volume Envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(targetGain, now + 0.01); 
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0); 

    // 3. The New Audio Chain Connections
    osc.connect(filter);       // Osc goes into Filter
    filter.connect(gain);      // Filter goes into Volume Control
    gain.connect(ctx.destination); // Volume goes to Speakers

    osc.start();
    osc.stop(now + 2.0); 
    
    // Store the filter as well so we can clean it up later
    activeNotes.current.set(noteKey, { osc, gain, filter } as any);

    setTimeout(() => {
      if (activeNotes.current.get(noteKey)?.osc === osc) {
        activeNotes.current.delete(noteKey);
        try {
          osc.disconnect();
          filter.disconnect(); // Cleanup filter
          gain.disconnect();
        } catch (_) {}
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
