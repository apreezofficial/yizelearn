// Sample catalogue for the website, matching the app's sample courses until the courses API is connected.
export type Goal = 'Get a better job' | 'Work faster' | 'Start something' | 'Look after yourself';
export type Course = {id: string; title: string; instructor: string; rating: number; reviews: number; price: number; was?: number; hours: number; level: string; goal: Goal; topic: string; tone: 0 | 1 | 2 | 3 | 4; tag?: 'Bestseller' | 'New'};

export const goals: Goal[] = ['Get a better job', 'Work faster', 'Start something', 'Look after yourself'];

export const courses: Course[] = [
  {id: 'excel', title: 'Data analysis in Excel: from formulas to dashboards', instructor: 'Adaeze Okafor', rating: 4.7, reviews: 2184, price: 15000, was: 22000, hours: 6, level: 'Beginner', goal: 'Get a better job', topic: 'Excel', tone: 0, tag: 'Bestseller'},
  {id: 'finance', title: 'Financial modelling made simple', instructor: 'Chidi Eze', rating: 4.5, reviews: 742, price: 15000, hours: 6, level: 'Intermediate', goal: 'Get a better job', topic: 'Finance', tone: 2},
  {id: 'writing', title: 'Business writing that gets replies', instructor: 'Mercy Ibe', rating: 4.8, reviews: 1530, price: 15000, hours: 3, level: 'Beginner', goal: 'Get a better job', topic: 'Writing', tone: 4, tag: 'Bestseller'},
  {id: 'speaking', title: 'Speak up in meetings with confidence', instructor: 'Kemi Adebayo', rating: 4.6, reviews: 388, price: 10000, hours: 2, level: 'Beginner', goal: 'Get a better job', topic: 'Speaking', tone: 1, tag: 'New'},
  {id: 'python', title: 'Intro to Python for everyday tasks', instructor: 'Tunde Bello', rating: 4.6, reviews: 1912, price: 15000, hours: 5, level: 'Beginner', goal: 'Work faster', topic: 'Python', tone: 3, tag: 'Bestseller'},
  {id: 'automation', title: 'Excel automation with macros', instructor: 'Adaeze Okafor', rating: 4.4, reviews: 311, price: 25000, hours: 4, level: 'Advanced', goal: 'Work faster', topic: 'Macros', tone: 0},
  {id: 'sheets', title: 'Google Sheets for teams', instructor: 'Ifeoma Nnaji', rating: 4.5, reviews: 264, price: 10000, hours: 3, level: 'Beginner', goal: 'Work faster', topic: 'Sheets', tone: 2, tag: 'New'},
  {id: 'design', title: 'Design basics for non-designers', instructor: 'Ada Obi', rating: 4.9, reviews: 980, price: 15000, hours: 4, level: 'Beginner', goal: 'Start something', topic: 'Design', tone: 1, tag: 'Bestseller'},
  {id: 'brand', title: 'Build a small brand on social media', instructor: 'Zainab Musa', rating: 4.6, reviews: 512, price: 12000, hours: 3, level: 'Beginner', goal: 'Start something', topic: 'Marketing', tone: 4},
  {id: 'books', title: 'Bookkeeping for small businesses', instructor: 'Chidi Eze', rating: 4.7, reviews: 433, price: 12000, hours: 4, level: 'Beginner', goal: 'Start something', topic: 'Bookkeeping', tone: 3},
  {id: 'wellbeing', title: 'Healthy habits for busy professionals', instructor: 'Ngozi Nwosu', rating: 4.3, reviews: 406, price: 5000, hours: 2, level: 'Beginner', goal: 'Look after yourself', topic: 'Health', tone: 2},
  {id: 'money', title: 'Personal money basics: save, budget, invest', instructor: 'Tolu Ajayi', rating: 4.8, reviews: 1120, price: 8000, hours: 3, level: 'Beginner', goal: 'Look after yourself', topic: 'Money', tone: 4, tag: 'Bestseller'},
];

export const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

// Path cards use brand gradients; `light` ones are pale enough to need navy text.
export const paths: {title: string; courses: number; hours: number; outcome: string; skills: string[]; from: string; to: string; light?: boolean}[] = [
  {title: 'Data analyst', courses: 5, hours: 28, outcome: 'Turn raw data into decisions', skills: ['Excel', 'SQL basics', 'Dashboards'], from: '#2F6DB5', to: '#74A7E3'},
  {title: 'Finance analyst', courses: 4, hours: 24, outcome: 'Plan, forecast and report', skills: ['Modelling', 'Forecasting', 'Reporting'], from: '#17335A', to: '#2F6DB5'},
  {title: 'Automation specialist', courses: 4, hours: 20, outcome: 'Hand the boring work to scripts', skills: ['Python', 'Macros', 'Workflows'], from: '#24508F', to: '#9CC6E0'},
  {title: 'Small business owner', courses: 3, hours: 12, outcome: 'Run your books and your brand', skills: ['Bookkeeping', 'Design', 'Social'], from: '#F0B74A', to: '#F5EFA8', light: true},
];

export const stories = [
  {quote: 'I built my first dashboard in week two and showed it at work. Three months later I was moved to the reporting team.', name: 'Mercy I.', role: 'Reporting analyst, Lagos', course: 'Data analysis in Excel'},
  {quote: 'The lessons are short enough for my bus ride. I finally finished a course instead of just starting one.', name: 'Ibrahim S.', role: 'Customer success, Abuja', course: 'Business writing that gets replies'},
  {quote: 'The Python course paid for itself in a week. A report that took me a day now runs on its own.', name: 'Funmi A.', role: 'Operations lead, Port Harcourt', course: 'Intro to Python for everyday tasks'},
];
