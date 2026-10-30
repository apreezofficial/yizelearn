import {API_BASE_URL, request} from './client';
import type {AssignmentSubmission, Course, DashboardSummary, Lesson, Module, Paginated, Payment, User} from './types';

// Sign-in and sign-up are one flow: the user enters an email, gets a 6-digit code, and enters it. No passwords.
// Until the backend is live (the base URL is still the placeholder), dev builds sign in without it:
// any email "sends" a code and any 6 digits log you in.
const MOCK_AUTH = __DEV__ && API_BASE_URL.includes('example.com');
const mockUser = (email: string, name?: string): User => ({id: 'mock-user', name: name || email.split('@')[0], email, role: 'student'});

export const authApi = {
  requestCode: (email: string, name?: string) => (MOCK_AUTH ? Promise.resolve() : request<void>('/auth/code/request', {method: 'POST', body: {email, name}})),
  verifyCode: (email: string, code: string) => (MOCK_AUTH
    ? Promise.resolve({token: 'mock-token', user: mockUser(email)})
    : request<{token: string; user: User}>('/auth/code/verify', {method: 'POST', body: {email, code}})),
  me: () => request<User>('/auth/me'),
  logout: () => request<void>('/auth/logout', {method: 'POST'}),
};

export const dashboardApi = { instructor: () => request<DashboardSummary>('/instructor/dashboard'), administrator: () => request<DashboardSummary>('/administrator/dashboard') };

export const coursesApi = {
  list: (params?: {status?: string; page?: number}) => request<Paginated<Course>>(`/courses${params?.status ? `?status=${encodeURIComponent(params.status)}` : ''}`),
  get: (id: string) => request<Course>(`/courses/${id}`),
  modules: (id: string) => request<Module[]>(`/courses/${id}/modules`),
  create: (payload: Pick<Course, 'title'> & Partial<Course>) => request<Course>('/courses', {method: 'POST', body: payload}),
  update: (id: string, payload: Partial<Course>) => request<Course>(`/courses/${id}`, {method: 'PATCH', body: payload}),
};

export const learningApi = { myCourses: () => request<Paginated<Course>>('/me/courses'), lesson: (courseId: string, lessonId: string) => request<Lesson>(`/courses/${courseId}/lessons/${lessonId}`), completeLesson: (courseId: string, lessonId: string) => request<void>(`/courses/${courseId}/lessons/${lessonId}/complete`, {method: 'POST'}) };
export const gradingApi = { queue: () => request<Paginated<AssignmentSubmission>>('/grading/submissions'), get: (id: string) => request<AssignmentSubmission>(`/grading/submissions/${id}`), grade: (id: string, score: number, feedback: string) => request<AssignmentSubmission>(`/grading/submissions/${id}`, {method: 'POST', body: {score, feedback}}) };
export const usersApi = { list: (page = 1) => request<Paginated<User>>(`/users?page=${page}`), get: (id: string) => request<User>(`/users/${id}`), invite: (email: string, role: string) => request<void>('/users/invite', {method: 'POST', body: {email, role}}) };
export const paymentsApi = { list: () => request<Paginated<Payment>>('/payments'), checkout: (courseId: string, method: string) => request<{reference: string}>('/payments/checkout', {method: 'POST', body: {courseId, method}}) };
export const notificationsApi = { list: () => request<Paginated<{id: string; title: string; body: string; read: boolean}>>('/notifications'), markRead: (id: string) => request<void>(`/notifications/${id}/read`, {method: 'POST'}) };

