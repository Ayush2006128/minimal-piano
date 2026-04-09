import { StyleSheet } from 'react-native';
import { buttonShadow, colors, disabledState, radii, typography } from './theme';

const recordControlsStyle = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  tactileButton: {
    width: 34,
    height: 34,
    borderRadius: radii.button,
    backgroundColor: colors.buttonBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...buttonShadow,
    marginHorizontal: 2,
  },
  recordButton: {
    backgroundColor: colors.buttonBg,
  },
  recordButtonActive: {
    backgroundColor: colors.recordRed,
    borderColor: colors.recordRedDark,
  },
  buttonDisabled: {
    ...disabledState,
    opacity: 0.5,
  },
  displayPanel: {
    marginHorizontal: 6,
    alignItems: 'center',
    minWidth: 44,
  },
  labelText: {
    fontSize: 7,
    fontWeight: typography.labelWeight,
    color: colors.labelText,
    letterSpacing: typography.labelLetterSpacing,
  },
  valueText: {
    fontSize: 10,
    fontWeight: typography.valueWeight,
    color: colors.valueText,
    marginTop: -1,
  },
  recordingLabel: {
    color: colors.recordRed,
  },
  recordDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.recordRed,
  },
  stopSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
    backgroundColor: colors.white,
  },
});

export default recordControlsStyle;
