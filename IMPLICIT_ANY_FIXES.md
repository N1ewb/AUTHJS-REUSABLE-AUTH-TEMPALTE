# Implicit Any Type Fixes (for Vercel deployment)

## Problem
Vercel's TypeScript compiler is stricter than local `tsc`. Prisma 7's intersection types cause `.map()` callback parameters to infer as `implicit any` when the callback type compatibility check fails.

## Pattern Used
Add `as unknown as ExplicitType[]` on the **source variable** to tell TypeScript the exact shape, which propagates to `.map()` callbacks and avoids contravariance issues.

## Fixed Files

### actions/client/quiz.action.ts
- `quizzes` (line 108) — `Prisma.quiz.findMany` → `as unknown as Array<{..., type: string, ...}>`
- `liveSession` (line 433) — `findUnique` with nested questions/attempts → full type with `QuestionType` enum
- `questions` (line 543) — `findMany` for session grading → `as unknown as Array<{id, type, points, options, answer}>`
- `attempts` in `getSessionParticipants` (line 763) — `findMany` with user include
- `attempts` in `getQuestionSubmissions` (line 776) — `findMany` with answers nested
- `liveSessions` in `getInstructorSessionHistory` (line 871) — `findMany` with quiz/_count include
- `connections` in `getStudentPublishedQuizzes` (line 939) — `findMany` with nested instructor.quizzes
- `attemptedQuizIds` in `getRecentUnattemptedQuizzes` (line 1046) — `findMany` with select { quizId }
- `$transaction` callback — added `tx: Prisma.TransactionClient` parameter annotation

### actions/client/standardQuiz.action.ts
- `quiz` in `getQuizByCode` (line 12) — `findFirst` with questions include
- `attempt` in `finishStandardAttempt` (line 139) — `findFirst` with answers and questions include
- `attempts` in `getStudentQuizAttempts` (line 235) — `findMany` with answers include
- `quiz` in `getStudentQuizAttempts` (line 251) — `findUnique` with questions select
- `attempt` in `getStudentAttemptDetail` (line 345) — `findFirst` with answers and questions include

### actions/client/dashboard.action.ts
- Callback-typed with `QuizWithSessionAndCount` on Promise.all destructured values

### actions/client/notification.action.ts
- `dbNotifications` (line 22) — `findMany` → `as unknown as Array<{id, title, body, createdAt, read, href}>`
- `connections` (line 128) — `findMany` → `as unknown as Array<{studentId}>`

### actions/client/instructorStudent.action.ts
- `connections` (line 94) — `findMany` with nested instructor.quizzes
- `connections` (line 145) — `findMany` with nested student

## Notes
- Used `QuestionType` and `QuizType` enum types instead of `string` to match downstream types like `SessionData.quiz.questions`
- Fixed `pointsAwarded: number | null` → `pointsAwarded ?? 0` in attempt returns to match `AttemptData` type
- For `$transaction`, used `Prisma.TransactionClient` type annotation on callback parameter
- All nested `.map()` calls (e.g., `c.instructor.quizzes.map((q) => ...)`) inherit types from parent source annotations