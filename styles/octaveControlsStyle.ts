import { StyleSheet } from "react-native";

const octaveControlsStyle = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    tactileButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    buttonDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#eee',
        elevation: 0,
        shadowOpacity: 0,
    },
    displayPanel: {
        marginHorizontal: 10,
        alignItems: 'center',
        minWidth: 50,
    },
    labelText: {
        fontSize: 8,
        fontWeight: '800',
        color: '#888',
        letterSpacing: 0.5,
    },
    valueText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#333',
        marginTop: -2,
        fontFamily: 'monospace',
    },
    disabled: {
        opacity: 0.6,
    },
});

export default octaveControlsStyle;