import { StyleSheet } from "react-native";
import { colors, radii } from "./theme";

const whiteKeyStyle = StyleSheet.create({
    key: {
        flex: 1,
        height: '100%',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderBottomLeftRadius: radii.key,
        borderBottomRightRadius: radii.key,
        overflow: 'hidden',
        // Key depth shadow
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    keyPressed: {
        backgroundColor: '#f0f0f0',
        transform: [{ translateY: 2 }],
        shadowOpacity: 0.05,
        elevation: 1,
    },
    topHighlight: {
        height: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    inner: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 20,
    },
    label: {
        fontSize: 10,
        color: colors.mutedText,
        fontWeight: 'bold',
    },
    bottomLip: {
        height: 8,
        backgroundColor: colors.buttonBg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        borderBottomLeftRadius: radii.key,
        borderBottomRightRadius: radii.key,
    },
    bottomLipPressed: {
        height: 4,
        backgroundColor: colors.border,
    },
});

export default whiteKeyStyle;