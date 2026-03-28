import { StyleSheet } from 'react-native';

const recordControlsStyle = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tactileButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginHorizontal: 2,
  },
  recordButton: {
    backgroundColor: '#eee',
  },
  recordButtonActive: {
    backgroundColor: '#ff4444',
    borderColor: '#cc0000',
  },
  buttonDisabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#eee',
    elevation: 0,
    shadowOpacity: 0,
    opacity: 0.5,
  },
  displayPanel: {
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 44,
  },
  labelText: {
    fontSize: 7,
    fontWeight: '800',
    color: '#888',
    letterSpacing: 0.5,
  },
  valueText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#333',
    marginTop: -1,
  },
  recordingLabel: {
    color: '#ff4444',
  },
  recordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4444',
  },
  stopSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: '#fff',
  },
});

export default recordControlsStyle;
