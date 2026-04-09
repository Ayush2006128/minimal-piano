import { colors } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, { useSharedValue } from "react-native-reanimated";

export default function SponserBtn() {
  const size = useSharedValue(10);
  useEffect(() => {
    const interval = setInterval(() => {
      size.value = size.value === 10 ? 15 : 10;
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <Animated.View>
      <TouchableOpacity
        style={{
          backgroundColor: colors.background,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderRadius: 5,
          borderBottomColor: "#ff0000ff",
          borderRightColor: "#fa096eff",
          borderTopColor: "#fe1361ff",
          borderLeftColor: "#fa09c6ff",
          borderWidth: 1,
        }}
        onPress={() => {
          Linking.openURL("https://rzp.io/rzp/qTIlmAj");
        }}
      >
        <Ionicons name="heart" size={size.value} color="#ff0000ff" />
        <Text
          style={{
            color: "#000000ff",
            fontWeight: "bold",
            fontFamily: "Sans Serif",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          Sponser
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
