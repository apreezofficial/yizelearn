export const colors = {
  cotton: '#FBFBF9',
  cream: '#FDF8F1',
  sand: '#F4EFE7',
  sandLine: '#DCD5CA',
  blue50: '#EFF5FC',
  blue100: '#DFEBF9',
  sky: '#74A7E3',
  blue600: '#4F8BCD',
  blue700: '#2F6DB5',
  navy: '#24508F',
  blue900: '#17335A',
  ink: '#242A36',
  muted: '#6F7785',
  line: '#E6E7E5',
  white: '#FFFFFF',
  heroText: '#FBF1E1',
  marigold: '#F0B74A',
  danger: '#C94A4A',
  success: '#2E8B67',
} as const;

// Brand font is Cavolini. Set `family` to 'Cavolini' once the font files are bundled.
export const fonts = {family: undefined as string | undefined} as const;

export const spacing = {screen: 16, card: 12, section: 24, target: 44, button: 52} as const;
