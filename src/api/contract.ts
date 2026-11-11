// Shapes the yizelearn API sends (see /docs). The screens use the simpler UI types in types.ts; mappers.ts converts.
export type Money = {amountMinor: number; currency: string};
export type ApiUserRef = {id: string; fullName: string; initials: string; avatarUrl: string | null};
export type ApiCategory = {id: string; slug: string; name: string; iconKey: string | null; courseCount: number};
export type ApiLevel = 'beginner' | 'intermediate' | 'advanced';
export type ApiCourseCard = {
  id: string; title: string; subtitle: string | null; instructor: ApiUserRef & {headline?: string | null}; ratingAvg: number | null; ratingCount: number;
  price: Money; listPrice: Money | null; thumbnailUrl: string | null; level: ApiLevel; category: {id: string; slug: string; name: string};
  durationMin: number | null; lessonCount: number; isWishlisted?: boolean; availability?: 'available' | 'unpublished';
};
export type ApiCourseDetail = ApiCourseCard & {about: string | null; learnPoints: string[]; moduleCount: number; language: string; hasCertificate: boolean; inCart: boolean; previewLessonIds: string[]};
export type PageInfo = {nextCursor: string | null; hasMore: boolean; total?: number | null};
export type Page<T> = {data: T[]; page: PageInfo};
export type ApiLesson = {id: string; position: number; title: string; type: 'video' | 'document' | 'quiz' | 'assignment'; durationMin: number | null; questionCount: number | null; isPreview: boolean; locked: boolean; state?: string};
export type ApiModule = {id: string; position: number; title: string; lessonCount: number; lessons: ApiLesson[]};
export type ApiCurriculum = {courseId: string; moduleCount: number; lessonCount: number; durationMin: number; modules: ApiModule[]};
export type ApiReview = {id: string; rating: number; comment: string | null; author: ApiUserRef; createdAt: string; isMine: boolean};
export type ApiReviews = Page<ApiReview> & {summary: {ratingAvg: number | null; ratingCount: number; distribution: Record<string, number>}};
export type ApiAuthUser = {id: string; fullName: string; email: string; role: 'learner' | 'instructor' | 'manager' | 'admin'; avatarUrl: string | null; emailVerified: boolean; landing: string};
export type ApiTokens = {accessToken: string; idToken: string; refreshToken: string; tokenType: 'Bearer'; expiresIn: number; user: ApiAuthUser};
export type ApiAuthResult = {status: 'authenticated'; tokens: ApiTokens} | {status: 'mfa_required'; mfa: {challengeToken: string; method: string; expiresInSeconds: number}};
export type ApiCartLine = {course: ApiCourseCard; price: Money; listPrice: Money | null; addedAt: string; available: boolean};
export type ApiCart = {id: string; items: ApiCartLine[]; savedForLater: ApiCartLine[]; promo: {code: string; percent: number; valid: boolean; discount: Money} | null; subtotal: Money; discount: Money; total: Money; itemCount: number};
export type ApiEnrollment = {id: string; course: ApiCourseCard; status: 'not_started' | 'in_progress' | 'completed'; progressPct: number; completedLessons: number; totalLessons: number; lastLessonId: string | null; availability: 'available' | 'unpublished'};
export type ApiHomeFeed = {greetingName: string; continueLearning: unknown | null; recommended: ApiCourseCard[]; categories: ApiCategory[]; unreadNotifications: number; hasUnread: boolean};
