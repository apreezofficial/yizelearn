export const colors = {
  cotton: '#FBFBF9',
  cream: '#FDF8F1',
  barBg: '#F7F6FA',
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

export const spacing = {screen: 20, card: 16, gap: 14, section: 28, target: 48, button: 56} as const;

// Type scale sized for phones held at arm's length; nothing smaller than 13 except tab labels.
export const type = {display: 32, title: 26, heading: 20, subheading: 18, body: 16, label: 15, small: 14, caption: 13, tab: 12} as const;

export const radius = {card: 16, field: 14, pill: 999, button: 14} as const;

// Motion shared with the launch intro, so every screen moves the same way.
export const motion = {
  outExpo: [0.16, 1, 0.3, 1] as const, // entrances
  inOut: [0.65, 0, 0.2, 1] as const, // exits and large moves
  fast: 220,
  base: 420,
  slow: 700,
};
