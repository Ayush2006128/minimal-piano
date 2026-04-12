import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import OctaveControls from '@/components/ui/OctaveControls';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

describe('OctaveControls', () => {
  const mockOnOctaveChange = jest.fn();

  beforeEach(() => {
    mockOnOctaveChange.mockClear();
  });

  it('renders the current octave value', () => {
    render(<OctaveControls currentOctave={4} onOctaveChange={mockOnOctaveChange} />);
    expect(screen.getByText('4')).toBeTruthy();
    expect(screen.getByText('OCTAVE')).toBeTruthy();
  });

  it('calls onOctaveChange with decremented value when down is pressed', () => {
    render(<OctaveControls currentOctave={4} onOctaveChange={mockOnOctaveChange} />);
    const buttons = screen.getAllByRole('button');
    // First button is the decrement (chevron-back)
    fireEvent.press(buttons[0]);
    expect(mockOnOctaveChange).toHaveBeenCalledWith(3);
  });

  it('calls onOctaveChange with incremented value when up is pressed', () => {
    render(<OctaveControls currentOctave={4} onOctaveChange={mockOnOctaveChange} />);
    const buttons = screen.getAllByRole('button');
    // Last button is the increment (chevron-forward)
    fireEvent.press(buttons[buttons.length - 1]);
    expect(mockOnOctaveChange).toHaveBeenCalledWith(5);
  });

  it('does not go below minOctave', () => {
    render(
      <OctaveControls currentOctave={1} onOctaveChange={mockOnOctaveChange} minOctave={1} />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);
    // Should not call because button is disabled at min
    expect(mockOnOctaveChange).not.toHaveBeenCalled();
  });

  it('does not go above maxOctave', () => {
    render(
      <OctaveControls currentOctave={7} onOctaveChange={mockOnOctaveChange} maxOctave={7} />
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[buttons.length - 1]);
    // Should not call because button is disabled at max
    expect(mockOnOctaveChange).not.toHaveBeenCalled();
  });

  it('disables all buttons when disabled prop is true', () => {
    render(
      <OctaveControls currentOctave={4} onOctaveChange={mockOnOctaveChange} disabled={true} />
    );
    const buttons = screen.getAllByRole('button');
    for (const button of buttons) {
      fireEvent.press(button);
    }
    expect(mockOnOctaveChange).not.toHaveBeenCalled();
  });
});
