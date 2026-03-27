import { StyleSheet } from "react-native";

const whiteKeyStyle = StyleSheet.create({
    key: {
        flex: 1,
        height: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        overflow: 'hidden',
        // Key depth shadow
        shadowColor: '#000',
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
        color: '#aaa',
        fontWeight: 'bold',
    },
    bottomLip: {
        height: 8,
        backgroundColor: '#eee',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
    },
    bottomLipPressed: {
        height: 4,
        backgroundColor: '#ddd',
    },
});

export default whiteKeyStyle;