import React from 'react';
import {HugeiconsIcon} from '@hugeicons/react-native';
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowUp01Icon from '@hugeicons/core-free-icons/ArrowUp01Icon';
import ArrowUpDownIcon from '@hugeicons/core-free-icons/ArrowUpDownIcon';
import BankIcon from '@hugeicons/core-free-icons/BankIcon';
import BookOpen01Icon from '@hugeicons/core-free-icons/BookOpen01Icon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import Certificate01Icon from '@hugeicons/core-free-icons/Certificate01Icon';
import CreditCardIcon from '@hugeicons/core-free-icons/CreditCardIcon';
import FavouriteIcon from '@hugeicons/core-free-icons/FavouriteIcon';
import AppleIcon from '@hugeicons/core-free-icons/AppleIcon';
import Award01Icon from '@hugeicons/core-free-icons/Award01Icon';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import Attachment01Icon from '@hugeicons/core-free-icons/Attachment01Icon';
import Calendar01Icon from '@hugeicons/core-free-icons/Calendar01Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon';
import Edit02Icon from '@hugeicons/core-free-icons/Edit02Icon';
import Logout01Icon from '@hugeicons/core-free-icons/Logout01Icon';
import Mail01Icon from '@hugeicons/core-free-icons/Mail01Icon';
import Medal01Icon from '@hugeicons/core-free-icons/Medal01Icon';
import Notification01Icon from '@hugeicons/core-free-icons/Notification01Icon';
import Settings01Icon from '@hugeicons/core-free-icons/Settings01Icon';
import SentIcon from '@hugeicons/core-free-icons/SentIcon';
import Share01Icon from '@hugeicons/core-free-icons/Share01Icon';
import Target01Icon from '@hugeicons/core-free-icons/Target01Icon';
import Upload01Icon from '@hugeicons/core-free-icons/Upload01Icon';
import FilterHorizontalIcon from '@hugeicons/core-free-icons/FilterHorizontalIcon';
import GoogleIcon from '@hugeicons/core-free-icons/GoogleIcon';
import Home01Icon from '@hugeicons/core-free-icons/Home01Icon';
import Infinity01Icon from '@hugeicons/core-free-icons/Infinity01Icon';
import Message01Icon from '@hugeicons/core-free-icons/Message01Icon';
import PlayIcon from '@hugeicons/core-free-icons/PlayIcon';
import Search01Icon from '@hugeicons/core-free-icons/Search01Icon';
import MoreHorizontalIcon from '@hugeicons/core-free-icons/MoreHorizontalIcon';
import CheckmarkBadge01Icon from '@hugeicons/core-free-icons/CheckmarkBadge01Icon';
import ShoppingCart01Icon from '@hugeicons/core-free-icons/ShoppingCart01Icon';
import SquareLock02Icon from '@hugeicons/core-free-icons/SquareLock02Icon';
import StarIcon from '@hugeicons/core-free-icons/StarIcon';
import Tick02Icon from '@hugeicons/core-free-icons/Tick02Icon';
import UserIcon from '@hugeicons/core-free-icons/UserIcon';
import {colors} from '../theme/tokens';

// App icon names mapped to Hugeicons. `filled` renders the same outline icon with a solid fill.
const icons = {
  search: {icon: Search01Icon},
  more: {icon: MoreHorizontalIcon},
  verified: {icon: CheckmarkBadge01Icon},
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
  google: {icon: GoogleIcon},
  apple: {icon: AppleIcon},
  bell: {icon: Notification01Icon},
  upload: {icon: Upload01Icon},
  send: {icon: SentIcon},
  share: {icon: Share01Icon},
  download: {icon: Download01Icon},
  award: {icon: Award01Icon},
  medal: {icon: Medal01Icon},
  target: {icon: Target01Icon},
  calendar: {icon: Calendar01Icon},
  edit: {icon: Edit02Icon},
  clock: {icon: Clock01Icon},
  attach: {icon: Attachment01Icon},
  mail: {icon: Mail01Icon},
  settings: {icon: Settings01Icon},
  logout: {icon: Logout01Icon},
  next: {icon: ArrowRight01Icon},
} as const;

export type IconName = keyof typeof icons;

export function Icon({name, size = 24, color = colors.ink, strokeWidth = 1.8}: {name: IconName; size?: number; color?: string; strokeWidth?: number}) {
  const {icon, filled} = icons[name] as {icon: typeof StarIcon; filled?: boolean};
  return <HugeiconsIcon icon={icon} size={size} color={color} strokeWidth={strokeWidth} fill={filled ? color : 'none'} />;
}
