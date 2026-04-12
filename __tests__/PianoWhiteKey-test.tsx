import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PianoWhiteKey from '@/components/PianoWhiteKey';

describe('PianoWhiteKey', () => {
  it('renders without crashing', () => {
    render(<PianoWhiteKey note="C" />);
  });

  it('displays the label when provided', () => {
    render(<PianoWhiteKey note="C" label="C4" />);
    expect(screen.getByText('C4')).toBeTruthy();
  });

  it('does not display a label when not provided', () => {
    render(<PianoWhiteKey note="D" />);
    expect(screen.queryByText('D')).toBeNull();
  });

  it('renders correctly when pressed', () => {
    render(<PianoWhiteKey note="C" isPressed={true} label="C4" />);
    expect(screen.getByText('C4')).toBeTruthy();
  });

  it('renders correctly when not pressed', () => {
    render(<PianoWhiteKey note="C" isPressed={false} label="C4" />);
    expect(screen.getByText('C4')).toBeTruthy();
  });
});
