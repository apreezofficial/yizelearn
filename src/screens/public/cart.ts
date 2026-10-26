import type {Course} from '../../api/types';

// Sample promo codes until the payments API validates them.
const promoCodes: Record<string, {percent?: number; amount?: number}> = {WELCOME10: {percent: 10}};

export type PaymentMethod = 'card' | 'transfer';
export type Order = {id: string; date: string; method: string; total: number; courseIds: string[]};

export function normalisePromo(code: string) { return code.trim().toUpperCase(); }
export function isValidPromo(code: string) { return normalisePromo(code) in promoCodes; }

export function cartTotals(items: Course[], promo?: string) {
  const subtotal = items.reduce((sum, c) => sum + (c.price || 0), 0);
  const rule = promo ? promoCodes[normalisePromo(promo)] : undefined;
  const discount = Math.min(subtotal, rule ? (rule.amount || 0) + Math.round((subtotal * (rule.percent || 0)) / 100) : 0);
  return {subtotal, discount, total: subtotal - discount};
}

// Card input helpers. Card details stay on the device until a payment provider is connected.
export const digits = (value: string) => value.replace(/\D/g, '');
export const formatCardNumber = (value: string) => digits(value).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ');
export function formatExpiry(value: string) { const d = digits(value).slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; }

function passesLuhn(number: string) {
  let sum = 0;
  for (let i = 0; i < number.length; i++) { let n = Number(number[number.length - 1 - i]); if (i % 2) { n *= 2; if (n > 9) n -= 9; } sum += n; }
  return sum % 10 === 0;
}

export function cardErrors(card: {number: string; expiry: string; cvv: string}, now = new Date()) {
  const errors: Partial<Record<'number' | 'expiry' | 'cvv', string>> = {};
  const number = digits(card.number);
  if (number.length < 13 || !passesLuhn(number)) errors.number = 'Enter a valid card number';
  const [mm, yy] = card.expiry.split('/').map(Number);
  const expiresAt = new Date(2000 + (yy || 0), mm || 0, 1); // first day of the month after expiry
  if (!mm || mm > 12 || !yy || card.expiry.length !== 5 || expiresAt <= now) errors.expiry = 'Enter a valid expiry date';
  if (!/^\d{3,4}$/.test(card.cvv)) errors.cvv = 'Enter the 3 or 4 digits on the back';
  return errors;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatDate(d: Date) { return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; }

export function createOrder(items: Course[], total: number, method: PaymentMethod, cardNumber: string): Order {
  return {id: String(10000 + Math.floor(Math.random() * 90000)), date: formatDate(new Date()), method: method === 'card' ? `Card ending ${digits(cardNumber).slice(-4)}` : 'Bank transfer', total, courseIds: items.map(c => c.id)};
}
