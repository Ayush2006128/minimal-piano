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
    fireEvent.press(screen.getByTestId('zoom-down'));
    expect(mockOnZoomChange).toHaveBeenCalledWith(1);
  });

  it('calls onZoomChange with incremented value when plus is pressed', () => {
    render(<ZoomControls zoom={2} onZoomChange={mockOnZoomChange} />);
    fireEvent.press(screen.getByTestId('zoom-up'));
    expect(mockOnZoomChange).toHaveBeenCalledWith(3);
  });

  it('does not go below minZoom', () => {
    render(<ZoomControls zoom={1} onZoomChange={mockOnZoomChange} minZoom={1} />);
    fireEvent.press(screen.getByTestId('zoom-down'));
    expect(mockOnZoomChange).not.toHaveBeenCalled();
  });

  it('does not go above maxZoom', () => {
    render(<ZoomControls zoom={4} onZoomChange={mockOnZoomChange} maxZoom={4} />);
    fireEvent.press(screen.getByTestId('zoom-up'));
    expect(mockOnZoomChange).not.toHaveBeenCalled();
  });
});
