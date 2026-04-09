/**
 * Shared theme constants — single source of truth for repeated values
 * across all style files in the project.
 */

// ─── Colors ────────────────────────────────────────────────────────
export const colors = {
  /** App background, sponsor button bg */
  background: '#e0e0e0',

  /** White key, keyboard bg */
  white: '#fff',

  /** Tactile button bg, white key bottom lip, disabled border */
  buttonBg: '#eee',

  /** Disabled button / pressed white key bg */
  disabledBg: '#f5f5f5',

  /** Border color for buttons, white keys */
  border: '#ddd',

  /** Shadow color (universal) */
  shadow: '#000',

  /** Dark surface — keyboard top bar, black key top surface */
  darkSurface: '#222',

  /** Label text color */
  labelText: '#888',

  /** Value / body text color */
  valueText: '#333',

  /** Muted label (white key note name) */
  mutedText: '#aaa',

  /** Disabled icon color */
  disabledIcon: '#bbb',

  /** Active icon color */
  activeIcon: '#444',

  /** Record red — record dot, active record button, recording label */
  recordRed: '#ff4444',

  /** Record red dark — active record button border */
  recordRedDark: '#cc0000',

  /** Black key body */
  blackKey: '#111',

  /** Black key pressed */
  blackKeyPressed: '#000',

  /** Black key accent */
  blackKeyAccent: '#1a1a1a',

  /** Black key highlight */
  blackKeyHighlight: '#444',

  /** Black key inner border */
  blackKeyBorder: '#333',

  /** Felt strip red */
  feltRed: '#b22222',
} as const;

// ─── Spacing ───────────────────────────────────────────────────────
export const spacing = {
  /** Default gap between header items */
  headerGap: 10,

  /** Padding around control groups */
  controlPadding: 10,

  /** Tight padding for record controls */
  controlPaddingTight: 6,
} as const;

// ─── Radii ─────────────────────────────────────────────────────────
export const radii = {
  /** Tactile button corner radius */
  button: 8,

  /** Key bottom corners */
  key: 6,

  /** Small radius (sponsor btn, etc.) */
  small: 5,
} as const;

// ─── Typography ────────────────────────────────────────────────────
export const typography = {
  labelWeight: '800' as const,
  valueWeight: '900' as const,
  labelLetterSpacing: 0.5,
} as const;

// ─── Shadows (reusable preset for tactile buttons) ─────────────────
export const buttonShadow = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
} as const;

// ─── Disabled state (reusable preset) ──────────────────────────────
export const disabledState = {
  backgroundColor: colors.disabledBg,
  borderColor: colors.buttonBg,
  elevation: 0,
  shadowOpacity: 0,
} as const;
