// Sample catalogue for the website until the courses API is connected. The categories and their topics are
// the real ones; the individual courses, instructors, prices and ratings are placeholders.
export type Category = 'Programming' | 'AI' | 'Digital marketing' | 'Database' | 'IT tech skills';
export type Course = {id: string; title: string; instructor: string; rating: number; reviews: number; price: number; was?: number; hours: number; level: string; category: Category; topic: string; tone: 0 | 1 | 2 | 3 | 4; tag?: 'Bestseller' | 'New'};

export const categories: {name: Category; topics: string[]}[] = [
  {name: 'Programming', topics: ['Intro to programming', 'Python', 'TypeScript', 'Go', 'React', 'React Native', 'Swift']},
  {name: 'AI', topics: ['Intro to AI & ML', 'Computer vision', 'Robotics', 'ML', 'AI agents', 'Agentic AI']},
  {name: 'Digital marketing', topics: ['Intro to digital marketing', 'YouTube', 'SEO', 'Instagram', 'Facebook', 'TikTok', 'Snap', 'LinkedIn', 'X', 'WhatsApp']},
  {name: 'Database', topics: ['Intro to database', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB']},
  {name: 'IT tech skills', topics: ['Data annotator', 'AI promoter', 'Data clerk', 'Computer technician', 'Network technician', 'System support clerk', 'Office suite clerk']},
];
export const categoryNames = categories.map(c => c.name);

export const courses: Course[] = [
  {id: 'intro-prog', title: 'Intro to programming: think like a developer', instructor: 'Tunde Bello', rating: 4.7, reviews: 2640, price: 10000, was: 15000, hours: 5, level: 'Beginner', category: 'Programming', topic: 'Intro to programming', tone: 0, tag: 'Bestseller'},
  {id: 'python', title: 'Python programming: from first line to real projects', instructor: 'Tunde Bello', rating: 4.6, reviews: 1912, price: 15000, hours: 8, level: 'Beginner', category: 'Programming', topic: 'Python', tone: 3, tag: 'Bestseller'},
  {id: 'typescript', title: 'TypeScript for confident JavaScript developers', instructor: 'Chidi Eze', rating: 4.5, reviews: 742, price: 15000, hours: 6, level: 'Intermediate', category: 'Programming', topic: 'TypeScript', tone: 2},
  {id: 'react', title: 'React: build fast, modern web apps', instructor: 'Ada Obi', rating: 4.8, reviews: 1530, price: 20000, hours: 9, level: 'Intermediate', category: 'Programming', topic: 'React', tone: 1, tag: 'New'},
  {id: 'intro-ai', title: 'Intro to AI & ML in plain language', instructor: 'Kemi Adebayo', rating: 4.8, reviews: 1380, price: 12000, hours: 4, level: 'Beginner', category: 'AI', topic: 'Intro to AI & ML', tone: 4, tag: 'Bestseller'},
  {id: 'agents', title: 'Build your first AI agent', instructor: 'Tolu Ajayi', rating: 4.6, reviews: 388, price: 25000, hours: 6, level: 'Intermediate', category: 'AI', topic: 'AI agents', tone: 0, tag: 'New'},
  {id: 'vision', title: 'Computer vision: teach a computer to see', instructor: 'Ngozi Nwosu', rating: 4.4, reviews: 311, price: 25000, hours: 7, level: 'Advanced', category: 'AI', topic: 'Computer vision', tone: 2},
  {id: 'intro-marketing', title: 'Intro to digital marketing', instructor: 'Zainab Musa', rating: 4.7, reviews: 2184, price: 10000, was: 15000, hours: 4, level: 'Beginner', category: 'Digital marketing', topic: 'Intro to digital marketing', tone: 4, tag: 'Bestseller'},
  {id: 'seo', title: 'SEO: get found on Google', instructor: 'Mercy Ibe', rating: 4.5, reviews: 764, price: 12000, hours: 4, level: 'Beginner', category: 'Digital marketing', topic: 'SEO', tone: 3},
  {id: 'tiktok', title: 'TikTok for brands and creators', instructor: 'Zainab Musa', rating: 4.6, reviews: 512, price: 8000, hours: 3, level: 'Beginner', category: 'Digital marketing', topic: 'TikTok', tone: 1, tag: 'New'},
  {id: 'intro-db', title: 'Intro to databases', instructor: 'Chidi Eze', rating: 4.7, reviews: 933, price: 10000, hours: 4, level: 'Beginner', category: 'Database', topic: 'Intro to database', tone: 0},
  {id: 'sql', title: 'SQL: ask your data better questions', instructor: 'Adaeze Okafor', rating: 4.8, reviews: 2020, price: 15000, hours: 6, level: 'Beginner', category: 'Database', topic: 'SQL', tone: 2, tag: 'Bestseller'},
  {id: 'postgres', title: 'PostgreSQL in practice', instructor: 'Adaeze Okafor', rating: 4.5, reviews: 264, price: 18000, hours: 5, level: 'Intermediate', category: 'Database', topic: 'PostgreSQL', tone: 4},
  {id: 'annotator', title: 'Become a data annotator', instructor: 'Ifeoma Nnaji', rating: 4.4, reviews: 406, price: 5000, hours: 2, level: 'Beginner', category: 'IT tech skills', topic: 'Data annotator', tone: 3, tag: 'New'},
  {id: 'technician', title: 'Computer technician: diagnose and repair', instructor: 'Ibrahim Sule', rating: 4.6, reviews: 698, price: 12000, hours: 6, level: 'Beginner', category: 'IT tech skills', topic: 'Computer technician', tone: 1},
  {id: 'office', title: 'Office suite clerk: Word, Excel and more', instructor: 'Kemi Adebayo', rating: 4.7, reviews: 1120, price: 8000, hours: 4, level: 'Beginner', category: 'IT tech skills', topic: 'Office suite clerk', tone: 4, tag: 'Bestseller'},
];

// Prices are in naira here (the base) and converted for display with useMoney() in lib/prefs.ts.

// Path cards use brand gradients; `light` ones are pale enough to need navy text.
export const paths: {title: string; courses: number; hours: number; outcome: string; skills: string[]; from: string; to: string; light?: boolean}[] = [
  {title: 'Web developer', courses: 5, hours: 30, outcome: 'Build and ship real web apps', skills: ['TypeScript', 'React', 'PostgreSQL'], from: '#2F6DB5', to: '#74A7E3'},
  {title: 'AI builder', courses: 4, hours: 24, outcome: 'Put AI to work in products', skills: ['ML', 'AI agents', 'Python'], from: '#17335A', to: '#2F6DB5'},
  {title: 'Digital marketer', courses: 4, hours: 18, outcome: 'Grow an audience and sell', skills: ['SEO', 'Instagram', 'TikTok'], from: '#24508F', to: '#9CC6E0'},
  {title: 'IT support specialist', courses: 3, hours: 14, outcome: 'Keep people and systems running', skills: ['Computer repair', 'Networks', 'Office suite'], from: '#F0B74A', to: '#F5EFA8', light: true},
];

export const stories = [
  {quote: 'I wrote my first SQL query in week two and used it at work. Three months later I was moved to the reporting team.', name: 'Mercy I.', role: 'Reporting analyst, Lagos', course: 'SQL: ask your data better questions'},
  {quote: 'The lessons are short enough for my bus ride. I finally finished a course instead of just starting one.', name: 'Ibrahim S.', role: 'Customer success, Abuja', course: 'Intro to digital marketing'},
  {quote: 'The Python course paid for itself in a week. A report that took me a day now runs on its own.', name: 'Funmi A.', role: 'Operations lead, Port Harcourt', course: 'Python programming: from first line to real projects'},
];
