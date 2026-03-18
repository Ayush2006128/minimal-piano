import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }

    async function hideNavigationBar() {
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    }

    hideNavigationBar();
    lockOrientation();
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
    </>
  );
}
