import Index from "@/app/index";
import { render, screen } from "@testing-library/react-native";
import React from "react";

// Mock all native dependencies
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium" },
}));

jest.mock("react-native-audio-api", () => ({
  AudioContext: jest.fn().mockImplementation(() => ({
    currentTime: 0,
    state: "running",
    resume: jest.fn(),
    close: jest.fn(),
    destination: {},
    createOscillator: jest.fn().mockReturnValue({
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      disconnect: jest.fn(),
      frequency: { setValueAtTime: jest.fn() },
      type: "triangle",
    }),
    createGain: jest.fn().mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
      gain: {
        value: 0.4,
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
        cancelScheduledValues: jest.fn(),
      },
    }),
    createBiquadFilter: jest.fn().mockReturnValue({
      connect: jest.fn(),
      disconnect: jest.fn(),
      type: "lowpass",
      frequency: {
        value: 1000,
        setValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
        cancelScheduledValues: jest.fn(),
      },
    }),
  })),
  GainNode: jest.fn(),
  OscillatorNode: jest.fn(),
}));

jest.mock("react-native-toast-message", () => {
  return {
    __esModule: true,
    default: { show: jest.fn() },
  };
});

jest.mock("expo-router", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  const Stack = ({ children }: { children: React.ReactNode }) => (
    <View testID="stack">{children}</View>
  );
  Stack.Screen = ({ options }: { options?: any }) => {
    // Render headerLeft and headerRight so we can test their contents
    const HeaderLeft = options?.headerLeft;
    const HeaderRight = options?.headerRight;
    return (
      <View testID="stack-screen">
        {HeaderLeft && (
          <View testID="header-left">
            <HeaderLeft />
          </View>
        )}
        {HeaderRight && (
          <View testID="header-right">
            <HeaderRight />
          </View>
        )}
      </View>
    );
  };
  return { Stack };
});

jest.mock("expo-file-system", () => ({
  documentDirectory: "/mock/documents/",
  writeAsStringAsync: jest.fn(),
  EncodingType: { Base64: "base64" },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

describe("Index (Home Screen)", () => {
  it("renders without crashing", () => {
    render(<Index />);
  });

  it("renders the keyboard component", () => {
    const { toJSON } = render(<Index />);
    expect(toJSON()).toBeTruthy();
  });

  it("renders header controls (zoom, octave, record)", () => {
    render(<Index />);
    // Zoom controls should show "ZOOM"
    expect(screen.getByText("ZOOM")).toBeTruthy();
    // Octave controls should show "OCTAVE"
    expect(screen.getByText("OCTAVE")).toBeTruthy();
    // Record controls should show "RECORD"
    expect(screen.getByText("RECORD")).toBeTruthy();
  });

  it("starts with IDLE recording status", () => {
    render(<Index />);
    expect(screen.getByText("IDLE")).toBeTruthy();
  });

  it("starts with zoom level 1", () => {
    render(<Index />);
    // The zoom value "1" should be displayed
    const zoomTexts = screen.getAllByText("1");
    expect(zoomTexts.length).toBeGreaterThan(0);
  });

  it("starts with octave 4", () => {
    render(<Index />);
    expect(screen.getByText("4")).toBeTruthy();
  });
});
