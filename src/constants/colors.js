export const palette = {
  // Warm Neutral Palette
  warm50: '#faf6f3',
  warm100: '#f3e8e1',
  warm200: '#e5d1c3',
  warm300: '#d4b4a0',
  warm400: '#be9177',
  warm500: '#a36d52',
  warm600: '#8c533e', // Primary Light
  warm700: '#703e2c', // Primary Dark
  warm800: '#542d20',
  warm900: '#381e15',
  warm950: '#1e0f0a', // Dark Background

  // Slate Neutral Palette
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  slate950: '#0b0f19',

  // Status & Priority Accents
  emerald50: '#ecfdf5',
  emerald100: '#d1fae5',
  emerald500: '#10b981',
  emerald600: '#059669',
  emerald700: '#047857',

  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber500: '#f59e0b',
  amber600: '#d97706',

  rose50: '#fff1f2',
  rose100: '#ffe4e6',
  rose500: '#f43f5e',
  rose600: '#e11d48',

  purple500: '#8b5cf6',
};

// Light Mode Theme Colors
export const lightColors = {
  background: '#fcf8f5',
  cardBackground: '#ffffff',
  surface: '#f3e7df',
  border: '#e4d2c4',
  textPrimary: '#2b1a13',
  textSecondary: '#664e43',
  textMuted: '#998175',
  primary: palette.warm600,
  primaryLight: '#f4e9e2',
  primaryDark: palette.warm700,
  accent: palette.warm500,
  
  statusPending: palette.amber600,
  statusPendingBg: palette.amber50,
  statusCompleted: palette.emerald600,
  statusCompletedBg: palette.emerald50,

  priorityLow: palette.slate600,
  priorityLowBg: palette.slate100,
  priorityMedium: palette.warm600,
  priorityMediumBg: '#f4e9e2',
  priorityHigh: palette.rose600,
  priorityHighBg: palette.rose50,

  danger: palette.rose600,
  dangerBg: palette.rose50,
  warning: palette.amber600,
  warningBg: palette.amber50,
  success: palette.emerald600,
  successBg: palette.emerald50,

  shadow: 'rgba(43, 26, 19, 0.08)',
};

// Dark Mode Theme Colors
export const darkColors = {
  background: '#160d09',
  cardBackground: '#221510',
  surface: '#301e17',
  border: '#442d23',
  textPrimary: '#f7eee8',
  textSecondary: '#cbb6ab',
  textMuted: '#9c867b',
  primary: '#d4987a',
  primaryLight: 'rgba(212, 152, 122, 0.2)',
  primaryDark: palette.warm600,
  accent: palette.warm400,

  statusPending: palette.amber500,
  statusPendingBg: 'rgba(245, 158, 11, 0.18)',
  statusCompleted: palette.emerald500,
  statusCompletedBg: 'rgba(16, 185, 129, 0.18)',

  priorityLow: palette.slate300,
  priorityLowBg: palette.slate800,
  priorityMedium: '#d4987a',
  priorityMediumBg: 'rgba(212, 152, 122, 0.2)',
  priorityHigh: palette.rose500,
  priorityHighBg: 'rgba(244, 63, 94, 0.2)',

  danger: palette.rose500,
  dangerBg: 'rgba(244, 63, 94, 0.18)',
  warning: palette.amber500,
  warningBg: 'rgba(245, 158, 11, 0.18)',
  success: palette.emerald500,
  successBg: 'rgba(16, 185, 129, 0.18)',

  shadow: 'rgba(0, 0, 0, 0.5)',
};
