import {API_BASE_URL, ApiError, request} from './client';
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
  // School and work SSO: look up the organisation from the email's domain, then sign in through its identity provider.
  ssoLookup: (email: string) => (MOCK_AUTH ? mockOrganisation(email) : request<Organisation>(`/auth/sso/lookup?email=${encodeURIComponent(email)}`)),
  ssoSignIn: (organisationId: string, email: string) => (MOCK_AUTH
    ? new Promise<{token: string; user: User}>(resolve => setTimeout(() => resolve({token: 'mock-token', user: mockUser(email)}), 2400))
    : request<{token: string; user: User}>('/auth/sso/complete', {method: 'POST', body: {organisationId, email}})),
};

export type Organisation = {id: string; name: string; domain: string; kind: 'school' | 'work'; provider: string};

const PUBLIC_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'live.com', 'proton.me', 'aol.com'];
const KNOWN: Record<string, Omit<Organisation, 'domain'>> = {
  'unilag.edu.ng': {id: 'unilag', name: 'University of Lagos', kind: 'school', provider: 'Microsoft'},
  'ui.edu.ng': {id: 'ui', name: 'University of Ibadan', kind: 'school', provider: 'Google Workspace'},
  'covenantuniversity.edu.ng': {id: 'cu', name: 'Covenant University', kind: 'school', provider: 'Microsoft'},
  'andela.com': {id: 'andela', name: 'Andela', kind: 'work', provider: 'Okta'},
};

// Dev stand-in for the lookup: personal email providers have no SSO; any other domain is treated as an organisation.
function mockOrganisation(email: string): Promise<Organisation> {
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return new Promise((resolve, reject) => setTimeout(() => {
    if (PUBLIC_DOMAINS.includes(domain)) { reject(new ApiError(`${domain} is a personal email. Use the email your school or employer gave you.`, 404)); return; }
    const known = KNOWN[domain];
    const school = /\.(edu|ac|sch)(\.|$)/.test(domain);
    const base = domain.split('.')[0];
    resolve(known ? {...known, domain} : {id: base, name: base.charAt(0).toUpperCase() + base.slice(1), domain, kind: school ? 'school' : 'work', provider: 'your organisation'});
  }, 900));
}

// Bug reports from the in-app "Report app issue" sheet. Dev builds without the backend pretend to send.
export type IssueReport = {message: string; screenshot?: string; page: string};
export const supportApi = {
  reportIssue: (report: IssueReport) => (MOCK_AUTH
    ? new Promise<void>(resolve => setTimeout(resolve, 1000))
    : request<void>('/support/issues', {method: 'POST', body: report})),
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

