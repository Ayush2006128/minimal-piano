import { getNoteFrequency, getOscillatorType, getTargetGain, NOTE_FREQUENCIES } from '@/hooks/pianoSynthesis';

describe('pianoSynthesis', () => {
  describe('getNoteFrequency', () => {
    it('returns the base frequency for A4 (440 Hz)', () => {
      expect(getNoteFrequency('A', 4)).toBeCloseTo(440, 1);
    });

    it('returns the base frequency for C4 (middle C)', () => {
      expect(getNoteFrequency('C', 4)).toBeCloseTo(261.63, 1);
    });

    it('doubles the frequency when going up one octave', () => {
      const freqOctave4 = getNoteFrequency('A', 4);
      const freqOctave5 = getNoteFrequency('A', 5);
      expect(freqOctave5).toBeCloseTo(freqOctave4 * 2, 1);
    });

    it('halves the frequency when going down one octave', () => {
      const freqOctave4 = getNoteFrequency('A', 4);
      const freqOctave3 = getNoteFrequency('A', 3);
      expect(freqOctave3).toBeCloseTo(freqOctave4 / 2, 1);
    });

    it('returns 440-based frequency for unknown notes', () => {
      // Unknown note falls back to 440
      const freq = getNoteFrequency('X', 4);
      expect(freq).toBeCloseTo(440, 1);
    });

    it('handles sharp notes (C#, F#, etc.)', () => {
      expect(getNoteFrequency('C#', 4)).toBeCloseTo(277.18, 1);
      expect(getNoteFrequency('F#', 4)).toBeCloseTo(369.99, 1);
    });

    it('handles extreme octaves', () => {
      const freq1 = getNoteFrequency('C', 1);
      const freq8 = getNoteFrequency('C', 8);
      // C1 should be much lower than C8
      expect(freq8).toBeGreaterThan(freq1);
      // C8 = C4 * 2^4 = 261.63 * 16
      expect(freq8).toBeCloseTo(261.63 * 16, 0);
    });
  });

  describe('getOscillatorType', () => {
    it('returns "sawtooth" for octave 1', () => {
      expect(getOscillatorType(1)).toBe('sawtooth');
    });

    it('returns "sawtooth" for octave 2', () => {
      expect(getOscillatorType(2)).toBe('sawtooth');
    });

    it('returns "square" for octave 3', () => {
      expect(getOscillatorType(3)).toBe('square');
    });

    it('returns "triangle" for octave 4 and above', () => {
      expect(getOscillatorType(4)).toBe('triangle');
      expect(getOscillatorType(5)).toBe('triangle');
      expect(getOscillatorType(7)).toBe('triangle');
    });
  });

  describe('getTargetGain', () => {
    it('returns 0.8 for low octaves (≤2)', () => {
      expect(getTargetGain(1)).toBe(0.8);
      expect(getTargetGain(2)).toBe(0.8);
    });

    it('returns 0.6 for octave 3', () => {
      expect(getTargetGain(3)).toBe(0.6);
    });

    it('returns 0.4 for mid octaves (4-5)', () => {
      expect(getTargetGain(4)).toBe(0.4);
      expect(getTargetGain(5)).toBe(0.4);
    });

    it('returns 0.2 for high octaves (≥6)', () => {
      expect(getTargetGain(6)).toBe(0.2);
      expect(getTargetGain(7)).toBe(0.2);
    });
  });

  describe('NOTE_FREQUENCIES', () => {
    it('contains all 12 chromatic notes', () => {
      const expectedNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      for (const note of expectedNotes) {
        expect(NOTE_FREQUENCIES).toHaveProperty(note);
        expect(typeof NOTE_FREQUENCIES[note]).toBe('number');
      }
    });

    it('has frequencies in ascending order', () => {
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      for (let i = 1; i < notes.length; i++) {
        expect(NOTE_FREQUENCIES[notes[i]]).toBeGreaterThan(NOTE_FREQUENCIES[notes[i - 1]]);
      }
    });
  });
});
