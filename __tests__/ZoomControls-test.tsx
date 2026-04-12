import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import ZoomControls from '@/components/ui/ZoomControls';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

describe('ZoomControls', () => {
  const mockOnZoomChange = jest.fn();

  beforeEach(() => {
    mockOnZoomChange.mockClear();
  });

  it('renders the current zoom value', () => {
    render(<ZoomControls zoom={2} onZoomChange={mockOnZoomChange} />);
    expect(screen.getByText('2')).toBeTruthy();
    expect(screen.getByText('ZOOM')).toBeTruthy();
  });

  it('calls onZoomChange with decremented value when minus is pressed', () => {
    render(<ZoomControls zoom={2} onZoomChange={mockOnZoomChange} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(mockOnZoomChange).toHaveBeenCalledWith(1);
  });

  it('calls onZoomChange with incremented value when plus is pressed', () => {
    render(<ZoomControls zoom={2} onZoomChange={mockOnZoomChange} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[buttons.length - 1]);
    expect(mockOnZoomChange).toHaveBeenCalledWith(3);
  });

  it('does not go below minZoom', () => {
    render(<ZoomControls zoom={1} onZoomChange={mockOnZoomChange} minZoom={1} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(mockOnZoomChange).not.toHaveBeenCalled();
  });

  it('does not go above maxZoom', () => {
    render(<ZoomControls zoom={4} onZoomChange={mockOnZoomChange} maxZoom={4} />);
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[buttons.length - 1]);
    expect(mockOnZoomChange).not.toHaveBeenCalled();
  });
});
