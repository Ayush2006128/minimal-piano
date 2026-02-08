import TopBar from "@/components/TopBar";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <TopBar />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}
