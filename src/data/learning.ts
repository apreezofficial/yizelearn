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
