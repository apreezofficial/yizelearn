import {sampleModules} from './catalog';

// Sample learner data until the learning API is live. Lesson ids match the catalogue's Module 2.
export const learnerName = 'Sunday';

export const continueLearning = {
  title: 'Spreadsheet skills',
  lesson: 'Lookup functions',
  lessonNumber: 3,
  lessonsTotal: 18,
  progress: 64,
};

export type Enrolment = {courseId: string; progress: number; status: 'in-progress' | 'completed'};
export const enrolments: Enrolment[] = [
  {courseId: 'excel', progress: 64, status: 'in-progress'},
  {courseId: 'writing', progress: 25, status: 'in-progress'},
  {courseId: 'python', progress: 92, status: 'in-progress'},
  {courseId: 'design', progress: 10, status: 'in-progress'},
];

export const playingLesson = {
  title: 'Lookup functions',
  moduleTitle: 'Module 2: Formulas',
  lessonNumber: 3,
  lessonsTotal: 6,
  elapsed: '04:12',
  duration: '12:40',
  progress: 33,
  takeaways: ['XLOOKUP searches the first column', 'Use FALSE for an exact match', 'XLOOKUP can search any column'],
};

export const moduleTwo = sampleModules[1];
// Lessons before the playing one are finished; the lesson after it is next.
export const doneLessonIds = ['l4', 'l5'];
export const currentLessonId = 'l6';

export const quiz = {
  title: 'Module 2 quiz',
  total: 10,
  current: 3,
  answeredCount: 2,
  question: 'Which function looks up a value in the first column of a range?',
  options: ['XLOOKUP', 'VLOOKUP', 'HLOOKUP', 'INDEX'],
};

export const quizResult = {
  score: 80,
  correct: 8,
  total: 10,
  unlocked: 'Module 3',
  missed: [
    {number: 2, topic: 'Text functions'},
    {number: 7, topic: 'Date formats'},
  ],
};

export const assessment = {
  title: 'Build a sales dashboard',
  due: 'Due 21 Oct · 11:59 PM',
  attempts: '1 attempt',
  instructions: 'Use the sample data to build a one-page dashboard with two charts and a short summary.',
  formats: 'XLSX, PDF or CSV · up to 10 MB',
};

export const gradeCourse = 'Data analysis in Excel';
export const gradeOverall = 84;
export const gradeItems: {id: string; title: string; kind: string; score: string}[] = [
  {id: 'm1', title: 'Module 1 quiz', kind: 'Quiz', score: '90%'},
  {id: 'm2', title: 'Module 2 quiz', kind: 'Quiz', score: '80%'},
  {id: 'a1', title: 'Assessment 1', kind: 'Assignment', score: 'Pending'},
  {id: 'm3', title: 'Module 3 quiz', kind: 'Quiz', score: 'Not started'},
];

export const certificate = {title: 'Certificate of completion', course: 'Data analysis in Excel'};
export const badges: {label: string; icon: 'target' | 'calendar' | 'award' | 'medal' | 'edit'; earned: boolean}[] = [
  {label: 'First lesson', icon: 'target', earned: true},
  {label: 'Quiz ace', icon: 'award', earned: false},
  {label: '5-day streak', icon: 'calendar', earned: true},
  {label: 'Finisher', icon: 'award', earned: false},
  {label: 'Top learner', icon: 'medal', earned: false},
  {label: 'Reviewer', icon: 'edit', earned: false},
];

export type Conversation = {id: string; name: string; initials: string; last: string; time: string; unread: boolean};
export const conversations: Conversation[] = [
  {id: 'sn', name: 'Sunday Nwachukwu', initials: 'SN', last: 'Great, good luck!', time: '9:36', unread: true},
  {id: 'tb', name: 'Tunde Bello', initials: 'TB', last: 'Your assignment is graded.', time: '8:12', unread: true},
  {id: 'st', name: 'Support team', initials: 'ST', last: 'Your ticket has been updated.', time: 'Yesterday', unread: false},
  {id: 'mi', name: 'Mercy Ibe', initials: 'MI', last: 'See you in the next lesson.', time: 'Mon', unread: false},
];
export const threads: Record<string, {from: 'them' | 'me'; text: string; time: string}[]> = {
  sn: [
    {from: 'them', text: 'Hi! Did the sample file open correctly?', time: '9:32'},
    {from: 'me', text: 'Yes, I think I will submit my dashboard tonight.', time: '9:35'},
    {from: 'them', text: 'Great, good luck!', time: '9:36'},
  ],
};
