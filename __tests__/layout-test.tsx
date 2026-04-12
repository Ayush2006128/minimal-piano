import React from 'react';
import { render, screen } from '@testing-library/react-native';
import RootLayout from '@/app/_layout';

// Mock all native modules used in _layout
jest.mock('expo-splash-screen', () => ({
  setOptions: jest.fn(),
  hideAsync: jest.fn(),
  preventAutoHideAsync: jest.fn(),
}));

jest.mock('expo-screen-orientation', () => ({
  lockAsync: jest.fn().mockResolvedValue(undefined),
  OrientationLock: { LANDSCAPE: 'LANDSCAPE' },
}));

jest.mock('expo-navigation-bar', () => ({
  setVisibilityAsync: jest.fn().mockResolvedValue(undefined),
  setBehaviorAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@logrocket/react-native', () => ({
  init: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('react-native-toast-message', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => null,
  };
});

jest.mock('expo-router', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const Stack = ({ children }: { children: React.ReactNode }) => (
    <View testID="stack">{children}</View>
  );
  Stack.Screen = ({ name, options }: { name: string; options?: any }) => (
    <View testID={`screen-${name}`}>
      <Text>{options?.title ?? name}</Text>
    </View>
  );
  return { Stack };
});

describe('RootLayout', () => {
  it('renders without crashing', () => {
    render(<RootLayout />);
  });

  it('contains the Stack navigator', () => {
    render(<RootLayout />);
    expect(screen.getByTestId('stack')).toBeTruthy();
  });

  it('declares the index screen with title "Minimal Piano"', () => {
    render(<RootLayout />);
    expect(screen.getByTestId('screen-index')).toBeTruthy();
    expect(screen.getByText('Minimal Piano')).toBeTruthy();
  });

  it('locks orientation to landscape on mount', () => {
    const ScreenOrientation = require('expo-screen-orientation');
    render(<RootLayout />);
    expect(ScreenOrientation.lockAsync).toHaveBeenCalledWith('LANDSCAPE');
  });

  it('hides the navigation bar on mount', () => {
    const NavigationBar = require('expo-navigation-bar');
    render(<RootLayout />);
    expect(NavigationBar.setVisibilityAsync).toHaveBeenCalledWith('hidden');
    expect(NavigationBar.setBehaviorAsync).toHaveBeenCalledWith('overlay-swipe');
  });

  it('initializes LogRocket on mount', () => {
    const LogRocket = require('@logrocket/react-native');
    render(<RootLayout />);
    expect(LogRocket.init).toHaveBeenCalledWith('nmwfzu/minimal-piano');
  });
});
