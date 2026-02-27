# Minimal Piano 🎹

A beautiful, responsive, and minimalistic piano application built with React Native and Expo.

## Features

- **Playable Keyboard:** A full suite of playable piano keys with low-latency audio playback powered by `react-native-audio-api`.
- **Zoom Controls:** Zoom in and out of the keyboard to play comfortably on screens of any size.
- **Octave Shifting:** Shift the base octave up or down to access the full range of a standard piano.
- **Cross-Platform:** Works on Android, iOS, and the Web.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```

3. **Run on a device or emulator:**
   - Press `a` in the terminal to open on an Android emulator/device.
   - Press `i` to open on an iOS simulator.
   - Press `w` to open in your web browser.

## Scripts

- `npm start`: Starts the Expo development server.
- `npm run android`: Starts the Expo development server and opens the app on a connected Android device or emulator.
- `npm run ios`: Starts the Expo development server and opens the app on a connected iOS simulator.
- `npm run web`: Starts the Expo development server and opens the app in a web browser.
- `npm run lint`: Runs ESLint to find and fix problems in your code.

## Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Audio API](https://github.com/react-native-audio-api/react-native-audio-api)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

## License

This project is licensed under the MIT License.