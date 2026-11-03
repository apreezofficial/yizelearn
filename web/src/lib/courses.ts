// Sample catalogue for the website, matching the app's sample courses until the courses API is connected.
export type Goal = 'Get a better job' | 'Work faster' | 'Start something' | 'Look after yourself';
export type Course = {id: string; title: string; instructor: string; rating: number; reviews: number; price: number; was?: number; hours: number; level: string; goal: Goal; topic: string; hue: number; tag?: 'Bestseller' | 'New'};

export const goals: Goal[] = ['Get a better job', 'Work faster', 'Start something', 'Look after yourself'];

export const courses: Course[] = [
  {id: 'excel', title: 'Data analysis in Excel: from formulas to dashboards', instructor: 'Adaeze Okafor', rating: 4.7, reviews: 2184, price: 15000, was: 22000, hours: 6, level: 'Beginner', goal: 'Get a better job', topic: 'Excel', hue: 212, tag: 'Bestseller'},
  {id: 'finance', title: 'Financial modelling made simple', instructor: 'Chidi Eze', rating: 4.5, reviews: 742, price: 15000, hours: 6, level: 'Intermediate', goal: 'Get a better job', topic: 'Finance', hue: 160},
  {id: 'writing', title: 'Business writing that gets replies', instructor: 'Mercy Ibe', rating: 4.8, reviews: 1530, price: 15000, hours: 3, level: 'Beginner', goal: 'Get a better job', topic: 'Writing', hue: 18, tag: 'Bestseller'},
  {id: 'speaking', title: 'Speak up in meetings with confidence', instructor: 'Kemi Adebayo', rating: 4.6, reviews: 388, price: 10000, hours: 2, level: 'Beginner', goal: 'Get a better job', topic: 'Speaking', hue: 280, tag: 'New'},
  {id: 'python', title: 'Intro to Python for everyday tasks', instructor: 'Tunde Bello', rating: 4.6, reviews: 1912, price: 15000, hours: 5, level: 'Beginner', goal: 'Work faster', topic: 'Python', hue: 228, tag: 'Bestseller'},
  {id: 'automation', title: 'Excel automation with macros', instructor: 'Adaeze Okafor', rating: 4.4, reviews: 311, price: 25000, hours: 4, level: 'Advanced', goal: 'Work faster', topic: 'Macros', hue: 196},
  {id: 'sheets', title: 'Google Sheets for teams', instructor: 'Ifeoma Nnaji', rating: 4.5, reviews: 264, price: 10000, hours: 3, level: 'Beginner', goal: 'Work faster', topic: 'Sheets', hue: 140, tag: 'New'},
  {id: 'design', title: 'Design basics for non-designers', instructor: 'Ada Obi', rating: 4.9, reviews: 980, price: 15000, hours: 4, level: 'Beginner', goal: 'Start something', topic: 'Design', hue: 330, tag: 'Bestseller'},
  {id: 'brand', title: 'Build a small brand on social media', instructor: 'Zainab Musa', rating: 4.6, reviews: 512, price: 12000, hours: 3, level: 'Beginner', goal: 'Start something', topic: 'Marketing', hue: 30},
  {id: 'books', title: 'Bookkeeping for small businesses', instructor: 'Chidi Eze', rating: 4.7, reviews: 433, price: 12000, hours: 4, level: 'Beginner', goal: 'Start something', topic: 'Bookkeeping', hue: 48},
  {id: 'wellbeing', title: 'Healthy habits for busy professionals', instructor: 'Ngozi Nwosu', rating: 4.3, reviews: 406, price: 5000, hours: 2, level: 'Beginner', goal: 'Look after yourself', topic: 'Health', hue: 150},
  {id: 'money', title: 'Personal money basics: save, budget, invest', instructor: 'Tolu Ajayi', rating: 4.8, reviews: 1120, price: 8000, hours: 3, level: 'Beginner', goal: 'Look after yourself', topic: 'Money', hue: 42, tag: 'Bestseller'},
];

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

export const paths = [
  {title: 'Data analyst', courses: 5, hours: 28, outcome: 'Turn raw data into decisions', skills: ['Excel', 'SQL basics', 'Dashboards'], from: '#2F6DB5', to: '#74A7E3'},
  {title: 'Finance analyst', courses: 4, hours: 24, outcome: 'Plan, forecast and report', skills: ['Modelling', 'Forecasting', 'Reporting'], from: '#2E8B67', to: '#7CC7A1'},
  {title: 'Automation specialist', courses: 4, hours: 20, outcome: 'Hand the boring work to scripts', skills: ['Python', 'Macros', 'Workflows'], from: '#6E7FE0', to: '#C886E0'},
  {title: 'Small business owner', courses: 3, hours: 12, outcome: 'Run your books and your brand', skills: ['Bookkeeping', 'Design', 'Social'], from: '#E86A4A', to: '#F0B74A'},
];

export const stories = [
  {quote: 'I built my first dashboard in week two and showed it at work. Three months later I was moved to the reporting team.', name: 'Mercy I.', role: 'Reporting analyst, Lagos', course: 'Data analysis in Excel'},
  {quote: 'The lessons are short enough for my bus ride. I finally finished a course instead of just starting one.', name: 'Ibrahim S.', role: 'Customer success, Abuja', course: 'Business writing that gets replies'},
  {quote: 'The Python course paid for itself in a week. A report that took me a day now runs on its own.', name: 'Funmi A.', role: 'Operations lead, Port Harcourt', course: 'Intro to Python for everyday tasks'},
];
