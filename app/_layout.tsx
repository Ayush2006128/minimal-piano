import LogRocket from "@logrocket/react-native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

SplashScreen.setOptions({
  duration: 1000,
  fade: true
});

export default function RootLayout() {
  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE,
      );
    }

    async function hideNavigationBar() {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    }

    hideNavigationBar();
    lockOrientation();
    LogRocket.init("nmwfzu/minimal-piano");
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Minimal Piano",
            headerStyle: { backgroundColor: "#e0e0e0" },
            headerTitleStyle: {
              fontFamily: "StyleScript-Regular",
              fontSize: 20,
              fontWeight: "bold",
            },
            headerTitleAlign: "center",
          }}
        />
      </Stack>
      <StatusBar hidden={true} />
      <Toast />
    </>
  );
}
