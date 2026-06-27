# Live Quiz Process Plan

## Overview

A live quiz is a real-time quiz session where an instructor starts a quiz and students join using a code. Questions are revealed one at a time, and progress is tracked live.

---

## Flow

### 1. Instructor Starts a Live Session

- **From QuizPage**: "Start Live" button on published quizzes with type `LIVE`
- Creates a `LiveSession` record with a unique session code
- Generates a session-specific join code
- Session status: `ACTIVE`

### 2. Students Join

- Student navigates to a "Join Live" page
- Enters the session code displayed by the instructor
- Joins the session — added to the session's participant list
- Waits for the instructor to start

### 3. Instructor Controls the Session

- **Start**: Begins the quiz for all joined students
- **Next Question**: Reveals the next question one at a time
- **Show Results**: Displays correct answer and stats only at the end of the quiz
- **End Session**: Closes the session, shows final results

### 4. Student Experience

- Sees the current question (only one at a time)
- Submits answer within a time limit
- Sees result (correct/incorrect) after instructor reveals
- Final score at the end

### 5. Data Model

```
LiveSession
  id, quizId, code (join code), isActive, startedAt, endedAt

LiveParticipant
  id, sessionId, userId, joinedAt, score

LiveQuestion
  id, sessionId, questionId, order, startedAt, revealedAt
```

---

## Pages Needed

| Page                      | Route                                  | Description                                                |
| ------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| Instructor Live Dashboard | `/instructor/quizzes/live/[sessionId]` | Controls the session, view participants, advance questions |
| Student Join Live         | `/quizzes/live/join`                   | Enter session code to join                                 |
| Student Live Quiz         | `/quizzes/live/[sessionId]`            | Answer questions in real-time                              |

---

## Your Additional Instructions

<!-- Add your notes, requirements, or changes below this line -->
