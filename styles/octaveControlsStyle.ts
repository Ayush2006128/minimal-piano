import { StyleSheet } from "react-native";
import { buttonShadow, colors, disabledState, radii, spacing, typography } from "./theme";

const octaveControlsStyle = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.controlPadding,
    },
    tactileButton: {
        width: 36,
        height: 36,
        borderRadius: radii.button,
        backgroundColor: colors.buttonBg,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        // Shadow for depth
        ...buttonShadow,
    },
    buttonDisabled: {
        ...disabledState,
    },
    displayPanel: {
        marginHorizontal: spacing.controlPadding,
        alignItems: 'center',
        minWidth: 50,
    },
    labelText: {
        fontSize: 8,
        fontWeight: typography.labelWeight,
        color: colors.labelText,
        letterSpacing: typography.labelLetterSpacing,
    },
    valueText: {
        fontSize: 16,
        fontWeight: typography.valueWeight,
        color: colors.valueText,
        marginTop: -2,
        fontFamily: 'monospace',
    },
    disabled: {
        opacity: 0.6,
    },
});

export default octaveControlsStyle;