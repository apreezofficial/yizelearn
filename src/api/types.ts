export type Role = 'student' | 'instructor' | 'administrator' | 'manager';

export interface ApiErrorBody { message?: string; code?: string; errors?: Record<string, string[]>; }
export interface User { id: string; name: string; email: string; role: Role; avatarUrl?: string; }
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export interface Course { id: string; title: string; summary?: string; status: 'draft' | 'review' | 'published'; lessonsCount: number; progress?: number; price?: number; instructorName?: string; category?: string; level?: CourseLevel; rating?: number; ratingsCount?: number; durationMinutes?: number; outcomes?: string[]; }
export interface Lesson { id: string; title: string; type: 'video' | 'document' | 'quiz' | 'assignment'; durationMinutes?: number; completed?: boolean; preview?: boolean; questionsCount?: number; }
export interface Module { id: string; title: string; lessons: Lesson[]; }
export interface Paginated<T> { data: T[]; page: number; pageSize: number; total: number; }
export interface DashboardSummary { activeLearners: number; completionRate: number; averageGrade: number; pendingGrades: number; }
export interface AssignmentSubmission { id: string; learnerName: string; title: string; submittedAt: string; status: 'pending' | 'graded' | 'overdue'; score?: number; }
export interface Payment { id: string; learnerName: string; amount: number; status: 'paid' | 'failed' | 'pending'; createdAt: string; }

