import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Minimal Piano",
          headerStyle: { backgroundColor: "#ffffff" },
          headerTitleStyle: {
            fontFamily: "StyleScript-Regular",
            fontSize: 20,
            fontWeight: "bold"
          },
          headerTitleAlign: "center"
        }}
      />
    </Stack>
  );
}
