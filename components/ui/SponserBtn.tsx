import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Text, TouchableOpacity } from "react-native";

export default function SponserBtn() {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "#e0e0e0",
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
      <Ionicons name="heart" size={10} color="#ff0000ff" />
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
  );
}
