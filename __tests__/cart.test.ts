import {sampleCourses} from '../src/data/catalog';
import {cardErrors, cartTotals, createOrder, formatCardNumber, formatExpiry, isValidPromo} from '../src/screens/public/cart';

const [excel, writing] = sampleCourses;

test('cart totals add prices and apply promo discounts', () => {
  expect(cartTotals([excel, writing])).toEqual({subtotal: 30000, discount: 0, total: 30000});
  expect(cartTotals([excel, writing], 'welcome10')).toEqual({subtotal: 30000, discount: 3000, total: 27000});
  expect(cartTotals([], 'WELCOME10')).toEqual({subtotal: 0, discount: 0, total: 0});
  expect(isValidPromo(' welcome10 ')).toBe(true);
  expect(isValidPromo('FREE')).toBe(false);
});

test('card inputs are formatted as the user types', () => {
  expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
  expect(formatExpiry('1229')).toBe('12/29');
  expect(formatExpiry('1')).toBe('1');
});

test('card validation checks number, expiry and cvv', () => {
  const now = new Date(2026, 9, 26);
  expect(cardErrors({number: '4242 4242 4242 4242', expiry: '12/29', cvv: '123'}, now)).toEqual({});
  expect(cardErrors({number: '4242 4242 4242 4241', expiry: '09/26', cvv: '12'}, now)).toEqual({number: expect.any(String), expiry: expect.any(String), cvv: expect.any(String)});
  // A card is valid through the last day of its expiry month.
  expect(cardErrors({number: '4242424242424242', expiry: '10/26', cvv: '123'}, now)).toEqual({});
});

test('orders describe the payment method without exposing the card', () => {
  const order = createOrder([excel], 15000, 'card', '4242 4242 4242 4417');
  expect(order.method).toBe('Card ending 4417');
  expect(order.courseIds).toEqual(['excel']);
  expect(createOrder([excel], 15000, 'transfer', '').method).toBe('Bank transfer');
});
