// Course prices are authored in naira (the base). Everything else is converted with these SAMPLE rates until a live
// exchange-rate source is connected, so treat the numbers as approximate.
export type Currency = {code: string; name: string; symbol: string; per: number};

export const currencies: Currency[] = [
  {code: 'USD', name: 'United States Dollar', symbol: '$', per: 0.000645},
  {code: 'EUR', name: 'Euro', symbol: '€', per: 0.0006},
  {code: 'GBP', name: 'British Pound', symbol: '£', per: 0.00051},
  {code: 'NGN', name: 'Nigerian Naira', symbol: '₦', per: 1},
  {code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', per: 0.0097},
  {code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', per: 0.0832},
  {code: 'ZAR', name: 'South African Rand', symbol: 'R', per: 0.0116},
  {code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', per: 0.0318},
  {code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', per: 0.0009},
  {code: 'AUD', name: 'Australian Dollar', symbol: 'A$', per: 0.00098},
  {code: 'AED', name: 'UAE Dirham', symbol: 'AED', per: 0.00237},
  {code: 'INR', name: 'Indian Rupee', symbol: '₹', per: 0.054},
];

export const languages: {code: string; name: string; ready: boolean}[] = [
  {code: 'en', name: 'English', ready: true},
  {code: 'fr', name: 'Français', ready: false},
  {code: 'pt', name: 'Português', ready: false},
  {code: 'es', name: 'Español', ready: false},
  {code: 'ar', name: 'العربية', ready: false},
  {code: 'de', name: 'Deutsch', ready: false},
];

export const DEFAULT_CURRENCY = 'USD';
export const find = (code: string) => currencies.find(c => c.code === code) ?? currencies[0];

/** Converts a naira amount and formats it, e.g. 15000 -> "$9.68". */
export function format(naira: number, code: string): string {
  const c = find(code);
  const v = naira * c.per;
  const digits = c.per < 0.05 ? 2 : 0;
  const n = v.toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits});
  return `${c.symbol}${c.symbol.length > 1 && /^[A-Z]+$/.test(c.symbol) ? ' ' : ''}${n}`;
}
