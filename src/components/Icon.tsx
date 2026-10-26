import React from 'react';
import {HugeiconsIcon} from '@hugeicons/react-native';
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  BankIcon,
  BookOpen01Icon,
  Cancel01Icon,
  Certificate01Icon,
  CreditCardIcon,
  FavouriteIcon,
  FilterHorizontalIcon,
  Home01Icon,
  Infinity01Icon,
  Message01Icon,
  PlayIcon,
  Search01Icon,
  ShoppingCart01Icon,
  SquareLock02Icon,
  StarIcon,
  Tick02Icon,
  UserIcon,
} from '@hugeicons/core-free-icons';
import {colors} from '../theme/tokens';

// App icon names mapped to Hugeicons. `filled` renders the same outline icon with a solid fill.
const icons = {
  search: {icon: Search01Icon},
  filter: {icon: FilterHorizontalIcon},
  sort: {icon: ArrowUpDownIcon},
  back: {icon: ArrowLeft01Icon},
  down: {icon: ArrowDown01Icon},
  up: {icon: ArrowUp01Icon},
  heart: {icon: FavouriteIcon},
  heartFilled: {icon: FavouriteIcon, filled: true},
  star: {icon: StarIcon},
  starFilled: {icon: StarIcon, filled: true},
  check: {icon: Tick02Icon},
  play: {icon: PlayIcon, filled: true},
  lock: {icon: SquareLock02Icon},
  home: {icon: Home01Icon},
  book: {icon: BookOpen01Icon},
  cart: {icon: ShoppingCart01Icon},
  user: {icon: UserIcon},
  message: {icon: Message01Icon},
  close: {icon: Cancel01Icon},
  certificate: {icon: Certificate01Icon},
  infinity: {icon: Infinity01Icon},
  card: {icon: CreditCardIcon},
  bank: {icon: BankIcon},
} as const;

export type IconName = keyof typeof icons;

export function Icon({name, size = 24, color = colors.ink, strokeWidth = 1.8}: {name: IconName; size?: number; color?: string; strokeWidth?: number}) {
  const {icon, filled} = icons[name] as {icon: typeof StarIcon; filled?: boolean};
  return <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={strokeWidth} fill={filled ? color : 'none'} />;
}
