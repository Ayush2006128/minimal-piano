import { StyleSheet } from "react-native";

const blackKeyStyle = StyleSheet.create({
    key: {
        height: '62%',
        backgroundColor: '#111',
        position: 'absolute',
        zIndex: 1,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderWidth: 1,
        borderColor: '#000',
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 8,
    },
    keyPressed: {
        backgroundColor: '#000',
        height: '60%',
        transform: [{ translateY: 2 }],
        shadowOpacity: 0.3,
        shadowOffset: { width: 2, height: 3 },
        elevation: 4,
    },
    topSurface: {
        flex: 1,
        backgroundColor: '#222',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        paddingHorizontal: 2,
        paddingTop: 2,
    },
    topHighlight: {
        height: 6,
        backgroundColor: '#444',
        borderRadius: 3,
        opacity: 0.5,
    },
    bottomLip: {
        height: 12,
        backgroundColor: '#1a1a1a',
        borderTopWidth: 1,
        borderTopColor: '#333',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    bottomLipPressed: {
        height: 8,
        backgroundColor: '#111',
    },
});

export default blackKeyStyle;