import {GoalCourses} from './Explore';
import {getCatalog} from '@/lib/catalog';

/** The course rail on the home page, fed by the API (sample courses while the API has none). */
export async function HomeCourses() {
  const {courses, categories} = await getCatalog();
  const names = categories.filter(c => courses.some(x => x.category === c.name)).slice(0, 6).map(c => c.name);
  if (!names.length) return null;
  return <GoalCourses courses={courses} categoryNames={names} />;
}
