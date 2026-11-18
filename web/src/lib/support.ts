/** The yizelearn support mailbox. Every public contact route points here. */
export const SUPPORT_EMAIL = 'support@yizelearn.com';

/** Topics the support form offers. The API's /support/topics list is the source of truth when it is live. */
export const SUPPORT_TOPICS = [
  {value: 'account', label: 'My account'},
  {value: 'payments', label: 'Payments and refunds'},
  {value: 'courses', label: 'Courses and lessons'},
  {value: 'certificates', label: 'Certificates'},
  {value: 'technical', label: 'Technical problem'},
  {value: 'other', label: 'Something else'},
] as const;
