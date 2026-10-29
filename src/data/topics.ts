// Course catalogue as supplied on 26 Oct 2026. Not wired into the app yet: prices, instructors and
// which topics become full courses still need confirming. Titles are kept as supplied.
export type Topic = {category: string; title: string};

export const topicCategories = ['Programming', 'AI', 'Digital marketing', 'Database', 'IT tech skills'] as const;

export const topics: Topic[] = [
  {category: 'Programming', title: 'Intro to programming'},
  {category: 'Programming', title: 'Python programming (beginner, intermediate, advanced)'},
  {category: 'Programming', title: 'TypeScript'},
  {category: 'Programming', title: 'Go'},
  {category: 'Programming', title: 'React'},
  {category: 'Programming', title: 'React Native'},
  {category: 'Programming', title: 'Swift'},
  {category: 'AI', title: 'Intro to AI & ML'},
  {category: 'AI', title: 'Computer vision'},
  {category: 'AI', title: 'Robotics'},
  {category: 'AI', title: 'ML'},
  {category: 'AI', title: 'AI agents'},
  {category: 'AI', title: 'Agentic AI'},
  {category: 'Digital marketing', title: 'Intro to digital marketing'},
  {category: 'Digital marketing', title: 'YouTube'},
  {category: 'Digital marketing', title: 'SEO'},
  {category: 'Digital marketing', title: 'Instagram'},
  {category: 'Digital marketing', title: 'Facebook'},
  {category: 'Digital marketing', title: 'TikTok'},
  {category: 'Digital marketing', title: 'Snap'},
  {category: 'Digital marketing', title: 'LinkedIn'},
  {category: 'Digital marketing', title: 'X'},
  {category: 'Digital marketing', title: 'WhatsApp'},
  {category: 'Database', title: 'Intro to database'},
  {category: 'Database', title: 'SQL'},
  {category: 'Database', title: 'PostgreSQL'},
  {category: 'Database', title: 'MySQL'},
  {category: 'Database', title: 'MongoDB'},
];

// Career tracks in the IT tech skills category; these are roles, not single courses.
export const careerRoles = [
  'Data annotator',
  'AI promoter',
  'Data clerk',
  'Computer technician',
  'Network technician',
  'System support clerk',
  'Office suite clerk',
];
