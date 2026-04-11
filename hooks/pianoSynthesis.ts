import type { AudioContext as RNAudioContext, OfflineAudioContext as RNOfflineAudioContext } from 'react-native-audio-api';

// Base frequencies at octave 4
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

export { NOTE_FREQUENCIES };

type AnyAudioContext = RNAudioContext | RNOfflineAudioContext;

/**
 * Get the frequency for a given note and octave.
 */
export function getNoteFrequency(note: string, octave: number): number {
  let frequency = NOTE_FREQUENCIES[note] || 440;
  frequency *= Math.pow(2, octave - 4);
  return frequency;
}

/**
 * Get the oscillator waveform type based on octave.
 */
export function getOscillatorType(octave: number): OscillatorType {
  if (octave <= 2) return 'sawtooth';
  if (octave === 3) return 'square';
  return 'triangle';
}

/**
 * Get the target gain based on octave.
 */
export function getTargetGain(octave: number): number {
  if (octave <= 2) return 0.8;
  if (octave === 3) return 0.6;
  if (octave >= 6) return 0.2;
  return 0.4;
}

/**
 * Schedule a piano note attack (note-on) on the given audio context.
 * Returns the created nodes for later cleanup / release.
 */
export function scheduleNoteAttack(
  ctx: AnyAudioContext,
  note: string,
  octave: number,
  startTime: number,
) {
  const frequency = getNoteFrequency(note, octave);
  const oscType = getOscillatorType(octave);
  const targetGain = getTargetGain(octave);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  osc.type = oscType;
  osc.frequency.setValueAtTime(frequency, startTime);

  // Filter envelope: bright attack → warm sustain
  filter.frequency.setValueAtTime(frequency * 4, startTime);
  filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, startTime + 1.5);

  // Volume envelope: quick attack, long decay
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(targetGain, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.0);

  // Audio chain: osc → filter → gain → destination
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 2.0);

  return { osc, gain, filter };
}

/**
 * Schedule a piano note release (note-off) on existing nodes.
 * Used for real-time playback when user releases a key.
 */
export function scheduleNoteRelease(
  ctx: AnyAudioContext,
  osc: any,
  gain: any,
  filter: any,
  releaseTime: number,
) {
  try {
    gain.gain.cancelScheduledValues(releaseTime);
    filter.frequency.cancelScheduledValues(releaseTime);

    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.002), releaseTime);
    filter.frequency.setValueAtTime(Math.max(filter.frequency.value, 100), releaseTime);

    // Release envelope — 120ms fade out
    gain.gain.exponentialRampToValueAtTime(0.001, releaseTime + 0.12);
    filter.frequency.exponentialRampToValueAtTime(100, releaseTime + 0.12);
  } catch (_) {
    // Fallback: micro-fade to avoid click
    try {
      gain.gain.setValueAtTime(0.002, releaseTime);
      gain.gain.linearRampToValueAtTime(0, releaseTime + 0.02);
    } catch (__) {}
  }
}

/**
 * Schedule a full note (attack + timed release) for offline rendering.
 * Duration is the time between noteOn and noteOff.
 */
export function scheduleFullNote(
  ctx: AnyAudioContext,
  note: string,
  octave: number,
  startTime: number,
  duration: number,
) {
  const frequency = getNoteFrequency(note, octave);
  const oscType = getOscillatorType(octave);
  const targetGain = getTargetGain(octave);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  osc.type = oscType;
  osc.frequency.setValueAtTime(frequency, startTime);

  // Filter envelope
  filter.frequency.setValueAtTime(frequency * 4, startTime);
  filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, startTime + 1.5);

  // Volume envelope — attack
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(targetGain, startTime + 0.01);

  const releaseTime = startTime + duration;

  // If the note is short, we fade it out at releaseTime.
  // If the note is longer than the natural decay (2s), we let it decay naturally.
  const naturalDecay = 2.0;
  if (duration < naturalDecay) {
    // Sustain until release, then release envelope
    gain.gain.setValueAtTime(targetGain, startTime + 0.01);
    // Smooth exponential sustain to release time
    const sustainGain = targetGain * Math.exp(-duration / 1.0); // gentle decay during sustain
    if (sustainGain > 0.001) {
      gain.gain.exponentialRampToValueAtTime(Math.max(sustainGain, 0.01), releaseTime);
    }
    // Release fade 
    gain.gain.exponentialRampToValueAtTime(0.001, releaseTime + 0.12);
    filter.frequency.exponentialRampToValueAtTime(100, releaseTime + 0.12);
  } else {
    // Let natural decay happen
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + naturalDecay);
  }

  // Audio chain
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  const totalDuration = Math.min(duration + 0.15, naturalDecay);
  osc.start(startTime);
  osc.stop(startTime + totalDuration);
}
