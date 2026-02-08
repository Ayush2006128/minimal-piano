import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Minimal Piano",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontFamily: "StyleScript-Regular",
            fontSize: 20,
            fontWeight: "bold"
          }
        }}
      />
    </Stack>
  );
}
