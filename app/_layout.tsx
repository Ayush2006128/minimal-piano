import { Stack } from "expo-router";
import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  useEffect(() => {
    async function lockOrientation() {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );
    }
    lockOrientation();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Minimal Piano",
            headerStyle: { backgroundColor: "#ffffff" },
            headerTitleStyle: {
              fontFamily: "StyleScript-Regular",
              fontSize: 20,
              fontWeight: "bold",
            },
            headerTitleAlign: "center",
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
