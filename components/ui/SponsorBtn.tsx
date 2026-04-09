import { colors } from "@/styles/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function SponserBtn() {
  const scale = useSharedValue(10);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) }),
        withTiming(1.3, { duration: 300, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.in(Easing.ease) }),
      ),
      -1, // repeat forever
      false,
    );
  }, []);

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
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
      <Animated.View style={heartStyle}>
        <Ionicons name="heart" size={15} color="#ff0000ff" />
      </Animated.View>
      <Text
        style={{
          color: "#000000ff",
          fontWeight: "bold",
          fontFamily: "Sans Serif",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        Sponsor
      </Text>
    </TouchableOpacity>
  );
}
