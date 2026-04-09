import { StyleSheet } from "react-native";
import { colors } from "./theme";

const keyboardStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
    },
    topBar: {
        height: 12,
        backgroundColor: colors.darkSurface,
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: colors.shadow,
    },
    topBarHighlight: {
        height: 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        width: "100%",
    },
    feltStrip: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: colors.feltRed, // Firebrick red felt
        zIndex: 15,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.2)",
    },
    keyboard: {
        flexDirection: "row",
        flex: 1,
        width: "100%",
        position: "relative",
        backgroundColor: colors.white,
    },
    lidShadow: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 15,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        zIndex: 10,
    },
});

export default keyboardStyle;