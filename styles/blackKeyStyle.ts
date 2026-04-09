import { StyleSheet } from "react-native";
import { colors, radii } from "./theme";

const blackKeyStyle = StyleSheet.create({
    key: {
        height: '62%',
        backgroundColor: colors.blackKey,
        position: 'absolute',
        zIndex: 1,
        borderBottomLeftRadius: radii.key,
        borderBottomRightRadius: radii.key,
        borderWidth: 1,
        borderColor: colors.blackKeyPressed,
        // Shadow for depth
        shadowColor: colors.shadow,
        shadowOffset: { width: 4, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 8,
    },
    keyPressed: {
        backgroundColor: colors.blackKeyPressed,
        height: '60%',
        transform: [{ translateY: 2 }],
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 3 },
        elevation: 4,
    },
    topSurface: {
        flex: 1,
        backgroundColor: colors.darkSurface,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        paddingHorizontal: 2,
        paddingTop: 2,
    },
    topHighlight: {
        height: 6,
        backgroundColor: colors.blackKeyHighlight,
        borderRadius: 3,
        opacity: 0.5,
    },
    bottomLip: {
        height: 12,
        backgroundColor: colors.blackKeyAccent,
        borderTopWidth: 1,
        borderTopColor: colors.blackKeyBorder,
        borderBottomLeftRadius: radii.key,
        borderBottomRightRadius: radii.key,
    },
    bottomLipPressed: {
        height: 8,
        backgroundColor: colors.blackKey,
    },
});

export default blackKeyStyle;