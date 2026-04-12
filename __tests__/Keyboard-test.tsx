import React from 'react';
import { render } from '@testing-library/react-native';
import Keyboard from '@/components/Keyboard';

// Mock expo-haptics (used transitively)
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

describe('Keyboard', () => {
  const defaultProps = {
    zoom: 1,
    currentOctave: 4,
    playNote: jest.fn(),
    stopNote: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<Keyboard {...defaultProps} />);
  });

  it('renders with zoom 1 (8 white keys: C4-B4 + C5)', () => {
    const { toJSON } = render(<Keyboard {...defaultProps} zoom={1} currentOctave={4} />);
    // Smoke test - should not throw
    expect(toJSON()).toBeTruthy();
  });

  it('renders with zoom 2 (15 white keys)', () => {
    const { toJSON } = render(<Keyboard {...defaultProps} zoom={2} currentOctave={4} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with different octaves', () => {
    const { toJSON: json1 } = render(<Keyboard {...defaultProps} currentOctave={1} />);
    const { toJSON: json7 } = render(<Keyboard {...defaultProps} currentOctave={7} />);
    expect(json1()).toBeTruthy();
    expect(json7()).toBeTruthy();
  });

  it('renders with max zoom', () => {
    const { toJSON } = render(<Keyboard {...defaultProps} zoom={4} />);
    expect(toJSON()).toBeTruthy();
  });
});
