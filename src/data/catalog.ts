import type {Course, CourseLevel, Module} from '../api/types';

// Sample catalogue used until the courses API is live.
export const categories = ['All', 'Business', 'Tech', 'Design', 'Health'] as const;
export const levels: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

const base = {status: 'published' as const};
export const sampleCourses: Course[] = [
  {...base, id: 'excel', title: 'Data analysis in Excel: from formulas to dashboards', instructorName: 'Adaeze Okafor', category: 'Business', level: 'Beginner', rating: 4.7, ratingsCount: 2184, price: 15000, lessonsCount: 24, durationMinutes: 370, summary: 'Practical lessons built around real sales and finance sheets. No prior experience needed.', outcomes: ['Build formulas with confidence', 'Summarise data with pivot tables', 'Look up values across sheets', 'Turn raw data into a dashboard']},
  {...base, id: 'writing', title: 'Business writing that gets replies', instructorName: 'Mercy Ibe', category: 'Business', level: 'Beginner', rating: 4.8, ratingsCount: 1530, price: 15000, lessonsCount: 12, durationMinutes: 180, summary: 'Write emails, proposals and updates that people read and act on.', outcomes: ['Lead with the point', 'Write subject lines that get opened', 'Cut long emails in half', 'Ask for decisions clearly']},
  {...base, id: 'python', title: 'Intro to Python for everyday tasks', instructorName: 'Tunde Bello', category: 'Tech', level: 'Beginner', rating: 4.6, ratingsCount: 1912, price: 15000, lessonsCount: 20, durationMinutes: 300, summary: 'Automate the boring parts of your job with short Python scripts.', outcomes: ['Write and run your first script', 'Rename and sort files automatically', 'Read and clean spreadsheets', 'Schedule scripts to run on their own']},
  {...base, id: 'design', title: 'Design basics for non-designers', instructorName: 'Ada Obi', category: 'Design', level: 'Beginner', rating: 4.9, ratingsCount: 980, price: 15000, lessonsCount: 16, durationMinutes: 210, summary: 'Make slides, posters and social posts that look professional.', outcomes: ['Pick fonts that work together', 'Use colour with intent', 'Lay out a page with a grid', 'Give and take design feedback']},
  {...base, id: 'finance', title: 'Financial modelling made simple', instructorName: 'Chidi Eze', category: 'Business', level: 'Intermediate', rating: 4.5, ratingsCount: 742, price: 15000, lessonsCount: 22, durationMinutes: 340, summary: 'Build a three-statement model step by step in a spreadsheet.', outcomes: ['Link the three statements', 'Forecast revenue and costs', 'Run scenarios', 'Present a model to decision makers']},
  {...base, id: 'automation', title: 'Excel automation with macros', instructorName: 'Adaeze Okafor', category: 'Tech', level: 'Advanced', rating: 4.4, ratingsCount: 311, price: 25000, lessonsCount: 18, durationMinutes: 260, summary: 'Record, write and debug macros that save hours every week.', outcomes: ['Record your first macro', 'Edit VBA safely', 'Loop over sheets and rows', 'Share macro-enabled workbooks']},
  {...base, id: 'wellbeing', title: 'Healthy habits for busy professionals', instructorName: 'Ngozi Nwosu', category: 'Health', level: 'Beginner', rating: 4.3, ratingsCount: 406, price: 5000, lessonsCount: 10, durationMinutes: 120, summary: 'Small daily changes for better sleep, focus and energy.', outcomes: ['Plan a realistic routine', 'Sleep better', 'Take breaks that work', 'Track habits without burnout']},
];

const video = (id: string, title: string, durationMinutes: number, preview = false) => ({id, title, type: 'video' as const, durationMinutes, preview});
const quiz = (id: string, questionsCount: number) => ({id, title: 'Module quiz', type: 'quiz' as const, questionsCount});

export const sampleModules: Module[] = [
  {id: 'm1', title: 'Module 1: Getting started', lessons: [video('l1', 'Welcome to the course', 3, true), video('l2', 'Finding your way around Excel', 8), video('l3', 'Entering and formatting data', 10), quiz('q1', 5)]},
  {id: 'm2', title: 'Module 2: Formulas', lessons: [video('l4', 'Cell references', 8, true), video('l5', 'SUMIF and COUNTIF', 11), video('l6', 'Lookup functions', 9), video('l7', 'Text functions', 7), video('l8', 'Date functions', 8), quiz('q2', 10)]},
  {id: 'm3', title: 'Module 3: Lookups', lessons: [video('l9', 'VLOOKUP in depth', 12), video('l10', 'XLOOKUP', 10), video('l11', 'INDEX and MATCH', 11), quiz('q3', 8)]},
  {id: 'm4', title: 'Module 4: Pivot tables', lessons: [video('l12', 'Your first pivot table', 12), video('l13', 'Grouping and filtering', 10), video('l14', 'Calculated fields', 9), quiz('q4', 8)]},
  {id: 'm5', title: 'Module 5: Charts', lessons: [video('l15', 'Choosing the right chart', 9), video('l16', 'Formatting charts', 8), quiz('q5', 6)]},
  {id: 'm6', title: 'Module 6: Dashboards', lessons: [video('l17', 'Planning a dashboard', 8), video('l18', 'Slicers and timelines', 10), video('l19', 'Final project', 15)]},
];

export type Review = {id: string; name: string; rating: number; when: string; text: string};
export const sampleReviews: Review[] = [
  {id: 'r1', name: 'Mercy Ibe', rating: 5, when: '2 weeks ago', text: 'Clear, practical and straight to the point. I rebuilt our sales report in a day after Module 4.'},
  {id: 'r2', name: 'Tunde Bello', rating: 5, when: '1 month ago', text: 'The exercises use real-looking data, which made everything click. Worth every naira.'},
  {id: 'r3', name: 'Chi Eze', rating: 4, when: '1 month ago', text: 'Great pace for beginners. I would love a few more practice files on pivot tables.'},
  {id: 'r4', name: 'Ada Obi', rating: 5, when: '2 months ago', text: 'My manager noticed the difference in my dashboards within a week.'},
];
// Share of ratings at 5, 4, 3, 2 and 1 stars.
export const ratingBreakdown = [0.74, 0.18, 0.05, 0.02, 0.01];

export function formatNumber(value = 0) { return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
export function formatNaira(amount = 0) { return `₦${formatNumber(amount)}`; }
export function formatDuration(minutes = 0) { const h = Math.floor(minutes / 60); const m = minutes % 60; return h ? `${h}h ${m}m` : `${m} min`; }
