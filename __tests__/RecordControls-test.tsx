import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RecordControls from '@/components/ui/RecordControls';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

describe('RecordControls', () => {
  const defaultProps = {
    isRecording: false,
    isExporting: false,
    hasRecording: false,
    onToggleRecord: jest.fn(),
    onExport: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows IDLE status when not recording and no recording exists', () => {
    render(<RecordControls {...defaultProps} />);
    expect(screen.getByText('IDLE')).toBeTruthy();
    expect(screen.getByText('RECORD')).toBeTruthy();
  });

  it('shows REC status when recording', () => {
    render(<RecordControls {...defaultProps} isRecording={true} />);
    expect(screen.getByText('REC')).toBeTruthy();
  });

  it('shows SAVING status when exporting', () => {
    render(<RecordControls {...defaultProps} isExporting={true} />);
    expect(screen.getByText('SAVING')).toBeTruthy();
  });

  it('shows READY status when has recording and not recording', () => {
    render(<RecordControls {...defaultProps} hasRecording={true} />);
    expect(screen.getByText('READY')).toBeTruthy();
  });

  it('calls onToggleRecord when record button is pressed', () => {
    const onToggleRecord = jest.fn();
    render(<RecordControls {...defaultProps} onToggleRecord={onToggleRecord} />);
    fireEvent.press(screen.getByTestId('record-button'));
    expect(onToggleRecord).toHaveBeenCalledTimes(1);
  });

  it('disables export and clear buttons when no recording', () => {
    const onExport = jest.fn();
    const onClear = jest.fn();
    render(
      <RecordControls {...defaultProps} onExport={onExport} onClear={onClear} hasRecording={false} />
    );
    fireEvent.press(screen.getByTestId('export-button'));
    fireEvent.press(screen.getByTestId('clear-button'));
    expect(onExport).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it('enables export and clear buttons when has recording', () => {
    const onExport = jest.fn();
    const onClear = jest.fn();
    render(
      <RecordControls
        {...defaultProps}
        onExport={onExport}
        onClear={onClear}
        hasRecording={true}
      />
    );
    fireEvent.press(screen.getByTestId('export-button'));
    fireEvent.press(screen.getByTestId('clear-button'));
    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
